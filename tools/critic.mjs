#!/usr/bin/env node
/**
 * The Critic — every caption passes this before the operator ever sees it.
 *
 *   node tools/critic.mjs content/packs/2026-08-25/pack.json
 *   node tools/critic.mjs some-caption.txt --date 2026-08-27
 *   node tools/critic.mjs <pack> --json
 *
 * Exit code 1 if there is a single error. Warnings do not block, but they are
 * printed and are meant to be answered, not ignored.
 *
 * RULE FOR ANYONE EDITING THIS FILE: when a caption fails, fix the caption.
 * Loosening a rule here is how the invariant it protects quietly dies. If a
 * rule is genuinely wrong, change it in config/brand.json and write down why
 * in CLAUDE.md, so the next run knows a decision was made rather than a
 * check being switched off.
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// ---------------------------------------------------------------------------
// boundary-safe matching
// ---------------------------------------------------------------------------

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Build a word-boundary-anchored regex for a word OR a multi-word phrase.
 *
 * This is the single most important function in the file. Substring matching
 * a banned-words list flags every caption containing "water" because "ate" is
 * the kind of fragment that ends up on such a list. The lookarounds below
 * treat any alphanumeric on either side as "still inside a word", while
 * letting hyphens and spaces act as boundaries — so "game-changer" matches
 * itself, "grind" does not match "grinding", and "ate" never matches "water".
 */
function phraseRe(phrase, flags = "gi") {
  const body = phrase
    .trim()
    .split(/\s+/)
    .map(esc)
    .join("\\s+");
  return new RegExp(`(?<![A-Za-z0-9])${body}(?![A-Za-z0-9])`, flags);
}

const EMOJI_RE = /\p{Extended_Pictographic}/gu;

// ---------------------------------------------------------------------------
// rule tables
// ---------------------------------------------------------------------------

