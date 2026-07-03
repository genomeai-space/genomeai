import { useCallback, useState } from "react";

export type Theme = "light" | "dark";

const KEY = "genome-ai:theme";

export function getTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function setTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* ignore */
  }
}

/**
 * Hook returning the current theme + a toggle. The initial class is set by an
 * inline script in index.html (no flash of wrong theme).
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => getTheme());

  // Light is the default. We never auto-follow the OS preference — dark mode is
  // only ever entered through an explicit toggle, which persists a choice.

  const toggle = useCallback(() => {
    const next: Theme = getTheme() === "dark" ? "light" : "dark";
    setTheme(next);
    setThemeState(next);
  }, []);

  return { theme, toggle };
}
