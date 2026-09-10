import { createFileRoute } from "@tanstack/react-router";

import { CtaBanner } from "@/components/seo/CtaBanner";
import { FaqBlock, type Faq } from "@/components/seo/FaqBlock";
import { PageHero } from "@/components/seo/Hero";
import { InternalLinks } from "@/components/seo/InternalLinks";
import { P, PageShell, Section, Todo } from "@/components/seo/PageShell";
import { ScreenshotGallery } from "@/components/seo/ScreenshotGallery";
import { breadcrumbSchema, faqSchema, organizationSchema, seo, softwareSchema } from "@/lib/seo";

const PATH = "/hair-salon-software-australia";

const FAQS: readonly Faq[] = [
  {
    question: "Can it handle a four-hour colour appointment?",
    answer:
      "Yes. Services carry their real duration, so a full-head colour occupies the diary for as long as it actually takes rather than being forced into fixed 30-minute slots. The booking page will only offer a time where the whole service fits.",
  },
  {
    question: "What about pricing that starts from an amount?",
    answer:
      "Services can be priced as a fixed amount, as a from price where the final figure depends on length and thickness, or as free for a consultation or a fringe trim. The booking page shows the price type honestly instead of pretending to a number nobody can promise.",
  },
  {
    question: "Can one visit include a cut, a colour and a treatment?",
    answer:
      "Yes. Several services can be booked into one visit, and the total time is the sum of them, so the diary and the booking page both stay accurate.",
  },
  {
    question: "Can each stylist keep their own hours?",
    answer:
      "Yes. Every stylist has their own working days, hours, colour and title. Somebody who works Wednesday to Saturday only appears as bookable Wednesday to Saturday.",
  },
  {
    question: "Where do colour formulas live?",
    answer:
      "On the client record, with their notes, past visits and any allergy or patch-test information — open on a phone at the chair, not written in a book behind the desk.",
  },
  {
    question: "Can I book a client in every four weeks?",
    answer:
      "Yes. Repeat visits on a two, three or four-week rhythm can be set at the time of booking, which is how most regulars actually work.",
  },
];

const FITTED: readonly { t: string; b: string }[] = [
  {
    t: "Appointments as long as the work",
    b: "A full-head colour is not a 30-minute slot repeated eight times. Each service carries its true length, and the diary and booking page both respect it.",
  },
  {
    t: "From pricing and free consultations",
    b: "Fixed, from and free are all first-class price types, so a colour correction can honestly say from $180 and a consultation can be free without a workaround.",
  },
  {
    t: "Multi-service visits",
    b: "Cut, colour and treatment in one booking, timed as one block, charged as one sale at the counter.",
  },
  {
    t: "A column per stylist",
    b: "Colour-coded, side by side, so the floor is readable at a glance and nobody is double-booked.",
  },
  {
    t: "Individual working hours",
    b: "Part-timers, one late night a week, a stylist who only does Saturdays — each set once, and honoured everywhere.",
  },
  {
    t: "Recurring two, three and four-week schedules",
    b: "Regulars rebooked on their rhythm rather than remembered and chased.",
  },
  {
    t: "Formulas, notes and allergies on the record",
    b: "What was used last time, at what developer, and anything that must never be used again.",
  },
  {
    t: "Retail with real margin",
    b: "Product sold at the counter tracks cost against margin and warns before a line runs out.",
  },
];

const TITLE = "Hair Salon Software Australia | Kairo";
const DESCRIPTION =
  "Hair salon software built for real appointment work — colour, from pricing, multi-stylist columns, per-stylist hours, formulas and allergies. $400 once, $0/month.";

export const Route = createFileRoute("/hair-salon-software-australia")({
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
          { name: "Hair salon software Australia", path: PATH },
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
        { name: "Hair salon software Australia", path: PATH },
      ]}
    >
      <PageHero
        kicker="Hair"
        headline="Hair salon software for Australian salons — fitted to the work, not the other way round"
        subhead={
          <>
            Colour that runs four hours, prices that start from an amount, a floor of stylists on
            different days. Kairo was built around that, in a working Melbourne salon.
          </>
        }
        secondary={{ label: "See client records", href: "/features/client-management" }}
        screenshot={{
          src: "/screenshots/04-calendar-day.jpg",
          alt: "The Kairo hair salon diary showing a day with a colour-coded column for each stylist",
        }}
      />

      <Section kicker="01" title="Where generic booking tools fall over">
        <P>
          Most booking software is built around a fixed slot: pick a 30-minute window, pick a
          person, done. Hair does not work that way. A full-head colour with a cut can hold a chair
          for four hours, the price genuinely depends on length and thickness, and the person doing
          it works three days a week.
        </P>
        <P>
          Force that into slot-shaped software and you get the familiar mess — double bookings, a
          booking page offering times that do not really exist, and prices on the website that
          nobody can honour at the counter.
        </P>
      </Section>

      <Section kicker="02" title="What is built in for hair">
        <div className="grid gap-px bg-line sm:grid-cols-2">
          {FITTED.map((f) => (
            <div key={f.t} className="bg-ground p-6">
              <h3 className="text-[16px] font-semibold leading-snug text-ink">{f.t}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-2">{f.b}</p>
            </div>
          ))}
        </div>
      </Section>

      <ScreenshotGallery
        heading="The diary and the client record"
        shots={[
          {
            src: "/screenshots/06-appointment-editor.jpg",
            alt: "Editing a hair appointment in Kairo with multiple services and their true durations",
            caption: "One visit, several services, timed as the work actually runs.",
          },
          {
            src: "/screenshots/09-client-profile.jpg",
            alt: "A Kairo client record showing colour notes, allergies and previous visits",
            caption: "Formulas, notes and allergies on the record, open at the chair.",
          },
          {
            src: "/screenshots/10-services.jpg",
            alt: "Kairo service menu showing fixed, from and free price types for hair services",
            caption: "Fixed, from and free — priced the way you actually quote.",
          },
          {
            src: "/screenshots/16-settings-hours.jpg",
            alt: "Kairo working-hours settings for an individual stylist",
            caption: "Each stylist's own days and hours.",
          },
        ]}
      />

      <Section kicker="03" title="Case study: Luxe Hair Studio, Melbourne">
        <P>
          Kairo was built and is run in production for a Melbourne hair salon — the diary, the
          counter, the client records and the booking link are its day-to-day system, not a demo.
        </P>
        <Todo>
          verified before-and-after numbers for Luxe Hair Studio (admin hours saved, no-show rate,
          rebooking rate) plus written permission to publish them and the salon's name. No figures
          are shown here until those exist.
        </Todo>
      </Section>

      <FaqBlock items={FAQS} heading="Questions from salon owners" />

      <CtaBanner
        heading="See Kairo running for a Melbourne salon — book a walkthrough"
        body="A live look at the real diary, the real client records and the real booking page, then we set yours up the same way."
      />

      <InternalLinks
        links={[
          {
            label: "Salon booking software for Australian salons, barbers and beauty businesses",
            href: "/salon-booking-software-australia",
          },
          {
            label: "Client management: records, notes and history",
            href: "/features/client-management",
          },
          {
            label: "Booking software with no commission on your own clients",
            href: "/commission-free-booking-software",
          },
        ]}
      />
    </PageShell>
  );
}
