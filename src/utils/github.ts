export interface RepoStats {
  stars: number;
}

const USER_AGENT = "AarusPortfolio";

function parseGitHubRepo(githubUrl: string) {
  try {
    const [owner, repo] = new URL(githubUrl).pathname.split("/").filter(Boolean);
    return owner && repo ? { owner, repo } : null;
  } catch {
    return null;
  }
}

function parseCompactNumber(value: string): number | null {
  const normalized = value.trim().toLowerCase().replace(/,/g, "");
  const multiplier = normalized.endsWith("k") ? 1_000 : normalized.endsWith("m") ? 1_000_000 : 1;
  const parsed = Number.parseFloat(multiplier === 1 ? normalized : normalized.slice(0, -1));

  return Number.isFinite(parsed) ? Math.round(parsed * multiplier) : null;
}

async function fromGitHubApi(owner: string, repo: string): Promise<RepoStats | null> {
  const token = process.env.GITHUB_TOKEN;

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": USER_AGENT,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) return null;

    const data: { stargazers_count?: number } = await response.json();

    return { stars: Number(data.stargazers_count ?? 0) };
  } catch {
    return null;
  }
}

async function fromShields(owner: string, repo: string): Promise<RepoStats | null> {
  try {
    const response = await fetch(`https://img.shields.io/github/stars/${owner}/${repo}?style=social`, {
      headers: { "User-Agent": USER_AGENT },
    });

    if (!response.ok) return null;

    const svg = await response.text();
    const value =
      svg.match(/id="rlink"[^>]*>\s*([^<]+)\s*<\/text>/i)?.[1] ??
      [...svg.matchAll(/<text[^>]*>\s*([0-9.,]+[kKmM]?)\s*<\/text>/g)].at(-1)?.[1];
    const stars = value ? parseCompactNumber(value) : null;

    return stars === null ? null : { stars };
  } catch {
    return null;
  }
}

export async function getRepoStats(githubUrl: string): Promise<RepoStats> {
  const parsed = parseGitHubRepo(githubUrl);
  if (!parsed) return { stars: 0 };

  const stats = (await fromGitHubApi(parsed.owner, parsed.repo)) ?? (await fromShields(parsed.owner, parsed.repo));

  if (!stats) {
    console.warn(`Failed to fetch stats for ${parsed.owner}/${parsed.repo}.`);
  }

  return stats ?? { stars: 0 };
}

export function withRepoStats<T extends { data: { github?: string } }>(projects: T[]) {
  return Promise.all(
    projects.map(async (project) => ({
      ...project,
      ...(project.data.github ? await getRepoStats(project.data.github) : { stars: 0 }),
    })),
  );
}
