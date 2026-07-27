import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  type Genome,
  type GenomeVersion,
  type Genes,
  seedGenomes,
  uid,
  GENOME_COLORS,
  CATEGORIES,
} from "./dna";
import { pathToRoute, routeToPath } from "./paths";

// ── navigation ───────────────────────────────────────────────
export type DashTab =
  | "library"
  | "editor"
  | "playground"
  | "compare"
  | "benchmark"
  | "history";

export type LandingPage =
  | "home"
  | "what"
  | "compiler"
  | "playground"
  | "editor"
  | "why"
  | "benchmark"
  | "faq"
  | "pricing"
  | "catalog"
  | "about"
  | "contact"
  | "privacy"
  | "terms"
  | "learn"
  | "screenshots"
  | "notfound";

/** Waitlist / early-access form only — demo entry skips the modal. */
export type AuthIntent = null | "request";

export interface Route {
  area: "landing" | "app";
  tab: DashTab;
  /** transient auth modal intent, shared across all pages */
  auth?: AuthIntent;
  /** landing sub-page (default "home") */
  page?: LandingPage;
  /** focused genome id (editor / history / playground) */
  genomeId?: string;
  /** compare: list of ids */
  compareIds?: string[];
  /** landing hash section */
  section?: string;
}

export interface User {
  name: string;
  email: string;
}

const LS_KEY = "genome-ai:v1";

interface Persisted {
  genomes: Genome[];
  user: User | null;
}

function load(): Persisted {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Persisted;
      if (p.genomes?.length) return p;
    }
  } catch {
    /* ignore */
  }
  return { genomes: seedGenomes(), user: null };
}

interface StoreValue {
  route: Route;
  go: (r: Partial<Route>) => void;
  goPage: (page: LandingPage) => void;
  openAuth: (intent: AuthIntent) => void;
  closeAuth: () => void;
  navigateLanding: (section?: string) => void;
  enterApp: () => void;

  user: User | null;
  /** Optional email OTP for real accounts (not used as primary CTA). */
  signIn: (email: string) => Promise<void>;
  /** Instant local demo session — primary product entry. */
  startDemo: () => void;
  signOut: () => void;

  genomes: Genome[];
  getGenome: (id?: string) => Genome | undefined;
  createGenome: (partial?: Partial<Genome>) => Genome;
  updateGenome: (id: string, patch: Partial<Genome>, note?: string, version?: boolean) => void;
  duplicateGenome: (id: string) => Genome | undefined;
  deleteGenome: (id: string) => void;
  toggleStar: (id: string) => void;
  restoreVersion: (id: string, version: number) => void;
  setGenes: (id: string, genes: Genes) => void;
}

const StoreCtx = createContext<StoreValue | null>(null);

function readRouteFromLocation(): Route {
  if (typeof window === "undefined") {
    return { area: "landing", tab: "library", page: "home" };
  }
  return pathToRoute(window.location.pathname, window.location.hash);
}

function normalizeHistoryPath(path: string): string {
  if (!path || path === "/") return "/";
  const [pathname, hash] = path.split("#");
  let p = pathname || "/";
  if (p !== "/" && !p.endsWith("/")) p = `${p}/`;
  return hash ? `${p}#${hash}` : p;
}

