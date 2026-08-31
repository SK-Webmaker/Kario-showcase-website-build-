/**
 * REEL 2 — "There's a right month to change your booking system."
 *
 * The urgency post. Every urgent claim here is either a date (checkable) or a
 * question about the reader's own calendar (asserts nothing). There is no
 * countdown, no spot count and no deadline, because none of those exist —
 * see HANDOVER.md for what was refused and why.
 */
import { CSS, fontFace, markSvg } from "../../../tools/render-cards.mjs";

export const id = "reel-timing";
export const fps = 30;
export const duration = 16.4;

const MONTHS = ["Sep", "Oct", "Nov", "Dec", "Jan"];

const scene = (k, inner) => `<section class="scene" data-k="${k}">${inner}</section>`;

export const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFace()}
${CSS}
html,body{width:1080px;height:1920px}
#stage{position:relative;width:1080px;height:1920px;overflow:hidden;background:var(--ground)}
#stage .grid-bg{background-size:120px 120px}
#glow{position:absolute;bottom:-460px;right:-280px;width:1300px;height:1300px;border-radius:50%;
  background:radial-gradient(circle,rgba(59,130,246,.20),transparent 62%);filter:blur(12px)}
header{position:absolute;top:64px;left:64px;right:64px;display:flex;align-items:center;
  justify-content:space-between;z-index:5}
.mark .wm{font-size:34px}.mark svg{width:42px;height:42px}
#bar{position:absolute;top:150px;left:64px;right:64px;height:3px;background:rgb(var(--ink)/.16);z-index:5}
#barfill{height:100%;background:var(--brand);width:0}
.scene{position:absolute;inset:0;padding:230px 64px 170px;display:flex;flex-direction:column;
  justify-content:center;opacity:0;will-change:transform,opacity}
.chrome,.chrome-b{font-size:24px}
.big{font-size:104px}
.mid{font-size:86px}
.sub{font-size:36px;line-height:1.4;color:rgb(var(--ink)/.62);max-width:24ch;margin-top:44px}
.strip{display:flex;gap:14px;margin-top:60px}
.mo{flex:1;border:1px solid rgb(var(--ink)/.26);padding:30px 0;text-align:center;
  font-family:'JetBrains Mono',monospace;font-size:30px;text-transform:uppercase;
  letter-spacing:.08em;color:rgb(var(--ink)/.34)}
.mo.here{border-color:var(--brand);background:rgba(59,130,246,.14);color:#fff}
.mo.busy{border-color:rgba(185,118,13,.6);background:rgba(185,118,13,.12);color:#e8b45c}
.tag{font-family:'JetBrains Mono',monospace;font-size:22px;text-transform:uppercase;
  letter-spacing:.12em;margin-top:20px;display:block}
.cta{border:2px solid var(--brand);background:rgba(59,130,246,.10);padding:38px 42px;margin-top:56px}
.step{display:grid;grid-template-columns:86px 1fr;gap:22px;padding:26px 0;
  border-bottom:1px solid rgb(var(--ink)/.14)}
.step .t{font-size:34px;font-weight:700}
.step .b{font-size:26px;color:rgb(var(--ink)/.62);margin-top:8px}
</style></head><body>
<div id="stage">
  <div class="grid-bg"></div><div id="glow"></div>
  <header>
    <div class="mark">${markSvg(42)}<span class="wm">Kairo</span></div>
    <span class="chrome" style="font-size:22px">Melbourne</span>
  </header>
  <div id="bar"><div id="barfill"></div></div>

  ${scene("s1", `
    <span class="chrome">A question about your calendar</span>
    <h1 class="display big" style="margin-top:34px">There&rsquo;s a<br>right month<br>to change your<br>booking system.</h1>`)}

  ${scene("s2", `
    <h2 class="display big">It isn&rsquo;t<br>the busy one.</h2>
    <p class="sub">Nobody wants to be learning where the buttons are in the middle of their
      hardest week.</p>`)}

  ${scene("s3", `
    <h2 class="display mid">Count back<br>three months<br>from your<br>busiest week.</h2>
    <div class="strip">
      ${MONTHS.map((m, i) => `<div class="mo ${i === 0 ? "here" : ""}">${m}</div>`).join("")}
    </div>
    <span class="tag brand">&uarr; you are here &mdash; wherever your busy weeks fall</span>`)}

  ${scene("s4", `
    <h2 class="display mid">So the window<br>is about now.</h2>
    <div style="margin-top:52px">
      ${[["01", "Ten minutes on the phone", "What you do, how many chairs, how you work now."],
         ["02", "I set it up", "Your hours, your team, your menu. Your client list imported."],
         ["03", "You open it on the floor", "The booking link goes live when you&rsquo;re ready."]]
        .map(([n, t, b]) => `<div class="step"><span class="chrome" style="padding-top:8px">[${n}]</span>
          <div><div class="t">${t}</div><div class="b">${b}</div></div></div>`).join("")}
    </div>`)}

  ${scene("end", `
    <h2 class="display big">$400 once.<br><span class="ink3">Then nothing,<br>every month.</span></h2>
    <div class="cta">
      <span class="chrome-b" style="font-size:22px">The next step</span>
      <p class="display" style="font-size:58px;margin-top:18px">DM me the<br>word <span class="brand">Diary</span></p>
    </div>`)}
</div>
<script>
const D = ${duration};
const SC = [
  { k: "s1",  t0: 0,    t1: 3.4 },
  { k: "s2",  t0: 3.4,  t1: 6.4 },
  { k: "s3",  t0: 6.4,  t1: 10.0 },
  { k: "s4",  t0: 10.0, t1: 13.2 },
  { k: "end", t0: 13.2, t1: ${duration} }
];
const els = {};
document.querySelectorAll(".scene").forEach(s => els[s.dataset.k] = s);
const cl = (v) => v < 0 ? 0 : v > 1 ? 1 : v;
const ease = (p) => 1 - Math.pow(1 - cl(p), 4);

window.setFrame = (t) => {
  document.getElementById("barfill").style.width = (cl(t / D) * 100) + "%";
  for (const s of SC) {
    const el = els[s.k];
    if (!el) continue;
    const IN = 0.34, OUT = 0.26;
    if (t < s.t0 - 0.05 || t >= s.t1) { el.style.opacity = 0; continue; }
    const inP = ease((t - s.t0) / IN);
    const outP = cl((t - (s.t1 - OUT)) / OUT);
    el.style.opacity = (inP * (1 - outP)).toFixed(4);
    el.style.transform = "translateY(" + ((1 - inP) * 46 - outP * 30).toFixed(2) + "px)";
  }
  // The month strip fills in one cell at a time, so the argument builds
  // rather than arriving all at once.
  const s3 = els["s3"];
  if (s3) {
    const p = cl((t - 6.9) / 2.2);
    s3.querySelectorAll(".mo").forEach((m, i) => {
      const on = cl(p * 5 - i);
      m.style.opacity = (0.15 + 0.85 * on).toFixed(3);
      m.style.transform = "translateY(" + ((1 - on) * 16).toFixed(1) + "px)";
    });
    const tag = s3.querySelector(".tag");
    if (tag) tag.style.opacity = cl((t - 7.4) / 0.5).toFixed(3);
  }
};
window.setFrame(0);
</script></body></html>`;
