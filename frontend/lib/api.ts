const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337';

async function fetchAPI<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${STRAPI_URL}/api${path}`);
  Object.entries(params).forEach(([key, val]) => url.searchParams.set(key, val));

  const res = await fetch(url.toString(), {
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Strapi fetch failed: ${res.status} ${path}`);
  }

  return res.json() as Promise<T>;
}

export interface StrapiMeta {
  pagination: { page: number; pageSize: number; pageCount: number; total: number };
}

export interface StrapiList<T> {
  data: T[];
  meta: StrapiMeta;
}

export interface StrapiSingle<T> {
  data: T;
  meta: object;
}

export interface Image {
  id: number;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
}

export interface Author {
  id: number;
  documentId: string;
  name: string;
  email: string;
  avatar: Image | null;
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface Article {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  content: string;
  publishedAt: string;
  cover: Image | null;
  author: Author | null;
  category: Category | null;
}

export interface Global {
  id: number;
  siteName: string;
  siteDescription: string;
  favicon: Image | null;
}

export interface About {
  id: number;
  title: string;
  content: string;
}

export async function getArticles(): Promise<StrapiList<Article>> {
  return fetchAPI<StrapiList<Article>>('/articles', {
    populate: 'cover,author,author.avatar,category',
    'pagination[pageSize]': '100',
    'sort[0]': 'publishedAt:desc',
  });
}

export async function getArticle(slug: string): Promise<StrapiList<Article>> {
  return fetchAPI<StrapiList<Article>>('/articles', {
    'filters[slug][$eq]': slug,
    populate: 'cover,author,author.avatar,category',
  });
}

export async function getCategories(): Promise<StrapiList<Category>> {
  return fetchAPI<StrapiList<Category>>('/categories');
}

export async function getArticlesByCategory(categorySlug: string): Promise<StrapiList<Article>> {
  return fetchAPI<StrapiList<Article>>('/articles', {
    'filters[category][slug][$eq]': categorySlug,
    populate: 'cover,author,author.avatar,category',
    'pagination[pageSize]': '100',
    'sort[0]': 'publishedAt:desc',
  });
}

export async function getGlobal(): Promise<StrapiSingle<Global>> {
  return fetchAPI<StrapiSingle<Global>>('/global', { populate: 'favicon' });
}

export async function getAbout(): Promise<StrapiSingle<About>> {
  return fetchAPI<StrapiSingle<About>>('/about');
}

export function getStrapiMediaURL(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
}
