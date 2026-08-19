import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";
const KEY = "kairo-theme";

/**
 * Light by default, because the product screenshots are dark and read
 * best against paper. The visitor's choice is remembered; if they've
 * never chosen, their OS preference decides.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = localStorage.getItem(KEY) as Theme | null;
    const initial: Theme =
      saved ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      localStorage.setItem(KEY, next);
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", next === "dark" ? "#0a0e17" : "#f7f8fb");
      return next;
    });
  }, []);

  return { theme, toggle };
}
