# Operator notes

**Gloss reads this file at the start of every run, before anything else.**
It is for what the API cannot see: what happened on the floor, what the
operator wants avoided, what a client said, which slots are empty.

Add a dated block at the top. Rough notes are fine — bad handwriting beats
nothing. Delete nothing; old blocks are the record of what was tried.

---

## 2026-08-26 — Operator, first question set

Four of the six open questions answered.

**Numbers — read access.** The operator chose to grant Gloss read access to
the account rather than pasting Insights screenshots each week. Nothing has
arrived yet, so this is an intention, not a capability: no handle, no token,
no credential store in this environment. Every figure stays `unmeasured` until
a token has actually read the account once.

**Account type — Creator.** This is the opposite of what the spine assumed.
A Creator account reaches the trending chart audio library, so the main reason
to avoid current audio on a Reel is gone. Still worth checking in-app that a
specific track shows for this account before filming to it — a muted post
cannot be un-muted.

**Audience — Melbourne salons, warm network.** Salons connected to the one
already running Kairo: referrals, people who have seen it working, people one
conversation removed from a customer. This is the most decision-shaping answer
of the four. It means captions lean on proof rather than explanation, and it
means follower count is the wrong scoreboard — saves, shares and DMs are the
ones that matter at this size.

**Destination — nothing live.** Operator's words: *"i havent fully polished up
the website yet"*. So there is no URL a caption can point at, and the contact
email in `src/site.config.ts` is still the `hello@kairo.app` placeholder. Every
call to action is a DM until that changes. Worth re-asking the week the site
goes up, because a live page that publishes the price is the single strongest
thing this business could point at.

**Still open:** the Instagram handle, whether the $400 includes GST, and where
`/send` delivers.

---

## 2026-08-25 — Gloss, setting up

No operator notes yet. This file was created as part of the spine and has
never been written to by a human.

Open with the operator (also listed in CLAUDE.md → Open questions):

- Instagram handle, and whether the account is **Business** or **Creator**.
  This decides which music library is licensed. A Business account gets
  royalty-free audio only, and trending chart music will get the post muted.
- Whether Gloss gets read access to the account's numbers, or whether the
  operator will paste screenshots of Insights each week. Until one of those
  happens, every figure in every report reads `unmeasured` — never `0`.
- Who actually buys. The working hypothesis in `config/brand.json` was
  inferred from the product site, not confirmed by anyone.
- Whether the $400 includes GST.
- The live website URL, and the real contact email — `src/site.config.ts`
  still carries the placeholder `hello@kairo.app`.
