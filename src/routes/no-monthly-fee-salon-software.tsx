import { createFileRoute } from "@tanstack/react-router";

import { BreakEvenCalculator } from "@/components/seo/BreakEvenCalculator";
import { CtaBanner } from "@/components/seo/CtaBanner";
import { FaqBlock, type Faq } from "@/components/seo/FaqBlock";
import { PageHero } from "@/components/seo/Hero";
import { InternalLinks } from "@/components/seo/InternalLinks";
import { P, PageShell, Section } from "@/components/seo/PageShell";
import { breadcrumbSchema, faqSchema, organizationSchema, seo, softwareSchema } from "@/lib/seo";

const PATH = "/no-monthly-fee-salon-software";

const INCLUDED: readonly [string, string][] = [
  [
    "Your services and prices",
    "Fixed, from and free price types, set up with you rather than left as a blank menu.",
  ],
  [
    "Your team",
    "Every person, their working hours, their colour and what they are allowed to see.",
  ],
  [
    "Your diary rules",
    "Appointment lengths that match the real work, so a colour is not squeezed into a half-hour slot.",
  ],
  [
    "Your branded booking link",
    "A public booking page on your own link, showing only openings that genuinely exist.",
  ],
  [
    "Client messaging",
    "Confirmations, reminders, cancellation notices and review requests, switched on and worded for you.",
  ],
  [
    "Payments and the counter",
    "Point of sale, invoices and receipts, with card payments through Stripe at Stripe's rates.",
  ],
  [
    "Your existing clients",
    "Imported from whatever you use now, so nobody's history starts from zero.",
  ],
  ["Updates and support", "Included. There is no upgrade tier holding a feature back."],
];

const VERSUS: readonly [string, string, string][] = [
  ["Monthly cost", "$29–$79 per month, forever", "$0 per month, forever"],
  ["Setup", "Usually your own weekend", "$410 once, done with you"],
  ["Per-booking fee", "Common on marketplace plans", "None"],
  ["Commission on services or retail", "Sometimes, on first visits", "None"],
  ["Client list", "Held on the platform", "Your own database, exportable"],
  ["Booking page", "Often a shared marketplace listing", "Your own branded link only"],
  ["Price rises", "At the vendor's discretion", "Nothing left to raise"],
];

const FAQS: readonly Faq[] = [
  {
    question: "Is $410 really the only payment?",
    answer:
      "Yes. It is a one-off setup fee of $410 AUD including GST. There is no monthly subscription, no per-booking fee and no commission. Card processing is billed by your payment provider at their rate, as it would be with any system.",
  },
  {
    question: "What is the catch on a no-monthly-fee model?",
    answer:
      "Kairo is a newer name than the large subscription platforms, and there is money to pay up front rather than spread across the year. In exchange the running cost is zero and there is no percentage of your takings leaving the business.",
  },
  {
    question: "How quickly does $410 pay for itself?",
    answer:
      "Against a $49 per month subscription it is about nine months, and the subscription keeps charging afterwards. Against a 20% new-client commission on an $85 ticket, roughly 24 first visits. Use the calculator on this page with your own numbers.",
  },
  {
    question: "What if I want to leave?",
    answer:
      "Export your clients, services and history and go. Nothing is held hostage, and there is no contract to run out.",
  },
  {
    question: "Do I need to buy hardware?",
    answer:
      "No. Kairo runs in the browser and installs to a phone or tablet home screen, so most salons use the device already on the counter.",
  },
];

const TITLE = "No-Monthly-Fee Salon Software AU | Kairo";
const DESCRIPTION =
  "Salon software with no monthly subscription and no per-booking fee. One $410 setup, then $0/month, forever. Built and run for a Melbourne salon.";

