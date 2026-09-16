/**
 * REEL — "Six jobs." A narrated product film.
 *
 * Not a slideshow. There is one 3D space and one camera that never stops
 * moving through it: it drifts in on the title, flies past six cards as the
 * voice names them, pulls back to find them in a mess, pushes into the card
 * that replaces them, then settles on the real software and the price.
 *
 * Every cut point comes from audio/timeline.json, which was produced by
 * running silencedetect over the generated voiceover and re-cutting its gaps.
 * The picture is cut to the voice, not to a guess — that is the difference
 * between a film and a deck.
 *
 * Depth is real CSS 3D with perspective, so parallax and scale come out of the
 * geometry rather than being faked per element, and depth of field is computed
 * from each element's actual distance to the camera.
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { CSS, fontFace, markSvg } from "../../../tools/render-cards.mjs";
import { SW, crop, win, audit } from "../../../tools/media.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const TL = JSON.parse(readFileSync(resolve(HERE, "audio/timeline.json"), "utf8"));
/** line id -> {start,end} */
const L = Object.fromEntries(TL.lines.map((l) => [l.id, l]));

export const id = "reel-film";
export const fps = 30;
export const crf = 20;
export const duration = +(TL.duration + 0.5).toFixed(2);

/** job, tool, world x, y, z */
const CARDS = [
  ["Take the bookings",  "A paper diary",   -318, -306, -2200],
  ["Remember clients",   "A spreadsheet",    318, -306, -2320],
  ["Take the money",     "A card machine",  -318,   14, -2450],
  ["Send the reminders", "Texting by hand",  318,   14, -2570],
  ["Fill the gaps",      "Hoping",          -318,  334, -2700],
  ["Never double-book",  "Memory",           318,  334, -2820],
];
const JOB_IDS = ["j1", "j2", "j3", "j4", "j5", "j6"];

const cardEls = CARDS.map(([job, tool], i) => `
  <div class="obj card" data-i="${i}">
    <span class="cnum">0${i + 1}</span>
    <span class="clab job">${job}</span>
    <span class="clab tool">${tool}</span>
  </div>`).join("");

/* Camera keyframes.
 *
 * The geometry that matters: with CSS `perspective: P`, an element whose final
 * z is `za` renders at scale P / (P - za). za = 0 is life size; negative is
 * away and smaller; positive is nearer and larger. The world is translated by
 * -cz, so an object at objZ ends at za = objZ - cz.
 *
 * So to frame something, solve for cz rather than guessing a distance:
 *   cz = objZ - za,   za ≈ +120 for a comfortable close shot.
 * Getting this backwards renders everything at roughly half size, which is
 * exactly what the first cut of this film did. */
const PERSPECTIVE = 1500;
const shot = (c, za = 120, bias = 0.78) =>
  ({ cx: CARDS[c][2] * bias, cy: CARDS[c][3] * bias, cz: CARDS[c][4] - za });

const TITLE_Z = -1240, MOST_Z = -2020, ONE_Z = -2500, SHOT_Z = -2060, PRICE_Z = -1460;
/* A wide enough za that all six cards and their scatter fit the frame. */
const WIDE_ZA = -470;
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
  { t: L.most.start + 0.35,   cx: 0, cy: -80, cz: CARD_MID - WIDE_ZA,       yaw: -4.5, pitch: 0.8, roll: 0.6 },
  { t: L.t3.end - 0.2,        cx: 0, cy: -92, cz: CARD_MID - WIDE_ZA - 90,  yaw: 4.5,  pitch: -0.6, roll: -0.6 },
  // Push into the card that replaces them.
  { t: L.kairo.start + 0.35,  cx: 0, cy: 6,  cz: ONE_Z - 150,   yaw: 0,    pitch: 0, roll: 0 },
  { t: L.onelogin.end,        cx: 0, cy: 0,  cz: ONE_Z - 210,   yaw: -2.2, pitch: 0.5, roll: 0.3 },
  // Settle on the real software, then the price.
  { t: L.real.start + 0.3,    cx: 0, cy: 46, cz: SHOT_Z - 30,   yaw: 2.6,  pitch: -1.4, roll: -0.4 },
  { t: L.melb.end + 0.1,      cx: 0, cy: 36, cz: SHOT_Z - 90,   yaw: -1.6, pitch: 0.7, roll: 0.3 },
  { t: L.price.start + 0.2,   cx: 0, cy: 0,  cz: PRICE_Z - 90,  yaw: 1.2,  pitch: -0.4, roll: -0.2 },
  { t: duration,              cx: 0, cy: -10, cz: PRICE_Z - 150, yaw: -0.8, pitch: 0.3, roll: 0.15 },
];

