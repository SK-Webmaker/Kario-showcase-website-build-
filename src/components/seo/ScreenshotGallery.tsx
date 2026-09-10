import { MaskLines, Plate, Reveal, Rule } from "@/components/v2/motion";

export type Shot = { src: string; alt: string; caption?: string };

/**
 * Screenshots with mandatory descriptive alt text. Anything not yet
 * supplied is rendered as a visible TODO rather than a stand-in image.
 *
 * Each plate opens from a slit as it enters, so a page of screens reads
 * as a sequence rather than a contact sheet.
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
              <Reveal
                as="div"
                key={s.src}
                delay={(i % 2) * 120}
                className="overflow-hidden border border-white/10"
                style={{ borderRadius: "calc(1 * var(--u))" }}
              >
                <figure>
                  <Plate src={s.src} alt={s.alt} />
                  {s.caption ? (
                    <figcaption
                      className="v2-body border-t border-white/10 opacity-60"
                      style={{ padding: "calc(1 * var(--u)) calc(1.2 * var(--u))" }}
                    >
                      {s.caption}
                    </figcaption>
                  ) : null}
                </figure>
              </Reveal>
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
