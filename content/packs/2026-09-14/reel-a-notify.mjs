/**
 * REEL A — "She's turning up at one."
 * The notify moment, told as a small piece of drama. One feature, deep.
 *
 * Hook rule applied: the problem is on screen inside one second. No title card,
 * no "here's three things", no build-up. Researched 2026-09-06 — the technique
 * is well established; the engagement percentages floating around it are not,
 * so none are quoted here or anywhere in the pack.
 */
import { CSS, fontFace, markSvg } from "../../../tools/render-cards.mjs";
import { RUNTIME, REEL_CSS, reelChrome, scene } from "../../../tools/reel-lib.mjs";
import { SW, crop, win, audit } from "../../../tools/media.mjs";

export const id = "reel-a-notify";
export const fps = 30;
export const duration = 19.4;

const W = 952; // content width at 1080 - 2*64

const S = [
  { t0: 0, t1: 2.6, kind: "rack", body: `
      <h1 class="display" style="font-size:112px">She&rsquo;s turning<br>up at one.</h1>
      <p class="lede stag" style="font-size:38px;margin-top:40px;max-width:24ch">You moved it to half
        past. Three hours ago.</p>` },

  { t0: 2.6, t1: 5.6, kind: "whip", body: `
      <h2 class="display" style="font-size:98px">Every other<br>diary just&hellip;<br>moves it.</h2>
      <p class="lede stag" style="font-size:34px;margin-top:38px;max-width:26ch">No prompt. No record.
        Nothing that tells you later whether anyone was told.</p>` },

  { t0: 5.6, t1: 10.0, kind: "rack", body: `
      <span class="chrome-b">Kairo stops and asks</span>
      <h2 class="display" style="font-size:76px;margin-top:22px">One question,<br>every time.</h2>
      <div class="vis" style="margin-top:40px;width:562px;margin-left:auto;margin-right:auto">
        ${win(crop("07-notify-prompt.jpg", { ...SW, x: 404, y: 200, cw: 432, ch: 372 },
              { displayW: 560, label: "A/s3 notify modal" }), "&hellip;/calendar")}
        <span class="sweep"></span>
      </div>` },

  { t0: 10.0, t1: 13.4, kind: "push", body: `
      <h2 class="display" style="font-size:92px">
        <span class="stag" style="display:block">Email her.</span>
        <span class="stag" style="display:block">Text her.</span>
        <span class="stag" style="display:block">Both.</span>
        <span class="stag ink3" style="display:block">Or nothing.</span>
      </h2>
      <p class="bline stag">Only the channels she can actually receive, each showing the real
        address or number.</p>` },

  { t0: 13.4, t1: 16.2, kind: "scale", body: `
      <span class="chrome">And if you picked wrong</span>
      <h2 class="display" style="font-size:96px;margin-top:22px">Fifteen<br>seconds<br>to undo it.</h2>
      <p class="bline stag">The message is held back two minutes, so undo actually undoes.</p>` },

  { t0: 16.2, t1: duration, kind: "rise", body: `
      <h2 class="display" style="font-size:92px">$400 once.<br><span class="ink3">Then nothing,<br>every month.</span></h2>
      <div class="cta">
        <span class="chrome-b" style="font-size:22px">The next step</span>
        <p class="display" style="font-size:56px;margin-top:16px">DM me the<br>word <span class="brand">Diary</span></p>
      </div>` },
];

export const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFace()}${CSS}${REEL_CSS}
.ink3{color:rgb(var(--ink)/.34)}
</style></head><body>
<div id="stage">
  ${reelChrome(markSvg(42))}
  ${S.map(scene).join("")}
</div>
<script>window.__D=${duration};${RUNTIME}window.setFrame(0);</script>
</body></html>`;

audit(id);
