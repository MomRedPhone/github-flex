# GitHub Flex

Flex your GitHub stats with customizable SVG badges for your profile. Because your GitHub profile deserves to look as
good as your code...right?!

## 🚀 Quick Start

Use the following Markdown snippets to add your GitHub stats, languages, or specific repo info to your profile README:

```markdown
![Stats](https://github-flex.vercel.app/api/stats?username=YOUR_USERNAME&theme=dark)
![Languages](https://github-flex.vercel.app/api/languages?username=YOUR_USERNAME)
![Repo](https://github-flex.vercel.app/api/repo?username=OWNER&repo=REPO_NAME)
```

## 🔌 Available Endpoints

### `/api/stats`

**Parameters:**

- `username` (required)
- `theme` - `default`, `dark`, `radical`, `merko`, `gruvbox`, `tokyonight`
- `hide_border` - `true` or `false`
- `hide_title` - `true` or `false`

### `/api/languages`

**Parameters:**

- `username` (required)
- `theme` - same as above
- `langs_count` - number (default: 5)
- `exclude` - comma-separated languages to exclude (e.g., `HTML,CSS`)
- `hide_border`, `hide_title`

### `/api/repo`

**Parameters:**

- `username` (required)
- `repo` (required)
- `theme`, `hide_border`

## 💻 Local Development

```bash
# Install
pnpm install
# or: npm install

# Build
pnpm build
# or: npm run build

# Run with Vercel CLI
vercel dev

# Test without Vercel CLI
node sandbox/test-stats.js torvalds
node sandbox/test-languages.js torvalds 8
node sandbox/test-svg.js torvalds dark
node sandbox/test-languages-svg.js torvalds dark 8
```

## ☁️ Deploy to Vercel

1. Fork this repo
2. Connect to [Vercel](https://vercel.com)
3. (Optional) Add `GITHUB_TOKEN` env variable for higher rate limits

## 📜 License

This project is licensed under the [MIT License](LICENSE).
