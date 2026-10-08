import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import rehypePrettyCode from "rehype-pretty-code";
import remarkBlogFeatures from "./src/plugins/remarkBlogFeatures.mjs";
import rehypeBlogFeatures from "./src/plugins/rehypeBlogFeatures.mjs";

export default defineConfig({
  site: "https://aarav2709.github.io",
  markdown: {
    syntaxHighlight: false,
    processor: unified({
      remarkPlugins: [remarkGfm, remarkDirective, remarkBlogFeatures],
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            theme: "github-dark",
            keepBackground: false,
          },
        ],
        rehypeBlogFeatures,
      ],
    }),
  },
  vite: {
    build: {
      cssMinify: "lightningcss",
    },
  },
});
