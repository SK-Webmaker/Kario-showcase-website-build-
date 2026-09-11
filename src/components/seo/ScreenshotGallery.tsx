import { MaskLines, Rule } from "@/components/v2/motion";
import { Plate } from "@/components/v2/cinematic";

export type Shot = { src: string; alt: string; caption?: string };

/**
 * Screenshots with mandatory descriptive alt text. Anything not yet
 * supplied is rendered as a visible TODO rather than a stand-in image.
 *
 * Each one arrives the same way every other picture on the site does,
 * staggered a beat across the two columns so a grid of screens reads as
 * a sequence rather than as a contact sheet landing all at once.
 */
export function ScreenshotGallery({
  shots,
  todo,
  heading,
}: {
  shots?: readonly Shot[];
  todo?: string;
  heading?: string;
}) {
  return (
    <section
      className="mx-auto"
      style={{ maxWidth: "calc(100 * var(--u))", paddingInline: "var(--pad)" }}
    >
      <Rule />
      <div style={{ paddingBlock: "calc(4.5 * var(--u))" }}>
        {heading ? (
          <h2
            className="v2-display v2-t2"
            style={{ maxWidth: "calc(44 * var(--u))", marginBottom: "calc(2 * var(--u))" }}
          >
            <MaskLines lines={[heading]} />
          </h2>
        ) : null}

        {shots && shots.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {shots.map((s, i) => (
              <div key={s.src}>
                <Plate
                  src={s.src}
                  alt={s.alt}
                  depth={10}
                  delay={(i % 2) * 120}
                  radius="calc(1 * var(--u))"
                />
                {s.caption ? (
                  <p className="v2-body opacity-60" style={{ marginTop: "calc(0.8 * var(--u))" }}>
                    {s.caption}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <p
            className="v2-eyebrow border border-dashed px-4 py-3"
            style={{ borderColor: "rgb(185 118 13 / 0.6)", background: "rgb(185 118 13 / 0.1)" }}
          >
            TODO: {todo ?? "original screenshots needed before this section can publish."}
          </p>
        )}
      </div>
    </section>
  );
}
