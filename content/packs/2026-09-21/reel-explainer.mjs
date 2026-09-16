/**
 * REEL — "A salon does six jobs a day."
 *
 * The simplest possible explanation of what Kairo is, built for someone who has
 * never heard of it and is not paying attention. Six jobs, six tools, one app.
 *
 * DELIBERATE THEME DEPARTURE. Every other asset uses the dark blueprint theme,
 * sampled from the product so the cards match the software (see CLAUDE.md).
 * The operator asked for a colour change for this one. Warm cream ground with
 * near-black ink is the most legible combination available and it stands out
 * against a feed that is mostly dark video — but Kairo's blue is still the only
 * accent doing work, so it reads as the same company rather than a different
 * one. The orange appears once, on the mess, and never on the product.
 *
 * The whole middle of the film is one continuous transformation rather than a
 * sequence of cuts: six tiles arrive, scatter into disorder, then collapse into
 * a single card. That collapse is the idea. Everything else is labelling.
 */
import { CSS, fontFace, markSvg } from "../../../tools/render-cards.mjs";
import { RUNTIME, REEL_CSS, reelChrome, scene } from "../../../tools/reel-lib.mjs";
import { SW, crop, win, audit } from "../../../tools/media.mjs";

export const id = "reel-explainer";
export const fps = 30;
export const duration = 27.0;
/** Flat cream plus grain is bitrate-hungry; 20 halves the file and looks the same. */
export const crf = 20;

/** job label, the thing most salons use instead, scatter offset + rotation */
const TILES = [
  ["Take bookings",      "A paper diary",     44, -30, -7 ],
  ["Remember clients",   "A spreadsheet",    -46,  20,  6 ],
  ["Take the money",     "A card machine",    -8,  34, -5 ],
  ["Send reminders",     "Texting by hand",   34, -26,  9 ],
  ["Fill the gaps",      "Hoping",            50,  18, -11],
  ["Never double-book",  "Memory",           -32, -20,  7 ],
];

const tileEls = TILES.map(([job, tool], i) => `
  <div class="tile" data-i="${i}">
    <span class="tnum">0${i + 1}</span>
    <span class="tlab job">${job}</span>
    <span class="tlab tool">${tool}</span>
  </div>`).join("");

const S = [
  { t0: 0, t1: 2.6, kind: "rack", body: `
      <h1 class="display big">A salon<br>does six jobs<br>a day.</h1>
      <p class="sub stag">Every single day.</p>` },

  // One continuous 16-second transformation.
  { t0: 2.6, t1: 18.6, kind: "rise", din: 0.4, dout: 0.42, body: `
      <div class="heads">
        <h2 class="display mid h h1">Here they are.</h2>
        <h2 class="display mid h h2">Most salons do them<br><span class="warm">in six different places.</span></h2>
        <h2 class="display mid h h3">Kairo is <span class="blue">one</span>.</h2>
      </div>
      <div class="field">${tileEls}
        <div class="one"><div class="onemark">${markSvg(64)}</div><span>Kairo</span>
      <em>all six jobs, one login</em></div>
      </div>` },

  { t0: 18.6, t1: 22.8, kind: "scale", body: `
      <h2 class="display mid">And it&rsquo;s real<br>software.</h2>
      <div class="vis" style="margin-top:34px">
        ${win(crop("01-dashboard.jpg", { ...SW, x: 232, y: 118, cw: 958, ch: 152 },
              { displayW: 952, label: "explainer/dashboard" }), "luxehairstudio.kairo.app")}
        <span class="sweep"></span>
      </div>
      <p class="sub" style="margin-top:30px">Running a Melbourne salon since day one.</p>` },

  { t0: 22.8, t1: duration, kind: "rise", body: `
      <h2 class="display big">$400<br>once.</h2>
      <p class="sub" style="margin-top:22px">Then nothing, every month.</p>
      <div class="cta2">
        <span class="chrome-b">The next step</span>
        <p class="display" style="font-size:56px;margin-top:14px">DM me the<br>word <span class="blue">Diary</span></p>
      </div>` },
];

export const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFace()}${CSS}${REEL_CSS}

/* --- the theme change ------------------------------------------------- */
:root{
  --ground:#FFF7ED;          /* warm cream, not white: whites clip on phones */
  --raised:#FFFFFF;
  --ink:24 24 27;
  --brand:#2563EB;           /* one step deeper than the product blue, which
                                needs the extra weight to hold on cream */
  --warm:#EA580C;            /* used once, on the mess, never on the product */
}
#stage{background:var(--ground)}
.grid-bg{background-image:
  linear-gradient(rgb(var(--ink)/.05) 1px,transparent 1px),
  linear-gradient(90deg,rgb(var(--ink)/.05) 1px,transparent 1px)}
#glow{background:radial-gradient(circle,rgba(37,99,235,.13),transparent 62%)}
/* The dark-theme grade and vignette both crush a bright frame. Soften. */
#vignette{background:radial-gradient(ellipse at 50% 46%,transparent 68%,rgba(120,80,40,.07) 100%)}
#grade{display:none}
#grain{opacity:.022;mix-blend-mode:multiply}
#leak{background:radial-gradient(ellipse at 78% 22%,rgba(37,99,235,.28),transparent 58%)}
.mark .wm{color:rgb(var(--ink))}

