import { mailtoHref, site } from "@/site.config";

const COLUMNS = [
  {
    title: "The product",
    links: [
      { href: "#journey", label: "A day with it" },
      { href: "#signature", label: "When plans change" },
      { href: "#features", label: "Features" },
      { href: "#built", label: "Under the bonnet" },
    ],
  },
  {
    title: "Deciding",
    links: [
      { href: "#why", label: "Why change" },
      { href: "#compare", label: "Next to the usual setup" },
      { href: "#contact", label: "What it costs" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-edge bg-panel/40">
      <div className="shell py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
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
              <span className="text-[17px] font-bold tracking-[-0.02em]">
                {site.name}
              </span>
            </div>

            <p className="mt-4 max-w-[42ch] text-[14px] leading-relaxed text-ink-2">
              {site.tagline}
            </p>

            <a
              href={mailtoHref}
              className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold
                         text-accent-2 hover:text-ink"
            >
              {site.contactEmail}
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="eyebrow mb-4">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="text-[14px] text-ink-2 transition-colors hover:text-ink"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="rule my-10" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12.5px] text-ink-3">
            © {new Date().getFullYear()} {site.name}. For hair, beauty, barbering,
            nails, lashes, clinics and anyone else who sells time.
          </p>
          <p className="text-[12.5px] text-ink-3">
            Every screenshot shows a demo salon with invented clients.
          </p>
        </div>
      </div>
    </footer>
  );
}
