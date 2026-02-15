import { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchLanguageStats, getTopLanguages } from "../lib/languages.js";
import { generateCard, generateLanguageItem } from "../lib/card.js";
import { ThemeName } from "../lib/types.js";
import { themes } from "../lib/themes.js";

/**
 * API handler to generate a GitHub languages badge.
 * Accepts query parameters:
 * - username (required): GitHub username
 * - theme (optional): Card theme (default: "default")
 * - hide_border (optional): Whether to hide the card border (true/false)
 * - hide_title (optional): Whether to hide the card title (true/false)
 * - langs_count (optional): Number of top languages to display (default: 5)
 * - exclude (optional): Comma-separated list of languages to exclude (e.g., "HTML,CSS")
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    username,
    theme = ThemeName.Default,
    hide_border,
    hide_title,
    langs_count = "5",
    exclude,
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
  const langsCount = parseInt(
    typeof langs_count === "string" ? langs_count : "5",
    10,
  );

  try {
    // Get GitHub token from environment variable
    const githubToken = process.env.GITHUB_TOKEN;

    // Get excluded languages
    const excludeParam = typeof exclude === "string" ? exclude : undefined;

    // Fetch language stats
    const stats = await fetchLanguageStats(username, githubToken, excludeParam);
    const topLanguages = getTopLanguages(stats, langsCount);

    if (topLanguages.length === 0) {
      throw new Error("No languages found");
    }

    // Get theme colors
    const colors = themes[selectedTheme];

    // Generate language items with playful card styling
    const languageItems = topLanguages
      .map((lang, index) =>
        generateLanguageItem(
          lang.name,
          lang.percent,
          index,
          colors.icon,
          colors.border,
        ),
      )
      .join("");

    // Calculate card height based on number of languages (adjusted for new layout)
    const cardHeight = 90 + topLanguages.length * 50;

    // Generate the card
    const svg = generateCard(languageItems, {
      title: hide_title === "true" ? "" : "Most Used Languages",
      width: 450,
      height: cardHeight,
      theme: selectedTheme,
      hideBorder: hide_border === "true",
    });

    // Set cache headers (cache for 4 hours)
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=14400");

    return res.status(200).send(svg);
  } catch (error) {
    console.error("Error generating language badge:", error);

    // Return error SVG
    const errorSvg = generateCard(
      `<g transform="translate(25, 60)"><text class="stat">Failed to fetch language stats</text></g>`,
      {
        title: "Most Used Languages",
        width: 450,
        height: 120,
        theme: selectedTheme,
      },
    );

    res.setHeader("Content-Type", "image/svg+xml");
    return res.status(500).send(errorSvg);
  }
}
