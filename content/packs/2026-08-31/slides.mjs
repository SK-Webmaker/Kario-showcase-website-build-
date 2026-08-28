/**
 * Week of 2026-08-31 — three carousels.
 *
 * Every product frame here is a real screenshot from public/screenshots/,
 * cropped, never redrawn. Crop boxes are in the source image's own pixels:
 * {x,y,cw,ch} against {w,h}. The numbers were read off the frames rather
 * than guessed, so if a screenshot is ever re-exported at a different size
 * these need re-reading, not scaling.
 *
 * Two frames are deliberately NOT used, and the reason is worth keeping:
 *  - 11-pos.jpg shows "GST (8.5%)". That is not an Australian rate, and this
 *    audience is Melbourne salon owners who charge 10%. It is cropped to the
 *    line items only, above the tax row.
 *  - 07-notify-prompt.jpg carries a US-format number, (555) 377-8810. The
 *    crop keeps the modal because the modal is the differentiator, but the
 *    demo data is worth fixing at source — see HANDOVER.md.
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const cache = new Map();
function shot(file) {
  if (!cache.has(file)) {
    const b64 = readFileSync(resolve(ROOT, "public/screenshots", file)).toString("base64");
    cache.set(file, `data:image/jpeg;base64,${b64}`);
  }
  return cache.get(file);
}

/** A cropped product screenshot. Box in the source image's own pixels. */
function crop(file, { w, h, x, y, cw, ch }) {
  return `<div class="crop" style="--w:${w};--h:${h};--x:${x};--y:${y};--cw:${cw};--ch:${ch}">
    <img src="${shot(file)}" alt=""></div>`;
}

/** Browser chrome around a crop, so a screenshot reads as software. */
function win(inner, url) {
  return `<div class="win"><div class="win-bar">
      <span class="win-dot"></span><span class="win-dot"></span><span class="win-dot"></span>
      <span class="win-url">${url}</span>
    </div>${inner}</div>`;
}

const SW = { w: 1240, h: 775 };      // every desktop frame
const BOOK = { w: 1240, h: 1126 };   // the public booking page

const swipe = `<span class="chrome">Swipe &rarr;</span>`;
const foot = (label, right = swipe) =>
  `<div><div class="rule-b"></div><span class="chrome" style="display:block;margin-top:15px">${label}</span></div>${right}`;

const glowTop = `<div class="glow" style="top:-330px;right:-260px"></div>`;
const glowBot = `<div class="glow" style="bottom:-380px;left:-300px"></div>`;

/** The repeated closing card. One CTA, one action, said the same way twice. */
function ctaCard(line) {
  return `<div class="panel" style="border-color:rgba(59,130,246,.5);background:rgba(59,130,246,.07);padding:38px 40px">
      <span class="chrome-b">The next step</span>
      <p class="display d-sm" style="margin-top:16px;font-size:44px">DM me the<br>word <span class="brand">DIARY</span></p>
      <p class="body" style="margin-top:20px;font-size:23px">${line}</p>
    </div>`;
}