.scene{padding:300px 64px 440px}
.big{font-size:118px}
.mid{font-size:74px}
.sub{font-size:36px;line-height:1.35;color:rgb(var(--ink)/.6);margin-top:32px;max-width:22ch}
.blue{color:var(--brand)}
.warm{color:var(--warm)}
.chrome,.chrome-b{font-size:24px}
.cta2{border:3px solid var(--brand);background:rgba(37,99,235,.08);padding:34px 38px;margin-top:46px}

/* --- the tile field --------------------------------------------------- */
.heads{position:relative;height:230px}
.h{position:absolute;top:0;left:0;opacity:0}
.field{position:relative;height:640px;margin-top:22px}
.tile{position:absolute;width:440px;height:176px;box-sizing:border-box;
  border:3px solid rgb(var(--ink)/.16);background:#fff;border-radius:6px;
  padding:26px 28px;display:flex;flex-direction:column;justify-content:space-between;
  box-shadow:0 18px 34px -22px rgba(60,40,20,.4);will-change:transform,opacity}
.tnum{font-family:'JetBrains Mono',monospace;font-size:19px;letter-spacing:.12em;
  color:var(--brand)}
.tlab{font-size:31px;font-weight:800;letter-spacing:-.01em;line-height:1.1}
.tlab.tool{position:absolute;left:28px;right:28px;bottom:26px;opacity:0;color:var(--warm)}
.one{position:absolute;left:50%;top:50%;width:660px;height:300px;margin:-150px 0 0 -330px;
  border:4px solid var(--brand);background:var(--brand);border-radius:10px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;
  color:#fff;opacity:0;box-shadow:0 30px 60px -28px rgba(37,99,235,.7);will-change:transform,opacity}
.one span{font-size:62px;font-weight:800;letter-spacing:-.02em}
.one em{font-style:normal;font-family:'JetBrains Mono',monospace;font-size:21px;
  text-transform:uppercase;letter-spacing:.14em;color:rgba(255,255,255,.72)}
.onemark svg{width:64px;height:64px}
</style></head><body>
<div id="stage">${reelChrome(markSvg(42))}${S.map(scene).join("")}</div>
<script>
window.__D = ${duration};
${RUNTIME}

// --- the transformation, layered on top of the generic scene runner -----
const TILE = ${JSON.stringify(TILES.map(([, , dx, dy, r]) => ({ dx, dy, r })))};
const COLS = [0, 464], ROWS = [0, 212, 424];
const tiles = [...document.querySelectorAll(".tile")];
const heads = { h1: document.querySelector(".h1"), h2: document.querySelector(".h2"), h3: document.querySelector(".h3") };
const one = document.querySelector(".one");
const clamp = (v) => v < 0 ? 0 : v > 1 ? 1 : v;
const mix = (a, b, p) => a + (b - a) * p;
const ease2 = (p) => 1 - Math.pow(1 - clamp(p), 3);
// Slight overshoot on the collapse: the tiles arrive like they were pulled.
const back = (p) => { const c = 1.70158, s = c + 1; const x = clamp(p);
  return 1 + s * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };

const T_IN = 2.9, T_EACH = 0.72;                 // tiles arrive one at a time
const T_SCATTER = 8.6, T_PULL = 13.4, T_ONE = 14.6;

const baseSetFrame = window.setFrame;
window.setFrame = (t) => {
  baseSetFrame(t);

  // headlines: "here they are" -> "six different places" -> "Kairo is one"
  const hv = (el, a, b) => { if (el) el.style.opacity =
    (clamp((t - a) / 0.45) * (1 - clamp((t - b) / 0.4))).toFixed(3); };
  hv(heads.h1, 2.9, 8.2);
  hv(heads.h2, 8.7, 13.1);
  hv(heads.h3, 13.9, 18.4);

  tiles.forEach((el, i) => {
    const appear = ease2((t - (T_IN + i * T_EACH)) / 0.5);
    const scat = ease2((t - (T_SCATTER + i * 0.06)) / 0.9);
    const pull = back((t - (T_PULL + i * 0.045)) / 0.95);
    const gone = clamp((t - (T_ONE - 0.15)) / 0.35);

    const gx = COLS[i % 2], gy = ROWS[Math.floor(i / 2)];
    // grid -> scattered -> dragged to the centre of the field
    const cx = 232 - gx, cy = 232 - gy;
    const x = mix(0, TILE[i].dx, scat) + mix(0, cx, pull);
    const y = mix(0, TILE[i].dy, scat) + mix(0, cy, pull);
    const rot = mix(0, TILE[i].r, scat) * (1 - pull);
    const sc = mix(0.86, 1, appear) * mix(1, 0.42, pull);

    el.style.left = gx + "px";
    el.style.top = gy + "px";
    el.style.opacity = (appear * (1 - gone)).toFixed(3);
    el.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px) rotate("
      + rot.toFixed(2) + "deg) scale(" + sc.toFixed(3) + ")";
    el.style.borderColor = scat > 0.2 ? "rgba(234,88,12,.55)" : "rgba(24,24,27,.16)";
    const job = el.querySelector(".job"), tool = el.querySelector(".tool");
    if (job) job.style.opacity = (1 - scat).toFixed(3);
    if (tool) tool.style.opacity = scat.toFixed(3);
  });

  if (one) {
    const p = back((t - T_ONE) / 0.8);
    const out = clamp((t - 18.2) / 0.4);
    one.style.opacity = (clamp((t - T_ONE) / 0.3) * (1 - out)).toFixed(3);
    one.style.transform = "scale(" + mix(0.5, 1, p).toFixed(3) + ")";
  }
};
window.setFrame(0);
</script></body></html>`;

audit(id);
