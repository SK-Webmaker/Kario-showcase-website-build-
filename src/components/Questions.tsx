import { FAQ } from "@/data/faq";
import { Reveal } from "./ui/Reveal";

/**
 * The straight answers.
 *
 * Native <details>, on purpose: the answer text is in the server-rendered
 * HTML whether the row is open or shut, so a crawler that runs no
 * JavaScript still gets every word — while a reader gets a list they can
 * scan rather than a wall they have to wade through.
 *
 * The same array drives the FAQPage JSON-LD, so the markup and the page can
 * never say different things.
 */
export function Questions() {
  return (
    <section id="questions" className="relative border-t border-line">
      <div className="shell py-20 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div>
            <Reveal>
              <div className="mb-8 flex items-center gap-4 border-b border-line pb-3">
                <span className="chrome text-ink">[10]</span>
                <span className="chrome">Straight answers</span>
              </div>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="display-lg">
                The questions
                <br />
                everyone asks
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="lede mt-6">
                Price, ownership, what happens to your client list. The things worth knowing before
                you commit to anything — answered here rather than after a sales call.
              </p>
            </Reveal>
          </div>

          <div className="lg:pt-2">
            <dl className="border-t border-line">
              {FAQ.map((item, i) => (
                <Reveal key={item.q} delay={i < 4 ? i * 50 : 0}>
                  <details name="kairo-faq" open={i === 0} className="group border-b border-line">
                    <summary
                      className="flex cursor-pointer list-none items-baseline gap-4 py-5
                                 transition-colors duration-[660ms] ease-66
                                 hover:text-ink [&::-webkit-details-marker]:hidden"
                    >
                      <span className="chrome shrink-0 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <dt className="flex-1 font-sans text-[16px] font-bold leading-snug tracking-[-0.01em] text-ink sm:text-[17px]">
                        {item.q}
                      </dt>
                      <span
                        aria-hidden="true"
                        className="mt-1 shrink-0 font-mono text-[13px] text-ink-3
                                   transition-transform duration-[660ms] ease-66
                                   group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <dd className="mb-6 ml-[calc(2ch+1rem)] max-w-[62ch] text-[14.5px] leading-[1.66] text-ink-2">
                      {item.a}
                    </dd>
                  </details>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