export const SLIDES = [
  // =====================================================================
  // POST 1 — what Kairo is
  // =====================================================================
  {
    id: "p1-01-cover",
    glow: glowTop,
    counter: "01 / 06",
    body: `
      <span class="chrome">Melbourne &middot; Software for salons</span>
      <h1 class="display" style="font-size:118px;margin-top:32px">A salon<br>runs its<br>whole day<br>on this.</h1>
      <p class="lede" style="margin-top:32px;max-width:32ch">Bookings, payments and every message that goes
        out to a client. One login, on your own booking link.</p>
      <div style="margin-top:42px">
        ${win(crop("01-dashboard.jpg", { ...SW, x: 232, y: 118, cw: 958, ch: 152 }),
              "luxehairstudio.kairo.app")}
      </div>`,
    foot: foot("What Kairo is", swipe),
  },
  {
    id: "p1-02-replaces",
    counter: "02 / 06",
    body: `
      <h2 class="display d-md">One login<br>replaces</h2>
      <div style="margin-top:44px">
        ${[
          "the paper diary",
          "the phone tag",
          "the spreadsheet of client numbers",
          "the card machine that talks to nothing",
          "reminder texts sent by hand",
          "the second app for stock",
          "the review request you forget",
        ].map((t) => `<div style="display:flex;gap:20px;align-items:center;padding:19px 0;
              border-bottom:1px solid rgb(var(--ink)/.14)">
            <span class="chrome ink4" style="font-size:22px">&times;</span>
            <span style="font-size:29px;color:rgb(var(--ink)/.62)">${t}</span>
          </div>`).join("")}
        <div style="display:flex;gap:20px;align-items:center;padding:19px 0;
            border-bottom:1px solid rgba(59,130,246,.45)">
          <span class="chrome" style="font-size:22px;color:var(--brand)">&times;</span>
          <span style="font-size:29px;color:rgb(var(--ink))">the marketplace commission</span>
        </div>
      </div>
      <p class="body" style="margin-top:36px">All of it lands in one place that already knows your
        diary &mdash; so nothing has to be typed twice, and nothing gets remembered twice either.</p>`,
    foot: foot("What Kairo is"),
  },
  {
    id: "p1-03-morning",
    counter: "03 / 06",
    body: `
      <h2 class="display d-sm">You open it and<br>the day is<br>already answered.</h2>
      <div style="margin-top:32px">
        ${win(crop("01-dashboard.jpg", { ...SW, x: 232, y: 118, cw: 958, ch: 152 }),
              "luxehairstudio.kairo.app/dashboard")}
      </div>
      <div style="display:flex;gap:11px;margin-top:24px;flex-wrap:wrap">
        <span class="chip">12 booked</span><span class="chip">4 done</span>
        <span class="chip">2h free</span><span class="chip">Taken vs expected</span>
      </div>
      <div style="margin-top:34px">
        <span class="chrome-b">And the note you typed in June</span>
        <div class="panel" style="margin-top:13px;padding:0;overflow:hidden">
          ${crop("01-dashboard.jpg", { ...SW, x: 248, y: 341, cw: 858, ch: 64 })}
        </div>
      </div>
      <p class="body" style="margin-top:24px">Anything typed on a booking lands on her record as a
        dated line &mdash; so it surfaces by itself next time she&rsquo;s in.</p>`,
    foot: foot("What Kairo is"),
  },
  {
    id: "p1-04-diary",
    counter: "04 / 06",
    body: `
      <h2 class="display d-sm">A column per person.<br>It cannot be<br>double-booked.</h2>
      <div style="margin-top:34px">
        ${win(crop("04-calendar-day.jpg", { ...SW, x: 232, y: 150, cw: 772, ch: 486 }),
              "luxehairstudio.kairo.app/calendar")}
      </div>
      <div style="display:flex;gap:11px;margin-top:28px;flex-wrap:wrap">
        <span class="chip">Drag to reschedule</span><span class="chip">Block out time</span>
        <span class="chip">Online bookings marked</span>
      </div>`,
    foot: foot("What Kairo is"),
  },
  {
    id: "p1-05-shopfront",
    counter: "05 / 06",
    body: `
      <h2 class="display d-sm">Your own booking page.<br>Your name at the top.</h2>
      <div style="margin-top:34px">
        ${win(crop("19-booking-services.jpg", { ...BOOK, x: 300, y: 14, cw: 660, ch: 282 }),
              "luxehairstudio.com/book")}
      </div>
      <p class="body" style="margin-top:30px">Your services, your prices &mdash; fixed, or
        &ldquo;from&rdquo; for anything that varies with hair length. Only real openings are
        ever offered, and nobody else&rsquo;s salon is on the page.</p>`,
    foot: foot("What Kairo is"),
  },
  {
    id: "p1-06-cta",
    glow: glowBot,
    counter: "06 / 06",
    body: `
      <h2 class="display" style="font-size:96px;margin-top:20px">$400<br>once.<br><span class="ink3">Then
        nothing,<br>every month.</span></h2>
      <p class="lede" style="margin-top:34px;max-width:32ch">No subscription. No per-booking fee.
        No commission. Set up for how you actually work.</p>
      <div style="margin-top:44px">${ctaCard("I&rsquo;ll send you a walkthrough of the diary, set up for your salon &mdash; not a sales call.")}</div>`,
    foot: foot("What Kairo is", `<span class="chrome">Melbourne</span>`),
  },

  // =====================================================================
  // POST 2 — why choose Kairo
  // =====================================================================
  {
    id: "p2-01-cover",
    glow: glowTop,
    counter: "01 / 07",
    body: `
      <span class="chrome">The bit every other system gets wrong</span>
      <h1 class="display" style="font-size:104px;margin-top:30px">You moved<br>the booking.<br>Did anyone<br>tell her?</h1>
      <p class="lede" style="margin-top:32px;max-width:32ch">Move an appointment in most systems and it
        just&hellip; moves. No prompt, no record, and no way to know later whether
        anybody actually told her.</p>
      <div style="display:flex;gap:11px;margin-top:36px;flex-wrap:wrap">
        <span class="chip">She turns up at 1:00</span><span class="chip">You moved it to 1:30</span>
      </div>`,
    foot: foot("Why salons pick it"),
  },
  {
    id: "p2-02-notify",
    counter: "02 / 07",
    body: `
      <h2 class="display d-sm" style="line-height:.99">Email, text,<br>both, or nothing.</h2>
      <p class="body" style="margin-top:22px;max-width:34ch">Kairo stops and asks. Only the channels
        she can actually receive are offered.</p>
      <div style="margin-top:32px;width:600px;margin-left:auto;margin-right:auto">
        <div class="win">${crop("07-notify-prompt.jpg", { ...SW, x: 404, y: 200, cw: 432, ch: 372 })}</div>
      </div>
      <div style="display:flex;gap:11px;margin-top:30px;flex-wrap:wrap;justify-content:center">
        <span class="chip">Leads with the old time</span><span class="chip">15-second undo</span>
      </div>`,
    foot: foot("Why salons pick it"),
  },
  {
    id: "p2-03-directory",
    counter: "03 / 07",
    body: `
      <h2 class="display d-sm">Nobody else is<br>on your page.</h2>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:26px;margin-top:44px">
        <div class="panel" style="padding:28px 24px">
          <span class="chrome">A marketplace listing</span>
          <div style="margin-top:22px">
            <div style="border:1px solid rgb(var(--ink)/.26);padding:15px 16px;font-size:21px">Your salon</div>
            ${[1, 2, 3, 4].map(() => `<div style="border:1px solid rgb(var(--ink)/.14);padding:15px 16px;
                font-size:21px;color:rgb(var(--ink)/.34);margin-top:9px">Another salon</div>`).join("")}
          </div>
          <p class="body" style="font-size:20px;margin-top:22px;color:rgb(var(--ink)/.34)">
            She searched for you by name and landed on four of your competitors.</p>
        </div>
        <div class="panel" style="padding:28px 24px;border-color:rgba(59,130,246,.5);
            background:rgba(59,130,246,.07)">
          <span class="chrome-b">Your own link</span>
          <div style="margin-top:22px">
            <div style="border:1px solid var(--brand);background:rgba(59,130,246,.16);
              padding:15px 16px;font-size:21px">Your salon</div>
            <div style="height:186px;display:flex;align-items:center;justify-content:center">
              <span class="chrome" style="font-size:15px">&mdash; nothing else &mdash;</span>
            </div>
          </div>
          <p class="body" style="font-size:20px;margin-top:22px">Your name at the top, your
            services, and no cut of what you charge.</p>
        </div>
      </div>`,
    foot: foot("Why salons pick it"),
  },
  {
    id: "p2-04-doublebook",
    counter: "04 / 07",
    body: `
      <h2 class="display d-sm">Two people tapping<br>at once still can&rsquo;t<br>double-book you.</h2>
      <div style="margin-top:34px;display:grid;grid-template-columns:1fr 300px;gap:26px;align-items:start">
        <div class="win">${crop("04-calendar-day.jpg", { ...SW, x: 236, y: 240, cw: 468, ch: 336 })}</div>
        <div>
          <p class="body" style="font-size:22px">Availability is computed from real bookings, blocked
            time and each person&rsquo;s working hours &mdash; then re-checked at the moment of
            confirming.</p>
          <div style="margin-top:22px;display:flex;flex-direction:column;gap:9px">
            <span class="chip" style="text-align:center">Real openings only</span>
            <span class="chip" style="text-align:center">Blocked time hidden</span>
          </div>
        </div>
      </div>`,
    foot: foot("Why salons pick it"),
  },
  {
    id: "p2-05-onelogin",
    counter: "05 / 07",
    body: `
      <h2 class="display d-sm">One login.<br>Not six tabs.</h2>
      <div style="margin-top:36px;display:grid;grid-template-columns:264px 1fr;gap:32px;align-items:start">
        <div class="win" style="border-radius:2px">
          ${crop("01-dashboard.jpg", { ...SW, x: 0, y: 62, cw: 183, ch: 424 })}
        </div>
        <div>
          <p class="body">Diary, point of sale, client records, stock, every message and every
            review &mdash; the same system, on the desktop and in your apron pocket.</p>
          <div style="margin-top:26px">
            ${win(crop("11-pos.jpg", { ...SW, x: 490, y: 55, cw: 448, ch: 165 }), "&hellip;/pos")}
          </div>
          <p class="body" style="font-size:21px;margin-top:20px;color:rgb(var(--ink)/.34)">
            Card, cash, transfer, or a pay-link she opens on her own phone. The receipt sends
            itself when the payment lands.</p>
        </div>
      </div>`,
    foot: foot("Why salons pick it"),
  },
  {
    id: "p2-06-priceshape",
    glow: glowBot,
    counter: "06 / 07",
    body: `
      <h2 class="display d-sm">A monthly fee<br>never stops.<br>This one does.</h2>
      <div style="margin-top:54px">
        <span class="chrome">The usual shape</span>
        <div style="display:flex;gap:6px;margin-top:20px;align-items:flex-end;height:104px">
          ${Array.from({ length: 30 }, () => `<div style="flex:1;height:104px;
            background:rgb(var(--ink)/.16)"></div>`).join("")}
          <span class="chrome" style="margin-left:14px;font-size:22px;white-space:nowrap">&rarr;</span>
        </div>
        <p class="body" style="font-size:21px;margin-top:13px;color:rgb(var(--ink)/.34)">
          Every month, per location, for as long as you use it.</p>
      </div>
      <div style="margin-top:52px">
        <span class="chrome-b">Kairo</span>
        <div style="display:flex;gap:6px;margin-top:20px;align-items:flex-end;height:104px">
          <div style="width:104px;height:104px;background:var(--brand)"></div>
          <div style="flex:1;height:3px;background:rgb(var(--ink)/.14);margin-bottom:1px"></div>
        </div>
        <p class="body" style="font-size:21px;margin-top:13px">
          $400 once, and then the line goes flat. GST included.</p>
      </div>
      <div style="margin-top:52px;border-top:1px solid rgb(var(--ink)/.14);padding-top:26px">
        <p class="body">Year one, year two, year five &mdash; it&rsquo;s the same number, because
          there isn&rsquo;t a second one. The cost doesn&rsquo;t move when you have a good month.</p>
      </div>`,
    foot: foot("Why salons pick it"),
  },
  {
    id: "p2-07-cta",
    glow: glowBot,
    counter: "07 / 07",
    body: `
      <h2 class="display" style="font-size:84px">$400 once.<br><span class="ink3">Then nothing,<br>every month.</span></h2>
      <div style="margin-top:36px">
        ${[
          ["01", "Tell me about the business", "What you do, how many chairs, how you work now. Ten minutes on the phone."],
          ["02", "I set your Kairo up", "Your hours, your team, your menu and prices. Your client list imported."],
          ["03", "You open it on the floor", "The booking link goes live when you&rsquo;re ready, not before."],
        ].map(([n, t, b]) => `<div style="display:grid;grid-template-columns:64px 1fr;gap:18px;
            padding:18px 0;border-bottom:1px solid rgb(var(--ink)/.14)">
            <span class="chrome" style="padding-top:5px">[${n}]</span>
            <div><div style="font-size:25px;font-weight:700">${t}</div>
              <div class="body" style="font-size:20px;margin-top:5px">${b}</div></div>
          </div>`).join("")}
      </div>
      <div style="margin-top:44px">${ctaCard("Tell me what you run on now and I&rsquo;ll show you the same day in Kairo.")}</div>`,
    foot: foot("Why salons pick it", `<span class="chrome">Melbourne</span>`),
  },

  // =====================================================================
  // POST 3 — where's the catch
  // =====================================================================
  {
    id: "p3-01-cover",
    glow: glowTop,
    counter: "01 / 06",
    body: `
      <span class="chrome">The question I get most</span>
      <div style="margin-top:26px">
        <span class="display brand" style="font-size:150px;line-height:.7;display:block">&ldquo;</span>
        <h1 class="display" style="font-size:98px;margin-top:16px">$400 once?<br>Where&rsquo;s<br>the catch?</h1>
      </div>
      <p class="lede" style="margin-top:34px;max-width:32ch">Fair question, and the honest answer
        includes the parts that aren&rsquo;t flattering. Those are on slide four.</p>`,
    foot: foot("The price, straight"),
  },
  {
    id: "p3-02-noteatch",
    counter: "02 / 06",
    body: `
      <h2 class="display d-md">There<br>isn&rsquo;t one.</h2>
      <p class="lede" style="margin-top:34px;max-width:34ch;font-size:31px">The number is that shape
        because of how the thing is built.</p>
      <div style="margin-top:40px">
        ${[
          ["No marketplace to feed", "There&rsquo;s no directory, so there are no other salons for it to send your client to, and no cut to take for the introduction."],
          ["One instance, white-label", "You get your own Kairo on your own link, set up once. There&rsquo;s no per-seat tier and no per-location fee, because there&rsquo;s no shared platform to meter."],
          ["The work is the setup", "Getting your hours, team, menu and client list in is the job. It happens once, so it&rsquo;s charged once."],
        ].map(([t, b]) => `<div style="display:flex;gap:18px;padding:20px 0;
            border-bottom:1px solid rgb(var(--ink)/.14)">
            <span class="dot"></span>
            <div><div style="font-size:26px;font-weight:700">${t}</div>
              <div class="body" style="font-size:21px;margin-top:6px">${b}</div></div>
          </div>`).join("")}
      </div>`,
    foot: foot("The price, straight"),
  },
  {
    id: "p3-03-included",
    counter: "03 / 06",
    body: `
      <h2 class="display d-sm">What the<br>$400 covers.</h2>
      <div style="margin-top:40px">
        ${[
          "Your own Kairo, on your own booking link",
          "Bookings, calendar, clients, payments and stock",
          "Confirmations, reminders and review requests",
          "Unlimited team members and services",
          "Your data in a file that belongs to you",
          "Setup, and your existing client list imported",
        ].map((t) => `<div style="display:flex;gap:18px;align-items:flex-start;padding:22px 0;
            border-bottom:1px solid rgb(var(--ink)/.14)">
            <span class="dot"></span><span style="font-size:28px;line-height:1.3">${t}</span>
          </div>`).join("")}
      </div>
      <p class="body" style="margin-top:28px;font-size:22px">No tier that hides the useful half.
        No add-on that costs more than the software.</p>`,
    foot: foot("The price, straight"),
  },
  {
    id: "p3-04-wontdo",
    counter: "04 / 06",
    body: `
      <h2 class="display d-sm">And what it<br>won&rsquo;t do.</h2>
      <p class="body" style="margin-top:22px;max-width:36ch">Worth saying out loud, because you&rsquo;ll
        find out anyway.</p>
      <div style="margin-top:38px">
        ${[
          ["It won&rsquo;t bring you new clients", "There&rsquo;s no directory to be discovered in. Your link is yours to share &mdash; on your bio, your window, your card."],
          ["It isn&rsquo;t self-serve", "I set it up with you. That&rsquo;s about ten minutes on the phone and then the work happens on my side, not yours."],
          ["It isn&rsquo;t free", "$400, once. That&rsquo;s the whole number, GST included, and there isn&rsquo;t a second one."],
        ].map(([t, b]) => `<div style="display:flex;gap:18px;padding:22px 0;
            border-bottom:1px solid rgb(var(--ink)/.14)">
            <span style="width:7px;height:7px;background:rgb(var(--ink)/.34);flex:none;margin-top:14px"></span>
            <div><div style="font-size:26px;font-weight:700">${t}</div>
              <div class="body" style="font-size:21px;margin-top:6px">${b}</div></div>
          </div>`).join("")}
      </div>`,
    foot: foot("The price, straight"),
  },
  {
    id: "p3-05-proof",
    counter: "05 / 06",
    body: `
      <h2 class="display d-sm">Not a demo.</h2>
      <div style="margin-top:34px;display:grid;grid-template-columns:1fr 384px;gap:34px;align-items:center">
        <div>
          <p class="body" style="font-size:25px">A Melbourne salon has run its bookings, payments and
            customer emails on Kairo since day one.</p>
          <p class="body" style="font-size:22px;margin-top:22px;color:rgb(var(--ink)/.34)">
            Every screen in these posts is that same system, filled with invented clients so no real
            business&rsquo;s data appears anywhere.</p>
          <div style="margin-top:26px;display:flex;flex-direction:column;gap:9px;align-items:flex-start">
            <span class="chip">In production, not in beta</span>
            <span class="chip">One salon &mdash; and it&rsquo;s the one I&rsquo;d point you at</span>
          </div>
        </div>
        <div class="phone">${crop("23-phone-dashboard.jpg", { w: 460, h: 995, x: 0, y: 0, cw: 460, ch: 648 })}</div>
      </div>`,
    foot: foot("The price, straight"),
  },
  {
    id: "p3-06-cta",
    glow: glowBot,
    counter: "06 / 06",
    body: `
      <h2 class="display" style="font-size:88px;margin-top:14px">Still think<br>there&rsquo;s<br>a catch?</h2>
      <p class="lede" style="margin-top:32px;max-width:32ch">Ask me the awkward version of the question.
        I&rsquo;d rather answer it now than after you&rsquo;ve paid.</p>
      <div style="margin-top:44px">${ctaCard("No pitch deck, no trial that expires. Just the diary, running your week.")}</div>`,
    foot: foot("The price, straight", `<span class="chrome">$400 once &middot; GST included</span>`),
  },
];
