import { createFileRoute } from "@tanstack/react-router";

import { CtaBanner } from "@/components/seo/CtaBanner";
import { FaqBlock, type Faq } from "@/components/seo/FaqBlock";
import { PageHero } from "@/components/seo/Hero";
import { InternalLinks } from "@/components/seo/InternalLinks";
import { P, PageShell, Section } from "@/components/seo/PageShell";
import { ScreenshotGallery } from "@/components/seo/ScreenshotGallery";
import { breadcrumbSchema, faqSchema, organizationSchema, seo, softwareSchema } from "@/lib/seo";

const PATH = "/salon-booking-software-australia";

const FAQS: readonly Faq[] = [
  {
    question: "Where is the data stored?",
    answer:
      "In Australia. Each business also gets its own database rather than a shared row in someone else's, so your clients and history stay separate from every other salon.",
  },
  {
    question: "Do I need to download an app?",
    answer:
      "No. Kairo runs in the browser and installs to the home screen on iOS and Android, so it behaves like an app without going near an app store.",
  },
  {
    question: "Can clients book themselves in?",
    answer:
      "Yes. You get a public booking page on your own branded link showing only real openings, based on each team member's actual hours and the true length of the service.",
  },
  {
    question: "Does it handle payments?",
    answer:
      "Yes. Point of sale, invoices and receipts are built in, and card payments run through Stripe including Apple Pay and Google Pay. Stripe charges its own processing fee; Kairo adds nothing on top.",
  },
  {
    question: "What does it cost?",
    answer:
      "A one-off $400 AUD setup fee, then $0 per month, no per-booking fee and no commission on services, retail or card payments.",
  },
  {
    question: "Can you move our existing clients across?",
    answer:
      "Yes. Client details and history are imported as part of setup, so nobody's record starts empty on day one.",
  },
];

const BLOCKS: readonly { n: string; t: string; b: string }[] = [
  {
    n: "01",
    t: "A diary that matches the real day",
    b: "A column per team member, day and week views, and appointment lengths that reflect the actual work rather than a fixed slot size. Two people cannot be booked into the same person at the same time — the diary simply will not allow it.",
  },
  {
    n: "02",
    t: "Your own branded booking link — no marketplace",
    b: "Clients book on your link, see your services and your team, and never see another business. There is no directory to be listed in and no browse page where a competitor sits next to you.",
  },
  {
    n: "03",
    t: "Client records and visit history",
    b: "Every client carries their contact details, notes, past visits, what was done and any allergy or safety information — visible the moment their name is opened, including on a phone.",
  },
  {
    n: "04",
    t: "Point of sale and payments",
    b: "Take payment at the counter for services and retail in one sale, issue an invoice or a receipt, and accept cards through Stripe with Apple Pay and Google Pay. Card fees go to Stripe at Stripe's rate.",
  },
  {
    n: "05",
    t: "Messages that go out without anyone remembering",
    b: "Booking confirmations, reminders before the appointment, cancellation notices and review requests after the visit, by email or SMS. Fewer no-shows, and nobody chasing them by hand.",
  },
  {
    n: "06",
    t: "The Opportunities screen",
    b: "A running list of quiet revenue leaks: clients who have not rebooked, gaps in tomorrow's diary, retail running low, reviews not yet asked for. It is the part of the system that pays for itself.",
  },
  {
    n: "07",
    t: "Team schedules that are actually individual",
    b: "Each person has their own working hours, days off, colour and title. Someone who only works Thursday to Saturday is only bookable Thursday to Saturday.",
  },
  {
    n: "08",
    t: "Phone-first, installs to the home screen",
    b: "The full workspace runs on a phone, not a cut-down version of it. Add it to the home screen and it opens like any other app.",
  },
];

const TITLE = "Salon Booking Software Australia | Kairo";
const DESCRIPTION =
  "Bookings, payments, client records, stock and customer messages from one login — for Australian salons, barbers and beauty businesses. $400 once, $0/month.";

