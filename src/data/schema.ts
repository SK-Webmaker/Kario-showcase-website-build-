/**
 * The schema.org entity graph, as JSON-LD.
 *
 * Why a @graph rather than a handful of separate <script> blocks: the point
 * of this markup is not decoration, it is telling a machine that the
 * organisation, the website, this page and the product are four facets of
 * one thing. Separate blocks describe four unconnected objects. A graph
 * with @id cross-references describes one entity with four faces, which is
 * what an entity-resolution step is actually looking for.
 *
 * Two deliberate omissions, both of which cost a visible feature:
 *
 *   aggregateRating / review — Google grants star rich results for
 *   SoftwareApplication only when a rating is present, and prohibits
 *   ratings the reviewed business controls. Kairo has no independent
 *   reviews yet, so there is no honest rating to put here. Inventing one
 *   risks a manual action, and in Australia it is misleading conduct under
 *   the ACL. When real third-party reviews exist, add them then.
 *
 *   sameAs — this is the single strongest entity-disambiguation signal
 *   there is, and it needs real profile URLs (ABN lookup, LinkedIn,
 *   Instagram, a Google Business Profile). Empty or invented links are
 *   worse than none. Fill SAME_AS in when those pages exist.
 */

import { DESCRIPTION, ORIGIN, TITLE, site } from "@/site.config";

import { FAQ } from "./faq";

export { ORIGIN };

/** Public profiles that prove this is one real, findable business. */
const SAME_AS: readonly string[] = [];

const ID = {
  org: `${ORIGIN}/#organization`,
  site: `${ORIGIN}/#website`,
  software: `${ORIGIN}/#software`,
  home: `${ORIGIN}/#webpage`,
  faq: `${ORIGIN}/#faq`,
} as const;

/** JSON-LD is plain data; this keeps it typed without pretending otherwise. */
type Node = Record<string, unknown>;

/**
 * Capabilities, phrased as a person would say them rather than as feature
 * bullets. These are the strings a model has to work with when it is asked
 * "can it do X" — so each one names the thing it does, not a product noun.
 */
const FEATURES: readonly string[] = [
  "Appointment diary with a column per person that cannot be double-booked",
  "Service menu with fixed, from and free price types",
  "Client records with notes, history and any safety or allergy details",
  "Automatic booking confirmations, reminders and cancellation notices by email or SMS",
  "Public booking page on the business's own branded link, showing only real openings",
  "Point of sale, invoicing and receipts, with card payments through Stripe",
  "Retail stock with cost against margin and low-stock warnings",
  "Automatic review requests after a visit, collected on the business's own page",
  "Win-back list of clients who have quietly stopped booking",
  "Reporting on bookings by hour, revenue per day and top services",
  "Staff rosters, working hours, colours and titles",
  "Installs to the home screen and works as the full workspace on a phone",
];

function organization(): Node {
  return {
    "@type": "Organization",
    "@id": ID.org,
    name: "Kairo",
    alternateName: "Kairo Bookings",
    url: `${ORIGIN}/`,
    logo: {
      "@type": "ImageObject",
      "@id": `${ORIGIN}/#logo`,
      url: `${ORIGIN}/kairo-logo.png`,
      contentUrl: `${ORIGIN}/kairo-logo.png`,
      width: 512,
      height: 512,
      caption: "Kairo",
    },
    image: { "@id": `${ORIGIN}/#logo` },
    description:
      "Kairo makes booking, payments and client-messaging software for businesses that sell appointments. One system instead of a diary, a card machine and a messaging app, so less of the day goes on admin. One-off $400 setup, no monthly fee and no commission.",
    slogan: "The software a salon runs its whole day on.",
    email: site.contactEmail,
    areaServed: { "@type": "Country", name: "Australia" },
    knowsAbout: [
      "Appointment booking software",
      "Online booking and scheduling",
      "Point of sale for appointment businesses",
      "Appointment reminders and no-show reduction",
      "Client records and service history",
      "Reducing the admin time between appointments",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales and support",
      email: site.contactEmail,
      areaServed: "AU",
      availableLanguage: "English",
    },
    ...(SAME_AS.length > 0 ? { sameAs: SAME_AS } : {}),
  };
}

