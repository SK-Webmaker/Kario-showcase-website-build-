#!/usr/bin/env node
/**
 * Motion vocabulary for Kairo Reels.
 *
 * Exported as a string of JavaScript that each reel spec inlines into its page,
 * because the animation runs inside the browser while the renderer steps
 * setFrame(t) from Node. Everything is a pure function of t, so a render is
 * deterministic: the same spec always produces the same video, and a slow
 * machine cannot drop a frame.
 *
 * The transitions are the standard cinematic set, done honestly rather than as
 * plugin presets: push-in (dolly), rack focus, whip pan with motion blur, wipe,
 * parallax depth, light sweep, and a speed ramp on the easing curve. Researched
 * 2026-09-06; the technique is well established, the engagement statistics
 * floating around it are not, so the technique is used and the numbers are not
 * quoted anywhere.
 */

export const RUNTIME = `
// --- easing -------------------------------------------------------------
// A real cubic-bezier solver rather than a polynomial that looks close. The
// site's signature curve is cubic-bezier(.66,0,.01,1): slow to leave, very fast
// through the middle, long settle. Reusing it is what makes the video feel like
// the same brand as the page.
function cubicBezier(x1, y1, x2, y2) {
  const A = (a, b) => 1 - 3 * b + 3 * a;
  const B = (a, b) => 3 * b - 6 * a;
  const C = (a) => 3 * a;
  const calc = (t, a, b) => ((A(a, b) * t + B(a, b)) * t + C(a)) * t;
  const slope = (t, a, b) => 3 * A(a, b) * t * t + 2 * B(a, b) * t + C(a);
  return function (x) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const d = slope(t, x1, x2);
      if (d === 0) break;
      const err = calc(t, x1, x2) - x;
      if (Math.abs(err) < 1e-6) break;
      t -= err / d;
    }
    return calc(t, y1, y2);
  };
}
const EASE  = cubicBezier(.66, 0, .01, 1);   // the brand curve
const SETTLE= cubicBezier(.16, 1, .3,  1);   // soft arrival
const LEAVE = cubicBezier(.55, 0, 1,  .45);  // accelerate out
const cl = (v) => v < 0 ? 0 : v > 1 ? 1 : v;
const lerp = (a, b, p) => a + (b - a) * p;

// --- scenes -------------------------------------------------------------
const SCENES = [...document.querySelectorAll(".scene")];

function applyScene(el, t) {
  const t0 = +el.dataset.t0, t1 = +el.dataset.t1;
  const dIn = +(el.dataset.din || 0.52), dOut = +(el.dataset.dout || 0.34);
  if (t < t0 - 0.02 || t >= t1) { el.style.opacity = "0"; el.style.visibility = "hidden"; return; }
  el.style.visibility = "visible";

  const pIn = cl((t - t0) / dIn);
  const pOut = cl((t - (t1 - dOut)) / dOut);
  const ei = EASE(pIn), es = SETTLE(pIn), eo = LEAVE(pOut);
  const life = cl((t - t0) / (t1 - t0));

  el.style.opacity = (cl(pIn * 1.9) * (1 - pOut)).toFixed(4);

  let tf = "", filt = "";
  switch (el.dataset.kind) {
    case "push":                       // dolly in from below, blur on arrival
      tf = \`translateY(\${(1 - es) * 150 - eo * 60}px) scale(\${lerp(1.10, 1, es)})\`;
      filt = \`blur(\${((1 - pIn) * 9 + pOut * 7).toFixed(2)}px)\`;
      break;
    case "whip":                       // horizontal whip pan, motion blurred
      tf = \`translateX(\${(1 - ei) * 420 - eo * 380}px)\`;
      filt = \`blur(\${(((1 - pIn) + pOut) * 13).toFixed(2)}px)\`;
      break;
    case "rack":                       // rack focus: out of focus, then sharp
      tf = \`scale(\${lerp(1.07, 1, es)})\`;
      filt = \`blur(\${((1 - es) * 26 + pOut * 10).toFixed(2)}px)\`;
      break;
    case "scale":                      // slow push-in, no blur
      tf = \`scale(\${lerp(1.16, 1, es)}) translateY(\${-eo * 40}px)\`;
      break;
    default:                           // rise
      tf = \`translateY(\${(1 - ei) * 78 - eo * 46}px)\`;
      filt = \`blur(\${(pOut * 5).toFixed(2)}px)\`;
  }
  el.style.transform = tf;
  el.style.filter = filt;

  // Staggered children: each line arrives a beat after the one above it.
  const stag = el.querySelectorAll(".stag");
  stag.forEach((c, i) => {
    const p = EASE(cl((t - t0 - i * 0.085) / 0.6));
    c.style.opacity = p.toFixed(3);
    c.style.transform = \`translateY(\${((1 - p) * 46).toFixed(1)}px)\`;
  });

  // Product frames keep drifting for the whole scene, so a still screenshot is
  // never actually still.
  const vis = el.querySelector(".vis");
  if (vis) vis.style.transform = \`scale(\${(1 + life * 0.035).toFixed(4)})\`;

  // A slow specular sweep across the product frame.
  const sweep = el.querySelector(".sweep");
  if (sweep) {
    const sp = cl((t - t0 - 0.35) / 1.5);
    sweep.style.transform = \`translateX(\${lerp(-130, 230, SETTLE(sp))}%) skewX(-18deg)\`;
    sweep.style.opacity = (Math.sin(Math.PI * sp) * 0.5).toFixed(3);
  }
}

// --- global furniture ----------------------------------------------------
function applyFurniture(t, D) {
  const fill = document.getElementById("barfill");
  if (fill) fill.style.width = (cl(t / D) * 100) + "%";

  // Letterbox bars breathe open at the top of the film and close at the end.
  const open = EASE(cl(t / 0.9));
  const close = EASE(cl((t - (D - 0.8)) / 0.8));
  const h = lerp(96, 0, open) + lerp(0, 96, close);
  const lb = document.querySelectorAll(".letterbox");
  lb.forEach((b) => { b.style.height = h.toFixed(1) + "px"; });

  // Background grid drifts slower than the content: parallax depth.
  const g = document.querySelector(".grid-bg");
  if (g) g.style.transform = \`translateY(\${(-t * 7).toFixed(1)}px) scale(1.05)\`;
  const gl = document.getElementById("glow");
  if (gl) gl.style.transform = \`translate(\${Math.sin(t * 0.5) * 40}px, \${Math.cos(t * 0.4) * 30}px)\`;
}

window.setFrame = (t) => {
  applyFurniture(t, window.__D);
  for (const el of SCENES) applyScene(el, t);
};
`;

