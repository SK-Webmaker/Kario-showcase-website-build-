/**
 * Single source of truth for anything you might want to change without
 * hunting through components. Edit this file (or ask Lovable to) and the
 * whole site follows.
 */

export const site = {
  name: "Kairo",

  // ---------------------------------------------------------------------
  // TODO — REPLACE BEFORE LAUNCH
  // Every "Talk to us" / "Book a demo" button on the site opens a pre-filled
  // email to this address. Change it here once and every button updates.
  // ---------------------------------------------------------------------
  contactEmail: "hello@kairo.app",

  emailSubject: "Kairo — I'd like to see it running",
  emailBody: [
    "Hi,",
    "",
    "I run a salon and I'd like to see Kairo working.",
    "",
    "Business name:",
    "What we do (hair / barber / nails / lashes / clinic):",
    "Team size:",
    "Best number to reach me on:",
    "",
    "Thanks,",
  ].join("\n"),

  tagline: "The diary that answers the phone, chases the money, and never double-books.",
} as const;

/** Pre-filled mailto used by every call to action on the page. */
export const mailtoHref =
  `mailto:${site.contactEmail}` +
  `?subject=${encodeURIComponent(site.emailSubject)}` +
  `&body=${encodeURIComponent(site.emailBody)}`;

/**
 * Path to a product screenshot.
 *
 * Normally this is just the file in /public/screenshots. The single-file
 * preview build (scripts/build-singlefile.mjs) injects `__SHOTS`, a map of
 * filename to data URI, so the whole site can be served as one HTML file
 * with no external requests. When that map isn't present — which is every
 * normal build, including Lovable's — this falls straight through to the
 * real path.
 */
export const shot = (file: string): string => {
  const inlined = (globalThis as { __SHOTS?: Record<string, string> }).__SHOTS;
  return inlined?.[file] ?? `/screenshots/${file}`;
};
