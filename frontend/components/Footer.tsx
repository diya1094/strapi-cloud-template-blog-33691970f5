export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-16">
      <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} My Blog · Powered by{" "}
        <a href="https://strapi.io" target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-600">
          Strapi
        </a>{" "}
        &amp;{" "}
        <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-600">
          Next.js
        </a>
      </div>
    </footer>
  );
}
