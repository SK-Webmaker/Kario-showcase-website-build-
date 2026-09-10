import { Reveal, Rule } from "@/components/v2/motion";

export function InternalLinks({
  title = "Keep reading",
  links,
}: {
  title?: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <section
      className="mx-auto"
      style={{ maxWidth: "calc(100 * var(--u))", paddingInline: "var(--pad)" }}
    >
      <Rule />
      <div style={{ paddingBlock: "calc(3.4 * var(--u))" }}>
        <Reveal>
          <p className="v2-eyebrow v2-accent font-semibold">{title}</p>
        </Reveal>
        <ul
          className="grid sm:grid-cols-2 lg:grid-cols-3"
          style={{
            marginTop: "calc(1.2 * var(--u))",
            gap: "1px",
            background: "rgb(255 255 255 / 0.1)",
          }}
        >
          {links.map((l, i) => (
            <Reveal as="li" key={l.href} delay={i * 70} style={{ background: "var(--v2-ground)" }}>
              <a
                href={l.href}
                className="v2-body group/link block h-full opacity-70 transition-all duration-500 hover:bg-white/[0.04] hover:opacity-100"
                style={{ padding: "calc(1.6 * var(--u)) calc(1.4 * var(--u))" }}
              >
                <span
                  aria-hidden="true"
                  className="v2-accent inline-block transition-transform duration-500 group-hover/link:translate-x-1"
                  style={{ marginRight: "calc(0.5 * var(--u))" }}
                >
                  →
                </span>
                {l.label}
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
