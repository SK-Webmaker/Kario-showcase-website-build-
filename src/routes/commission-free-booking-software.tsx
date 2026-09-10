import { createFileRoute } from "@tanstack/react-router";

import { BreakEvenCalculator } from "@/components/seo/BreakEvenCalculator";
import { CtaBanner } from "@/components/seo/CtaBanner";
import { FaqBlock, type Faq } from "@/components/seo/FaqBlock";
import { PageHero } from "@/components/seo/Hero";
import { InternalLinks } from "@/components/seo/InternalLinks";
import { P, PageShell, Section } from "@/components/seo/PageShell";
import { ScreenshotGallery } from "@/components/seo/ScreenshotGallery";
import { breadcrumbSchema, faqSchema, organizationSchema, seo, softwareSchema } from "@/lib/seo";

const PATH = "/commission-free-booking-software";

const FAQS: readonly Faq[] = [
  {
    question: "What does commission-free actually mean?",
    answer:
      "Kairo takes no percentage of anything you charge. No fee per booking, no cut of a service, no cut of retail, and no cut of a card payment. The only money Kairo receives is the one-off $400 AUD setup fee. Card processing is charged separately by your payment provider, the same as it would be with any other system.",
  },
  {
    question: "Do marketplace platforms really charge for new clients?",
    answer:
      "Some do. Marketplace-style platforms typically list your salon publicly and charge a percentage on a client's first visit when that client is treated as coming from the marketplace. The exact percentage and the rules about who counts as new vary by provider, so check the provider's own pricing page — the comparison table on this page links to each one.",
  },
  {
    question: "Who owns the client list?",
    answer:
      "You do. Your clients, their contact details, their notes and their visit history sit in your own database, and you can export them at any time. Kairo does not market to them and does not show them another salon.",
  },
  {
    question: "Will clients see competing salons when they book?",
    answer:
      "No. Your booking page lives on your own branded link. There is no directory, no browse view and no other business anywhere on it.",
  },
  {
    question: "What happens after the $400?",
    answer:
      "Nothing further is charged. There is no monthly subscription, no per-booking fee and no commission. Updates and support are included.",
  },
];

const TITLE = "Commission-Free Booking Software AU | Kairo";
const DESCRIPTION =
  "Stop paying commission on every booking. Kairo is commission-free booking software for Australian salons. $400 once, $0/month, no per-booking fee.";

export const Route = createFileRoute("/commission-free-booking-software")({
  head: () =>
    seo({
      title: TITLE,
      description: DESCRIPTION,
      path: PATH,
      schema: [
        organizationSchema(),
        softwareSchema({
          path: PATH,
          description:
            "Commission-free booking software for Australian salons, barbers and beauty businesses. No per-booking fee and no commission on services, retail or card payments.",
        }),
        faqSchema(FAQS),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Commission-free booking software", path: PATH },
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
        { name: "Commission-free booking software", path: PATH },
      ]}
    >
      <PageHero
        kicker="Commission-free"
        headline="Commission-free booking software for Australian salons"
        subhead={
          <>
            Every percentage a platform takes comes out of work your team already did. Kairo takes
            none of it — one $400 setup, then nothing per month, per booking or per client.
          </>
        }
        secondary={{
          label: "See the no-monthly-fee maths",
          href: "/no-monthly-fee-salon-software",
        }}
      />

      <Section kicker="01" title="How salon commissions actually work">
        <P>
          A commission model charges a share of the money you take rather than a flat fee for the
          software. It usually shows up in three places: a percentage on a client's first visit when
          the platform decides that client came from its marketplace, a percentage or flat fee on
          each online booking, and a margin on card processing above what the payment provider
          charges.
        </P>
        <P>
          None of those are visible on a monthly invoice, which is what makes them easy to miss.
          They scale with your success: the busier you get and the higher your prices, the more the
          platform earns from the same software.
        </P>
        <P>
          Exact rates change, so this page does not quote them from memory. The table below is built
          from a table we maintain, with a link to each provider's own pricing page and the date it
          was last checked.
        </P>
      </Section>

      <BreakEvenCalculator heading="Work out what commission costs you" />

      <Section kicker="02" title={`What "commission-free" means at Kairo`}>
        <P>
          No fee per booking, whether it came from your booking link, a phone call or a walk-in. No
          commission on services. No commission on retail. No commission on card payments — your
          card fees go to your payment provider, at their rate, and Kairo adds nothing on top.
        </P>
        <P>
          The one-off $400 covers setup: your services and prices, your team and their hours, your
          diary rules and your branded booking link, built for you rather than left as homework.
          After that the running cost of the software is zero.
        </P>
      </Section>

      <Section kicker="03" title="Your client list is yours, and there is no marketplace">
        <P>
          Your business gets its own database. Client records, notes, allergies and visit history
          belong to you and can be exported whenever you want. Nobody is marketed to on the side.
        </P>
        <P>
          The booking page runs on your own branded link. A client who lands on it sees your
          services and your team — never a list of other salons who paid to be there.
        </P>
      </Section>

      <ScreenshotGallery
        heading="The diary, the counter and the booking page"
        shots={[
          {
            src: "/screenshots/04-calendar-day.jpg",
            alt: "Kairo appointment diary showing a day of bookings in a column per team member",
            caption: "A column per person, and no way to double-book one of them.",
          },
          {
            src: "/screenshots/11-pos.jpg",
            alt: "Kairo point of sale screen with services and retail products on one sale",
            caption: "Services and retail on one sale, with no commission taken from either.",
          },
          {
            src: "/screenshots/19-booking-services.jpg",
            alt: "Kairo public booking page listing a salon's services and prices on its own branded link",
            caption: "Your booking page, on your own link. No competitors on it.",
          },
          {
            src: "/screenshots/25-phone-booking.jpg",
            alt: "The Kairo booking page on a phone, with a time being chosen",
            caption: "Most clients book from a phone, so that is what it is built for.",
          },
        ]}
      />

      <FaqBlock items={FAQS} heading="Commission-free, answered plainly" />

      <CtaBanner />

      <InternalLinks
        links={[
          {
            label: "Salon software with no monthly fee — the total cost over three years",
            href: "/no-monthly-fee-salon-software",
          },
          {
            label: "Client management: records, notes and history",
            href: "/features/client-management",
          },
          {
            label: "Salon booking software for Australian salons, barbers and beauty businesses",
            href: "/salon-booking-software-australia",
          },
        ]}
      />
    </PageShell>
  );
}