/** Draft artefacts. These have all leaked into a published caption somewhere. */
const DRAFT_ARTEFACTS = [
  /\boption\s+[a-d]\b/i,
  /\balt(?:ernate)?\s+caption\b/i,
  /\bcaption\s*(?:option|v\d)\b/i,
  /\[\s*insert[^\]]*\]/i,
  /\[\s*your[^\]]*\]/i,
  /\[\s*tbd[^\]]*\]/i,
  /\bTODO\b/,
  /\bTK\b/,
  /\bXXX\b/,
  /\bplaceholder\b/i,
  /\blorem ipsum\b/i,
  /\{\{[^}]*\}\}/,
  /<[^>]*placeholder[^>]*>/i,
  /^\s*(?:draft|version|v)\s*\d*\s*[:\-]/im,
  /```/,
];

/** Names we may discuss structurally, but never attach a number to. */
const COMPETITORS = [
  "fresha", "square", "squarespace", "timely", "phorest", "mindbody",
  "booksy", "vagaro", "shedul", "calendly", "acuity", "treatwell", "setmore",
];

/** Discount language. Gated behind an authorising entry in brand.offers. */
const DISCOUNT_MARKERS = [
  /\d+\s*%\s*off\b/i,
  /(?<![A-Za-z0-9])discount(?:ed|s)?(?![A-Za-z0-9])/i,
  /(?<![A-Za-z0-9])half\s+price(?![A-Za-z0-9])/i,
  /(?<![A-Za-z0-9])sale(?![A-Za-z0-9])/i,
  /(?<![A-Za-z0-9])limited\s+time(?![A-Za-z0-9])/i,
  /(?<![A-Za-z0-9])special\s+offer(?![A-Za-z0-9])/i,
  /\bwas\s+\$\s?\d/i,
  /\bnormally\s+\$\s?\d/i,
];

const SEASON_WORDS = ["summer", "autumn", "fall", "winter", "spring"];

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

function loadBrand(brandPath) {
  const p = brandPath ?? resolve(ROOT, "config/brand.json");
  try {
    return JSON.parse(readFileSync(p, "utf8"));
  } catch (e) {
    console.error(`critic: cannot read ${p}\n  ${e.message}`);
    process.exit(2);
  }
}

const lineOf = (text, index) => text.slice(0, index).split("\n").length;

function excerpt(text, index, len = 1) {
  const from = Math.max(0, index - 28);
  const to = Math.min(text.length, index + len + 28);
  return (from > 0 ? "…" : "") + text.slice(from, to).replace(/\n/g, "⏎") + (to < text.length ? "…" : "");
}

function seasonForMonth(brand, month) {
  const map = brand.seasons_southern ?? {};
  for (const [season, months] of Object.entries(map)) {
    if (months.includes(month)) return season;
  }
  return null;
}

/**
 * A "tag line" is a line that is mostly hashtags. Naked hashtags — a tag that
 * lost its "#" somewhere between the doc and the clipboard — are only
 * detectable by reading them in that context, so that is where we look.
 */
function tagLines(caption) {
  return caption.split("\n").map((line, i) => {
    const tokens = line.trim().split(/\s+/).filter(Boolean);
    if (!tokens.length) return null;
    const tags = tokens.filter((t) => /^#[\wÀ-ɏ]+$/.test(t));
    // A line labelled "hashtags:" is a tag line even with no "#" left on it —
    // that total-strip case is exactly the failure this rule exists to catch.
    const labelled = /^\s*(?:hashtags?|tags)\s*[:\-]/i.test(line);
    const isTagLine = labelled || (tags.length >= 1 && tags.length / tokens.length >= 0.5);
    return isTagLine ? { line, index: i, tokens, tags, labelled } : null;
  }).filter(Boolean);
}

// ---------------------------------------------------------------------------
// caption rules
// ---------------------------------------------------------------------------

function lintCaption(caption, post, brand, findings) {
  const id = post.id ?? "caption";
  const add = (level, code, message, index) =>
    findings.push({
      level, code, post: id, message,
      line: index == null ? null : lineOf(caption, index),
      excerpt: index == null ? null : excerpt(caption, index),
    });

  // --- draft artefacts -----------------------------------------------------
  for (const re of DRAFT_ARTEFACTS) {
    const m = caption.match(re);
    if (m) add("error", "DRAFT-ARTEFACT", `Draft artefact left in published text: ${JSON.stringify(m[0])}`, m.index);
  }

  // --- length and the fold -------------------------------------------------
  const limits = brand.caption_limits ?? {};
  if (limits.max_chars && caption.length > limits.max_chars) {
    add("error", "TOO-LONG", `Caption is ${caption.length} chars, over the ${limits.max_chars} limit.`);
  }
  const firstLine = caption.split("\n")[0] ?? "";
  if (limits.first_line_max_chars && firstLine.length > limits.first_line_max_chars) {
    add("warn", "HOOK-LONG",
      `First line is ${firstLine.length} chars; past ~${limits.first_line_max_chars} it truncates in-feed and only people already convinced read on.`);
  }

  // --- hashtags ------------------------------------------------------------
  const tags = caption.match(/#[\wÀ-ɏ]+/g) ?? [];
  const band = brand.hashtags ?? {};
  if (band.min != null && tags.length < band.min) {
    add("error", "HASHTAG-COUNT", `${tags.length} hashtags; the band is ${band.min}–${band.max}.`);
  }
  if (band.max != null && tags.length > band.max) {
    add("error", "HASHTAG-COUNT", `${tags.length} hashtags; the band is ${band.min}–${band.max}.`);
  }
  const lower = tags.map((t) => t.toLowerCase());
  const dupes = lower.filter((t, i) => lower.indexOf(t) !== i);
  if (dupes.length) {
    add("error", "HASHTAG-DUPE", `Repeated hashtag(s): ${[...new Set(dupes)].join(", ")}.`);
  }
  for (const tl of tagLines(caption)) {
    const naked = tl.tokens.filter(
      (t) => !/^#/.test(t) && /^[\wÀ-ɏ][\wÀ-ɏ.-]*$/.test(t) &&
             !(tl.labelled && /^(?:hashtags?|tags)[:\-]?$/i.test(t))
    );
    if (naked.length) {
      add("error", "HASHTAG-NAKED",
        `Hashtag(s) missing their "#" in a tag line: ${naked.join(", ")}.`,
        caption.indexOf(tl.line));
    }
  }

  // --- voice ---------------------------------------------------------------
  const voice = brand.voice ?? {};
  for (const word of voice.banned_words ?? []) {
    const m = caption.match(phraseRe(word));
    if (m) add("error", "BANNED-WORD", `Banned by the voice rules: ${JSON.stringify(m[0])}.`, caption.search(phraseRe(word)));
  }
  if (voice.contractions?.enforce) {
    for (const phrase of voice.contractions.expansions_to_reject ?? []) {
      const re = phraseRe(phrase);
      const m = re.exec(caption);
      if (m) {
        add("error", "NO-CONTRACTION",
          `"${m[0]}" is written, not spoken. Contract it. (This is the exact thing that made week one's tone feel off.)`,
          m.index);
      }
    }
  }
  const bangMax = voice.banned_punctuation?.exclamation_marks_max;
  if (bangMax != null) {
    const bangs = (caption.match(/!/g) ?? []).length;
    if (bangs > bangMax) add("error", "EXCLAMATION", `${bangs} exclamation mark(s); the limit is ${bangMax}.`);
  }
  if (voice.emoji_max != null) {
    const emoji = caption.match(EMOJI_RE) ?? [];
    if (emoji.length > voice.emoji_max) {
      add("error", "EMOJI", `${emoji.length} emoji; the limit is ${voice.emoji_max}.`);
    }
  }

  // --- money ---------------------------------------------------------------
  const prices = brand.prices ?? [];
  const known = new Map(prices.map((p) => [Number(p.amount), p]));
  const moneyRe = /\$\s?(\d[\d,]*(?:\.\d+)?)/g;
  let m;
  while ((m = moneyRe.exec(caption))) {
    const value = Number(m[1].replace(/,/g, ""));
    const price = known.get(value);
    if (!price) {
      add("error", "PRICE-UNKNOWN",
        `$${m[1]} is not a price in config/brand.json. The only figures this business asserts are ${[...known.keys()].map((v) => "$" + v).join(" and ")}. Never quote a price from memory.`,
        m.index);
      continue;
    }
    const before = caption.slice(Math.max(0, m.index - 40), m.index);
    const saysFrom = /(?<![A-Za-z0-9])from(?![A-Za-z0-9])/i.test(before);
    if (price.from && !saysFrom) {
      add("error", "PRICE-FROM",
        `$${m[1]} is a "from" price in the config and the copy must say "from".`, m.index);
    }
    if (!price.from && saysFrom) {
      add("warn", "PRICE-FROM-EXTRA",
        `$${m[1]} is a fixed price but the copy reads "from", which understates it.`, m.index);
    }
  }

  // --- unverifiable figures -------------------------------------------------
  const declared = new Set((post.verified_figures ?? []).map((f) => String(f.value).trim()));
  const pctRe = /(?<![A-Za-z0-9])(\d+(?:\.\d+)?)\s?%/g;
  while ((m = pctRe.exec(caption))) {
    if (!declared.has(m[0].trim()) && !declared.has(m[1])) {
      add("error", "UNVERIFIED-FIGURE",
        `${m[0]} is asserted with no source. Add it to this post's verified_figures with a link that resolves, or cut it. Never invent a number.`,
        m.index);
    }
  }
  for (const name of COMPETITORS) {
    const re = phraseRe(name);
    const hit = re.exec(caption);
    if (!hit) continue;
    if (/\$\s?\d/.test(caption) || /\d+\s?%/.test(caption)) {
      add("error", "COMPETITOR-FIGURE",
        `Caption names "${hit[0]}" and carries a number. Competitor terms differ by plan and country and go stale — talk about business models, never their figures.`,
        hit.index);
    }
  }

  // --- season / hemisphere --------------------------------------------------
  const dateStr = post.planned_date ?? post._week_of;
  if (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const month = Number(dateStr.slice(5, 7));
    const actual = seasonForMonth(brand, month);
    for (const word of SEASON_WORDS) {
      const re = phraseRe(word);
      const hit = re.exec(caption);
      if (!hit) continue;
      const said = word === "fall" ? "autumn" : word;
      if (word === "fall") {
        add("warn", "SEASON-DIALECT", `"fall" is American; Melbourne says "autumn".`, hit.index);
      }
      if (actual && said !== actual) {
        add("error", "SEASON",
          `Caption says "${hit[0]}" but ${dateStr} is ${actual} in Melbourne (southern hemisphere).`,
          hit.index);
      }
    }
  } else {
    add("warn", "NO-DATE", `No planned_date, so the season and hemisphere check could not run.`);
  }

  // --- discounting ----------------------------------------------------------
  const authorised = (brand.offers?.active_promotions ?? []).length > 0;
  for (const re of DISCOUNT_MARKERS) {
    const hit = caption.match(re);
    if (!hit) continue;
    if (!authorised) {
      add("error", "UNAUTHORISED-DISCOUNT",
        `Discount language (${JSON.stringify(hit[0])}) with no authorising entry in brand.offers.active_promotions. A price cut teaches the audience to wait for the next one — only the operator can call one, and it gets recorded with who asked and when.`,
        hit.index);
    } else if (!post.is_offer) {
      add("warn", "OFFER-UNFLAGGED", `Discount language but is_offer is not set, so this post escapes the weekly offer cap.`, hit.index);
    }
  }

  // --- soft checks ----------------------------------------------------------
  if (!/(?<![A-Za-z0-9])(?:I|I'm|I've|we|we're|we've|my|our|you|your|you're|you've)(?![A-Za-z0-9])/i.test(caption)) {
    add("warn", "NO-PERSON", `No first or second person anywhere. This reads as copy about a business, not speech from one.`);
  }
}

