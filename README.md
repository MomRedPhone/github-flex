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

> For a detailed example, check the paramters section below. Alternatively, you can also check the
> website to see the available themes and options: https://github-flex.vercel.app

## 🔌 Available Endpoints

### `/api/stats`

Display your GitHub statistics including stars, commits, PRs, issues, and contributed repositories.

**Parameters:**

- `username` (required) - Your GitHub username
- `theme` (optional) - `default`, `dark`, `radical`, `merko`, `gruvbox`, `tokyonight`, `bubblegum`, `ocean` (default:
  `default`)
- `hide_border` (optional) - `true` or `false` (default: `false`)
- `hide_title` (optional) - `true` or `false` (default: `false`)

**Examples:**

<p align="center">
  <img src="https://github-flex.vercel.app/api/stats?username=torvalds&theme=dark&hide_border=true" alt="Stats" />
  <img src="https://github-flex.vercel.app/api/stats?username=shadcn&theme=radical" alt="Stats" />
</p>

### `/api/languages`

Show your most used programming languages across all repositories.

**Parameters:**

- `username` (required) - Your GitHub username
- `theme` (optional) - `default`, `dark`, `radical`, `merko`, `gruvbox`, `tokyonight`, `bubblegum`, `ocean` (default:
  `default`)
- `langs_count` (optional) - Number of languages to display (default: `5`)
- `exclude` (optional) - Comma-separated list of languages to exclude (e.g., `HTML,CSS`)
- `hide_border` (optional) - `true` or `false` (default: `false`)
- `hide_title` (optional) - `true` or `false` (default: `false`)

**Examples:**

<p align="center">
  <img src="https://github-flex.vercel.app/api/languages?username=torvalds&theme=tokyonight" alt="Languages" />
  <img src="https://github-flex.vercel.app/api/languages?username=torvalds&langs_count=5" alt="Languages" />
</p>

### `/api/repo`

Display statistics for a specific repository including stars, forks, language, and open issues.

**Parameters:**

- `username` (required) - Repository owner's username
- `repo` (required) - Repository name
- `theme` (optional) - `default`, `dark`, `radical`, `merko`, `gruvbox`, `tokyonight`, `bubblegum`, `ocean` (default:
  `default`)
- `hide_border` (optional) - `true` or `false` (default: `false`)

**Examples:**

<p align="center">
  <img src="https://github-flex.vercel.app/api/repo?username=torvalds&repo=linux&theme=gruvbox" alt="Repo" />
  <img src="https://github-flex.vercel.app/api/repo?username=facebook&repo=react&hide_border=true" alt="Repo" />
</p>

## 💻 Local Development

```bash
# Install
pnpm install
# or: npm install

# Build
pnpm build
# or: npm run build

# Test without Vercel CLI
node sandbox/test-stats.js torvalds
node sandbox/test-languages.js torvalds 8
node sandbox/test-repo.js torvalds linux
node sandbox/test-svg.js torvalds dark
node sandbox/test-languages-svg.js torvalds dark 8
node sandbox/test-repo-svg.js torvalds linux dark
```

## ☁️ Deploy to Vercel

1. Fork this repo
2. Connect to [Vercel](https://vercel.com)
3. (Optional) Add `GITHUB_TOKEN` env variable for higher rate limits

## 💬 Feedback & Contributions

Got suggestions, issues, or ideas for improvement? Feel free to open an issue or submit a pull request.
Contributions are always welcome!

## 💎 Code Quality & Guidelines

In order to maintain a high-quality codebase, please adhere to the following guidelines when contributing:

- Follow the existing code style and conventions used in the project:
    - Adhere to `prettier` formatting rules for consistent code style. You can run `pnpm run format:check` to check for
      formatting issues and `pnpm run format:fix` to automatically fix them.
    - Follow `eslint` rules to ensure code quality and catch potential issues. You can run `pnpm run lint:check` to
      check for linting issues and `pnpm run lint:fix` to automatically fix them.
- Write clear and concise commit messages that describe the changes made.
- Fill in the PR template with the actual changes and relevant information when submitting a pull request.

## 📜 License

This project is licensed under the [MIT License](LICENSE).
