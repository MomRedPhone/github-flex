/**
 * Test script for language stats SVG card generation
 * Run with: node sandbox/test-languages-svg.js
 *
 * This will generate SVG files that you can open in a browser
 */

import { writeFileSync } from "fs";
import { fetchLanguageStats, getTopLanguages } from "../dist/lib/languages.js";
import { generateCard, generateLanguageItem } from "../dist/lib/card.js";
import { ThemeName } from "../dist/lib/types.js";
import { themes } from "../dist/lib/themes.js";

async function testLanguagesSVG() {
  console.log("Testing Language Stats SVG Generation\n");
  console.log("=".repeat(50));

  const username = process.argv[2] || "torvalds";
  const themeArg = process.argv[3] || "default";
  const theme = Object.values(ThemeName).includes(themeArg)
    ? themeArg
    : ThemeName.Default;
  const count = parseInt(process.argv[4]) || 5;
  const exclude = process.argv[5] || "";
  const token = process.env.GITHUB_TOKEN;

  console.log(`\nGenerating language stats card for: ${username}`);
  console.log(`Theme: ${theme}`);
  console.log(`Languages to show: ${count}`);
  if (exclude) {
    console.log(`Excluding: ${exclude}`);
  }

  try {
    console.log("\nFetching language stats...");
    const stats = await fetchLanguageStats(username, token, exclude);
    const topLanguages = getTopLanguages(stats, count);

    if (topLanguages.length === 0) {
      throw new Error("No languages found");
    }

    console.log("Generating SVG card...");
    const colors = themes[theme];

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

    const cardHeight = 90 + topLanguages.length * 50;

    const svg = generateCard(languageItems, {
      title: "Most Used Languages",
      width: 450,
      height: cardHeight,
      theme: theme,
      hideBorder: false,
    });

    const filename = `sandbox/output-${username}-languages-${theme}.svg`;
    writeFileSync(filename, svg);

    console.log(`\n✅ Success! SVG saved to: ${filename}`);
    console.log("Open this file in a browser to view the badge\n");
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }
}

testLanguagesSVG();
