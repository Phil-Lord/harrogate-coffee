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

End-to-end slice is live: Next.js 16 App Router (TypeScript, Tailwind v4, pnpm)
deployed on Vercel, backed by Sanity with the `coffeeShop` schema and Studio
embedded at `/studio`. The landing list renders styled shadcn cards from a GROQ
query, and `/coffee-shops/[slug]` detail pages are statically generated. Real
café content is entered and showing on the live site.

## Commands

Package manager is **pnpm** (not npm).

```bash
pnpm dev      # local dev server
pnpm build    # production build (run before assuming a change is deploy-safe)
pnpm start    # serve the production build
pnpm lint     # eslint
```

## Visual QA (seeing the rendered site)

A Playwright MCP server is configured in `.mcp.json`, so Claude can open the
running site, screenshot it, and iterate against what actually renders — not
guess. Workflow: the user runs `pnpm dev` in a separate terminal, then asks
Claude to take a look (e.g. "screenshot localhost:3000", "check the list on
mobile"). Claude loads the browser tools on demand. Claude can't keep a dev
server alive across its own tool calls, so the human owns `pnpm dev`.

**Screenshot after any non-trivial UI change** and confirm it looks right before
calling it done.

All Playwright output (screenshots, snapshots, console logs) belongs in
`.playwright-mcp/`, which is gitignored and size-capped so old files are evicted
automatically — no need to clean up by hand. `--output-dir` in `.mcp.json`
enforces this, but **only for bare filenames**: pass `name: "mobile.png"`, never
a path or a leading `/`, or the file escapes into the project root and makes a
mess.

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 16 (App Router)** | React (existing skill) + server/static rendering. SEO is make-or-break, so we need real HTML in the initial response, not a client-only SPA. |
| Content + data | **Sanity** | Hosted content DB *and* image CDN *and* a hosted editing UI (Studio) in one — the editing UI is the key win for Jess. Document-based, queried with GROQ. |
| Styling | **Tailwind v4** (+ **shadcn/ui**) | Fast to build, plays well with Claude Code; shadcn gives polished, owned components. |
| Hosting | **Vercel** | Zero-friction Git → deploy, preview URLs, generous free tier. |
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

## Data Model

A single `coffeeShop` Sanity document drives both views. The **landing list**
needs only lightweight, sortable fields; richer content lives on the **shop page**.

- **List/sort:** `name`, `slug`, `shortDescription`, `rating` + `priceLevel`
  (numeric, sortable), `mainImage`, `area`, `features` (predefined lists).
- **Shop page only:** Portable Text `description`, `gallery`, `openingHours`,
  `address`, `location` (geopoint), contact links.
- **Studio conventions:** group fields into tabs with helper text for Jess;
  image `alt` text is required.
