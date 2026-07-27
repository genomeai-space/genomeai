import { useState, type ReactNode } from "react";
import { useStore, type DashTab } from "@/lib/store";
import { useTheme } from "@/lib/theme";
import { BrandLogo } from "@/components/ui/dna";
import { Button } from "@/components/ui/primitives";
import { cn } from "@/utils/cn";

const NAV: { id: DashTab; label: string; icon: ReactNode; hint: string }[] = [
  {
    id: "library",
    label: "DNA Library",
    hint: "All genomes",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    id: "editor",
    label: "DNA Editor",
    hint: "Tune genes",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
      </svg>
    ),
  },
  {
    id: "playground",
    label: "Playground",
    hint: "Run tasks",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 5v14l11-7z" />
      </svg>
    ),
  },
  {
    id: "compare",
    label: "Compare",
    hint: "Side by side",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="7" height="16" rx="1.5" />
        <rect x="14" y="4" width="7" height="16" rx="1.5" />
      </svg>
    ),
  },
  {
    id: "benchmark",
    label: "Benchmark",
    hint: "Score & report",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 3v18h18M8 16v-5M13 16V8M18 16v-9" />
      </svg>
    ),
  },
  {
    id: "history",
    label: "Version History",
    hint: "Audit trail",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 12a9 9 0 109-9 9 9 0 00-7.5 4M3 3v4h4M12 8v4l3 2" />
      </svg>
    ),
  },
];

export function DashboardLayout({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { route, go, user, signOut, genomes, openAuth } = useStore();
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDemo = Boolean(user?.email?.includes("@local") || user?.name?.startsWith("Demo"));

  const SideContent = (
    <div className="flex h-full flex-col">
      <div className="px-5 py-5">
        <button onClick={() => go({ area: "landing" })}>
          <BrandLogo />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        <p className="px-3 pb-2 pt-2 text-[11px] font-bold uppercase tracking-wider text-mist">
          Workspace
        </p>
        {NAV.map((n) => {
          const active = route.tab === n.id;
          return (
            <button
              key={n.id}
              onClick={() => {
                go({ tab: n.id });
                setMobileOpen(false);
              }}
              className={cn(
                "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all",
                active
                  ? "bg-forest text-paper shadow-md shadow-forest/20"
                  : "text-stone hover:bg-fog hover:text-forest"
              )}
            >
              <span className={cn(active ? "text-spring" : "text-mist group-hover:text-moss")}>
                {n.icon}
              </span>
              <span className="flex-1">
                <span className="block text-[13.5px] font-semibold leading-tight">{n.label}</span>
                <span className={cn("block text-[11px]", active ? "text-mint/80" : "text-mist")}>
                  {n.hint}
                </span>
              </span>
            </button>
          );
        })}
      </nav>

      <div className="space-y-3 p-3">
        <div className="rounded-xl border border-sand bg-cream/60 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-mist">
              Genomes
            </span>
            <span className="font-display text-lg font-bold text-forest">{genomes.length}</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand">
            <div className="h-full bg-gradient-to-r from-leaf to-moss" style={{ width: "62%" }} />
          </div>
        </div>

        {isDemo && (
          <button
            type="button"
            onClick={() => openAuth("request")}
            className="w-full rounded-xl border border-moss/30 bg-mint/30 px-3 py-2 text-left transition hover:bg-mint/50"
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-moss">Demo mode</div>
            <div className="mt-0.5 text-[12px] font-medium text-forest">Join waitlist →</div>
          </button>
        )}

        <div className="flex items-center gap-2.5 rounded-xl border border-sand bg-paper px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-moss text-[13px] font-bold text-paper">
            {(user?.name || "G").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12.5px] font-semibold text-forest">
              {user?.name || "Engineer"}
            </div>
            <div className="truncate text-[11px] text-mist">
              {isDemo ? "Local demo session" : user?.email}
            </div>
          </div>
          <button
            onClick={signOut}
            title="Exit demo"
            className="rounded-lg p-1.5 text-mist hover:bg-fog hover:text-clay"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sand bg-paper/80 backdrop-blur lg:block">
        {SideContent}
      </aside>

      {/* mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-forest/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-sand bg-paper">
            {SideContent}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        {/* topbar */}
        <header className="sticky top-0 z-30 border-b border-sand bg-cream/85 backdrop-blur-md">
          <div className="flex items-center gap-3 px-5 py-3.5">
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-sand text-forest lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate font-display text-xl font-bold tracking-tight text-forest">
                {title}
              </h1>
              {subtitle && <p className="truncate text-[12.5px] text-stone">{subtitle}</p>}
            </div>
            <button
              onClick={toggle}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Light mode" : "Dark mode"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-sand text-forest transition-colors hover:border-moss hover:bg-fog"
            >
              {theme === "dark" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
                </svg>
              )}
            </button>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-5 py-7">{children}</main>
      </div>
    </div>
  );
}

export { NAV };
export function NewGenomeButton({ onClick }: { onClick: () => void }) {
  return (
    <Button size="sm" onClick={onClick}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
        <path d="M12 5v14M5 12h14" />
      </svg>
      New genome
    </Button>
  );
}
