/**
 * Test script for stats SVG generation with mock data
 * Run with: node sandbox/test-stats-mock.js
 */

import { writeFileSync } from "fs";
import { generateCard, generateStatItem } from "../dist/lib/card.js";
import { ThemeName } from "../dist/lib/types.js";

console.log("Generating mock stats card...\n");

// Mock stats data
const statItems = [
  generateStatItem("Total Stars", "1,234", 0),
  generateStatItem("Total Commits", "5,678", 1),
  generateStatItem("Total PRs", "432", 2),
  generateStatItem("Total Issues", "89", 3),
  generateStatItem("Total Repos", "56", 4),
].join("");

// Test with different themes
const themes = [
  ThemeName.Default,
  ThemeName.Dark,
  ThemeName.Bubblegum,
  ThemeName.Ocean,
];

themes.forEach((theme) => {
  const svg = generateCard(statItems, {
    title: `Test User's GitHub Stats`,
    width: 500,
    height: 240,
    theme: theme,
    hideBorder: false,
  });

  const filename = `sandbox/output-mock-stats-${theme}.svg`;
  writeFileSync(filename, svg);
  console.log(`✅ Generated: ${filename}`);
});

console.log("\n✨ Done! Open the SVG files in your browser to view them.\n");
