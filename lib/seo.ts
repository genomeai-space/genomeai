import type { Route } from "@/lib/store";
import { getArticle } from "@/lib/content";
import { FAQS } from "@/lib/faq";
import {
  canonicalUrlForPath,
  isIndexableLandingPage,
  pathForLandingPage,
  routeToPath,
} from "@/lib/paths";
import { SITE } from "@/lib/site";

type PageMeta = {
  title: string;
  description: string;
  /** When true, do not append " | Genome AI" */
  brandInTitle?: boolean;
};

const PAGE_METADATA: Partial<Record<string, PageMeta>> = {
  home: {
    title: SITE.seo.defaultTitle,
    description: SITE.seo.defaultDescription,
    brandInTitle: true,
  },
  what: {
    title: "What is Genome AI?",
    description:
      "Learn how Digital DNA turns AI behavior design into a structured, reusable, and measurable workflow.",
  },
  compiler: {
    title: "The Genome Compiler",
    description:
      "See how Genome AI compiles tunable genes into robust, auditable, and composable AI behavior configs.",
  },
  playground: {
    title: "Try the Playground",
    description:
      "Explore genomes interactively and shape AI behavior in real time with Digital DNA.",
  },
  editor: {
    title: "Genome Editor",
    description:
      "Refine genes, compare versions, and tune AI behavior with the visual Genome Editor.",
  },
  why: {
    title: "Why Digital DNA Matters",
    description:
      "Understand why structured genomes improve reliability, reuse, and observability for AI systems.",
  },
  benchmark: {
    title: "Benchmark AI Behavior",
    description:
      "Measure how DNA changes affect reasoning, planning, memory, verification, and more.",
  },
  faq: {
    title: "Frequently Asked Questions",
    description:
      "Answers about Genome AI, Digital DNA, benchmarking, pricing, and getting started.",
  },
  pricing: {
    title: "Pricing",
    description:
      "Explore free beta and upcoming plans for individuals and teams building with Genome AI.",
  },
  catalog: {
    title: "Gene Catalog",
    description:
      "Browse the 10 tunable genes that shape AI behavior in Genome AI Digital DNA.",
  },
  about: {
    title: "About Genome AI",
    description:
      "Discover the mission behind Genome AI and the idea of Digital DNA for agent engineering.",
  },
  contact: {
    title: "Contact Genome AI",
    description:
      "Reach the Genome AI team for questions, pilots, partnerships, and product feedback.",
  },
  privacy: {
    title: "Privacy Policy",
    description: "Review Genome AI privacy practices and how product data is handled.",
  },
  terms: {
    title: "Terms of Service",
    description: "Read the terms governing your use of Genome AI.",
  },
  learn: {
    title: "Learn Digital DNA",
    description:
      "Guides on Digital DNA, genome vs prompt engineering, the Genome Engine, and benchmarking AI behavior.",
  },
  screenshots: {
    title: "Screenshots",
    description: "See the Genome AI interface and workflow in action.",
  },
  notfound: {
    title: "Page Not Found",
    description: "The requested page could not be found on Genome AI.",
  },
};

const APP_TAB_LABELS: Record<string, string> = {
  library: "DNA Library",
  editor: "Editor",
  playground: "Playground",
  compare: "Compare",
  benchmark: "Benchmark",
  history: "Version History",
};

function upsertMetaByName(name: string, content: string) {
  let tag = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertMetaByProperty(property: string, content: string) {
  let tag = document.head.querySelector(
    `meta[property="${property}"]`
  ) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertLink(rel: string, href: string, extra?: Record<string, string>) {
  let link = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", rel);
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      link.setAttribute(k, v);
    }
  }
}

