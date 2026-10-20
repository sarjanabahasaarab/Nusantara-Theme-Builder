/**
 * Nusantara Theme Builder — WordPress Theme Validator
 * Validasi 4 Tingkat: Metadata Header, theme.json Schema, Gutenberg Block Markup, dan Standar Keamanan PHP
 * Lisensi: MIT
 */

import {
  WordPressSettings,
  WordPressValidationResult,
  WordPressValidationItem
} from '../types/wordpress';

export function validateWordPressTheme(settings: WordPressSettings): WordPressValidationResult {
  const items: WordPressValidationItem[] = [];

  // --- 1. Metadata & style.css Validation ---
  const meta = settings.metadata;
  if (!meta.themeName || meta.themeName.trim().length === 0) {
    items.push({
      id: 'meta-name-missing',
      type: 'error',
      category: 'metadata',
      file: 'style.css',
      message: 'Theme Name tidak boleh kosong.',
      recommendation: 'Isi nama tema yang jelas pada tab Metadata & Aset.'
    });
  }

  if (!meta.textDomain || !/^[a-z0-9-]+$/.test(meta.textDomain)) {
    items.push({
      id: 'meta-textdomain-invalid',
      type: 'error',
      category: 'metadata',
      file: 'style.css',
      message: 'Text Domain harus menggunakan huruf kecil, angka, atau tanda minus (-).',
      recommendation: 'Gunakan slug yang valid seperti "tema-nusantara".'
    });
  }

  if (!meta.version || !/^\d+\.\d+(\.\d+)?/.test(meta.version)) {
    items.push({
      id: 'meta-version-format',
      type: 'warning',
      category: 'metadata',
      file: 'style.css',
      message: 'Format versi sebaiknya mengikuti semver (misal: 1.0.0).',
      recommendation: 'Gunakan format versi SemVer standar WordPress.'
    });
  }

  if (!meta.license) {
    items.push({
      id: 'meta-license-missing',
      type: 'warning',
      category: 'metadata',
      file: 'style.css',
      message: 'Lisensi belum didefinisikan.',
      recommendation: 'WordPress mewajibkan tema berlisensi GPL v2 kompatibel.'
    });
  }

  if (!meta.requiresAtLeast) {
    items.push({
      id: 'meta-requires-missing',
      type: 'info',
      category: 'metadata',
      file: 'style.css',
      message: 'Header "Requires at least" sebaiknya ditentukan minimal WordPress 6.2+ untuk Block Theme.',
      recommendation: 'Cantumkan minimal versi 6.4.'
    });
  }

  // --- 2. theme.json Validation ---
  const tj = settings.themeJson;
  if (!tj) {
    items.push({
      id: 'tj-missing',
      type: 'error',
      category: 'theme-json',
      file: 'theme.json',
      message: 'theme.json tidak ditemukan pada Block Theme.',
      recommendation: 'Pastikan file theme.json digenerate dengan skema v3.'
    });
  } else {
    if (tj.version !== 3) {
      items.push({
        id: 'tj-version-outdated',
        type: 'warning',
        category: 'theme-json',
        file: 'theme.json',
        message: `Versi theme.json saat ini adalah ${tj.version}. WordPress 6.6+ merekomendasikan v3.`,
        recommendation: 'Gunakan versi 3 untuk fitur modern Full Site Editing.'
      });
    }

    const palette = tj.settings?.color?.palette || [];
    if (palette.length === 0) {
      items.push({
        id: 'tj-palette-empty',
        type: 'warning',
        category: 'theme-json',
        file: 'theme.json',
        message: 'Palet warna tema masih kosong.',
        recommendation: 'Tambahkan setidaknya warna primary, secondary, background, dan text.'
      });
    }

    const fontFamilies = tj.settings?.typography?.fontFamilies || [];
    if (fontFamilies.length === 0) {
      items.push({
        id: 'tj-fonts-empty',
        type: 'info',
        category: 'theme-json',
        file: 'theme.json',
        message: 'Belum ada deklarasi font khusus di theme.json.',
        recommendation: 'Tentukan font utama untuk sans dan heading.'
      });
    }
  }

  // --- 3. Templates & Template Parts Validation ---
  const hasIndexTemplate = settings.templates.some((t) => t.id === 'index');
  if (!hasIndexTemplate) {
    items.push({
      id: 'tpl-index-missing',
      type: 'error',
      category: 'templates',
      file: 'templates/index.html',
      message: 'Template wajib "templates/index.html" tidak ditemukan.',
      recommendation: 'WordPress mewajibkan keberadaan template index.html pada Block Theme.'
    });
  }

  // Cek apakah template part yang dideklarasikan di theme.json benar-benar ada
  const declaredParts = tj?.templateParts || [];
  for (const part of declaredParts) {
    const exists = settings.templateParts.some((p) => p.id === part.name);
    if (!exists) {
      items.push({
        id: `tpl-part-missing-${part.name}`,
        type: 'warning',
        category: 'templates',
        file: `parts/${part.name}.html`,
        message: `Template part "${part.name}" dideklarasikan di theme.json namun filenya belum dibuat.`,
        recommendation: `Tambahkan file parts/${part.name}.html di tab Templates & Parts.`
      });
    }
  }

  // Validasi Gutenberg syntax pada templates
  for (const tpl of settings.templates) {
    if (tpl.rawHtml) {
      // Cek unclosed block comment
      const openMatches = tpl.rawHtml.match(/<!--\s*wp:[a-z0-9/-]+/g) || [];
      const closeMatches = tpl.rawHtml.match(/<!--\s*\/wp:[a-z0-9/-]+\s*-->/g) || [];
      const selfCloseMatches = tpl.rawHtml.match(/<!--\s*wp:[a-z0-9/-]+[^>]*\/\s*-->/g) || [];

      const totalOpen = openMatches.length;
      const totalResolved = closeMatches.length + selfCloseMatches.length;

      if (totalOpen !== totalResolved) {
        items.push({
          id: `gutenberg-unbalanced-${tpl.id}`,
          type: 'warning',
          category: 'templates',
          file: `templates/${tpl.id}.html`,
          message: `Ditemukan ketidakseimbangan komentar Gutenberg pada template ${tpl.id}.html.`,
          recommendation: 'Pastikan seluruh tag <!-- wp:... --> memiliki penutup <!-- /wp:... --> atau self-closing /-->.'
        });
      }
    }
  }

  // --- 4. Security & Standards Validation ---
  if (settings.customFunctionsContent) {
    const fn = settings.customFunctionsContent;
    if (fn.includes('eval(') || fn.includes('base64_decode(')) {
      items.push({
        id: 'sec-risky-functions',
        type: 'error',
        category: 'security',
        file: 'functions.php',
        message: 'Ditemukan fungsi berisiko tinggi (eval atau base64_decode).',
        recommendation: 'Hapus kode berbahaya tersebut untuk mematuhi WordPress Security Standards.'
      });
    }

    if (!fn.includes('ABSPATH')) {
      items.push({
        id: 'sec-abspath-check',
        type: 'warning',
        category: 'security',
        file: 'functions.php',
        message: 'functions.php tidak memiliki proteksi akses langsung `if ( ! defined( "ABSPATH" ) ) exit;`.',
        recommendation: 'Tambahkan pemeriksaan ABSPATH di baris paling awal berkas PHP.'
      });
    }
  }

  const errors = items.filter((i) => i.type === 'error').length;
  const warnings = items.filter((i) => i.type === 'warning').length;
  const info = items.filter((i) => i.type === 'info').length;

  let score = 100 - errors * 25 - warnings * 10 - info * 2;
  if (score < 0) score = 0;

  return {
    isValid: errors === 0,
    totalErrors: errors,
    totalWarnings: warnings,
    totalInfo: info,
    items,
    scorePercent: score
  };
}
