#!/usr/bin/env node
/**
 * Render carousel slides to PNG.
 *
 *   node tools/render-cards.mjs content/packs/<date>/slides.mjs
 *
 * Slides are authored as HTML because the brand is a CSS design system that
 * already exists — src/index.css and tailwind.config.js — and re-deriving it
 * in a drawing API would guarantee drift between the cards and the software.
 * The tokens below are copied from those two files; if the product's blue
 * moves, it moves here too.
 *
 * Output is 1080x1350 (Instagram's 4:5, the tallest the feed allows and so
 * the most real estate a post can occupy) at deviceScaleFactor 2.
 *
 * Playwright lives in the global node prefix here, not in the project's
 * dependencies — the showcase site ships with three runtime deps and this
 * tool is not a reason to add a fourth.
 */

import { readFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const globalRoot = execSync("npm root -g").toString().trim();
const { chromium } = createRequire(join(globalRoot, "x.js"))("playwright");

export const W = 1080;
export const H = 1350;

// --- fonts, embedded so a render never depends on the network -------------
export function fontFace() {
  const faces = [
    { file: "intertight-latin.woff2", family: "Inter Tight", weight: "400 900" },
    { file: "jetbrains-latin.woff2", family: "JetBrains Mono", weight: "400 700" },
  ];
  return faces
    .map((f) => {
      const b64 = readFileSync(resolve(ROOT, "scripts", f.file)).toString("base64");
      return `@font-face{font-family:'${f.family}';font-style:normal;font-weight:${f.weight};` +
             `font-display:block;src:url(data:font/woff2;base64,${b64}) format('woff2');}`;
    })
    .join("");
}

// --- the design system, lifted from src/index.css + tailwind.config.js ----
export const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --ground:#0A0E17; --raised:#0E1420; --sunk:#070A11;
  --ink:233 237 244;
  --brand:#3b82f6; --lift:#5ea3f0; --deep:#2f6fd8;
  --money:#0f9d63; --alert:#b9760d;
}
html,body{width:${W}px;height:${H}px}
body{
  background:var(--ground); color:rgb(var(--ink));
  font-family:'Inter Tight',system-ui,sans-serif;
  -webkit-font-smoothing:antialiased; overflow:hidden;
}
.ink2{color:rgb(var(--ink)/.62)} .ink3{color:rgb(var(--ink)/.34)} .ink4{color:rgb(var(--ink)/.16)}
.brand{color:var(--brand)} .lift{color:var(--lift)}

/* The blueprint ground: a faint grid with crosshairs at the intersections.
   Same vocabulary as the site's fixed background layer. */
.slide{
  position:relative; width:${W}px; height:${H}px; overflow:hidden;
  display:flex; flex-direction:column; padding:74px 72px 66px;
}
.grid-bg{
  position:absolute; inset:0; pointer-events:none;
  background-image:
    linear-gradient(rgb(var(--ink)/.055) 1px,transparent 1px),
    linear-gradient(90deg,rgb(var(--ink)/.055) 1px,transparent 1px);
  background-size:90px 90px; background-position:-1px -1px;
}
.glow{
  position:absolute; width:900px; height:900px; border-radius:50%;
  background:radial-gradient(circle,rgba(59,130,246,.16),transparent 62%);
  filter:blur(10px); pointer-events:none;
}

/* Type. Display is Inter Tight, extrabold, uppercase, tight — the site's. */
.display{font-weight:800;text-transform:uppercase;line-height:.88;letter-spacing:-.03em;text-wrap:balance}
.d-xl{font-size:112px} .d-lg{font-size:92px} .d-md{font-size:74px} .d-sm{font-size:57px}
.chrome{font-family:'JetBrains Mono',monospace;font-size:17px;text-transform:uppercase;
  letter-spacing:.14em;color:rgb(var(--ink)/.34)}
.chrome-b{font-family:'JetBrains Mono',monospace;font-size:17px;text-transform:uppercase;
  letter-spacing:.14em;color:var(--brand)}
.lede{font-size:32px;line-height:1.42;color:rgb(var(--ink)/.62);max-width:24ch}
.body{font-size:27px;line-height:1.48;color:rgb(var(--ink)/.62)}
.tabular{font-variant-numeric:tabular-nums}

/* Furniture */
.head{display:flex;align-items:center;justify-content:space-between;position:relative;z-index:2}
.mark{display:flex;align-items:center;gap:13px}
.mark svg{width:34px;height:34px}
.mark .wm{font-weight:800;font-size:27px;letter-spacing:-.02em}
.foot{margin-top:auto;padding-top:40px;position:relative;z-index:2;display:flex;
  align-items:flex-end;justify-content:space-between;gap:24px}
.rule{height:1px;background:rgb(var(--ink)/.14);width:100%}
.rule-b{height:3px;background:var(--brand);width:104px}
.content{position:relative;z-index:2;display:flex;flex-direction:column;flex:1;min-height:0;
  padding-top:62px;justify-content:center}