function injectJsonLd(schema: unknown, id: string) {
  if (typeof document === "undefined") return;
  const existing = document.head.querySelector(`script[data-seo-jsonld="${id}"]`);
  if (existing) existing.remove();
  const script = document.createElement("script");
  script.setAttribute("type", "application/ld+json");
  script.setAttribute("data-seo-jsonld", id);
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

function removeJsonLd(id: string) {
  document.head.querySelector(`script[data-seo-jsonld="${id}"]`)?.remove();
}

export function getSeoMetadata(route: Route) {
  const path = routeToPath(route);
  const pathnameOnly = path.split("#")[0] || "/";

  let title: string = SITE.seo.defaultTitle;
  let description: string = SITE.seo.defaultDescription;
  let robots: string = SITE.seo.robots;

  if (route.area === "app") {
    const tabLabel = APP_TAB_LABELS[route.tab] ?? "App";
    title = `${tabLabel} | ${SITE.name}`;
    description = `Use the Genome AI ${tabLabel} to design, test, and version Digital DNA.`;
    robots = "noindex,nofollow";
  } else {
    const page = route.page ?? "home";
    const pageMeta = PAGE_METADATA[page];
    if (pageMeta) {
      title = pageMeta.brandInTitle
        ? pageMeta.title
        : `${pageMeta.title} | ${SITE.name}`;
      description = pageMeta.description;
    }

    // Article-level meta for /learn/<slug>/
    if (page === "learn" && route.section) {
      const article = getArticle(route.section);
      if (article) {
        title = `${article.title} | ${SITE.name}`;
        description = article.description;
      }
    }

    if (page === "notfound" || page === "screenshots") {
      robots = "noindex,follow";
    } else if (!isIndexableLandingPage(page) && page !== "home") {
      robots = "noindex,follow";
    }

    // Home section hashes still canonicalize to homepage (avoid thin duplicate URLs)
    if (page !== "home" && path.startsWith("/#")) {
      const sectionMeta = PAGE_METADATA[page];
      if (sectionMeta) {
        title = `${sectionMeta.title} | ${SITE.name}`;
        description = sectionMeta.description;
      }
    }
  }

  // Home + in-page sections canonicalize to site root (trailing slash form).
  const isHomeCanonical =
    route.area === "landing" &&
    ((route.page ?? "home") === "home" || path.startsWith("/#"));

  const canonicalUrl = isHomeCanonical
    ? `${SITE.url}/`
    : canonicalUrlForPath(pathnameOnly, SITE.url);

  return {
    title,
    description,
    canonicalUrl,
    imageUrl: `${SITE.url}${SITE.seo.ogImage}`,
    imageType: SITE.seo.ogImageType,
    imageWidth: SITE.seo.ogImageWidth,
    imageHeight: SITE.seo.ogImageHeight,
    robots,
    path: pathnameOnly,
  };
}

function getBreadcrumbJsonLd(route: Route) {
  const items: { name: string; item: string }[] = [
    { name: "Home", item: SITE.url },
  ];

  if (route.area === "app") {
    items.push({
      name: "App",
      item: `${SITE.url}/app/`,
    });
    if (route.tab && route.tab !== "library") {
      items.push({
        name: APP_TAB_LABELS[route.tab] ?? route.tab,
        item: `${SITE.url}/app/${route.tab}/`,
      });
    }
  } else {
    const page = route.page ?? "home";
    if (page !== "home" && !pathForLandingPage(page).startsWith("/#")) {
      const meta = PAGE_METADATA[page];
      items.push({
        name: meta?.title ?? page,
        item: `${SITE.url}${pathForLandingPage(page)}`,
      });
      if (page === "learn" && route.section) {
        const article = getArticle(route.section);
        items.push({
          name: article?.title ?? route.section,
          item: `${SITE.url}${pathForLandingPage("learn", route.section)}`,
        });
      }
    }
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

function getFaqJsonLd(route: Route) {
  if (route.area !== "landing") return null;
  const page = route.page ?? "home";
  if (page !== "home" && page !== "faq") return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

function getSoftwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE.name,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    url: SITE.url,
    description: SITE.seo.defaultDescription,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free beta during MVP",
    },
    publisher: {
      "@id": `${SITE.url}/#organization`,
    },
  };
}

function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    email: SITE.email,
    foundingDate: String(SITE.founded),
    sameAs: [SITE.social.twitter, SITE.social.github, SITE.repo],
    logo: {
      "@type": "ImageObject",
      url: `${SITE.url}${SITE.seo.favicon}`,
    },
  };
}

function getWebSiteJsonLd() {
  // No SearchAction — site has no public search endpoint (invalid actions hurt rich results).
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.seo.defaultDescription,
    inLanguage: "en-US",
    publisher: { "@id": `${SITE.url}/#organization` },
  };
}

