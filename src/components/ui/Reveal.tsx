import type { ReactNode } from "react";
import { useInView } from "@/hooks/useInView";

type Props = {
  children: ReactNode;
  /** Milliseconds to hold before this element starts its reveal. */
  delay?: number;
  /** Distance travelled on the way in. */
  y?: number;
  className?: string;
};

/**
 * Fades and lifts its children the first time they scroll into view.
 * Under `prefers-reduced-motion` the CSS in index.css collapses the
 * transition to nothing, so the content simply appears.
 */
export function Reveal({ children, delay = 0, y = 18, className = "" }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity 700ms cubic-bezier(0.22,1,0.36,1) ${delay}ms,
                     transform 700ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
