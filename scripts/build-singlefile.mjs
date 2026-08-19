/**
 * Packages the built site into ONE self-contained HTML file.
 *
 * Everything is inlined — the CSS, the JavaScript, all 25 screenshots as
 * data URIs, and the Inter webfont — so the page makes zero network
 * requests and can be opened straight from disk or hosted anywhere that
 * blocks external assets.
 *
 * This is a preview artefact only. It has no effect on the normal
 * `npm run build` output that Lovable and any real host use.
 *
 *   node scripts/build-singlefile.mjs        (run after `npm run build`)
 *
 * Output: dist-singlefile/kairo-showcase.html
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const out = join(root, "dist-singlefile");

if (!existsSync(dist)) {
  console.error("dist/ not found — run `npm run build` first.");
  process.exit(1);
}

// --- the built CSS and JS -------------------------------------------------
const assets = readdirSync(join(dist, "assets"));
const cssFile = assets.find((f) => f.endsWith(".css"));
const jsFile = assets.find((f) => f.endsWith(".js"));
if (!cssFile || !jsFile) {
  console.error("Could not find built CSS/JS in dist/assets.");
  process.exit(1);
}

const css = readFileSync(join(dist, "assets", cssFile), "utf8");
const js = readFileSync(join(dist, "assets", jsFile), "utf8");

// --- the screenshots, as data URIs ---------------------------------------
const shotsDir = join(root, "public", "screenshots");
const MIME = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png" };

const shots = {};
let shotBytes = 0;
for (const file of readdirSync(shotsDir).sort()) {
  const mime = MIME[extname(file).toLowerCase()];
  if (!mime) continue;
  const buf = readFileSync(join(shotsDir, file));
  shotBytes += buf.length;
  shots[file] = `data:${mime};base64,${buf.toString("base64")}`;
}

// --- the fonts -----------------------------------------------------
// Inter Tight for display, JetBrains Mono for the instrument chrome.
// Both are dropped next to this script as latin-subset woff2 files.
const FONTS = [
  { file: "intertight-latin.woff2", family: "Inter Tight", weight: "400 900" },
  { file: "jetbrains-latin.woff2", family: "JetBrains Mono", weight: "400 700" },
];

let fontFace = "";
let fontsEmbedded = 0;
for (const f of FONTS) {
  const path = join(root, "scripts", f.file);
  if (!existsSync(path)) continue;
  const b64 = readFileSync(path).toString("base64");
  fontFace +=
    `@font-face{font-family:'${f.family}';font-style:normal;` +
    `font-weight:${f.weight};font-display:swap;` +
    `src:url(data:font/woff2;base64,${b64}) format('woff2');}`;
  fontsEmbedded += 1;
}

// Guard against a literal </script> inside the bundle closing our tag early.
const safe = (s) => s.replace(/<\/script>/gi, "<\\/script>");

const html = `<title>Kairo Showcase</title>
<style>${fontFace}${css}</style>
<div id="root"></div>
<script>window.__SHOTS=${safe(JSON.stringify(shots))};</script>
<script type="module">${safe(js)}</script>
`;

mkdirSync(out, { recursive: true });
const target = join(out, "kairo-showcase.html");
writeFileSync(target, html, "utf8");

const mb = (n) => (n / 1024 / 1024).toFixed(2) + " MB";
console.log(`css        ${css.length.toLocaleString()} bytes`);
console.log(`js         ${js.length.toLocaleString()} bytes`);
console.log(`fonts      ${fontsEmbedded} of ${FONTS.length} embedded`);
console.log(`shots      ${Object.keys(shots).length} files, ${mb(shotBytes)} raw`);
console.log(`\n→ ${target}  (${mb(html.length)})`);
