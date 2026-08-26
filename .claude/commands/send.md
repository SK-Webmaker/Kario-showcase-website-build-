---
description: Hand the finished week over — every image rendered in the conversation, every caption in a block sized to copy on a phone.
---

Handover is a failure mode, and it is invisible. Week one elsewhere produced
three finished posts and none went up — not because they were bad, but because
the files sat in a folder and the person never saw them.

The operator reads the pack **here, in the conversation** (their choice,
2026-08-26 — see `config/brand.json` → `handover`). That has the same failure
shape as the folder: a pack that scrolls away is a pack that was never
delivered. So this command does two things at once, and neither substitutes
for the other.

## Before anything

Run the Critic. **Refuse to hand over a pack that has not passed.**

    npm run critic content/packs/<monday>/pack.json

If no pack was built this week, stop and say so. Never hand over a stale one.

## 1 — Write the durable copy

`content/packs/<monday>/HANDOVER.md`, in posting order. For each post: the
image path, the planned day and format, then the caption in a fenced block
with nothing else inside the fence — no notes, no headings, nothing that would
get caught in a copy gesture. This is what survives the scroll and what next
week's run reads to check what was authored.

## 2 — Deliver it in the conversation

- **Send every image with `SendUserFile` so it renders**, not as a path the
  operator has to go and open. An image described but not shown has not been
  handed over. Send them in posting order, one call, `display: "render"`.
- Then, per post, in the same order: the day, the format, and the caption in
  its own fenced block — sized to select and copy on a phone in one gesture.
  Hashtags inside the block, exactly as they should be pasted.
- Then the projection, in three lines at most.
- Then anything that needs a decision, as a question — not buried in prose.

No preamble and no explanation of the strategy. The operator is standing up,
between clients, and everything above the first image costs them.

## Look at the images first

Open every rendered asset and actually look at it before sending. Dead space,
bad wrapping, numerals that misread at thumbnail size, text clipped by the
safe area. An image nobody has looked at is not finished, and sending it is
how a bad crop reaches a client's feed.

## Say what actually happened

If an image failed to render, or a caption is still failing the Critic, say so
in the same breath rather than handing over a pack with a hole in it. "Six of
seven are ready and the seventh is blocked on X" is a handover. Silence about
the seventh is not.
