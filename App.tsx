import { lazy, Suspense, useEffect, type ComponentType } from "react";
import { StoreProvider, useStore, type LandingPage as PageId } from "@/lib/store";
import { Landing } from "@/components/landing/Landing";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/LandingSections";
import { NotFound } from "@/components/landing/NotFound";
import { AuthModal } from "@/components/ui/AuthModal";
import { pageview } from "@/lib/analytics";
import { routeToPath } from "@/lib/paths";
import { applySeoMetadata } from "@/lib/seo";
import { getArticle } from "@/lib/content";

// Landing marketing pages — code-split so home stays lean
const FAQ = lazy(() => import("@/components/landing/FAQ").then((m) => ({ default: m.FAQ })));
const Pricing = lazy(() =>
  import("@/components/landing/Pricing").then((m) => ({ default: m.Pricing }))
);
const GeneCatalog = lazy(() =>
  import("@/components/landing/GeneCatalog").then((m) => ({ default: m.GeneCatalog }))
);
const About = lazy(() =>
  import("@/components/landing/About").then((m) => ({ default: m.About }))
);
const Contact = lazy(() =>
  import("@/components/landing/Contact").then((m) => ({ default: m.Contact }))
);
const Privacy = lazy(() =>
  import("@/components/landing/Privacy").then((m) => ({ default: m.Privacy }))
);
const Terms = lazy(() =>
  import("@/components/landing/Terms").then((m) => ({ default: m.Terms }))
);
const Screenshots = lazy(() =>
  import("@/components/landing/Screenshots").then((m) => ({ default: m.Screenshots }))
);
const Learn = lazy(() =>
  import("@/components/landing/Learn").then((m) => ({ default: m.Learn }))
);

// Dashboard — separate chunk; only loaded after sign-in
const Library = lazy(() =>
  import("@/components/dashboard/Library").then((m) => ({ default: m.Library }))
);
const Editor = lazy(() =>
  import("@/components/dashboard/Editor").then((m) => ({ default: m.Editor }))
);
const Playground = lazy(() =>
  import("@/components/dashboard/Playground").then((m) => ({ default: m.Playground }))
);
const Compare = lazy(() =>
  import("@/components/dashboard/Compare").then((m) => ({ default: m.Compare }))
);
const Benchmark = lazy(() =>
  import("@/components/dashboard/Benchmark").then((m) => ({ default: m.Benchmark }))
);
const VersionHistory = lazy(() =>
  import("@/components/dashboard/VersionHistory").then((m) => ({
    default: m.VersionHistory,
  }))
);

const STANDALONE_PAGES: Partial<Record<PageId, ComponentType>> = {
  faq: FAQ,
  pricing: Pricing,
  catalog: GeneCatalog,
  about: About,
  contact: Contact,
  privacy: Privacy,
  terms: Terms,
  learn: Learn,
  screenshots: Screenshots,
  notfound: NotFound,
};

// section ids that live on the homepage (not standalone routes)
const HOME_SECTIONS = new Set([
  "home",
  "what",
  "compiler",
  "playground",
  "editor",
  "why",
  "benchmark",
]);

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-[13px] text-stone">
      Loading…
    </div>
  );
}

function Router() {
  const { route, user, startDemo } = useStore();

  // analytics + SEO whenever the route changes
  useEffect(() => {
    pageview(routeToPath(route).split("#")[0] || "/");
    applySeoMetadata(route);
  }, [route]);

  // App without a session → start local demo automatically (no sign-in modal)
  useEffect(() => {
    if (route.area === "app" && !user) {
      startDemo();
    }
  }, [route.area, user, startDemo]);

  // Unknown learn slug → 404
  if (
    route.area === "landing" &&
    route.page === "learn" &&
    route.section &&
    !getArticle(route.section)
  ) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main>
          <NotFound />
        </main>
        <Footer />
        <AuthModal />
      </div>
    );
  }

  // Brief moment while demo session is created
  if (route.area === "app" && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-[13px] text-stone">
        Opening demo…
      </div>
    );
  }

  if (route.area === "landing") {
    const page = route.page ?? "home";

    // 404: an unrecognized page id
    if (!HOME_SECTIONS.has(page) && !(page in STANDALONE_PAGES)) {
      return (
        <div className="min-h-screen">
          <Navbar />
          <main>
            <NotFound />
          </main>
          <Footer />
          <AuthModal />
        </div>
      );
    }

    const Standalone = STANDALONE_PAGES[page];
    if (Standalone) {
      return (
        <div className="min-h-screen">
          <Navbar />
          <main>
            <Suspense fallback={<RouteFallback />}>
              <Standalone />
            </Suspense>
          </main>
          <Footer />
          <AuthModal />
        </div>
      );
    }
    return (
      <>
        <Landing />
        <AuthModal />
      </>
    );
  }

  let AppView: ComponentType = Library;
  switch (route.tab) {
    case "library":
      AppView = Library;
      break;
    case "editor":
      AppView = Editor;
      break;
    case "playground":
      AppView = Playground;
      break;
    case "compare":
      AppView = Compare;
      break;
    case "benchmark":
      AppView = Benchmark;
      break;
    case "history":
      AppView = VersionHistory;
      break;
    default:
      AppView = Library;
  }

  return (
    <Suspense fallback={<RouteFallback />}>
      <AppView />
    </Suspense>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Router />
    </StoreProvider>
  );
}
