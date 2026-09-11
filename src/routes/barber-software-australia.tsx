import { createFileRoute } from "@tanstack/react-router";

import { ScaffoldPage } from "@/components/seo/ScaffoldPage";
import { breadcrumbSchema, organizationSchema, seo, softwareSchema } from "@/lib/seo";

const PATH = "/barber-software-australia";
const TITLE = "Barber Software Australia | Kairo";
const DESCRIPTION =
  "Barbershop software for walk-ins, short back-to-back appointments and a chair per barber. $410 once, $0/month, no commission.";

export const Route = createFileRoute("/barber-software-australia")({
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
          { name: "Barber software Australia", path: PATH },
        ]),
      ],
    }),
  component: () => (
    <ScaffoldPage
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Barber software Australia", path: PATH },
      ]}
      kicker="Barbering"
      headline="Barber software for Australian barbershops"
      subhead="Walk-ins beside booked appointments, a chair per barber, and short services that run back to back all day."
      todo="write the barbershop content: walk-in queue handling, back-to-back short services, chair-per-barber columns, tip and card handling at the counter, and original barbershop screenshots."
      links={[
        {
          label: "Salon booking software for Australian salons, barbers and beauty businesses",
          href: "/salon-booking-software-australia",
        },
        {
          label: "Commission-free booking software for Australian salons",
          href: "/commission-free-booking-software",
        },
      ]}
    />
  ),
});
