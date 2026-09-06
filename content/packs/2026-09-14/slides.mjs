/**
 * Week of 2026-09-14 — the two still posts.
 *
 *  - c1-* : "Six screens. One login." The static counterpart to Reel B, so the
 *           reel-vs-carousel comparison has a like-for-like arm carrying the
 *           same message rather than a different one.
 *  - s2-*  : one light card built to be screenshotted, with the notify modal
 *           as its hero.
 *
 * Cards now render at 1080x1350 with deviceScaleFactor 1 — native Instagram
 * delivery size. Combined with wider crops, every product frame here sits at or
 * near 1:1 instead of the 1.9x-2.7x blow-up that shipped last week.
 */
import { SW, BOOK, PHONE, crop, win, phone, audit } from "../../../tools/media.mjs";

const W = 936;                     // 1080 - 2 * 72 padding
const swipe = `<span class="chrome">Swipe &rarr;</span>`;
const foot = (label, right = swipe) =>
  `<div><div class="rule-b"></div><span class="chrome" style="display:block;margin-top:15px">${label}</span></div>${right}`;

const ctaCard = (line) =>
  `<div class="panel" style="border-color:rgba(59,130,246,.5);background:rgba(59,130,246,.07);padding:38px 40px">
      <span class="chrome-b">The next step</span>
      <p class="display" style="margin-top:16px;font-size:44px">DM me the<br>word <span class="brand">Diary</span></p>
      <p class="body" style="margin-top:20px;font-size:23px">${line}</p>
    </div>`;

const LIGHT = `
:root{--ground:#F7F8FB;--raised:#EDF0F5;--sunk:#E3E7EE;--ink:22 32 47}
.grid-bg{background-image:
  linear-gradient(rgb(var(--ink)/.07) 1px,transparent 1px),
  linear-gradient(90deg,rgb(var(--ink)/.07) 1px,transparent 1px)}
.glow{background:radial-gradient(circle,rgba(59,130,246,.14),transparent 62%)}
`;

/** One screen of the tour: number, name, headline, frame, one line. */
const screenSlide = (n, rail, head, vis, line) => ({
  id: `c1-0${n}-${rail.toLowerCase().replace(/[^a-z]+/g, "-")}`,
  counter: `0${n} / 07`,
  body: `
    <div style="display:flex;gap:18px;align-items:center;margin-bottom:24px">
      <span class="chrome-b">[0${n}]</span><span class="chrome">${rail}</span>
    </div>
    <h2 class="display d-sm">${head}</h2>
    <div style="margin-top:30px">${vis}</div>
    <p class="body" style="margin-top:26px">${line}</p>`,
  foot: foot("Six screens, one login"),
});

