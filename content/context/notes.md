# Operator notes

**Gloss reads this file at the start of every run, before anything else.**
It is for what the API cannot see: what happened on the floor, what the
operator wants avoided, what a client said, which slots are empty.

Add a dated block at the top. Rough notes are fine — bad handwriting beats
nothing. Delete nothing; old blocks are the record of what was tried.

---

## 2026-09-01 — Second /start run

Operator asked for 3-4 posts built for **urgency and hype**, in whichever format
gets the most views, one of them showing the system's key features on desktop
and phone, design pushed harder. Also asked for an analysis of how the past
posts have done.

**Two conflicts, both flagged at the top of the handover.**

*Hype vs the voice.* The voice rules say understated, because hype reads as
doubt on an offer this unusual, and invariant 6 forbids manufactured scarcity.
Built urgency from two honest sources instead: the reader's own calendar (count
back three months from your busiest week) and the running cost of the current
setup. Refused to invent spot counts, countdowns or deadlines — Reel 2's caption
says out loud that there is no countdown, which on a warm account does more work
than a fake one would. **If a real capacity limit exists, ask for the number.**

*Analysis of past posts.* Not possible, and reported as such. No account access,
and two of the three posts from last week had not reached their planned date.
Also unknown whether post 1 went up at all — asked directly, because "not
posted" and "posted and flopped" are different results.

**Delivered:** two real MP4 Reels (1080x1920, h264, 25.6s and 16.4s), one
light-theme single card, one six-slide carousel. Built `tools/render-reel.mjs` —
frame-stepped animation encoded with a static ffmpeg, so a Reel is finished work
rather than a shot list. Format is the one variable changed this week;
everything else is held constant so the comparison means something.

**Corrected my own advice from last week.** CLAUDE.md said a Creator account
means trending chart audio is fine. It is not: Instagram's label deals cover
personal and creator use, not commercial use, and Kairo is a business. Could not
verify against Meta's own docs (help centre renders client-side), so it is
recorded as the conservative reading. **Both Reels ship silent**, message on
screen, works muted.

**Narrowed a Critic rule, and wrote it down.** `\bsale\b` flagged "point of
sale" in a good caption. The marker now excludes that phrase only; a discount
"sale", "on sale" and "half price sale" all still fail, with regression tests
for each. 41 tests passing. Narrowing a rule to be more precise is not the same
as switching a check off, but it is still a decision, so it is in CLAUDE.md.

**Structural finding:** step 5's "point at a specific working video" has failed
twice because web search does not index individual Instagram posts. Recorded in
CLAUDE.md. **Ask the operator to send links to Reels they have seen work** —
they scroll Instagram, Gloss cannot.

---

## 2026-08-28 — First /start run

Operator asked for three posts: an introduction/infrastructure post, a
why-choose-Kairo post, and a third of my choosing. Wanted the software shown
rather than described, design taken from the showcase site, and a clearly
detailed call to action. Stated goal: warm the account up and open the door to
a first sale.

Produced three carousels, nineteen slides, all captions passing the Critic
clean. Post three is mine: **"$400 once? Where's the catch?"** — it answers the
objection that actually stops a sale, and slide four names what Kairo *won't*
do. Honesty about limits is the highest-trust move available to an account with
no reviews and no followers yet.

**The research finding that changed the work.** The plan was to lean on
"publishing a price is a differentiator because nobody in this category does."
Checked it: Square publishes its Australian salon pricing openly, in named
tiers. The thesis is false here, and a caption built on it would have been
checkable-wrong in thirty seconds. Reframed to the *shape* of the price —
recurring versus one-off — which is a business-model claim and stays true when
anyone's rate moves. No competitor figure appears anywhere in the pack.

**What I could not do.** Step 5 asks for one specific, currently-working video
to point at and rebuild. I did not find one — search returned listicles, not
posts, and no view count that resolves to a primary source. Wrote a zero-cost
video guide anyway (a 20-second screen recording of the notify prompt) but said
plainly that it is not modelled on a verified example.

**Two demo-data errors found in the screenshots**, both also live on the
showcase site: `11-pos.jpg` shows GST at 8.5% (Australia is 10%), and
`07-notify-prompt.jpg` shows a US-format phone number while the booking page
frame correctly shows a Camberwell address. The POS frame is cropped above the
tax row so the pack never shows it. The notify modal is used as-is — doctoring
a product screenshot would be worse than the blemish.

**Assumption to check:** captions and slides speak as "I", not "we" — *I set it
up with you*. Right for one person selling to their own network; wrong if
someone else does onboarding.

---

## 2026-08-26 — Operator, second question set

**GST — the $400 includes it.** So "$400 once" is complete as written, on the
site and in any caption. No qualifier needed, nothing to fix. Worth knowing
this closed cleanly: it was one of the two questions where guessing either way
would have put an invented number in front of a buyer.

**Handover — in the conversation, no email.** The operator reads the pack here
rather than in an inbox, so `/send` was rewritten: images rendered inline so
they are actually seen, captions in copyable blocks, and `HANDOVER.md` still
written to the pack. The durable copy stays, because "I'll read it here" has
the same failure shape as a folder nobody opens — a pack that scrolls away was
never delivered.

Resend is not set up and does not need to be.

---

## 2026-08-26 — Operator, first question set

Four of the six open questions answered.

**Numbers — read access.** The operator chose to grant Gloss read access to
the account rather than pasting Insights screenshots each week. Nothing has
arrived yet, so this is an intention, not a capability: no handle, no token,
no credential store in this environment. Every figure stays `unmeasured` until
a token has actually read the account once.

**Account type — Creator.** This is the opposite of what the spine assumed.
A Creator account reaches the trending chart audio library, so the main reason
to avoid current audio on a Reel is gone. Still worth checking in-app that a
specific track shows for this account before filming to it — a muted post
cannot be un-muted.

**Audience — Melbourne salons, warm network.** Salons connected to the one
already running Kairo: referrals, people who have seen it working, people one
conversation removed from a customer. This is the most decision-shaping answer
of the four. It means captions lean on proof rather than explanation, and it
means follower count is the wrong scoreboard — saves, shares and DMs are the
ones that matter at this size.

**Destination — nothing live.** Operator's words: *"i havent fully polished up
the website yet"*. So there is no URL a caption can point at, and the contact
email in `src/site.config.ts` is still the `hello@kairo.app` placeholder. Every
call to action is a DM until that changes. Worth re-asking the week the site
goes up, because a live page that publishes the price is the single strongest
thing this business could point at.

**Still open:** the Instagram handle, whether the $400 includes GST, and where
`/send` delivers.

---

## 2026-08-25 — Gloss, setting up

No operator notes yet. This file was created as part of the spine and has
never been written to by a human.

Open with the operator (also listed in CLAUDE.md → Open questions):

- Instagram handle, and whether the account is **Business** or **Creator**.
  This decides which music library is licensed. A Business account gets
  royalty-free audio only, and trending chart music will get the post muted.
- Whether Gloss gets read access to the account's numbers, or whether the
  operator will paste screenshots of Insights each week. Until one of those
  happens, every figure in every report reads `unmeasured` — never `0`.
- Who actually buys. The working hypothesis in `config/brand.json` was
  inferred from the product site, not confirmed by anyone.
- Whether the $400 includes GST.
- The live website URL, and the real contact email — `src/site.config.ts`
  still carries the placeholder `hello@kairo.app`.
