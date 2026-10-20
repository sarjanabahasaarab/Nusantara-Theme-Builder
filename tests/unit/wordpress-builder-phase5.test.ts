/**
 * Nusantara Theme Builder — Phase 5 WordPress Builder Unit Tests
 * Pengujian komprehensif generator theme.json, blok Gutenberg, validasi, dan paket ZIP
 * Lisensi: MIT
 */

import { describe, it, expect } from 'vitest';
import { getDefaultWordPressSettings } from '../../src/features/wordpress/utils/defaultWordPressSettings';
import { generateThemeJson } from '../../src/features/wordpress/generator/WordPressThemeJsonGenerator';
import {
  serializeComponentToGutenberg,
  serializeComponentsToTemplateHtml
} from '../../src/features/wordpress/generator/WordPressBlockSerializer';
import {
  generateStyleCss,
  generateFunctionsPhp,
  generatePatternPhp,
  generateReadmeTxt
} from '../../src/features/wordpress/generator/WordPressPhpGenerator';
import { validateWordPressTheme } from '../../src/features/wordpress/validator/WordPressThemeValidator';
import { generateWordPressThemePackage } from '../../src/features/wordpress/generator/WordPressThemeGenerator';
import {
  parseStyleCssHeader,
  importWordPressThemeJson
} from '../../src/features/wordpress/importer/WordPressThemeImporter';
import { createWordPressZipBlob } from '../../src/features/wordpress/exporter/WordPressZipExporter';
import { ThemeComponent } from '../../src/types/project';

describe('WordPress Builder Phase 5 - Default Settings & theme.json', () => {
  it('harus menghasilkan default settings WordPress dengan struktur FSE lengkap', () => {
    const settings = getDefaultWordPressSettings();
    expect(settings.themeType).toBe('block');
    expect(settings.metadata.themeName).toBeTruthy();
    expect(settings.metadata.textDomain).toBeTruthy();
    expect(settings.templates.length).toBeGreaterThanOrEqual(4);
    expect(settings.templateParts.length).toBeGreaterThanOrEqual(2);
    expect(settings.customPatterns.length).toBeGreaterThanOrEqual(3);
  });

  it('harus menghasilkan theme.json versi 3 valid sesuai standar WordPress 6.x', () => {
    const settings = getDefaultWordPressSettings();
    const jsonStr = generateThemeJson(settings);
    const parsed = JSON.parse(jsonStr);

    expect(parsed.version).toBe(3);
    expect(parsed.settings.appearanceTools).toBe(true);
    expect(parsed.settings.color.palette.length).toBeGreaterThan(0);
    expect(parsed.settings.layout.contentSize).toBe('840px');
    expect(parsed.settings.layout.wideSize).toBe('1200px');
    expect(parsed.templateParts.length).toBeGreaterThanOrEqual(2);
  });
});

describe('WordPress Builder Phase 5 - Gutenberg Block Serializer', () => {
  it('harus menserialisasi komponen navigasi menjadi blok wp:navigation dan wp:site-title', () => {
    const comp: ThemeComponent = {
      id: 'nav-1',
      type: 'navigation',
      name: 'Header Nav',
      props: {
        brandText: 'Portal Nusantara',
        links: [{ label: 'Tentang', url: '/tentang' }]
      },
      styles: {}
    };

    const markup = serializeComponentToGutenberg(comp, 'tema-nusantara');
    expect(markup).toContain('<!-- wp:site-title');
    expect(markup).toContain('Portal Nusantara');
    expect(markup).toContain('<!-- wp:navigation');
    expect(markup).toContain('Tentang');
  });

  it('harus menserialisasi komponen hero menjadi cover/group blok Gutenberg', () => {
    const comp: ThemeComponent = {
      id: 'hero-1',
      type: 'hero',
      name: 'Banner Utama',
      props: {
        headline: 'Masa Depan Indonesia Digital',
        subheadline: 'Karya mandiri untuk bangsa',
        ctaText: 'Mulai',
        ctaLink: '#start'
      },
      styles: {}
    };

    const markup = serializeComponentToGutenberg(comp, 'tema-nusantara');
    expect(markup).toContain('<!-- wp:group');
    expect(markup).toContain('<!-- wp:heading');
    expect(markup).toContain('Masa Depan Indonesia Digital');
    expect(markup).toContain('<!-- wp:buttons');
    expect(markup).toContain('Mulai');
  });

  it('harus menserialisasi template lengkap dengan template part header dan footer', () => {
    const comp: ThemeComponent = {
      id: 'heading-1',
      type: 'heading',
      name: 'Judul Konten',
      props: { text: 'Halo Dunia', level: 2 },
      styles: {}
    };

    const html = serializeComponentsToTemplateHtml([comp], 'tema-nusantara', true, true);
    expect(html).toContain('<!-- wp:template-part {"slug":"header"');
    expect(html).toContain('<!-- wp:template-part {"slug":"footer"');
    expect(html).toContain('Halo Dunia');
  });
});

