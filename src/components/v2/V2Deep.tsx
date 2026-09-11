import { useScrollProgress } from "@/hooks/useScrollProgress";
import { Eyebrow, Orbs } from "./primitives";
import { CountUp, Reveal, Torch } from "./motion";
import { Plate, WordLines } from "./cinematic";

/**
 * Four sections that go a level deeper than the feature showcase.
 *
 * Each one is built around a different idea so the page does not read as
 * one mechanic applied five more times: a transcript that fills in line
 * by line, a single sentence becoming a booking, two records stacked in
 * depth, and a ledger that counts itself in.
 *
 * The pictures, though, all arrive the same way — see Plate. Varying the
 * argument is what keeps a page interesting; varying how a photograph
 * turns up is what makes it look unsure of itself.
 */

const SHOT = "/screenshots";

/* ------------------------------------------------------------------ */
/* 1. Kai — the assistant. Vertical: the transcript fills in.          */
/* ------------------------------------------------------------------ */

const SAID: readonly string[] = [
  "close the salon on Mondays",
  "book Amara in with Sha for a Balayage on Friday at 9",
  "what did we take last week",
  "send reminders 48 hours before",
  "show me the calendar in three days",
];

export function V2Kai() {
  return (
    <section
      id="assistant"
      className="relative overflow-hidden"
      style={{ padding: "calc(9 * var(--u)) 0" }}
    >
      <Orbs
        spec={[
          { x: "82%", y: "22%", size: "40vw", tone: "a" },
          { x: "10%", y: "84%", size: "28vw", tone: "b" },
        ]}
        parallax={0.11}
      />
      <Torch />

      <div
        className="relative z-10 mx-auto grid items-start gap-x-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
        style={{ padding: "0 var(--pad)", maxWidth: "calc(100 * var(--u))" }}
      >
        <div className="lg:sticky lg:top-[calc(9*var(--u))]">
          <Reveal>
            <Eyebrow>The assistant</Eyebrow>
          </Reveal>
          <h2 className="v2-display v2-t1" style={{ marginTop: "calc(1.2 * var(--u))" }}>
            <WordLines lines={["Talk to your", "software."]} />
            <WordLines lines={["It does the", "clicking."]} lineClassName="v2-accent" delay={280} />
          </h2>

          <Reveal
            as="p"
            delay={360}
            opacity={0.7}
            className="v2-body max-w-[42ch]"
            style={{ marginTop: "calc(2 * var(--u))" }}
          >
            Kai sits in every screen. Say what you want in your own words and it goes and does it —
            your hours, your prices, your reminders, your booking rules. Every change it makes comes
            back with an Undo sitting next to it.
          </Reveal>

          <Reveal
            delay={480}
            className="border-l-2"
            style={{
              marginTop: "calc(2.2 * var(--u))",
              paddingLeft: "calc(1.2 * var(--u))",
              borderColor: "var(--v2-a)",
            }}
          >
            <p className="v2-body max-w-[40ch] opacity-60">
              Nothing leaves your salon. No language model, no cloud service, nothing sent anywhere
              — which is part of why there is nothing to pay per month.
            </p>
          </Reveal>
        </div>

        <div style={{ paddingTop: "calc(2 * var(--u))" }}>
          {/* The transcript fills in one line at a time, the way it would
              if somebody were actually typing into it. */}
          <ul className="flex flex-col" style={{ gap: "calc(0.9 * var(--u))" }}>
            {SAID.map((line, i) => (
              <Reveal
                as="li"
                key={line}
                delay={i * 120}
                className="v2-body self-end border border-white/10 bg-white/[0.04] text-right backdrop-blur-sm"
                style={{
                  borderRadius: "calc(0.9 * var(--u))",
                  padding: "calc(0.9 * var(--u)) calc(1.3 * var(--u))",
                  maxWidth: "min(100%, calc(38 * var(--u)))",
                }}
              >
                {line}
              </Reveal>
            ))}
          </ul>

          <Plate
            src={`${SHOT}/01-kai-agent.jpg`}
            alt="Kai answering two instructions inside Kairo: one books an appointment and fills the form in, the other closes the salon on Mondays and offers to undo it."
            depth={16}
            delay={120}
            style={{ marginTop: "calc(1.6 * var(--u))" }}
          />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Booking by sentence. Horizontal: the screen wipes open.          */
/* ------------------------------------------------------------------ */

export function V2Sentence() {
  return (
    <section
      id="one-sentence"
      className="relative overflow-hidden"
      style={{ background: "var(--v2-panel)" }}
    >
      <div style={{ paddingBlock: "calc(9 * var(--u))" }}>
        <div
          className="mx-auto"
          style={{ padding: "0 var(--pad)", maxWidth: "calc(100 * var(--u))" }}
        >
          <Reveal>
            <p className="v2-eyebrow font-semibold" style={{ color: "rgb(255 255 255 / 0.7)" }}>
              One sentence
            </p>
          </Reveal>

          <h2
            className="v2-display v2-t1"
            style={{ marginTop: "calc(1.2 * var(--u))", maxWidth: "calc(64 * var(--u))" }}
          >
            <WordLines lines={["“Book Amara in with Sha", "for a Balayage", "on Friday at 9.”"]} />
          </h2>

          <Reveal
            as="p"
            delay={280}
            opacity={0.82}
            className="v2-body max-w-[52ch]"
            style={{ marginTop: "calc(2 * var(--u))" }}
          >
            Kairo opens the calendar on that Friday with the whole booking already filled in —
            client, service, stylist, time, duration, price. One press and it is in the book.
          </Reveal>

          {/* The screen arrives the same way every other picture on the
              site does. It used to open on a left-to-right clip, which
              looked like a trick rather than a transition and — being
              gated on a fraction of a tall element — could leave an empty
              bordered panel on screen and then snap in late. */}
          <Plate
            src={`${SHOT}/03-kai-booking-prefilled.jpg`}
            alt="Kairo showing a new appointment already filled in from a typed sentence: Amara Osei, Balayage, 9am tomorrow, with the calendar open behind it."
            depth={18}
            style={{ marginTop: "calc(3 * var(--u))" }}
          />

          <div
            className="grid gap-x-16 gap-y-6 lg:grid-cols-2"
            style={{ marginTop: "calc(3 * var(--u))" }}
          >
            <Reveal as="p" opacity={0.82} className="v2-body max-w-[46ch]">
              It stops there on purpose. It fills the booking in; <strong>you</strong> press Book. A
              booking texts a real person, and there is no undo for a message that has already
              arrived — so the last step is always yours.
            </Reveal>
            <Reveal as="p" delay={140} opacity={0.82} className="v2-body max-w-[46ch]">
              If the slot is a problem it says so before you press: closed that day, outside your
              hours, or that stylist already busy.
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Treatment records. Depth: two records stacked.                   */
/* ------------------------------------------------------------------ */

export function V2Records() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const lift = Math.min(1, Math.max(0, (progress - 0.2) / 0.5));

  return (
    <section
      id="records"
      className="relative overflow-hidden"
      style={{ padding: "calc(9 * var(--u)) 0" }}
    >
      <Orbs
        spec={[
          { x: "12%", y: "26%", size: "34vw", tone: "b" },
          { x: "92%", y: "76%", size: "30vw", tone: "a" },
        ]}
        parallax={0.08}
      />

      <div
        ref={ref}
        className="relative z-10 mx-auto grid items-start gap-x-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]"
        style={{ padding: "0 var(--pad)", maxWidth: "calc(100 * var(--u))" }}
      >
        <div className="lg:sticky lg:top-[calc(9*var(--u))]">
          <Reveal>
            <Eyebrow>The paperwork</Eyebrow>
          </Reveal>
          <h2 className="v2-display v2-t1" style={{ marginTop: "calc(1.2 * var(--u))" }}>
            <WordLines lines={["Patch tests,", "consents and", "before-afters."]} />
          </h2>

          <Reveal
            as="p"
            delay={280}
            opacity={0.7}
            className="v2-body max-w-[44ch]"
            style={{ marginTop: "calc(2 * var(--u))" }}
          >
            Colour needs a patch test, and insurers expect the record. Most salons keep it in a
            paper book or a notes field — which is not evidence if anyone ever asks.
          </Reveal>

          <Reveal
            as="p"
            delay={380}
            opacity={0.7}
            className="v2-body max-w-[44ch]"
            style={{ marginTop: "calc(1.2 * var(--u))" }}
          >
            Kairo keeps it properly: who was tested, on what date, with which product, and what
            happened. Consents store the exact wording the client agreed to and the moment they
            agreed to it. Photos attach to the appointment they belong to.
          </Reveal>

          <Reveal
            delay={480}
            className="border-l-2"
            style={{
              marginTop: "calc(2.2 * var(--u))",
              paddingLeft: "calc(1.2 * var(--u))",
              borderColor: "var(--v2-a)",
            }}
          >
            <p className="v2-body max-w-[44ch] opacity-70">
              <strong>Kairo records; it never decides.</strong> Nothing here judges whether a
              treatment is safe for anybody. It answers one narrow question — is the record you said
              you needed actually there — and hands the answer to a person. And the booking page
              never reveals what you hold on somebody: a stranger and a client whose test lapsed
              last week get an identical reply.
            </p>
          </Reveal>
        </div>

        {/* Two records, stacked. The second lifts off the first as you
            scroll — depth rather than a slide, so this reads as paperwork
            rather than as another gallery. */}
        <div
          className="relative"
          style={{ paddingTop: "calc(1 * var(--u))", paddingBottom: "calc(9 * var(--u))" }}
        >
          <figure
            className="overflow-hidden border border-white/10"
            style={{
              borderRadius: "calc(1.1 * var(--u))",
              transform: `scale(${(1 - 0.05 * lift).toFixed(3)}) translateY(${(-2 * lift).toFixed(2)}%)`,
              opacity: 1 - 0.22 * lift,
              transition: "none",
            }}
          >
            <img
              src={`${SHOT}/06-treatment-record.jpg`}
              alt="A client's treatment record in Kairo showing allergies, skin conditions, stylist notes and a patch test marked valid until a set date."
              width={2048}
              height={1280}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full"
            />
          </figure>

          <figure
            className="absolute inset-x-0 overflow-hidden border border-white/15"
            style={{
              top: "calc(11 * var(--u))",
              borderRadius: "calc(1.1 * var(--u))",
              boxShadow: "0 calc(1.4 * var(--u)) calc(4 * var(--u)) rgb(0 0 0 / 0.55)",
              transform: `translateY(${(28 - 28 * lift).toFixed(2)}%)`,
              opacity: lift,
            }}
          >
            <img
              src={`${SHOT}/07-treatment-record-consent.jpg`}
              alt="The same record scrolled to its consent: the exact wording the client agreed to, who agreed it, and the timestamp, with before-and-after photos attached to an appointment."
              width={2048}
              height={1280}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Growth — where new clients came from. Numbers that count in.     */
/* ------------------------------------------------------------------ */

/** The three figures the screen leads on. Real shape, demo salon. */
const LEDGER: readonly { value: number; prefix?: string; label: string; note: string }[] = [
  { value: 5, label: "Sent by a client", note: "Visits that actually happened" },
  { value: 260, prefix: "$", label: "Worth", note: "From those visits" },
  { value: 9, label: "Found you themselves", note: "Google, socials, walking past" },
];

export function V2Growth() {
  return (
    <section
      id="growth"
      className="relative overflow-hidden"
      style={{ padding: "calc(9 * var(--u)) 0" }}
    >
      <Orbs
        spec={[
          { x: "88%", y: "18%", size: "36vw", tone: "b" },
          { x: "8%", y: "80%", size: "30vw", tone: "a" },
        ]}
        parallax={0.1}
      />

      <div
        className="relative z-10 mx-auto"
        style={{ padding: "0 var(--pad)", maxWidth: "calc(100 * var(--u))" }}
      >
        <Reveal>
          <Eyebrow>Where they came from</Eyebrow>
        </Reveal>
        <h2 className="v2-display v2-t1" style={{ marginTop: "calc(1.2 * var(--u))" }}>
          <WordLines lines={["Every client gets", "a link of their own."]} />
        </h2>

        <Reveal
          as="p"
          delay={300}
          opacity={0.7}
          className="v2-body max-w-[58ch]"
          style={{ marginTop: "calc(1.8 * var(--u))" }}
        >
          Kairo counts who sent whom and what it was worth — but only once the person has actually
          turned up, and never for somebody who was already yours. A client you already had cannot
          be referred to you, or the number would flatter itself.
        </Reveal>

        {/* The ledger counts in as it arrives — the one place on the page
            where a number moving is the point rather than decoration. */}
        <ul
          className="grid gap-px sm:grid-cols-3"
          style={{ marginTop: "calc(3 * var(--u))", background: "rgb(255 255 255 / 0.1)" }}
        >
          {LEDGER.map((row, i) => (
            <Reveal
              as="li"
              key={row.label}
              delay={i * 130}
              style={{ background: "var(--v2-ground)", padding: "calc(2 * var(--u))" }}
            >
              <p
                className="v2-display v2-accent"
                style={{ fontSize: "calc(3.4 * var(--u))", lineHeight: 1 }}
              >
                <CountUp value={row.value} prefix={row.prefix ?? ""} />
              </p>
              <p className="v2-display v2-t4" style={{ marginTop: "calc(0.7 * var(--u))" }}>
                {row.label}
              </p>
              <p className="v2-body opacity-55" style={{ marginTop: "calc(0.4 * var(--u))" }}>
                {row.note}
              </p>
            </Reveal>
          ))}
        </ul>

        <Plate
          src={`${SHOT}/04-growth-referrals.jpg`}
          alt="Kairo's Growth screen: how many visits came from a client's referral link, what they were worth, how many found the salon themselves, the reward set for each side, and which clients have sent people in."
          depth={14}
          delay={140}
          style={{ marginTop: "calc(2.4 * var(--u))" }}
        />

        <Reveal
          delay={200}
          className="border-l-2"
          style={{
            marginTop: "calc(2.4 * var(--u))",
            paddingLeft: "calc(1.2 * var(--u))",
            borderColor: "var(--v2-a)",
          }}
        >
          <p className="v2-body max-w-[62ch] opacity-70">
            The two halves are reported apart on purpose. Only the people who found you on their own
            are ones a listing site could claim to have sent — a friend's recommendation was never
            theirs to take a commission on. That is the number worth holding up against a
            marketplace, and the one that survives being checked.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
