/**
 * REEL — "Six jobs." A narrated product film.
 *
 * Not a slideshow. There is one 3D space and one camera that never stops
 * moving through it: it drifts in on the title, flies past six cards as the
 * voice names them, pulls back to find them in a mess, pushes into the card
 * that replaces them, then settles on the real software and the price.
 *
 * Every cut point comes from audio/timeline.json, which was produced by
 * running silencedetect over the voiceover and re-cutting its gaps. The
 * picture is cut to the voice, not to a guess — that is the difference
 * between a film and a deck.
 *
 * Depth is real CSS 3D with perspective, so parallax and scale come out of the
 * geometry rather than being faked per element, and depth of field is computed
 * from each element's actual distance to the camera.
 *
 * REVISION 2026-09-16, on operator feedback: "fill up the screen" and "take
 * out the bar completion thing at the top".
 *
 *   - The progress bar is gone. Nothing in this film tells the viewer how much
 *     is left; a reel that shows its own remaining length invites the swipe.
 *   - Everything in the world got taller. The cards are 520x560 portraits on a
 *     620px vertical pitch, because a 9:16 frame is 1920px high and the old
 *     landscape grid filled about a third of it. Same for the payoff card and
 *     the price block.
 *   - There are now four always-on layers that had nothing in them before: a
 *     ruled floor and a ghost word deep in z (both parallax), drifting dust,
 *     and screen-space furniture at all four edges. The empty cream is the
 *     reason the frame read half-used.
 *   - Effects are all pure functions of t: card flip-ins with a light sweep,
 *     ticks that draw, word-by-word type, impact shake, speed streaks driven
 *     by the camera's actual z velocity, and a lens split on the reveal.
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { CSS, fontFace, markSvg } from "../../../tools/render-cards.mjs";
import { SW, PHONE, crop, win, phone, audit } from "../../../tools/media.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../../..");
const TL = JSON.parse(readFileSync(resolve(HERE, "audio/timeline.json"), "utf8"));
/** line id -> {start,end} */
const L = Object.fromEntries(TL.lines.map((l) => [l.id, l]));

/* Invariant 5: the price comes from the file, never from memory. */
const BRAND = JSON.parse(readFileSync(resolve(ROOT, "config/brand.json"), "utf8"));
const SETUP = BRAND.prices.find((p) => p.id === "setup");
const PRICE = (SETUP.from ? "from $" : "$") + SETUP.amount;

export const id = "reel-film";
export const fps = 30;
export const crf = 20;
export const duration = +(TL.duration + 0.5).toFixed(2);

/** job, tool, world x, y, z */
const CARDS = [
  ["Take the bookings",  "A paper diary",   -272, -620, -2200],
  ["Remember clients",   "A spreadsheet",    272, -620, -2320],
  ["Take the money",     "A card machine",  -272,    0, -2450],
  ["Send the reminders", "Texting by hand",  272,    0, -2570],
  ["Fill the gaps",      "Hoping",          -272,  620, -2700],
  ["Never double-book",  "Memory",           272,  620, -2820],
];
const JOB_IDS = ["j1", "j2", "j3", "j4", "j5", "j6"];

/* A drawn tick, so the mark arrives rather than appearing. */
const tickSvg = `<svg class="tk" viewBox="0 0 48 48" fill="none"><path d="M9 25l10 10L39 14"
  stroke="currentColor" stroke-width="6" stroke-linecap="square"/></svg>`;

const cardEls = CARDS.map(([job, tool], i) => `
  <div class="obj card" data-i="${i}">
    <div class="ctop"><span class="cnum">0${i + 1}</span>${tickSvg}</div>
    <span class="clab job">${job}</span>
    <div class="skel"><i style="width:86%"></i><i style="width:64%"></i><i style="width:74%"></i></div>
    <span class="clab tool">${tool}</span>
    <div class="sweep"></div>
  </div>`).join("");

/* Dust, seeded so the render is reproducible frame to frame and run to run. */
let seed = 20260921;
const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
const DUST = Array.from({ length: 26 }, () => ({
  x: Math.round((rnd() - 0.5) * 2200),
  y: Math.round((rnd() - 0.5) * 2600),
  z: Math.round(-700 - rnd() * 2400),
  r: 3 + Math.round(rnd() * 7),
  p: +(rnd() * 6.283).toFixed(3),
  s: +(0.18 + rnd() * 0.5).toFixed(3),
}));
const dustEls = DUST.map((d, i) =>
  `<div class="obj dot" data-d="${i}" style="width:${d.r}px;height:${d.r}px"></div>`).join("");

/** Split a line so it can arrive word by word rather than all at once. */
const words = (s) => s.split(" ").map((w, i) =>
  `<i style="--i:${i}">${w}</i>`).join(" ");

