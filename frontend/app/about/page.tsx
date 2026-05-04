import { getAbout } from "@/lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export const revalidate = 3600;

export default async function AboutPage() {
  let title = "About";
  let content = "";

  try {
    const res = await getAbout();
    title = res.data.title ?? "About";
    content = res.data.content ?? "";
  } catch {
    // Strapi not running
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">{title}</h1>
      {content ? (
        <div
          className="prose prose-lg prose-indigo max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <p className="text-gray-500">
          This blog is built with{" "}
          <a href="https://strapi.io" className="underline text-indigo-600" target="_blank" rel="noopener noreferrer">Strapi</a>{" "}
          as the headless CMS and{" "}
          <a href="https://nextjs.org" className="underline text-indigo-600" target="_blank" rel="noopener noreferrer">Next.js</a>{" "}
          as the frontend. Start Strapi, populate the About content type, and this page will update automatically.
        </p>
      )}
    </div>
  );
}
