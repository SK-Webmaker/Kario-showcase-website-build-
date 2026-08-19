import { useEffect, useState } from "react";
import { usePageProgress } from "@/hooks/useScrollProgress";
import { useTheme } from "@/hooks/useTheme";
import { mailtoHref, site } from "@/site.config";

const LINKS = [
  { href: "#why", label: "Why" },
  { href: "#journey", label: "The Day" },
  { href: "#signature", label: "Changes" },
  { href: "#features", label: "Features" },
  { href: "#contact", label: "Talk" },
];

function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M20 14v36" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      <path
        d="M44 14 24 32l20 18"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function Nav() {
  const progress = usePageProgress();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ground/80 backdrop-blur-md">
      <div className="shell flex h-14 items-center justify-between gap-6">
        <a href="#top" className="flex items-center gap-2" aria-label={`${site.name} home`}>
          <Mark className="h-4 w-4 text-ink" />
          <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.16em]">
            {site.name}.app
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Sections">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="chrome transition-colors duration-660 ease-66 hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* Bracket notation, borrowed from instrument panels: the
              bracket shows the current state, not a decoration. */}
          <button
            onClick={toggle}
            className="chrome transition-colors duration-660 ease-66 hover:text-ink"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            Theme[{theme === "dark" ? "D" : "L"}]
          </button>

          <a href={mailtoHref} className="btn-acid hidden !px-4 !py-2 sm:inline-flex">
            Talk to us
          </a>

          <button
            onClick={() => setOpen((v) => !v)}
            className="chrome lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            Menu[{open ? "×" : "≡"}]
          </button>
        </div>
      </div>

      {/* reading progress */}
      <div
        aria-hidden="true"
        className="h-px w-full origin-left bg-acid"
        style={{ transform: `scaleX(${progress})` }}
      />

      {open && (
        <div className="border-b border-line bg-ground lg:hidden">
          <nav className="shell flex flex-col py-2" aria-label="Sections">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-4 font-mono text-[12px] uppercase
                           tracking-[0.12em] text-ink-2 last:border-0"
              >
                {l.label}
              </a>
            ))}
            <a href={mailtoHref} onClick={() => setOpen(false)} className="btn-acid mt-4">
              Talk to us
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
