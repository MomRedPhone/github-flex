/**
 * Theme definitions for GitHub Flex badges
 */

import { Theme, ThemeName } from "./types.js";

/**
 * Available themes with color configurations
 */
export const themes: Record<ThemeName, Theme> = {
  [ThemeName.Default]: {
    bg: "#fffef9",
    title: "#ff6b6b",
    text: "#5f6368",
    icon: "#4ecdc4",
    border: "#ff6b6b",
  },
  [ThemeName.Dark]: {
    bg: "#1a1a2e",
    title: "#f4d35e",
    text: "#e8e8e8",
    icon: "#95e1d3",
    border: "#f4d35e",
  },
  [ThemeName.Radical]: {
    bg: "#141321",
    title: "#ff6bcb",
    text: "#a9fef7",
    icon: "#ffd93d",
    border: "#ff6bcb",
  },
  [ThemeName.Merko]: {
    bg: "#0f1c14",
    title: "#c1ff72",
    text: "#68b587",
    icon: "#ffeb3b",
    border: "#c1ff72",
  },
  [ThemeName.Gruvbox]: {
    bg: "#282828",
    title: "#fabd2f",
    text: "#8ec07c",
    icon: "#fe8019",
    border: "#fabd2f",
  },
  [ThemeName.TokyoNight]: {
    bg: "#1a1b27",
    title: "#70a5fd",
    text: "#38bdae",
    icon: "#bf91f3",
    border: "#70a5fd",
  },
  [ThemeName.Bubblegum]: {
    bg: "#fff0f5",
    title: "#ff1493",
    text: "#8b4789",
    icon: "#ff69b4",
    border: "#ff69b4",
  },
  [ThemeName.Ocean]: {
    bg: "#e0f7ff",
    title: "#0077be",
    text: "#2c5f7c",
    icon: "#00d4ff",
    border: "#00a8e8",
  },
};