export const SLIDES = [
  {
    id: "c1-01-cover",
    glow: `<div class="glow" style="top:-330px;right:-260px"></div>`,
    counter: "01 / 07",
    body: `
      <span class="chrome">The whole workspace</span>
      <h1 class="display" style="font-size:106px;margin-top:28px">Six screens.<br>One login.<br>No tabs.</h1>
      <p class="lede" style="margin-top:32px;max-width:32ch">This is the actual software, not a
        mock-up. Swipe through the six screens a salon lives in.</p>
      <div style="margin-top:40px">
        ${win(crop("01-dashboard.jpg", { ...SW, x: 232, y: 118, cw: 958, ch: 152 },
              { displayW: W, label: "cover/dashboard strip" }), "luxehairstudio.kairo.app")}
      </div>`,
    foot: foot("Six screens, one login"),
  },

  screenSlide(2, "The morning", "The day, already<br>answered.",
    win(crop("01-dashboard.jpg", { ...SW, x: 232, y: 118, cw: 958, ch: 300 },
        { displayW: W, label: "c1/dashboard" }), "luxehairstudio.kairo.app/dashboard"),
    "Twelve booked, four done, two hours still free &mdash; and who&rsquo;s in the chair right now, re-derived from the clock every thirty seconds."),

  screenSlide(3, "The diary", "A column per person.<br>It cannot be<br>double-booked.",
    win(crop("04-calendar-day.jpg", { ...SW, x: 232, y: 150, cw: 960, ch: 468 },
        { displayW: W, label: "c1/calendar" }), "&hellip;/calendar"),
    "Drag to reschedule, drag the edge to make it longer, block out lunch with a private reason only you see."),

  screenSlide(4, "The client book", "Every visit.<br>Every note.",
    win(crop("09-client-profile.jpg", { ...SW, x: 200, y: 40, cw: 900, ch: 452 },
        { displayW: W, label: "c1/client profile" }), "&hellip;/clients"),
    "Anything typed on a booking lands on her record as a dated line, so the colour formula from June surfaces by itself in September."),

  screenSlide(5, "Getting paid", "Chair to bank,<br>without a<br>second app.",
    win(crop("11-pos.jpg", { ...SW, x: 232, y: 40, cw: 958, ch: 232 },
        { displayW: W, label: "c1/pos" }), "&hellip;/pos"),
    "Services, retail and custom lines. Card, cash, transfer, or a pay-link she opens on her own phone."),

  screenSlide(6, "The messages", "Confirmations and<br>reminders, sending<br>themselves.",
    win(crop("14-messages.jpg", { ...SW, x: 232, y: 155, cw: 958, ch: 330 },
        { displayW: W, label: "c1/messages" }), "&hellip;/messages"),
    "Every message, its channel, its status and exactly what happened to it. Nothing sends silently and nothing fails silently."),

  {
    id: "c1-07-cta",
    glow: `<div class="glow" style="bottom:-380px;left:-300px"></div>`,
    counter: "07 / 07",
    body: `
      <div style="display:flex;gap:18px;align-items:center;margin-bottom:24px">
        <span class="chrome-b">[07]</span><span class="chrome">In your pocket</span>
      </div>
      <h2 class="display d-sm">All of it,<br>on your phone.</h2>
      <div style="margin-top:28px;display:grid;grid-template-columns:1fr 470px;gap:34px;align-items:center">
        <div>
          <p class="body">The same full workspace, not a cut-down companion app. Installs to the home
            screen straight from the browser &mdash; no app store, no download.</p>
          <p class="body" style="margin-top:20px;font-size:23px;color:rgb(var(--ink)/.34)">
            $400 once, GST included. Then nothing, every month.</p>
        </div>
        ${phone(crop("23-phone-dashboard.jpg", { ...PHONE, x: 0, y: 0, cw: 460, ch: 540 },
                { displayW: 452, label: "c1/phone" }), 470)}
      </div>
      <div style="margin-top:36px">${ctaCard("Tell me which of these six you&rsquo;d use first.")}</div>`,
    foot: foot("Six screens, one login", `<span class="chrome">Melbourne</span>`),
  },

  // =====================================================================
  // The single card
  // =====================================================================
  {
    id: "s2-moves-it",
    css: LIGHT,
    glow: `<div class="glow" style="top:-340px;right:-280px"></div>`,
    counter: "One card",
    body: `
      <span class="chrome">The bit every other diary skips</span>
      <h1 class="display" style="font-size:88px;margin-top:26px">Every other<br>diary just&hellip;<br>moves it.</h1>
      <div style="margin-top:38px;width:500px;margin-left:auto;margin-right:auto">
        ${win(crop("07-notify-prompt.jpg", { ...SW, x: 404, y: 200, cw: 432, ch: 372 },
              { displayW: 498, label: "s2/notify modal" }), "&hellip;/calendar")}
      </div>
      <p class="body" style="margin-top:34px;font-size:26px">Move an appointment in Kairo and it stops
        to ask one question. Only the channels she can actually receive, each showing the real address
        or number &mdash; then fifteen seconds to undo it.</p>`,
    foot: `<div><div class="rule-b"></div><span class="chrome" style="display:block;margin-top:15px">$400 once &middot; GST included</span></div><span class="chrome">DM &ldquo;Diary&rdquo;</span>`,
  },
];

audit("2026-09-14 stills");
