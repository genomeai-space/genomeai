#!/usr/bin/env node
/**
 * Materialize crawlable HTML shells for GitHub Pages so public routes
 * return HTTP 200 (not SPA soft-404s that Ahrefs flags).
 *
 * For each route:
 *  - writes dist/<path>/index.html
 *  - rewrites title, description, robots, canonical, OG/Twitter tags
 *    so crawlers see unique per-page meta without waiting for JS.
 */
import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ALL_SHELL_PATHS, resolveMeta } from "./page-meta.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, "..", "dist");
const indexHtml = join(dist, "index.html");

if (!existsSync(indexHtml)) {
  console.error("seo-static-paths: dist/index.html not found — run vite build first");
  process.exit(1);
}

const baseHtml = readFileSync(indexHtml, "utf8");

/**
 * Escape text for use inside HTML attribute values and tag bodies.
 * @param {string} value
 */
function esc(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * @param {string} html
 * @param {ReturnType<typeof resolveMeta>} meta
 */
function applyPageMeta(html, meta) {
  const title = esc(meta.title);
  const description = esc(meta.description);
  const robots = esc(meta.robots);
  const canonical = esc(meta.canonicalUrl);
  const image = esc(meta.imageUrl);

  let out = html;

  // <title>
  out = out.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`);

  // name= meta (first occurrence of each)
  out = out.replace(
    /(<meta\s+name="description"\s+content=")[^"]*(")/i,
    `$1${description}$2`
  );
  out = out.replace(
    /(<meta\s+name="robots"\s+content=")[^"]*(")/i,
    `$1${robots}$2`
  );
  out = out.replace(
    /(<meta\s+name="googlebot"\s+content=")[^"]*(")/i,
    `$1${robots}$2`
  );

  // canonical
  out = out.replace(
    /(<link\s+rel="canonical"\s+href=")[^"]*(")/i,
    `$1${canonical}$2`
  );

  // Open Graph
  out = out.replace(
    /(<meta\s+property="og:title"\s+content=")[^"]*(")/i,
    `$1${title}$2`
  );
  out = out.replace(
    /(<meta\s+property="og:description"\s+content=")[^"]*(")/i,
    `$1${description}$2`
  );
  out = out.replace(
    /(<meta\s+property="og:url"\s+content=")[^"]*(")/i,
    `$1${canonical}$2`
  );
  out = out.replace(
    /(<meta\s+property="og:image"\s+content=")[^"]*(")/i,
    `$1${image}$2`
  );
  out = out.replace(
    /(<meta\s+property="og:image:secure_url"\s+content=")[^"]*(")/i,
    `$1${image}$2`
  );
  out = out.replace(
    /(<meta\s+property="og:image:alt"\s+content=")[^"]*(")/i,
    `$1${title}$2`
  );

  // Twitter
  out = out.replace(
    /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/i,
    `$1${title}$2`
  );
  out = out.replace(
    /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/i,
    `$1${description}$2`
  );
  out = out.replace(
    /(<meta\s+name="twitter:image"\s+content=")[^"]*(")/i,
    `$1${image}$2`
  );
  out = out.replace(
    /(<meta\s+name="twitter:image:alt"\s+content=")[^"]*(")/i,
    `$1${title}$2`
  );

  // WebPage JSON-LD name/url if present in static graph (best-effort)
  out = out.replace(
    /("(@id|url)":\s*")https:\/\/genomeai\.space\/?(#webpage)?(")/,
    (match, p1, prop, hash, p4) => {
      if (prop === "@id" && hash === "#webpage") {
        return `${p1}${meta.canonicalUrl}#webpage${p4}`;
      }
      if (prop === "url" && !hash) {
        // only rewrite the WebPage url field when we already rewrote @id nearby — skip global site url
        return match;
      }
      return match;
    }
  );

  // Inject a small marker comment for debugging shells
  if (!out.includes("data-seo-shell=")) {
    out = out.replace(
      /<html\s+lang="en"/i,
      `<html lang="en" data-seo-shell="${esc(meta.canonicalUrl)}"`
    );
  }

  // Unique crawlable copy for article shells (visible without JS)
  if (meta.crawlBody) {
    const block = `\n    <main id="seo-static-content" style="max-width:42rem;margin:2rem auto;padding:0 1.25rem;font-family:system-ui,sans-serif;color:#15241c">\n      <h1>${title}</h1>\n      <p>${esc(meta.crawlBody)}</p>\n      <p><a href="/learn/">More guides</a> · <a href="/catalog/">Gene Catalog</a> · <a href="/">Home</a></p>\n    </main>\n    <script>document.getElementById("seo-static-content")?.setAttribute("hidden","");</script>\n`;
    if (out.includes("</noscript>")) {
      out = out.replace("</noscript>", `</noscript>${block}`);
    } else {
      out = out.replace("<body>", `<body>${block}`);
    }
  }

  return out;
}

let written = 0;

for (const p of ALL_SHELL_PATHS) {
  const meta = resolveMeta(p);
  const html = applyPageMeta(baseHtml, meta);
  const dir = join(dist, p);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html);
  console.log(`  + /${p}/  →  ${meta.title.slice(0, 48)}`);
  written += 1;
}

// Root index keeps home meta (already correct). Ensure home canonical uses trailing slash form.
const homeMeta = resolveMeta("home");
const rootHtml = applyPageMeta(baseHtml, {
  ...homeMeta,
  canonicalUrl: "https://genomeai.space/",
});
writeFileSync(indexHtml, rootHtml);
console.log(`  ~ /  →  ${homeMeta.title.slice(0, 48)}`);

// SPA fallback for unknown paths (HTTP 404 status on GH Pages, but client can recover)
const notFoundMeta = resolveMeta("404");
writeFileSync(join(dist, "404.html"), applyPageMeta(baseHtml, notFoundMeta));
console.log(`  + /404.html  →  ${notFoundMeta.title}`);

console.log(`seo-static-paths: wrote ${written} route shells + root + 404.html`);
