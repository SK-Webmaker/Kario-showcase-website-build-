import { useScrollProgress } from "@/hooks/useScrollProgress";
import { Orbs } from "./primitives";

/**
 * Three statements on a pinned stage.
 *
 * This is the reference's `aiBenefits__statementsStage`: a tall section
 * wrapping a `sticky; top:0; height:100vh` child. Scroll progress through
 * the tall parent is one number 0→1, and which statement is lit — and how
 * far it has faded — is a pure function of it. Kairo's Journey already
 * works exactly this way.
 */
const STATEMENTS = ["No commission", "No monthly fee", "Your own link"];

const ORBS = [
  { x: "50%", y: "50%", size: "60vw", tone: "a" as const },
  { x: "20%", y: "30%", size: "34vw", tone: "b" as const },
];

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export function V2Statements() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const span = 1 / STATEMENTS.length;

  return (
    <section id="terms" className="relative">
      {/* 160vh each, matching the reference: enough travel for a
          statement to arrive, hold, and leave rather than flick past. */}
      <div ref={ref} style={{ height: `${STATEMENTS.length * 160}vh` }}>
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
          <Orbs spec={ORBS} />
          {STATEMENTS.map((s, i) => {
            // Each statement owns a slice of the travel and fades at both
            // ends of it, so one is always arriving as another leaves.
            /* Opacity is distance from this statement's own centre,
               measured in slices. The fade reaches past the slice
               boundary on purpose: neighbours overlap, so at the handover
               both are around 0.45 rather than one having already left
               before the other arrives — which left the pinned screen
               visibly dark mid-transition. */
            const pos = progress / span; // 0..n across the stage
            const centre = i + 0.5;
            const d = Math.abs(pos - centre);
            let opacity = clamp01((0.72 - d) / 0.5);

            // The outer two hold rather than fading off the ends of the
            // travel, or the stage sits blank for a screen at each end.
            if (i === 0 && pos < centre) opacity = 1;
            if (i === STATEMENTS.length - 1 && pos > centre) opacity = 1;

            const scale = 0.94 + 0.06 * opacity;
            return (
              <h2
                key={s}
                aria-hidden={opacity < 0.5}
                className="v2-display v2-h1 v2-bloom absolute px-6 text-center"
                style={{ opacity, transform: `scale(${scale})`, willChange: "opacity, transform" }}
              >
                {s}
              </h2>
            );
          })}
        </div>
      </div>
    </section>
  );
}
