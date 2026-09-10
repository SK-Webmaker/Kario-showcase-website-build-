import { createFileRoute } from "@tanstack/react-router";

import { CtaBanner } from "@/components/seo/CtaBanner";
import { PageHero } from "@/components/seo/Hero";
import { InternalLinks } from "@/components/seo/InternalLinks";
import { P, PageShell, Section, Todo } from "@/components/seo/PageShell";
import { breadcrumbSchema, organizationSchema, seo } from "@/lib/seo";

const PATH = "/about";
const TITLE = "About Kairo Bookings | Built in a Melbourne Salon";
const DESCRIPTION =
  "Kairo Bookings is Australian salon software built and run in production for a Melbourne salon. One-off $400 setup, no monthly fee, data stored in Australia.";

export const Route = createFileRoute("/about")({
  head: () =>
    seo({
      title: TITLE,
      description: DESCRIPTION,
      path: PATH,
      schema: [
        organizationSchema(),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: PATH },
        ]),
      ],
    }),
  component: Page,
});

function Page() {
  return (
    <PageShell
      crumbs={[
        { name: "Home", path: "/" },
        { name: "About", path: PATH },
      ]}
    >
      <PageHero
        kicker="About"
        headline="Built in a working salon, not in a boardroom"
        subhead="Kairo Bookings began as the system one Melbourne salon needed and could not buy: a diary that matched the real work, a booking link of its own, and no percentage leaving the till."
      />

      <Section kicker="01" title="Why it exists">
        <P>
          Software for appointment businesses tends to be built for a spreadsheet-shaped version of
          the day. Real salons have four-hour colours, prices that start from an amount, part-time
          stylists and a counter that has to take a card while someone waits. Kairo was written
          against that reality, in production, with the people using it standing there.
        </P>
        <P>
          The pricing follows the same instinct. A salon should not pay a percentage of its own
          takings for the privilege of writing bookings down. One-off $400 setup, then nothing.
        </P>
      </Section>

      <Section kicker="02" title="Where your data lives">
        <P>
          In Australia, and in a database belonging to your business rather than a shared table.
          Your client list is exportable at any time, and Kairo does not market to your clients or
          list your salon beside anybody else&apos;s.
        </P>
      </Section>

      <Section kicker="03" title="Who is behind it">
        <Todo>
          confirm the founding story, the trading entity name and ABN, and whether the Melbourne
          salon has given permission to be named. Nothing is published here until you confirm it.
        </Todo>
      </Section>

      <CtaBanner />

      <InternalLinks
        links={[
          {
            label: "Salon booking software for Australian salons, barbers and beauty businesses",
            href: "/salon-booking-software-australia",
          },
          { label: "Salon software with no monthly fee", href: "/no-monthly-fee-salon-software" },
          { label: "How your data is handled", href: "/legal/security" },
        ]}
      />
    </PageShell>
  );
}