export const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFace()}${CSS}
:root{
  --ground:#FFF7ED; --raised:#FFFFFF; --ink:24 24 27;
  --brand:#2563EB; --warm:#EA580C;
}
html,body{width:1080px;height:1920px;margin:0}
#stage{position:relative;width:1080px;height:1920px;overflow:hidden;background:var(--ground);
  perspective:1500px;perspective-origin:50% 52%}
#world{position:absolute;inset:0;transform-style:preserve-3d;will-change:transform}

/* Everything in the world is positioned from the centre of the frame. */
.obj{position:absolute;left:50%;top:52%;transform-style:preserve-3d;will-change:transform,opacity,filter}

/* --- the six cards ---------------------------------------------------- */
.card{width:470px;margin:-104px 0 0 -235px;height:208px;box-sizing:border-box;
  border:3px solid rgb(var(--ink)/.14);background:#fff;border-radius:8px;
  padding:30px 32px;display:flex;flex-direction:column;justify-content:space-between;
  box-shadow:0 40px 70px -34px rgba(70,45,20,.55);opacity:0}
.cnum{font-family:'JetBrains Mono',monospace;font-size:21px;letter-spacing:.14em;color:var(--brand)}
.clab{font-size:35px;font-weight:800;letter-spacing:-.012em;line-height:1.08}
.clab.tool{position:absolute;left:32px;right:32px;bottom:30px;opacity:0;color:var(--warm)}

/* --- the card that replaces them -------------------------------------- */
#one{width:700px;height:330px;margin:-165px 0 0 -350px;border-radius:14px;
  background:var(--brand);color:#fff;display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:14px;opacity:0;
  box-shadow:0 60px 110px -40px rgba(37,99,235,.75)}
#one .nm{font-size:76px;font-weight:800;letter-spacing:-.025em}
#one .sb{font-family:'JetBrains Mono',monospace;font-size:23px;text-transform:uppercase;
  letter-spacing:.16em;color:rgba(255,255,255,.75)}

/* --- type blocks ------------------------------------------------------- */
.type{width:960px;margin-left:-480px;text-align:left;opacity:0}
.display{font-weight:800;text-transform:uppercase;line-height:.9;letter-spacing:-.032em}
#t-title{margin-top:-120px}
#t-title .l1{font-size:128px}
#t-title .l2{font-size:66px;color:rgb(var(--ink)/.55);margin-top:26px;
  text-transform:none;font-weight:600;letter-spacing:-.01em}
#t-most{margin-top:-430px;text-align:center}
#t-most .l1{font-size:72px}
#t-most .l2{font-size:72px;color:var(--warm)}
#t-price .l1{font-size:150px}
#t-price .l2{font-size:64px;color:rgb(var(--ink)/.55);margin-top:24px;
  text-transform:none;font-weight:600;letter-spacing:-.01em}
#t-price{margin-top:-300px;text-align:center}

/* --- the real product frame ------------------------------------------- */
#shotwrap{width:1000px;margin-left:-500px;margin-top:-120px;opacity:0}
#shotwrap .cap{font-family:'JetBrains Mono',monospace;font-size:22px;text-transform:uppercase;
  letter-spacing:.14em;color:rgb(var(--ink)/.45);margin-top:26px;text-align:center}
.win{border:1px solid rgb(var(--ink)/.14);background:#0A0E17;overflow:hidden;border-radius:8px;
  box-shadow:0 60px 110px -44px rgba(70,45,20,.6)}
.win-bar{display:flex;align-items:center;gap:11px;padding:14px 18px;background:#0b1018;
  border-bottom:1px solid rgba(233,237,244,.1)}
.win-dot{width:10px;height:10px;border-radius:50%;background:rgba(233,237,244,.2)}
.win-url{font-family:'JetBrains Mono',monospace;font-size:15px;color:rgba(233,237,244,.34);margin-left:8px}
.crop{background:transparent}

/* --- the closing call to action ---------------------------------------- */
#cta{width:820px;margin-left:-410px;margin-top:80px;opacity:0;
  border:3px solid var(--brand);background:rgba(37,99,235,.08);border-radius:10px;
  padding:34px 38px;text-align:center}