// ---------------------------------------------------------------------------
// pack rules
// ---------------------------------------------------------------------------

function lintPack(pack, brand, findings) {
  const posts = pack.posts ?? [];
  const add = (level, code, message, post = "pack") =>
    findings.push({ level, code, post, message, line: null, excerpt: null });

  if (!posts.length) add("error", "EMPTY-PACK", `Pack contains no posts.`);

  const prov = brand.asset_provenance ?? {};
  for (const post of posts) {
    if (!post.id) add("error", "NO-ID", `A post has no id, so findings cannot be attributed.`);
    if (!post.caption || !post.caption.trim()) {
      add("error", "NO-CAPTION", `Post has no caption.`, post.id ?? "?");
    }
    const p = post.asset_provenance;
    if (!p) {
      add("error", "NO-PROVENANCE",
        `No asset_provenance. Every image and video declares where it came from; that is how the no-AI-photographs rule is actually enforced rather than remembered.`,
        post.id ?? "?");
    } else if ((prov.banned ?? []).includes(p)) {
      add("error", "AI-PHOTO",
        `asset_provenance "${p}" is banned. An AI photograph misrepresents work the business did not do, and the platform auto-labels it.`,
        post.id ?? "?");
    } else if ((prov.allowed ?? []).length && !prov.allowed.includes(p)) {
      add("error", "PROVENANCE-UNKNOWN",
        `asset_provenance "${p}" is not in the allowed list: ${prov.allowed.join(", ")}.`,
        post.id ?? "?");
    }
  }

  // offer cap
  const offers = posts.filter((p) => p.is_offer);
  const cap = brand.offers?.max_per_week;
  if (cap != null && offers.length > cap) {
    add("error", "OFFER-CAP",
      `${offers.length} offer posts this week; the cap is ${cap}. Past that the feed reads as an ad channel and gets muted.`);
  }

  // repeated hooks
  const hooks = posts.map((p) => (p.caption ?? "").split("\n")[0].trim().toLowerCase()).filter(Boolean);
  const dupeHooks = hooks.filter((h, i) => hooks.indexOf(h) !== i);
  if (dupeHooks.length) add("warn", "DUPE-HOOK", `Two posts open with the same line: ${JSON.stringify(dupeHooks[0])}.`);

  // identical hashtag sets
  const sets = posts.map((p) => (((p.caption ?? "").match(/#[\w]+/g) ?? []).map((t) => t.toLowerCase()).sort().join(" ")));
  if (sets.length > 1 && new Set(sets.filter(Boolean)).size === 1) {
    add("warn", "HASHTAG-IDENTICAL", `Every post carries the same hashtag set. Vary them, or the week teaches you nothing about which ones work.`);
  }
}

// ---------------------------------------------------------------------------
// runner
// ---------------------------------------------------------------------------

export function critique(input, brand) {
  const findings = [];
  const pack = input.posts ? input : { posts: [input] };
  lintPack(pack, brand, findings);
  for (const post of pack.posts ?? []) {
    if (!post.caption) continue;
    lintCaption(post.caption, { ...post, _week_of: post.planned_date ?? pack.week_of }, brand, findings);
  }
  return findings;
}

function main(argv) {
  const args = argv.slice(2);
  const file = args.find((a) => !a.startsWith("--"));
  const asJson = args.includes("--json");
  const dateArg = args.includes("--date") ? args[args.indexOf("--date") + 1] : null;

  if (!file) {
    console.error("usage: node tools/critic.mjs <pack.json | caption.txt> [--date YYYY-MM-DD] [--json]");
    process.exit(2);
  }

  const brand = loadBrand();
  const raw = readFileSync(resolve(file), "utf8");

  let input;
  if (file.endsWith(".json")) {
    input = JSON.parse(raw);
  } else {
    input = {
      id: file,
      caption: raw.trim(),
      planned_date: dateArg,
      asset_provenance: "typographic_card",
      _adhoc: true,
    };
    if (!dateArg) input.planned_date = null;
  }

  // A bare caption file has no asset to vouch for; don't fail it on provenance.
  const findings = critique(input, brand).filter(
    (f) => !(input._adhoc && ["NO-PROVENANCE", "PROVENANCE-UNKNOWN"].includes(f.code))
  );

  const errors = findings.filter((f) => f.level === "error");
  const warns = findings.filter((f) => f.level === "warn");

  if (asJson) {
    console.log(JSON.stringify({ file, errors: errors.length, warnings: warns.length, findings }, null, 2));
  } else {
    const byPost = new Map();
    for (const f of findings) {
      if (!byPost.has(f.post)) byPost.set(f.post, []);
      byPost.get(f.post).push(f);
    }
    console.log(`\nCritic — ${file}\n${"─".repeat(60)}`);
    for (const [post, list] of byPost) {
      console.log(`\n  ${post}`);
      for (const f of list) {
        const tag = f.level === "error" ? "FAIL" : "warn";
        console.log(`    [${tag}] ${f.code}${f.line ? ` (line ${f.line})` : ""} — ${f.message}`);
        if (f.excerpt) console.log(`           ${f.excerpt}`);
      }
    }
    console.log(`\n${"─".repeat(60)}`);
    console.log(errors.length ? `  ${errors.length} error(s), ${warns.length} warning(s). Fix the caption — do not loosen the rule.`
                              : `  PASS — 0 errors, ${warns.length} warning(s).`);
    console.log("");
  }

  process.exit(errors.length ? 1 : 0);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  main(process.argv);
}