/* Camera keyframes.
 *
 * The geometry that matters: with CSS `perspective: P`, an element whose final
 * z is `za` renders at scale P / (P - za). za = 0 is life size; negative is
 * away and smaller; positive is nearer and larger. The world is translated by
 * -cz, so an object at objZ ends at za = objZ - cz.
 *
 * So to frame something, solve for cz rather than guessing a distance:
 *   cz = objZ - za.
 * Getting this backwards renders everything at roughly half size, which is
 * exactly what the first cut of this film did.
 *
 * CARD_ZA is deliberately large: at +430 a 520x560 card renders 729x785, which
 * is most of a 1080-wide frame. The earlier +120 left it floating in cream. */
const CARD_ZA = 430;
const shot = (c, za = CARD_ZA, bias = 0.9) =>
  ({ cx: CARDS[c][2] * bias, cy: CARDS[c][3] * bias, cz: CARDS[c][4] - za });

const TITLE_Z = -1240, MOST_Z = -1960, ONE_Z = -2500, SHOT_Z = -2060, PRICE_Z = -1460;
/* Wide enough that the whole 1064 x 1800 grid and its scatter fit the frame. */
const WIDE_ZA = -640;
const CARD_MID = -2510;

const KEYS = [
  // Title drifts in from far off and settles just past life size.
  { t: 0.0,                   cx: 0, cy: 0,   cz: TITLE_Z + 760, yaw: 5.5, pitch: -2.4, roll: -0.8 },
  { t: L.six.start + 0.9,     cx: 0, cy: -8,  cz: TITLE_Z - 40,  yaw: 2.0, pitch: -1.0, roll: -0.3 },
  { t: L.everyday.end + 0.25, cx: 0, cy: 6,   cz: TITLE_Z - 150, yaw: -1.5, pitch: 0.6, roll: 0.2 },
  // One card at a time, as the voice names it.
  ...JOB_IDS.map((jid, i) => ({ t: L[jid].start + 0.12, ...shot(i),
      yaw: i % 2 ? -3.4 : 3.4, pitch: i < 2 ? -1.6 : i > 3 ? 1.6 : 0, roll: i % 2 ? 0.5 : -0.5 })),
  // Pull back far enough to hold all six while they fall into a mess.
  { t: L.most.start + 0.35,   cx: 0, cy: -40, cz: CARD_MID - WIDE_ZA,       yaw: -4.5, pitch: 0.8, roll: 0.6 },
  { t: L.t3.end - 0.2,        cx: 0, cy: -52, cz: CARD_MID - WIDE_ZA - 90,  yaw: 4.5,  pitch: -0.6, roll: -0.6 },
  // Push into the card that replaces them.
  { t: L.kairo.start + 0.35,  cx: 0, cy: 6,  cz: ONE_Z - 210,   yaw: 0,    pitch: 0, roll: 0 },
  { t: L.onelogin.end,        cx: 0, cy: 0,  cz: ONE_Z - 270,   yaw: -2.2, pitch: 0.5, roll: 0.3 },
  // Settle on the real software, then the price.
  { t: L.real.start + 0.3,    cx: 0, cy: 30, cz: SHOT_Z - 40,   yaw: 2.6,  pitch: -1.4, roll: -0.4 },
  { t: L.melb.end + 0.1,      cx: 0, cy: 22, cz: SHOT_Z - 100,  yaw: -1.6, pitch: 0.7, roll: 0.3 },
  { t: L.price.start + 0.2,   cx: 0, cy: 0,  cz: PRICE_Z - 100, yaw: 1.2,  pitch: -0.4, roll: -0.2 },
  { t: duration,              cx: 0, cy: -10, cz: PRICE_Z - 160, yaw: -0.8, pitch: 0.3, roll: 0.15 },
];

const TICKER = ["Bookings", "Client records", "Point of sale", "Pay by link",
  "Reminders", "Review requests", "Your own booking page", "On your phone"]
  .map((s) => `<span>${s}</span>`).join("<em>&bull;</em>");

export const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFace()}${CSS}
:root{
  --ground:#FFF7ED; --raised:#FFFFFF; --ink:24 24 27;
  --brand:#2563EB; --warm:#EA580C;
}
html,body{width:1080px;height:1920px;margin:0}
#stage{position:relative;width:1080px;height:1920px;overflow:hidden;background:var(--ground);
  perspective:1500px;perspective-origin:50% 52%}
/* The shake wrapper MUST carry preserve-3d. #stage owns the perspective and
   CSS perspective only reaches children, so an untransformed div in between
   flattens the whole world — every card rendered at exactly 1.0x. */
#shaker{position:absolute;inset:0;transform-style:preserve-3d;will-change:transform}
#world{position:absolute;inset:0;transform-style:preserve-3d;will-change:transform}

/* Everything in the world is positioned from the centre of the frame. */
.obj{position:absolute;left:50%;top:52%;transform-style:preserve-3d;will-change:transform,opacity,filter}

/* --- deep background: a ruled floor and a ghost word -------------------
   Both parallax with the camera, which is the whole point: they turn the
   empty cream into depth instead of into a gap. Neither takes depth of
   field — an 8px blur on a 3400px element costs more per frame than it is
   worth, and they are meant to sit behind everything anyway. */
