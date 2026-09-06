# Gloss — working memory for Kairo

Loads every session. This is not documentation. It is what the next run needs
in order to not repeat the last one. Keep it current; delete what stops being
true.

---

## The business

**Kairo** — a white-label booking, payments and customer-messaging system for
salons. One instance per business, on the salon's own booking link. Not a
marketplace, not a directory.

- **Based:** Melbourne, Australia. `Australia/Melbourne`, **southern
  hemisphere**. August is **winter**. Spring starts 1 September.
- **Sold to:** salon owners — hair, barbering, nails, lashes, beauty clinics.
- **Who is actually being sold to right now:** Melbourne salons in Kairo's
  **warm network** — referrals and people who have seen it working, one
  conversation removed from a customer. *(Operator, 2026-08-26.)* That changes
  the work: lean on proof rather than explanation, keep the Melbourne
  specifics, and judge posts on **saves, shares and DMs**, never on follower
  growth, which at this size will look flat and mean nothing.
- **Channel:** Instagram only. **Creator account.** The trending chart library
  *appears* in the picker for Creator accounts — but see the audio note below
  before using it. A muted or struck post cannot be un-muted.
- **Nowhere to send anyone yet.** The website is not launched *(operator,
  2026-08-26: "i havent fully polished up the website yet")* and
  `src/site.config.ts` still carries the `hello@kairo.app` placeholder. Every
  call to action is **a DM** until that changes. Re-ask the week it goes live —
  a public page that publishes the price is the strongest thing this business
  could point at.
- **In production:** Kairo has run a Melbourne salon's bookings, payments and
  customer emails since day one. That is a real proof point and it is the
  strongest thing on the site — but it is one salon, so it is "a salon", never
  "salons".

### What it actually does
The diary that cannot be double-booked · a notify prompt on every change
(email / text / both / nothing) with a 15-second undo · client records with
dated notes that resurface next visit · point of sale and pay-by-link ·
automatic confirmations, reminders and review requests with a full delivery log
· its own branded booking page computing real availability · the whole
workspace on a phone, installed from the browser with no app store.

Source of truth for all of this: `src/data/journey.ts`, `src/components/`.

---

## Prices — read them from the file, never from here or from chat

`config/brand.json` → `prices`. Today that is **$400 once**, and **$0 a month**.
Those are the only two money figures the business asserts anywhere, and the
showcase site is deliberate about that. Any other dollar figure in a caption is
either the reader's own number or an invention; the Critic fails it.

`_source` on each price points at the line of product code it came from.

**The $400 includes GST** *(operator, 2026-08-26)*. So "$400 once" is complete
and accurate exactly as the site already writes it — no qualifier is needed in
a caption, and nothing on the site needs fixing. If Kairo's GST position ever
changes, this line and `PaybackCalculator.tsx` both need revisiting.

---

## Resolution — corrected 2026-09-06

The operator said the software screenshots looked low resolution. They were
right, and it was measurable: **every product frame had shipped between 1.5x and
2.7x upsampled.**

Source frames in `public/screenshots/` are **1240x775 JPEGs** — a hard ceiling.
Two things were spending it: cards rendered at `deviceScaleFactor: 2` (a 1080
canvas exported at 2160px, when Instagram serves at 1080 — doubling the stretch
for nothing), and crops cut tight then displayed wide.

**The rule: show more of the screen slightly smaller, rather than less of it
blown up.** Everything now renders at native delivery size, and every crop goes
through `tools/media.mjs`, which declares its display width and prints the
magnification. Anything over 1.35x gets flagged. This week's frames run
0.97x-1.30x.

**The real ceiling lift is an operator task:** re-export the screenshots at 2x
device pixel ratio (2480x1550). It is in the open questions.

---

## Audio on Reels — corrected 2026-09-07

The earlier note here said a Creator account means the trending chart library is
available, so use it. **That was the wrong advice, and it is withdrawn.**

Multiple independent secondary sources agree that Instagram's deals with labels
cover *personal and creator* use, not commercial use, and that business accounts
get the smaller commercially-cleared Meta Sound Collection instead. Kairo is a
business promoting software. Switching account type changes which tracks the
picker *offers*; it does not grant a commercial licence for them.

**I could not verify this against Meta's own documentation** — the Instagram
help centre renders client-side and did not return content. So this is not
certain, and it is written here as the conservative reading rather than a fact.

