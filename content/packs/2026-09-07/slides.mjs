/**
 * Week of 2026-09-07 — the two still posts.
 *
 *  - single-payback : one light-theme card, built to be screenshotted and sent
 *                     to whoever else signs things. The arithmetic is left for
 *                     the reader to finish, because the only number Kairo can
 *                     honestly assert is its own.
 *  - p4-*           : the cost-of-delay carousel.
 *
 * Every product frame is a real screenshot from public/screenshots/, cropped,
 * never redrawn. 11-pos.jpg stays cropped above its tax row — it shows GST at
 * 8.5%, which is not an Australian rate. See HANDOVER.md.
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const cache = new Map();
const shot = (f) => {
  if (!cache.has(f)) cache.set(f, `data:image/jpeg;base64,${readFileSync(resolve(ROOT, "public/screenshots", f)).toString("base64")}`);
  return cache.get(f);
};
const crop = (file, { w, h, x, y, cw, ch }) =>
  `<div class="crop" style="--w:${w};--h:${h};--x:${x};--y:${y};--cw:${cw};--ch:${ch}"><img src="${shot(file)}" alt=""></div>`;
const win = (inner, url) => `<div class="win"><div class="win-bar">
  <span class="win-dot"></span><span class="win-dot"></span><span class="win-dot"></span>
  <span class="win-url">${url}</span></div>${inner}</div>`;

const SW = { w: 1240, h: 775 };

const swipe = `<span class="chrome">Swipe &rarr;</span>`;
const foot = (label, right = swipe) =>
  `<div><div class="rule-b"></div><span class="chrome" style="display:block;margin-top:15px">${label}</span></div>${right}`;

const ctaCard = (line) =>
  `<div class="panel" style="border-color:rgba(59,130,246,.5);background:rgba(59,130,246,.07);padding:38px 40px">
      <span class="chrome-b">The next step</span>
      <p class="display d-sm" style="margin-top:16px;font-size:44px">DM me the<br>word <span class="brand">Diary</span></p>
      <p class="body" style="margin-top:20px;font-size:23px">${line}</p>
    </div>`;

/* Light theme, straight off src/index.css :root. Used once, on purpose: a
   paper card in a dark grid is the thing a thumb stops on. */
const LIGHT = `
:root{--ground:#F7F8FB;--raised:#EDF0F5;--sunk:#E3E7EE;--ink:22 32 47}
.grid-bg{background-image:
  linear-gradient(rgb(var(--ink)/.07) 1px,transparent 1px),
  linear-gradient(90deg,rgb(var(--ink)/.07) 1px,transparent 1px)}
.glow{background:radial-gradient(circle,rgba(59,130,246,.14),transparent 62%)}
.mark .wm{color:rgb(var(--ink))}
`;

