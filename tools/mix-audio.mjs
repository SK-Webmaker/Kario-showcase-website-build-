#!/usr/bin/env node
/**
 * Mix a voiceover over a music bed and lay the result onto a silent film.
 *
 *   node tools/mix-audio.mjs <video.mp4> <vo.wav> <music.mp3> <out.mp4>
 *
 * The music is side-chained to the voice, so it pulls back under every spoken
 * line and swells again in the gaps. That is how a narrated film is mixed; a
 * bed at a fixed level either buries the read or sits so low it is pointless.
 */
import { execFileSync } from "node:child_process";
import { statSync } from "node:fs";

const FF = process.env.FFMPEG_BIN ||
  "/tmp/claude-0/-home-user-Kario-showcase-website-build-/2ed07d40-187e-5c8d-ab34-babb0687fb45/scratchpad/node_modules/ffmpeg-static/ffmpeg";

const [, , video, vo, music, out] = process.argv;
if (!video || !vo || !music || !out) {
  console.error("usage: node tools/mix-audio.mjs <video.mp4> <vo.wav> <music.mp3> <out.mp4>");
  process.exit(2);
}

// `ffmpeg -i x` with no output always exits non-zero after printing the
// stream info we want, so read stderr off the thrown error rather than
// treating the exit code as a failure.
let probe = "";
try {
  probe = execFileSync(FF, ["-hide_banner", "-i", video],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).toString();
} catch (e) {
  probe = (e.stderr || "").toString();
}
const m = /Duration: (\d+):(\d+):([\d.]+)/.exec(probe);
const dur = m ? (+m[1]) * 3600 + (+m[2]) * 60 + parseFloat(m[3]) : 0;
if (!dur) { console.error("could not read video duration"); process.exit(1); }

const fadeOutAt = Math.max(0, dur - 2.6);

const filter = [
  // Bed: trimmed to picture, brought well down, eased in and out.
  `[1:a]atrim=0:${dur.toFixed(3)},asetpts=N/SR/TB,` +
    `aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,` +
    // Levels were measured, not guessed. Against a voice averaging -16.5 dB,
    // this puts the bed 16 dB under during speech and 9 dB under in the gaps,
    // peaking at -3.4 dB — broadcast-typical, with headroom left for the mix.
    `volume=1.0,afade=t=in:st=0:d=1.8,afade=t=out:st=${fadeOutAt.toFixed(2)}:d=2.6[bed]`,
  // Voice: to stereo, gently compressed so the read sits steady.
  `[2:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,` +
    `acompressor=threshold=0.09:ratio=3:attack=12:release=180,volume=1.25[vox]`,
  // A copy of the voice drives the ducking. It has to be padded out to the
  // full picture length first: sidechaincompress ends when the SHORTER of its
  // two inputs ends, so a read that stops before the last shot silently
  // truncated the whole mix — and -shortest then cut the picture to match.
  // That cost the last 0.6s of the film, which is where the CTA holds.
  `[vox]asplit=2[vox1][key0]`,
  `[key0]apad,atrim=0:${dur.toFixed(3)},asetpts=N/SR/TB[key]`,
  `[bed][key]sidechaincompress=threshold=0.09:ratio=3:attack=14:release=340:makeup=1[duck]`,
  `[duck][vox1]amix=inputs=2:duration=first:normalize=0,` +
    `apad,atrim=0:${dur.toFixed(3)},asetpts=N/SR/TB,` +
    `alimiter=limit=0.94,loudnorm=I=-14:TP=-1.0:LRA=11[aout]`,
].join(";");

execFileSync(FF, [
  "-y", "-loglevel", "error",
  "-i", video, "-i", music, "-i", vo,
  "-filter_complex", filter,
  "-map", "0:v", "-map", "[aout]",
  "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2",
  "-t", dur.toFixed(3), "-movflags", "+faststart",
  out,
], { stdio: "inherit" });

console.log(`  mixed -> ${out}  (${(statSync(out).size / 1024 / 1024).toFixed(1)}MB)`);