describe('WordPress Builder Phase 5 - PHP & style.css Generator', () => {
  it('harus menghasilkan style.css dengan header standar WordPress', () => {
    const settings = getDefaultWordPressSettings();
    const css = generateStyleCss(settings);

    expect(css).toContain(`Theme Name: ${settings.metadata.themeName}`);
    expect(css).toContain(`Text Domain: ${settings.metadata.textDomain}`);
    expect(css).toContain(`Version: ${settings.metadata.version}`);
    expect(css).toContain('Requires at least:');
    expect(css).toContain('Tested up to:');
    expect(css).toContain('Requires PHP:');
  });

  it('harus menghasilkan functions.php dengan pengecekan ABSPATH dan wp-block-styles', () => {
    const settings = getDefaultWordPressSettings();
    const php = generateFunctionsPhp(settings);

    expect(php).toContain("if ( ! defined( 'ABSPATH' ) )");
    expect(php).toContain("add_theme_support( 'wp-block-styles' )");
    expect(php).toContain("add_theme_support( 'title-tag' )");
    expect(php).toContain('wp_enqueue_style');
  });

  it('harus menghasilkan pattern header PHP standar', () => {
    const settings = getDefaultWordPressSettings();
    const pattern = settings.customPatterns[0];
    const php = generatePatternPhp(pattern, settings.metadata.textDomain);

    expect(php).toContain(`Title: ${pattern.title}`);
    expect(php).toContain(`Slug: ${settings.metadata.textDomain}/${pattern.name}`);
    expect(php).toContain('Categories:');
  });

  it('harus menghasilkan readme.txt dengan petunjuk instalasi wp-admin', () => {
    const settings = getDefaultWordPressSettings();
    const readme = generateReadmeTxt(settings);

    expect(readme).toContain(`=== ${settings.metadata.themeName} ===`);
    expect(readme).toContain('== Installation ==');
    expect(readme).toContain('Upload Theme');
  });
});

describe('WordPress Builder Phase 5 - Validator', () => {
  it('harus memvalidasi tema valid dengan status lulus dan skor tinggi', () => {
    const settings = getDefaultWordPressSettings();
    const result = validateWordPressTheme(settings);

    expect(result.isValid).toBe(true);
    expect(result.totalErrors).toBe(0);
    expect(result.scorePercent).toBeGreaterThanOrEqual(90);
  });

  it('harus mendeteksi galat jika nama tema kosong atau text domain tidak valid', () => {
    const settings = getDefaultWordPressSettings();
    settings.metadata.themeName = '';
    settings.metadata.textDomain = 'INVALID SPACES!';

    const result = validateWordPressTheme(settings);
    expect(result.isValid).toBe(false);
    expect(result.totalErrors).toBeGreaterThanOrEqual(2);
  });

  it('harus mendeteksi potensi risiko keamanan pada functions.php', () => {
    const settings = getDefaultWordPressSettings();
    settings.customFunctionsContent = '<?php eval(base64_decode("abc")); ?>';

    const result = validateWordPressTheme(settings);
    expect(result.isValid).toBe(false);
    expect(result.items.some((i) => i.id === 'sec-risky-functions')).toBe(true);
  });
});

describe('WordPress Builder Phase 5 - Importer & Exporter', () => {
  it('harus membaca metadata dari style.css yang diimpor', () => {
    const sampleCss = `/*
Theme Name: Tema Impor Uji
Author: Penguji
Version: 2.1.0
Text Domain: tema-uji
Description: Tema impor dari WordPress
*/`;

    const parsed = parseStyleCssHeader(sampleCss);
    expect(parsed.themeName).toBe('Tema Impor Uji');
    expect(parsed.author).toBe('Penguji');
    expect(parsed.version).toBe('2.1.0');
    expect(parsed.textDomain).toBe('tema-uji');
  });

  it('harus mengimpor theme.json v3 dengan sukses', () => {
    const sampleJson = JSON.stringify({
      version: 3,
      settings: {
        color: {
          palette: [{ slug: 'primary', color: '#ff0000', name: 'Merah' }]
        }
      }
    });

    const result = importWordPressThemeJson(sampleJson);
    expect(result.success).toBe(true);
    expect(result.appliedSettings?.themeJson?.settings?.color?.palette?.[0].color).toBe('#ff0000');
  });

  it('harus menyusun paket tema lengkap dan menghasilkan file ZIP', async () => {
    const settings = getDefaultWordPressSettings();
    const themePackage = generateWordPressThemePackage(settings);

    expect(themePackage.files.some((f) => f.path === 'style.css')).toBe(true);
    expect(themePackage.files.some((f) => f.path === 'theme.json')).toBe(true);
    expect(themePackage.files.some((f) => f.path === 'templates/index.html')).toBe(true);
    expect(themePackage.files.some((f) => f.path === 'parts/header.html')).toBe(true);
    expect(themePackage.files.some((f) => f.path.startsWith('patterns/'))).toBe(true);

    const zipBlob = await createWordPressZipBlob(themePackage);
    expect(zipBlob).toBeTruthy();
    expect(zipBlob.size).toBeGreaterThan(500);
  });
});
