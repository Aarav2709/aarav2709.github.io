# AarusPortfolio

My personal portfolio and blog, built with Astro and deployed to GitHub Pages at [aarav2709.github.io](https://aarav2709.github.io).

<p align="center">
  <img src="image.png" alt="AarusPortfolio Banner" />
</p>

## Features

- Static site generated with Astro, with only small scripts shipped to the browser
- Projects and blog posts as type-safe content collections
- GitHub star counts fetched at build time
- Dark (Everforest) and light (paper) themes with a toggle
- Blog with reading time, margin notes, timelines, callouts, zoomable figures, copy buttons on code and linkable headings
- Optimized images (WebP, responsive sizes) through `astro:assets`
- Self-hosted woff2 fonts (Satoshi for everything, JetBrains Mono for code)
- Sitemap, RSS feed, Open Graph image and JSON-LD
- Respects `prefers-reduced-motion`

## Tech Stack

- Framework: Astro
- Language: TypeScript
- Styling: plain CSS with custom properties
- Smooth scrolling: Lenis
- Deployment: GitHub Pages via GitHub Actions
- Package manager: pnpm

## Getting Started

```bash
pnpm install
pnpm dev
```

| Command        | Action                                       |
| :------------- | :------------------------------------------- |
| `pnpm install` | Install dependencies                         |
| `pnpm dev`     | Start the dev server at `localhost:4321`     |
| `pnpm build`   | Build the production site to `./dist/`       |
| `pnpm preview` | Preview the build locally before deploying   |

Set `GITHUB_TOKEN` when building to avoid GitHub API rate limits on star counts. CI passes it automatically.

## Project Structure

```
src/
  assets/           Images processed by astro:assets (certificates)
  components/       Reusable Astro components
  content/
    blog/           Blog posts (Markdown) and their images
    projects/       Project entries (Markdown frontmatter)
  layouts/          Page layout
  pages/            Routes, plus sitemap.xml and rss.xml endpoints
  plugins/          Remark/rehype plugins for blog features
  scripts/          Client scripts
  styles/           Global CSS, variables and fonts
  utils/            Helpers (GitHub stats, blog, age)
public/             Static files served as-is (fonts, favicon, OG image)
```

## Adding a Project

Create a `.md` file in `src/content/projects/`:

```markdown
---
title: "Project Name"
description: "What it does and what I built."
tech: ["TypeScript", "Rust"]
github: "https://github.com/username/repo"
live: "https://example.com"
buttons:
  - text: "Download"
    url: "https://example.com/download"
order: 5
---
```

Projects are sorted by `order` (lower first), then by GitHub stars.

## Writing a Blog Post

Create a `.md` file in `src/content/blog/`:

```markdown
---
title: "Post title"
description: "One or two sentences shown on the blog list."
date: 2026-10-07
draft: false
---
```

Reading time is calculated automatically.

Put images in `src/content/blog/images/<Post>/` and reference them with a relative path. A title becomes the caption:

```markdown
![Alt text](./images/Post/1.png "Caption shown under the image.")
```

Extra Markdown blocks:

```markdown
:::note
A callout. Also `:::tip`, `:::warning` and `:::danger`; add a title with `:::note[Title]`.
:::

:::margin
An aside shown in the right margin on wide screens.
:::

::::timeline
### May 2025
Each heading becomes a point on the timeline.
::::

Press :kbd[Ctrl] + :kbd[K].
```

Use four colons for a block that contains another block, like the timeline above.

## Deployment

Pushing to `main` builds and deploys to GitHub Pages. The site also rebuilds every 27 September so the age on the site stays current.

## License

MIT License

## Author

Aarav Gupta

- GitHub: @Aarav2709
- LinkedIn: aarav2709
- Email: aaravgupta2709@proton.me
