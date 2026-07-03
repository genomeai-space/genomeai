import { useEffect } from "react";
import { StoreProvider, useStore, type LandingPage as PageId } from "@/lib/store";
import { Landing } from "@/components/landing/Landing";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/LandingSections";
import { FAQ } from "@/components/landing/FAQ";
import { Pricing } from "@/components/landing/Pricing";
import { GeneCatalog } from "@/components/landing/GeneCatalog";
import { About } from "@/components/landing/About";
import { Contact } from "@/components/landing/Contact";
import { Privacy } from "@/components/landing/Privacy";
import { Terms } from "@/components/landing/Terms";
import { Screenshots } from "@/components/landing/Screenshots";
import { NotFound } from "@/components/landing/NotFound";
import { AuthModal } from "@/components/ui/AuthModal";
import { pageview } from "@/lib/analytics";
import { Library } from "@/components/dashboard/Library";
import { Editor } from "@/components/dashboard/Editor";
import { Playground } from "@/components/dashboard/Playground";
import { Compare } from "@/components/dashboard/Compare";
import { Benchmark } from "@/components/dashboard/Benchmark";
import { VersionHistory } from "@/components/dashboard/VersionHistory";

const STANDALONE_PAGES: Partial<Record<PageId, React.ComponentType>> = {
  faq: FAQ,
  pricing: Pricing,
  catalog: GeneCatalog,
  about: About,
  contact: Contact,
  privacy: Privacy,
  terms: Terms,
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

function Router() {
  const { route, user } = useStore();

  // analytics: fire a pageview whenever the route changes
  useEffect(() => {
    const path =
      route.area === "app"
        ? `/app/${route.tab}`
        : `/${route.page && route.page !== "home" ? route.page : ""}`;
    pageview(path);
  }, [route.area, route.tab, route.page]);

  // guard: app area requires a (mock) signed-in user
  if (route.area === "app" && !user) {
    return (
      <>
        <Landing />
        <AuthModal />
      </>
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
            <Standalone />
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

  switch (route.tab) {
    case "library":
      return <Library />;
    case "editor":
      return <Editor />;
    case "playground":
      return <Playground />;
    case "compare":
      return <Compare />;
    case "benchmark":
      return <Benchmark />;
    case "history":
      return <VersionHistory />;
    default:
      return <Library />;
  }
}

export default function App() {
  return (
    <StoreProvider>
      <Router />
    </StoreProvider>
  );
}
