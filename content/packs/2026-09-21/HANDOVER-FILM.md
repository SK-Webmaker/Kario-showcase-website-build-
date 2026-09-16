# Handover — the narrated film

**35.7 seconds, 1080×1920, with sound.** Caption passed the Critic clean.

---

## Before anything else: I cannot hear this

I generated the voice and the music, mixed them, and verified every number I
could measure. **I could not listen to any of it.** Somebody has to play this
back before it goes out.

What I *did* verify, by measurement rather than by ear:

- The voice reads at **-16.5 dB** average.
- The music sits **16 dB under the voice during speech** and **9 dB under in the
  gaps** — it pulls back for every line and swells between them.
- Peak level **-3.4 dB**, so nothing clips.
- Final mix normalised to **-14 LUFS**, which is where Instagram wants it.

Those are broadcast-typical numbers. They do not tell you whether the voice
*sounds* right, and that is the one judgement I cannot make.

## The voice is AI, and that is worth a thought

You asked for an AI voice, so that is what this is. Two honest notes:

1. **Meta labels AI-generated media where it detects it.** An AI read is not
   deceptive — it is not impersonating anyone — but the label may appear.
2. **Your own voice would probably land harder.** This account sells to a warm
   Melbourne network: people who know you or know someone who does. A real voice
   saying "I set it up with you" is worth more than a polished synthetic one.
   **The script is written to be read by a human in one take** — it is in
   `audio/timeline.json` line by line. If you record it, I can re-cut the film
   to your timing in about ten minutes.

## Why this is a film and not a slideshow

The whole thing is **one continuous camera move through a single 3D space.**
Nothing cuts. The camera drifts in on the title, flies past six cards as the
voice names them one at a time, pulls back to find them fallen into a mess,
pushes into the card that replaces them, then settles on the real software and
the price.

Everything that makes that work:

- **Real CSS 3D with perspective**, so parallax, scale and occlusion come out of
  the geometry rather than being faked per element.
- **Depth of field computed from each object's actual distance to the camera** —
  things genuinely go soft as the camera leaves them behind.
- **A hand-held float** layered on top of every move, so nothing is ever locked
  off like a slide.
- **Smootherstep easing** between camera framings — zero velocity *and* zero
  acceleration at both ends, so you never see the camera start or stop.
- **The picture is cut to the voice.** `tools/cut-vo.mjs` ran silence detection
  over the raw read, tightened every pause to a length I chose per line (the
  six-job list rattles; there is a deliberate beat of silence before "Kairo is
  all six"), and wrote out exactly where each line lands. The camera keyframes
  are anchored to those real timings.
- A single **white bloom on the reveal**, film grain, a warm grade and letterbox
  bars that open at the head and close at the tail.

## Two versions now exist

| File | What it is |
|---|---|
| `video/reel-explainer.mp4` | The silent one. 27s, scene-by-scene, on-screen text only. |
| `video/reel-film-sound.mp4` | **This one.** 35.7s, narrated, continuous camera, music bed. |

Post the narrated one **with sound on** — the caption says so. Keep the silent
version; it is the better choice if you ever want to post the same idea without
audio, and it is a fair comparison if you want to know whether sound helps.

## What I would still change

The bottom third of the frame is deliberately quiet — that is where Instagram
puts the caption and the action buttons. It looks empty in a still and correct
on the platform.

**If the voice sounds wrong, do not have me regenerate it blind.** Tell me what
is wrong with it — too fast, too British, too smooth — and I will change the
specific thing. Generating another one and hoping is not a method.
