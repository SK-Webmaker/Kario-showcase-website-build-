import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

type Props = {
  /** The finished figure, e.g. "1,200" or "99.9" or "0". */
  value: string;
  className?: string;
};

/**
 * The slot-machine number roll.
 *
 * Each digit is its own column holding 0–9 stacked vertically. The column
 * starts parked on 0 and slides up until the target digit sits in the
 * window. Columns are staggered left-to-right so the number "lands" like
 * an odometer settling rather than all digits snapping at once.
 *
 * Non-digit characters (commas, dots, %) are rendered as static glyphs so
 * "1,200" and "99.9%" keep their punctuation in place while the numerals
 * roll around them.
 */
export function Odometer({ value, className = "" }: Props) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.5 });
  const reduced = useReducedMotion();
  const [rolled, setRolled] = useState(false);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setRolled(true);
      return;
    }
    // One frame's delay so the transition has a "from" state to leave.
    const id = requestAnimationFrame(() => setRolled(true));
    return () => cancelAnimationFrame(id);
  }, [inView, reduced]);

  const chars = value.split("");
  let digitIndex = -1;

  return (
    <span ref={ref} className={`inline-flex tabular ${className}`} aria-label={value}>
      {chars.map((char, i) => {
        if (!/\d/.test(char)) {
          return (
            <span key={i} aria-hidden="true" className="inline-block">
              {char}
            </span>
          );
        }

        digitIndex += 1;
        const target = Number(char);
        const stagger = digitIndex * 90;

        return (
          <span
            key={i}
            aria-hidden="true"
            className="relative inline-block overflow-hidden align-bottom"
            style={{ height: "1em", lineHeight: 1 }}
          >
            {/* Invisible sizer keeps the column exactly one digit wide. */}
            <span className="invisible block">0</span>
            <span
              className="absolute inset-x-0 top-0 flex flex-col will-change-transform"
              style={{
                transform: `translateY(-${(rolled ? target : 0) * 10}%)`,
                transition: reduced
                  ? "none"
                  : `transform 1500ms cubic-bezier(0.16, 1, 0.3, 1) ${stagger}ms`,
              }}
            >
              {DIGITS.map((d) => (
                <span key={d} className="block" style={{ height: "1em", lineHeight: 1 }}>
                  {d}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
