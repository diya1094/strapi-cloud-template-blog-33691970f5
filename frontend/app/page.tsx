import { getArticles } from "@/lib/api";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";

export const revalidate = 60;

export default async function HomePage() {
  let articles: Awaited<ReturnType<typeof getArticles>>["data"] = [];

  try {
    const res = await getArticles();
    articles = res.data;
  } catch {
    // Strapi not running — show placeholder
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">Latest Articles</h1>
        <p className="text-gray-500 text-lg">Thoughts, stories and ideas.</p>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 p-16 text-center text-gray-400">
          <p className="text-lg font-medium mb-2">No articles yet</p>
          <p className="text-sm">
            Start your Strapi backend and add some content, or check the{" "}
            <Link href="/about" className="underline">About</Link> page.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

