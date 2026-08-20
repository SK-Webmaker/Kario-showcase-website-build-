import { mailtoHref, site } from "@/site.config";
import { RiseLines } from "./ui/Reveal";

const COLS = [
  {
    t: "The product",
    l: [
      ["#journey", "A day with it"],
      ["#signature", "When plans change"],
      ["#features", "Features"],
      ["#built", "Under the bonnet"],
    ],
  },
  {
    t: "Deciding",
    l: [
      ["#why", "Why not the others"],
      ["#problem", "Why change"],
      ["#compare", "Side by side"],
      ["#contact", "What it costs"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-raised">
      <div className="shell py-16">
        <RiseLines
          lines={["Let's get your", "diary answering", "the phone."]}
          className="display-lg max-w-4xl"
        />

        <a href={mailtoHref} className="btn-brand mt-10">
          {site.contactEmail}
        </a>

        <div className="mt-16 grid gap-10 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.16em]">
              {site.name}.app
            </p>
            <p className="mt-3 max-w-[36ch] text-[13.5px] leading-relaxed text-ink-2">
              {site.tagline}
            </p>
          </div>

          {COLS.map((c) => (
            <div key={c.t}>
              <p className="chrome mb-4">{c.t}</p>
              <ul>
                {c.l.map(([href, label]) => (
                  <li key={href}>
                    <a
                      href={href}
                      className="block border-b border-line py-2.5 text-[13.5px] text-ink-2
                                 transition-colors duration-[660ms] ease-66 hover:text-ink"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="chrome normal-case tracking-normal">
            © {new Date().getFullYear()} {site.name}. For hair, barbering, beauty,
            nails, lashes and anyone else who sells time.
          </p>
          <p className="chrome normal-case tracking-normal">
            Every screenshot shows a demo salon with invented clients.
          </p>
        </div>
      </div>
    </footer>
  );
}
