#!/usr/bin/env node
/**
 * Screenshot a reel spec at named times, without rendering the whole thing.
 *
 *   node tools/probe-reel.mjs <spec.mjs> <out-dir> <t> [t ...]
 *
 * A full 36s render is ~1080 frames and several minutes. Almost every framing
 * mistake is visible in one frame, so look before you commit to the render.
 */
import { mkdirSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const globalRoot = execSync("npm root -g").toString().trim();
const { chromium } = createRequire(join(globalRoot, "x.js"))("playwright");

const [, , specPath, outDir, ...times] = process.argv;
if (!specPath || !outDir || !times.length) {
  console.error("usage: node tools/probe-reel.mjs <spec.mjs> <out-dir> <t> [t ...]");
  process.exit(2);
}
const spec = await import(pathToFileURL(resolve(specPath)).href);
mkdirSync(resolve(outDir), { recursive: true });

const browser = await chromium.launch({ args: ["--font-render-hinting=none"] });
const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
const pg = await ctx.newPage();
await pg.setContent(spec.html, { waitUntil: "load" });
await pg.evaluate(() => document.fonts.ready);
await pg.waitForTimeout(250);

pg.on("pageerror", (e) => console.error("  page error:", e.message));

for (const t of times) {
  await pg.evaluate((v) => window.setFrame(v), parseFloat(t));
  const p = join(resolve(outDir), `t${String(t).replace(".", "-")}.png`);
  await pg.locator("#stage").screenshot({ path: p });
  console.log("  " + p);
}
await browser.close();