function website(): Node {
  return {
    "@type": "WebSite",
    "@id": ID.site,
    url: `${ORIGIN}/`,
    name: "Kairo",
    description: "Booking, payments and client messaging for appointment businesses.",
    publisher: { "@id": ID.org },
    inLanguage: "en-AU",
  };
}

function software(): Node {
  return {
    "@type": ["SoftwareApplication", "WebApplication"],
    "@id": ID.software,
    name: "Kairo",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Appointment scheduling and point of sale",
    operatingSystem:
      "Web browser (Chrome, Safari, Edge, Firefox); installs to the home screen on iOS and Android",
    browserRequirements: "Requires JavaScript and a modern browser",
    description:
      "Kairo runs the appointment diary, client records, point of sale, retail stock, automatic client messaging and a public booking page on the business's own link. Each business gets its own database. For any business that runs on booked appointments — hair, barbering, beauty, clinics, studios and scheduled trades.",
    url: `${ORIGIN}/`,
    image: `${ORIGIN}/screenshots/01-dashboard.jpg`,
    softwareHelp: `${ORIGIN}/legal/security`,
    publisher: { "@id": ID.org },
    provider: { "@id": ID.org },
    featureList: FEATURES,
    audience: {
      "@type": "BusinessAudience",
      name: "Businesses that run on booked appointments",
      audienceType:
        "Hair salons, barbershops, beauty and nail studios, clinics, therapists, studios and scheduled trades",
      geographicArea: { "@type": "Country", name: "Australia" },
    },
    offers: {
      "@type": "Offer",
      "@id": `${ORIGIN}/#offer`,
      name: "Kairo setup",
      description:
        "A one-off setup fee of AUD $400 including GST, paid once. No monthly subscription, no per-booking fee and no commission on anything the salon charges. Full refund within 30 days of going live.",
      price: "400",
      priceCurrency: "AUD",
      availability: "https://schema.org/InStock",
      eligibleRegion: { "@type": "Country", name: "Australia" },
      seller: { "@id": ID.org },
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        name: "One-off setup fee",
        price: "400",
        priceCurrency: "AUD",
        valueAddedTaxIncluded: true,
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        name: "30-day refund",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
        applicableCountry: "AU",
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
  };
}

function faqPage(): Node {
  return {
    "@type": "FAQPage",
    "@id": ID.faq,
    // Google retired the FAQ rich result in May 2026, but the type still
    // parses and it is the cleanest way to hand a model a question and its
    // answer as one unit. Kept for the machines, not for the stars.
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
    isPartOf: { "@id": ID.home },
    inLanguage: "en-AU",
  };
}

function homePage(): Node {
  return {
    "@type": "WebPage",
    "@id": ID.home,
    url: `${ORIGIN}/`,
    name: TITLE,
    description: DESCRIPTION,
    isPartOf: { "@id": ID.site },
    about: { "@id": ID.software },
    primaryImageOfPage: `${ORIGIN}/screenshots/01-dashboard.jpg`,
    inLanguage: "en-AU",
  };
}

/** The whole graph for the home page. */
export function homeGraph(): Node {
  return {
    "@context": "https://schema.org",
    "@graph": [organization(), website(), homePage(), software(), faqPage()],
  };
}

/**
 * A legal or secondary page: its own WebPage node, a breadcrumb trail, and
 * a reference back to the same organisation @id so the page is understood
 * as belonging to the entity rather than floating on its own.
 */
export function pageGraph(opts: {
  path: string;
  name: string;
  description: string;
  breadcrumb: readonly { name: string; path: string }[];
}): Node {
  const url = `${ORIGIN}${opts.path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: opts.name,
        description: opts.description,
        isPartOf: { "@id": ID.site },
        about: { "@id": ID.org },
        publisher: { "@id": ID.org },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        inLanguage: "en-AU",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: opts.breadcrumb.map((crumb, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: crumb.name,
          item: `${ORIGIN}${crumb.path}`,
        })),
      },
    ],
  };
}

/**
 * Head entry for a JSON-LD block.
 *
 * It goes through the router's head so it is serialised into the HTML the
 * server sends. That matters more than it sounds: no major AI crawler runs
 * JavaScript, so anything injected on the client is invisible to every one
 * of them.
 */
export function jsonLdScript(graph: Node): {
  type: string;
  children: string;
} {
  return {
    type: "application/ld+json",
    children: JSON.stringify(graph),
  };
}