**What to actually do:** use the commercially-cleared sound collection in the
app, or post silent with on-screen text. The downside is asymmetric — a slightly
less fashionable track costs a little reach, and a muted or struck post costs
the whole thing. Revisit if the operator gets a straight answer from Meta.

---

## Voice

Speech, not copy. Contractions, first person, one reader. Plain nouns — "the
diary", "the chair", "the front desk". Concrete over abstract: "$400 once"
beats "affordable"; "twelve booked, four done" beats "full visibility".
Understated — the offer is unusual enough that hype reads as doubt. Never talk
down to a salon owner; they run a business.

No exclamation marks. Two emoji at most. Banned-word list lives in
`config/brand.json` → `voice.banned_words` and is **word-boundary matched** —
see the note at the top of `phraseRe()` in `tools/critic.mjs` for why that is
not negotiable.

`cannot` is deliberately exempt from the contraction rule. The product copy
uses it well ("it cannot be double-booked") and contracting it weakens the line.

---

## The account's real numbers

**Unmeasured. All of them.**

The operator agreed on 2026-08-26 to grant read access rather than paste
screenshots. **That is an intention, not a capability** — no handle, no token,
no credential store in this environment, and nothing has read the account once.
`content/memory/2026-08-25.json` is a baseline of nulls, on purpose. Until a
token has actually returned a figure, every report says **unmeasured**, never
`0`, and no run produces a percentage about this account.

Do not report agreed access as access. That is the same error as reporting an
API's success response as a delivered email.

**A distinction that must not blur:** the operator's brief cites video at 8.11%
across 22 posts against images at 1.11% across 3. That is from the operator's
**own prior account**, not Kairo's. It is a strong prior and a good reason to
lead with video — it is **not** a Kairo number and must never be reported as
one. Kairo's own format split is unmeasured until it is read.

---

## Invariants

Each of these has cost somebody something.

1. **Nothing publishes automatically.** Gloss produces; the operator posts.
   There is no API write path in this repo and there should not be one.
2. **No AI-generated photographs of the product or the salon.** An AI "result"
   misrepresents work the business did not do, and Meta auto-labels detected AI
   imagery. This bans AI *photographs*, not photographs — real ones are the most
   valuable asset here. Enforced by `asset_provenance` on every post;
   `ai_photo` is refused by the Critic.
3. **Every caption passes the Critic before handover.** If it fails, fix the
   caption. Never loosen the rule. Changing a rule is a decision that gets
   written down here, not a check that gets switched off.
4. **Southern hemisphere.** August is winter in Melbourne. Say "autumn", not
   "fall". The Critic checks the season word against the post's own date.
5. **Prices come from `config/brand.json`.** Never from memory, never from chat.
   If a price carries a `from` flag, the copy says "from".
6. **Never discount to fill a quiet slot, unprompted.** A price cut teaches the
   audience to wait for the next one. Fill capacity with scarcity and
   convenience. If the operator explicitly asks for a promotion, record it in
   `brand.json` → `offers.active_promotions` with who asked and when, and never
   extend or repeat it unasked. Discount language with no authorising entry is
   a Critic failure.
7. **"Not posted" is not "it failed."** Match what was authored against what is
   live and report the two states separately. A post that never went up is an
   unrun experiment; conflating them is how a good format gets abandoned because
   someone had a busy week.
8. **Never assert a competitor's price, plan or commission rate.** Terms differ
   by plan and country and go stale. Talk about business models — those are
   verifiable and they hold. The showcase site already learned this the
   expensive way; see "Tried and rejected" below.
9. **Never assert a market statistic or an engagement figure that was not read
   from a live source.** Percentages in captions must be declared in the post's
   `verified_figures` with a link that resolves, or they get cut.
10. **Never point a caption at a destination that does not exist.** No live
   URL and no real inbox means the call to action is a DM, and saying otherwise
   sends an interested salon owner into a dead end — the most expensive kind of
   mistake, because it only happens to the people who were convinced.

---

## What is actually available to build with

- **25 genuine product screenshots** in `public/screenshots/` — real UI of the
  real system, showing a demo salon ("Luxe Hair Studio") with invented clients,
  every frame set on the same Thursday at 11:40. Not AI imagery. This is the
  single strongest owned asset and it was sitting in the repo unused by
  marketing. Highlights: `01-dashboard.jpg` (the day answered), `04-calendar-day.jpg`
  (the diary), `07-notify-prompt.jpg` (the notify moment — the differentiator),
  `11-pos.jpg` (payments), `19-booking-services.jpg` (the shopfront),
  `23-phone-dashboard.jpg` (in the hand).