#floor{width:3400px;height:3400px;margin:-1700px 0 0 -1700px;opacity:.5;
  background-image:
    repeating-linear-gradient(0deg,rgb(var(--ink)/.10) 0 2px,transparent 2px 116px),
    repeating-linear-gradient(90deg,rgb(var(--ink)/.10) 0 2px,transparent 2px 116px)}
#ghost{width:2600px;margin:60px 0 0 -1300px;text-align:center;font-weight:800;
  text-transform:uppercase;font-size:380px;line-height:.82;letter-spacing:-.04em;
  color:transparent;-webkit-text-stroke:4px rgb(var(--ink)/.065)}
.dot{border-radius:50%;background:rgb(var(--ink)/.22);margin:-4px 0 0 -4px}

/* --- the six cards ---------------------------------------------------- */
.card{width:520px;margin:-280px 0 0 -260px;height:560px;box-sizing:border-box;
  border:3px solid rgb(var(--ink)/.14);background:#fff;border-radius:10px;
  padding:34px 36px;display:flex;flex-direction:column;
  box-shadow:0 46px 80px -34px rgba(70,45,20,.55);opacity:0;overflow:hidden;position:absolute}
.ctop{display:flex;align-items:center;justify-content:space-between}
.cnum{font-family:'JetBrains Mono',monospace;font-size:24px;letter-spacing:.14em;color:var(--brand)}
.tk{width:46px;height:46px;color:var(--brand)}
.tk path{stroke-dasharray:70;stroke-dashoffset:70}
.clab{font-size:54px;font-weight:800;letter-spacing:-.018em;line-height:1.04}
.clab.job{margin-top:30px}
.skel{margin-top:40px;display:flex;flex-direction:column;gap:18px}
.skel i{height:16px;border-radius:3px;background:rgb(var(--ink)/.1);display:block}
.clab.tool{opacity:0;color:var(--warm);font-size:40px;margin-top:auto}
.sweep{position:absolute;inset:0;pointer-events:none;opacity:0;
  background:linear-gradient(105deg,transparent 38%,rgba(37,99,235,.30) 50%,transparent 62%)}

/* --- the card that replaces them -------------------------------------- */
#one{width:800px;height:880px;margin:-440px 0 0 -400px;border-radius:18px;
  background:var(--brand);color:#fff;display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:16px;opacity:0;padding:48px;
  box-sizing:border-box;box-shadow:0 70px 130px -40px rgba(37,99,235,.75);overflow:hidden}
#one .nm{font-size:104px;font-weight:800;letter-spacing:-.028em;line-height:1}
#one .sb{font-family:'JetBrains Mono',monospace;font-size:25px;text-transform:uppercase;
  letter-spacing:.16em;color:rgba(255,255,255,.75)}
#one .six{margin-top:34px;width:100%;display:flex;flex-direction:column;gap:2px}
#one .six div{display:flex;align-items:center;gap:18px;padding:15px 4px;font-size:34px;
  font-weight:700;letter-spacing:-.012em;border-top:1px solid rgba(255,255,255,.22);opacity:0}
#one .six div:last-child{border-bottom:1px solid rgba(255,255,255,.22)}
#one .six svg{width:30px;height:30px;flex:none;color:#fff}
#one .six svg path{stroke-dasharray:70;stroke-dashoffset:0}
#glow{position:absolute;width:900px;height:900px;left:50%;top:50%;margin:-450px 0 0 -450px;
  border-radius:50%;opacity:.55;
  background:radial-gradient(circle at 50% 50%,rgba(255,255,255,.42),rgba(255,255,255,0) 62%)}

/* --- type blocks ------------------------------------------------------- */
.type{width:960px;margin-left:-480px;text-align:left;opacity:0}
.display{font-weight:800;text-transform:uppercase;line-height:.9;letter-spacing:-.032em}
.display i,.l2 i{display:inline-block;font-style:normal;will-change:transform,opacity}
#t-title{margin-top:-580px}
#t-title .l1{font-size:150px}
#t-title .l2{font-size:60px;color:rgb(var(--ink)/.55);margin-top:26px;
  text-transform:none;font-weight:600;letter-spacing:-.01em}
#t-title .chips{margin-top:66px;display:flex;flex-direction:column}
#t-title .chips div{border-top:2px solid rgb(var(--ink)/.14);padding:32px 6px;
  display:flex;align-items:center;gap:28px;opacity:0}
#t-title .chips div:last-child{border-bottom:2px solid rgb(var(--ink)/.14)}
#t-title .chips b{font-family:'JetBrains Mono',monospace;font-size:24px;letter-spacing:.14em;
  color:var(--brand);font-weight:400}
#t-title .chips span{font-size:46px;font-weight:700;letter-spacing:-.014em}
#t-most{margin-top:-430px;text-align:center;padding:56px 40px;
  background:radial-gradient(ellipse at 50% 50%,rgba(255,247,237,.97) 42%,rgba(255,247,237,0) 78%)}