#cta .k{font-family:'JetBrains Mono',monospace;font-size:21px;letter-spacing:.16em;
  text-transform:uppercase;color:var(--brand)}
#cta .m{font-size:58px;font-weight:800;letter-spacing:-.02em;margin-top:12px}
#cta .m b{color:var(--brand)}

/* --- screen-space furniture (never moves with the camera) ------------- */
#head{position:absolute;top:110px;left:64px;right:64px;display:flex;align-items:center;
  justify-content:space-between;z-index:8}
#head .mk{display:flex;align-items:center;gap:13px}
#head .wm{font-weight:800;font-size:33px;letter-spacing:-.02em;color:rgb(var(--ink))}
#head .pl{font-family:'JetBrains Mono',monospace;font-size:21px;letter-spacing:.16em;
  text-transform:uppercase;color:rgb(var(--ink)/.4)}
#bar{position:absolute;top:186px;left:64px;right:64px;height:3px;
  background:rgb(var(--ink)/.13);z-index:8}
#barfill{height:100%;background:var(--brand);width:0}
#vig{position:absolute;inset:0;z-index:7;pointer-events:none;
  background:radial-gradient(ellipse at 50% 46%,transparent 58%,rgba(120,80,40,.12) 100%)}
#grain{position:absolute;top:-50%;left:-50%;width:200%;height:200%;z-index:7;pointer-events:none;
  opacity:.026;mix-blend-mode:multiply;background-size:300px 300px;will-change:transform;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")}
