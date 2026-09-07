# vedanthkogileru.com

Personal site. Next.js **static export** deployed to GitHub Pages.

> Sibling folders, outside this repo:
> `../logo/` — identity system, see `identity.html`
> `../voice-agent/` — voice agent design, see its own `CLAUDE.md`

---

## Stack and deploy

- Next.js App Router, `output: 'export'`, Tailwind, framer-motion
- Inter via `next/font/google`, self-hosted at build into `_next/static/media/`
- `./deploy.sh` runs `npm run build` then **force-pushes `out/` to `gh-pages`**

**Deploy gotchas, both learned the hard way:**

1. **Pages takes 30 to 60 seconds to propagate.** Verifying immediately after
   `deploy.sh` returns will show the *previous* build and look like a failure.
   Poll until the new content appears rather than sleeping blindly.
2. **Replacing an image in place does not reach anyone who already loaded it.**
   No cache-header control on GitHub Pages, so **the filename must change**.
   This bit us with the chess card: the new image was live for a full deploy
   cycle while the old one still showed in the browser.

Always verify against the live URL with a cache-buster, not the local build:

```bash
curl -sS -H "Cache-Control: no-cache" "https://vedanthkogileru.com/?cb=$(date +%s)"
```

---

## Page structure

`app/page.tsx`: Navbar → Hero → About → Work → Interests → Contact → Footer

| Section | id | Notes |
|---|---|---|
| Hero | — | Canvas particle animation. `CHAOS_MS 2200` + `COLLAPSE_MS 1800`, name lands ~4.0s |
| About | `about` | Four chapters: Early Days, College, The Builder, The AI |
| Work | `work` | **Merged from the old Projects + Experience**, which duplicated each other |
| Interests | `interests` | Two columns, square-ish media boxes |
| Contact | `contact` | Booking CTA first, then email/LinkedIn/GitHub |

`#projects` and `#experience` survive as **hidden compatibility anchors** in
`Work.tsx` so previously shared links still land.

---

## Content conventions

- **No em dashes anywhere in visible copy.** Use a colon where the clause
  explains, a comma where it trails. Applies to `aria-label`s too
- **Work runs newest-first at every level** — eras and the products inside them.
  Ignosis → CASHe (KaratClub → Karat Wealth → 13Karat) → Teenvesting
- **About runs oldest-first**, because it is a narrative, not a CV
- The mark **never** sits beside the name on a shared baseline. Stacked lockup or
  mark alone. A tall narrow mark against a horizontal word fights it, and both
  starting with V reads as a stutter
- Outbound URLs live in `app/links.ts` so they cannot drift between components.
  An empty string renders as plain text rather than a dead link

---

## Logo component

`app/components/Logo.tsx`. Geometry on a 24-unit grid, must stay in sync with
`../logo/identity.html` and `public/favicon.svg`.

- Props: `animate`, `compact` (drops the rule, for tiles and circles), `accent`
  (rule in indigo, the only element that ever takes it)
- **Do not thicken the caret.** It is the V at 32% scale, stroke included. Heavier
  and its notch closes and it reads as a solid triangle
- Draw-on animation is gated behind `prefers-reduced-motion: no-preference`
  rather than overridden. If those rules never apply the mark renders **fully
  drawn** — hiding it by default and revealing it via animation would mean any
  failure leaves an invisible logo
- Timing is deliberate: starts 2.40s, ends ~3.8s, so the mark and the hero name
  come to rest together instead of competing

---

## Verifying visual changes

`qlmanage` renders HTML, which is how everything here was checked without a
browser. Two things are required or the render is meaningless:

1. **Inline the built CSS.** It will not fetch `out/_next/static/css/*.css`.
   Rewrite `url(/_next/` to `url(./_next/` so fonts resolve
2. **Neutralise framer-motion's initial state**, or every section renders at
   `opacity: 0`:
   `<style>*{opacity:1!important;transform:none!important}</style>`

For responsive checks, point iframes at the snapshot at 390 / 768 / 1280.
**Beware:** qlmanage scales the page, so measure element positions relative to
the iframe width rather than trusting the raw pixel numbers.

---

## Security

Full audit in `../voice-agent/ARCHITECTURE.md`. The one that matters:

> **`http://vedanthkogileru.com` serves 200 with no redirect to HTTPS.**
> Fix: GitHub → Settings → Pages → **Enforce HTTPS**.
>
> This blocks the voice agent entirely. `getUserMedia` needs a secure context,
> so on the HTTP origin the mic button silently does nothing.

Also outstanding: 3 npm advisories in PostCSS via Next (build-time only, low real
exposure), and no security headers (GitHub Pages cannot set them).

---

## Open items

- **Product logos** for 13Karat, Karat Wealth, KaratClub. Slots exist in
  `Work.tsx`; empty paths render nothing and a 404 hides itself, so there is no
  broken-image risk while they are missing
- **The lineage question.** Every public trace — the Play listing, the package id
  `in.app_13karat.app.twa`, and `karatwealth.in` itself — resolves to **one app**
  renamed twice. The site presents three products as peers. Told straight
  (launch → ₹100Cr → rebrand → pivot → second product) it is a stronger story
- `public/img/` was cleaned of a mislabelled `football.jpg`; the photo was
  actually the snooker tournament win