#t-most .l1{font-size:96px}
#t-most .l2{font-size:96px;color:var(--warm)}
#t-most .note{margin-top:30px;font-family:'JetBrains Mono',monospace;font-size:24px;
  letter-spacing:.14em;text-transform:uppercase;color:rgb(var(--ink)/.42)}
#t-price{margin-top:-600px;text-align:center}
#t-price .l1{font-size:230px;line-height:.84}
#t-price .l2{font-size:58px;color:rgb(var(--ink)/.55);margin-top:22px;
  text-transform:none;font-weight:600;letter-spacing:-.01em}
#t-price .rows{margin-top:52px;display:flex;flex-direction:column}
#t-price .rows div{display:flex;justify-content:space-between;align-items:baseline;
  padding:31px 6px;border-top:2px solid rgb(var(--ink)/.13);opacity:0;
  font-family:'JetBrains Mono',monospace;font-size:26px;letter-spacing:.09em;
  text-transform:uppercase;color:rgb(var(--ink)/.55)}
#t-price .rows div:last-child{border-bottom:2px solid rgb(var(--ink)/.13)}
#t-price .rows b{color:var(--brand);font-weight:400}

/* --- the real product frame ------------------------------------------- */
#shotwrap{width:1040px;margin-left:-520px;margin-top:-700px;opacity:0}
#hero{position:relative;height:1000px;transform-style:preserve-3d}
#hero > div{position:absolute}
#hero .a{top:0;left:20px;width:1000px}
#hero .a .win,#hero .b .win{position:relative}
#hero .a .win::after,#hero .b .win::after{content:"";position:absolute;left:0;right:0;bottom:0;
  height:86px;background:linear-gradient(transparent,#0A0E17)}
#hero .b{top:392px;right:0;width:700px}
#hero .c{top:470px;left:0;width:330px}
#shotwrap .cap{font-family:'JetBrains Mono',monospace;font-size:24px;text-transform:uppercase;
  letter-spacing:.14em;color:rgb(var(--ink)/.45);margin-top:14px;text-align:center}
.win{border:1px solid rgb(var(--ink)/.14);background:#0A0E17;overflow:hidden;border-radius:8px;
  box-shadow:0 60px 110px -44px rgba(70,45,20,.6)}
.win-bar{display:flex;align-items:center;gap:11px;padding:14px 18px;background:#0b1018;
  border-bottom:1px solid rgba(233,237,244,.1)}
.win-dot{width:10px;height:10px;border-radius:50%;background:rgba(233,237,244,.2)}
.win-url{font-family:'JetBrains Mono',monospace;font-size:15px;color:rgba(233,237,244,.34);margin-left:8px}
.crop{background:transparent}
#bloom{position:absolute;inset:-40px;pointer-events:none;opacity:0;
  background:linear-gradient(112deg,transparent 40%,rgba(255,255,255,.55) 50%,transparent 60%)}

/* --- the closing call to action ---------------------------------------- */
#cta{margin-top:74px;opacity:0;
  border:3px solid var(--brand);background:rgba(37,99,235,.08);border-radius:12px;
  padding:36px 38px;text-align:center}
#cta .k{font-family:'JetBrains Mono',monospace;font-size:22px;letter-spacing:.16em;
  text-transform:uppercase;color:var(--brand)}
#cta .m{font-size:62px;font-weight:800;letter-spacing:-.02em;margin-top:12px}
#cta .m b{color:var(--brand)}
#cta .f{margin-top:22px;font-family:'JetBrains Mono',monospace;font-size:21px;
  letter-spacing:.13em;text-transform:uppercase;color:rgb(var(--ink)/.42)}

/* --- screen-space furniture (never moves with the camera) -------------
   These exist because the frame is 1080x1920 and the story only ever needs
   the middle of it. Edges that are designed read as a film; edges that are
   blank read as a slide that did not fill. */
#head{position:absolute;top:110px;left:64px;right:64px;display:flex;align-items:center;
  justify-content:space-between;z-index:8}
#head .mk{display:flex;align-items:center;gap:13px}
#head .wm{font-weight:800;font-size:33px;letter-spacing:-.02em;color:rgb(var(--ink))}
#head .pl{font-family:'JetBrains Mono',monospace;font-size:21px;letter-spacing:.16em;
  text-transform:uppercase;color:rgb(var(--ink)/.4)}
#head .rule{position:absolute;left:0;right:0;top:64px;height:2px;background:rgb(var(--ink)/.12)}
.cnr{position:absolute;width:62px;height:62px;z-index:8;border:3px solid rgb(var(--ink)/.2)}
.cnr.tl{top:190px;left:40px;border-right:0;border-bottom:0}
.cnr.tr{top:190px;right:40px;border-left:0;border-bottom:0}
.cnr.bl{bottom:190px;left:40px;border-right:0;border-top:0}
.cnr.br{bottom:190px;right:40px;border-left:0;border-top:0}
.side{position:absolute;z-index:8;font-family:'JetBrains Mono',monospace;font-size:19px;
  letter-spacing:.3em;text-transform:uppercase;color:rgb(var(--ink)/.3);white-space:nowrap}
