/**
 * Language statistics utilities for GitHub users
 */

import { LanguageStats, LanguageData, GitHubRepoItem } from "./types.js";

/**
 * Fetches language statistics for a GitHub user
 * @param username GitHub username
 * @param token Optional GitHub token for higher rate limits
 * @param exclude Comma-separated list of languages to exclude (e.g., "HTML,CSS")
 */
export async function fetchLanguageStats(
  username: string,
  token?: string,
  exclude?: string,
): Promise<LanguageStats> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    // Fetch user repositories
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&type=owner`,
      { headers },
    );

    if (!reposResponse.ok) {
      throw new Error(`GitHub API error: ${reposResponse.status}`);
    }

    const repos = (await reposResponse.json()) as GitHubRepoItem[];

    // Parse excluded languages
    const excludedLanguages = exclude
      ? exclude.split(",").map((lang) => lang.trim().toLowerCase())
      : [];

    // Aggregate language stats
    const languageStats: LanguageStats = {};

    for (const repo of repos) {
      if (repo.fork) {
        continue;
      } // Skip forked repos

      // Fetch languages for each repo
      const langResponse = await fetch(repo.languages_url, { headers });

      if (!langResponse.ok) {
        console.warn(`Failed to fetch languages for repo ${repo.name}`);
        continue;
      }

      const languages = (await langResponse.json()) as Record<string, number>;

      for (const [lang, bytes] of Object.entries(languages)) {
        // Skip excluded languages
        if (excludedLanguages.includes(lang.toLowerCase())) {
          continue;
        }
        languageStats[lang] = (languageStats[lang] || 0) + bytes;
      }
    }

    return languageStats;
  } catch (error) {
    console.error("Error fetching language stats:", error);
    throw error;
  }
}

/**
 * Get top N languages by bytes
 */
export function getTopLanguages(
  stats: LanguageStats,
  limit = 5,
): LanguageData[] {
  const total = Object.values(stats).reduce((sum, bytes) => sum + bytes, 0);

  return Object.entries(stats)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percent: (bytes / total) * 100,
    }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, limit);
}
