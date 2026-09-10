/**
 * The showcase strip that sits directly under the opening sequence.
 *
 * Eight real captures, not mockups — the same system the day-in-the-life
 * walkthrough further down uses. Each caption names the part of the job it
 * does rather than the screen it is, because a visitor five seconds into
 * the page is asking "can it do the thing I do", not "what is this menu
 * called".
 */

export interface Shot {
  src: string;
  /** Shown under the frame, monospace. Two or three words. */
  label: string;
  /** The line that appears when the shot is opened full size. */
  note: string;
  alt: string;
  device: "browser" | "phone";
  url?: string;
}

export const GALLERY: readonly Shot[] = [
  {
    src: "/gallery/dashboard.jpg",
    label: "The morning",
    note: "Everything the day holds, before anyone has asked you a question.",
    alt: "Kairo dashboard: twelve appointments today, four done, takings against expected, and who is in the chair right now.",
    device: "browser",
    url: "app.kairo.app/dashboard",
  },
  {
    src: "/gallery/calendar.jpg",
    label: "The diary",
    note: "A column per person, each block the real length of the job. It cannot be double-booked.",
    alt: "The Kairo calendar in day view, three staff columns with colour-coded appointments and a blocked delivery slot.",
    device: "browser",
    url: "app.kairo.app/calendar",
  },
  {
    src: "/gallery/services.jpg",
    label: "The menu",
    note: "Fixed prices, “from” prices for anything that varies by job, and free for a consultation.",
    alt: "The services list grouped into categories, each with a price and a duration.",
    device: "browser",
    url: "app.kairo.app/services",
  },
  {
    src: "/gallery/client.jpg",
    label: "The client",
    note: "Every visit, every invoice, and the notes that matter — on one card.",
    alt: "A client record showing upcoming bookings, full visit history, invoices and lifetime spend.",
    device: "browser",
    url: "app.kairo.app/clients",
  },
  {
    src: "/gallery/pos.jpg",
    label: "Getting paid",
    note: "Bill the appointment or ring up a walk-in, service and retail on one sale.",
    alt: "The point of sale with a service and a retail product on one sale, subtotal, GST and total.",
    device: "browser",
    url: "app.kairo.app/pos",
  },
  {
    src: "/gallery/messages.jpg",
    label: "The messages",
    note: "Every confirmation, reminder and receipt, with the status it was delivered under.",
    alt: "The message log listing confirmations, reminders and receipts by channel with delivery status.",
    device: "browser",
    url: "app.kairo.app/messages",
  },
  {
    src: "/gallery/booking.jpg",
    label: "What they see",
    note: "Your own link, your name at the top, and only the times you can actually take.",
    alt: "The public booking page showing the business name, a date strip and the available times.",
    device: "browser",
    url: "luxehairstudio.kairo.app",
  },
  {
    src: "/gallery/phone.jpg",
    label: "In the hand",
    note: "The whole workspace on a phone. Not a cut-down companion app.",
    alt: "The Kairo dashboard running on a phone.",
    device: "phone",
  },
];