function getWebPageJsonLd(_route: Route, meta: ReturnType<typeof getSeoMetadata>) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${meta.canonicalUrl}#webpage`,
    url: meta.canonicalUrl,
    name: meta.title,
    description: meta.description,
    isPartOf: { "@id": `${SITE.url}/#website` },
    about: { "@id": `${SITE.url}/#organization` },
    inLanguage: "en-US",
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: meta.imageUrl,
      width: meta.imageWidth,
      height: meta.imageHeight,
    },
  };
}

export function applySeoMetadata(route: Route) {
  if (typeof document === "undefined") return;

  const meta = getSeoMetadata(route);

  document.title = meta.title;
  document.documentElement.setAttribute("lang", "en");

  upsertMetaByName("description", meta.description);
  upsertMetaByName("robots", meta.robots);
  upsertMetaByName("googlebot", meta.robots);
  upsertMetaByName("keywords", SITE.keywords.join(", "));
  upsertMetaByName("author", SITE.name);
  upsertMetaByName("theme-color", "#2f6b43");

  const article =
    route.area === "landing" && route.page === "learn" && route.section
      ? getArticle(route.section)
      : undefined;

  // Open Graph
  upsertMetaByProperty("og:type", article ? "article" : "website");
  upsertMetaByProperty("og:site_name", SITE.name);
  upsertMetaByProperty("og:locale", "en_US");
  upsertMetaByProperty("og:title", meta.title);
  upsertMetaByProperty("og:description", meta.description);
  upsertMetaByProperty("og:url", meta.canonicalUrl);
  upsertMetaByProperty("og:image", meta.imageUrl);
  upsertMetaByProperty("og:image:secure_url", meta.imageUrl);
  upsertMetaByProperty("og:image:type", meta.imageType);
  upsertMetaByProperty("og:image:width", String(meta.imageWidth));
  upsertMetaByProperty("og:image:height", String(meta.imageHeight));
  upsertMetaByProperty("og:image:alt", meta.title);
  if (article) {
    upsertMetaByProperty("article:published_time", `${article.date}T00:00:00Z`);
    upsertMetaByProperty("article:author", SITE.name);
  }

  // Twitter / X — JPEG OG images score better than SVG in most crawlers
  upsertMetaByName("twitter:card", "summary_large_image");
  upsertMetaByName("twitter:site", SITE.social.twitterHandle);
  upsertMetaByName("twitter:creator", SITE.social.twitterHandle);
  upsertMetaByName("twitter:title", meta.title);
  upsertMetaByName("twitter:description", meta.description);
  upsertMetaByName("twitter:image", meta.imageUrl);
  upsertMetaByName("twitter:image:alt", meta.title);

  upsertLink("canonical", meta.canonicalUrl);
  upsertLink("icon", SITE.seo.favicon, { type: "image/svg+xml" });
  upsertLink("apple-touch-icon", SITE.seo.favicon);
  upsertLink("alternate", `${SITE.url}/sitemap.xml`, {
    type: "application/xml",
    title: "Sitemap",
  });

  // Structured data
  injectJsonLd(getOrganizationJsonLd(), "seo-organization");
  injectJsonLd(getWebSiteJsonLd(), "seo-website");
  injectJsonLd(getWebPageJsonLd(route, meta), "seo-webpage");
  injectJsonLd(getBreadcrumbJsonLd(route), "seo-breadcrumb");
  injectJsonLd(getSoftwareApplicationJsonLd(), "seo-software");

  const faqSchema = getFaqJsonLd(route);
  if (faqSchema) {
    injectJsonLd(faqSchema, "seo-faq");
  } else {
    removeJsonLd("seo-faq");
  }

  if (article) {
    injectJsonLd(
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.description,
        datePublished: article.date,
        dateModified: article.date,
        author: { "@type": "Organization", name: SITE.name, url: SITE.url },
        publisher: { "@id": `${SITE.url}/#organization` },
        mainEntityOfPage: meta.canonicalUrl,
        image: meta.imageUrl,
        keywords: article.tags.join(", "),
      },
      "seo-article"
    );
  } else {
    removeJsonLd("seo-article");
  }
}
