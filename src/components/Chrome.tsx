import { useEffect, useState } from "react";

/**
 * The instrument furniture: a blueprint grid with crosshairs at the
 * intersections, and live readouts. None of it carries meaning on its
 * own — it exists to make the page feel like a precision object rather
 * than a brochure, which is exactly the register a salon owner should
 * read "this was built properly" from.
 */

/** Column rules with a + at every crossing. Fixed, behind everything. */
export function Blueprint() {
  const cols = [1, 2, 3, 4, 5];
  const rows = [0.25, 0.5, 0.75];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 select-none"
    >
      {/* vertical rules */}
      {cols.map((c) => (
        <span
          key={c}
          className="absolute top-0 h-full w-px bg-ink/[0.06]"
          style={{ left: `${(c / 6) * 100}%` }}
        />
      ))}

      {/* crosshairs where the rules meet the horizontal thirds */}
      {rows.map((r) =>
        cols.map((c) => (
          <span
            key={`${r}-${c}`}
            className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${(c / 6) * 100}%`, top: `${r * 100}%` }}
          >
            <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-ink/20" />
            <span className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2 bg-ink/20" />
          </span>
        )),
      )}
    </div>
  );
}

/** Local clock, updating every second. */
function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/** Pointer position, in the same X/Y readout style as a design tool. */
function usePointer() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    let frame: number | null = null;
    const onMove = (e: MouseEvent) => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        setPos({ x: Math.round(e.clientX), y: Math.round(e.clientY) });
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);
  return pos;
}

const pad = (n: number, w = 4) => String(n).padStart(w, "0");

/** The bottom status bar: where the salon is, what time it is, cursor. */
export function StatusBar() {
  const now = useClock();
  const pos = usePointer();

  const time = now.toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 hidden
                 border-t border-line bg-ground/70 backdrop-blur-sm lg:block"
    >
      <div className="shell flex items-center justify-between py-2">
        <span className="chrome tabular">
          Melbourne AU · Live in production
        </span>
        <span className="chrome tabular">
          {pad(pos.x)} X {pad(pos.y)} Y
        </span>
        <span className="chrome tabular flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-acid animate-blink" />
          {time}
        </span>
      </div>
    </div>
  );
}
