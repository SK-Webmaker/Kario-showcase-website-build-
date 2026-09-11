import { createFileRoute } from "@tanstack/react-router";

import { ScaffoldPage } from "@/components/seo/ScaffoldPage";
import { breadcrumbSchema, organizationSchema, seo, softwareSchema } from "@/lib/seo";

const PATH = "/beauty-salon-software-australia";
const TITLE = "Beauty Salon Software Australia | Kairo";
const DESCRIPTION =
  "Beauty salon and nail studio software for treatment rooms, patch tests, consent notes and course bookings. $410 once, $0/month, no commission.";

export const Route = createFileRoute("/beauty-salon-software-australia")({
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
          { name: "Beauty salon software Australia", path: PATH },
        ]),
      ],
    }),
  component: () => (
    <ScaffoldPage
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Beauty salon software Australia", path: PATH },
      ]}
      kicker="Beauty"
      headline="Beauty salon software for Australian studios"
      subhead="Treatment rooms, patch tests, consent and safety notes, and repeat courses of treatment."
      todo="write the beauty content: room and resource booking, patch-test and consent record keeping, course and package handling, retail attachment, and original beauty studio screenshots."
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