.side.l{left:16px;top:50%;transform:rotate(-90deg) translateX(-50%);transform-origin:left center}
.side.r{right:16px;top:50%;transform:rotate(90deg) translateX(50%);transform-origin:right center}
#ticker{position:absolute;left:0;right:0;bottom:104px;z-index:8;overflow:hidden;height:46px;
  border-top:2px solid rgb(var(--ink)/.12);border-bottom:2px solid rgb(var(--ink)/.12);
  padding:12px 0;box-sizing:content-box}
#tickrow{display:flex;align-items:center;gap:26px;white-space:nowrap;will-change:transform;
  font-family:'JetBrains Mono',monospace;font-size:24px;letter-spacing:.2em;
  text-transform:uppercase;color:rgb(var(--ink)/.34);line-height:46px}
#tickrow em{color:var(--brand);font-style:normal}
#streaks{position:absolute;inset:0;z-index:7;pointer-events:none;opacity:0;
  background:repeating-conic-gradient(from 0deg at 50% 50%,
    rgba(255,255,255,0) 0deg 2.1deg,rgba(255,255,255,.75) 2.1deg 2.6deg);
  -webkit-mask-image:radial-gradient(circle at 50% 50%,transparent 20%,#000 78%)}
#vig{position:absolute;inset:0;z-index:7;pointer-events:none;
  background:radial-gradient(ellipse at 50% 46%,transparent 58%,rgba(120,80,40,.12) 100%)}
#ca{position:absolute;inset:0;z-index:7;pointer-events:none;opacity:0;mix-blend-mode:multiply}
#ca i{position:absolute;inset:0;display:block;will-change:transform}
#ca .r{background:radial-gradient(ellipse at 50% 50%,transparent 42%,rgba(255,0,60,.5) 100%)}
#ca .b{background:radial-gradient(ellipse at 50% 50%,transparent 42%,rgba(0,110,255,.5) 100%)}
#grain{position:absolute;top:-50%;left:-50%;width:200%;height:200%;z-index:7;pointer-events:none;
  opacity:.026;mix-blend-mode:multiply;background-size:300px 300px;will-change:transform;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")}
