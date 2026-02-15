/**
 * Test script for GitHub stats functionality
 * Run with: node sandbox/test-stats.js
 */

import { fetchGitHubStats } from "../lib/github.js";

async function testStats() {
  console.log("Testing GitHub Stats Fetcher\n");
  console.log("=".repeat(50));

  const username = process.argv[2] || "torvalds";
  const token = process.env.GITHUB_TOKEN;

  console.log(`\nFetching stats for: ${username}`);
  if (token) {
    console.log("Using GitHub token for higher rate limits");
  } else {
    console.log("No GitHub token found - using unauthenticated requests");
    console.log(
      "Set GITHUB_TOKEN environment variable for higher rate limits\n",
    );
  }

  try {
    const startTime = Date.now();
    const stats = await fetchGitHubStats(username, token);
    const endTime = Date.now();

    console.log("\n✅ Success! Stats fetched in", endTime - startTime, "ms\n");
    console.log("Results:");
    console.log("  Username:", stats.username);
    console.log("  Total Stars:", stats.totalStars.toLocaleString());
    console.log("  Total Commits:", stats.totalCommits.toLocaleString());
    console.log("  Total PRs:", stats.totalPRs.toLocaleString());
    console.log("  Total Issues:", stats.totalIssues.toLocaleString());
    console.log("  Total Repos:", stats.contributedTo.toLocaleString());
    console.log("  Rank:", stats.rank);
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }
}

testStats();
