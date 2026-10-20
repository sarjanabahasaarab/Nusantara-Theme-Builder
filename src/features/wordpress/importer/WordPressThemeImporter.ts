/**
 * Nusantara Theme Builder — WordPress Theme Importer
 * Mengimpor berkas tema WordPress (theme.json, style.css, atau template HTML Gutenberg)
 * Lisensi: MIT
 */

import { WordPressSettings, WordPressThemeMetadata } from '../types/wordpress';

export interface WordPressImportResult {
  success: boolean;
  message: string;
  appliedSettings?: Partial<WordPressSettings>;
  warnings: string[];
}

export function parseStyleCssHeader(cssContent: string): Partial<WordPressThemeMetadata> {
  const result: Partial<WordPressThemeMetadata> = {};

  const themeNameMatch = cssContent.match(/Theme Name:\s*([^\r\n*]+)/i);
  if (themeNameMatch) result.themeName = themeNameMatch[1].trim();

  const themeUriMatch = cssContent.match(/Theme URI:\s*([^\r\n*]+)/i);
  if (themeUriMatch) result.themeUri = themeUriMatch[1].trim();

  const authorMatch = cssContent.match(/Author:\s*([^\r\n*]+)/i);
  if (authorMatch) result.author = authorMatch[1].trim();

  const authorUriMatch = cssContent.match(/Author URI:\s*([^\r\n*]+)/i);
  if (authorUriMatch) result.authorUri = authorUriMatch[1].trim();

  const descMatch = cssContent.match(/Description:\s*([^\r\n*]+)/i);
  if (descMatch) result.description = descMatch[1].trim();

  const versionMatch = cssContent.match(/Version:\s*([^\r\n*]+)/i);
  if (versionMatch) result.version = versionMatch[1].trim();

  const textDomainMatch = cssContent.match(/Text Domain:\s*([^\r\n*]+)/i);
  if (textDomainMatch) result.textDomain = textDomainMatch[1].trim();

  const tagsMatch = cssContent.match(/Tags:\s*([^\r\n*]+)/i);
  if (tagsMatch) {
    result.tags = tagsMatch[1]
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }

  return result;
}

export function importWordPressThemeJson(jsonString: string): WordPressImportResult {
  const warnings: string[] = [];

  try {
    const parsed = JSON.parse(jsonString);

    if (parsed.version !== 2 && parsed.version !== 3) {
      warnings.push(`Versi theme.json adalah ${parsed.version}. Format akan disesuaikan ke versi 3.`);
    }

    const appliedSettings: Partial<WordPressSettings> = {
      themeJson: {
        $schema: 'https://schemas.wp.org/trunk/theme.json',
        version: 3,
        settings: parsed.settings || {},
        styles: parsed.styles || {}
      }
    };

    return {
      success: true,
      message: 'Konfigurasi theme.json berhasil diimpor dan disinkronkan.',
      appliedSettings,
      warnings
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Gagal membaca file theme.json: ${err.message}`,
      warnings: ['Pastikan format JSON valid tanpa trailing comma.']
    };
  }
}

export function importWordPressFileContent(
  filename: string,
  content: string
): WordPressImportResult {
  const warnings: string[] = [];
  const lower = filename.toLowerCase();

  if (lower.endsWith('theme.json')) {
    return importWordPressThemeJson(content);
  }

  if (lower.endsWith('style.css')) {
    const parsedMeta = parseStyleCssHeader(content);
    if (!parsedMeta.themeName) {
      return {
        success: false,
        message: 'Tidak ditemukan blok komentar metadata WordPress di style.css.',
        warnings: ['File style.css harus diawali komentar "/* Theme Name: ... */".']
      };
    }

    return {
      success: true,
      message: `Metadata tema "${parsedMeta.themeName}" berhasil diimpor dari style.css.`,
      appliedSettings: {
        metadata: {
          themeName: parsedMeta.themeName || 'Tema Impor',
          themeUri: parsedMeta.themeUri || '',
          author: parsedMeta.author || 'Pengembang',
          authorUri: parsedMeta.authorUri || '',
          description: parsedMeta.description || '',
          version: parsedMeta.version || '1.0.0',
          requiresAtLeast: '6.4',
          testedUpTo: '6.7',
          requiresPhp: '7.4',
          license: 'GPL v2 or later',
          licenseUri: 'http://www.gnu.org/licenses/gpl-2.0.html',
          textDomain: parsedMeta.textDomain || 'tema-impor',
          tags: parsedMeta.tags || ['block-theme']
        }
      },
      warnings
    };
  }

  return {
    success: false,
    message: `Tipe berkas "${filename}" belum didukung untuk impor langsung.`,
    warnings: ['Silakan impor theme.json atau style.css.']
  };
}
