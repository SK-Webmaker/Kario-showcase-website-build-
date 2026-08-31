/**
 * REEL 1 — "Everything a salon does in a day."
 *
 * The feature showcase the operator asked for: desktop and phone, one beat per
 * capability, every frame a real product screenshot cropped and magnified.
 *
 * Motion is a pure function of t (seconds) via window.setFrame, so the render
 * is deterministic and identical every time. Nothing here is a CSS animation
 * on a wall clock — a slow render must not drop a frame.
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { CSS, fontFace, markSvg } from "../../../tools/render-cards.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const cache = new Map();
const shot = (f) => {
  if (!cache.has(f)) cache.set(f, `data:image/jpeg;base64,${readFileSync(resolve(ROOT, "public/screenshots", f)).toString("base64")}`);
  return cache.get(f);
};
const crop = (file, { w, h, x, y, cw, ch }) =>
  `<div class="crop" style="--w:${w};--h:${h};--x:${x};--y:${y};--cw:${cw};--ch:${ch}"><img src="${shot(file)}" alt=""></div>`;

const SW = { w: 1240, h: 775 };
const BOOK = { w: 1240, h: 1126 };

const win = (inner, url) => `<div class="win"><div class="win-bar">
  <span class="win-dot"></span><span class="win-dot"></span><span class="win-dot"></span>
  <span class="win-url">${url}</span></div>${inner}</div>`;

export const id = "reel-features";
export const fps = 30;
export const duration = 25.6;

const BEATS = [
  { t0: 2.6, t1: 4.9, n: "01", rail: "The morning",
    head: "The day, already<br>answered.",
    vis: win(crop("01-dashboard.jpg", { ...SW, x: 232, y: 118, cw: 958, ch: 152 }), "luxehairstudio.kairo.app"),
    body: "Twelve booked, four done, two hours still free." },
  { t0: 4.9, t1: 7.2, n: "02", rail: "The diary",
    head: "It cannot be<br>double-booked.",
    vis: win(crop("04-calendar-day.jpg", { ...SW, x: 232, y: 152, cw: 640, ch: 452 }), "&hellip;/calendar"),
    body: "A column per person. Drag it to move it." },
  { t0: 7.2, t1: 10.2, n: "03", rail: "When plans change",
    head: "It asks who<br>to tell.",
    vis: `<div class="win">${crop("07-notify-prompt.jpg", { ...SW, x: 404, y: 200, cw: 432, ch: 372 })}</div>`,
    body: "Email, text, both, or nothing &mdash; then fifteen seconds to undo it." },
  { t0: 10.2, t1: 12.5, n: "04", rail: "The client book",
    head: "Every visit<br>she&rsquo;s had.",
    vis: `<div class="win">${crop("09-client-profile.jpg", { ...SW, x: 330, y: 218, cw: 580, ch: 258 })}</div>`,
    body: "And the note you typed in June, back in front of you." },
  { t0: 12.5, t1: 14.8, n: "05", rail: "Getting paid",
    head: "Chair to bank,<br>no second app.",
    vis: win(crop("11-pos.jpg", { ...SW, x: 490, y: 55, cw: 448, ch: 168 }), "&hellip;/pos"),
    body: "Card, cash, transfer, or a pay-link she opens herself." },
  { t0: 14.8, t1: 17.1, n: "06", rail: "The messages",
    head: "Reminders that<br>send themselves.",
    vis: `<div class="win">${crop("14-messages.jpg", { ...SW, x: 232, y: 182, cw: 468, ch: 300 })}</div>`,
    body: "Confirmations, reminders, receipts, review requests. All logged." },
  { t0: 17.1, t1: 19.4, n: "07", rail: "The shopfront",
    head: "Your own<br>booking page.",
    vis: win(crop("19-booking-services.jpg", { ...BOOK, x: 300, y: 14, cw: 660, ch: 282 }), "luxehairstudio.com/book"),
    body: "Your name at the top. Only real openings ever offered." },
  { t0: 19.4, t1: 22.0, n: "08", rail: "In your pocket",
    head: "The same thing,<br>on your phone.",
    vis: `<div class="phone" style="width:470px;margin:0 auto">${crop("23-phone-dashboard.jpg", { w: 460, h: 995, x: 0, y: 0, cw: 460, ch: 812 })}</div>`,
    body: "Installs from the browser. No app store, no download." },
];

const scene = (key, inner, extra = "") =>
  `<section class="scene" data-k="${key}" ${extra}>${inner}</section>`;

const beatMarkup = BEATS.map((b) => scene(b.n, `
  <div class="rail"><span class="chrome-b">[${b.n}]</span><span class="chrome">${b.rail}</span></div>
  <h2 class="display rhead">${b.head}</h2>
  <div class="vis">${b.vis}</div>
  <p class="body bline">${b.body}</p>`)).join("");

export const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFace()}
${CSS}
html,body{width:1080px;height:1920px}
#stage{position:relative;width:1080px;height:1920px;overflow:hidden;background:var(--ground)}
#stage .grid-bg{background-size:120px 120px}
#glow{position:absolute;top:-420px;left:-260px;width:1300px;height:1300px;border-radius:50%;
  background:radial-gradient(circle,rgba(59,130,246,.20),transparent 62%);filter:blur(12px)}
header{position:absolute;top:64px;left:64px;right:64px;display:flex;align-items:center;
  justify-content:space-between;z-index:5}
.mark .wm{font-size:34px}
.mark svg{width:42px;height:42px}
#bar{position:absolute;top:150px;left:64px;right:64px;height:3px;background:rgb(var(--ink)/.16);z-index:5}
#barfill{height:100%;background:var(--brand);width:0}
.scene{position:absolute;inset:0;padding:230px 64px 170px;display:flex;flex-direction:column;
  justify-content:center;opacity:0;will-change:transform,opacity}
.rail{display:flex;align-items:center;gap:20px;border-bottom:1px solid rgb(var(--ink)/.14);
  padding-bottom:18px;margin-bottom:34px}
.chrome,.chrome-b{font-size:24px}
.rhead{font-size:82px;margin-bottom:40px}
.vis{will-change:transform}
.bline{font-size:32px;margin-top:38px;max-width:30ch}
.crop{background:transparent}
.hook-l{display:block;font-size:126px}
.endl{font-size:104px}
.cta{border:2px solid var(--brand);background:rgba(59,130,246,.10);padding:38px 42px;margin-top:56px}
</style></head><body>
<div id="stage">
  <div class="grid-bg"></div>
  <div id="glow"></div>
  <header>
    <div class="mark">${markSvg(42)}<span class="wm">Kairo</span></div>
    <span class="chrome" style="font-size:22px">Melbourne</span>
  </header>
  <div id="bar"><div id="barfill"></div></div>

  ${scene("hook", `
    <h1 class="display">
      <span class="hook-l">Everything</span>
      <span class="hook-l">a salon does</span>
      <span class="hook-l">in a day.</span>
    </h1>
    <p class="lede" style="font-size:38px;margin-top:46px;max-width:22ch">One login. Here&rsquo;s
      what it actually looks like.</p>`)}

  ${beatMarkup}

  ${scene("end", `
    <h2 class="display endl">$400 once.<br><span class="ink3">Then nothing,<br>every month.</span></h2>
    <p class="lede" style="font-size:34px;margin-top:40px;max-width:26ch">No subscription, no
      per-booking fee, no commission.</p>
    <div class="cta">
      <span class="chrome-b" style="font-size:22px">The next step</span>
      <p class="display" style="font-size:58px;margin-top:18px">DM me the<br>word <span class="brand">Diary</span></p>
    </div>`)}
</div>
<script>
const D = ${duration};
const SC = [
  { k: "hook", t0: 0, t1: 2.6 },
  ${BEATS.map((b) => `{ k: "${b.n}", t0: ${b.t0}, t1: ${b.t1} }`).join(",\n  ")},
  { k: "end", t0: 22.0, t1: ${duration} }
];
const els = {};
document.querySelectorAll(".scene").forEach(s => els[s.dataset.k] = s);
const cl = (v) => v < 0 ? 0 : v > 1 ? 1 : v;
// Quartic ease-out: reaches most of the way fast, then settles. The same
// feel as the site's cubic-bezier(.66,0,.01,1) without importing the curve.
const ease = (p) => 1 - Math.pow(1 - cl(p), 4);

window.setFrame = (t) => {
  document.getElementById("barfill").style.width = (cl(t / D) * 100) + "%";
  for (const s of SC) {
    const el = els[s.k];
    if (!el) continue;
    const IN = 0.34, OUT = 0.26;
    if (t < s.t0 - 0.05 || t >= s.t1) { el.style.opacity = 0; continue; }
    const inP  = ease((t - s.t0) / IN);
    const outP = cl((t - (s.t1 - OUT)) / OUT);
    el.style.opacity = (inP * (1 - outP)).toFixed(4);
    const y = (1 - inP) * 46 - outP * 30;
    el.style.transform = "translateY(" + y.toFixed(2) + "px)";
    // A slow push-in on the product frame so a still screenshot still moves.
    const vis = el.querySelector(".vis");
    if (vis) {
      const life = cl((t - s.t0) / (s.t1 - s.t0));
      vis.style.transform = "scale(" + (1.035 - 0.035 * inP + life * 0.018).toFixed(4) + ")";
    }
  }
};
window.setFrame(0);
</script></body></html>`;
