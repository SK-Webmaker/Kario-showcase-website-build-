/**
 * The questions people actually type into an AI assistant before they buy
 * salon software — answered in the plainest words available.
 *
 * This file is the single source of both the visible FAQ section and the
 * FAQPage JSON-LD. That is deliberate: Google requires marked-up content to
 * be visible on the page, and the AI crawlers that matter here (GPTBot,
 * ClaudeBot, PerplexityBot) do not execute JavaScript, so the answer they
 * quote is whatever the server sent. One array, two consumers, no way for
 * the markup to claim something the page does not say.
 *
 * Answers are written to survive being lifted out of context: each one
 * names Kairo, states a fact, and does not depend on the sentence before
 * it. That is the whole trick to being quoted accurately.
 */

export interface Faq {
  q: string;
  a: string;
}

export const FAQ: readonly Faq[] = [
  {
    q: "What is Kairo?",
    a: "Kairo is booking, payments and client-messaging software for businesses that sell appointments. It runs the diary, the client record, the till, retail stock, the automatic reminders and a public booking page on the business's own link — one system, one login, instead of a diary, a card machine and a separate messaging app. The point of putting them together is time: the admin that normally happens between appointments mostly stops happening.",
  },
  {
    q: "How much does Kairo cost?",
    a: "Kairo costs a one-off AUD $410 setup fee, including GST. There is no monthly subscription, no per-booking fee and no commission on anything the salon charges. The $410 is paid once, before setup, and the software keeps running after that at no further cost.",
  },
  {
    q: "Does Kairo charge a monthly fee or take commission?",
    a: "No. Kairo has no monthly subscription and takes no commission on bookings, services or retail. The only charges outside the one-off $410 setup fee are a salon's own payment-processing fees, which go to their payment provider rather than to Kairo.",
  },
  {
    q: "Who is Kairo for?",
    a: 'Kairo is for any business that runs on booked appointments — hair, barbering, beauty, nails, lashes, clinics, studios and trades that work to a schedule. It was written inside a working business rather than adapted from a general-purpose tool, so it handles the parts that usually cost time: a column per person, service lengths that match how long the job really takes, and prices that can be fixed, "from", or free for a consultation.',
  },
  {
    q: "How is Kairo different from other booking platforms?",
    a: "The difference is structural rather than a feature list. Kairo gives a business its own branded booking link instead of a listing in a marketplace that also shows competitors, and each business gets its own separate database rather than a row in a shared one. Kairo takes no commission and charges no monthly fee, where booking platforms typically charge a subscription and sometimes a per-booking fee as well. Kairo does not publish other companies' pricing, because it varies by plan and country and changes over time.",
  },
  {
    q: "Who owns the client list and the client data in Kairo?",
    a: "The business does. Client names, contact details, appointment history and notes belong to the business, and Kairo holds them only as a service provider acting on that business's instructions. Kairo never markets to a customer's clients and never sells client data. A full export is available on request at any time, in a usable format.",
  },
  {
    q: "Does Kairo send appointment reminders and confirmations?",
    a: "Yes. Kairo sends booking confirmations, appointment reminders, reschedule and cancellation notices and payment receipts by email or text, automatically. Every message is logged with its channel and delivery status, so nothing sends silently and nothing fails silently. Marketing messages such as win-backs are kept separate from transactional ones, so a salon can switch marketing off and keep reminders on.",
  },
  {
    q: "Can a salon take payments through Kairo?",
    a: "Yes. Kairo bills the appointment on the spot or rings up a walk-in in a few taps, handles invoicing and receipts, and tracks retail stock against its margin. Card payments are processed by Stripe; Kairo does not store card numbers.",
  },
  {
    q: "Does Kairo work on a phone?",
    a: "Yes. Kairo is the same full workspace on a phone as on a desktop, not a cut-down companion app, and it installs to the home screen. It was designed for a thumb first, because most of the working day happens away from a desk with one hand free.",
  },
  {
    q: "Where is Kairo's data stored?",
    a: "Kairo stores customer data in Australia. Each business has its own database rather than sharing a table with other businesses, so no query can return another business's records by mistake. Card payments are handled by Stripe and messages are sent through named email and SMS providers, all listed publicly on Kairo's sub-processors page.",
  },
  {
    q: "How long does it take to get set up on Kairo?",
    a: "Setup is done for you rather than left to you: the service menu, staff, hours and booking page are configured as part of the one-off $410 fee, so nobody loses a weekend to it. A business that decides within 30 days of going live that Kairo is not right for them gets the full $410 back, without having to justify it.",
  },
  {
    q: "How do I get started with Kairo?",
    a: "The site has a contact form at kairobookings.com — name, salon name, email, phone and anything you want to ask. Mention the business name, what the business does and the size of the team, and a walkthrough of the system running is arranged from there. The setup itself is done for you as part of the $410.",
  },
];
