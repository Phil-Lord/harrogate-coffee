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
deployed on Vercel, backed by Sanity with the `coffeeShop` schema. The landing
list renders styled shadcn cards from a GROQ query, and `/coffee-shops/[slug]`
detail pages are statically generated. Real café content is entered and showing
on the live site.

This is a **pnpm workspace with two apps**. The Next.js site is the repo root.
The Studio is a standalone Vite app in `studio/`, deployed separately to
`harrogate-coffee.sanity.studio` — it is no longer embedded at `/studio`.

The boundary between them matters:

- `studio/` owns the **schema** (`schemaTypes/`), Studio config, and anything
  that only runs inside the editor (`studio/lib/rating.ts`).
- `sanity/` at the root owns the site's **fetching layer** — `client.ts`,
  `image.ts`, `live.ts`, `queries.ts`. The site never imports from `studio/`,
  and the Studio never imports from the site.
- `sanity.types.ts` at the root is the shared artifact, generated from both
  sides by `pnpm typegen`.
- `projectId` and `dataset` are deliberately duplicated in
  `studio/sanity.config.ts` rather than shared — the Studio can't read
  `NEXT_PUBLIC_*` or import across the boundary. Both are public identifiers.

## Live preview (Presentation tool)

The Studio's Presentation tool renders the site in an iframe beside the editor,
updating on the draft as Jess types, with click-to-edit back to the field. The
deployed Studio previews the deployed site; `pnpm studio` previews `pnpm dev`
(`previewUrl.initial` in `studio/sanity.config.ts` picks by Studio origin).

- Needs `SANITY_API_READ_TOKEN` (a Viewer token) in `.env.local` and in Vercel.
  Without it the site still builds and serves published content — only preview
  breaks.
- The token is server-side only: `browserToken: false` in `sanity/lib/live.ts`,
  because drafts are only ever previewed inside Presentation.
- Every fetch goes through `sanityFetch`, which tags its queries so
  `<SanityLive />` can expire them the moment content changes. That's what
  replaced the 1-hour ISR window — **don't add `export const revalidate` back**.
- **Anything feeding `<head>` fetches with `stega: false`.** Stega's invisible
  characters are what make click-to-edit work in the body, and what would wreck
  the `<title>` this site exists to rank.

## Commands

Package manager is **pnpm** (not npm).

```bash
pnpm dev            # local dev server on :3000
pnpm build          # production build (run before assuming a change is deploy-safe)
pnpm start          # serve the production build
pnpm lint           # eslint (site only — studio/ is ignored)
pnpm typecheck      # tsc for the site; `pnpm --filter harrogate-coffee-studio typecheck` for the Studio

pnpm studio         # Sanity Studio on :3333, alongside `pnpm dev`
pnpm typegen        # regenerate sanity.types.ts after a schema *or* query change
pnpm studio:deploy  # publish studio/ — schema changes don't reach Jess without this
```

`pnpm typegen` runs inside `studio/` and writes to the repo root. Run it after
touching `studio/schemaTypes/` or `sanity/lib/queries.ts` — the two feed the
same generated file.

**Never run a plain `pnpm build` while the human's `pnpm dev` is running** — it
writes to the same `.next` and leaves dev serving stale CSS from a URL whose
hash doesn't change, so a browser reload won't clear it either. Build somewhere
else instead:

```bash
NEXT_DIST_DIR=.next-build pnpm build
NEXT_DIST_DIR=.next-build pnpm start -p 3100   # to screenshot the real build
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
  SPAs don't. Statically generate pages, revalidated on publish by the Live
  Content API rather than on a timer.
- **Fetch Sanity at build time, not per visitor** — keeps us clear of Sanity's
  API-request quota and makes the site fast. The free tier (10k docs, 100GB
  assets/bandwidth, 1M CDN req/mo) is ample for a small curated directory. Free
  tier is public datasets only — fine, all content is public anyway.
- **Client-side sorting is cheap** — only a few hundred shops, so the whole list
  ships in the static page and sorts in-memory instantly (no round-trips). Sort
  fields (`rating`, `priceLevel`, `area`) are stored as typed/numeric values.
- **Store lat/long from day one** — via Sanity's native `geopoint`, even though
  distance sorting comes later. Avoids re-editing every entry.

## Code Conventions

Small site, so the rule is simple: **the second copy is the bug.** Duplicated
class strings and duplicated domain rules are what actually rot this codebase —
they drift silently and nothing fails.

- **One source per shared value.** Before writing a class string, a magic
  number, or a schema value, check whether it already exists:
  - Layout rhythm → `pageContainer` in `app/_lib/layout.ts`. Never hand-roll
    `max-w-* px-*` on a page or a bar; everything full-width must line up with
    the cards.
  - Fixed-bar heights → `--header-h` / `--filter-bar-h` in `globals.css`. A bar
    positioned under another bar reads the variable; it never repeats the number.
  - Shop facts (`ownership === 'independent'`, `dogFriendly === 'yes'`) →
    predicates in `app/_lib/shop.ts`. Those strings live in the Sanity schema and
    nowhere else in the app.
- **Use the generated types.** TypeGen narrows fields to unions
  (`"chain" | "independent" | null`). Type props as `Shop['ownership']`, never
  widen to `string | null`.
- **Split state from chrome from logic.** A client component that filters a list
  owns state and composes; the bar is presentational and controlled by props;
  the predicates and comparators are pure functions in `app/_lib/`, testable
  without React. `ShopBrowser` / `ShopFilterBar` / `ShopList` / `shop.ts` is the
  shape to copy.
- **`cn()` from `@/lib/utils`** for conditional classes — never template strings
  with `?? ''`.
- **Don't export what nothing imports.** Sub-components stay private to their
  file until a second caller appears (see `ShopBadges.tsx`).
- **Name magic numbers** (`ABOVE_THE_FOLD`) so they don't need a comment.
- **Comments are the exception, not the habit.** Write one only where the code
  can't say it itself: a non-obvious *why*, a constraint, a gotcha that would
  bite the next person. One line, two at the outside. No docblocks restating a
  signature, no narrating what the line below plainly does. If deleting the
  comment loses nothing, it should never have been written.

Extract on the second use, not in anticipation of one — a wrapper with a single
caller is the other failure mode.

## Data Model

A single `coffeeShop` Sanity document drives both views. The **landing list**
needs only lightweight, sortable fields; richer content lives on the **shop page**.

- **List/sort:** `name`, `slug`, `shortDescription`, `rating` + `priceLevel`
  (numeric, sortable), `mainImage`, `area`, `features` (predefined lists).
- **Shop page only:** Portable Text `description`, `gallery`, `openingHours`,
  `address`, `location` (geopoint), contact links.
- **Studio conventions:** group fields into tabs with helper text for Jess;
  image `alt` text is required.
