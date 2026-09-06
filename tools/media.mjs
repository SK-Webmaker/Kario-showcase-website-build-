#!/usr/bin/env node
/**
 * Shared product-frame helpers, with a magnification auditor.
 *
 * WHY THIS FILE EXISTS. The operator reported on 2026-09-06 that the software
 * screenshots looked low resolution. They were right, and it was measurable:
 * every product frame shipped between 1.5x and 2.7x upsampled.
 *
 * The source frames in public/screenshots/ are 1240x775 JPEGs. That is the
 * ceiling. Two things were spending it:
 *
 *   1. Cards rendered at deviceScaleFactor 2, exporting a 1080 CSS canvas at
 *      2160px. Instagram serves at 1080, so the extra pixels bought nothing and
 *      doubled the upsample. Everything now renders at native delivery size.
 *   2. Crops were cut tight and then displayed wide. A 432px-wide modal shown
 *      across 952px is a 2.2x blow-up no encoder can rescue.
 *
 * So every crop now declares the width it will be displayed at, and audit()
 * prints the magnification and refuses to stay quiet about anything over 1.35x.
 * Design around the number rather than discovering it in the feed.
 *
 * The real ceiling lift is re-exporting the screenshots at 2x device pixel
 * ratio. That is an operator task and it is in the handover.
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Native size of every desktop frame, and of the taller booking page. */
export const SW = { w: 1240, h: 775 };
export const BOOK = { w: 1240, h: 1126 };
export const PHONE = { w: 460, h: 995 };

/** Anything above this is visibly soft on a phone. */
const SOFT_AT = 1.35;

const cache = new Map();
const ledger = [];

export function shot(file) {
  if (!cache.has(file)) {
    const b64 = readFileSync(resolve(ROOT, "public/screenshots", file)).toString("base64");
    cache.set(file, `data:image/jpeg;base64,${b64}`);
  }
  return cache.get(file);
}

/**
 * A cropped product frame.
 *
 * `box` is {w,h,x,y,cw,ch} in the source image's own pixels. `displayW` is the
 * width in CSS px it will occupy — and since everything now renders at
 * deviceScaleFactor 1 at native delivery size, CSS px are device px, so
 * magnification is simply displayW / cw.
 */
export function crop(file, box, { displayW, label = "" } = {}) {
  const { w, h, x, y, cw, ch } = box;
  if (displayW) {
    ledger.push({ file, label, cw, displayW, mag: displayW / cw });
  }
  return `<div class="crop" style="--w:${w};--h:${h};--x:${x};--y:${y};--cw:${cw};--ch:${ch}${
    displayW ? `;width:${displayW}px` : ""
  }"><img src="${shot(file)}" alt=""></div>`;
}

export const win = (inner, url) =>
  `<div class="win"><div class="win-bar">
     <span class="win-dot"></span><span class="win-dot"></span><span class="win-dot"></span>
     <span class="win-url">${url}</span></div>${inner}</div>`;

export const phone = (inner, width = 470) =>
  `<div class="phone" style="width:${width}px">${inner}</div>`;

/** Print the magnification of every declared crop. Call at the end of a spec. */
export function audit(name = "") {
  if (!ledger.length) return;
  const soft = ledger.filter((r) => r.mag > SOFT_AT);
  console.log(`\n  crop magnification${name ? ` — ${name}` : ""}`);
  for (const r of ledger.sort((a, b) => b.mag - a.mag)) {
    const flag = r.mag > SOFT_AT ? "SOFT" : r.mag > 1.0 ? "warn" : "ok  ";
    console.log(`    [${flag}] ${r.mag.toFixed(2)}x  ${String(r.cw).padStart(4)}px -> ${String(r.displayW).padStart(4)}px  ${r.label || r.file}`);
  }
  console.log(soft.length
    ? `    ${soft.length} frame(s) over ${SOFT_AT}x — widen the crop or shrink the box.\n`
    : `    all ${ledger.length} frames at or near native resolution.\n`);
}

export function resetAudit() { ledger.length = 0; }
