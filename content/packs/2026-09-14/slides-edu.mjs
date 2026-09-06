/**
 * The two educational posts for the weekend.
 *
 * WHAT IS NOT HERE, AND WHY. The operator asked for facts about what Melbourne
 * salons and barbers lose on average to poor booking systems. There is no
 * citable figure for that. Every salon no-show number findable online comes
 * from a company selling booking software — Etisia, Boulevard, Bookeo, Bella,
 * Lutily — they disagree with each other (5-15%, 14%, 15%, 23%), and none is
 * Melbourne-specific or traceable to a primary source. Kairo is itself a
 * booking vendor, so repeating another vendor's self-serving number is the
 * fastest way to lose a reader who checks.
 *
 * So: one genuinely verified fact, read off the page rather than off a search
 * summary — IBISWorld's Australian market size — and then arithmetic the reader
 * finishes with their own numbers. Every figure on these slides is declared in
 * pack.json -> verified_figures with a source that resolves.
 */
import { audit } from "../../../tools/media.mjs";

const SRC = "IBISWorld, Hairdressing &amp; Beauty Services in Australia, 2026";

const foot = (label, right) =>
  `<div><div class="rule-b"></div><span class="chrome" style="display:block;margin-top:15px">${label}</span></div>${right}`;
const swipe = `<span class="chrome">Swipe &rarr;</span>`;

const LIGHT = `
:root{--ground:#F7F8FB;--raised:#EDF0F5;--sunk:#E3E7EE;--ink:22 32 47}
.grid-bg{background-image:
  linear-gradient(rgb(var(--ink)/.07) 1px,transparent 1px),
  linear-gradient(90deg,rgb(var(--ink)/.07) 1px,transparent 1px)}
.glow{background:radial-gradient(circle,rgba(59,130,246,.14),transparent 62%)}
`;

const cite = `<p class="chrome" style="margin-top:28px;text-transform:none;letter-spacing:.02em;
  font-size:15px;line-height:1.5">Source: ${SRC}</p>`;