/** Shared CSS for every reel: letterbox, vignette, sweep, safe areas. */
export const REEL_CSS = `
html,body{width:1080px;height:1920px}
#stage{position:relative;width:1080px;height:1920px;overflow:hidden;background:var(--ground)}
#stage .grid-bg{background-size:120px 120px;will-change:transform}
#glow{position:absolute;top:-380px;left:-240px;width:1300px;height:1300px;border-radius:50%;
  background:radial-gradient(circle,rgba(59,130,246,.20),transparent 62%);filter:blur(12px);
  will-change:transform}
/* A vignette is the cheapest thing that reads as "filmed" rather than "exported". */
#vignette{position:absolute;inset:0;pointer-events:none;z-index:6;
  background:radial-gradient(ellipse at 50% 42%,transparent 42%,rgba(0,0,0,.42) 100%)}
.letterbox{position:absolute;left:0;right:0;background:#000;z-index:7}
.letterbox.top{top:0}.letterbox.bot{bottom:0}
header{position:absolute;top:70px;left:64px;right:64px;display:flex;align-items:center;
  justify-content:space-between;z-index:5}
.mark .wm{font-size:34px}.mark svg{width:42px;height:42px}
#bar{position:absolute;top:156px;left:64px;right:64px;height:3px;
  background:rgb(var(--ink)/.16);z-index:5}
#barfill{height:100%;background:var(--brand);width:0}
/* Content lives between 12% and 66% of the frame. Instagram lays its caption,
   username and action rail over the bottom fifth and the right edge. */
.scene{position:absolute;inset:0;padding:236px 64px 470px;display:flex;flex-direction:column;
  justify-content:center;opacity:0;will-change:transform,opacity,filter}
.chrome,.chrome-b{font-size:24px}
.vis{will-change:transform;position:relative;overflow:hidden}
.sweep{position:absolute;top:-40%;left:0;width:34%;height:180%;pointer-events:none;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.13),transparent);
  will-change:transform,opacity}
.rhead{font-size:84px}
.bline{font-size:32px;margin-top:36px;max-width:28ch}
.cta{border:2px solid var(--brand);background:rgba(59,130,246,.10);padding:36px 40px;margin-top:48px}
.crop{background:transparent}
`;

/** The furniture every reel shares. */
export const reelChrome = (markSvg) => `
  <div class="grid-bg"></div>
  <div id="glow"></div>
  <header>
    <div class="mark">${markSvg}<span class="wm">Kairo</span></div>
    <span class="chrome" style="font-size:22px">Melbourne</span>
  </header>
  <div id="bar"><div id="barfill"></div></div>
  <div id="vignette"></div>
  <div class="letterbox top"></div>
  <div class="letterbox bot"></div>`;

/** Build one scene element. */
export const scene = (o) =>
  `<section class="scene" data-t0="${o.t0}" data-t1="${o.t1}" data-kind="${o.kind || "rise"}"${
    o.din ? ` data-din="${o.din}"` : ""}${o.dout ? ` data-dout="${o.dout}"` : ""}>${o.body}</section>`;
