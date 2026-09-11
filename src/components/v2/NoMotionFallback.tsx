/**
 * The scroll-triggered reveals start hidden and are switched on by an
 * IntersectionObserver, which means a visitor with JavaScript off would
 * get a page of invisible text. This puts every one of them at its
 * destination state in that case.
 *
 * It has to be a <noscript><style> rather than a class toggled after
 * hydration: a class would flash the whole page in and out on every load.
 * Crawlers are unaffected either way — the copy is in the HTML regardless
 * of what opacity it is painted at.
 */
const CSS = `
.v2-lift { opacity: var(--v2-o, 1) !important; transform: none !important; }
.v2-mask > * { transform: none !important; }
.v2-plate { opacity: 1 !important; transform: none !important; }
.v2-open { display: none !important; }
.v2-settle { animation: none !important; }
`;

export function NoMotionFallback() {
  return (
    <noscript>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
    </noscript>
  );
}
