/**
 * Card generation utilities for GitHub Flex badges
 */

import { CardOptions, ThemeName } from "./types.js";
import { themes } from "./themes.js";

/**
 * Generates an SVG card wrapper
 */
export function generateCard(content: string, options: CardOptions): string {
  const {
    title,
    width = 500,
    height = 200,
    theme = ThemeName.Default,
    borderRadius = 4.5,
    hideBorder = false,
  } = options;

  const colors = themes[theme];

  // Hand-drawn sketch effect using SVG filter
  const sketchFilter = `
    <filter id="sketch">
      <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  `;

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"
         xmlns="http://www.w3.org/2000/svg" role="img">
      <title>${escapeXml(title)}</title>
      <defs>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Indie+Flower&amp;family=Permanent+Marker&amp;display=swap');

          .header {
            font: 700 22px 'Permanent Marker', 'Comic Sans MS', cursive;
            fill: ${colors.title};
          }
          .stat {
            font: 400 14px 'Indie Flower', 'Comic Sans MS', cursive;
            fill: ${colors.text};
          }
          .stat-label {
            font: 400 13px 'Indie Flower', 'Comic Sans MS', cursive;
            fill: ${colors.text};
          }
          .stat-value {
            font: 700 16px 'Indie Flower', 'Comic Sans MS', cursive;
            fill: ${colors.title};
          }
          .stagger {
            opacity: 0;
            animation: fadeInAnimation 0.4s ease-in-out forwards;
          }
          @keyframes fadeInAnimation {
            from {
              opacity: 0;
              transform: translateY(-5px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        </style>
        ${sketchFilter}
      </defs>

      <!-- Hand-drawn style background -->
      ${
        hideBorder
          ? `<rect x="0" y="0" width="100%" height="100%" fill="${colors.bg}" rx="${borderRadius}"/>`
          : `
      <path d="M ${borderRadius} 1
               L ${width - borderRadius} 1
               Q ${width - 2} 1 ${width - 2} ${borderRadius}
               L ${width - 2} ${height - borderRadius}
               Q ${width - 1} ${height - 2} ${width - borderRadius} ${height - 2}
               L ${borderRadius} ${height - 2}
               Q 2 ${height - 1} 2 ${height - borderRadius}
               L 2 ${borderRadius}
               Q 1 2 ${borderRadius} 1 Z"
            fill="${colors.bg}"
            stroke="${colors.border}"
            stroke-width="2.5"
            filter="url(#sketch)"/>
      `
      }

      <!-- Title with playful rotation -->
      <g transform="translate(25, 30) rotate(-1)">
        <text class="header" y="0">${escapeXml(title)}</text>
        <!-- Underline doodle -->
        <path d="M 0 8 Q 50 10, 100 8 T 200 8"
              stroke="${colors.title}"
              stroke-width="2"
              fill="none"
              opacity="0.5"/>
      </g>

      <!-- Stats container -->
      <g>
        ${content}
      </g>
    </svg>
  `;
}

/**
 * Gets the appropriate icon SVG for a given stat type
 */
function getStatIcon(label: string): string {
  const icons: Record<string, string> = {
    star: `<path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"/>`,
    commits: `<path fill-rule="evenodd" d="M1.643 3.143L.427 1.927A.25.25 0 000 2.104V5.75c0 .138.112.25.25.25h3.646a.25.25 0 00.177-.427L2.715 4.215a6.5 6.5 0 11-1.18 4.458.75.75 0 10-1.493.154 8.001 8.001 0 101.6-5.684zM7.75 4a.75.75 0 01.75.75v2.992l2.028.812a.75.75 0 01-.557 1.392l-2.5-1A.75.75 0 017 8.25v-3.5A.75.75 0 017.75 4z"/>`,
    prs: `<path fill-rule="evenodd" d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z"/>`,
    issues: `<path fill-rule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"/>`,
    contribs: `<path fill-rule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/>`,
  };

  const iconMap: Record<string, string> = {
    "Total Stars": icons.star,
    "Total Commits": icons.commits,
    "Total PRs": icons.prs,
    "Total Issues": icons.issues,
    "Total Repos": icons.contribs,
  };

  return iconMap[label] || icons.star; // Default to star if not found
}

/**
 * Generates a stat item for the card with a playful card-style layout
 * FIXED VERSION - Nested transforms properly
 */
export function generateStatItem(
  label: string,
  value: string | number,
  index: number,
): string {
  // Arrange stats in a 2-column grid layout with playful rotations
  const col = index % 2;
  const row = Math.floor(index / 2);

  const xOffset = 20 + col * 240;
  const yOffset = 55 + row * 60;

  // Playful rotations alternating between slight angles
  const rotations = [-1.5, 1.2, 0.8, -1, 1.5];
  const rotation = rotations[index % rotations.length];

  const icon = getStatIcon(label);

  return `
    <g class="stagger" style="animation-delay: ${index * 100}ms">
      <g transform="translate(${xOffset}, ${yOffset}) rotate(${rotation})">
        <!-- Stat card background with hand-drawn feel -->
        <rect x="0" y="0" width="220" height="45" rx="8" ry="8"
              fill="rgba(255,255,255,0.05)"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-dasharray="3,3"
              opacity="0.4"/>

        <!-- Icon -->
        <svg x="8" y="8" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" opacity="0.6">
          ${icon}
        </svg>

        <!-- Stat label -->
        <text class="stat-label" x="30" y="20">${escapeXml(label)}</text>

        <!-- Stat value -->
        <text class="stat-value" x="30" y="36">${escapeXml(String(value))}</text>
      </g>
    </g>
  `;
}

/**
 * Generates a language stat item with playful card styling
 */
export function generateLanguageItem(
  name: string,
  percent: number,
  index: number,
  color: string,
  borderColor: string,
): string {
  const yOffset = 55 + index * 50;
  const barWidth = (percent / 100) * 360;

  return `
    <g class="stagger" style="animation-delay: ${index * 100}ms">
      <g transform="translate(20, ${yOffset})">
        <!-- Language card background -->
        <rect x="0" y="0" width="410" height="40" rx="8" ry="8"
              fill="rgba(255,255,255,0.03)"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-dasharray="3,3"
              opacity="0.3"/>

        <!-- Language name and percentage -->
        <text class="stat-label" x="15" y="16">${escapeXml(name)}</text>
        <text class="stat-value" x="385" y="16" text-anchor="end">${percent.toFixed(1)}%</text>

        <!-- Progress bar background -->
        <rect x="15" y="22" width="380" height="10" rx="5" ry="5"
              fill="none"
              stroke="${borderColor}"
              stroke-width="1"
              opacity="0.3"/>

        <!-- Progress bar fill with sketch effect -->
        <rect x="15" y="22" width="${barWidth}" height="10" rx="5" ry="5"
              fill="${color}"
              opacity="0.8"
              filter="url(#sketch)"/>
      </g>
    </g>
  `;
}

/**
 * Escapes text for safe use in SVG
 */
export function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/</g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
