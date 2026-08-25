# Operator notes

**Gloss reads this file at the start of every run, before anything else.**
It is for what the API cannot see: what happened on the floor, what the
operator wants avoided, what a client said, which slots are empty.

Add a dated block at the top. Rough notes are fine — bad handwriting beats
nothing. Delete nothing; old blocks are the record of what was tried.

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
