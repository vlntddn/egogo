#!/usr/bin/env node
// Ingestion step of the content pipeline: turns a title (plus optional
// scheduling flags) into a correctly-formatted draft/scheduled Markdown
// file in content/posts/, so publishing never starts from a blank file.
//
// Usage:
//   npm run new-post -- "My post title"
//   npm run new-post -- "My post title" --date 2026-09-01
//   npm run new-post -- "My post title" --draft

import fs from "fs";
import path from "path";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseArgs(argv) {
  const args = { draft: false, date: null, title: null };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--draft") {
      args.draft = true;
    } else if (arg === "--date") {
      args.date = argv[++i];
    } else {
      rest.push(arg);
    }
  }
  args.title = rest.join(" ").trim();
  return args;
}

function todayISODate() {
  return new Date().toISOString().slice(0, 10);
}

function main() {
  const { title, date, draft } = parseArgs(process.argv.slice(2));

  if (!title) {
    console.error('Usage: npm run new-post -- "Post title" [--date YYYY-MM-DD] [--draft]');
    process.exit(1);
  }

  const publishDate = date ?? todayISODate();
  if (Number.isNaN(Date.parse(publishDate))) {
    console.error(`Invalid --date "${publishDate}"; expected YYYY-MM-DD.`);
    process.exit(1);
  }

  const slug = slugify(title);
  if (!slug) {
    console.error(`Could not derive a slug from title "${title}".`);
    process.exit(1);
  }

  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (fs.existsSync(filePath)) {
    console.error(`content/posts/${slug}.md already exists.`);
    process.exit(1);
  }

  const frontmatter = [
    "---",
    `title: "${title.replace(/"/g, '\\"')}"`,
    `date: "${publishDate}"`,
    `description: ""`,
    ...(draft ? ["draft: true"] : []),
    "---",
    "",
    "Write the post body here.",
    "",
  ].join("\n");

  fs.mkdirSync(POSTS_DIR, { recursive: true });
  fs.writeFileSync(filePath, frontmatter);

  const status = draft ? "draft" : publishDate > todayISODate() ? "scheduled" : "publishing on next deploy";
  console.log(`Created content/posts/${slug}.md (${status}, date: ${publishDate}).`);
}

main();