- **The brand system** — `#3b82f6` on cool paper `#F7F8FB` or dark `#0A0E17`,
  Inter Tight display over JetBrains Mono furniture, one ink at four opacities.
  Sampled from the product itself, so cards match the software.
- **No photography of the salon, the owner or the work.** This is the gap. For a
  business selling software the screenshots substitute well, but a real salon
  floor is the thing an owner recognises. Ask for the camera roll.

---

## Tried and rejected

- **A commission calculator on the showcase site** — removed. It quietly treated
  "new to you" as "sourced by the platform", which overstates the saving, and a
  salon owner who spots that has reason to distrust the rest of the page.
  Replaced by a payback calculator that only divides Kairo's own $400 by the
  visitor's own average ticket. *(Pre-Gloss; carried forward because the lesson
  is the same one invariant 8 protects.)*
- **Nothing rejected by Gloss on performance yet.** Two packs authored, none
  scored, because the account is still unread. No format has earned or lost its
  place.

### Rule changes, and why

- **2026-09-07 — the Critic's discount rule was narrowed, not loosened.**
  `\bsale\b` flagged "point of sale", which is a feature of the product, in an
  otherwise clean caption. The marker now excludes that one phrase and nothing
  else: a discount "sale", "on sale" and "half price sale" all still fail, with
  regression tests for each. This is the distinction that matters — a rule
  becomes *more* precise, and the decision gets written down here. Switching the
  check off, or dropping "sale" from the list, would have been the other thing.

---

## Open questions

Six were asked on 2026-08-26. Four are answered and recorded above; two remain,
and the first blocks everything.

0. **Higher-resolution product screenshots.** Re-export `public/screenshots/`
   at 2x device pixel ratio. The current 1240x775 frames are the ceiling on how
   sharp any post can look, and every design decision is currently working
   around them.
1. **The Instagram handle.** Still unknown. Without it there is no account to
   read, with or without a token. This is the single hardest blocker, and it is
   the reason every number in `content/memory/` is still null.
2. **The read-access credential.** Agreed, not delivered. Needs the handle, a
   Meta app with Instagram Insights permissions on the linked Professional
   account, and somewhere for the token to live that is not this repo.

**Answered — do not re-ask:** account type (Creator), audience (Melbourne warm
network), how numbers arrive (read access, pending), where captions point
(nowhere yet — DM), GST (included in the $400), and handover (in the
conversation, not by email).

---

## The system

| Path | What it is |
|---|---|
| `CLAUDE.md` | this file — working memory |
| `config/brand.json` | prices, voice rules, hashtags, palette, provenance rules |
| `tools/critic.mjs` | the linter every caption passes; `npm run critic <file>` |
| `tools/critic.test.mjs` | its tests; `npm run critic:test` — 41 cases |
| `content/context/notes.md` | what the operator says; read first, every run |
| `content/memory/*.json` | one dated snapshot per week |
| `content/packs/<date>/` | the finished week — captions, images, handover |
| `tools/media.mjs` | product-frame crops + the magnification auditor |
| `tools/render-cards.mjs` | HTML → 1080x1350 PNG slides |
| `tools/render-reel.mjs` | HTML → 1080x1920 h264 MP4 |
| `tools/reel-lib.mjs` | easing, cinematic transitions, reel chrome |
| `tools/contact-sheet.mjs` | tiles a week into one image for review |
| `AGENTS.md` | the full capability handbook — how the work is actually done |
| `.claude/commands/` | `/start`, `/send`, `/ads` |

**Handover is in the conversation, not by email** *(operator, 2026-08-26)*.
`/send` renders every image inline with `SendUserFile` and puts each caption in
its own copyable block, and it still writes `HANDOVER.md` to the pack — because
a pack that scrolls away has the same failure shape as a pack in a folder
nobody opens.

**Do not spend searches trying to find a specific Instagram Reel to copy.**
Step 5 of `/start` asks for one, and it has failed twice (2026-08-28,
2026-09-07) for a structural reason: web search does not usefully index
individual Instagram posts. Four query shapes returned only SEO listicles and
vendor pages. The way out is the operator sending two or three links to Reels
they have actually seen work — they scroll Instagram, Gloss cannot. Until then,
verify platform mechanics from primary sources instead, and say the video
example is missing rather than dressing a listicle up as one.

**Run the Critic's tests after touching `brand.json`.** The voice rules are
regex inputs; a stray entry can silently start flagging good copy, and a linter
that cries wolf gets switched off within a fortnight.
