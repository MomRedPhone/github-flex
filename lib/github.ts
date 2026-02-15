/**
 * GitHub API utilities for fetching user statistics
 */

import { GitHubStats, GitHubRepo, GitHubSearchResponse } from "./types.js";

/**
 * Fetches GitHub user statistics
 */
export async function fetchGitHubStats(
  username: string,
  token?: string,
): Promise<GitHubStats> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    // Fetch user data
    const userResponse = await fetch(
      `https://api.github.com/users/${username}`,
      { headers },
    );
    if (!userResponse.ok) {
      throw new Error(`GitHub API error: ${userResponse.status}`);
    }

    // Fetch user repositories
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&type=owner`,
      { headers },
    );

    if (!reposResponse.ok) {
      throw new Error(`GitHub API error: ${reposResponse.status}`);
    }

    const repos: GitHubRepo[] = await reposResponse.json();

    // Calculate total stars
    const totalStars = repos.reduce(
      (acc, repo) => acc + repo.stargazers_count,
      0,
    );

    // Fetch commit count (this is an approximation using search API)
    let totalCommits = 0;
    const commitsResponse = await fetch(
      `https://api.github.com/search/commits?q=author:${username}`,
      { headers },
    );
    if (commitsResponse.ok) {
      const commitsData =
        (await commitsResponse.json()) as GitHubSearchResponse;
      totalCommits = commitsData.total_count || 0;
    }

    // Fetch PRs
    let totalPRs = 0;
    const prsResponse = await fetch(
      `https://api.github.com/search/issues?q=author:${username}+type:pr`,
      { headers },
    );
    if (prsResponse.ok) {
      const prsData = (await prsResponse.json()) as GitHubSearchResponse;
      totalPRs = prsData.total_count || 0;
    }

    // Fetch Issues
    let totalIssues = 0;
    const issuesResponse = await fetch(
      `https://api.github.com/search/issues?q=author:${username}+type:issue`,
      { headers },
    );
    if (issuesResponse.ok) {
      const issuesData = (await issuesResponse.json()) as GitHubSearchResponse;
      totalIssues = issuesData.total_count || 0;
    }

    // Calculate rank based on total stars
    let rank = "C";
    if (totalStars >= 1000) {
      rank = "S";
    } else if (totalStars >= 500) {
      rank = "A+";
    } else if (totalStars >= 200) {
      rank = "A";
    } else if (totalStars >= 100) {
      rank = "B+";
    } else if (totalStars >= 50) {
      rank = "B";
    }

    return {
      username,
      totalStars,
      totalCommits,
      totalPRs,
      totalIssues,
      contributedTo: repos.length, // This represents total owned repos, not repos contributed to
      rank,
    };
  } catch (error) {
    console.error("Error fetching GitHub stats:", error);
    throw error;
  }
}
