import type { APIRoute } from "astro";
import { getPosts } from "../utils/blog";

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.toString() || "https://aarav2709.github.io";

  const posts = await getPosts();

  const staticPages = [
    { url: "", priority: "1.0", changefreq: "weekly" },
    { url: "about", priority: "0.8", changefreq: "monthly" },
    { url: "projects", priority: "0.9", changefreq: "weekly" },
    { url: "achievements", priority: "0.8", changefreq: "monthly" },
    { url: "blog", priority: "0.7", changefreq: "weekly" },
  ];

  const postPages = posts.map((post) => ({
    url: `blog/${post.id}`,
    priority: "0.7",
    changefreq: "monthly",
    lastmod: post.data.date.toISOString(),
  }));

  const pages = [...staticPages, ...postPages];

  const buildDate = new Date().toISOString();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${new URL(page.url, siteUrl)}</loc>
    <lastmod>${"lastmod" in page ? page.lastmod : buildDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
