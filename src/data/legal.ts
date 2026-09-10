/**
 * The ten legal documents, as data.
 *
 * Text only — no markup beyond a tiny inline syntax the renderer
 * understands: **bold**, *italic*, and [label](/href). Keeping it here
 * rather than in ten route files means a policy change is one edit in one
 * place, and each [[TOKEN]] below is a single find-and-replace.
 *
 * Seven business facts still to fill in: [[BUSINESS NAME]], [[ABN]],
 * [[ADDRESS]], [[CONTACT EMAIL]], [[HOSTING PROVIDER]], [[EMAIL PROVIDER]]
 * and [[SMS PROVIDER]]. Everything else — dates, notice periods, response
 * windows, retention — is settled.
 */

export type Block =
  | { kind: "h"; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: readonly string[] }
  | { kind: "note"; text: string }
  | { kind: "table"; head: readonly string[]; rows: readonly (readonly string[])[] };

export interface LegalDoc {
  slug: string;
  title: string;
  /** One line, used on the index and as the page's meta description. */
  summary: string;
  updated: string;
  blocks: readonly Block[];
}

const UPDATED = "21 August 2026";

export const LEGAL: readonly LegalDoc[] = [
  // ------------------------------------------------------------------ 01
  {
    slug: "privacy",
    title: "Privacy Policy",
    summary: "What we hold, and the difference between your data and your clients' data.",
    updated: UPDATED,
    blocks: [
      {
        kind: "h",
        text: "Who we are",
      },
      {
        kind: "p",
        text: "Kairo is run by **[[BUSINESS NAME]]** (ABN [[ABN]]) of [[ADDRESS]]. In this policy that's “we” and “us”. You can reach us at [[CONTACT EMAIL]].",
      },
      {
        kind: "p",
        text: "We handle personal information under the *Privacy Act 1988* (Cth) and the Australian Privacy Principles.",
      },
      { kind: "h", text: "Two different relationships" },
      {
        kind: "p",
        text: "This matters more than anything else here, so it comes first.",
      },
      {
        kind: "ul",
        items: [
          "**Your information.** If you are a salon or barbershop using Kairo, we hold your business's information and this policy covers how we treat it.",
          "**Your clients' information.** The names, contact details, appointment history and notes your business records about the people it serves. That belongs to your business. We hold it **for you and on your instructions**. We don't use it for our own purposes, we don't sell it, and we never market to your clients. The [Data Processing Addendum](/legal/dpa) sets that out in full.",
        ],
      },
      {
        kind: "p",
        text: "If you're a client of a salon that uses Kairo and want to see, change or delete what's held about you, ask the salon. They control that record. We'll help them action it.",
      },
      { kind: "h", text: "What we collect from you" },
      {
        kind: "ul",
        items: [
          "Business and contact details, and what we need to set up your booking page.",
          "Billing records — what you paid and when. Card details are handled by our payment provider; we don't store card numbers.",
          "What you send us when you ask for help.",
          "Sign-in times, IP address and browser information, kept for security and troubleshooting.",
        ],
      },
      { kind: "h", text: "Health information in client notes" },
      {
        kind: "p",
        text: "Kairo lets you record notes against a client or an appointment. In a salon those often include **allergies, patch-test results and product reactions**. Under the Privacy Act that's health information, and it gets stronger protection than ordinary personal information.",
      },
      {
        kind: "note",
        text: "**This one is on you as well as us.** If you record a client's allergy or patch test, you need their consent to collect it, and you can only use it to carry out their service safely. Kairo gives you a secure place to put it. It does not get that consent for you — ask at the patch test and note that you asked.",
      },
      {
        kind: "p",
        text: "We don't read your client notes, except where you ask us to while helping you, or where the law requires it.",
      },
      { kind: "h", text: "What we use information for" },
      {
        kind: "ul",
        items: [
          "Running, maintaining and supporting the service.",
          "Taking payment and keeping the financial records we're required to keep.",
          "Contacting you about your account, billing, security and changes.",
          "Investigating misuse and meeting legal obligations.",
          "Improving the software — using aggregated or de-identified information wherever that will do the job.",
        ],
      },
      {
        kind: "p",
        text: "We don't sell personal information, and we don't use your client list to market anything to anyone.",
      },
      { kind: "h", text: "Who else sees it" },
      {
        kind: "p",
        text: "Only the providers we need to run the service, listed in [Sub-processors](/legal/sub-processors), and only what each of them needs. We may also disclose information where the law, a court or someone's safety requires it.",
      },
      { kind: "h", text: "Where it's held" },
      {
        kind: "p",
        text: "Your data is held in **Australia**. Some of the providers we use may process information overseas — the sub-processors table says which and where. Where information goes overseas we take reasonable steps to see it's handled consistently with the Australian Privacy Principles.",
      },
      { kind: "h", text: "How long we keep it" },
      {
        kind: "ul",
        items: [
          "**While you're a customer** — for as long as you use Kairo.",
          "**After you stop** — we keep your data for **60 days** so you can ask for an export, then delete it within a further **30 days**. Ask us to delete it sooner and we will.",
          "**Financial records** — five years, as Australian tax law requires.",
          "**Backups** — deleted data can sit in a backup until that backup rotates out, which takes up to **90 days**.",
        ],
      },
      { kind: "h", text: "Security" },
      {
        kind: "p",
        text: "The [Security Overview](/legal/security) has the detail. No system is perfectly secure and we don't claim otherwise.",
      },
      { kind: "h", text: "If something goes wrong" },
      {
        kind: "p",
        text: "If there's a breach likely to cause serious harm, we'll notify the Office of the Australian Information Commissioner and the people affected, as the Notifiable Data Breaches scheme requires. Where it concerns your clients' data we'll tell **you** as soon as practicable — normally within 72 hours of confirming it — so you can meet your own obligations, and we'll help you do it.",
      },
      { kind: "h", text: "Access, correction and complaints" },
      {
        kind: "p",
        text: "To see or correct what we hold about your business, email [[CONTACT EMAIL]]. We'll respond within 30 days. If you're unhappy with how we've handled your information, tell us first and we'll try to sort it out. If you're still unhappy you can complain to the OAIC at [oaic.gov.au](https://www.oaic.gov.au).",
      },
      { kind: "h", text: "Changes" },
      {
        kind: "p",
        text: "We may update this policy. If a change materially affects you we'll email you at least 14 days before it takes effect. The current version is always at kairobookings.com/legal/privacy.",
      },
    ],
  },

  // ------------------------------------------------------------------ 02
  {
    slug: "terms",
    title: "Customer Terms",
    summary: "The agreement between Kairo and the business using it.",
    updated: UPDATED,
    blocks: [
      { kind: "h", text: "1. The agreement" },
      {
        kind: "p",
        text: "These terms are between **[[BUSINESS NAME]]** (“Kairo”, “we”) and the business named on the order (“you”). Paying the setup fee or using the service means you accept them.",
      },
      { kind: "h", text: "2. What you get" },
      {
        kind: "p",
        text: "Your own instance of Kairo: bookings and calendar, client records, point of sale and invoicing, retail stock, automated client messaging, a public booking page on your own link, and the settings to run all of it. Your instance is yours alone — your data isn't pooled with any other business.",
      },
      { kind: "h", text: "3. What it costs" },
      {
        kind: "ul",
        items: [
          "A one-off setup fee of **AUD $400 including GST**, payable before we set you up.",
          "**No monthly subscription**, no per-booking fee, and no commission on anything you charge.",
        ],
      },
      { kind: "h", text: "4. What the $400 doesn't cover" },
      {
        kind: "ul",
        items: [
          "Payment processing fees charged by your payment provider.",
          "Your own hardware, internet connection and card terminal.",
          "Text-message costs where your volume is unusually high. Ordinary reminder and confirmation volumes are included. If your usage reaches a level where the cost is significant, we'll talk to you before charging anything, and you can turn messaging down or off instead.",
          "Work well beyond setting the system up — rebuilding your booking page after a rebrand, migrating you from another system with a large amount of historical data, or on-site training. We'll quote before doing any of it, and you're free to say no.",
        ],
      },
      { kind: "h", text: "5. Your data is yours" },
      {
        kind: "p",
        text: "You own everything you and your clients put into Kairo. We claim no ownership of it. Ask for a full export whenever you like and we'll provide it in a usable format within 14 days. We handle that data as your service provider under the [Data Processing Addendum](/legal/dpa).",
      },
      { kind: "h", text: "6. What we ask of you" },
      {
        kind: "ul",
        items: [
          "Keep your logins secure and don't share them.",
          "Collect client information lawfully, including consent for anything health related.",
          "Only message people who may lawfully be messaged — see [Client Messaging & Consent](/legal/messaging).",
          "Follow the [Acceptable Use Policy](/legal/acceptable-use).",
          "Keep your own copy of any export you rely on for tax or legal purposes.",
        ],
      },
      { kind: "h", text: "7. Availability and support" },
      {
        kind: "p",
        text: "We aim to keep Kairo available at all times, but we don't guarantee uninterrupted access. We'll give notice of planned maintenance where practical.",
      },
      {
        kind: "p",
        text: "Support is by email at [[CONTACT EMAIL]], Monday to Friday, 9am to 5pm Melbourne time, excluding public holidays. We aim to reply first within **2 business days**. In practice most things are answered faster, and urgent problems get looked at when they land.",
      },
      { kind: "h", text: "8. Our software stays ours" },
      {
        kind: "p",
        text: "Kairo's software, design and documentation remain ours. You get a non-exclusive, non-transferable right to use your instance for your own business for as long as this agreement runs. You may not copy, resell, sub-licence, reverse engineer or attempt to extract the source of the software.",
      },
      { kind: "h", text: "9. Stopping and suspension" },
      {
        kind: "ul",
        items: [
          "You can stop using Kairo whenever you like. There's no subscription, so there's nothing to cancel — see [Refunds & Cancellation](/legal/refunds).",
          "We may suspend or end the agreement for serious or repeated breach of these terms or the Acceptable Use Policy, or where the law requires it. Unless it's serious enough to need immediate action, we'll tell you what's wrong and give you a fair chance to fix it.",
          "Either way, your export stays available for 60 days before we delete your data.",
        ],
      },
      { kind: "h", text: "10. Liability" },
      {
        kind: "p",
        text: "Nothing in these terms excludes or limits any right you have under the Australian Consumer Law that can't lawfully be excluded — including the guarantees that services are supplied with due care and skill and are fit for purpose.",
      },
      {
        kind: "p",
        text: "Subject to that, and as far as the law allows: we're not liable for indirect or consequential loss, lost profit, lost goodwill, or lost data we didn't cause; and our total liability under this agreement is limited, at our option, to supplying the service again or to **the amount you have paid us in the 12 months before the claim**.",
      },
      { kind: "h", text: "11. Indemnity" },
      {
        kind: "p",
        text: "You cover us against claims arising from unlawful use of Kairo, the content you put into it, or messages you send through it in breach of these terms — except to the extent we caused the loss.",
      },
      { kind: "h", text: "12. Changes" },
      {
        kind: "p",
        text: "We may update these terms. We'll email you at least 14 days before a material change takes effect. Continuing to use Kairo after that means you accept it.",
      },
      { kind: "h", text: "13. Governing law" },
      {
        kind: "p",
        text: "These terms are governed by the laws of Victoria, Australia, and both parties submit to the non-exclusive jurisdiction of its courts.",
      },
    ],
  },

  // ------------------------------------------------------------------ 03
  {
    slug: "dpa",
    title: "Data Processing Addendum",
    summary:
      "The document that makes “your clients' data is yours” enforceable. Part of the Customer Terms.",
    updated: UPDATED,
    blocks: [
      { kind: "h", text: "1. Who controls what" },
      {
        kind: "p",
        text: "For information about your clients, **you control it** and **we process it for you**. You decide what's collected and why; we hold and handle it on your instructions. If the GDPR or UK GDPR applies to you, you are the controller and we are the processor.",
      },
      { kind: "h", text: "2. What the processing covers" },
      {
        kind: "table",
        head: ["Item", "Detail"],
        rows: [
          ["Subject matter", "Providing the Kairo booking, payments and messaging service"],
          ["Duration", "As long as your agreement runs, plus the retention period after it ends"],
          [
            "Purpose",
            "Storing, organising, retrieving and sending client records so you can run bookings, take payment and message clients",
          ],
          [
            "Types of data",
            "Name, email, phone, appointment history, invoices and payments, and service notes — which may include health information such as allergies and patch tests",
          ],
          ["Whose data", "Your clients, and your staff who use the system"],
        ],
      },
      { kind: "h", text: "3. What we commit to" },
      {
        kind: "ul",
        items: [
          "We process client data only on your instructions — using the service is such an instruction — unless the law requires otherwise, in which case we'll tell you first if we're allowed to.",
          "We keep it confidential, and anyone with access is under a duty of confidence.",
          "We maintain the measures in the [Security Overview](/legal/security).",
          "We don't use client data for our own purposes, for advertising, or to train models.",
        ],
      },
      { kind: "h", text: "4. Sub-processors" },
      {
        kind: "p",
        text: "You authorise the providers listed in [Sub-processors](/legal/sub-processors). Each is bound by obligations no less protective than these. We'll give you at least 14 days' notice before adding or replacing one where that's practical, and you can object on reasonable data-protection grounds; if we can't resolve it you can end the agreement. We stay responsible for how they perform.",
      },
      { kind: "h", text: "5. Helping you meet your obligations" },
      {
        kind: "p",
        text: "If a client asks to access, correct, export or delete their record, you can do most of it yourself in the app. Where you can't, we'll help within 14 days at no charge. We'll also give you reasonable help with privacy assessments and regulator enquiries.",
      },
      { kind: "h", text: "6. Breach notification" },
      {
        kind: "p",
        text: "If we become aware of a security breach affecting your client data we'll tell you as soon as practicable — normally within **72 hours** of confirming it — with what we know, what we're doing, and what we suggest you do. Whether to notify the individuals and the regulator remains your call, and we'll support it.",
      },
      { kind: "h", text: "7. Return and deletion" },
      {
        kind: "p",
        text: "When the agreement ends we make an export available for 60 days, then delete your data within a further 30 days — except copies sitting in backups, which go as those backups rotate within 90 days, and anything we're required to keep by law.",
      },
      { kind: "h", text: "8. Audit" },
      {
        kind: "p",
        text: "On reasonable written notice, and no more than once a year unless there's been a breach, we'll give you the information reasonably needed to show we're meeting this addendum.",
      },
      { kind: "h", text: "9. Overseas transfers" },
      {
        kind: "p",
        text: "Where client data goes outside Australia we do it consistently with APP 8, and where the GDPR applies, on the basis of the European Commission's Standard Contractual Clauses, which are incorporated by reference.",
      },
    ],
  },

  // ------------------------------------------------------------------ 04
  {
    slug: "acceptable-use",
    title: "Acceptable Use Policy",
    summary: "The short list of things that will get an account suspended.",
    updated: UPDATED,
    blocks: [
      { kind: "h", text: "Don't" },
      {
        kind: "ul",
        items: [
          "Use Kairo for anything unlawful, or store unlawful content in it.",
          "Send messages in breach of the [messaging rules](/legal/messaging) — far and away the most common reason an account gets suspended.",
          "Record personal information about anyone without a lawful basis, or health information without the person's consent.",
          "Upload malware, or try to reach another business's instance, our infrastructure, or any account that isn't yours.",
          "Probe, scan or load-test the service without asking us first.",
          "Copy, resell, sub-licence or white-label the software as your own, or reverse engineer it.",
          "Impersonate another business.",
          "Share one instance across separate businesses to avoid paying for each.",
        ],
      },
      { kind: "h", text: "What happens if you do" },
      {
        kind: "p",
        text: "If it's minor we'll get in touch and ask you to fix it, and give you a fair amount of time to do so. If it's serious — unlawful content, an attack, or messaging that puts your clients or us at risk — we may suspend the account straight away and tell you afterwards. Either way we'll always tell you why.",
      },
    ],
  },

  // ------------------------------------------------------------------ 05
  {
    slug: "messaging",
    title: "Client Messaging & Consent",
    summary:
      "Kairo sends email and text on your behalf. Under Australian law those messages are sent by you.",
    updated: UPDATED,
    blocks: [
      { kind: "h", text: "The rule, in one line" },
      {
        kind: "p",
        text: "Under the *Spam Act 2003* (Cth), a commercial message needs **consent**, has to say **who sent it**, and has to offer a way to **unsubscribe**. The penalties land on the business that sent it.",
      },
      { kind: "h", text: "Which Kairo messages are which" },
      {
        kind: "table",
        head: ["Message", "What it counts as", "What you need"],
        rows: [
          [
            "Booking confirmation",
            "Transactional — it finishes something the client asked for",
            "No marketing consent needed; still name the business",
          ],
          ["Appointment reminder", "Transactional", "As above"],
          ["Reschedule or cancellation", "Transactional", "As above"],
          ["Payment receipt", "Transactional", "As above"],
          [
            "**Review request**",
            "Arguably commercial",
            "Treat it as needing consent and an unsubscribe",
          ],
          ["**Win-back / “we miss you”**", "Marketing", "Consent and unsubscribe required"],
        ],
      },
      {
        kind: "note",
        text: "**The middle row is the one to watch.** A reminder is plainly transactional. “We haven't seen you in a while, here's 20% off” is plainly marketing. A review request sits between the two and reasonable people disagree — so treat it as marketing. That's the safe reading and it's the one this policy takes.",
      },
      { kind: "h", text: "What you need to do" },
      {
        kind: "ul",
        items: [
          "Get consent before sending marketing. Ask at booking or in the chair, and record that you asked.",
          "Leave the business name and contact details in every message. Kairo puts them there automatically from your settings — don't strip them out.",
          "Honour unsubscribes, and never message someone who's opted out.",
          "Only message numbers and addresses a client gave you for that purpose. Never import a purchased list.",
        ],
      },
      { kind: "h", text: "What Kairo does" },
      {
        kind: "ul",
        items: [
          "Keeps each message type separate, so you can switch marketing off and leave confirmations and reminders on.",
          "Only offers channels a client can actually receive.",
          "Logs every message, its channel and its delivery status, so you can show exactly what was sent and when.",
          "Never messages your clients on our own behalf.",
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 06
  {
    slug: "cookies",
    title: "Cookies & Local Storage",
    summary: "Short, because there genuinely isn't much.",
    updated: UPDATED,
    blocks: [
      { kind: "h", text: "This website" },
      {
        kind: "table",
        head: ["What", "Why", "How long"],
        rows: [
          [
            "Google Fonts request",
            "Loads the two typefaces the page is set in",
            "Per visit; Google may log the request",
          ],
        ],
      },
      {
        kind: "p",
        text: "No advertising cookies, no cross-site tracking, and no analytics at present. If we add analytics later, this table gets updated first.",
      },
      { kind: "h", text: "The Kairo app" },
      {
        kind: "table",
        head: ["What", "Why", "How long"],
        rows: [
          [
            "Session cookie",
            "Keeps you signed in. Signed, HttpOnly and SameSite — page scripts can't read it and it isn't used for tracking",
            "30 days, or until you sign out",
          ],
        ],
      },
      {
        kind: "p",
        text: "That cookie is strictly necessary — without it the app can't tell you're signed in — so it doesn't need a consent banner.",
      },
    ],
  },

  // ------------------------------------------------------------------ 07
  {
    slug: "security",
    title: "Security Overview",
    summary: "What we actually do, put plainly enough that a client of yours could read it.",
    updated: UPDATED,
    blocks: [
      { kind: "h", text: "Your data is separated, not just filtered" },
      {
        kind: "p",
        text: "Each business gets its own database. Your records aren't sitting in a shared table alongside other salons, so there's no query that could return someone else's data by mistake. That's the structural reason we can promise your client list stays yours.",
      },
      { kind: "h", text: "Access control" },
      {
        kind: "ul",
        items: [
          "Every request is authorised on the server. A hidden button is never the only thing stopping an action.",
          "Session cookies are signed, HttpOnly and SameSite — never stored anywhere page scripts can read them.",
          "Sign-in and password changes are rate limited, to slow down guessing.",
          "Passwords have to meet a minimum standard and are checked against known breached-password lists.",
          "Public links, like a client's cancellation link, check a token rather than trusting a number in the address bar — so changing that number doesn't reveal anyone else's booking.",
        ],
      },
      { kind: "h", text: "Data handling" },
      {
        kind: "ul",
        items: [
          "All traffic is encrypted in transit over HTTPS.",
          "Database queries are parameterised throughout, which is the standard defence against SQL injection.",
          "Card details are handled by our payment provider. We don't store card numbers.",
          "Backups run daily, are encrypted, and rotate out within 90 days.",
        ],
      },
      { kind: "h", text: "The system checks itself" },
      {
        kind: "p",
        text: "Kairo flags a misconfigured time zone, a database sitting on storage that won't persist, and a default password still in use. It says so on the dashboard rather than failing quietly later.",
      },
      { kind: "h", text: "What we don't claim" },
      {
        kind: "p",
        text: "We aren't certified to ISO 27001 or SOC 2. No system is perfectly secure. If you need a formal certification for your own compliance, tell us before you buy and we'll be straight with you about what we can and can't evidence.",
      },
      { kind: "h", text: "Reporting a problem" },
      {
        kind: "p",
        text: "Email [[CONTACT EMAIL]]. We'll acknowledge within 5 business days. Please give us reasonable time to fix an issue before making it public. We won't pursue anyone who reports a genuine problem in good faith and doesn't access or change data that isn't theirs.",
      },
    ],
  },

  // ------------------------------------------------------------------ 08
  {
    slug: "sub-processors",
    title: "Sub-processors",
    summary: "Every third party that touches your data, what it does, and where it is.",
    updated: UPDATED,
    blocks: [
      {
        kind: "table",
        head: ["Provider", "What it does", "What it sees", "Where"],
        rows: [
          [
            "[[HOSTING PROVIDER]]",
            "Runs the servers and stores the database",
            "Everything in your instance",
            "Australia",
          ],
          [
            "Stripe",
            "Card payments and pay-links",
            "Payment amount, and the payer's card and contact details",
            "Australia / United States",
          ],
          [
            "[[EMAIL PROVIDER]]",
            "Sends confirmations, reminders and receipts",
            "Recipient name, email address and the message contents",
            "Australia / United States",
          ],
          [
            "[[SMS PROVIDER]]",
            "Sends text messages",
            "Recipient mobile number and the message contents",
            "Australia / United States",
          ],
        ],
      },
      {
        kind: "note",
        text: "**One thing worth knowing.** Your message log records what was sent to a client. If a reminder names a service that reveals something personal, that text sits with your email or SMS provider too.",
      },
    ],
  },

  // ------------------------------------------------------------------ 09
  {
    slug: "refunds",
    title: "Refunds & Cancellation",
    summary:
      "A one-off fee needs a clearer refund position than a subscription, because there's nothing to stop paying.",
    updated: UPDATED,
    blocks: [
      { kind: "h", text: "Your rights under Australian Consumer Law" },
      {
        kind: "p",
        text: "Our services come with guarantees that can't be excluded. If a service has a **major problem** you can cancel and get a refund, or be compensated for the drop in value. If the problem is minor, we're entitled to fix it within a reasonable time. Nothing below limits any of that.",
      },
      { kind: "h", text: "The setup fee" },
      {
        kind: "ul",
        items: [
          "**Before setup starts** — full refund, no questions.",
          "**Within 30 days of your system going live** — full refund if Kairo isn't right for you. You don't have to justify it.",
          "**After 30 days** — the setup work has been done, so the fee isn't refundable as a matter of course. If something is genuinely wrong and we can't fix it in a reasonable time, you still get your money back.",
        ],
      },
      { kind: "h", text: "Stopping" },
      {
        kind: "p",
        text: "There's no subscription, so there's nothing to cancel. Stop using it whenever you like. Ask for an export and we'll send one, then your data is deleted on the schedule in the [Privacy Policy](/legal/privacy).",
      },
      { kind: "h", text: "How to ask" },
      {
        kind: "p",
        text: "Email [[CONTACT EMAIL]] with your business name and what went wrong. We aim to come back to you within 5 business days, and approved refunds go back to the original payment method within 10 business days.",
      },
    ],
  },

  // ------------------------------------------------------------------ 10
  {
    slug: "website-terms",
    title: "Website Terms & Marketing Claims",
    summary: "Covers the site itself — and backs up the claims it makes about Kairo.",
    updated: UPDATED,
    blocks: [
      { kind: "h", text: "Using this website" },
      {
        kind: "p",
        text: "The content is here to explain Kairo. Read it, print it, share it. Don't copy the design, code or text for another product. The trade marks and content are ours or our licensors'.",
      },
      { kind: "h", text: "The screenshots" },
      {
        kind: "p",
        text: "Every product screenshot on this site shows a demonstration business called **Luxe Hair Studio** with **invented clients**. No real business's data and no real person's information appears anywhere on this site. The frames are all set on the same morning so the story stays consistent.",
      },
      { kind: "h", text: "Comparisons with other products" },
      {
        kind: "p",
        text: "Where the site compares Kairo with other booking platforms, the comparison is about **how those products are built** — a marketplace listing works differently from your own booking link, and a general-purpose tool is built differently from one made for appointment work. We don't state any other company's prices, fees or commission rates, because those vary by plan and country and change over time. Check your own provider's terms.",
      },
      { kind: "h", text: "The payback calculator" },
      {
        kind: "p",
        text: "The calculator works from figures **you enter** and does simple arithmetic on them. It doesn't predict your results and it isn't financial advice. The only figures we assert are Kairo's own: a one-off $400 setup fee and no monthly charge.",
      },
      { kind: "h", text: "Claims we make about Kairo" },
      {
        kind: "p",
        text: "Statements on this site about how Kairo works — that it takes no commission, that each business has its own database, that a cancellation is held briefly so it can be undone, that it runs a real salon in production — are accurate at the date of publication. If any stops being true, we change the site.",
      },
      { kind: "h", text: "Availability" },
      {
        kind: "p",
        text: "We don't guarantee the website is always up or error-free, and we may change it at any time.",
      },
    ],
  },
];

export function findLegalDoc(slug: string): LegalDoc | undefined {
  return LEGAL.find((d) => d.slug === slug);
}

/** Stable id for a heading, used by the in-page contents rail. */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
