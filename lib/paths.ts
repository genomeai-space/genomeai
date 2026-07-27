// ─────────────────────────────────────────────────────────────
// URL path map — single source of truth for crawlable routes.
// Keeps History API, sitemap, and SEO canonicals in sync.
// ─────────────────────────────────────────────────────────────

import type { DashTab, LandingPage, Route } from "@/lib/store";

/** Public landing pages that should return HTTP 200 and appear in the sitemap. */
export const INDEXABLE_LANDING_PAGES = [
  "pricing",
  "faq",
  "catalog",
  "about",
  "contact",
  "privacy",
  "terms",
] as const satisfies readonly LandingPage[];

/** Crawlable but noindex (thin/utility pages). */
export const NOINDEX_LANDING_PAGES = ["screenshots", "notfound"] as const satisfies readonly LandingPage[];

/** Homepage sections (hash targets on `/`, not standalone URLs). */
export const HOME_SECTION_IDS = [
  "what",
  "compiler",
  "playground",
  "editor",
  "why",
  "benchmark",
] as const;

export type HomeSectionId = (typeof HOME_SECTION_IDS)[number];

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

const HOME_SECTION_SET = new Set<string>(HOME_SECTION_IDS);
const DASH_TAB_SET = new Set<string>(DASH_TABS);

export function isLandingPage(value: string): value is LandingPage {
  return (
    value === "home" ||
    LANDING_PAGE_SET.has(value) ||
    HOME_SECTION_SET.has(value)
  );
}

export function isIndexableLandingPage(
  page: LandingPage | undefined
): boolean {
  if (!page || page === "home") return true;
  return (INDEXABLE_LANDING_PAGES as readonly string[]).includes(page);
}

/** Serialize app route state to a browser pathname (+ optional hash). */
export function routeToPath(route: Route): string {
  if (route.area === "app") {
    const tab = route.tab || "library";
    return tab === "library" ? "/app" : `/app/${tab}`;
  }

  const page = route.page ?? "home";
  if (page === "home") {
    if (route.section && HOME_SECTION_SET.has(route.section)) {
      return `/#${route.section}`;
    }
    return "/";
  }

  if (HOME_SECTION_SET.has(page)) {
    return `/#${page}`;
  }

  if (page === "notfound") {
    return "/404";
  }

  return `/${page}`;
}

/** Parse location into route state. Unknown paths → notfound. */
export function pathToRoute(pathname: string, hash = ""): Route {
  const clean = (pathname || "/").replace(/\/+$/, "") || "/";
  const hashId = hash.startsWith("#") ? hash.slice(1) : hash;

  if (clean === "/app" || clean.startsWith("/app/")) {
    const rest = clean === "/app" ? "library" : clean.slice("/app/".length).split("/")[0];
    const tab = (DASH_TAB_SET.has(rest) ? rest : "library") as DashTab;
    return { area: "app", tab, page: "home" };
  }

  if (clean === "/" || clean === "") {
    const section = hashId && HOME_SECTION_SET.has(hashId) ? hashId : undefined;
    return {
      area: "landing",
      tab: "library",
      page: "home",
      section,
    };
  }

  if (clean === "/404") {
    return { area: "landing", tab: "library", page: "notfound" };
  }

  const slug = clean.replace(/^\//, "").split("/")[0];

  if (LANDING_PAGE_SET.has(slug)) {
    return { area: "landing", tab: "library", page: slug as LandingPage };
  }

  // Unknown path → 404 page (keeps SPA from soft-404-ing as home)
  return { area: "landing", tab: "library", page: "notfound" };
}

/** Absolute URL for a route (canonical). */
export function absoluteUrl(path: string, origin: string): string {
  if (path.startsWith("http")) return path;
  if (path === "/" || path === "") return origin;
  // Strip hash for canonical base when needed
  const [pathname] = path.split("#");
  if (!pathname || pathname === "/") return origin;
  return `${origin}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

export function pathForLandingPage(page: LandingPage): string {
  if (page === "home") return "/";
  if ((HOME_SECTION_IDS as readonly string[]).includes(page)) {
    return `/#${page}`;
  }
  if (page === "notfound") return "/404";
  return `/${page}`;
}
