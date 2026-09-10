# Kairo — showcase site

A single-page, scroll-driven showcase for **Kairo**, the booking, payments and
customer-messaging system a salon runs its whole day on.

The site lives at `src/routes/index.tsx`; its sections are the components in
`src/components/`, and the design tokens are the Kairo block at the bottom of
`src/styles.css`. The 25 product screenshots in `public/screenshots/` show a
demo salon with invented clients — no real business's data appears anywhere.

**Before launch, change one thing:** `src/site.config.ts` → `contactEmail` is
still the placeholder `hello@kairo.app`. Every "Talk to us" button opens an
email to it, so changing that one line updates the whole site.

Pricing is stated as **$400 to set up, then nothing per month**. It appears in
`PaybackCalculator.tsx` (as the `SETUP` constant), `TalkToUs.tsx`,
`ProofWall.tsx` and `Comparison.tsx`.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1f3abd6d-0918-48f1-b44f-fc9e97297421).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
