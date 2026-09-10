import { createFileRoute } from "@tanstack/react-router";

import { ScaffoldPage } from "@/components/seo/ScaffoldPage";
import { breadcrumbSchema, organizationSchema, seo, softwareSchema } from "@/lib/seo";

const PATH = "/features/client-management";
const TITLE = "Salon Client Management Software | Kairo";
const DESCRIPTION =
  "Client records, visit history, colour formulas, allergy and consent notes — on the record and open at the chair. Your list, your database, exportable.";

export const Route = createFileRoute("/features/client-management")({
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
          { name: "Features", path: PATH },
          { name: "Client management", path: PATH },
        ]),
      ],
    }),
  component: () => (
    <ScaffoldPage
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Client management", path: PATH },
      ]}
      kicker="Feature"
      headline="Client records that hold everything you must not forget"
      subhead="Contact details, visit history, what was used last time, and the allergy note that has to be seen before anyone starts."
      todo="write the client-management content: record structure, notes and formulas, allergy and consent handling, search and merge, export and ownership, plus screenshots of the client list and a client profile."
      links={[
        {
          label: "Hair salon software for Australian salons",
          href: "/hair-salon-software-australia",
        },
        {
          label: "Salon booking software for Australian salons, barbers and beauty businesses",
          href: "/salon-booking-software-australia",
        },
      ]}
    />
  ),
});
