import { VercelRequest, VercelResponse } from "@vercel/node";
import { generateCard, escapeXml } from "../lib/card.js";
import { ThemeName, RepoData, GitHubRepoResponse } from "../lib/types.js";
import { themes } from "../lib/themes.js";

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

    // Get theme colors
    const colors = themes[selectedTheme];

    // Generate repo card content
    const truncatedDesc = repoData.description.substring(0, 60);
    const content = `
      <g transform="translate(25, 55)">
        <text class="stat" y="0" style="font-size: 12px; fill: ${colors.text};">
          ${escapeXml(truncatedDesc)}${repoData.description.length > 60 ? "..." : ""}
        </text>
      </g>

      <g class="stagger" style="animation-delay: 0ms" transform="translate(25, 90)">
        <svg x="0" y="-12" width="16" height="16" fill="${colors.icon}">
          <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
        </svg>
        <text class="stat" x="22" y="0">${repoData.stars.toLocaleString()} stars</text>
      </g>

      <g class="stagger" style="animation-delay: 150ms" transform="translate(25, 115)">
        <svg x="0" y="-12" width="16" height="16" fill="${colors.icon}">
          <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878z"/>
        </svg>
        <text class="stat" x="22" y="0">${repoData.forks.toLocaleString()} forks</text>
      </g>

      <g class="stagger" style="animation-delay: 300ms" transform="translate(25, 140)">
        <svg x="0" y="-12" width="16" height="16" fill="${colors.icon}">
          <circle cx="8" cy="8" r="8"/>
        </svg>
        <text class="stat" x="22" y="0">${escapeXml(repoData.language)}</text>
      </g>

      <g class="stagger" style="animation-delay: 450ms" transform="translate(25, 165)">
        <svg x="0" y="-12" width="16" height="16" fill="${colors.icon}">
          <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
          <path fill-rule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/>
        </svg>
        <text class="stat" x="22" y="0">${repoData.openIssues.toLocaleString()} open issues</text>
      </g>
    `;

    // Generate the card (title will be escaped inside generateCard)
    const svg = generateCard(content, {
      title: repoData.name,
      width: 450,
      height: 210,
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
      `<g transform="translate(25, 60)"><text class="stat">Failed to fetch repository stats</text></g>`,
      {
        title: "Repository Stats",
        width: 450,
        height: 120,
        theme: selectedTheme,
      },
    );

    res.setHeader("Content-Type", "image/svg+xml");
    return res.status(500).send(errorSvg);
  }
}
