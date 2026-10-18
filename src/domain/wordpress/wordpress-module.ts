/**
 * Nusantara Theme Builder — Modul Domain WordPress
 * Menyiapkan arsitektur khusus WordPress yang akan dikembangkan pada Phase 5.
 * 
 * WordPress membedakan:
 * 1. Block Theme (Modern FSE):
 *    - theme.json
 *    - templates/ (index.html, single.html, archive.html)
 *    - parts/ (header.html, footer.html)
 *    - patterns/
 * 2. Classic Theme (Legacy):
 *    - style.css (Theme Header metadata)
 *    - functions.php
 *    - index.php, header.php, footer.php
 */

import { Project } from '../../types/project';
import { WordPressThemeJsonConfig } from '../../types/wordpress';

export interface WordPressExportReadiness {
  isReady: boolean;
  roadmapPhase: string;
  themeTypesSupported: string[];
  themeJsonDraft: WordPressThemeJsonConfig;
  styleCssHeaderDraft: string;
  requirementsSummary: string[];
  blockers: string[];
}

export function checkWordPressExportReadiness(project: Project): WordPressExportReadiness {
  const isWp = project.targetPlatform === 'wordpress';
  const blockers: string[] = [];

  if (!isWp) {
    blockers.push(`Proyek ini bertarget platform "${project.targetPlatform}", bukan WordPress.`);
  }

  // Phase 1 limitation notice (truthful implementation per specification I)
  blockers.push('ZIP Packager & Directory Tree Generator dijadwalkan pada Phase 5.');
  blockers.push('theme.json Compiler & Gutenberg block validator dijadwalkan pada Phase 5.');

  const themeJsonDraft: WordPressThemeJsonConfig = {
    version: 3,
    settings: {
      appearanceTools: true,
      color: {
        palette: [
          { slug: 'primary', color: project.themeSettings.primaryColor, name: 'Warna Utama' },
          { slug: 'secondary', color: project.themeSettings.secondaryColor, name: 'Warna Sekunder' },
          { slug: 'background', color: project.themeSettings.backgroundColor, name: 'Latar Belakang' },
          { slug: 'text', color: project.themeSettings.textColor, name: 'Warna Teks' }
        ]
      },
      typography: {
        fontFamilies: [
          {
            fontFamily: project.themeSettings.fontFamilySans,
            name: 'Font Utama',
            slug: 'primary'
          }
        ]
      },
      layout: {
        contentSize: '840px',
        wideSize: '1200px'
      }
    },
    styles: {
      color: {
        background: 'var(--wp--preset--color--background)',
        text: 'var(--wp--preset--color--text)'
      }
    }
  };

  const slug = project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const styleCssHeaderDraft = `/*
Theme Name: ${project.name}
Theme URI: https://github.com/nusantara-theme-builder/${slug}
Author: ${project.metadata.author || 'Pengembang Nusantara'}
Author URI: https://nusantara-builder.local
Description: ${project.metadata.description || 'Tema WordPress dibuat dengan Nusantara Theme Builder'}
Version: ${project.metadata.version || '0.1.0'}
Requires at least: 6.4
Tested up to: 6.7
Requires PHP: 7.4
License: MIT
License URI: https://opensource.org/licenses/MIT
Text Domain: ${slug}
Tags: ${project.metadata.tags.join(', ')}
*/`;

  return {
    isReady: false,
    roadmapPhase: 'Phase 5 (WordPress Builder & ZIP Packaging)',
    themeTypesSupported: ['Block Theme (Gutenberg Full Site Editing)', 'Classic PHP Theme (Legacy)'],
    themeJsonDraft,
    styleCssHeaderDraft,
    requirementsSummary: [
      'Penyusunan file style.css dengan metadata standar WordPress',
      'Penyusunan theme.json v3 untuk FSE block theme',
      'Pemisahan Block Patterns dan Template Parts',
      'Pembuatan berkas ZIP terkompresi tanpa dependensi server eksternal'
    ],
    blockers
  };
}
