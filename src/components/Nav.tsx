import { useEffect, useState } from "react";
import { usePageProgress } from "@/hooks/useScrollProgress";
import { mailtoHref, site } from "@/site.config";

const LINKS = [
  { href: "#why", label: "Why" },
  { href: "#journey", label: "A day with it" },
  { href: "#signature", label: "When plans change" },
  { href: "#features", label: "Features" },
  { href: "#compare", label: "Compare" },
];

function Wordmark() {
  return (
    <a href="#top" className="flex items-center gap-2.5" aria-label={`${site.name} home`}>
      <svg viewBox="0 0 64 64" className="h-7 w-7" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill="#0b1017" />
        <path d="M20 14v36" stroke="#5ea3f0" strokeWidth="7" strokeLinecap="round" />
        <path
          d="M44 14 24 32l20 18"
          stroke="#3b82f6"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <span className="text-[17px] font-bold tracking-[-0.02em]">{site.name}</span>
    </a>
  );
}

export function Nav() {
  const progress = usePageProgress();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile sheet on Escape, and stop the page scrolling behind it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
      style={{
        background: solid ? "rgba(5,7,12,0.82)" : "transparent",
        backdropFilter: solid ? "blur(14px)" : "none",
        borderBottom: `1px solid ${solid ? "#1b2433" : "transparent"}`,
      }}
    >
      <div className="shell flex h-16 items-center justify-between gap-4">
        <Wordmark />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Sections">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-2 text-[13.5px] text-ink-2
                         transition-colors hover:bg-panel-2 hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={mailtoHref}
            className="hidden rounded-full bg-accent px-4 py-2 text-[13.5px] font-semibold
                       text-white transition-colors hover:bg-accent-2 sm:inline-flex"
          >
            Talk to us
          </a>

          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-edge-2
                       text-ink lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              aria-hidden="true"
            >
              {open ? (
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* reading progress */}
      <div
        aria-hidden="true"
        className="h-px w-full origin-left bg-accent-2"
        style={{
          transform: `scaleX(${progress})`,
          opacity: solid ? 1 : 0,
          transition: "opacity 300ms ease",
        }}
      />

      {/* mobile sheet */}
      {open && (
        <div className="border-b border-edge bg-ground/97 backdrop-blur-xl lg:hidden">
          <nav className="shell flex flex-col py-3" aria-label="Sections">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-edge/70 py-3.5 text-[15px] text-ink-2 last:border-0
                           hover:text-ink"
              >
                {l.label}
              </a>
            ))}
            <a
              href={mailtoHref}
              onClick={() => setOpen(false)}
              className="btn-primary mt-4 w-full"
            >
              Talk to us
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
