// ─────────────────────────────────────────────────────────────
// URL path map — single source of truth for crawlable routes.
// Keeps History API, sitemap, and SEO canonicals in sync.
// ─────────────────────────────────────────────────────────────

import type { DashTab, LandingPage, Route } from "@/lib/store";

/** All public landing pages (standalone routes, trailing-slash URLs). */
export const INDEXABLE_LANDING_PAGES = [
  "what",
  "compiler",
  "playground",
  "editor",
  "why",
  "benchmark",
  "pricing",
  "faq",
  "catalog",
  "about",
  "contact",
  "privacy",
  "terms",
  "learn",
] as const satisfies readonly LandingPage[];

/** Crawlable but noindex (thin/utility pages). */
export const NOINDEX_LANDING_PAGES = ["screenshots", "notfound"] as const satisfies readonly LandingPage[];

export const DASH_TABS: readonly DashTab[] = [
  "library",
  "editor",
  "playground",
  "compare",
  "benchmark",
  "history",
];

const LANDING_PAGE_SET = new Set<string>([
  ...INDEXABLE_LANDING_PAGES,
  ...NOINDEX_LANDING_PAGES,
]);

const DASH_TAB_SET = new Set<string>(DASH_TABS);

export function isLandingPage(value: string): value is LandingPage {
  return value === "home" || LANDING_PAGE_SET.has(value);
}

export function isIndexableLandingPage(page: LandingPage | undefined): boolean {
  if (!page || page === "home") return true;
  return (INDEXABLE_LANDING_PAGES as readonly string[]).includes(page);
}

/** Serialize app route state to a browser pathname (+ optional hash). */
export function routeToPath(route: Route): string {
  if (route.area === "app") {
    const tab = route.tab || "library";
    return tab === "library" ? "/app/" : `/app/${tab}/`;
  }

  const page = route.page ?? "home";
  if (page === "home") {
    return "/";
  }

  if (page === "notfound") {
    return "/404/";
  }

  // Learn hub + article slugs: /learn/ or /learn/<slug>/
  if (page === "learn") {
    if (route.section) {
      return `/learn/${route.section}/`;
    }
    return "/learn/";
  }

  return `/${page}/`;
}

/** Parse location into route state. Unknown paths → notfound. */
export function pathToRoute(pathname: string, _hash = ""): Route {
  const clean = (pathname || "/").replace(/\/+$/, "") || "/";

  if (clean === "/app" || clean.startsWith("/app/")) {
    const rest = clean === "/app" ? "library" : clean.slice("/app/".length).split("/")[0];
    const tab = (DASH_TAB_SET.has(rest) ? rest : "library") as DashTab;
    return { area: "app", tab, page: "home" };
  }

  if (clean === "/" || clean === "") {
    return {
      area: "landing",
      tab: "library",
      page: "home",
    };
  }

  if (clean === "/404") {
    return { area: "landing", tab: "library", page: "notfound" };
  }

  const parts = clean.replace(/^\//, "").split("/").filter(Boolean);
  const slug = parts[0] ?? "";

  if (slug === "learn") {
    return {
      area: "landing",
      tab: "library",
      page: "learn",
      section: parts[1] || undefined,
    };
  }

  if (LANDING_PAGE_SET.has(slug) && parts.length === 1) {
    return { area: "landing", tab: "library", page: slug as LandingPage };
  }

  return { area: "landing", tab: "library", page: "notfound" };
}

/** Absolute URL for a route (canonical). */
export function absoluteUrl(path: string, origin: string): string {
  if (path.startsWith("http")) return path;
  if (path === "/" || path === "") return origin;
  const [pathname] = path.split("#");
  if (!pathname || pathname === "/") return origin;
  return `${origin}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

export function pathForLandingPage(page: LandingPage, section?: string): string {
  if (page === "home") return "/";
  if (page === "notfound") return "/404/";
  if (page === "learn") {
    return section ? `/learn/${section}/` : "/learn/";
  }
  return `/${page}/`;
}

/** Canonical absolute URL (trailing slash for non-root paths). */
export function canonicalUrlForPath(pathname: string, origin: string): string {
  const [raw] = pathname.split("#");
  const path = raw || "/";
  if (path === "/" || path === "") return `${origin}/`;
  const withSlash = path.endsWith("/") ? path : `${path}/`;
  return `${origin}${withSlash.startsWith("/") ? withSlash : `/${withSlash}`}`;
}
