# Handover — the narrated film

**36.0 seconds, 1080×1920, with sound.** Caption passed the Critic clean.

Revised 2026-09-16 on your four notes: Australian voice, less robotic, more
going on, fill the screen, kill the bar at the top. **Three of the four are
done. The accent is not, and I will not pretend otherwise** — see below.

---

## 1. The bar is gone

Removed entirely: the markup, the CSS and the per-frame update. Nothing in this
film now tells a viewer how much is left. You were right to flag it — a reel
that shows its own remaining length is inviting the swipe.

## 2. The screen is full now

I got this wrong last week. The old handover said the bottom third was
"deliberately quiet" and would look right on the platform. It read as empty
because it *was* empty, and that is the note you gave me.

What changed:

- **The six cards are portraits now**, 520×720 on a 700px vertical pitch instead
  of squat landscape cards on a 320px pitch. The pile they fall into fills the
  frame top to bottom instead of sitting in a band across the middle.
- **The close-ups are actually close.** A card now renders at 766×1049 in a
  1080×1920 frame — 71% of the width, 55% of the height. Before it was 520
  wide and 520 tall, floating in cream.
- **The payoff card lists all six jobs, ticked** — it used to be a name and a
  strapline on a mostly empty blue rectangle.
- **The product shot is three real frames in depth**: the dashboard, the diary,
  and the phone, arriving one after another rather than a single letterboxed
  strip.
- **The price block carries a rate card** — setup, every month after, per
  booking — under the number.
- **Four layers that never switch off**: a ruled floor and a ghost word deep in
  the scene (both parallax with the camera), drifting dust, and designed
  furniture on all four edges — corner marks, vertical rails, and a ticker along
  the bottom that never stops moving.

That last one matters more than it sounds. A held shot with nothing moving in it
reads as a paused video. Something is always moving now.

## 3. More going on

All of it is a pure function of time, so the render is reproducible frame for
frame:

- Cards **flip in on the Y axis** with a light sweep crossing them.
- A **tick draws itself** on each card as its line lands — and un-draws when the
  pile falls apart.
- Display type arrives **word by word**, each word rotating up off its baseline.
- **Impact shake** on "double-book" and on the reveal, with **colour fringing**
  that tracks the shake the way a real lens does.
- **Speed streaks** driven by the camera's actual z velocity — they only appear
  on the real pushes, because they are computed from the move, not placed by
  hand.
- A highlight **crosses the product frames** on the Melbourne line.

## 4. The voice: what I could and could not do

**I could not regenerate it. The Picsart account is down to 1 credit** and the
allowance resets **2026-09-23**. A voice generation costs more than that, so the
audio on this cut is still the same read.

I am telling you this rather than shipping a re-render and letting you assume
the accent changed.

**What I did fix without credits:** the rhythm. A generated read pauses by the
clock — the old cut had six identical 200ms gaps through the six-job list, which
is the single most mechanical thing in a TTS performance. Every gap is now a
different length, chosen per line: the list rattles at 130–240ms, there is a
full 800ms after "double-book", and a one-second hole before "Kairo is all six."
That is a real improvement to how human it sounds, and it is not the accent.

**What is staged and ready for the 23rd:**

1. `tools/vo-spans.mjs` is new. Run `node tools/vo-spans.mjs <new.mp3>` and it
   prints the speech spans in exactly the shape `tools/cut-vo.mjs` wants. Those
   spans were hand-measured before and went stale the moment the voice changed;
   that was a trap and it is now a command. I verified it against the current
   read — it reproduces the existing table.
2. The generation call itself: ElevenLabs v3, Australian voice, with the script
   punctuated for a conversational read. The script is unchanged, so the film
   does not need rewriting — only `audio/timeline.json` gets regenerated and the
   camera follows it automatically.

**Say the word on the 23rd and it is about twenty minutes of work**, most of it
the re-render.

---

## Still true: I cannot hear this

I measured everything I could and listened to none of it.

- Voice **-16.5 dB** average, peak **-3.4 dB**, nothing clips.
- Music **16 dB under the voice during speech**, **9 dB under in the gaps**.
- Final mix normalised to **-14 LUFS**, where Instagram wants it.

Broadcast-typical by measurement. Whether it *sounds* right is the one
judgement I cannot make. **Play it before you post it.**

## Your own voice would still beat this

This account sells to a warm Melbourne network — people who know you or know
someone who does. A real voice saying "I set this up" is worth more than a
polished synthetic one, Australian or not. The script is written to be read in
one take and it is in `audio/timeline.json` line by line. Record it on a phone
and I will re-cut the film to your timing.

## Two versions exist

| File | What it is |
|---|---|
| `video/reel-explainer.mp4` | The silent one. 27s, scene-by-scene, on-screen text only. |
| `video/reel-film-sound.mp4` | **This one.** 36s, narrated, continuous camera, music bed. |

Post the narrated one **with sound on** — the caption says so.
