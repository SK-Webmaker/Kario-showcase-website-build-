import { createFileRoute } from "@tanstack/react-router";

import { ScaffoldPage } from "@/components/seo/ScaffoldPage";
import { breadcrumbSchema, organizationSchema, seo, softwareSchema } from "@/lib/seo";

const PATH = "/features/payments-pos";
const TITLE = "Salon POS & Payments Software | Kairo";
const DESCRIPTION =
  "Point of sale, invoices and receipts built into the diary, with card payments through Stripe including Apple Pay and Google Pay. No commission added by Kairo.";

export const Route = createFileRoute("/features/payments-pos")({
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
          { name: "Payments and POS", path: PATH },
        ]),
      ],
    }),
  component: () => (
    <ScaffoldPage
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Payments and POS", path: PATH },
      ]}
      kicker="Feature"
      headline="A counter that already knows what the appointment was"
      subhead="Services and retail on one sale, invoices and receipts out of the same system, and card payments through Stripe at Stripe's own rates."
      todo="write the payments content: sale flow from the diary, split and part payments, deposits, refunds, receipts and invoices, retail stock and margin, and exactly how Stripe fees are charged. Add POS and invoice screenshots."
      links={[
        {
          label: "Commission-free booking software for Australian salons",
          href: "/commission-free-booking-software",
        },
        { label: "Salon software with no monthly fee", href: "/no-monthly-fee-salon-software" },
      ]}
    />
  ),
});
