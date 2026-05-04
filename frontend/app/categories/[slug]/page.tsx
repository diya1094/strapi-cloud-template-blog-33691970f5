import { getArticlesByCategory, getCategories, getStrapiMediaURL } from "@/lib/api";
import ArticleCard from "@/components/ArticleCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const res = await getCategories();
    return res.data.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Category: ${slug}` };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  let articles: Awaited<ReturnType<typeof getArticlesByCategory>>["data"] = [];
  let categoryName = slug;

  try {
    const res = await getArticlesByCategory(slug);
    articles = res.data;
    if (articles[0]?.category?.name) {
      categoryName = articles[0].category.name;
    }
  } catch {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <p className="text-sm text-indigo-600 font-semibold uppercase tracking-wide mb-1">Category</p>
        <h1 className="text-4xl font-extrabold tracking-tight capitalize">{categoryName}</h1>
        <p className="text-gray-500 mt-2">{articles.length} article{articles.length !== 1 ? "s" : ""}</p>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 p-16 text-center text-gray-400">
          No articles in this category yet.
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
