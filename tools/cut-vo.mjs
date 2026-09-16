#!/usr/bin/env node
/**
 * Re-cut a voiceover to a tighter rhythm, and emit the exact timing map.
 *
 *   node tools/cut-vo.mjs <in.mp3> <out.wav> <timeline.json>
 *
 * WHY. A raw TTS read has even, slightly slack pauses. A film does not: a list
 * rattles, and a reveal gets a beat of silence in front of it. This cuts every
 * gap to a length chosen per line, then writes out where each line actually
 * lands so the picture can be cut to the voice rather than to a guess.
 *
 * The speech spans below were read off ffmpeg's silencedetect on the source,
 * not estimated. If the VO is regenerated they must be re-read — run
 * `node tools/vo-spans.mjs <new.mp3>` and paste its output over LINES.
 *
 * The gaps are deliberately irregular. A generated read pauses by the clock;
 * a person does not. Six identical 200ms gaps in a six-item list is the single
 * most mechanical thing in a TTS performance, and it is fixable in the edit
 * without touching the voice.
 */
import { execFileSync } from "node:child_process";
import { writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const FF = process.env.FFMPEG_BIN ||
  "/tmp/claude-0/-home-user-Kario-showcase-website-build-/2ed07d40-187e-5c8d-ab34-babb0687fb45/scratchpad/node_modules/ffmpeg-static/ffmpeg";

/** [start, end, gapAfter, id, words] — seconds, from silencedetect. */
const LINES = [
  [ 0.000,  1.6446, 0.30, "six",      "A salon does six jobs."],
  [ 2.0399, 3.1250, 0.62, "everyday", "Every single day."],
  [ 3.9135, 4.8049, 0.14, "j1",       "Take the bookings."],
  [ 5.3468, 6.3904, 0.24, "j2",       "Remember the clients."],
  [ 7.0176, 7.7228, 0.13, "j3",       "Take the money."],
  [ 8.3947, 9.4640, 0.22, "j4",       "Send the reminders."],
  [ 9.9574,10.7992, 0.34, "j5",       "Fill the gaps."],
  [11.4196,13.1584, 0.80, "j6",       "And never, ever double-book."],
  [14.1410,17.3574, 0.36, "most",     "Most salons do those six jobs in six different places."],
  [18.0322,18.9422, 0.13, "t1",       "A paper diary."],
  [19.3258,20.0499, 0.24, "t2",       "A spreadsheet."],
  [20.6181,23.0254, 1.00, "t3",       "A card machine that knows nothing about the diary."],
  [24.0718,25.4464, 0.22, "kairo",    "Kairo is all six."],
  [26.1331,28.2344, 0.60, "onelogin", "One login, on your own booking link."],
  [29.0387,30.1032, 0.22, "real",     "It's real software."],
  [30.5807,33.1217, 0.66, "melb",     "It's been running a Melbourne salon since day one."],
  [33.8846,34.8849, 0.20, "price",    "Four hundred dollars."],
  [35.4213,35.8345, 0.46, "once",     "Once."],
  [36.4556,37.0700, 0.00, "nothing",  "Then nothing."],
];

const PAD = 0.045;   // a little air so consonants are not clipped
const TAIL = 1.6;    // room to let the last line land before the film ends

const [, , inFile, outFile, mapFile] = process.argv;
if (!inFile || !outFile || !mapFile) {
  console.error("usage: node tools/cut-vo.mjs <in.mp3> <out.wav> <timeline.json>");
  process.exit(2);
}

const work = mkdtempSync(join(tmpdir(), "vo-"));
const parts = [];
const timeline = [];
let cursor = 0;

LINES.forEach(([s, e, gap, id, words], i) => {
  const from = Math.max(0, s - PAD);
  const dur = (e + PAD) - from;
  const seg = join(work, `s${String(i).padStart(2, "0")}.wav`);
  execFileSync(FF, ["-y", "-loglevel", "error", "-ss", from.toFixed(4), "-t", dur.toFixed(4),
    "-i", inFile, "-ar", "48000", "-ac", "1", seg]);
  parts.push(seg);
  timeline.push({ id, words, start: +cursor.toFixed(3), end: +(cursor + dur).toFixed(3) });
  cursor += dur;

  if (gap > 0) {
    const sil = join(work, `g${String(i).padStart(2, "0")}.wav`);
    execFileSync(FF, ["-y", "-loglevel", "error", "-f", "lavfi",
      "-i", `anullsrc=r=48000:cl=mono`, "-t", gap.toFixed(4), sil]);
    parts.push(sil);
    cursor += gap;
  }
});

// A short silent tail so the final card can breathe before the loop.
const tail = join(work, "tail.wav");
execFileSync(FF, ["-y", "-loglevel", "error", "-f", "lavfi",
  "-i", "anullsrc=r=48000:cl=mono", "-t", String(TAIL), tail]);
parts.push(tail);

const listFile = join(work, "list.txt");
writeFileSync(listFile, parts.map((p) => `file '${p}'`).join("\n"));
execFileSync(FF, ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0",
  "-i", listFile,
  // Gentle broadcast-style levelling so the read sits evenly under music.
  "-af", "loudnorm=I=-16:TP=-1.5:LRA=11,highpass=f=80",
  "-ar", "48000", "-ac", "1", outFile]);

const total = +(cursor + TAIL).toFixed(3);
writeFileSync(mapFile, JSON.stringify({ duration: total, lines: timeline }, null, 2) + "\n");
rmSync(work, { recursive: true });

console.log(`  voice: ${total}s (was 37.07s)`);
for (const l of timeline) console.log(`    ${l.start.toFixed(2)}–${l.end.toFixed(2)}  ${l.id.padEnd(9)} ${l.words}`);
