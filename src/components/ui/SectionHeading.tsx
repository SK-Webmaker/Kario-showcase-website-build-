import type { ReactNode } from "react";
import { Reveal, RiseLines } from "./Reveal";

type Props = {
  /** Two-digit index, e.g. "02" — only when the section really is a step. */
  index?: string;
  eyebrow?: string;
  /** Each string is its own rising line. */
  lines: string[];
  lede?: ReactNode;
  className?: string;
};

export function SectionHeading({ index, eyebrow, lines, lede, className = "" }: Props) {
  return (
    <div className={className}>
      {(index || eyebrow) && (
        <Reveal>
          <div className="mb-8 flex items-center gap-4 border-b border-line pb-3">
            {index && <span className="chrome text-ink">[{index}]</span>}
            {eyebrow && <span className="chrome">{eyebrow}</span>}
          </div>
        </Reveal>
      )}

      <RiseLines lines={lines} className="display-lg" />

      {lede && (
        <Reveal delay={160}>
          <p className="lede mt-7">{lede}</p>
        </Reveal>
      )}
    </div>
  );
}
