import { Link } from "@tanstack/react-router";

import { Orbs } from "./primitives";
import { MaskLines, Reveal, Torch } from "./motion";
import { Magnetic } from "./cinematic";

const ORBS = [
  { x: "50%", y: "58%", size: "56vw", tone: "a" as const },
  { x: "22%", y: "26%", size: "28vw", tone: "b" as const },
  { x: "82%", y: "34%", size: "24vw", tone: "b" as const },
];

/** The close. One line, one sentence under it, one button. */
export function V2Cta() {
  return (
    <section
      id="contact"
      className="relative flex min-h-[86vh] items-center justify-center overflow-hidden text-center"
      style={{ padding: "calc(6 * var(--u)) var(--pad)" }}
    >
      <Orbs spec={ORBS} />
      <Torch />
      <div className="relative z-10">
        {/* Wide enough that each line stays one line: a mask holding two
            wrapped lines reveals both at once, which is not the effect. */}
        <h2 className="v2-display v2-h1" style={{ maxWidth: "calc(88 * var(--u))" }}>
          <MaskLines lines={["Your business,"]} />
          <MaskLines lines={["running itself."]} lineClassName="v2-accent" delay={140} />
        </h2>
        <Reveal
          as="p"
          delay={320}
          opacity={0.7}
          className="v2-body mx-auto max-w-[44ch]"
          style={{ marginTop: "calc(2.4 * var(--u))" }}
        >
          You did not start a business to chase confirmations. Every hour spent on admin between
          appointments is an hour nobody paid you for.
        </Reveal>
        <Reveal delay={460} style={{ marginTop: "calc(3 * var(--u))" }}>
          <Magnetic>
            <Link to="/get-in-touch" className="v2-btn">
              Contact us
            </Link>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
