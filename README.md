# Kairo — showcase site

A single-page, scroll-driven showcase for **Kairo**, the booking, payments and
customer-messaging system a salon runs its whole day on.

Built with Vite + React + TypeScript + Tailwind — deliberately the same stack
Lovable generates, so the project imports and stays editable there.

```bash
npm install
npm run dev      # http://localhost:8080
npm run build    # production build into dist/
npm run preview  # serve the build locally
```

---

## Before you launch — one thing to change

Every "Talk to us" button on the site opens a pre-filled email. The address is
a placeholder:

**`src/site.config.ts` → `contactEmail`** — currently `hello@kairo.app`.

Change it once there and every button, the pricing panel and the footer all
follow. Nothing else is required to go live.

---

## How the page is built

The site is one continuous scroll, ordered as a journey:

| # | Section | File | What it does |
|---|---------|------|--------------|
| 1 | Hero | `components/Hero.tsx` | Pinned headline over a live ticker of salon moments; the dashboard stands up out of perspective as you scroll |
| 2 | Proof wall | `components/ProofWall.tsx` | Rolling-digit counters, then a marquee of what one login replaces |
| 3 | The problem | `components/Contrast.tsx` | Without / with, side by side |
| 4 | **The journey** | `components/Journey.tsx` | **The centrepiece** — a pinned stage that swaps screenshots across eight numbered steps as you scroll |
| 5 | When plans change | `components/SignatureMoment.tsx` | Interactive: pick a notify channel and see the real message; a working 15-second undo |
| 6 | Everything else | `components/Bento.tsx` | Bento grid of the remaining features |
| 7 | In the hand | `components/PhoneTrio.tsx` | Three phone frames |
| 8 | Under the bonnet | `components/BuiltDifferently.tsx` | The technical case, with a system self-check panel |
| 9 | Compare | `components/Comparison.tsx` | Kairo next to the usual setup |
| 10 | What it costs | `components/TalkToUs.tsx` | Quoted-per-salon panel and how onboarding runs |

### The scroll engine

There is no animation library. Three hooks do all of it:

- **`hooks/useScrollProgress.ts`** — the important one. Give it a tall section
  containing a `sticky` child and it returns how far the page has scrolled
  through that section, 0 → 1. Everything inside the pin (which screenshot is
  showing, which step is lit, how full the rail is) is a pure function of that
  single number. Scroll reads are batched into `requestAnimationFrame`, so a
  fast flick costs one measurement per frame rather than one per event.
- **`hooks/useInView.ts`** — IntersectionObserver, for one-shot reveals.
- **`hooks/useReducedMotion.ts`** — if the visitor asked their OS for less
  motion, components render their finished state immediately. Content is never
  withheld, only the movement.

To change the journey, edit **`src/data/journey.ts`** — it's a plain array.
Adding or removing a step automatically re-times the pin, because the section's
height is derived from the array's length.

### Screenshots

All 25 product frames live in `public/screenshots/`. They show a demo salon
("Luxe Hair Studio") with invented clients — no real business's data appears
anywhere. Every frame is set on the same Thursday at 11:40, so the story stays
consistent across the whole page.

---

## Connecting this to Lovable

Lovable's UI moves around, so treat the button names below as approximate and
look for the nearest equivalent. The two paths:

### Path A — import this repo into Lovable (what you want)

1. Push this branch and merge it to `main` (see below). Lovable imports the
   repo's default branch.
2. In Lovable, go to your dashboard and look for **GitHub → Import project** /
   **Import from GitHub**.
3. Authorise the **Lovable GitHub App** if you haven't already, and grant it
   access to `SK-Webmaker/Kario-showcase-website-build-`. You can grant access
   to just this one repository rather than all of them.
4. Pick the repo and import.

Lovable checks that the project looks like one it can edit. This one is
built to pass that check:

- Vite + React 18 + TypeScript
- Tailwind CSS 3 with a standard `tailwind.config.js`
- `src/main.tsx` entry, `index.html` at the root
- The `@/` path alias configured in both `vite.config.ts` and `tsconfig.json`
- No exotic dependencies — React and React DOM are the only runtime ones

### Path B — if import isn't offered on your plan

1. Create a new **blank React project** in Lovable.
2. In that project, open **Settings → GitHub → Connect to GitHub**, and let
   Lovable create its own repository.
3. Clone that repository locally, copy everything from this one into it
   (except `node_modules` and `dist`), commit and push.
4. Lovable picks the change up on its next sync.

Path B loses this repo's history but gets you to the same place.

### After it's connected

- The sync is two-way: edits in Lovable land as commits on GitHub, and pushes
  to GitHub appear in Lovable.
- Publishing is **Share → Publish** in Lovable, which gives you a
  `*.lovable.app` URL. A custom domain is set under **Settings → Domains**
  (that part needs a paid Lovable plan).
- Because this is a static site with no backend, no environment variables and
  no Supabase connection are needed.

---

## Pushing

Development happens on `claude/kario-website-design-v0q55t`:

```bash
git push -u origin claude/kario-website-design-v0q55t
```

Merge to `main` before importing into Lovable — it reads the default branch.
