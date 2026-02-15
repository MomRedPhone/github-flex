/**
 * Theme names enum
 */
export enum ThemeName {
  Default = "default",
  Dark = "dark",
  Radical = "radical",
  Merko = "merko",
  Gruvbox = "gruvbox",
  TokyoNight = "tokyonight",
  Bubblegum = "bubblegum",
  Ocean = "ocean",
}

/**
 * Theme color configuration
 */
export interface Theme {
  bg: string;
  title: string;
  text: string;
  icon: string;
  border: string;
}

/**
 * Card generation options
 */
export interface CardOptions {
  title: string;
  width?: number;
  height?: number;
  theme?: ThemeName;
  borderRadius?: number;
  hideBorder?: boolean;
}

/**
 * GitHub user statistics
 */
export interface GitHubStats {
  username: string;
  totalStars: number;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  contributedTo: number;
  rank: string;
}

/**
 * GitHub repository data
 */
export interface GitHubRepo {
  name: string;
  stargazers_count: number;
  forks_count: number;
}

/**
 * Language statistics (language name -> bytes)
 */
export interface LanguageStats {
  [language: string]: number;
}

/**
 * Language data with percentage
 */
export interface LanguageData {
  name: string;
  percent: number;
  bytes: number;
}

/**
 * Internal GitHub API types
 */
export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: unknown[];
}

export interface GitHubRepoItem {
  name: string;
  fork: boolean;
  languages_url: string;
}

/**
 * Repository data for display
 */
export interface RepoData {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  openIssues: number;
}

/**
 * GitHub API repository response
 */
export interface GitHubRepoResponse {
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  open_issues_count: number;
}
