import { VercelRequest, VercelResponse } from "@vercel/node";
import { generateCard, generateStatItem } from "../lib/card.js";
import { ThemeName, RepoData, GitHubRepoResponse } from "../lib/types.js";

async function fetchRepoStats(
  owner: string,
  repo: string,
  token?: string,
): Promise<RepoData> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    { headers },
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const data = (await response.json()) as GitHubRepoResponse;

  return {
    name: data.name,
    description: data.description || "No description provided",
    stars: data.stargazers_count,
    forks: data.forks_count,
    language: data.language || "Unknown",
    openIssues: data.open_issues_count,
  };
}

/**
 * API handler to generate a GitHub repository stats card.
 * Accepts query parameters:
 * - username (required): GitHub username
 * - repo (required): Repository name
 * - theme (optional): Card theme (default: "default")
 * - hide_border (optional): Whether to hide the card border (true/false)
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { username, repo, theme = ThemeName.Default, hide_border } = req.query;

  // Validate parameters
  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "Username is required" });
  }

  if (!repo || typeof repo !== "string") {
    return res.status(400).json({ error: "Repository name is required" });
  }

  // Validate theme
  const selectedTheme =
    typeof theme === "string" &&
    Object.values(ThemeName).includes(theme as ThemeName)
      ? (theme as ThemeName)
      : ThemeName.Default;

  try {
    // Get GitHub token from environment variable
    const githubToken = process.env.GITHUB_TOKEN;

    // Fetch repo stats
    const repoData = await fetchRepoStats(username, repo, githubToken);

    // Generate stat items using the same layout as stats card
    const statItems = [
      generateStatItem("Stars", repoData.stars.toLocaleString(), 0),
      generateStatItem("Forks", repoData.forks.toLocaleString(), 1),
      generateStatItem("Language", repoData.language, 2),
      generateStatItem("Open Issues", repoData.openIssues.toLocaleString(), 3),
    ].join("");

    // Generate the card with the same dimensions as stats card
    const svg = generateCard(statItems, {
      title: `${username}/${repo}`,
      width: 500,
      height: 200,
      theme: selectedTheme,
      hideBorder: hide_border === "true",
    });

    // Set cache headers (cache for 4 hours)
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=14400");

    return res.status(200).send(svg);
  } catch (error) {
    console.error("Error generating repo card:", error);

    // Return error SVG
    const errorSvg = generateCard(
      generateStatItem("Error", "Failed to fetch repository stats", 0),
      {
        title: "Repository Stats",
        width: 500,
        height: 120,
        theme: selectedTheme,
      },
    );

    res.setHeader("Content-Type", "image/svg+xml");
    return res.status(500).send(errorSvg);
  }
}