#flash{position:absolute;inset:0;z-index:7;pointer-events:none;background:#fff;opacity:0}
.lb{position:absolute;left:0;right:0;background:#1b120a;z-index:9}
.lb.t{top:0}.lb.b{bottom:0}
</style></head><body>
<div id="stage"><div id="shaker">
  <div id="world">
    <div class="obj" id="floor"></div>
    <div class="obj" id="ghost">Diary</div>
    ${dustEls}
    <div class="obj type" id="t-title">
      <div class="display l1">${words("Six jobs.")}</div>
      <div class="l2">${words("Every salon. Every single day.")}</div>
      <div class="chips">
        ${CARDS.map(([job], i) =>
          `<div><b>0${i + 1}</b><span>${job}</span></div>`).join("")}
      </div>
    </div>
    ${cardEls}
    <div class="obj type" id="t-most">
      <div class="display l1">${words("Six different")}</div>
      <div class="display l2">${words("places.")}</div>
      <div class="note">None of them talk to each other</div>
    </div>
    <div class="obj" id="one">
      <div id="glow"></div>
      <span class="nm">Kairo</span><span class="sb">all six &middot; one login</span>
      <div class="six">
        ${CARDS.map(([job]) => `<div>${tickSvg}<span>${job}</span></div>`).join("")}
      </div>
    </div>
    <div class="obj" id="shotwrap">
      <div id="hero">
        <div class="a">${win(crop("01-dashboard.jpg", { ...SW, x: 232, y: 118, cw: 958, ch: 300 },
              { displayW: 1000, label: "film/dashboard" }), "luxehairstudio.kairo.app")}</div>
        <div class="b">${win(crop("04-calendar-day.jpg", { ...SW, x: 232, y: 150, cw: 960, ch: 468 },
              { displayW: 700, label: "film/calendar" }), "luxehairstudio.kairo.app/calendar")}</div>
        <div class="c">${phone(crop("23-phone-dashboard.jpg", { ...PHONE, x: 0, y: 0, cw: 460, ch: 620 },
              { displayW: 312, label: "film/phone" }), 330)}</div>
        <div id="bloom"></div>
      </div>
      <div class="cap">Real software. A Melbourne salon, since day one.</div>
    </div>
    <div class="obj type" id="t-price">
      <div class="display l1">${PRICE}</div>
      <div class="l2">${SETUP.unit === "one-off" ? "Once. Then nothing, every month." : ""}</div>
      <div class="rows">
        <div><span>Setup</span><b>${PRICE} once</b></div>
        <div><span>Every month after</span><b>$0</b></div>
        <div><span>Per booking</span><b>$0</b></div>
      </div>
      <div id="cta">
        <div class="k">The next step</div>
        <div class="m">DM me the word <b>Diary</b></div>
        <div class="f">No subscription &middot; No commission &middot; No per-booking fee</div>
      </div>
    </div>
  </div>

  <div id="head">
    <div class="mk">${markSvg(40)}<span class="wm">Kairo</span></div>
    <span class="pl">Melbourne</span>
    <div class="rule"></div>
  </div>
  <div class="cnr tl"></div><div class="cnr tr"></div>
  <div class="cnr bl"></div><div class="cnr br"></div>
  <span class="side l">Bookings &middot; Payments &middot; Messaging</span>
  <span class="side r">All six jobs &middot; One login</span>
  <div id="ticker"><div id="tickrow">${TICKER}${TICKER}</div></div>
  <div id="streaks"></div>
  <div id="vig"></div><div id="ca"><i class="r"></i><i class="b"></i></div>
  <div id="grain"></div><div id="flash"></div>
</div>
  <div class="lb t"></div><div class="lb b"></div>
</div>
<script>
const D = ${duration};
const L = ${JSON.stringify(L)};
const CARDS = ${JSON.stringify(CARDS)};
const KEYS = ${JSON.stringify(KEYS)};
const JOB_IDS = ${JSON.stringify(JOB_IDS)};
const DUST = ${JSON.stringify(DUST)};

const cl = (v,a=0,b=1) => v < a ? a : v > b ? b : v;
const mix = (a,b,p) => a + (b-a)*p;
// Smootherstep: zero velocity AND zero acceleration at both ends, so the
// camera eases between framings without a visible start or stop.
const ss = (p) => { const x = cl(p); return x*x*x*(x*(x*6-15)+10); };
// A decaying wobble, for anything that should land like an impact.
const hit = (t,at,dur) => {
  const p = (t-at)/dur;
  return p < 0 || p > 1 ? 0 : Math.sin(p*Math.PI*6) * (1-p) * (1-p);
};

const $ = (s) => document.getElementById(s);
const world = $("world"), shaker = $("shaker");
const cards = [...document.querySelectorAll(".card")];
const dots  = [...document.querySelectorAll(".dot")];
const objs  = [...document.querySelectorAll(".obj")];
const chips = [...document.querySelectorAll("#t-title .chips div")];
const sixes = [...document.querySelectorAll("#one .six div")];
const rows  = [...document.querySelectorAll("#t-price .rows div")];

/** Interpolate the camera between its keyframes. */
function camera(t) {
  let a = KEYS[0], b = KEYS[KEYS.length-1];
  for (let i = 0; i < KEYS.length-1; i++) {
    if (t >= KEYS[i].t && t <= KEYS[i+1].t) { a = KEYS[i]; b = KEYS[i+1]; break; }
    if (t > KEYS[i].t) { a = KEYS[i]; b = KEYS[i+1] || KEYS[i]; }
  }
  const p = b.t === a.t ? 1 : ss((t - a.t) / (b.t - a.t));
  return {
    // A slow hand-held float on top of every move, so nothing is ever locked off.
    cx: mix(a.cx,b.cx,p) + Math.sin(t*0.63)*15 + Math.sin(t*1.7)*4,
    cy: mix(a.cy,b.cy,p) + Math.cos(t*0.51)*11 + Math.cos(t*1.9)*3,
    cz: mix(a.cz,b.cz,p) + Math.sin(t*0.41)*22,
    yaw: mix(a.yaw,b.yaw,p) + Math.sin(t*0.47)*0.75,
    pitch: mix(a.pitch,b.pitch,p) + Math.cos(t*0.39)*0.5,
    roll: mix(a.roll,b.roll,p) + Math.sin(t*0.33)*0.35,
  };
}

/** Fade helper: 0 before a, 1 after a+in, back to 0 after b. */
const vis = (t,a,inD,b,outD) =>
  ss((t-a)/inD) * (b == null ? 1 : 1 - ss((t-b)/outD));

/** Stagger a set of elements in, one every step seconds. */
const stagger = (els,t,at,step,inD) => els.forEach((el,i) => {
  const p = ss((t-(at+i*step))/inD);
  el.style.opacity = p.toFixed(3);
  el.style.transform = "translateY(" + mix(26,0,p).toFixed(1) + "px)";
});

/** Word-by-word arrival on a line of display type. */
const typeIn = (sel,t,at,step,inD) =>
  document.querySelectorAll(sel).forEach((el,i) => {
    const p = ss((t-(at+i*step))/inD);
    el.style.opacity = p.toFixed(3);
    el.style.transform = "translateY(" + mix(40,0,p).toFixed(1) +
      "px) rotateX(" + mix(-42,0,p).toFixed(1) + "deg)";
  });

window.setFrame = (t) => {
  const c = camera(t);
  world.style.transform =
    "rotateZ(" + (-c.roll) + "deg) rotateX(" + (-c.pitch) + "deg) rotateY(" + (-c.yaw) + "deg) " +
    "translate3d(" + (-c.cx).toFixed(2) + "px," + (-c.cy).toFixed(2) + "px," + (-c.cz).toFixed(2) + "px)";

  // --- impact shake, on the two beats that need weight -----------------
  const shake = hit(t, L.j6.end-0.10, 0.5)*15 + hit(t, L.kairo.start-0.08, 0.7)*22;
  shaker.style.transform = shake
    ? "translate(" + (shake*0.7).toFixed(2) + "px," + (-shake).toFixed(2) + "px) rotate(" +
      (shake*0.035).toFixed(3) + "deg)"
    : "none";

  // Grain jitters on a fixed sequence so the render stays reproducible.
  const f = Math.round(t*30);
  $("grain").style.transform =
    "translate(" + (((f*73)%211)-105) + "px," + (((f*149)%197)-98) + "px)";

  // Letterbox opens at the head and closes at the tail.
  const lbH = mix(110,0,ss(t/1.1)) + mix(0,110,ss((t-(D-1.0))/1.0));
  document.querySelectorAll(".lb").forEach(b => b.style.height = lbH.toFixed(1)+"px");

  // The ticker never stops. It is the one thing in frame that always moves,
  // which is what stops a held shot reading as a paused video.
  $("tickrow").style.transform = "translateX(" + (-((t*58) % 1760)).toFixed(1) + "px)";

  // --- lens artefacts ---------------------------------------------------
  // A white bloom on the reveal — one flash, where the film turns.
  const fl = Math.max(ss((t-(L.kairo.start-0.16))/0.12) * (1-ss((t-(L.kairo.start-0.04))/0.5)), 0);
  $("flash").style.opacity = (fl*0.5).toFixed(3);

  // Colour fringing tracks the shake and the flash, the way a real lens does.
  const caAmt = cl(Math.abs(shake)/16 + fl*0.8, 0, 1);
  $("ca").style.opacity = (caAmt*0.5).toFixed(3);
  if (caAmt > 0.01) {
    const o = caAmt*9;
    $("ca").querySelector(".r").style.transform = "translate(" + o.toFixed(2) + "px,0)";
    $("ca").querySelector(".b").style.transform = "translate(" + (-o).toFixed(2) + "px,0)";
  }

  // Speed streaks, driven by how fast the camera is actually travelling in z
  // rather than by a hand-placed cue. They only show up on the real pushes.
  const vz = Math.abs(camera(t+1/30).cz - c.cz) * 30;   // px per second
  $("streaks").style.opacity = cl((vz-420)/1500, 0, 0.2).toFixed(3);

  // --- background ------------------------------------------------------
  $("floor").style.transform = "translate3d(0px,120px,-3800px)";
  const gw = t < L.most.start-0.4 ? "Diary" : t < L.kairo.start-0.3 ? "Chaos" : "Kairo";
  const gel = $("ghost");
  if (gel.textContent !== gw) gel.textContent = gw;
  gel.style.transform = "translate3d(" + (Math.sin(t*0.22)*90).toFixed(1) + "px,0px,-3300px)";

  dots.forEach((el,i) => {
    const d = DUST[i];
    el.style.opacity = "1";
    el.style.transform = "translate3d(" +
      (d.x + Math.sin(t*d.s + d.p)*46).toFixed(1) + "px," +
      (d.y + Math.cos(t*d.s*0.8 + d.p)*38 - t*9).toFixed(1) + "px," + d.z + "px)";
  });

  // --- world objects --------------------------------------------------
  const scatter = ss((t - L.most.start) / 1.5);          // tidy -> mess
  const pull    = ss((t - (L.kairo.start-0.5)) / 0.85);  // mess -> gone

  cards.forEach((el,i) => {
    const [ , , x, y, z] = CARDS[i];
    const line = L[JOB_IDS[i]];
    const inP  = ss((t - (line.start - 0.18)) / 0.42);
    const born = inP * (1-ss((t-(L.kairo.start-0.42))/0.42));
    const rot  = [-7,6,-5,9,-11,7][i] * scatter * (1-pull);
    const dx   = [40,-44,-10,34,48,-30][i] * scatter;
    const dy   = [-26,18,32,-24,16,-20][i] * scatter;
    // Everything is dragged to the middle just before the reveal.
    const cxp = mix(0, -x, pull), cyp = mix(0, -y, pull);
    const sc  = mix(1, 0.30, pull);
    el.style.opacity = born.toFixed(3);
    el.style.transform =
      "translate3d(" + (x+dx+cxp).toFixed(1) + "px," + (y+dy+cyp).toFixed(1) + "px," + z + "px)" +
      " rotateY(" + mix(-26,0,inP).toFixed(2) + "deg)" +
      " rotateZ(" + rot.toFixed(2) + "deg) scale(" + sc.toFixed(3) + ")";
    el.style.borderColor = scatter > 0.25 ? "rgba(234,88,12,.5)" : "rgba(24,24,27,.14)";
    el.querySelector(".job").style.opacity  = mix(1,0.42,scatter).toFixed(3);
    el.querySelector(".skel").style.opacity = mix(1,0.55,scatter).toFixed(3);
    el.querySelector(".tool").style.opacity = scatter.toFixed(3);
    // A light sweep rides in with the card, then leaves.
    const sw = ss((t-(line.start-0.16))/0.5) * (1-ss((t-(line.start+0.34))/0.4));
    const swp = el.querySelector(".sweep");
    swp.style.opacity = sw.toFixed(3);
    swp.style.transform = "translateX(" + mix(-620,620,ss((t-(line.start-0.16))/0.9)).toFixed(0) + "px)";
    // The tick draws itself as the line finishes, so the mark arrives on the word.
    const drawn = ss((t-(line.end-0.22))/0.3) * (1-scatter);
    el.querySelector(".tk path").style.strokeDashoffset = (70 * (1-drawn)).toFixed(1);
  });

  const set = (el, o, x, y, z, extra) => {
    el.style.opacity = o.toFixed(3);
    el.style.transform = "translate3d("+x+"px,"+y+"px,"+z+"px)" + (extra||"");
  };
  set($("t-title"), vis(t, 0.1, 0.9, L.everyday.end + 0.35, 0.7), 0, 0, ${TITLE_Z});
  typeIn("#t-title .l1 i", t, 0.15, 0.10, 0.45);
  typeIn("#t-title .l2 i", t, L.six.end - 0.35, 0.05, 0.4);
  stagger(chips, t, L.six.end - 0.1, 0.075, 0.4);

  set($("t-most"), vis(t, L.most.start - 0.1, 0.55, L.kairo.start - 0.5, 0.45), 0, 0, ${MOST_Z});
  typeIn("#t-most .l1 i", t, L.most.start, 0.09, 0.42);
  typeIn("#t-most .l2 i", t, L.most.start + 0.34, 0.09, 0.42);

  const oneP = ss((t-(L.kairo.start-0.08))/0.7);
  set($("one"), vis(t, L.kairo.start - 0.08, 0.34, L.real.start - 0.35, 0.45), 0, 0, ${ONE_Z},
      " scale(" + mix(0.55, 1, oneP).toFixed(3) + ")");
  $("glow").style.transform = "translate(" + (Math.cos(t*1.15)*250).toFixed(1) +
    "px," + (Math.sin(t*0.95)*250).toFixed(1) + "px)";
  stagger(sixes, t, L.kairo.start + 0.22, 0.085, 0.36);

  set($("shotwrap"), vis(t, L.real.start - 0.25, 0.5, L.price.start - 0.45, 0.45), 0, 40, ${SHOT_Z},
      " scale(" + mix(0.94, 1.0, ss((t-(L.real.start-0.25))/1.6)).toFixed(3) + ")");
  // The three frames arrive in depth, not together, and a highlight crosses them.
  const hp = (at,d) => ss((t-at)/d);
  const hz = [["a",0,L.real.start-0.20],["b",-70,L.real.start+0.30],["c",70,L.real.start+0.62]];
  hz.forEach(([k,z,at]) => {
    const p = hp(at,0.55), el = document.querySelector("#hero ."+k);
    el.style.opacity = p.toFixed(3);
    el.style.transform = "translate3d(0," + mix(46,0,p).toFixed(1) + "px," + z + "px)";
  });
  const bl = ss((t-(L.melb.start-0.1))/0.5) * (1-ss((t-(L.melb.start+0.5))/0.5));
  $("bloom").style.opacity = (bl*0.5).toFixed(3);
  $("bloom").style.transform =
    "translateX(" + mix(-1200,1200,ss((t-(L.melb.start-0.1))/1.0)).toFixed(0) + "px)";

  set($("t-price"), vis(t, L.price.start - 0.2, 0.45, null, 1), 0, 0, ${PRICE_Z});
  stagger(rows, t, L.once.start - 0.05, 0.11, 0.38);
  const ctaP = ss((t-(L.nothing.start-0.1))/0.5);
  $("cta").style.opacity = ctaP.toFixed(3);
  $("cta").style.transform = "translateY(" + mix(34,0,ctaP).toFixed(1) + "px) scale(" +
    (mix(0.94,1,ctaP) + hit(t,L.nothing.end,0.6)*0.02).toFixed(3) + ")";

  // --- depth of field, from real distance to the camera ----------------
  objs.forEach((el) => {
    if (el.id === "floor" || el.id === "ghost" || el.classList.contains("dot")) return;
    const m = /translate3d\\([^,]+,[^,]+,\\s*(-?[\\d.]+)px\\)/.exec(el.style.transform || "");
    if (!m) return;
    const za = parseFloat(m[1]) - c.cz;      // final z; 0 is life size
    const blur = cl(Math.abs(za - 110) / 300, 0, 3.4);
    el.style.filter = blur > 0.25 ? "blur(" + blur.toFixed(2) + "px)" : "none";
  });
};
window.setFrame(0);
</script></body></html>`;

audit(id);