export const SLIDES = [
  // ===================================================================
  // POST 6 — the market fact, and what it means
  // ===================================================================
  {
    id: "e1-01-cover",
    glow: `<div class="glow" style="top:-330px;right:-260px"></div>`,
    counter: "01 / 05",
    body: `
      <span class="chrome">Australian hairdressing &amp; beauty, 2026</span>
      <h1 class="display" style="font-size:120px;margin-top:28px">$12.5<br>billion.</h1>
      <h2 class="display ink3" style="font-size:78px;margin-top:22px">And it got<br>smaller<br>this year.</h2>
      <p class="lede" style="margin-top:32px;max-width:30ch">Which changes what a salon should
        actually be worrying about.</p>`,
    foot: foot("The maths of a flat market", swipe),
  },
  {
    id: "e1-02-numbers",
    counter: "02 / 05",
    body: `
      <h2 class="display d-sm">Three numbers<br>worth knowing.</h2>
      <div style="margin-top:44px">
        ${[
          ["$12.5bn", "what the industry is worth in Australia this year"],
          ["&minus;0.9%", "how much it moved in 2026 &mdash; down, not up"],
          ["1.8%", "average growth a year since 2021, before this year"],
        ].map(([n, l]) => `<div style="border-bottom:1px solid rgb(var(--ink)/.14);padding:26px 0">
            <div class="display brand" style="font-size:76px">${n}</div>
            <div class="body" style="font-size:24px;margin-top:8px">${l}</div>
          </div>`).join("")}
      </div>
      ${cite}`,
    foot: foot("The maths of a flat market", swipe),
  },
  {
    id: "e1-03-means",
    counter: "03 / 05",
    body: `
      <span class="chrome">What that means on your floor</span>
      <h2 class="display d-sm" style="margin-top:22px">In a market that<br>isn&rsquo;t growing,<br>you don&rsquo;t win by<br>adding clients.</h2>
      <p class="lede" style="margin-top:34px;max-width:32ch">You win by stopping the ones you already
        have from quietly leaking out the back.</p>
      <p class="body" style="margin-top:26px">Every chair that sits empty on a Thursday is revenue
        that cannot be sold again later. That is not a statistic, it is just how time works.</p>`,
    foot: foot("The maths of a flat market", swipe),
  },
  {
    id: "e1-04-leaks",
    counter: "04 / 05",
    body: `
      <h2 class="display d-sm">Four ways they<br>leak out.</h2>
      <div style="margin-top:38px">
        ${[
          ["She books, then forgets", "Nothing reminded her, so the chair sits empty and you find out at ten past."],
          ["You move it and don&rsquo;t say", "She turns up at the old time. Now it&rsquo;s an apology instead of a service."],
          ["She tried to book at 9pm", "You were closed, the phone rang out, and she booked somewhere that was open."],
          ["She just stopped coming", "Eight weeks, then twelve, and nothing anywhere told you it had happened."],
        ].map(([t, b], i) => `<div style="display:grid;grid-template-columns:62px 1fr;gap:18px;
            padding:20px 0;border-bottom:1px solid rgb(var(--ink)/.14)">
            <span class="chrome" style="color:var(--alert);padding-top:6px">[0${i + 1}]</span>
            <div><div style="font-size:25px;font-weight:700">${t}</div>
              <div class="body" style="font-size:21px;margin-top:6px">${b}</div></div>
          </div>`).join("")}
      </div>`,
    foot: foot("The maths of a flat market", swipe),
  },
  {
    id: "e1-05-cta",
    glow: `<div class="glow" style="bottom:-380px;left:-300px"></div>`,
    counter: "05 / 05",
    body: `
      <h2 class="display" style="font-size:80px">All four are<br>booking problems.<br><span class="ink3">All four have<br>the same fix.</span></h2>
      <p class="lede" style="margin-top:32px;max-width:32ch">Reminders that send themselves. A prompt
        that asks who to tell. A booking page open at 9pm. And a list of the regulars who drifted.</p>
      <div class="panel" style="margin-top:40px;border-color:rgba(59,130,246,.5);
          background:rgba(59,130,246,.07);padding:38px 40px">
        <span class="chrome-b">The next step</span>
        <p class="display" style="margin-top:16px;font-size:44px">DM me the<br>word <span class="brand">Diary</span></p>
        <p class="body" style="margin-top:20px;font-size:23px">$400 once, GST included. Then nothing,
          every month.</p>
      </div>`,
    foot: foot("The maths of a flat market", `<span class="chrome">Melbourne</span>`),
  },

  // ===================================================================
  // POST 7 — the arithmetic, on their own numbers
  // ===================================================================
  {
    id: "e2-your-number",
    css: LIGHT,
    glow: `<div class="glow" style="top:-350px;right:-290px"></div>`,
    counter: "One card",
    body: `
      <span class="chrome">The sum nobody actually does</span>
      <h1 class="display" style="font-size:82px;margin-top:24px">What did the<br>empty chairs<br>cost you<br>last week?</h1>

      <div style="margin-top:44px;border:1px solid rgb(var(--ink)/.26);background:rgb(var(--ink)/.03);
          padding:36px">
        ${[
          ["Chairs that sat empty last week", "no-shows, late cancels, gaps nobody filled"],
          ["&times;&nbsp; your average ticket", "whatever you actually charge, not an industry number"],
          ["&times;&nbsp; 50 weeks", "because it happens every week, not once"],
        ].map(([t, b]) => `<div style="display:flex;gap:20px;align-items:flex-start;
            padding:16px 0;border-bottom:1px solid rgb(var(--ink)/.14)">
            <span style="width:7px;height:7px;background:var(--brand);flex:none;margin-top:13px"></span>
            <div><div style="font-size:27px;font-weight:700">${t}</div>
              <div class="body" style="font-size:20px;margin-top:4px">${b}</div></div>
          </div>`).join("")}
        <div style="margin-top:26px;display:flex;align-items:center;gap:22px">
          <span class="display ink3" style="font-size:52px">=</span>
          <div style="flex:1;border:2px solid var(--brand);background:rgba(59,130,246,.08);
              height:88px;display:flex;align-items:center;padding:0 22px">
            <span class="display brand" style="font-size:50px">$</span>
            <span style="display:inline-block;width:4px;height:48px;background:var(--brand);
              margin-left:14px"></span>
          </div>
        </div>
      </div>

      <p class="body" style="margin-top:32px;font-size:25px">I&rsquo;m not going to quote you a
        no-show percentage. Every one I can find comes from a company selling booking software, and
        they don&rsquo;t agree with each other. Your own number is the only one worth having.</p>`,
    foot: `<div><div class="rule-b"></div><span class="chrome" style="display:block;margin-top:15px">$400 once &middot; GST included</span></div><span class="chrome">DM &ldquo;Diary&rdquo;</span>`,
  },
];

audit("2026-09-14 educational");
