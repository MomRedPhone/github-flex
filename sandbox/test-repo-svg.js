/**
 * Test script for repository SVG card generation
 * Run with: node sandbox/test-repo-svg.js OWNER REPO [theme]
 * Example: node sandbox/test-repo-svg.js torvalds linux dark
 *
 * This will generate SVG files that you can open in a browser
 */

import { writeFileSync } from "fs";
import { generateCard, generateStatItem } from "../dist/lib/card.js";
import { ThemeName } from "../dist/lib/types.js";

async function fetchRepoStats(owner, repo, token) {
  const headers = {
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

  const data = await response.json();

  return {
    name: data.name,
    description: data.description || "No description provided",
    stars: data.stargazers_count,
    forks: data.forks_count,
    language: data.language || "Unknown",
    openIssues: data.open_issues_count,
  };
}

async function testRepoSVGGeneration() {
  console.log("Testing Repository SVG Card Generation\n");
  console.log("=".repeat(50));

  const owner = process.argv[2] || "torvalds";
  const repo = process.argv[3] || "linux";
  const themeArg = process.argv[4] || "default";
  const theme = Object.values(ThemeName).includes(themeArg)
    ? themeArg
    : ThemeName.Default;
  const token = process.env.GITHUB_TOKEN;

  console.log(`\nGenerating repo card for: ${owner}/${repo}`);
  console.log(`Theme: ${theme}`);

  try {
    console.log("\nFetching repository stats...");
    const repoData = await fetchRepoStats(owner, repo, token);

    console.log("Generating SVG card...");
    const statItems = [
      generateStatItem("Stars", repoData.stars.toLocaleString(), 0),
      generateStatItem("Forks", repoData.forks.toLocaleString(), 1),
      generateStatItem("Language", repoData.language, 2),
      generateStatItem("Open Issues", repoData.openIssues.toLocaleString(), 3),
    ].join("");

    const svg = generateCard(statItems, {
      title: `${owner}/${repo}`,
      width: 500,
      height: 200,
      theme: theme,
      hideBorder: false,
    });

    const filename = `sandbox/output-${owner}-${repo}-${theme}.svg`;
    writeFileSync(filename, svg);

    console.log(`\n✅ Success! SVG saved to: ${filename}`);
    console.log("Open this file in a browser to view the badge\n");
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }
}

testRepoSVGGeneration();
