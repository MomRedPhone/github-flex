/**
 * Test script for GitHub repository stats functionality
 * Run with: node sandbox/test-repo.js OWNER REPO
 * Example: node sandbox/test-repo.js torvalds linux
 */

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

async function testRepoStats() {
  console.log("Testing GitHub Repository Stats Fetcher\n");
  console.log("=".repeat(50));

  const owner = process.argv[2] || "torvalds";
  const repo = process.argv[3] || "linux";
  const token = process.env.GITHUB_TOKEN;

  console.log(`\nFetching stats for: ${owner}/${repo}`);
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
    const stats = await fetchRepoStats(owner, repo, token);
    const endTime = Date.now();

    console.log("\n✅ Success! Stats fetched in", endTime - startTime, "ms\n");
    console.log("Results:");
    console.log("  Name:", stats.name);
    console.log("  Description:", stats.description);
    console.log("  Stars:", stats.stars.toLocaleString());
    console.log("  Forks:", stats.forks.toLocaleString());
    console.log("  Language:", stats.language);
    console.log("  Open Issues:", stats.openIssues.toLocaleString());
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }
}

testRepoStats();
