import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllSlugs, getPostBySlug } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!getAllSlugs().includes(slug)) {
    return {};
  }

  const post = await getPostBySlug(slug);
  const url = `${SITE_URL}/posts/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slugs = getAllSlugs();
  if (!slugs.includes(slug)) {
    notFound();
  }

  const post = await getPostBySlug(slug);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-16">
      <Link href="/" className="text-sm text-neutral-500 hover:underline">
        ← back
      </Link>
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">{post.title}</h1>
        <p className="text-xs text-neutral-400">
          {post.date} · {post.readingTime}
        </p>
      </header>
      <article
        className="prose prose-neutral max-w-none"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </main>
  );
}