#flash{position:absolute;inset:0;z-index:7;pointer-events:none;background:#fff;opacity:0}
.lb{position:absolute;left:0;right:0;background:#1b120a;z-index:9}
.lb.t{top:0}.lb.b{bottom:0}
</style></head><body>
<div id="stage">
  <div id="world">
    <div class="obj type" id="t-title">
      <div class="display l1">Six jobs.</div>
      <div class="l2">Every salon. Every single day.</div>
    </div>
    ${cardEls}
    <div class="obj type" id="t-most">
      <div class="display l1">Six different</div>
      <div class="display l2">places.</div>
    </div>
    <div class="obj" id="one"><span class="nm">Kairo</span><span class="sb">all six &middot; one login</span></div>
    <div class="obj" id="shotwrap">
      ${win(crop("01-dashboard.jpg", { ...SW, x: 232, y: 118, cw: 958, ch: 300 },
            { displayW: 1000, label: "film/dashboard" }), "luxehairstudio.kairo.app")}
      <div class="cap">Real software. A Melbourne salon, since day one.</div>
    </div>
    <div class="obj type" id="t-price">
      <div class="display l1">$400</div>
      <div class="l2">Once. Then nothing, every month.</div>
    </div>
    <div class="obj" id="cta">
      <div class="k">The next step</div>
      <div class="m">DM me the word <b>Diary</b></div>
    </div>
  </div>

  <div id="head">
    <div class="mk">${markSvg(40)}<span class="wm">Kairo</span></div>
    <span class="pl">Melbourne</span>
  </div>
  <div id="bar"><div id="barfill"></div></div>
  <div id="vig"></div><div id="grain"></div><div id="flash"></div>
  <div class="lb t"></div><div class="lb b"></div>
</div>
<script>
const D = ${duration};
const L = ${JSON.stringify(L)};
const CARDS = ${JSON.stringify(CARDS)};
const KEYS = ${JSON.stringify(KEYS)};
const PERSP = 1500;

const cl = (v,a=0,b=1) => v < a ? a : v > b ? b : v;
const mix = (a,b,p) => a + (b-a)*p;
// Smootherstep: zero velocity AND zero acceleration at both ends, so the
// camera eases between framings without a visible start or stop.
const ss = (p) => { const x = cl(p); return x*x*x*(x*(x*6-15)+10); };

const world = document.getElementById("world");
const cards = [...document.querySelectorAll(".card")];
const objs  = [...document.querySelectorAll(".obj")];

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

window.setFrame = (t) => {
  const c = camera(t);
  world.style.transform =
    "rotateZ(" + (-c.roll) + "deg) rotateX(" + (-c.pitch) + "deg) rotateY(" + (-c.yaw) + "deg) " +
    "translate3d(" + (-c.cx).toFixed(2) + "px," + (-c.cy).toFixed(2) + "px," + (-c.cz).toFixed(2) + "px)";

  document.getElementById("barfill").style.width = (cl(t/D)*100) + "%";

  // Grain jitters on a fixed sequence so the render stays reproducible.
  const f = Math.round(t*30);
  document.getElementById("grain").style.transform =
    "translate(" + (((f*73)%211)-105) + "px," + (((f*149)%197)-98) + "px)";

  // Letterbox opens at the head and closes at the tail.
  const lbH = mix(110,0,ss(t/1.1)) + mix(0,110,ss((t-(D-1.0))/1.0));
  document.querySelectorAll(".lb").forEach(b => b.style.height = lbH.toFixed(1)+"px");

  // A white bloom on the reveal — one flash, where the film turns.
  const fl = Math.max(
    ss((t-(L.kairo.start-0.16))/0.12) * (1-ss((t-(L.kairo.start-0.04))/0.5)),
    0);
  document.getElementById("flash").style.opacity = (fl*0.5).toFixed(3);

  // --- world objects --------------------------------------------------
  const scatter = ss((t - L.most.start) / 1.5);          // tidy -> mess
  const pull    = ss((t - (L.kairo.start-0.5)) / 0.85);  // mess -> gone

  cards.forEach((el,i) => {
    const [ , , x, y, z] = CARDS[i];
    const born = vis(t, L[["j1","j2","j3","j4","j5","j6"][i]].start - 0.18, 0.42, null, 1);
    const rot  = [-7,6,-5,9,-11,7][i] * scatter * (1-pull);
    const dx   = [40,-44,-10,34,48,-30][i] * scatter;
    const dy   = [-26,18,32,-24,16,-20][i] * scatter;
    // Everything is dragged to the middle just before the reveal.
    const cxp = mix(0, -x, pull), cyp = mix(0, -y, pull);
    const sc  = mix(1, 0.34, pull);
    el.style.opacity = (born * (1-ss((t-(L.kairo.start-0.42))/0.42))).toFixed(3);
    el.style.transform =
      "translate3d(" + (x+dx+cxp).toFixed(1) + "px," + (y+dy+cyp).toFixed(1) + "px," + z + "px)" +
      " rotateZ(" + rot.toFixed(2) + "deg) scale(" + sc.toFixed(3) + ")";
    el.style.borderColor = scatter > 0.25 ? "rgba(234,88,12,.5)" : "rgba(24,24,27,.14)";
    el.querySelector(".job").style.opacity  = (1-scatter).toFixed(3);
    el.querySelector(".tool").style.opacity = scatter.toFixed(3);
  });

  const set = (el, o, x, y, z, extra) => {
    el.style.opacity = o.toFixed(3);
    el.style.transform = "translate3d("+x+"px,"+y+"px,"+z+"px)" + (extra||"");
  };
  set(document.getElementById("t-title"),
      vis(t, 0.1, 0.9, L.everyday.end + 0.35, 0.7), 0, 0, -1240);
  set(document.getElementById("t-most"),
      vis(t, L.most.start - 0.1, 0.55, L.kairo.start - 0.5, 0.45), 0, 0, -1500);
  set(document.getElementById("one"),
      vis(t, L.kairo.start - 0.08, 0.34, L.real.start - 0.35, 0.45), 0, 0, -2500,
      " scale(" + mix(0.55, 1, ss((t-(L.kairo.start-0.08))/0.7)).toFixed(3) + ")");
  set(document.getElementById("shotwrap"),
      vis(t, L.real.start - 0.25, 0.5, L.price.start - 0.45, 0.45), 0, 40, -2060,
      " scale(" + mix(0.94, 1.0, ss((t-(L.real.start-0.25))/1.6)).toFixed(3) + ")");
  set(document.getElementById("t-price"),
      vis(t, L.price.start - 0.2, 0.45, null, 1), 0, 0, -1460);
  set(document.getElementById("cta"),
      vis(t, L.nothing.start - 0.1, 0.5, null, 1), 0, 0, -1460);

  // --- depth of field, from real distance to the camera ----------------
  objs.forEach((el) => {
    const m = /translate3d\\([^,]+,[^,]+,\\s*(-?[\\d.]+)px\\)/.exec(el.style.transform || "");
    if (!m) return;
    const za = parseFloat(m[1]) - c.cz;      // final z; 0 is life size
    const blur = cl(Math.abs(za - 110) / 230, 0, 8);
    el.style.filter = blur > 0.25 ? "blur(" + blur.toFixed(2) + "px)" : "none";
  });
};
window.setFrame(0);
</script></body></html>`;

audit(id);
