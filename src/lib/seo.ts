/**
 * The <Seo> contract, expressed the way TanStack Start actually renders
 * head tags: a function that builds the route's `head()` object.
 *
 * A React component cannot write <title>, canonical or JSON-LD into the
 * server-sent HTML in this framework — head() can, and server-rendered
 * markup is the whole point of these pages. Same props, same output.
 */

import { ORIGIN } from "@/site.config";

export { ORIGIN };

export const BRAND = "Kairo Bookings";

/** Absolute URL for a site path. Paths are stored without a trailing slash
 *  so the canonical always matches the URL the server actually serves. */
export const url = (path: string): string =>
  `${ORIGIN}${path === "/" ? "/" : path.replace(/\/$/, "")}`;

export type Json = Record<string, unknown>;

export interface SeoInput {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  schema?: readonly Json[];
  /** Pages still holding TODO placeholders must not be indexed. */
  noindex?: boolean;
}

export interface HeadResult {
  meta: Array<Record<string, string>>;
  links: Array<Record<string, string>>;
  scripts: Array<{ type: string; children: string }>;
}

export function seo(input: SeoInput): HeadResult {
  const canonical = url(input.path);
  const image = input.ogImage ?? `${ORIGIN}/screenshots/01-dashboard.jpg`;

  const meta: Array<Record<string, string>> = [
    { title: input.title },
    { name: "description", content: input.description },
    { property: "og:site_name", content: BRAND },
    { property: "og:title", content: input.title },
    { property: "og:description", content: input.description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: canonical },
    { property: "og:image", content: image },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: input.title },
    { name: "twitter:description", content: input.description },
    { name: "twitter:image", content: image },
  ];

  if (input.noindex) meta.push({ name: "robots", content: "noindex, follow" });

  return {
    meta,
    links: [{ rel: "canonical", href: canonical }],
    scripts: (input.schema ?? []).map((graph) => ({
      type: "application/ld+json",
      children: JSON.stringify(graph),
    })),
  };
}

/* ------------------------------------------------------------------ */
/* Schema builders                                                      */
/* ------------------------------------------------------------------ */

export const ORG_ID = `${ORIGIN}/#organization`;

export function organizationSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: BRAND,
    alternateName: "Kairo",
    url: `${ORIGIN}/`,
    logo: `${ORIGIN}/kairo-logo.png`,
    slogan: "Keep every dollar you book.",
    areaServed: { "@type": "Country", name: "Australia" },
  };
}

export function softwareSchema(opts?: { name?: string; description?: string; path?: string }): Json {
  return {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "WebApplication"],
    name: opts?.name ?? BRAND,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Appointment scheduling and point of sale",
    operatingSystem: "Web browser; installs to the home screen on iOS and Android",
    url: opts?.path ? url(opts.path) : `${ORIGIN}/`,
    publisher: { "@id": ORG_ID },
    description:
      opts?.description ??
      "Booking, payments and client management software for Australian salons, barbers and beauty businesses. One-off $400 AUD setup, $0 per month, no commission.",
    offers: {
      "@type": "Offer",
      name: "Kairo setup",
      price: "400",
      priceCurrency: "AUD",
      availability: "https://schema.org/InStock",
      eligibleRegion: { "@type": "Country", name: "Australia" },
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        name: "One-off setup fee",
        price: "400",
        priceCurrency: "AUD",
        valueAddedTaxIncluded: true,
      },
    },
  };
}

export function faqSchema(items: readonly { question: string; answer: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
    inLanguage: "en-AU",
  };
}

export function breadcrumbSchema(trail: readonly { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: url(c.path),
    })),
  };
}

export function articleSchema(opts: {
  headline: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    mainEntityOfPage: url(opts.path),
    publisher: { "@id": ORG_ID },
    inLanguage: "en-AU",
    ...(opts.image ? { image: opts.image } : {}),
    ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
    ...(opts.authorName ? { author: { "@type": "Person", name: opts.authorName } } : {}),
  };
}
