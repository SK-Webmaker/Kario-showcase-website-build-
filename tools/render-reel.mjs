#!/usr/bin/env node
/**
 * Render a vertical Reel to an Instagram-ready MP4.
 *
 *   node tools/render-reel.mjs content/packs/<date>/reel-<name>.mjs
 *
 * The spec exports { id, fps, duration, html }. `html` is a complete document
 * that defines window.setFrame(t) — t in seconds. The renderer steps that
 * function frame by frame and screenshots each one, so the animation is a pure
 * function of time rather than a wall-clock race: the same spec renders the
 * same video every time, and a slow machine produces no dropped frames.
 *
 * Output is 1080x1920 h264 / yuv420p, which is what Instagram wants for a
 * Reel. ffmpeg comes from ffmpeg-static in the scratchpad — deliberately not a
 * dependency of the showcase site, which ships with three.
 */

import { mkdirSync, existsSync, rmSync, readdirSync, statSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { execSync, execFileSync } from "node:child_process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const globalRoot = execSync("npm root -g").toString().trim();
const { chromium } = createRequire(join(globalRoot, "x.js"))("playwright");

export const RW = 1080;
export const RH = 1920;

const FF = process.env.FFMPEG_BIN ||
  "/tmp/claude-0/-home-user-Kario-showcase-website-build-/2ed07d40-187e-5c8d-ab34-babb0687fb45/scratchpad/node_modules/ffmpeg-static/ffmpeg";

async function main() {
  const specPath = process.argv[2];
  if (!specPath) {
    console.error("usage: node tools/render-reel.mjs <reel-spec.mjs>");
    process.exit(2);
  }
  const spec = await import(pathToFileURL(resolve(specPath)).href);
  const { id, fps = 30, duration, html } = spec;

  const packDir = dirname(resolve(specPath));
  const outDir = join(packDir, "video");
  const frameDir = join(outDir, `.frames-${id}`);
  if (existsSync(frameDir)) rmSync(frameDir, { recursive: true });
  mkdirSync(frameDir, { recursive: true });

  const total = Math.round(duration * fps);
  console.log(`  ${id}: ${duration}s @ ${fps}fps = ${total} frames`);

  const browser = await chromium.launch({ args: ["--font-render-hinting=none"] });
  const ctx = await browser.newContext({ viewport: { width: RW, height: RH }, deviceScaleFactor: 1 });
  const pg = await ctx.newPage();
  await pg.setContent(html, { waitUntil: "load" });
  await pg.evaluate(() => document.fonts.ready);
  await pg.waitForTimeout(200);

  const stage = pg.locator("#stage");
  const t0 = Date.now();
  for (let i = 0; i < total; i++) {
    await pg.evaluate((t) => window.setFrame(t), i / fps);
    await stage.screenshot({
      path: join(frameDir, `f${String(i).padStart(5, "0")}.jpg`),
      type: "jpeg", quality: 90,
    });
    if (i % 90 === 0) process.stdout.write(`\r    frame ${i}/${total}`);
  }
  process.stdout.write(`\r    frame ${total}/${total}  (${((Date.now() - t0) / 1000).toFixed(0)}s)\n`);
  await browser.close();

  const mp4 = join(outDir, `${id}.mp4`);
  execFileSync(FF, [
    "-y", "-loglevel", "error",
    "-framerate", String(fps),
    "-i", join(frameDir, "f%05d.jpg"),
    "-c:v", "libx264", "-preset", "slow", "-crf", "19",
    "-pix_fmt", "yuv420p",
    // Instagram re-encodes; an even-dimension, faststart file survives it best.
    "-movflags", "+faststart",
    "-r", String(fps),
    mp4,
  ], { stdio: "inherit" });

  rmSync(frameDir, { recursive: true });
  const kb = (statSync(mp4).size / 1024).toFixed(0);
  console.log(`  -> ${mp4}  (${kb}KB)\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
