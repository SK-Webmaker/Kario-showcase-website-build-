# Handover — week of 14 September 2026

**Five posts: three Reels, one seven-slide carousel, one single card.** All
captions passed the Critic clean.

---

## First, the thing you asked for that I could not do

**You asked me to look over the views, engagement and follows. I can't. There is
still no Instagram access — no handle, no credential — so there is no number for
me to look at.**

I'm not going to estimate it. An invented baseline would quietly poison every
decision after it, and the whole point of the memory files is that next week can
score this week honestly.

**Two ways to unblock it, either is fine:**
- Send the handle and set up read access, or
- Open Insights, screenshot the last 7 posts, and paste them in. I'll do the
  analysis off screenshots — it works, it's just manual.

What your message *did* give me is genuinely useful: **all seven posts went up.**
That converts them from "unknown" to "published" in the record. The experiments
ran. Only the measurement is missing.

---

## You were right about the screenshots, and here is the number

They really were soft. I measured it: **every product frame shipped between 1.5×
and 2.7× upsampled.** Two causes, both mine:

1. **Cards rendered at 2× (2160px) when Instagram serves at 1080.** The extra
   pixels bought nothing and doubled how far each screenshot had to stretch.
2. **Crops cut tight, then displayed wide.** A 432px modal shown across 952px is
   a 2.2× blow-up. No encoder rescues that.

**Fixed both.** Everything now renders at native delivery size, and every crop
goes through an auditor that prints its magnification and flags anything over
1.35×. This week's frames run **0.97× to 1.30×** — here's the actual output:

```
[warn] 1.30x   432px ->  560px  notify modal (the one frame worth stretching)
[warn] 1.04x   900px ->  936px  client profile
[ok  ] 0.99x   958px ->  952px  dashboard / pos / messages
[ok  ] 0.97x   960px ->  936px  calendar
[ok  ] 0.98x   460px ->  452px  phone
```

The design rule that came out of it: **show more of the screen slightly smaller,
rather than less of it blown up.**

**The ceiling is yours to lift.** The source files in `public/screenshots/` are
1240×775. That is the hard limit on how sharp any post can ever look.
**Re-export them at 2× (2480×1550) and every future post gets sharper for free.**
It's the single highest-value thing you could send me.

---

## The Reels

You said these are what you're most excited about, so they got the most work.

I built a proper motion engine for them (`tools/reel-lib.mjs`) rather than
tweening opacity. It uses a real cubic-bezier solver running **the website's own
easing curve** — `cubic-bezier(.66,0,.01,1)`, slow to leave, fast through the
middle, long settle — so the video moves like the site moves. On top of that:

- **Dolly push-in** — the frame arrives from below and settles, with motion blur
  that clears as it lands
- **Rack focus** — scenes open out of focus and pull sharp
- **Whip pan** — hard horizontal cuts, heavily blurred, for the objection reel
- **Parallax** — the blueprint grid drifts slower than the content
- **Light sweep** — a specular pass across each product frame
- **Letterbox bars** that open at the top of the film and close at the end
- **Kinetic type** — lines arrive in sequence, not as a block
- **Vignette** — the cheapest thing that reads as filmed rather than exported

Hook discipline, from this week's research: **the problem is on screen inside one
second.** No title cards, no "here are three things", no build-up. That was the
single most consistent finding — and I'm using the technique, not the
engagement percentages that circulate with it, because those don't resolve to a
primary source.

---

## Post 1 — REEL — "One Thursday"

**Monday 14 September** · REEL · 23.2s · `r-b-thursday`

Files:

- `video/reel-b-thursday.mp4`

Caption — copy everything inside the block:

```
7:04am. Nobody's in yet, and the day is already answered.

This is one Thursday in a salon that runs on Kairo, start to finish.

Twelve booked, four done, two hours still free — and who's in the chair right now. A column per person in the diary, so it cannot be double-booked. Somebody moves an appointment at 11:40 and it stops to ask who to tell. A walk-in pays at 1:15 without a second app. She books herself in at 6:40, after you've locked up. And at 9:15 you check the whole thing from the couch, on your phone.

One login. That's the day.

$400 once, GST included. Then nothing, every month. No subscription, no per-booking fee, no commission.

DM me the word DIARY and I'll walk you through your own Thursday.

#salonowner #salonsoftware #melbournesalon #hairstylist #melbournehair #bookingsystem #salonbusiness #barbershop #salonmanagement
```

*Testing:* Breadth as a Reel. Paired with the Tuesday carousel, which carries the same message as stills — the difference between them is format and nothing else.

---

## Post 2 — CAROUSEL — "Six screens. One login."

**Tuesday 15 September** · CAROUSEL · 7 slides · `c1-six-screens`

Files:

- `images/c1-01-cover.png`
- `images/c1-02-the-morning.png`
- `images/c1-03-the-diary.png`
- `images/c1-04-the-client-book.png`
- `images/c1-05-getting-paid.png`
- `images/c1-06-the-messages.png`
- `images/c1-07-cta.png`

Caption — copy everything inside the block:

```
Six screens. One login. No tabs.

This is the actual software, not a mock-up. Swipe through the six screens a salon actually lives in.

The morning view that answers the day before you've asked it. The diary with a column per person, which cannot be double-booked. A client record holding every visit, every invoice and the note you typed in June. Point of sale that goes chair to bank without a second app. A message log where confirmations and reminders send themselves and nothing fails silently. And the same full workspace on your phone, installed from the browser with no app store.

That's the whole thing. There's no tier hiding the useful half, and no add-on that costs more than the software.

$400 once, GST included. Then nothing, every month.

Tell me which of these six you'd use first. DM me the word DIARY.

#salonowner #salonsoftware #melbournesalon #salonmanagement #hairstylist #melbournehair #barbershop #bookingsystem
```

*Testing:* The still arm of the breadth pair. Same six screens as Monday's Reel, same claims, no motion.

---

## Post 3 — REEL — "She's turning up at one"

**Wednesday 16 September** · REEL · 19.4s · `r-a-notify`

Files:

- `video/reel-a-notify.mp4`

Caption — copy everything inside the block:

```
She's turning up at one. You moved it to half past, three hours ago.

Every other diary just… moves it. No prompt, no record, and nothing that tells you a week later whether anybody was actually told.

Kairo stops and asks one question: email her, text her, both, or nothing. Only the channels she can actually receive, each showing the real address or number. Then fifteen seconds to undo it, with the message held back two minutes so undo actually undoes.

It's a small thing, and it costs you an empty chair and an awkward conversation every time it goes wrong.

$400 once, GST included. Then nothing, every month.

DM me the word DIARY.

#salonowner #salonsoftware #melbournehair #hairstylist #melbournesalon #barbershop #salonbusiness #bookingsystem
```

*Testing:* Depth on one feature as a Reel, with the problem on screen inside one second and no build-up. Paired with Thursday's single card, which makes the same point as a screenshot.

---

## Post 4 — SINGLE IMAGE — "Every other diary just… moves it"

**Thursday 17 September** · IMAGE · `s2-moves-it`

Files:

- `images/s2-moves-it.png`

Caption — copy everything inside the block:

```
Every other diary just… moves it.

That's the whole difference, and it's the one I'd want you to screenshot.

Move an appointment in Kairo and it stops to ask: email her, text her, both, or nothing. Only the channels she can actually receive, each showing the real address or number. Then fifteen seconds to undo.

No silent changes. No working out later whether anyone was told. No client standing at the door at one o'clock for something that's now at half past.

$400 once, GST included. Then nothing, every month.

DM me the word DIARY.

#salonowner #salonsoftware #melbournesalon #hairstylist #bookingsystem #melbournehair #salonbusiness #barbershop
```

*Testing:* The still arm of the notify pair, and the only light-theme post of the week. Built to be screenshotted and forwarded rather than watched.

---

## Post 5 — REEL — "So why haven't you got it yet?"

**Friday 18 September** · REEL · 18.6s · `r-c-why`