export const Route = createFileRoute("/no-monthly-fee-salon-software")({
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
            "Salon booking, payments and client management software with no monthly subscription. One-off $410 AUD setup, then $0 per month.",
        }),
        faqSchema(FAQS),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "No-monthly-fee salon software", path: PATH },
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
        { name: "No-monthly-fee salon software", path: PATH },
      ]}
    >
      <PageHero
        kicker="No monthly fee"
        headline="Salon software with no monthly fee — $410 once, then nothing"
        subhead={
          <>
            A subscription is a bill that arrives whether the week was busy or quiet. Kairo is paid
            for once, set up for you, and then costs nothing to keep running.
          </>
        }
        secondary={{
          label: "See what commission-free means",
          href: "/commission-free-booking-software",
        }}
      />

      <Section kicker="01" title="What a subscription actually costs over time">
        <P>
          Salon platforms commonly sit between $29 and $79 a month for a single-site salon with a
          small team. At $29 a month a $410 one-off is passed in about fifteen months. At $79 it
          takes six. After that the subscription simply keeps going, and the total keeps climbing
          for the rest of the time you are in business.
        </P>
        <P>
          Put a three-year frame around it and the shape is clear: $49 a month is $1,764 before a
          single percentage of commission. The same three years of Kairo is $410.
        </P>
      </Section>

      <BreakEvenCalculator heading="Your numbers, not ours" />

      <Section kicker="02" title="Break-even at five visits on an $85 ticket">
        <P>
          Here is the version you can do in your head. On an average ticket of $85, five visits is
          $425 — so if a platform is costing you the equivalent of roughly one client a month, the
          entire $410 is covered by five appointments. Everything after that is money the business
          keeps.
        </P>
        <P>
          The same maths applied to commission: 20% of an $85 first visit is $17. Twenty-five new
          clients and you have handed over more than Kairo costs in total, once, forever.
        </P>
      </Section>

      <Section kicker="03" title="What the $410 includes">
        <dl className="grid gap-px bg-line sm:grid-cols-2">
          {INCLUDED.map(([k, v]) => (
            <div key={k} className="bg-ground p-5">
              <dt className="text-[14.5px] font-semibold text-ink">{k}</dt>
              <dd className="mt-2 text-[14px] leading-relaxed text-ink-2">{v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section kicker="04" title="What you are used to, against Kairo">
        <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <caption className="sr-only">
              Typical subscription salon software compared with Kairo
            </caption>
            <thead>
              <tr className="border-b border-line-2">
                <th scope="col" className="chrome py-3 pr-6">
                  &nbsp;
                </th>
                <th scope="col" className="chrome py-3 pr-6">
                  Typical subscription platform
                </th>
                <th scope="col" className="chrome py-3 pr-6">
                  Kairo
                </th>
              </tr>
            </thead>
            <tbody>
              {VERSUS.map(([label, them, us]) => (
                <tr key={label} className="border-b border-line align-top">
                  <th scope="row" className="py-4 pr-6 text-[14.5px] font-semibold text-ink">
                    {label}
                  </th>
                  <td className="py-4 pr-6 text-[14px] text-ink-2">{them}</td>
                  <td className="py-4 pr-6 text-[14px] text-ink">{us}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="v2-body opacity-50">
          The subscription column describes the common shape of these plans, not any one provider's
          current price. Kairo does not publish other companies' pricing: it varies by plan and
          country and changes over time, so the only figure asserted here is Kairo's own.
        </p>
      </Section>

      <FaqBlock items={FAQS} heading="The money questions" />

      <CtaBanner
        heading="Tell us about your business — we set your Kairo up"
        body="We build the diary, the services, the team and the booking link with you, then hand over a system that costs nothing to run."
      />

      <InternalLinks
        links={[
          {
            label: "Commission-free booking software for Australian salons",
            href: "/commission-free-booking-software",
          },
          {
            label: "Salon booking software for Australian salons, barbers and beauty businesses",
            href: "/salon-booking-software-australia",
          },
          {
            label: "Hair salon software fitted to real colour appointments",
            href: "/hair-salon-software-australia",
          },
        ]}
      />
    </PageShell>
  );
}
