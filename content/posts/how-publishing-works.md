---
title: "How publishing works here"
date: "2026-08-18"
description: "A quick note on the content workflow for this platform."
---

Every post is a Markdown file with frontmatter. The site is statically
generated at build time, so publishing a new post is: add a file, open a
pull request, merge to `main`. CI checks lint/typecheck/build on every PR,
and Vercel deploys `main` to production automatically.

This keeps the loop tight while the team is small: no CMS to operate, no
extra service to keep alive, and content is versioned in git alongside the
code that renders it.
