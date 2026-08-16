import type { ReactNode } from "react";

type BrowserProps = {
  children: ReactNode;
  /** Shown in the address pill, e.g. "luxehairstudio.kairo.app". */
  url?: string;
  className?: string;
};

/**
 * Desktop window chrome. Wrapping the screenshots in a real window frame
 * is what stops them reading as flat pasted images — the visitor sees an
 * application, not a picture of one.
 */
export function BrowserFrame({
  children,
  url = "app.kairo.app",
  className = "",
}: BrowserProps) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="relative overflow-hidden rounded-xl border border-edge-2
                   bg-panel sm:rounded-2xl"
      >
        {/* title bar */}
        <div
          className="flex items-center gap-3 border-b border-edge bg-panel-2/90
                     px-3 py-2 sm:px-4 sm:py-2.5"
        >
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div
            className="mx-auto flex max-w-[70%] items-center gap-1.5 truncate
                       rounded-md bg-ground/70 px-3 py-1 font-mono text-[10px]
                       text-ink-3 sm:text-[11px]"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3 w-3 shrink-0 text-money"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              aria-hidden="true"
            >
              <rect x="4" y="11" width="16" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
            <span className="truncate">{url}</span>
          </div>
          <div className="w-9 shrink-0" />
        </div>

        <div className="bg-ground">{children}</div>
      </div>
    </div>
  );
}

type PhoneProps = {
  children: ReactNode;
  className?: string;
};

/** Phone chrome for the three handset frames. */
export function PhoneFrame({ children, className = "" }: PhoneProps) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="relative overflow-hidden rounded-[30px] border-[5px]
                   border-[#1a2231] bg-[#1a2231]"
      >
        {/* notch */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1.5 z-10 h-4 w-[34%] -translate-x-1/2
                     rounded-full bg-[#05070c]"
        />
        <div className="overflow-hidden rounded-[25px] bg-ground">{children}</div>
      </div>
    </div>
  );
}
