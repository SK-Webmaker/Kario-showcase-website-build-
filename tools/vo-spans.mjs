#!/usr/bin/env node
/**
 * Read the speech spans out of a voiceover, in the shape cut-vo.mjs wants.
 *
 *   node tools/vo-spans.mjs <vo.mp3> [noise_db] [min_silence]
 *
 * WHY. tools/cut-vo.mjs carries a hardcoded LINES table of [start, end, gap,
 * id, words]. Those spans are measured, not guessed, and they are stale the
 * moment the voiceover is regenerated. Doing that measurement by hand is how
 * a timeline quietly drifts out of sync with its picture, so it lives here.
 *
 * This prints the spans only. The ids, the words and the gap lengths are
 * editorial decisions and stay in cut-vo.mjs — paste the first two columns
 * across and check the count matches.
 */
import { spawnSync } from "node:child_process";

const FF = process.env.FFMPEG_BIN ||
  "/tmp/claude-0/-home-user-Kario-showcase-website-build-/2ed07d40-187e-5c8d-ab34-babb0687fb45/scratchpad/node_modules/ffmpeg-static/ffmpeg";

const [, , inFile, noise = "-34dB", minSil = "0.12"] = process.argv;
if (!inFile) {
  console.error("usage: node tools/vo-spans.mjs <vo.mp3> [noise_db] [min_silence]");
  process.exit(2);
}

// silencedetect reports on stderr, and `-f null -` exits 0 — so this has to be
// spawnSync and read stderr unconditionally. Reading it only from a thrown
// error (the habit `ffmpeg -i file` teaches) silently returns zero spans here.
const r = spawnSync(FF, ["-hide_banner", "-i", inFile, "-af",
  `silencedetect=noise=${noise}:d=${minSil}`, "-f", "null", "-"], { encoding: "utf8" });
const err = (r.stderr || "") + (r.stdout || "");

const d = /Duration: (\d+):(\d+):([\d.]+)/.exec(err);
const dur = d ? (+d[1]) * 3600 + (+d[2]) * 60 + (+d[3]) : 0;

const marks = [...err.matchAll(/silence_(start|end): (-?[\d.]+)/g)]
  .map((m) => [m[1], Math.max(0, parseFloat(m[2]))]);

// Speech is whatever sits between the silences.
const spans = [];
let cursor = 0;
for (const [kind, at] of marks) {
  if (kind === "start") { if (at - cursor > 0.08) spans.push([cursor, at]); }
  else cursor = at;
}
if (dur - cursor > 0.08) spans.push([cursor, dur]);

console.log(`\n  ${inFile} — ${dur.toFixed(3)}s, ${spans.length} spans`);
console.log(`  gaps between them: ${marks.length ? "measured" : "none found — loosen noise_db"}\n`);
for (const [s, e] of spans) {
  console.log(`  [${s.toFixed(4).padStart(7)},${e.toFixed(4).padStart(7)}, 0.20, "id",       "words"],`);
}
console.log(`\n  Paste the first two columns into LINES in tools/cut-vo.mjs and check`);
console.log(`  the count matches the script. The ids, words and gaps are editorial.\n`);
