import type { ReactNode, Ref } from "react";
import { useInView } from "@/hooks/useInView";

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

/** Fade-and-lift on first entry, on the site's signature curve. */
export function Reveal({ children, delay = 0, y = 22, className = "" }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity 900ms cubic-bezier(.66,0,.01,1) ${delay}ms,
                     transform 900ms cubic-bezier(.66,0,.01,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Display type that rises from behind a clipping edge, one line at a
 * time. This is the move that makes big headlines feel authored — the
 * words arrive rather than fade.
 */
export function RiseLines({
  lines,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  lines: string[];
  className?: string;
  delay?: number;
  /** Element to render. Use a heading tag so the section is in the outline. */
  as?: "div" | "h1" | "h2" | "h3";
}) {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.25 });
  return (
    <Tag ref={ref as Ref<never>} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="clip-line">
          <span
            className="block"
            style={{
              transform: inView ? "translateY(0)" : "translateY(105%)",
              opacity: inView ? 1 : 0,
              transition: `transform 1000ms cubic-bezier(.66,0,.01,1) ${delay + i * 90}ms,
                           opacity 700ms cubic-bezier(.66,0,.01,1) ${delay + i * 90}ms`,
            }}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
