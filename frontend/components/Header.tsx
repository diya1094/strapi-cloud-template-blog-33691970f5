import Link from "next/link";
import { getCategories } from "@/lib/api";

export default async function Header() {
  let categories: { id: number; documentId: string; name: string; slug: string }[] = [];
  try {
    const res = await getCategories();
    categories = res.data;
  } catch {
    // Strapi not running yet — show empty nav
  }

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-6">
        <Link href="/" className="text-xl font-bold tracking-tight hover:text-indigo-600 transition-colors">
          My Blog
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-gray-600 flex-wrap">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="hover:text-indigo-600 transition-colors capitalize"
            >
              {cat.name}
            </Link>
          ))}
          <Link href="/about" className="hover:text-indigo-600 transition-colors">About</Link>
        </nav>
      </div>
    </header>
  );
}
