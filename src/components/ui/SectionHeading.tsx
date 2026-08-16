import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type Props = {
  /** Small mono label above the heading, e.g. "the day book". */
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  className = "",
}: Props) {
  const centered = align === "center";

  return (
    <div
      className={`${centered ? "mx-auto text-center" : ""} max-w-3xl ${className}`}
    >
      {eyebrow && (
        <Reveal>
          {/* Short rule then label — a print device, not a decoration. */}
          <p
            className={`eyebrow mb-5 flex items-center gap-3 ${
              centered ? "justify-center" : ""
            }`}
          >
            <span aria-hidden="true" className="h-px w-6 bg-edge-2" />
            {eyebrow}
          </p>
        </Reveal>
      )}
      <Reveal delay={60}>
        <h2 className="h-section">{title}</h2>
      </Reveal>
      {lede && (
        <Reveal delay={120}>
          <p
            className={`mt-5 text-[16.5px] leading-relaxed text-ink-2 sm:text-[18px]
                        ${centered ? "mx-auto" : ""} max-w-2xl`}
          >
            {lede}
          </p>
        </Reveal>
      )}
    </div>
  );
}
