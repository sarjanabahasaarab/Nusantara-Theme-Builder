/**
 * Nusantara Theme Builder — WordPress Theme Screenshot Generator
 * Menghasilkan file screenshot.png standar 1200x900 untuk wp-admin Appearance > Themes
 * Lisensi: MIT
 */

import { WordPressSettings } from '../types/wordpress';

export function generateScreenshotSvg(settings: WordPressSettings): string {
  const name = settings.metadata.themeName;
  const author = settings.metadata.author;
  const primary = settings.themeJson.settings.color?.palette?.find(c => c.slug === 'primary')?.color || '#2563eb';
  const secondary = settings.themeJson.settings.color?.palette?.find(c => c.slug === 'secondary')?.color || '#1e293b';
  const accent = settings.themeJson.settings.color?.palette?.find(c => c.slug === 'accent')?.color || '#f59e0b';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${secondary}"/>
      <stop offset="100%" stop-color="#09090b"/>
    </linearGradient>
    <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${primary}"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="900" fill="url(#bgGrad)"/>

  <!-- Top Mockup Browser Bar -->
  <rect x="100" y="80" width="1000" height="740" rx="20" fill="#18181b" stroke="#27272a" stroke-width="2"/>
  <rect x="100" y="80" width="1000" height="60" rx="20" fill="#27272a"/>
  <!-- Window Dots -->
  <circle cx="140" cy="110" r="8" fill="#ef4444"/>
  <circle cx="170" cy="110" r="8" fill="#eab308"/>
  <circle cx="200" cy="110" r="8" fill="#22c55e"/>

  <!-- Theme Header in Canvas -->
  <rect x="150" y="180" width="900" height="80" rx="12" fill="#27272a"/>
  <text x="180" y="230" fill="#ffffff" font-family="system-ui, sans-serif" font-size="24" font-weight="bold">${name}</text>
  <rect x="850" y="200" width="160" height="40" rx="8" fill="url(#primaryGrad)"/>
  <text x="930" y="226" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="600" text-anchor="middle">Jelajah</text>

  <!-- Hero Section -->
  <rect x="150" y="280" width="900" height="240" rx="16" fill="url(#primaryGrad)"/>
  <text x="600" y="370" fill="#ffffff" font-family="system-ui, sans-serif" font-size="38" font-weight="900" text-anchor="middle">${name}</text>
  <text x="600" y="420" fill="#dbeafe" font-family="system-ui, sans-serif" font-size="20" text-anchor="middle">WordPress 6.x Block Theme (Full Site Editing)</text>
  <rect x="520" y="450" width="160" height="44" rx="10" fill="${accent}"/>
  <text x="600" y="478" fill="#09090b" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">Aktifkan Tema</text>

  <!-- Cards Section -->
  <rect x="150" y="540" width="280" height="230" rx="12" fill="#27272a"/>
  <rect x="170" y="560" width="240" height="120" rx="8" fill="#3f3f46"/>
  <rect x="170" y="700" width="180" height="20" rx="4" fill="#71717a"/>
  <rect x="170" y="730" width="120" height="14" rx="4" fill="#52525b"/>

  <rect x="460" y="540" width="280" height="230" rx="12" fill="#27272a"/>
  <rect x="480" y="560" width="240" height="120" rx="8" fill="#3f3f46"/>
  <rect x="480" y="700" width="180" height="20" rx="4" fill="#71717a"/>
  <rect x="480" y="730" width="120" height="14" rx="4" fill="#52525b"/>

  <rect x="770" y="540" width="280" height="230" rx="12" fill="#27272a"/>
  <rect x="790" y="560" width="240" height="120" rx="8" fill="#3f3f46"/>
  <rect x="790" y="700" width="180" height="20" rx="4" fill="#71717a"/>
  <rect x="790" y="730" width="120" height="14" rx="4" fill="#52525b"/>

  <!-- Footer Watermark -->
  <text x="600" y="855" fill="#71717a" font-family="system-ui, sans-serif" font-size="14" text-anchor="middle">Dibuat dengan Nusantara Theme Builder • Oleh ${author}</text>
</svg>`;
}
