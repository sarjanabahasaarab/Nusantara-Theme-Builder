/**
 * Nusantara Theme Builder — WordPress theme.json Generator
 * Menghasilkan spesifikasi resmi theme.json v3 untuk WordPress Full Site Editing
 * Lisensi: MIT
 */

import { WordPressSettings, WordPressThemeJsonConfig } from '../types/wordpress';

export function generateThemeJson(settings: WordPressSettings): string {
  const cfg = settings.themeJson;

  const themeJsonOutput: WordPressThemeJsonConfig = {
    $schema: 'https://schemas.wp.org/trunk/theme.json',
    version: 3,
    settings: {
      appearanceTools: cfg?.settings?.appearanceTools ?? true,
      useRootPaddingAwareAlignments: cfg?.settings?.useRootPaddingAwareAlignments ?? true,
      color: {
        palette: cfg?.settings?.color?.palette || [],
        custom: cfg?.settings?.color?.custom ?? true,
        defaultPalette: cfg?.settings?.color?.defaultPalette ?? false
      },
      typography: {
        fontFamilies: cfg?.settings?.typography?.fontFamilies || [],
        fontSizes: cfg?.settings?.typography?.fontSizes || [],
        fluid: cfg?.settings?.typography?.fluid ?? true,
        customFontSize: cfg?.settings?.typography?.customFontSize ?? true,
        lineHeight: cfg?.settings?.typography?.lineHeight ?? true
      },
      spacing: {
        blockGap: cfg?.settings?.spacing?.blockGap ?? true,
        margin: cfg?.settings?.spacing?.margin ?? true,
        padding: cfg?.settings?.spacing?.padding ?? true,
        units: cfg?.settings?.spacing?.units || ['px', 'rem', 'em', '%', 'vh', 'vw']
      },
      layout: {
        contentSize: cfg?.settings?.layout?.contentSize || '840px',
        wideSize: cfg?.settings?.layout?.wideSize || '1200px'
      },
      dimensions: {
        aspectRatio: true,
        minHeight: true
      },
      border: {
        color: true,
        radius: true,
        style: true,
        width: true
      }
    },
    styles: cfg?.styles || {
      color: {
        background: 'var(--wp--preset--color--background)',
        text: 'var(--wp--preset--color--text)'
      },
      typography: {
        fontFamily: 'var(--wp--preset--font-family--primary)',
        fontSize: 'var(--wp--preset--font-size--medium)',
        lineHeight: '1.6'
      }
    },
    templateParts: settings.templateParts.map((part) => ({
      name: part.id,
      title: part.title,
      area: part.area || 'general'
    }))
  };

  return JSON.stringify(themeJsonOutput, null, 2);
}