Files:

- `video/reel-c-why.mp4`

Caption — copy everything inside the block:

```
So why haven't you got it yet?

Four reasons people give me, and what I say back.

Too expensive. It's $400, once, GST included. No subscription, no per-booking fee, no cut of what you charge on a good week.

Too much hassle. Ten minutes on the phone, then your hours, your team, your menu and your client list get moved across on my side. You open it on the floor when you're ready.

Never heard of it. Fair. A Melbourne salon has run its bookings, payments and customer emails on it since day one, and every screen in these posts is that same system.

Already got something. Then you already know what it costs you every month. This one costs nothing every month, because there isn't a monthly one.

No trial that expires. No catch. DM me the word DIARY and ask me the awkward version of the question.

#salonowner #salonsoftware #melbournesalon #melbournehair #hairstylist #barbershop #salonbusiness #bookingsystem #salonmanagement
```

*Testing:* The closer. A direct-question hook and four objections answered at speed, to see whether an objection reel produces DMs where a feature reel produces views.

---

## The experiment, properly paired this time

Last week I mixed formats *and* messages, so a difference between them couldn't
be attributed to either. This week is paired:

| Subject | As a Reel | As a still |
|---|---|---|
| Breadth — the whole system | Mon: "One Thursday" | Tue: "Six screens" carousel |
| Depth — the notify moment | Wed: "She's turning up at one" | Thu: the light single card |

Same claims, same voice, same price, same CTA inside each pair. **The only
difference is format.** If you get me numbers, that comparison gives you the
first real answer this account has ever had about what it should be making.

## The projection

- **Inside each pair, the Reel should out-reach the still.** If it doesn't, the
  video assumption doesn't transfer to this account and we stop leaning on it.
- **The light single card should out-save its Reel** — it's the only thing built
  to be screenshotted rather than watched.
- **At least one DM with DIARY** across twelve live posts. If twelve produce
  none, the CTA is the problem and it changes before the creative does.
- **One thing to change: nothing in the creative.** Same as last week and the
  week before — the change that matters is upstream.

## Scheduling note

The previous pack was dated 7–11 September. You've said everything is posted, so
this one starts Monday 14th. **Nothing in these captions is tied to a date** — if
you want to run them sooner, just move them forward.

---

## Also delivered: `AGENTS.md`

The handbook you asked for, so Codex can run this. It's at the repo root and
covers everything: the business facts and where they're sourced from, the eleven
invariants, the voice rules, every tool and how to drive it, the **verified crop
box for every screenshot**, the magnification rule and why it exists, the design
tokens, the reel motion vocabulary, the weekly loop, what's been tried and
failed, and a corrections log of what this system got wrong and fixed.

Two sections worth pointing Codex at specifically:

- **§5.4 The magnification rule** — the resolution lesson, with the numbers.
- **§9 Corrections** — the three things this system asserted and later had to
  withdraw. That section is the difference between an agent that compounds and
  one that repeats.

I've written it to be *better* than what you gave me at the start, because it
carries five weeks of specific, expensive lessons that a generic brief can't.

---

## Standing hazards, now written into AGENTS.md

**`11-pos.jpg` shows "GST (8.5%)".** Australian GST is 10%. I've now caught a
crop drifting onto that row **three times** — the last two were widened crops
that silently re-exposed it. The exact safe crop box is documented. It's still
worth fixing in the demo data, since it's live on the showcase site too.

**`07-notify-prompt.jpg` and `09-client-profile.jpg` show US-format phone
numbers** while the booking page correctly shows a Camberwell address and an
(03) landline. I use the modal anyway — it's the strongest frame you have, and
doctoring a product screenshot would be worse than the blemish.

---

## Still blocking, three weeks running

1. **The Instagram handle.**
2. **The read credential.**
3. **A 2× re-export of the screenshots.**

Twelve posts will be live after this week. Three consecutive predictions are now
unscored. I can keep producing — the work is getting better, not worse — but
"produced and never measured" is starting to be the main story, and that's a
prioritisation call rather than a data problem.