export const SLIDES = [
  // ===================================================================
  // POST 3 — one card, one sum, light
  // ===================================================================
  {
    id: "p3-payback",
    css: LIGHT,
    glow: `<div class="glow" style="top:-360px;right:-300px"></div>`,
    counter: "One card",
    body: `
      <span class="chrome">The whole calculation</span>
      <h1 class="display" style="font-size:92px;margin-top:28px">How many<br>visits is<br>$400 to you?</h1>

      <div style="margin-top:52px;border:1px solid rgb(var(--ink)/.26);background:rgb(var(--ink)/.03);padding:40px">
        <div style="display:flex;align-items:flex-end;gap:22px;flex-wrap:wrap">
          <span class="display" style="font-size:76px">$400</span>
          <span class="display ink3" style="font-size:60px;padding-bottom:6px">&divide;</span>
          <div style="flex:1;min-width:300px">
            <span class="chrome" style="display:block;margin-bottom:10px">Your average ticket</span>
            <div style="border:2px solid var(--brand);background:rgba(59,130,246,.08);
                height:92px;display:flex;align-items:center;padding:0 22px">
              <span class="display brand" style="font-size:54px">$</span>
              <span style="display:inline-block;width:4px;height:52px;background:var(--brand);
                margin-left:14px"></span>
            </div>
          </div>
        </div>
        <div style="margin-top:34px;border-top:1px solid rgb(var(--ink)/.14);padding-top:26px;
            display:flex;gap:26px;align-items:flex-start">
          <span class="display ink3" style="font-size:58px;line-height:.9">=</span>
          <p class="display" style="font-size:50px">The number of visits<br>before it&rsquo;s paid for.</p>
        </div>
      </div>

      <p class="body" style="margin-top:36px;font-size:26px">That&rsquo;s the whole sum. There
        isn&rsquo;t a monthly one to add to it, and there&rsquo;s no cut of what you charge.</p>`,
    foot: `<div><div class="rule-b"></div><span class="chrome" style="display:block;margin-top:15px">$400 once &middot; GST included</span></div><span class="chrome">DM &ldquo;Diary&rdquo;</span>`,
  },

  // ===================================================================
  // POST 4 — the cost of the week you don't change anything
  // ===================================================================
  {
    id: "p4-01-cover",
    glow: `<div class="glow" style="top:-330px;right:-260px"></div>`,
    counter: "01 / 06",
    body: `
      <span class="chrome">A week on the old setup</span>
      <h1 class="display" style="font-size:104px;margin-top:30px">Four things<br>that&rsquo;ll go<br>wrong in your<br>diary this week.</h1>
      <p class="lede" style="margin-top:32px;max-width:32ch">None of them are dramatic. That&rsquo;s
        exactly why they keep happening.</p>
      <div style="margin-top:46px">
        ${["Somebody gets booked over",
           "Somebody just doesn&rsquo;t turn up",
           "You move one and forget to say",
           "A regular quietly stops coming"]
          .map((t, i) => `<div style="display:flex;gap:20px;align-items:center;padding:17px 0;
             border-bottom:1px solid rgb(var(--ink)/.14)">
             <span class="chrome" style="color:var(--alert)">[0${i + 1}]</span>
             <span style="font-size:26px;color:rgb(var(--ink)/.62)">${t}</span></div>`).join("")}
      </div>`,
    foot: foot("The cost of waiting"),
  },
  {
    id: "p4-02-doublebooked",
    counter: "02 / 06",
    body: `
      <div class="rail-x" style="display:flex;gap:18px;align-items:center;margin-bottom:26px">
        <span class="chrome" style="color:var(--alert)">[01]</span>
        <span class="chrome">Somebody gets booked over</span>
      </div>
      <h2 class="display d-sm">Two names,<br>one chair,<br>one o&rsquo;clock.</h2>
      <div style="margin-top:32px">
        ${win(crop("04-calendar-day.jpg", { ...SW, x: 232, y: 150, cw: 772, ch: 452 }), "&hellip;/calendar")}
      </div>
      <p class="body" style="margin-top:28px">A column per person, and availability re-checked at the
        moment of confirming &mdash; so two people tapping at once still cannot double-book you.</p>`,
    foot: foot("The cost of waiting"),
  },
  {
    id: "p4-03-noshow",
    counter: "03 / 06",
    body: `
      <div style="display:flex;gap:18px;align-items:center;margin-bottom:26px">
        <span class="chrome" style="color:var(--alert)">[02]</span>
        <span class="chrome">Somebody just doesn&rsquo;t turn up</span>
      </div>
      <h2 class="display d-sm">And nobody<br>reminded her.</h2>
      <div style="margin-top:32px">
        <div class="win">${crop("14-messages.jpg", { ...SW, x: 232, y: 182, cw: 640, ch: 330 })}</div>
      </div>
      <p class="body" style="margin-top:28px">Confirmations when she books, a reminder the number of
        hours ahead you choose, and a review request after &mdash; every one of them logged, with what
        actually happened to it.</p>`,
    foot: foot("The cost of waiting"),
  },
  {
    id: "p4-04-moved",
    counter: "04 / 06",
    body: `
      <div style="display:flex;gap:18px;align-items:center;margin-bottom:26px">
        <span class="chrome" style="color:var(--alert)">[03]</span>
        <span class="chrome">You move one and forget to say</span>
      </div>
      <h2 class="display d-sm" style="line-height:.99">She turns up at one.<br>You moved it to half past.</h2>
      <div style="margin-top:30px;width:580px;margin-left:auto;margin-right:auto">
        <div class="win">${crop("07-notify-prompt.jpg", { ...SW, x: 404, y: 200, cw: 432, ch: 372 })}</div>
      </div>
      <p class="body" style="margin-top:28px">Kairo stops and asks: email her, text her, both, or
        nothing. Then fifteen seconds to undo it.</p>`,
    foot: foot("The cost of waiting"),
  },
  {
    id: "p4-05-drifted",
    counter: "05 / 06",
    body: `
      <div style="display:flex;gap:18px;align-items:center;margin-bottom:26px">
        <span class="chrome" style="color:var(--alert)">[04]</span>
        <span class="chrome">A regular quietly stops coming</span>
      </div>
      <h2 class="display d-sm">It knows when<br>she was last in.</h2>
      <div style="margin-top:32px">
        <div class="win">${crop("09-client-profile.jpg", { ...SW, x: 330, y: 218, cw: 580, ch: 258 })}</div>
      </div>
      <p class="body" style="margin-top:28px">Kairo builds the list &mdash; two or more past visits,
        nothing in eight weeks, nothing booked. You send the message. It&rsquo;s the cheapest
        booking you&rsquo;ll take all month.</p>`,
    foot: foot("The cost of waiting"),
  },
  {
    id: "p4-06-cta",
    glow: `<div class="glow" style="bottom:-380px;left:-300px"></div>`,
    counter: "06 / 06",
    body: `
      <h2 class="display" style="font-size:88px">None of that<br>is dramatic.<br><span class="ink3">It&rsquo;s just
        every week.</span></h2>
      <p class="lede" style="margin-top:32px;max-width:32ch">$400 once, GST included. Then nothing,
        every month.</p>
      <div style="margin-top:44px">${ctaCard("Tell me what this week looked like and I&rsquo;ll show you the same week in Kairo.")}</div>`,
    foot: foot("The cost of waiting", `<span class="chrome">Melbourne</span>`),
  },
];
