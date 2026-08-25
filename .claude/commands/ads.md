---
description: Paid creative for Kairo — researched before written, and built as an ad rather than as a post.
---

**Ads are not posts.** Different discipline entirely, and treating them as the
same thing is the most common way paid money is wasted.

A post is read by people who already follow the account and is scored on saves
and shares. An ad interrupts a stranger and is scored on **one action**.

## Before writing anything

1. Read `CLAUDE.md` and `config/brand.json`.
2. Read `content/memory/` — what has already worked organically is the best
   available prior on what a stranger will stop for.
3. **Research first.** Find what is currently running in this category and what
   the platform's current creative guidance actually says. Verify every URL
   resolves. Never assert a benchmark that was not read from a source.
4. Confirm the objective with the operator, in one question: what is the single
   action this ad is scored on — a booking call, a link click, a message?

## Building the creative

- **Less text on the image, not more.** Heavier text overlay gets more expensive
  delivery. An ad that needs three lines to make sense is not ready.
- **One action.** One button, one destination, one thing to do.
- **Feed margins, not Stories margins.** In feed the caption and the button
  render *below* the image, so a full Stories safe area donates the best real
  estate on the creative to nothing. Size the safe area to where the ad will
  actually run, and say which placement each asset is for.
- The invariants hold without exception: no AI photographs of the product, the
  price comes from `config/brand.json`, and no competitor's price or rate is
  ever asserted.
- **Publishing the price is likely the differentiator.** In a category where
  everyone says "contact us", a plain number gets screenshotted and forwarded,
  and it kills the "how much is it?" enquiry that otherwise sits unanswered for
  two days and loses the sale. Worth testing explicitly, and worth measuring.

## Before handover

- Every ad caption passes the Critic, same as a post.
- **Look at every rendered asset.** Check the text is not clipped by the safe
  area, that numerals read correctly at thumbnail size, and that the crop works
  at the placement's real aspect ratio.
- Say what is being tested and how it will be judged. An ad with no stated
  success condition cannot be turned off for a reason.