function syncHistory(next: Route, mode: "push" | "replace" = "push") {
  if (typeof window === "undefined") return;
  const target = routeToPath(next);
  const current = `${window.location.pathname}${window.location.hash}`;
  const normalizedCurrent = normalizeHistoryPath(current);
  const normalizedTarget = normalizeHistoryPath(target);
  if (normalizedCurrent === normalizedTarget) return;

  const [pathname, hash = ""] = normalizedTarget.split("#");
  const url = hash ? `${pathname || "/"}#${hash}` : pathname || "/";
  if (mode === "replace") {
    window.history.replaceState({ route: next }, "", url);
  } else {
    window.history.pushState({ route: next }, "", url);
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(() => load());
  const [route, setRoute] = useState<Route>(() => readRouteFromLocation());
  const stateRef = useRef(state);
  stateRef.current = state;
  const routeRef = useRef(route);
  routeRef.current = route;

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  // Browser back/forward + direct loads
  useEffect(() => {
    const onPopState = () => {
      const next = readRouteFromLocation();
      setRoute((prev) => ({ ...next, auth: prev.auth ?? null }));
      if (next.section) {
        setTimeout(() => {
          document.getElementById(next.section!)?.scrollIntoView({ behavior: "smooth" });
        }, 60);
      }
    };
    window.addEventListener("popstate", onPopState);

    // Ensure the address bar matches parsed route on first paint (e.g. trailing slash)
    syncHistory(routeRef.current, "replace");

    // Deep-link into a home section after first mount
    if (routeRef.current.section) {
      setTimeout(() => {
        document.getElementById(routeRef.current.section!)?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    }

    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const go = useCallback((r: Partial<Route>) => {
    setRoute((prev) => {
      const next: Route = { ...prev, ...r };
      // Clearing page when entering app keeps path clean
      if (next.area === "app") {
        next.page = "home";
        next.section = undefined;
      }
      syncHistory(next, "push");
      return next;
    });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const goPage = useCallback((page: LandingPage) => {
    const next: Route = { area: "landing", tab: "library", page };
    setRoute(next);
    syncHistory(next, "push");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const openAuth = useCallback((intent: AuthIntent) => {
    // Auth is modal-only — do not pollute the URL or history stack
    setRoute((prev) => ({ ...prev, auth: intent }));
  }, []);
  const closeAuth = useCallback(() => {
    setRoute((prev) => ({ ...prev, auth: null }));
  }, []);

  /** Navigate to home or a standalone landing page (former hash sections are real routes). */
  const navigateLanding = useCallback((section?: string) => {
    const standalone = new Set<LandingPage>([
      "what",
      "compiler",
      "playground",
      "editor",
      "why",
      "benchmark",
      "faq",
      "pricing",
      "catalog",
      "about",
      "contact",
      "privacy",
      "terms",
      "learn",
    ]);
    if (section && standalone.has(section as LandingPage)) {
      const next: Route = { area: "landing", tab: "library", page: section as LandingPage };
      setRoute(next);
      syncHistory(next, "push");
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    const next: Route = {
      area: "landing",
      tab: "library",
      page: "home",
    };
    setRoute(next);
    syncHistory(next, "push");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const enterApp = useCallback(() => go({ area: "app", tab: "library" }), [go]);

  const signIn = useCallback(async (email: string) => {
    const { supabase } = await import("./supabase");
    if (!supabase) {
      throw new Error("Supabase is not configured.");
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: "https://genomeai.space/app" },
    });

    if (error) {
      throw new Error(error.message);
    }

    // Tell the user to check their email for the sign-in link.
    // We no longer collect a name at sign-in; store an empty name and the email.
    setState((s) => ({ ...s, user: { name: "", email } }));
  }, []);
  const startDemo = useCallback(() => {
    const name = `Demo ${Math.floor(Math.random() * 9000) + 1000}`;
    const email = `demo+${Date.now()}@local`;
    setState((s) => ({ ...s, user: { name, email } }));
    const next: Route = { area: "app", tab: "library", page: "home", auth: null };
    setRoute(next);
    syncHistory(next, "push");
  }, []);
  const signOut = useCallback(() => {
    setState((s) => ({ ...s, user: null }));
    const next: Route = { area: "landing", tab: "library", page: "home" };
    setRoute(next);
    syncHistory(next, "push");
  }, []);

  const genomes = state.genomes;

  const getGenome = useCallback(
    (id?: string) => genomes.find((g) => g.id === id),
    [genomes]
  );

  const createGenome = useCallback((partial?: Partial<Genome>) => {
    const now = Date.now();
    const emptyGenes: Genes = Object.fromEntries(
      ["reasoning","planning","verification","memory","creativity","precision","verbosity","risk","empathy","autonomy"].map(
        (id) => [id, 50]
      )
    );
    const author =
      partial?.author || (stateRef.current.user?.name || "GenomeAI");
    const genome: Genome = {
      id: uid("gen"),
      name: partial?.name || "Untitled Genome",
      category: partial?.category || "General",
      description: partial?.description || "A new genome — tune its genes to shape behavior.",
      genes: partial?.genes || emptyGenes,
      color: partial?.color || GENOME_COLORS[Math.floor(Math.random() * GENOME_COLORS.length)],
      starred: false,
      author,
      createdAt: now,
      updatedAt: now,
      versions: [
        { version: 1, createdAt: now, genes: partial?.genes || emptyGenes, note: "Created" },
      ],
    };
    setState((s) => ({ ...s, genomes: [genome, ...s.genomes] }));
    return genome;
  }, []);

  const updateGenome = useCallback(
    (id: string, patch: Partial<Genome>, note?: string, version = false) => {
      setState((s) => ({
        ...s,
        genomes: s.genomes.map((g) => {
          if (g.id !== id) return g;
          const next: Genome = { ...g, ...patch, updatedAt: Date.now() };
          if (version) {
            const vnum = (g.versions[g.versions.length - 1]?.version || 0) + 1;
            const nv: GenomeVersion = {
              version: vnum,
              createdAt: Date.now(),
              genes: patch.genes || g.genes,
              note: note || `Saved snapshot v${vnum}`,
            };
            next.versions = [...g.versions, nv];
          }
          return next;
        }),
      }));
    },
    []
  );

  const duplicateGenome = useCallback((id: string) => {
    let dup: Genome | undefined;
    setState((s) => {
      const src = s.genomes.find((g) => g.id === id);
      if (!src) return s;
      const now = Date.now();
      const versions = src.versions.map((v) => ({ ...v, genes: { ...v.genes } }));
      dup = {
        ...src,
        id: uid("gen"),
        name: `${src.name} (copy)`,
        starred: false,
        author: s.user?.name || src.author,
        createdAt: now,
        updatedAt: now,
        genes: { ...src.genes },
        versions,
      };
      return { ...s, genomes: [dup, ...s.genomes] };
    });
    return dup;
  }, []);

  const deleteGenome = useCallback((id: string) => {
    setState((s) => ({ ...s, genomes: s.genomes.filter((g) => g.id !== id) }));
  }, []);

  const toggleStar = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      genomes: s.genomes.map((g) => (g.id === id ? { ...g, starred: !g.starred } : g)),
    }));
  }, []);

  const restoreVersion = useCallback((id: string, version: number) => {
    setState((s) => ({
      ...s,
      genomes: s.genomes.map((g) => {
        if (g.id !== id) return g;
        const target = g.versions.find((v) => v.version === version);
        if (!target) return g;
        const vnum = (g.versions[g.versions.length - 1]?.version || 0) + 1;
        const nv: GenomeVersion = {
          version: vnum,
          createdAt: Date.now(),
          genes: { ...target.genes },
          note: `Restored from v${version}`,
        };
        return {
          ...g,
          genes: { ...target.genes },
          updatedAt: Date.now(),
          versions: [...g.versions, nv],
        };
      }),
    }));
  }, []);

  const setGenes = useCallback((id: string, genes: Genes) => {
    setState((s) => ({
      ...s,
      genomes: s.genomes.map((g) =>
        g.id === id ? { ...g, genes, updatedAt: Date.now() } : g
      ),
    }));
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      route,
      go,
      goPage,
      openAuth,
      closeAuth,
      navigateLanding,
      enterApp,
      user: state.user,
      signIn,
      startDemo,
      signOut,
      genomes,
      getGenome,
      createGenome,
      updateGenome,
      duplicateGenome,
      deleteGenome,
      toggleStar,
      restoreVersion,
      setGenes,
    }),
    [route, go, goPage, openAuth, closeAuth, navigateLanding, enterApp, state.user, genomes, getGenome, createGenome, updateGenome, duplicateGenome, deleteGenome, toggleStar, restoreVersion, setGenes, signIn, startDemo, signOut]
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export { GENOME_COLORS, CATEGORIES };
