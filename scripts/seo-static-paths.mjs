#!/usr/bin/env node
/**
 * Materialize crawlable HTML shells for GitHub Pages so public routes
 * return HTTP 200 (not SPA soft-404s that Ahrefs flags).
 *
 * Copies dist/index.html → dist/<path>/index.html for each indexable route.
 * Also writes dist/404.html (SPA fallback for unknown paths).
 */
import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, "..", "dist");
const indexHtml = join(dist, "index.html");

const PATHS = [
  "pricing",
  "faq",
  "catalog",
  "about",
  "contact",
  "privacy",
  "terms",
  "screenshots",
  "404",
  "app",
  "app/library",
  "app/editor",
  "app/playground",
  "app/compare",
  "app/benchmark",
  "app/history",
];

if (!existsSync(indexHtml)) {
  console.error("seo-static-paths: dist/index.html not found — run vite build first");
  process.exit(1);
}

const html = readFileSync(indexHtml, "utf8");

for (const p of PATHS) {
  const dir = join(dist, p);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html);
  console.log(`  + /${p}/`);
}

// SPA fallback for unknown paths (still a 404 status on pure GH Pages,
// but at least the client can recover). Prefer explicit PATHS above for SEO.
copyFileSync(indexHtml, join(dist, "404.html"));
console.log("  + /404.html");
console.log(`seo-static-paths: wrote ${PATHS.length} route shells + 404.html`);
