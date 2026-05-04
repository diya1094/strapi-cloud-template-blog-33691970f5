import Link from "next/link";
import Image from "next/image";
import { Article, getStrapiMediaURL } from "@/lib/api";

interface Props {
  article: Article;
}

export default function ArticleCard({ article }: Props) {
  const coverUrl = getStrapiMediaURL(article.cover?.url);
  const date = new Date(article.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="group rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col">
      {coverUrl && (
        <Link href={`/articles/${article.slug}`} className="block overflow-hidden">
          <div className="relative h-48 w-full">
            <Image
              src={coverUrl}
              alt={article.cover?.alternativeText ?? article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </Link>
      )}
      <div className="p-5 flex flex-col flex-1">
        {article.category && (
          <Link
            href={`/categories/${article.category.slug}`}
            className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-2 hover:underline"
          >
            {article.category.name}
          </Link>
        )}
        <Link href={`/articles/${article.slug}`}>
          <h2 className="text-lg font-bold leading-snug mb-2 group-hover:text-indigo-600 transition-colors">
            {article.title}
          </h2>
        </Link>
        <p className="text-gray-500 text-sm line-clamp-3 flex-1">{article.description}</p>
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
          {article.author?.name && <span>{article.author.name}</span>}
          {article.author?.name && <span>·</span>}
          <time dateTime={article.publishedAt}>{date}</time>
        </div>
      </div>
    </article>
  );
}
