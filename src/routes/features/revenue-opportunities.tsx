import { createFileRoute } from "@tanstack/react-router";

import { ScaffoldPage } from "@/components/seo/ScaffoldPage";
import { breadcrumbSchema, organizationSchema, seo, softwareSchema } from "@/lib/seo";

const PATH = "/features/revenue-opportunities";
const TITLE = "Find Lost Salon Revenue | Kairo Opportunities";
const DESCRIPTION =
  "The Opportunities screen surfaces clients who stopped rebooking, gaps in tomorrow's diary, low stock and reviews never asked for — money you already earned.";

export const Route = createFileRoute("/features/revenue-opportunities")({
  head: () =>
    seo({
      title: TITLE,
      description: DESCRIPTION,
      path: PATH,
      noindex: true,
      schema: [
        organizationSchema(),
        softwareSchema({ path: PATH, description: DESCRIPTION }),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Revenue opportunities", path: PATH },
        ]),
      ],
    }),
  component: () => (
    <ScaffoldPage
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Revenue opportunities", path: PATH },
      ]}
      kicker="Feature"
      headline="The screen that finds money you already earned"
      subhead="Clients who quietly stopped booking, gaps in tomorrow, retail about to run out, and visits that never got a review request."
      todo="write the Opportunities content: how each signal is calculated, the win-back list, gap filling, low-stock warnings and review requests, with a screenshot of the Opportunities screen."
      links={[
        {
          label: "Salon booking software for Australian salons, barbers and beauty businesses",
          href: "/salon-booking-software-australia",
        },
        {
          label: "Client management: records, notes and history",
          href: "/features/client-management",
        },
      ]}
    />
  ),
});
