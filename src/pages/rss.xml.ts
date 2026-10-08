import type { APIRoute } from "astro";
import { getPosts } from "../utils/blog";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.toString() || "https://aarav2709.github.io";

  const posts = await getPosts();

  const items = posts
    .map((post) => {
      const url = new URL(`blog/${post.id}`, siteUrl).toString();

      return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.data.description)}</description>
      <pubDate>${post.data.date.toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AarusPortfolio Blog</title>
    <link>${new URL("blog", siteUrl)}</link>
    <atom:link href="${new URL("rss.xml", siteUrl)}" rel="self" type="application/rss+xml" />
    <description>Thoughts, devlogs, experiments, and things Aarav Gupta learns while building.</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
};
