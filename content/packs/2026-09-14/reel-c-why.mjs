/**
 * REEL C — "So why haven't you got it yet?"
 * The closer. Four objections, answered at speed, then the price.
 *
 * Direct-question hook, whip-pan cuts. Every answer is something the product
 * or the price already supports; no competitor's figures appear, only the
 * shape of their model, which is verifiable and does not go stale.
 */
import { CSS, fontFace, markSvg } from "../../../tools/render-cards.mjs";
import { RUNTIME, REEL_CSS, reelChrome, scene } from "../../../tools/reel-lib.mjs";
import { SW, crop, win, audit } from "../../../tools/media.mjs";

export const id = "reel-c-why";
export const fps = 30;
export const duration = 18.6;
const W = 952;

const obj = (q, a, sub) => `
  <span class="chrome" style="color:var(--alert)">${q}</span>
  <h2 class="display" style="font-size:88px;margin-top:22px">${a}</h2>
  <p class="bline stag" style="max-width:28ch">${sub}</p>`;

const S = [
  { t0: 0, t1: 2.8, kind: "rack", body: `
      <h1 class="display" style="font-size:110px">So why<br>haven&rsquo;t you<br>got it yet?</h1>
      <p class="lede stag" style="font-size:36px;margin-top:38px;max-width:24ch">Four reasons people
        give me. Here they are, answered.</p>` },

  { t0: 2.8, t1: 5.6, kind: "whip", body: obj("&ldquo;Too expensive&rdquo;",
      "$400.<br>Once.",
      "GST included. No subscription, no per-booking fee, no cut of what you charge.") },

  { t0: 5.6, t1: 8.4, kind: "whip", body: obj("&ldquo;Too much hassle&rdquo;",
      "Ten minutes<br>on the phone.",
      "Then your hours, team, menu and client list get moved across on my side.") },

  { t0: 8.4, t1: 11.6, kind: "whip", body: `
      <span class="chrome" style="color:var(--alert)">&ldquo;Never heard of it&rdquo;</span>
      <h2 class="display" style="font-size:74px;margin-top:20px">A Melbourne salon<br>has run on it<br>since day one.</h2>
      <div class="vis" style="margin-top:30px">
        ${win(crop("01-dashboard.jpg", { ...SW, x: 232, y: 118, cw: 958, ch: 152 },
              { displayW: W, label: "C/dashboard strip" }), "luxehairstudio.kairo.app")}
        <span class="sweep"></span>
      </div>` },

  { t0: 11.6, t1: 14.4, kind: "whip", body: obj("&ldquo;I&rsquo;ve already got something&rdquo;",
      "Then you know<br>what it costs<br>every month.",
      "This one costs nothing every month, because there isn&rsquo;t a monthly one.") },

  { t0: 14.4, t1: duration, kind: "scale", body: `
      <h2 class="display" style="font-size:86px">No trial<br>that expires.<br><span class="ink3">No catch.</span></h2>
      <div class="cta">
        <span class="chrome-b" style="font-size:22px">The next step</span>
        <p class="display" style="font-size:56px;margin-top:16px">DM me the<br>word <span class="brand">Diary</span></p>
      </div>` },
];

export const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFace()}${CSS}${REEL_CSS}
.ink3{color:rgb(var(--ink)/.34)}
</style></head><body>
<div id="stage">${reelChrome(markSvg(42))}${S.map(scene).join("")}</div>
<script>window.__D=${duration};${RUNTIME}window.setFrame(0);</script>
</body></html>`;

audit(id);
