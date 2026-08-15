/**
 * The spine of the site: a salon's day in eight steps, in the order a
 * visitor should meet the software. Each step drives one frame of the
 * pinned scroller.
 */

export type Step = {
  /** Two-digit marker shown in the rail, ChainGPT style. */
  n: string;
  /** Short label for the rail. */
  rail: string;
  title: string;
  line: string;
  body: string;
  /** Three or four capability chips, shown under the copy. */
  chips: string[];
  /** Screenshot filename in /public/screenshots. */
  shot: string;
  /** Alt text — describes what the frame actually shows. */
  alt: string;
  /** Phone frames get handset chrome instead of a browser window. */
  device: "desktop" | "phone";
  /** Address shown in the window chrome. */
  url?: string;
};

export const STEPS: Step[] = [
  {
    n: "01",
    rail: "The morning",
    title: "You open the app and the day is already answered",
    line: "What do I need to know right now?",
    body: "Twelve booked, four done, eight to come. What's actually been taken against what's expected. Two hours still free. And a live card showing who is in the chair and who walks in next — re-derived from the clock every thirty seconds, so it is never stale.",
    chips: ["Today at a glance", "With you now", "Free gaps called out", "Notes on the day"],
    shot: "01-dashboard.jpg",
    alt: "Kairo's dashboard showing twelve appointments, four completed, $629.31 taken against $1,350 expected, two hours free, and Tanya Williams in the chair now.",
    device: "desktop",
    url: "luxehairstudio.kairo.app/dashboard",
  },
  {
    n: "02",
    rail: "The day book",
    title: "The diary, but it cannot be double-booked",
    line: "A column per stylist, blocks the real length of the service.",
    body: "Drag a booking to a new time or a different stylist. Drag its bottom edge to make it longer. Block out lunch, training or a whole day off with a private reason only you see — and it vanishes from online booking the moment you save it.",
    chips: ["Drag to reschedule", "Multi-service bookings", "Block out time", "Booked-online marker"],
    shot: "04-calendar-day.jpg",
    alt: "The day calendar with a colour-coded column per team member, a live now-line, blocked time and markers showing which bookings came from the public page.",
    device: "desktop",
    url: "luxehairstudio.kairo.app/calendar",
  },
  {
    n: "03",
    rail: "When plans change",
    title: "Every change asks who to tell, and how",
    line: "This is the part the others get wrong.",
    body: "Move a booking and Kairo stops to ask one question: email them, text them, both, or nothing. Only the channels that client can actually receive are offered, each showing the real address or number. No silent changes, no guessing later whether anyone was told.",
    chips: ["Email · text · both · nothing", "Leads with the old time", "15-second undo", "It refuses to lie"],
    shot: "07-notify-prompt.jpg",
    alt: "The notify prompt: moving Chantelle Dube from 1:00 PM to 1:30 PM, with options to email, text, do both, or send nothing.",
    device: "desktop",
    url: "luxehairstudio.kairo.app/calendar",
  },
  {
    n: "04",
    rail: "The client book",
    title: "Everything you know about them, wherever you are",
    line: "Notes that follow the client, not the appointment.",
    body: "Lifetime spend, every past visit, every invoice. Anything typed on a booking is copied to their record as a dated line, so the colour formula you wrote in March surfaces by itself in September. Import from a spreadsheet, merge duplicates, and never create two of the same person.",
    chips: ["Full visit history", "Dated notes", "Import from Excel", "Merge duplicates"],
    shot: "09-client-profile.jpg",
    alt: "A client profile showing lifetime spend, upcoming visits, full appointment history, invoices and dated notes.",
    device: "desktop",
    url: "luxehairstudio.kairo.app/clients",
  },
  {
    n: "05",
    rail: "Getting paid",
    title: "From the chair to the bank without a second app",
    line: "Bill today's appointment or ring up a walk-in in a few taps.",
    body: "Services, retail, custom lines and discounts. Card, cash, transfer, or a secure pay-link the customer opens on their own phone — Apple Pay and Google Pay appear there. The receipt sends itself the moment the payment lands, and a refund puts the stock back on the shelf.",
    chips: ["Point of sale", "Pay by link", "Receipts sent automatically", "Deposits up front"],
    shot: "11-pos.jpg",
    alt: "Point of sale with the visit and a retail product on the bill, tax calculated, and a one-tap charge button.",
    device: "desktop",
    url: "luxehairstudio.kairo.app/pos",
  },
  {
    n: "06",
    rail: "The messages",
    title: "The single biggest no-show reducer, running itself",
    line: "Nothing sends silently. Nothing fails silently.",
    body: "Confirmations the moment a booking is made. Reminders the number of hours ahead you choose. Review requests after the visit. Email, SMS or both, set per message type — and a complete log of every message, its channel, its status and exactly what happened to it.",
    chips: ["Confirmations", "Reminders", "Review requests", "A complete log"],
    shot: "14-messages.jpg",
    alt: "The message log listing every confirmation, reminder, receipt and reschedule with its delivery status.",
    device: "desktop",
    url: "luxehairstudio.kairo.app/messages",
  },
  {
    n: "07",
    rail: "The shopfront",
    title: "The booking page that never closes",
    line: "Only real openings are ever offered.",
    body: "Your own link, branded to your business. Customers pick as many services as they like and the duration and price add up. Availability is computed from actual bookings, blocked time and opening hours — then re-checked at the moment of confirming, so two people tapping at once still cannot double-book you.",
    chips: ["Your own branded link", "Pick any services", "Real openings only", "Cancel link included"],
    shot: "19-booking-services.jpg",
    alt: "The public booking page for Luxe Hair Studio, showing service categories with durations and prices and a running total.",
    device: "desktop",
    url: "luxehairstudio.com/book",
  },
  {
    n: "08",
    rail: "In the hand",
    title: "The whole salon in an apron pocket",
    line: "Built for a thumb first and a desktop second.",
    body: "The same workspace on a phone — not a cut-down companion app. Installs to the home screen straight from the browser, no app store and no download. Pull down to refresh. This is where most owners actually run their day, and where most customers actually book.",
    chips: ["Installs to home screen", "No app store", "Pull to refresh", "Same full workspace"],
    shot: "23-phone-dashboard.jpg",
    alt: "The Kairo dashboard on a phone, with the day's figures stacked and the current client card in view.",
    device: "phone",
  },
];
