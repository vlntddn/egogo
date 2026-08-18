import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">egogo</h1>
        <p className="text-sm text-neutral-500">Content, published.</p>
        <p className="text-xs text-neutral-400">
          Subscribe via{" "}
          <Link href="/feed.xml" className="underline-offset-4 hover:underline">
            RSS
          </Link>{" "}
          or{" "}
          <Link href="/feed.json" className="underline-offset-4 hover:underline">
            JSON feed
          </Link>
        </p>
      </header>

      <ul className="flex flex-col gap-6">
        {posts.map((post) => (
          <li key={post.slug} className="flex flex-col gap-1">
            <Link
              href={`/posts/${post.slug}`}
              className="text-lg font-medium underline-offset-4 hover:underline"
            >
              {post.title}
            </Link>
            <p className="text-sm text-neutral-500">{post.description}</p>
            <p className="text-xs text-neutral-400">
              {post.date} · {post.readingTime}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
