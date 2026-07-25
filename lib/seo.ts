import type { Route } from "@/lib/store";
import { SITE } from "@/lib/site";

const PAGE_METADATA: Partial<Record<string, { title: string; description: string }>> = {
  home: {
    title: "Genome AI — Engineer AI Behavior with Digital DNA",
    description:
      "Design, test, benchmark, and version AI behavior with Digital DNA instead of prompt-only engineering.",
  },
  what: {
    title: "What is Genome AI?",
    description: "Learn how Digital DNA turns behavior design into a structured, reusable, and measurable workflow.",
  },
  compiler: {
    title: "The Genome Compiler",
    description: "See how Genome AI compiles behavior into robust, auditable, and composable genomes.",
  },
  playground: {
    title: "Try the Playground",
    description: "Explore genomes interactively and shape AI behavior in real time.",
  },
  editor: {
    title: "Genome Editor",
    description: "Refine genes, compare versions, and tune AI behavior with the visual editor.",
  },
  why: {
    title: "Why Digital DNA Matters",
    description: "Understand why structured genomes improve reliability, reuse, and observability for AI systems.",
  },
  benchmark: {
    title: "Benchmark AI Behavior",
    description: "Measure how changes in DNA affect reasoning, planning, memory, verification, and more.",
  },
  faq: {
    title: "Frequently Asked Questions",
    description: "Answers to common questions about Genome AI, Digital DNA, and how to get started.",
  },
  pricing: {
    title: "Pricing",
    description: "Explore plans for individuals and teams building with Genome AI.",
  },
  catalog: {
    title: "Gene Catalog",
    description: "Browse the building blocks that shape AI behavior in Genome AI.",
  },
  about: {
    title: "About Genome AI",
    description: "Discover the mission behind Genome AI and the idea of Digital DNA.",
  },
  contact: {
    title: "Contact Genome AI",
    description: "Reach the Genome AI team for questions, pilots, and product feedback.",
  },
  privacy: {
    title: "Privacy Policy",
    description: "Review Genome AI’s privacy practices and data handling details.",
  },
  terms: {
    title: "Terms of Service",
    description: "Read the terms governing your use of Genome AI.",
  },
  screenshots: {
    title: "Screenshots",
    description: "See the Genome AI interface and workflow in action.",
  },
  notfound: {
    title: "Page Not Found",
    description: "The requested page could not be found.",
  },
};

function getPathname(route: Route): string {
  if (route.area === "app") {
    return `/app/${route.tab}`;
  }

  const page = route.page ?? "home";
  if (page === "home") {
    return "/";
  }

  return `/${page}`;
}

export function getSeoMetadata(route: Route) {
  const pathname = getPathname(route);
  const pageMeta = route.area === "landing" ? PAGE_METADATA[route.page ?? "home"] : undefined;
  const title = pageMeta?.title ? `${pageMeta.title} | ${SITE.name}` : SITE.seo.defaultTitle;
  const description = pageMeta?.description ?? SITE.seo.defaultDescription;
  const canonicalUrl = `${SITE.url}${pathname === "/" ? "" : pathname}`;

  return {
    title,
    description,
    canonicalUrl,
    imageUrl: `${SITE.url}${SITE.seo.ogImage}`,
    robots: SITE.seo.robots,
  };
}

function injectJsonLd(schema: unknown, id: string) {
  if (typeof document === "undefined") {
    return;
  }

  const existing = document.head.querySelector(`script[data-seo-jsonld="${id}"]`);
  if (existing) {
    existing.remove();
  }

  const script = document.createElement("script");
  script.setAttribute("type", "application/ld+json");
  script.setAttribute("data-seo-jsonld", id);
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

function getBreadcrumbJsonLd(route: Route) {
  const items = [{ name: "Home", item: SITE.url }];

  if (route.area === "app") {
    items.push({ name: "App", item: `${SITE.url}/app/${route.tab}` });
  } else {
    const page = route.page ?? "home";
    if (page !== "home") {
      const label = page
        .split("-")
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(" ");
      items.push({ name: label, item: `${SITE.url}/${page}` });
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
  if (route.area !== "landing") {
    return null;
  }

  const page = route.page ?? "home";
  if (page !== "home" && page !== "faq") {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Genome AI?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Genome AI helps teams design, test, benchmark, and version AI behavior using Digital DNA instead of prompt-only engineering.",
        },
      },
      {
        "@type": "Question",
        name: "How does Digital DNA work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Digital DNA encodes tunable genes that shape how an AI reasons, plans, verifies, remembers, and communicates.",
        },
      },
      {
        "@type": "Question",
        name: "Can I try Genome AI without installing anything?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Genome AI is available through the web app so you can begin exploring genomes right away.",
        },
      },
    ],
  };
}

export function applySeoMetadata(route: Route) {
  if (typeof document === "undefined") {
    return;
  }

  const meta = getSeoMetadata(route);

  document.title = meta.title;

  const setMetaContent = (name: string, content: string) => {
    let tag = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", name);
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
  };

  const setProperty = (property: string, content: string) => {
    let tag = document.head.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("property", property);
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
  };

  setMetaContent("description", meta.description);
  setMetaContent("robots", meta.robots);
  setMetaContent("keywords", SITE.keywords.join(", "));
  setMetaContent("twitter:card", "summary_large_image");
  setProperty("og:title", meta.title);
  setProperty("og:description", meta.description);
  setProperty("og:url", meta.canonicalUrl);
  setProperty("og:image", meta.imageUrl);
  setProperty("og:image:type", "image/svg+xml");
  setProperty("og:image:secure_url", meta.imageUrl);
  setProperty("og:image:alt", meta.title);
  setProperty("og:type", "website");
  setProperty("og:site_name", SITE.name);
  setProperty("og:locale", "en_US");

  setMetaContent("twitter:title", meta.title);
  setMetaContent("twitter:description", meta.description);
  setMetaContent("twitter:image", meta.imageUrl);
  setMetaContent("twitter:image:alt", meta.title);

  document.documentElement.setAttribute("lang", "en");

  let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", meta.canonicalUrl);

  const favicon = document.head.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
  if (favicon) {
    favicon.setAttribute("href", SITE.seo.favicon);
  }

  injectJsonLd(
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE.name,
      url: SITE.url,
      description: SITE.seo.defaultDescription,
      publisher: {
        "@id": `${SITE.url}/#organization`,
      },
    },
    "seo-website"
  );

  injectJsonLd(getBreadcrumbJsonLd(route), "seo-breadcrumb");

  const faqSchema = getFaqJsonLd(route);
  if (faqSchema) {
    injectJsonLd(faqSchema, "seo-faq");
  }
}
