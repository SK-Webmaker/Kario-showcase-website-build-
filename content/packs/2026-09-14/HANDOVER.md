# Handover — week of 14 September 2026

**Seven days. Three Reels, two carousels, two single cards.** All captions passed
the Critic clean (48 tests).

---

## The thing you asked for that does not exist

You asked for facts on **what Melbourne salons and barbers lose on average to
poor booking systems.** I went looking properly. **That number does not exist in
any citable form, and I'm not going to make one up.**

Here's exactly what's out there. Every salon no-show figure I could find comes
from a company selling booking software — Etisia, Boulevard, Bookeo, Bella
Booking, Lutily. They don't agree with each other: 5–15%, 14%, 15%, 23%. None is
Melbourne-specific. None traces back to a primary source.

**And Kairo sells booking software.** So if I put "salons lose 15% to no-shows"
on a slide, I'd be quoting a rival vendor's marketing number to sell my own
product. The first salon owner who googles it finds the same mess I did, and
everything else on the page becomes suspect.

**What I did instead — and I think it's a better post than the one you asked
for:**

1. **One figure I actually verified**, read off the page rather than a search
   summary. IBISWorld: Australian hairdressing and beauty is **$12.5bn in 2026**,
   **down 0.9%** this year, **1.8% average growth since 2021**. Cited on the
   slide itself. It's national, not Melbourne — the copy says Australia.
   It also carries a real strategic point: in a market that isn't growing, you
   don't win by adding clients, you win by not leaking the ones you have. That's
   precisely what a booking system touches.
2. **Arithmetic the reader finishes themselves.** Empty chairs last week × your
   average ticket × 50 weeks. Their number, not mine.
3. **A caption that says out loud why there's no percentage**, and names Kairo's
   own conflict of interest while doing it.

That last move is the most interesting thing in this pack. On an account selling
booking software, **refusing to cite a booking-software statistic is itself the
credibility play** — and it's the only thing in three weeks that tests
transparency as the persuasive mechanism. It's flagged as this week's second
experiment.

---

## The Reels — 9:16 and cinematic

**Safe area, corrected.** Instagram covers the top ~110px (Reels label), the
bottom ~380px (caption, handle, audio) and a ~180px action rail down the right.
Content now sits between **14% and 57% of frame height**, with body copy capped
at 26 characters wide so nothing slides under the buttons. The empty lower third
isn't dead space — it's where Instagram puts your caption.

**Cinematic layers added since the last version:**

- **Film grain** — a real noise tile, re-offset every frame from a fixed
  sequence. It's the cheapest thing that stops a rendered frame looking rendered.
- **Colour grade** — soft-light pass, cool lift in the highlights, weight in the
  shadows.
- **Light leak** — a blue flare that blooms across every cut and is gone before
  it registers.
- **Longer, more languid arrivals** — the ease-in went from 0.52s to 0.62s, so
  scenes settle rather than snap.
- Plus what was already there: dolly push-in with motion blur that clears on
  landing, rack focus, whip pans, parallax, specular sweep, letterbox, vignette.

All of it runs off a single `setFrame(t)` function, so the render is
deterministic — the same spec always produces the identical video.

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

## Post 4 — SINGLE — "Every other diary just… moves it"

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

## Post 6 — CAROUSEL — "$12.5 billion. And it got smaller."

**Saturday 19 September** · CAROUSEL · 5 slides · `e1-flat-market`

Files:

- `images/e1-01-cover.png`
- `images/e1-02-numbers.png`
- `images/e1-03-means.png`
- `images/e1-04-leaks.png`
- `images/e1-05-cta.png`

Figures used, and where they come from:

- **$12.5** — https://www.ibisworld.com/australia/market-size/hairdressing-and-beauty-services/677/
- **0.9%** — https://www.ibisworld.com/australia/market-size/hairdressing-and-beauty-services/677/
- **1.8%** — https://www.ibisworld.com/australia/market-size/hairdressing-and-beauty-services/677/

Caption — copy everything inside the block:

