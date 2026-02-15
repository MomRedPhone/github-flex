# Sandbox Testing Scripts

This folder contains standalone test scripts to validate the GitHub Flex functionality without deploying to Vercel.

## ⚙️ Prerequisites

1. Build the TypeScript code first:
   ```bash
   pnpm build
   # or: npm run build
   ```

2. (Optional) Set your GitHub token:
   ```bash
   export GITHUB_TOKEN=your_token_here
   ```

## 🧪 Available Test Scripts

### 1. Test Stats Fetcher

Tests the GitHub stats fetching functionality:

```bash
node sandbox/test-stats.js [username]
```

**Examples:**

```bash
node sandbox/test-stats.js torvalds
node sandbox/test-stats.js octocat
```

---

### 2. Test Language Stats

Tests the language statistics fetching:

```bash
node sandbox/test-languages.js [username] [count]
```

**Examples:**

```bash
node sandbox/test-languages.js torvalds
node sandbox/test-languages.js octocat 8
```

**Output:**

- Top N languages by bytes
- Percentage breakdown

---

### 3. Test Language SVG Generation

Generates language stats SVG files that you can open in a browser:

```bash
node sandbox/test-languages-svg.js [username] [theme] [count] [exclude]
```

**Examples:**

```bash
node sandbox/test-languages-svg.js torvalds dark 8
node sandbox/test-languages-svg.js octocat tokyonight 5 "HTML,CSS"
```

**Output:**

- SVG file saved to `sandbox/output-{username}-languages-{theme}.svg`
- Open the file in any web browser to view the badge

---

### 4. Test SVG Generation

Generates actual SVG files that you can open in a browser:

```bash
node sandbox/test-svg.js [username] [theme]
```

**Examples:**

```bash
node sandbox/test-svg.js torvalds dark
node sandbox/test-svg.js octocat tokyonight
```

**Available themes:**

- `default` - Warm playful theme with hand-written feel
- `dark` - Dark mode with vibrant accents
- `radical` - Pink and cyan cyberpunk
- `merko` - Green terminal vibes
- `gruvbox` - Retro warm colors
- `tokyonight` - Cyberpunk aesthetics
- `bubblegum` - Pink and purple playful
- `ocean` - Blue aquatic theme

**Output:**

- SVG file saved to `sandbox/output-{username}-{theme}.svg`
- Open the file in any web browser to view the badge

---

### 5. Test Repository Stats

Tests the repository statistics fetching:

```bash
node sandbox/test-repo.js [owner] [repo]
```

**Examples:**

```bash
node sandbox/test-repo.js torvalds linux
node sandbox/test-repo.js facebook react
```

**Output:**

- Repository name and description
- Stars, forks, language, and open issues

---

### 6. Test Repository SVG Generation

Generates repository stats SVG files that you can open in a browser:

```bash
node sandbox/test-repo-svg.js [owner] [repo] [theme]
```

**Examples:**

```bash
node sandbox/test-repo-svg.js torvalds linux dark
node sandbox/test-repo-svg.js facebook react gruvbox
```

**Output:**

- SVG file saved to `sandbox/output-{owner}-{repo}-{theme}.svg`
- Open the file in any web browser to view the badge

---

### 7. Test Mock Stats SVG (No API Required)

Generates stats SVG files with mock data (useful when GitHub API is rate-limited):

```bash
node sandbox/test-stats-mock.js
```

**Output:**

- Generates SVG files for all themes with mock data
- No GitHub API calls required
- Perfect for testing styling changes

---

## 🔧 Troubleshooting

### "Cannot find module" error

Make sure you've built the TypeScript code:

```bash
pnpm build
# or: npm run build
```

### Rate limit errors

Set a GitHub token to increase rate limits:

```bash
export GITHUB_TOKEN=your_token_here
```

Or create a `.env` file in the project root:

```
GITHUB_TOKEN=your_token_here
```

---

## 🎯 Next Steps

Once you've verified everything works locally with these test scripts, you can:

1. **Run with Vercel CLI** for full endpoint testing:
   ```bash
   pnpm dev
   # or: npm run dev
   ```

2. **Deploy to Vercel** for production use

3. **Use the badges** in your GitHub profile README
