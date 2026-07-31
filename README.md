# Harrogate Coffee Shops ☕

A local directory site that ranks coffee shops in Harrogate, UK. Content is
curated personally and served as fast, statically generated pages.

- **Framework:** Next.js 16 (App Router), TypeScript
- **Content + images:** Sanity (queried with GROQ, edited in the standalone Studio in `studio/`)
- **Styling:** Tailwind v4
- **Hosting:** Vercel

> For the architecture decisions behind these choices, see [`CLAUDE.md`](./CLAUDE.md).

## Running locally

Package manager is **pnpm**.

```bash
pnpm dev      # local dev server at http://localhost:3000
pnpm build    # production build (run before assuming a change is deploy-safe)
pnpm start    # serve the production build
pnpm lint     # eslint
pnpm studio   # Sanity Studio at http://localhost:3333
pnpm typegen  # regenerate sanity.types.ts after a schema or query change
```

The Sanity Studio (content editor) is a standalone Vite app in `studio/`, run
separately from the Next.js site. It owns the schema; the site keeps the
fetching layer in `sanity/lib/`. `pnpm typegen` runs inside `studio/`, it reads
the schema from there and the queries from `sanity/lib/queries.ts`, and writes
`sanity.types.ts` at the repo root.

### Environment variables

Set in `.env.local` for local dev, and in the Vercel project settings for
deploys:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=ylqovn3m
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-07-07
```

## How content & rendering works

**tl;dr:** pages are built once from Sanity and served as static
HTML. Visitors never trigger a Sanity fetch, so the site is fast and stays well
within Sanity's free-tier quota. Publishing a café rebuilds the affected pages.

### Where the data is fetched

Pages are **React Server Components** (the App Router default with no
`"use client"`). They `await client.fetch(...)` on the server, so the Sanity
query runs **at build / regeneration time**, not per visitor. The result is
rendered to HTML and cached; visitors are served that static file.

### The knobs that control freshness

| Setting | Location | What it does |
|---------|----------|--------------|
| `export const revalidate = 3600` | `app/page.tsx` (and other pages) | Opts the page into **ISR**. The cached HTML may self-refresh **at most once an hour** lazily, only when a request arrives after the window has expired. It is a staleness ceiling, not a timer; nothing regenerates on a page nobody visits. |
| `useCdn: false` | `sanity/lib/client.ts` | Reads from Sanity's **live API** rather than its cached CDN, so every build/regeneration captures the freshest published content. Correct for an SSG/ISR site; we fetch rarely, so the CDN's caching only adds staleness with no real benefit. |

### What happens when you publish a coffee shop

1. You publish a café in the Studio (https://harrogate-coffee.sanity.studio).
2. A **Sanity webhook** fires a **Vercel deploy hook**, triggering a rebuild.
3. Vercel re-runs the pages, fetches fresh content, and redeploys the static
   HTML; the café appears within a build cycle (~1 min).

The `revalidate = 3600` window above is a backstop: even if a change somehow
doesn't fire the webhook, pages still refresh within the hour.

> **If a published café isn't showing:** it's almost always a stale build, not a
> data problem. Confirm it's published (not a draft) in the Studio, then trigger
> a redeploy in Vercel or check that the Sanity → Vercel webhook is still
> wired up.

## Deploying

**The site** deploys itself: pushing to `main` auto-deploys to Vercel, and
content changes redeploy via the Sanity → Vercel webhook described above.

**The Studio does not.** It's a separate app with its own hosting, so a schema
change only reaches Jess once someone runs:

```bash
pnpm studio:deploy   # publishes studio/ to https://harrogate-coffee.sanity.studio
```

Sanity version upgrades are the exception — `autoUpdates` in
`studio/sanity.cli.ts` means the deployed Studio picks those up on its own. It's
schema and config changes that need the manual deploy.
