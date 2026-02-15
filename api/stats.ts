import { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchGitHubStats } from "../lib/github.js";
import { generateCard, generateStatItem } from "../lib/card.js";
import { ThemeName } from "../lib/types.js";

/**
 * API handler to generate a GitHub stats badge.
 * Accepts query parameters:
 * - username (required): GitHub username
 * - theme (optional): Card theme (default: "default")
 * - hide_border (optional): Whether to hide the card border (true/false)
 * - hide_title (optional): Whether to hide the card title (true/false)
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    username,
    theme = ThemeName.Default,
    hide_border,
    hide_title,
  } = req.query;

  // Validate username
  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "Username is required" });
  }

  // Validate theme
  const selectedTheme =
    typeof theme === "string" &&
    Object.values(ThemeName).includes(theme as ThemeName)
      ? (theme as ThemeName)
      : ThemeName.Default;

  try {
    // Get GitHub token from environment variable (optional but recommended for higher rate limits)
    const githubToken = process.env.GITHUB_TOKEN;

    // Fetch GitHub stats
    const stats = await fetchGitHubStats(username, githubToken);

    // Generate stat items
    const statItems = [
      generateStatItem("Total Stars", stats.totalStars.toLocaleString(), 0),
      generateStatItem("Total Commits", stats.totalCommits.toLocaleString(), 1),
      generateStatItem("Total PRs", stats.totalPRs.toLocaleString(), 2),
      generateStatItem("Total Issues", stats.totalIssues.toLocaleString(), 3),
      generateStatItem("Total Repos", stats.contributedTo.toLocaleString(), 4),
    ].join("");

    // Generate the card with adjusted dimensions for 2-column layout
    const svg = generateCard(statItems, {
      title: hide_title === "true" ? "" : `${username}'s GitHub Stats`,
      width: 500,
      height: 240,
      theme: selectedTheme,
      hideBorder: hide_border === "true",
    });

    // Set cache headers (cache for 4 hours)
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=14400");

    return res.status(200).send(svg);
  } catch (error) {
    console.error("Error generating stats badge:", error);

    // Return error SVG
    const errorSvg = generateCard(
      generateStatItem("Error", "Failed to fetch stats", 0),
      {
        title: "GitHub Stats",
        width: 495,
        height: 120,
        theme: selectedTheme,
      },
    );

    res.setHeader("Content-Type", "image/svg+xml");
    return res.status(500).send(errorSvg);
  }
}
