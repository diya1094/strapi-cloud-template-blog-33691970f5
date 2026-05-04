import { getArticle, getArticles, getStrapiMediaURL } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const res = await getArticles();
    return res.data.map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await getArticle(slug);
    const article = res.data[0];
    if (!article) return {};
    return { title: article.title, description: article.description };
  } catch {
    return {};
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  let article: Awaited<ReturnType<typeof getArticle>>["data"][0] | undefined;
  try {
    const res = await getArticle(slug);
    article = res.data[0];
  } catch {
    notFound();
  }

  if (!article) notFound();

  const coverUrl = getStrapiMediaURL(article.cover?.url);
  const date = new Date(article.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-6">
        {article.category && (
          <Link
            href={`/categories/${article.category.slug}`}
            className="text-xs font-semibold text-indigo-600 uppercase tracking-wide hover:underline"
          >
            {article.category.name}
          </Link>
        )}
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight leading-tight">{article.title}</h1>
        <p className="mt-3 text-xl text-gray-500">{article.description}</p>
        <div className="mt-4 flex items-center gap-3 text-sm text-gray-400">
          {article.author?.avatar?.url && (
            <div className="relative h-8 w-8 rounded-full overflow-hidden shrink-0">
              <Image
                src={getStrapiMediaURL(article.author.avatar.url)}
                alt={article.author.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          {article.author?.name && <span className="font-medium text-gray-600">{article.author.name}</span>}
          {article.author?.name && <span>·</span>}
          <time dateTime={article.publishedAt}>{date}</time>
        </div>
      </div>

      {coverUrl && (
        <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden mb-10">
          <Image
            src={coverUrl}
            alt={article.cover?.alternativeText ?? article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div
        className="prose prose-lg prose-indigo max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <div className="mt-12 pt-8 border-t border-gray-200">
        <Link href="/" className="text-indigo-600 hover:underline font-medium">← Back to all articles</Link>
      </div>
    </div>
  );
}
