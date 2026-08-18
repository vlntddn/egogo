import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import readingTime from "reading-time";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

// Bypasses the draft/schedule filter below, for local preview only
// (`SHOW_DRAFTS=1 npm run dev`). Never set in CI or the deploy build.
const SHOW_DRAFTS = process.env.SHOW_DRAFTS === "1";

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  readingTime: string;
  draft: boolean;
}

export interface Post extends PostMeta {
  contentHtml: string;
}

function readPostFile(slug: string) {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf8");
  return matter(raw);
}

// A post is live once its `date` has arrived and it isn't marked `draft`.
// Combined with the scheduled deploy workflow, this is what lets a post
// dated in the future publish itself on the next automatic rebuild instead
// of requiring someone to push on the day.
function isPublished(data: { date: string; draft?: boolean }): boolean {
  if (SHOW_DRAFTS) return true;
  if (data.draft) return false;
  return new Date(data.date).getTime() <= Date.now();
}

export function getAllSlugs(): string[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""))
    .filter((slug) => isPublished(readPostFile(slug).data as { date: string; draft?: boolean }));
}

export function getAllPosts(): PostMeta[] {
  return getAllSlugs()
    .map((slug) => {
      const { data, content } = readPostFile(slug);
      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        description: data.description as string,
        readingTime: readingTime(content).text,
        draft: Boolean(data.draft),
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const { data, content } = readPostFile(slug);
  const processed = await remark().use(remarkGfm).use(remarkHtml).process(content);

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    description: data.description as string,
    readingTime: readingTime(content).text,
    draft: Boolean(data.draft),
    contentHtml: processed.toString(),
  };
}
