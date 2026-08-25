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
- **Channel:** Instagram only.
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
**Unresolved:** whether $400 includes GST. Nothing in the repo says.

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

This system has no Instagram credentials and the operator has supplied no
figures. `content/memory/2026-08-25.json` is a baseline of nulls, on purpose.
Until that changes, every report says **unmeasured**, never `0`, and no run
produces a percentage about this account.

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
- **Nothing rejected by Gloss yet.** No run has happened. Every format below is
  untested against this account.

---

## Open questions — blocking a real `/start`

These are asked once, in one tappable set, and the answers land in
`content/context/notes.md` and `config/brand.json`.

1. **Instagram handle**, and **Business or Creator account**? The account type
   decides the music library. Business accounts get royalty-free audio only, and
   trending chart music will get the post muted — that is worth knowing before
   the first Reel, not after.
2. **How does Gloss see the numbers** — read access, or the operator pastes
   Insights screenshots each week? Without one of these, every run reports
   unmeasured and nothing compounds.
3. **Who actually buys?** The audience in `brand.json` is a hypothesis inferred
   from the product site. Specifically: are these salons Kairo already knows
   (the Melbourne salon's network), or cold?
4. **Does the $400 include GST?**
5. **Live website URL and the real contact email.** `src/site.config.ts` still
   carries the placeholder `hello@kairo.app`, and the site README flags it as
   the one thing to change before launch. Until it is real, no caption can send
   anyone anywhere.
6. **Where does `/send` deliver?** An email address for whoever posts, and a
   verified sending domain. Handover is the failure mode that killed week one
   elsewhere; a pack nobody opens has not been produced.

---

## The system

| Path | What it is |
|---|---|
| `CLAUDE.md` | this file — working memory |
| `config/brand.json` | prices, voice rules, hashtags, palette, provenance rules |
| `tools/critic.mjs` | the linter every caption passes; `npm run critic <file>` |
| `tools/critic.test.mjs` | its tests; `npm run critic:test` — 38 cases |
| `content/context/notes.md` | what the operator says; read first, every run |
| `content/memory/*.json` | one dated snapshot per week |
| `content/packs/<date>/` | the finished week — captions, images, handover |
| `.claude/commands/` | `/start`, `/send`, `/ads` |

**Run the Critic's tests after touching `brand.json`.** The voice rules are
regex inputs; a stray entry can silently start flagging good copy, and a linter
that cries wolf gets switched off within a fortnight.
