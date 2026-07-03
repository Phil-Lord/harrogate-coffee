# Harrogate Coffee Shops

> **This is NOT the Next.js you know.** Next.js 16 has breaking changes — APIs,
> conventions, and file structure may differ from training data. Read the
> relevant guide in `node_modules/next/dist/docs/` before writing any code, and
> heed deprecation notices.

A local directory site that ranks coffee shops in Harrogate, UK. Content is
curated personally: we visit a café, add it, rate it, and write a short "vibe"
description. It's a directory that we want to look good, so the quality bar is high.

**The one job:** someone Googles "Harrogate coffee shops", lands here, and
immediately sees a clean, sortable list of cafés with quick details and photos.
Tapping one opens a fuller page (description, gallery, hours, contact). Audience
is tourists, locals, and families; priorities are speed, ease, and a sleek feel.

## Current State

Fresh `create-next-app` scaffold — App Router, TypeScript, Tailwind v4, pnpm.
Only the default `app/` (`page.tsx`, `layout.tsx`, `globals.css`) exists. **No
Sanity, no shadcn, no content, no schema yet** — those are the next steps below.

## Commands

Package manager is **pnpm** (not npm).

```bash
pnpm dev      # local dev server
pnpm build    # production build (run before assuming a change is deploy-safe)
pnpm start    # serve the production build
pnpm lint     # eslint
```

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 16 (App Router)** | React (existing skill) + server/static rendering. SEO is make-or-break, so we need real HTML in the initial response, not a client-only SPA. |
| Content + data | **Sanity** *(planned)* | Hosted content DB *and* image CDN *and* a hosted editing UI (Studio) in one — the editing UI is the key win for Jess. Document-based, queried with GROQ. |
| Styling | **Tailwind v4** (+ **shadcn/ui** *planned*) | Fast to build, plays well with Claude Code; shadcn gives polished, owned components. |
| Hosting | **Vercel** *(planned)* | Zero-friction Git → deploy, preview URLs, generous free tier. |
| Domain | `*.vercel.app` for now | Custom domain is a fast-follow. |

## Key Decisions & Rationale

- **Static/server rendering, not a plain SPA** — the whole premise is ranking in
  Google for a local search term. Static HTML indexes reliably; client-rendered
  SPAs don't. Statically generate pages (SSG / ISR).
- **Fetch Sanity at build time, not per visitor** — keeps us clear of Sanity's
  API-request quota and makes the site fast. The free tier (10k docs, 100GB
  assets/bandwidth, 1M CDN req/mo) is ample for a small curated directory. Free
  tier is public datasets only — fine, all content is public anyway.
- **Client-side sorting is cheap** — only a few hundred shops, so the whole list
  ships in the static page and sorts in-memory instantly (no round-trips). Sort
  fields (`rating`, `priceLevel`, `area`) are stored as typed/numeric values.
- **Store lat/long from day one** — via Sanity's native `geopoint`, even though
  distance sorting comes later. Avoids re-editing every entry.

## Data Model (planned)

A single `coffeeShop` Sanity document will drive both views. The **landing list**
needs only lightweight, sortable fields; richer content lives on the **shop page**.

- **List/sort:** `name`, `slug`, `shortDescription`, `rating` + `priceLevel`
  (numeric, sortable), `mainImage`, `area`, `features` (predefined lists).
- **Shop page only:** Portable Text `description`, `gallery`, `openingHours`,
  `address`, `location` (geopoint), contact links.
- **Studio conventions:** group fields into tabs with helper text for Jess;
  image `alt` text is required.

## Roadmap

Build a boring end-to-end slice live first, then layer on content and views over
a pipeline we already trust. **Do these one at a time; confirm each is live
before the next.**

1. **Scaffold + deploy empty app** — push to GitHub → import to Vercel. Done when
   a commit to `main` auto-deploys and the default page loads at a `.vercel.app` URL.
2. **Set up Sanity + real data** — create project, add the `coffeeShop` schema,
   embed Studio at `/studio`, enter 2–3 real cafés (required fields only). Done
   when shops appear in the Studio.
3. **Connect Next → Sanity, render plain** — wire up `next-sanity`, one GROQ list
   query, dump results as a bare list. Add env vars to Vercel too. Done when real
   café names show on the live site.
4. **Style the landing list** — Tailwind/shadcn cards with `next/image`, name,
   short description, rating, price badge; statically generated. No sorting yet.
   Done when it looks presentable.
5. **Shop page by slug** — dynamic route `/coffee-shops/[slug]` with a second GROQ
   query + `generateStaticParams` for static pre-rendering. Done when list →
   detail navigation works.

### Deferred (fast-follows, no rework needed)

Client-side sorting/filtering UI · geo/distance sorting · JSON-LD `LocalBusiness`
structured data (rich search results) · analytics (Plausible / Vercel) · custom
domain.
