import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import readingTime from "reading-time";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  readingTime: string;
}

export interface Post extends PostMeta {
  contentHtml: string;
}

function readPostFile(slug: string) {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf8");
  return matter(raw);
}

export function getAllSlugs(): string[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
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
    contentHtml: processed.toString(),
  };
}
