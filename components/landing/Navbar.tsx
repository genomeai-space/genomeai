import { useEffect, useState } from "react";
import { useStore, type LandingPage } from "@/lib/store";
import { useTheme } from "@/lib/theme";
import { BrandLogo } from "@/components/ui/dna";
import { Button } from "@/components/ui/primitives";
import { cn } from "@/utils/cn";

export function Navbar() {
  const { openAuth, goPage, navigateLanding, route, startDemo } = useStore();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { id: "what", label: "What is a Genome", href: "/#what" },
    { id: "compiler", label: "How it compiles", href: "/#compiler" },
    { id: "playground", label: "Playground", href: "/#playground" },
    { id: "editor", label: "Editor", href: "/#editor" },
    { id: "why", label: "vs Platforms", href: "/#why" },
    { id: "benchmark", label: "Benchmark", href: "/#benchmark" },
  ];
  const pageLinks: { id: LandingPage; label: string; href: string }[] = [
    { id: "learn", label: "Learn", href: "/learn/" },
    { id: "pricing", label: "Pricing", href: "/pricing/" },
    { id: "faq", label: "FAQ", href: "/faq/" },
  ];

  const scrollTo = (id: string) => {
    setOpen(false);
    navigateLanding(id);
  };

  const goToPage = (page: LandingPage) => {
    setOpen(false);
    goPage(page);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-sand bg-cream/85 backdrop-blur-md"
          : "border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <a
          href="/"
          className="shrink-0"
          onClick={(e) => {
            e.preventDefault();
            goPage("home");
          }}
        >
          <BrandLogo />
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {links.map((l) => (
            <a
              key={l.id}
              href={l.href}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(l.id);
              }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-stone transition-colors hover:bg-fog hover:text-forest"
            >
              {l.label}
            </a>
          ))}
          {pageLinks.map((l) => (
            <a
              key={l.id}
              href={l.href}
              onClick={(e) => {
                e.preventDefault();
                goToPage(l.id);
              }}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-fog hover:text-forest",
                route.page === l.id ? "text-forest" : "text-stone"
              )}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-sand text-forest transition-colors hover:border-moss hover:bg-fog"
          >
            {theme === "dark" ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
              </svg>
            )}
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openAuth("request")}
            className="hidden sm:inline-flex"
          >
            Join waitlist
          </Button>
          <Button size="sm" onClick={() => startDemo()}>
            Try demo
          </Button>
          <button
            className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-sand text-forest md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={open}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-sand bg-paper px-5 py-3 md:hidden">
          {links.map((l) => (
            <a
              key={l.id}
              href={l.href}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(l.id);
              }}
              className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-stone hover:bg-fog"
            >
              {l.label}
            </a>
          ))}
          {pageLinks.map((l) => (
            <a
              key={l.id}
              href={l.href}
              onClick={(e) => {
                e.preventDefault();
                goToPage(l.id);
              }}
              className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-stone hover:bg-fog"
            >
              {l.label}
            </a>
          ))}
          <div className="mt-2 grid grid-cols-2 gap-2 border-t border-sand pt-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setOpen(false);
                openAuth("request");
              }}
            >
              Join waitlist
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setOpen(false);
                startDemo();
              }}
            >
              Try demo
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
