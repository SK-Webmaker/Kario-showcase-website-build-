# Research — week of 2026-08-31

## The finding that changed the work

**Square publishes its Australian salon pricing openly.** Checked directly:
<https://squareup.com/au/en/solutions/beauty> lists three named tiers with
dollar figures against each, per month, per location.

This matters because the plan going in was to lean on *"in a category where
everyone says contact us, publishing a number is the differentiator."* For this
category, in this country, that is **false**, and a caption built on it would
have been wrong in a way a salon owner could check in thirty seconds.

The differentiator that survives the check is not transparency, it is **shape**:
the category's normal price is recurring and per-location, and Kairo's is a
one-off. That claim is about a business model, so it stays true when anyone's
rate changes — which is exactly what invariant 8 exists to protect.

Slide `p2-06-priceshape` and the closing line of post two are built on the
reframe, not the original thesis. **No competitor's figures appear in any
caption or on any slide**, including the ones read above.

## What I could not find, and did not fake

`/start` step 5 asks for one specific, currently-working video to point at and
rebuild. **I did not find one.** Three searches returned SEO listicles and
competitor landing pages — not individual posts, and nothing with a view count
that can be verified from a source rather than from a blog quoting itself.

Those listicles carry figures like "carousels get 35% more saves" and "the
first slide carries 80% of the weight." **None of them are used anywhere in
this pack**, in a caption or on a slide, because none resolve to a primary
source. Searched and came back empty is a result; inventing a citation would
not be.

Searches run:
- salon software brand Instagram carousel posts examples product screenshots
- Instagram carousel first slide hook B2B SaaS software screenshots saves 2026
- salon owner screen recording booking software reel before/after admin
- Melbourne salon owner instagram software switch double booked reel

## The video that costs nothing

Video is the format the operator's own prior-account evidence favours heavily,
and it is not a Kairo number — see CLAUDE.md. There is no salon footage and no
camera roll yet, so the cheapest possible video is one that needs neither:

**A screen recording of the notify prompt, done on the phone. About 20 seconds.**

1. Open Kairo on the phone. Start the phone's own screen recording.
2. Drag one booking to a different time — something already being done anyway.
3. Let the prompt appear. Pause on it for two full seconds so it can be read.
4. Tap "Email and text them". Stop the recording.
5. Post it with no edit and no music, and put the words on it as a caption
   overlay in-app: *"Every other diary just moves it. This one asks who to tell."*

No filming, no face, no salon floor, no editing timeline. It is a recording of a
thing that happens anyway, and it shows the one feature nothing else in the
category does. If this account is going to test video at all, this is the
cheapest possible first test.

**Check before filming to any trending audio:** the account is Creator, so the
chart library should be available — but confirm the specific track shows in the
in-app audio picker for this account first. A muted post cannot be un-muted.

## Two demo-data problems found in the screenshots

Both are in `public/screenshots/`, which means both are also live on the
showcase site. Neither is a marketing problem I can fix by cropping alone.

1. **`11-pos.jpg` shows "GST (8.5%)".** Australian GST is 10%. To a Melbourne
   salon owner — the exact audience — that is a visible error on the money
   screen. The slide that uses this frame is cropped to the line items, above
   the tax row, so the pack does not show it. The fix belongs in the demo data.
2. **`07-notify-prompt.jpg` shows "(555) 377-8810"**, a US-format number, while
   `19-booking-services.jpg` correctly shows a Melbourne address and an (03)
   landline. The notify modal is the strongest single frame in the whole set, so
   it is used as-is: doctoring a product screenshot to make it look better than
   it is would be worse than the blemish.
