/**
 * REEL B — "One Thursday."
 * A day arc, 7:04am to 9:15pm, one product frame per hour that matters.
 * Breadth reel: the answer to "what actually is this".
 *
 * Every crop is cut wide enough to sit at or near native resolution. Showing
 * more of the screen slightly smaller beats showing less of it blown up — the
 * source frames are 1240px and no encoder invents detail past that.
 */
import { CSS, fontFace, markSvg } from "../../../tools/render-cards.mjs";
import { RUNTIME, REEL_CSS, reelChrome, scene } from "../../../tools/reel-lib.mjs";
import { SW, BOOK, PHONE, crop, win, phone, audit } from "../../../tools/media.mjs";

export const id = "reel-b-thursday";
export const fps = 30;
export const duration = 23.2;

const W = 952;
const beat = (n, time, head, vis, line) => `
  <div style="display:flex;align-items:baseline;gap:22px;border-bottom:1px solid rgb(var(--ink)/.14);
      padding-bottom:16px;margin-bottom:30px">
    <span class="display brand" style="font-size:58px">${time}</span>
    <span class="chrome">${n}</span>
  </div>
  <h2 class="display" style="font-size:66px">${head}</h2>
  <div class="vis" style="margin-top:34px">${vis}<span class="sweep"></span></div>
  <p class="bline stag" style="max-width:32ch">${line}</p>`;

const S = [
  { t0: 0, t1: 2.7, kind: "rack", body: `
      <span class="chrome">One Thursday, start to finish</span>
      <h1 class="display" style="font-size:118px;margin-top:26px">Nobody&rsquo;s<br>in yet.</h1>
      <p class="lede stag" style="font-size:38px;margin-top:38px;max-width:24ch">The day is already
        answered.</p>` },

  { t0: 2.7, t1: 5.6, kind: "push", body: beat("The morning", "7:04",
      "Twelve booked.<br>Two hours free.",
      win(crop("01-dashboard.jpg", { ...SW, x: 232, y: 118, cw: 958, ch: 152 },
          { displayW: W, label: "B/dashboard strip" }), "luxehairstudio.kairo.app"),
      "Taken against expected, and who&rsquo;s in the chair right now.") },

  { t0: 5.6, t1: 8.6, kind: "scale", body: beat("The diary", "9:00",
      "A column<br>per person.",
      win(crop("04-calendar-day.jpg", { ...SW, x: 232, y: 150, cw: 960, ch: 468 },
          { displayW: W, label: "B/calendar" }), "&hellip;/calendar"),
      "Drag it to move it. It cannot be double-booked.") },

  { t0: 8.6, t1: 11.8, kind: "rack", body: beat("Plans change", "11:40",
      "It asks who<br>to tell.",
      `<div style="width:498px;margin:0 auto">${win(crop("07-notify-prompt.jpg",
          { ...SW, x: 404, y: 200, cw: 432, ch: 372 },
          { displayW: 498, label: "B/notify modal" }), "&hellip;/calendar")}</div>`,
      "Email, text, both or nothing &mdash; then fifteen seconds to undo it.") },

  { t0: 11.8, t1: 14.7, kind: "push", body: beat("Getting paid", "1:15",
      "Chair to bank,<br>no second app.",
      // ch stops at 232 so the crop never reaches the tax row: 11-pos.jpg
      // shows GST at 8.5%, and this audience charges 10%.
      win(crop("11-pos.jpg", { ...SW, x: 232, y: 40, cw: 958, ch: 232 },
          { displayW: W, label: "B/pos" }), "&hellip;/pos"),
      "Card, cash, or a pay-link she opens herself. The receipt sends itself.") },

  { t0: 14.7, t1: 17.6, kind: "scale", body: beat("Closed", "6:40",
      "She books<br>anyway.",
      win(crop("19-booking-services.jpg", { ...BOOK, x: 180, y: 14, cw: 900, ch: 372 },
          { displayW: W, label: "B/booking page" }), "luxehairstudio.com/book"),
      "Your own link, your name at the top, and only real openings offered.") },

  { t0: 17.6, t1: 20.2, kind: "rise", body: `
      <div style="display:flex;align-items:baseline;gap:22px;border-bottom:1px solid rgb(var(--ink)/.14);
          padding-bottom:16px;margin-bottom:28px">
        <span class="display brand" style="font-size:58px">9:15</span>
        <span class="chrome">On the couch</span>
      </div>
      <h2 class="display" style="font-size:62px">Same thing,<br>in your hand.</h2>
      <div class="vis" style="margin-top:28px;display:flex;justify-content:center">
        ${phone(crop("23-phone-dashboard.jpg", { ...PHONE, x: 0, y: 0, cw: 460, ch: 700 },
                { displayW: 452, label: "B/phone" }), 470)}
      </div>` },

  { t0: 20.2, t1: duration, kind: "rise", body: `
      <h2 class="display" style="font-size:86px">One day.<br>One login.<br><span class="ink3">$400 once.</span></h2>
      <div class="cta">
        <span class="chrome-b" style="font-size:22px">The next step</span>
        <p class="display" style="font-size:56px;margin-top:16px">DM me the<br>word <span class="brand">Diary</span></p>
      </div>` },
];

export const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFace()}${CSS}${REEL_CSS}
.scene{padding:256px 64px 548px}
.ink3{color:rgb(var(--ink)/.34)}
</style></head><body>
<div id="stage">${reelChrome(markSvg(42))}${S.map(scene).join("")}</div>
<script>window.__D=${duration};${RUNTIME}window.setFrame(0);</script>
</body></html>`;

audit(id);