```
The Australian hairdressing and beauty industry is worth $12.5bn this year. It shrank 0.9% to get there.

That's the whole reason I'd think about a booking system differently.

In a market that's growing you can afford to leak clients out the back, because new ones keep arriving. In one that isn't, the salon that wins is the one that stops losing the people it already has.

And a chair that sits empty on a Thursday is money that cannot be sold again later. That isn't a statistic, it's just how time works.

Four ways they leak out. She books and forgets, and nothing reminds her. You move her appointment and don't say, so she turns up at the old time. She tries to book at 9pm, the phone rings out, and she books somewhere that was open. Or she just stops coming, and nothing anywhere tells you it happened.

All four are booking problems, and all four have the same fix.

$400 once, GST included. Then nothing, every month.

DM me the word DIARY.

Source: IBISWorld, Hairdressing & Beauty Services in Australia, 2026.

#salonowner #salonsoftware #melbournesalon #hairstylist #melbournehair #barbershop #salonbusiness #bookingsystem
```

*Testing:* Whether an industry-fact post earns saves that a product post does not. It is the only post in three weeks carrying a third-party figure, and the only one citing a source on the slide itself.

---

## Post 7 — SINGLE — "What did the empty chairs cost you?"

**Sunday 20 September** · IMAGE · `e2-your-number`

Files:

- `images/e2-your-number.png`

Caption — copy everything inside the block:

```
What did the empty chairs cost you last week?

Not a number I can tell you. A number only you have.

Chairs that sat empty last week — no-shows, late cancels, gaps nobody filled. Times your average ticket. Times fifty weeks, because it happens every week rather than once.

That's the figure. Work it out on the back of a docket and it'll be more use to you than anything I could write.

I'm not going to quote you a no-show percentage, and here's why. Every one I can find comes from a company selling booking software, they don't agree with each other, and not one of them is about Melbourne. Kairo is booking software too, so treat any number I quote you with exactly that much suspicion.

Your own number is the only one worth having. If it came out bigger than you expected, that's the conversation.

$400 once, GST included. Then nothing, every month.

DM me the word DIARY.

#salonowner #salonsoftware #melbournesalon #hairstylist #barbershop #melbournehair #salonbusiness #bookingsystem
```

*Testing:* Refusing to quote a statistic, out loud, as the persuasive move. Tests whether transparency about the absence of a number converts better than a number would have.

---

## The week, at a glance

| Day | Format | Subject |
|---|---|---|
| Mon 14 | Reel · 23.2s | One Thursday, start to finish |
| Tue 15 | Carousel · 7 | Six screens, one login |
| Wed 16 | Reel · 19.4s | The notify moment |
| Thu 17 | Single · light | The notify moment, screenshot-able |
| Fri 18 | Reel · 18.6s | Four objections, answered |
| Sat 19 | Carousel · 5 | The flat market, and where clients leak |
| Sun 20 | Single · light | Work out your own number |

**Two experiments running.** Format is paired on the weekdays — same subject as
a Reel and as a still, everything else held constant, so a difference is
attributable to format rather than message. And the weekend pair tests whether
transparency about a missing statistic beats a borrowed one.

## The projection

- Inside each weekday pair, **the Reel should out-reach the still.**
- **The light single cards should out-save their Reels** — they're the only
  things built to be screenshotted rather than watched.
- **The flat-market carousel should be the most-saved item of the week**, because
  it's the only one carrying a fact worth forwarding. If it isn't, this account
  isn't a reference account and the educational format shouldn't be repeated.
- **At least one DM with DIARY** across fourteen live posts.

---

## Still blocking, three weeks running

1. **The Instagram handle.**
2. **The read credential.**
3. **A 2× re-export of `public/screenshots/`** (2480×1550). The current 1240×775
   frames are the hard ceiling on sharpness — this week's crops run 0.97×–1.30×,
   which is as good as it gets until the source improves.

Fourteen posts will be live after this week. Three predictions unscored. Every
experiment in this pack — the format pairs, the transparency test — is designed
to be measured, and none of them can be.
