#!/usr/bin/env node
/**
 * Tile every rendered slide into one sheet, so a whole week can be checked
 * for broken layout in a single look instead of nineteen.
 *
 *   node tools/contact-sheet.mjs content/packs/<date>/images
 */
import { readdirSync, readFileSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const dir = resolve(process.argv[2]);
const cols = Number(process.argv[3] ?? 5);
const { chromium } = createRequire(join(execSync("npm root -g").toString().trim(), "x.js"))("playwright");

const files = readdirSync(dir).filter((f) => f.endsWith(".png") && f !== "_contact-sheet.png").sort();
const cells = files.map((f) => {
  const b64 = readFileSync(join(dir, f)).toString("base64");
  return `<figure><img src="data:image/png;base64,${b64}"><figcaption>${f.replace(".png", "")}</figcaption></figure>`;
}).join("");

const W = cols * 300 + (cols + 1) * 16;
const html = `<!doctype html><meta charset="utf-8"><style>
  body{margin:0;background:#20242c;padding:16px;font:11px ui-monospace,monospace;color:#cfd6e2}
  .g{display:grid;grid-template-columns:repeat(${cols},300px);gap:16px}
  figure{margin:0}
  img{width:300px;height:375px;display:block;border:1px solid #3a4150}
  figcaption{padding:5px 2px 0;color:#8b93a3}
</style><div class="g">${cells}</div>`;

const browser = await chromium.launch();
const pg = await browser.newPage({ viewport: { width: W, height: 800 }, deviceScaleFactor: 2 });
await pg.setContent(html, { waitUntil: "load" });
const out = join(dir, "_contact-sheet.png");
await pg.locator(".g").screenshot({ path: out });
await browser.close();
console.log(`  ${files.length} slides -> ${out}`);
