import { LEGAL } from "@/data/legal";
import { site } from "@/site.config";
import { RiseLines } from "./ui/Reveal";

type Col = { t: string; l: readonly (readonly [string, string])[] };

const COLS: readonly Col[] = [
  {
    t: "The product",
    l: [
      ["/#journey", "A day with it"],
      ["/#signature", "When plans change"],
      ["/#features", "Features"],
      ["/#built", "Under the bonnet"],
    ],
  },
  {
    t: "Deciding",
    l: [
      ["/#why", "Why not the others"],
      ["/#problem", "Why change"],
      ["/#compare", "Side by side"],
      ["/get-in-touch", "What it costs"],
    ],
  },
  {
    t: "For your business",
    l: [
      ["/salon-booking-software-australia", "Salon booking software Australia"],
      ["/hair-salon-software-australia", "Hair salon software Australia"],
      ["/commission-free-booking-software", "Commission-free booking software"],
      ["/no-monthly-fee-salon-software", "No-monthly-fee salon software"],
      ["/blog", "Blog"],
      ["/about", "About Kairo"],
    ],
  },
  {
    t: "Legal",
    l: LEGAL.map((d) => [`/legal/${d.slug}`, d.title] as const),
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-raised">
      <div className="shell py-16">
        <RiseLines
          as="h2"
          lines={["Let's get your", "diary answering", "the phone."]}
          className="display-lg max-w-4xl"
        />

        <a href="/get-in-touch" className="btn-brand mt-10">
          Contact us
        </a>

        <div className="mt-16 grid gap-10 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.16em]">
              {site.name}
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
            © {new Date().getFullYear()} {site.name}. For anyone who sells time, and wants the hours
            between appointments back.
          </p>
          <p className="chrome normal-case tracking-normal">
            Every screenshot shows a demo salon with invented clients.{" "}
            <a href="/legal" className="underline underline-offset-2 hover:text-ink">
              Legal
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
