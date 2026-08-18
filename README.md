# egogo

Publishing platform for egogo. Next.js (App Router) + TypeScript + Tailwind,
content authored as Markdown files in `content/posts/`, deployed to GitHub
Pages as a static export.

## Stack

- **Framework:** [Next.js](https://nextjs.org) (App Router, TypeScript, static export)
- **Styling:** Tailwind CSS
- **Content:** Markdown + frontmatter in `content/posts/`, parsed at build time
  (`gray-matter` + `remark`) — no CMS or database for the MVP
- **Hosting:** GitHub Pages, auto-deploys on push to `main` and on a daily
  schedule (see [Scheduling](#scheduling))
- **CI:** GitHub Actions — lint, build, typecheck on every push/PR

See `content/posts/how-publishing-works.md` for the publishing workflow.

## Content pipeline

Draft to published, in four steps:

1. **Ingestion** — `npm run new-post -- "Title"` scaffolds a correctly
   formatted `content/posts/<slug>.md` with frontmatter, so a post never
   starts as a blank file with hand-typed frontmatter. Add `--draft` or
   `--date YYYY-MM-DD` to control when it publishes (see below).
2. **Formatting** — Markdown body is rendered to HTML at build time via
   `remark`/`remark-gfm` (`src/lib/posts.ts`). Each post also gets
   OpenGraph/Twitter meta tags generated from its frontmatter
   (`src/app/posts/[slug]/page.tsx`), so links shared elsewhere render a
   proper title/description card.
3. **Scheduling** — a post's `date` frontmatter field is its publish time.
   A post dated in the future is built but excluded from the site and both
   feeds until that date arrives; `draft: true` excludes a post
   indefinitely regardless of date. See [Scheduling](#scheduling) for how
   it goes live without a manual push.
4. **Multi-channel publish** — every build also emits `/feed.xml` (RSS 2.0)
   and `/feed.json` ([JSON Feed](https://jsonfeed.org)) alongside the site
   (`src/app/feed.xml/route.ts`, `src/app/feed.json/route.ts`). These are a
   second distribution channel beyond the website: feed readers can
   subscribe directly, and automation tools (Zapier, IFTTT, Buffer, etc.)
   can watch either feed to cross-post new entries to social/other
   platforms without any extra manual step here.

### Scheduling

Because the site is a static export, "publishing" only happens when a
build runs. `.github/workflows/deploy.yml` rebuilds and redeploys:

- on every push to `main`, and
- on a daily schedule (`0 6 * * *` UTC).

So a post committed today with `date: "2026-09-01"` sits in the repo,
excluded from the live site, and goes live on its own on the first
scheduled rebuild on or after that date — no one has to remember to push
on publish day.

To preview a draft or future-dated post locally before it's live, run
`SHOW_DRAFTS=1 npm run dev`.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — local dev server
- `npm run new-post -- "Title"` — scaffold a new post (`--draft`, `--date YYYY-MM-DD`)
- `npm run lint` — ESLint
- `npm run build` — production build (also runs Next's own type check)
- `npm run typecheck` — standalone `tsc --noEmit`

## Adding a post

Run `npm run new-post -- "Post title"`, or add a new `.md` file to
`content/posts/` by hand with frontmatter:

```md
---
title: "Post title"
date: "2026-08-18"
description: "One-line summary"
draft: false
---

Post body in Markdown.
```

`date` controls both display and scheduling — a future date holds the post
back until that date (see [Scheduling](#scheduling)). `draft: true` holds
it back indefinitely. Once live, it shows up on the homepage, at
`/posts/<filename-without-extension>`, and in `/feed.xml` / `/feed.json`
automatically.
