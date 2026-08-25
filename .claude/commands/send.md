---
description: Email the finished week to whoever posts it — images embedded above their own captions.
---

Handover is a failure mode, and it is invisible. A week of finished work that
sits in a folder nobody opens has not been produced. This command exists
because "the files were in the repo" is not delivery.

## What to send

The current pack in `content/packs/<monday>/`. If a pack was not built this
week, stop and say so — do not send a stale one.

**Refuse to send a pack that has not passed the Critic.** Run it first:

    npm run critic content/packs/<monday>/pack.json

## Shape of the email

Built for a phone, read between customers.

- One line at the top: what is in here, and anything that needs a decision.
- Then, per post, in posting order:
  1. **The image, embedded and visible** — not an attachment, not a link.
  2. The planned day and format.
  3. **The caption in its own block**, sized to be selected and copied on a
     phone in one gesture. Hashtags included, in the block, exactly as they
     should be pasted. Nothing above or below the block that would get caught
     in the selection.
- Then the projection, in three lines at most.
- Then the one question set, if `/start` has not already had its answers.

No preamble, no explanation of the strategy. The operator is standing up.

## Sending

Use the Resend tools. The recipient address and the verified sending domain are
**open questions in `CLAUDE.md`** — if they are not answered yet, stop and ask
rather than guessing an address.

**Confirm the email actually landed.** A success response from the API is not
confirmation of delivery. Check the message's delivery status, and report what
was actually observed — not what was returned at send time.

If sending is not possible, say so plainly and write the pack's `HANDOVER.md`
so it can be forwarded by hand. Then say, in the same breath, that the handover
has not happened yet.
