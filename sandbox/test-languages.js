/**
 * Test script for language stats functionality
 * Run with: node sandbox/test-languages.js
 */

import { fetchLanguageStats, getTopLanguages } from "../lib/languages.js";

async function testLanguageStats() {
  console.log("Testing Language Stats Fetcher\n");
  console.log("=".repeat(50));

  const username = process.argv[2] || "torvalds";
  const count = parseInt(process.argv[3]) || 5;
  const token = process.env.GITHUB_TOKEN;

  console.log(`\nFetching language stats for: ${username}`);
  console.log(`Top languages to show: ${count}`);

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
    const stats = await fetchLanguageStats(username, token);
    const topLanguages = getTopLanguages(stats, count);
    const endTime = Date.now();

    console.log(
      "\n✅ Success! Language stats fetched in",
      endTime - startTime,
      "ms\n",
    );
    console.log("Top Languages:");

    topLanguages.forEach((lang, index) => {
      console.log(`  ${index + 1}. ${lang.name}`);
      console.log(
        `     ${lang.percent.toFixed(2)}% (${lang.bytes.toLocaleString()} bytes)`,
      );
    });

    console.log(`\nTotal languages found: ${Object.keys(stats).length}`);
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }
}

testLanguageStats();
