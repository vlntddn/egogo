# egogo

Publishing platform for egogo. Next.js (App Router) + TypeScript + Tailwind,
content authored as Markdown files in `content/posts/`, deployed to Vercel.

## Stack

- **Framework:** [Next.js](https://nextjs.org) (App Router, TypeScript, static generation)
- **Styling:** Tailwind CSS
- **Content:** Markdown + frontmatter in `content/posts/`, parsed at build time
  (`gray-matter` + `remark`) — no CMS or database for the MVP
- **Hosting:** Vercel (Hobby/free tier), auto-deploys on push to `main`, preview
  deploys per PR
- **CI:** GitHub Actions — lint, build, typecheck on every push/PR

See `content/posts/how-publishing-works.md` for the publishing workflow.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — local dev server
- `npm run lint` — ESLint
- `npm run build` — production build (also runs Next's own type check)
- `npm run typecheck` — standalone `tsc --noEmit`

## Adding a post

Add a new `.md` file to `content/posts/` with frontmatter:

```md
---
title: "Post title"
date: "2026-08-18"
description: "One-line summary"
---

Post body in Markdown.
```

It shows up on the homepage and at `/posts/<filename-without-extension>`
automatically.
