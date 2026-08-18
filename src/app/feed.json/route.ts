import { getAllPosts } from "@/lib/posts";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/site";

// JSON Feed (jsonfeed.org) — a second, machine-readable syndication channel
// alongside feed.xml. Automation tools (Zapier, IFTTT, Buffer) can watch
// this to cross-post new entries to other channels without any manual step
// beyond writing the post itself.
export const dynamic = "force-static";

export async function GET() {
  const posts = getAllPosts();

  const body = {
    version: "https://jsonfeed.org/version/1.1",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    home_page_url: SITE_URL,
    feed_url: `${SITE_URL}/feed.json`,
    items: posts.map((post) => ({
      id: `${SITE_URL}/posts/${post.slug}`,
      url: `${SITE_URL}/posts/${post.slug}`,
      title: post.title,
      summary: post.description,
      date_published: new Date(post.date).toISOString(),
    })),
  };

  return Response.json(body);
}
