---
description: The weekly Gloss run for Kairo, end to end — read, score, ask, research, produce, predict, hand over.
---

Run the whole week in one pass. Do not stop halfway to check in, except at
step 4, which is the one question set.

Read `CLAUDE.md` and `config/brand.json` first. Both, every time. Prices come
from the file, never from this conversation.

## 1 — Read the live account

Read whatever access exists. **Real numbers or none.** If a metric comes back
empty, it is `unmeasured` — never `0`. If there is no access at all, say so in
one line at the top of the report and carry on; the rest of the run still has
value.

Record: followers and 7-day change, reach, profile visits, link clicks, average
engagement rate, and the **format split** — average engagement by media type,
each with the post count it averages over.

## 2 — Check what actually got published

Open last week's pack. For each caption authored, match it against what is live.

Report each as **published** (with its engagement and its lift against the
account's own average) or **not published**. These are different states, not
degrees of the same one. A post that never went up is an unrun experiment.

## 3 — Score last week's prediction

Read `next_prediction` from the most recent `content/memory/*.json`. Say plainly
whether it held. Do not quietly move on from a miss — that is the thing that
makes the loop compound instead of restarting every Monday.

## 4 — Ask the operator, once

One tappable question set, answered on a phone between customers. Cover:

- Which days or slots need filling this week
- Did the video get made
- Anything from the front line worth posting — what a client said, what went
  wrong, what got fixed
- Anything to avoid

**If something authored last week did not go up, always ask why.** That single
answer is the most useful sentence this system can be given, and the reason is
usually a fixable failure on this side, not theirs.

Write the answers into `content/context/notes.md` under a dated block.

## 5 — Research what is actually working

Two or three searches. Find **real, linkable examples in this niche** — salon
software, salon owners, small-business software on Instagram — not generic
platform advice.

**Verify every URL resolves before citing it.** Never assert a view count that
was not read. If a claim cannot be checked, it does not go in the pack.

Point at one specific, currently-working video the operator could rebuild with
their own footage, and write the steps to rebuild it. "Make a talking-head
explainer" leaves the hardest part — what it looks like — as an exercise.

## 6 — Produce the finished work

Images rendered, captions written, hashtags in. Not briefs. Not options to
choose between. The operator opens their phone, saves the image, pastes the
caption, posts.

- Lead with the format the data supports. Until Kairo's own format split is
  measured, the operator's prior-account evidence (video far ahead of images)
  is the working prior — say that it is a prior, not a Kairo number.
- Use the real product screenshots in `public/screenshots/`. They show what the
  thing actually is, which is the biggest single lever on a still image.
- Video guides must cost nothing: something the operator is **already doing**,
  one shot, no editing, phone propped so both hands are free. Three weeks of
  "no time" means the guides were too expensive, however good they were.
- Write `content/packs/<monday>/pack.json`, then run:

      npm run critic content/packs/<monday>/pack.json

  Fix every failure in the caption. Never loosen a rule to get a pass.
- **Look at every image before shipping it.** Dead space, bad wrapping, numerals
  that misread. An image nobody has looked at is not finished.

## 7 — Write a projection

Target numbers, the one thing to change — drawn from the data, not from
principle — and what this sets up for next week. Name the one variable being
tested, and change only that one.

If a format underperformed, say so out loud and do not run it again. If one
over-performed, run a variant.

## 8 — Write memory, then hand over

Write `content/memory/<monday>.json`: the numbers, the format split, the
attribution result, what the operator said, the prediction scored, and the new
prediction. Then write `HANDOVER.md` in the pack — image, then its caption, in
posting order, each caption in a block sized to copy on a phone.

Then run `/send`.

## Reporting

**If the data contradicts what was built, lead with that.** Do not bury a bad
number under the new work. Say what was not done and why. Flag any contradiction
between what the operator said and what has been asked for since — build what
was asked for, and put the conflict at the top.
