#!/usr/bin/env node
/**
 * Tests for the Critic. `node tools/critic.test.mjs`
 *
 * The negative cases matter more than the positive ones. A linter that fires
 * on good copy gets switched off within a fortnight, and then the invariants
 * it was protecting are gone.
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { critique } from "./critic.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const brand = JSON.parse(readFileSync(resolve(ROOT, "config/brand.json"), "utf8"));

let pass = 0, fail = 0;
const codes = (input) => critique(input, brand).map((f) => f.code);

function post(caption, extra = {}) {
  return {
    id: "t", caption, planned_date: "2026-08-27",
    asset_provenance: "product_screenshot", ...extra,
  };
}

function shouldFlag(name, caption, code, extra) {
  const got = codes(post(caption, extra));
  if (got.includes(code)) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.log(`  FAIL ${name} — expected ${code}, got [${got.join(", ")}]`); }
}

function shouldNotFlag(name, caption, code, extra) {
  const got = codes(post(caption, extra));
  if (!got.includes(code)) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.log(`  FAIL ${name} — did not expect ${code}, got [${got.join(", ")}]`); }
}

const TAGS = "#salonowner #salonsoftware #melbournesalon #hairstylist #bookingsystem";

console.log("\nCritic tests\n" + "─".repeat(60));

// --- the word-boundary trap ------------------------------------------------
console.log("\n word boundaries");
shouldNotFlag("'water' does not trip a banned fragment",
  `I watered the plants and ate lunch between clients. That's the day.\n${TAGS}`, "BANNED-WORD");
shouldNotFlag("'grinding' does not trip 'grind'",
  `The coffee grinder died mid-shift. I've had worse Tuesdays.\n${TAGS}`, "BANNED-WORD");
shouldNotFlag("'solutions' inside a longer word is fine",
  `Resolutions get made in January. I'm making mine in August.\n${TAGS}`, "BANNED-WORD");
shouldFlag("'seamless' is caught",
  `A seamless booking flow, honestly.\n${TAGS}`, "BANNED-WORD");
shouldFlag("hyphenated phrase 'game-changer' is caught",
  `It's a game-changer, I think.\n${TAGS}`, "BANNED-WORD");

// --- draft artefacts -------------------------------------------------------
console.log("\n draft artefacts");
shouldFlag("Option A leaks", `Option A: here's the diary that can't double-book you.\n${TAGS}`, "DRAFT-ARTEFACT");
shouldFlag("Alt caption leaks", `We built it. Alt caption: we made it.\n${TAGS}`, "DRAFT-ARTEFACT");
shouldFlag("[insert] leaks", `Book at [insert link] and you're done.\n${TAGS}`, "DRAFT-ARTEFACT");
shouldFlag("TODO leaks", `TODO: write the hook.\n${TAGS}`, "DRAFT-ARTEFACT");
shouldNotFlag("clean caption has no artefact",
  `Here's what a Thursday looks like when the diary answers for itself.\n${TAGS}`, "DRAFT-ARTEFACT");

// --- hashtags --------------------------------------------------------------
console.log("\n hashtags");
shouldFlag("naked hashtag in a tag line",
  `The diary that can't double-book you.\n#salonowner salonsoftware #melbournesalon #hairstylist #bookingsystem`,
  "HASHTAG-NAKED");
shouldFlag("labelled tag line with bare words",
  `The diary that can't double-book you.\nhashtags: salonowner salonsoftware melbournesalon`, "HASHTAG-NAKED");
shouldFlag("too few hashtags", `Short one.\n#salonowner`, "HASHTAG-COUNT");
shouldFlag("too many hashtags",
  `Lots.\n` + Array.from({ length: 15 }, (_, i) => `#tag${i}`).join(" "), "HASHTAG-COUNT");
shouldFlag("repeated hashtag", `Hi.\n${TAGS} #salonowner`, "HASHTAG-DUPE");
shouldNotFlag("prose sentence is not read as a tag line",
  `I've moved 4 bookings today and every one asked me who to tell.\n${TAGS}`, "HASHTAG-NAKED");

// --- contractions ----------------------------------------------------------
console.log("\n voice");
shouldFlag("'That is' is written, not spoken", `That is three hours of my Sunday back.\n${TAGS}`, "NO-CONTRACTION");
shouldFlag("'do not' is caught", `I do not miss the paper diary.\n${TAGS}`, "NO-CONTRACTION");
shouldNotFlag("'cannot' is deliberately exempt",
  `The diary cannot be double-booked. That's the whole point.\n${TAGS}`, "NO-CONTRACTION");
// A contraction is only available in auxiliary position. Added 2026-09-06
// after "A number only you have." was flagged in otherwise clean copy.
shouldNotFlag("sentence-final 'you have' cannot be contracted",
  `Not a number I can tell you. A number only you have.\n${TAGS}`, "NO-CONTRACTION");
shouldNotFlag("sentence-final 'it is' cannot be contracted",
  `Is the diary really that simple? Of course it is.\n${TAGS}`, "NO-CONTRACTION");
shouldFlag("auxiliary 'you have' is still caught",
  `You have got three hours of your Sunday back.\n${TAGS}`, "NO-CONTRACTION");
shouldFlag("auxiliary 'it is' is still caught",
  `Honestly, it is three hours of your Sunday.\n${TAGS}`, "NO-CONTRACTION");
shouldNotFlag("contracted copy passes",
  `That's three hours of my Sunday back, and I didn't do anything clever.\n${TAGS}`, "NO-CONTRACTION");
shouldFlag("exclamation mark", `Booked out!\n${TAGS}`, "EXCLAMATION");

// --- money -----------------------------------------------------------------
console.log("\n money");
shouldNotFlag("the real price passes", `$400 once. Then nothing, every month.\n${TAGS}`, "PRICE-UNKNOWN");
shouldFlag("an invented price fails", `$39 a month and you're away.\n${TAGS}`, "PRICE-UNKNOWN");
shouldNotFlag("a fixed price stated plainly does not demand 'from'",
  `$400 to set up, and that's the lot.\n${TAGS}`, "PRICE-FROM");
// The "from" rule needs a from-flagged price to test against; brand.json has
// none today, so synthesise one rather than leaving the rule unexercised.
{
  const fromBrand = structuredClone(brand);
  fromBrand.prices.push({ id: "t", label: "Test", amount: 250, currency: "AUD", from: true, unit: "one-off" });
  const bare = critique(post(`$250 to get going.\n${TAGS}`), fromBrand).map((f) => f.code);
  const withFrom = critique(post(`From $250 to get going.\n${TAGS}`), fromBrand).map((f) => f.code);
  if (bare.includes("PRICE-FROM")) { pass++; console.log("  ok   a 'from' price without 'from' fails"); }
  else { fail++; console.log(`  FAIL a 'from' price without 'from' — got [${bare.join(", ")}]`); }
  if (!withFrom.includes("PRICE-FROM")) { pass++; console.log("  ok   a 'from' price saying 'from' passes"); }
  else { fail++; console.log(`  FAIL a 'from' price saying 'from' — got [${withFrom.join(", ")}]`); }
}
shouldFlag("unverified percentage", `Cuts no-shows by 30%.\n${TAGS}`, "UNVERIFIED-FIGURE");
// A third-party money figure is allowed on exactly the same terms as a
// percentage: declared, with a source. Added 2026-09-06 for industry facts.
shouldNotFlag("a sourced third-party dollar figure passes",
  `The industry was worth $12.5bn last year.\n${TAGS}`, "PRICE-UNKNOWN",
  { verified_figures: [{ value: "$12.5", source: "https://www.ibisworld.com/…" }] });
shouldFlag("an undeclared dollar figure still fails",
  `The industry was worth $12.5bn last year.\n${TAGS}`, "PRICE-UNKNOWN");
shouldFlag("a declared figure with no source still fails",
  `The industry was worth $12.5bn last year.\n${TAGS}`, "PRICE-UNKNOWN",
  { verified_figures: [{ value: "$12.5" }] });
shouldNotFlag("a declared, sourced figure passes",
  `Reminders cut our no-shows by 30% last quarter.\n${TAGS}`, "UNVERIFIED-FIGURE",
  { verified_figures: [{ value: "30%", source: "operator, 2026-08-25" }] });
shouldFlag("competitor named beside a number",
  `Fresha takes a cut. We take $400 once.\n${TAGS}`, "COMPETITOR-FIGURE");
shouldNotFlag("competitor discussed structurally, no numbers",
  `A marketplace listing puts four other salons on your page. Your own link doesn't.\n${TAGS}`,
  "COMPETITOR-FIGURE");

// --- season ----------------------------------------------------------------
console.log("\n season");
shouldFlag("northern-hemisphere season in August",
  `Summer's the busy one, so here's the fix.\n${TAGS}`, "SEASON");
shouldNotFlag("winter in August is correct for Melbourne",
  `Winter's quiet run is when I'd get this set up.\n${TAGS}`, "SEASON");

// --- discounting -----------------------------------------------------------
console.log("\n discounting");
shouldFlag("unauthorised discount language",
  `20% off this week only.\n${TAGS}`, "UNAUTHORISED-DISCOUNT");
shouldNotFlag("scarcity is not a discount",
  `Two Thursday slots left this week, and that's it.\n${TAGS}`, "UNAUTHORISED-DISCOUNT");
// Regression: "point of sale" is a feature name. It tripped the discount rule
// on a good caption, 2026-09-07.
shouldNotFlag("'point of sale' is a feature, not a discount",
  `Point of sale, pay-links, and a receipt that sends itself.\n${TAGS}`, "UNAUTHORISED-DISCOUNT");
shouldFlag("a real sale is still caught",
  `Half price sale on all colour this week.\n${TAGS}`, "UNAUTHORISED-DISCOUNT");
shouldFlag("'on sale' is still caught",
  `Everything's on sale until Friday.\n${TAGS}`, "UNAUTHORISED-DISCOUNT");

// --- provenance & pack rules ------------------------------------------------
console.log("\n pack");
const packOf = (posts) => critique({ week_of: "2026-08-25", posts }, brand).map((f) => f.code);
const ok = (n, cond) => { if (cond) { pass++; console.log(`  ok   ${n}`); } else { fail++; console.log(`  FAIL ${n}`); } };

ok("AI photo is refused",
  packOf([post(`Fine.\n${TAGS}`, { asset_provenance: "ai_photo" })]).includes("AI-PHOTO"));
ok("missing provenance is refused",
  packOf([{ id: "x", caption: `Fine.\n${TAGS}`, planned_date: "2026-08-27" }]).includes("NO-PROVENANCE"));
ok("offer cap is enforced",
  packOf([
    post(`One.\n${TAGS}`, { id: "a", is_offer: true }),
    post(`Two.\n${TAGS}`, { id: "b", is_offer: true }),
  ]).includes("OFFER-CAP"));
ok("identical hashtag sets warn",
  packOf([post(`One.\n${TAGS}`, { id: "a" }), post(`Two.\n${TAGS}`, { id: "b" })]).includes("HASHTAG-IDENTICAL"));

console.log("\n" + "─".repeat(60));
console.log(`  ${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