export const Route = createFileRoute("/salon-booking-software-australia")({
  head: () =>
    seo({
      title: TITLE,
      description: DESCRIPTION,
      path: PATH,
      schema: [
        organizationSchema(),
        softwareSchema({ path: PATH, description: DESCRIPTION }),
        faqSchema(FAQS),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Salon booking software Australia", path: PATH },
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
        { name: "Salon booking software Australia", path: PATH },
      ]}
    >
      <PageHero
        kicker="Australia"
        headline="Salon booking software for Australian salons, barbers and beauty businesses"
        subhead={
          <>
            Bookings, payments, client records, stock and every customer message from one login —
            with the data stored in Australia. $400 once, then $0 per month.
          </>
        }
        secondary={{ label: "What it costs", href: "/no-monthly-fee-salon-software" }}
        screenshot={{
          src: "/screenshots/01-dashboard.jpg",
          alt: "The Kairo dashboard showing today's appointments, takings and revenue opportunities",
        }}
      />

      <Section kicker="What it does" title="One system instead of four">
        <P>
          Most salons run a diary, a card machine, a spreadsheet and a messaging app, and spend the
          gaps between clients stitching them together. Kairo is the single place all of it lives,
          which is where the time saving actually comes from.
        </P>
        <div className="grid gap-px bg-line sm:grid-cols-2">
          {BLOCKS.map((s) => (
            <div key={s.n} className="bg-ground p-6">
              <p className="chrome mb-3">{s.n}</p>
              <h3 className="text-[16px] font-semibold leading-snug text-ink">{s.t}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-2">{s.b}</p>
            </div>
          ))}
        </div>
      </Section>

      <ScreenshotGallery
        heading="The system, as it actually looks"
        shots={[
          {
            src: "/screenshots/05-calendar-week.jpg",
            alt: "Kairo week view of the appointment diary with a colour-coded column per team member",
            caption: "The week, one column per person.",
          },
          {
            src: "/screenshots/09-client-profile.jpg",
            alt: "A Kairo client record showing contact details, notes, allergies and past visits",
            caption: "The client record, including the things you must not forget.",
          },
          {
            src: "/screenshots/12-invoices.jpg",
            alt: "Kairo invoice list showing paid and outstanding invoices for a salon",
            caption: "Invoices and receipts, out of the same system as the diary.",
          },
          {
            src: "/screenshots/17-settings-notifications.jpg",
            alt: "Kairo notification settings for booking confirmations, reminders and review requests",
            caption: "Set the messages once; they go out on their own after that.",
          },
          {
            src: "/screenshots/23-phone-dashboard.jpg",
            alt: "The Kairo dashboard on a phone, installed to the home screen",
            caption: "The whole workspace on a phone, not a cut-down version.",
          },
          {
            src: "/screenshots/18-team.jpg",
            alt: "Kairo team settings showing each staff member's working hours, colour and title",
            caption: "Individual hours, so the booking page never offers a day someone is off.",
          },
        ]}
      />

      <FaqBlock items={FAQS} heading="Common questions from Australian salons" />

      <CtaBanner
        heading="Tell us about the business — we set your Kairo up"
        body="A short conversation about how you work, then we build the diary, the services, the team and the booking link for you."
      />

      <InternalLinks
        links={[
          {
            label: "Hair salon software for Australian salons",
            href: "/hair-salon-software-australia",
          },
          {
            label: "Barber software for Australian barbershops",
            href: "/barber-software-australia",
          },
          {
            label: "Beauty salon software for Australian studios",
            href: "/beauty-salon-software-australia",
          },
          {
            label: "The Opportunities screen: finding revenue you already earned",
            href: "/features/revenue-opportunities",
          },
          {
            label: "Commission-free booking software",
            href: "/commission-free-booking-software",
          },
          { label: "Salon software with no monthly fee", href: "/no-monthly-fee-salon-software" },
        ]}
      />
    </PageShell>
  );
}