.panel{border:1px solid rgb(var(--ink)/.14);background:var(--raised)}
.chip{font-family:'JetBrains Mono',monospace;font-size:17px;text-transform:uppercase;
  letter-spacing:.1em;border:1px solid rgb(var(--ink)/.26);padding:12px 17px;
  color:rgb(var(--ink)/.62);white-space:nowrap}
.dot{width:7px;height:7px;background:var(--brand);flex:none;margin-top:14px}

/* Cropped product screenshots. Percentages on translate resolve against the
   element's own box, which is the only way to pan a scaled image without
   knowing the container's pixel height up front. */
.crop{position:relative;overflow:hidden;width:100%;
  aspect-ratio:var(--cw)/var(--ch);background:var(--sunk)}
.crop img{position:absolute;top:0;left:0;width:calc(var(--w)/var(--cw)*100%);
  transform:translate(calc(var(--x)/var(--w)*-100%),calc(var(--y)/var(--h)*-100%));
  image-rendering:-webkit-optimize-contrast}

/* Browser and handset chrome, so a screenshot reads as software. */
.win{border:1px solid rgb(var(--ink)/.16);background:var(--sunk);overflow:hidden;
  box-shadow:0 40px 90px -30px rgba(0,0,0,.85)}
.win-bar{display:flex;align-items:center;gap:11px;padding:13px 16px;
  border-bottom:1px solid rgb(var(--ink)/.12);background:#0b1018}
.win-dot{width:9px;height:9px;border-radius:50%;background:rgb(var(--ink)/.2)}
.win-url{font-family:'JetBrains Mono',monospace;font-size:14px;color:rgb(var(--ink)/.34);
  margin-left:8px;letter-spacing:.02em}
.phone{border:9px solid #1b2231;border-radius:38px;overflow:hidden;background:#000;
  box-shadow:0 40px 80px -28px rgba(0,0,0,.9)}
.phone img{display:block;width:100%}

.callout{position:absolute;font-family:'JetBrains Mono',monospace;font-size:15px;
  text-transform:uppercase;letter-spacing:.1em;color:var(--lift);
  background:rgba(10,14,23,.9);border:1px solid rgba(94,163,240,.45);padding:8px 12px}
`;

export function markSvg(size = 34) {
  return `<svg viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true">
    <path d="M20 14v36" stroke="#5ea3f0" stroke-width="8" stroke-linecap="round"/>
    <path d="M44 14 24 32l20 18" stroke="#3b82f6" stroke-width="8" stroke-linecap="round"
      stroke-linejoin="round" fill="none"/></svg>`;
}

/** Wrap a slide's body in the shared shell. */
function page(slide, fonts) {
  const counter = slide.counter ?? "";
  const foot = slide.foot ?? "";
  const header = slide.bare
    ? ""
    : `<div class="head">
         <div class="mark">${markSvg()}<span class="wm">Kairo</span></div>
         <span class="chrome">${counter}</span>
       </div>`;
  return `<!doctype html><html><head><meta charset="utf-8">
    <style>${fonts}${CSS}${slide.css ?? ""}</style></head>
    <body><div class="slide">
      <div class="grid-bg"></div>
      ${slide.glow ?? ""}
      ${header}
      <div class="content">${slide.body}</div>
      ${foot ? `<div class="foot">${foot}</div>` : ""}
    </div></body></html>`;
}

async function main() {
  const specPath = process.argv[2];
  if (!specPath) {
    console.error("usage: node tools/render-cards.mjs <slides.mjs> [--only id]");
    process.exit(2);
  }
  const onlyIdx = process.argv.indexOf("--only");
  const only = onlyIdx > -1 ? process.argv[onlyIdx + 1] : null;

  const spec = await import(pathToFileURL(resolve(specPath)).href);
  const slides = spec.SLIDES;
  const outDir = resolve(dirname(resolve(specPath)), "images");
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  const fonts = fontFace();
  const browser = await chromium.launch({ args: ["--font-render-hinting=none"] });
  const ctx = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: 2,
  });
  const pg = await ctx.newPage();

  let n = 0;
  for (const slide of slides) {
    if (only && slide.id !== only) continue;
    await pg.setContent(page(slide, fonts), { waitUntil: "load" });
    await pg.evaluate(() => document.fonts.ready);
    await pg.waitForTimeout(120);
    const file = join(outDir, `${slide.id}.png`);
    await pg.locator(".slide").screenshot({ path: file });
    console.log(`  ${slide.id}.png`);
    n++;
  }

  await browser.close();
  console.log(`\n  ${n} slide(s) → ${outDir}\n`);
}

// Only run when invoked directly. Without this guard, importing this module
// for its CSS and helpers — which the reel specs do — silently runs the slide
// renderer with no slides and fails somewhere confusing.
const invokedDirectly =
  process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (invokedDirectly) main().catch((e) => { console.error(e); process.exit(1); });
