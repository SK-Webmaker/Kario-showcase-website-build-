import { useEffect, useState } from "react";

/** Reactive `matchMedia`, for the few places layout alone can't decide. */
export function useMediaQuery(query: string): boolean {
  // Always start false: this page is server-rendered, and seeding from
  // window.matchMedia here makes the first client render disagree with
  // the server HTML on phones, which React reports as a hydration
  // mismatch and repairs by throwing the tree away. The effect below
  // sets the real value immediately after mount.
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
