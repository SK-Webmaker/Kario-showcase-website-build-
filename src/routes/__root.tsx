import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { Lens, MaskLines, Reveal, RouteSwipe } from "@/components/v2/motion";
import { NoMotionFallback } from "@/components/v2/NoMotionFallback";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

/**
 * Not found, in the same language as the rest of the site. A visitor who
 * mistypes a URL should still be somewhere that looks like Kairo.
 */
function NotFoundComponent() {
  return (
    <div className="v2 v2-grid flex min-h-screen items-center justify-center px-6">
      <NoMotionFallback />
      <Lens />
      <div className="relative z-10 text-center">
        <h1 className="v2-display v2-h1 v2-bloom">
          <MaskLines play="now" lines={["404"]} />
        </h1>
        <h2 className="v2-display v2-t2" style={{ marginTop: "calc(1 * var(--u))" }}>
          <MaskLines play="now" delay={140} lines={["This page isn't here"]} />
        </h2>
        <Reveal
          play="now"
          delay={420}
          opacity={0.7}
          className="v2-body mx-auto max-w-[44ch]"
          style={{ marginTop: "calc(1.4 * var(--u))" }}
        >
          It may have moved, or the address may have a typo in it. Everything Kairo does is one
          click away from the home page.
        </Reveal>
        <Reveal play="now" delay={580} style={{ marginTop: "calc(2.4 * var(--u))" }}>
          <a href="/" className="v2-btn">
            Back to Kairo
          </a>
        </Reveal>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="v2 v2-grid flex min-h-screen items-center justify-center px-6">
      <Lens />
      <div className="relative z-10 max-w-[46ch] text-center">
        <h1 className="v2-display v2-t2">This page didn&apos;t load</h1>
        <p className="v2-body opacity-70" style={{ marginTop: "calc(1.2 * var(--u))" }}>
          Something went wrong on our end. Trying again usually fixes it.
        </p>
        <div
          className="flex flex-wrap justify-center gap-3"
          style={{ marginTop: "calc(2.2 * var(--u))" }}
        >
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="v2-btn"
          >
            Try again
          </button>
          <a
            href="/"
            className="v2-btn"
            style={{
              background: "transparent",
              color: "var(--v2-ink)",
              boxShadow: "inset 0 0 0 1px rgb(255 255 255 / 0.18)",
            }}
          >
            Back to Kairo
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0a0e17" },
      {
        name: "google-site-verification",
        content: "bvKp5b4iL0iyT_fggf5mn5tQB3OIuvj7MTAZpeWSfmk",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      // The two self-hosted faces start downloading with the HTML rather
      // than after the stylesheet parses, so the hero sets in Anton on
      // the first paint instead of flashing a fallback first.
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: "/fonts/anton-latin.woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: "/fonts/archivo-latin.woff2",
        crossOrigin: "anonymous",
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  // Dark-only: the theme is fixed, so the server markup is always correct
  // and there's no bootstrap script or flash to worry about.
  return (
    <html lang="en" className="dark" data-theme="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <QueryClientProvider client={queryClient}>
      {/* Moving between pages is a cut, not a jump: the outgoing page
          cross-fades out, a hairline sweeps the top of the frame, and the
          incoming page replays its own entrance. Keying on the pathname
          is what remounts the wrapper so the animation runs again.

          Opacity only on the wrapper — see .v2-route in styles.css for why
          a transform here would break every position:fixed layer. */}
      <RouteSwipe pathname={pathname} />
      <div key={pathname} className="v2-route">
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </div>
    </QueryClientProvider>
  );
}
