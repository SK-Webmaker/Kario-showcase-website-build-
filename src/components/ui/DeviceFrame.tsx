import type { CSSProperties, ReactNode } from "react";

/**
 * Device chrome, drawn as an instrument rather than a glossy mock: square
 * corners, hairline borders, a monospace address. The product screens are
 * dark, so on the paper ground they read as objects sitting on a page.
 */

export function BrowserFrame({
  children,
  url = "app.kairo.app",
  className = "",
}: {
  children: ReactNode;
  url?: string | undefined;
  className?: string | undefined;
}) {
  return (
    <div className={`relative border border-line-2 bg-raised ${className}`}>
      <div className="flex items-center gap-3 border-b border-line px-3 py-2">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full border border-line-2" />
          <span className="h-2 w-2 rounded-full border border-line-2" />
          <span className="h-2 w-2 rounded-full border border-line-2" />
        </div>
        <span className="mx-auto truncate font-mono text-[10px] tracking-[0.06em] text-ink-3">
          {url}
        </span>
        <span className="w-8 shrink-0" aria-hidden="true" />
      </div>
      <div className="bg-[#05070c]">{children}</div>
    </div>
  );
}

export function PhoneFrame({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string | undefined;
  style?: CSSProperties | undefined;
}) {
  return (
    <div className={`relative ${className}`} style={style}>
      <div className="overflow-hidden rounded-[22px] border-[4px] border-ink/80 bg-ink/80">
        <div className="overflow-hidden rounded-[18px] bg-[#05070c]">{children}</div>
      </div>
    </div>
  );
}
