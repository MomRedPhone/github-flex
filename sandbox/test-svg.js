/**
 * Test script for SVG card generation
 * Run with: node sandbox/test-svg.js
 *
 * This will generate SVG files that you can open in a browser
 */

import { writeFileSync } from "fs";
import { fetchGitHubStats } from "../lib/github.js";
import { generateCard, generateStatItem } from "../lib/card.js";
import { ThemeName } from "../lib/types.js";

async function testSVGGeneration() {
  console.log("Testing SVG Card Generation\n");
  console.log("=".repeat(50));

  const username = process.argv[2] || "torvalds";
  const themeArg = process.argv[3] || "default";
  const theme = Object.values(ThemeName).includes(themeArg)
    ? themeArg
    : ThemeName.Default;
  const token = process.env.GITHUB_TOKEN;

  console.log(`\nGenerating stats card for: ${username}`);
  console.log(`Theme: ${theme}`);

  try {
    console.log("\nFetching GitHub stats...");
    const stats = await fetchGitHubStats(username, token);

    console.log("Generating SVG card...");
    const statItems = [
      generateStatItem("Total Stars", stats.totalStars.toLocaleString(), 0),
      generateStatItem("Total Commits", stats.totalCommits.toLocaleString(), 1),
      generateStatItem("Total PRs", stats.totalPRs.toLocaleString(), 2),
      generateStatItem("Total Issues", stats.totalIssues.toLocaleString(), 3),
      generateStatItem("Total Repos", stats.contributedTo.toLocaleString(), 4),
    ].join("");

    const svg = generateCard(statItems, {
      title: `${username}'s GitHub Stats`,
      width: 500,
      height: 240,
      theme: theme,
      hideBorder: false,
    });

    const filename = `sandbox/output-${username}-${theme}.svg`;
    writeFileSync(filename, svg);

    console.log(`\n✅ Success! SVG saved to: ${filename}`);
    console.log("Open this file in a browser to view the badge\n");
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }
}

testSVGGeneration();
