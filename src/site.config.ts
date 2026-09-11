/**
 * Single source of truth for anything you might want to change without
 * hunting through components. Edit this file (or ask Lovable to) and the
 * whole site follows.
 */

/** The public origin, with no trailing slash. Canonicals, the sitemap
 *  and every absolute URL in the schema graph are built from this. */
export const ORIGIN = "https://kairobookings.com";

/** The home page's title and description. Used by the <title> tag, the meta
 *  description, the Open Graph tags and the WebPage node in the schema
 *  graph — a machine that finds them disagreeing trusts all of them less. */
export const TITLE = "Kairo | Booking, Payments & Client Management Software";
export const DESCRIPTION =
  "Kairo runs bookings, payments, client records, stock and every customer message from one login — so the hours normally lost to admin go back into the day. $410 once, then nothing per month.";

export const site = {
  name: "Kairo",

  // ---------------------------------------------------------------------
  // Contact email used by every "Talk to us" / "Book a demo" button.
  // Change it here once and every button updates. It is deliberately the
  // same address the contact form already sends from, so a reply to a
  // form submission and a reply to a mailto: land in the same inbox.
  // ---------------------------------------------------------------------
  contactEmail: "enquiries@kairobookings.com",

  emailSubject: "Kairo — I'd like to see it running",
  emailBody: [
    "Hi,",
    "",
    "I run an appointment business and I'd like to see Kairo working.",
    "",
    "Business name:",
    "What we do:",
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
