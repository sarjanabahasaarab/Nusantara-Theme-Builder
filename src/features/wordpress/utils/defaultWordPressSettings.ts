/**
 * Nusantara Theme Builder — Default WordPress Settings
 * Generator default settings WordPress Block Theme (FSE) & Classic Foundation
 * Lisensi: MIT
 */

import { Project, ThemeComponent } from '../../../types/project';
import { WordPressSettings, WordPressTemplateItem, WordPressBlockPattern } from '../types/wordpress';

export function createDefaultComponentsForTemplate(templateId: string): ThemeComponent[] {
  switch (templateId) {
    case 'header':
      return [
        {
          id: 'wp-part-header',
          type: 'navigation',
          name: 'Header & Navigasi Utama',
          props: {
            brandText: 'Nusantara Blog',
            logoUrl: '',
            links: [
              { label: 'Beranda', url: '/' },
              { label: 'Artikel', url: '/blog' },
              { label: 'Tentang Kami', url: '/tentang' },
              { label: 'Kontak', url: '/kontak' }
            ],
            sticky: true
          },
          styles: { padding: '16px 24px', backgroundColor: 'transparent' }
        }
      ];

    case 'footer':
      return [
        {
          id: 'wp-part-footer',
          type: 'footer',
          name: 'Footer & Hak Cipta',
          props: {
            copyrightText: '© 2026 Nusantara Theme Builder. Ditenagai oleh WordPress Block Theme.',
            showSocial: true,
            columns: [
              {
                title: 'Tentang',
                links: [
                  { label: 'Visi Kami', url: '#' },
                  { label: 'Karier', url: '#' }
                ]
              },
              {
                title: 'Tautan Cepat',
                links: [
                  { label: 'Kebijakan Privasi', url: '#' },
                  { label: 'Syarat & Ketentuan', url: '#' }
                ]
              }
            ]
          },
          styles: { padding: '40px 24px', backgroundColor: '#09090b', textColor: '#a1a1aa' }
        }
      ];

    case 'single':
      return [
        {
          id: 'wp-single-hero',
          type: 'hero',
          name: 'Post Title & Header',
          props: {
            headline: 'Menjelajah Keindahan Arsitektur Web Modern',
            subheadline: 'Dipublikasikan pada 18 Oktober 2026 • Oleh Redaksi Nusantara • Kategori Teknologi',
            ctaText: 'Bagikan Artikel',
            ctaLink: '#share'
          },
          styles: { padding: '48px 24px', textAlign: 'center' }
        },
        {
          id: 'wp-single-content',
          type: 'article',
          name: 'Post Content & Body',
          props: {
            title: 'Konten Lengkap Artikel',
            author: 'Redaksi Nusantara',
            date: '18 Oktober 2026',
            category: 'Pengembangan Web',
            content: 'WordPress Block Theme (Full Site Editing) memberikan kebebasan mutlak kepada desainer dan pengembang untuk menata seluruh elemen web melalui blok Gutenberg tanpa harus menulis file PHP yang rumit. Dengan berkas theme.json, seluruh palet warna, tipografi, dan spasi dapat diatur secara terpusat.'
          },
          styles: { padding: '32px 24px', containerMaxWidth: 'md' }
        }
      ];

    case 'page':
      return [
        {
          id: 'wp-page-header',
          type: 'header',
          name: 'Page Title Header',
          props: {
            title: 'Halaman Statis',
            subtitle: 'Struktur halaman statis standar WordPress'
          },
          styles: { padding: '32px 24px' }
        },
        {
          id: 'wp-page-content',
          type: 'article',
          name: 'Page Content',
          props: {
            title: 'Isi Halaman',
            content: 'Ini adalah halaman contoh. Halaman ini berbeda dengan posting blog karena tetap berada di satu tempat dan akan muncul di navigasi situs Anda.'
          },
          styles: { padding: '24px' }
        }
      ];

    case '404':
      return [
        {
          id: 'wp-404-hero',
          type: 'hero',
          name: '404 Not Found Banner',
          props: {
            headline: '404 - Halaman Tidak Ditemukan',
            subheadline: 'Maaf, halaman yang Anda cari mungkin telah dipindahkan atau dihapus. Silakan gunakan pencarian di bawah ini.',
            ctaText: 'Kembali ke Beranda',
            ctaLink: '/'
          },
          styles: { padding: '64px 24px', textAlign: 'center' }
        }
      ];

    case 'archive':
    case 'search':
    case 'index':
    default:
      return [
        {
          id: 'wp-idx-hero',
          type: 'hero',
          name: 'Hero Beranda Nusantara',
          props: {
            headline: 'Membangun Masa Depan Web Nusantara',
            subheadline: 'Tema WordPress Block Theme generasi baru dengan performa tinggi, standar Gutenberg v3, dan keindahan desain visual.',
            ctaText: 'Jelajahi Artikel',
            ctaLink: '#posts'
          },
          styles: { padding: '64px 24px', textAlign: 'center' }
        },
        {
          id: 'wp-idx-query',
          type: 'article-list',
          name: 'Query Loop Daftar Posting',
          props: {
            title: 'Artikel Terbaru',
            columns: 3,
            showExcerpt: true,
            showDate: true,
            postsPerPage: 6
          },
          styles: { padding: '40px 24px' }
        },
        {
          id: 'wp-idx-cta',
          type: 'cta',
          name: 'Call to Action Newsletter',
          props: {
            headline: 'Berlangganan Kabar Terbaru',
            subheadline: 'Dapatkan informasi rilis tema dan artikel terbaru langsung di surel Anda.',
            buttonText: 'Langganan Sekarang',
            buttonLink: '#subscribe'
          },
          styles: { padding: '48px 24px', backgroundColor: '#18181b' }
        }
      ];
  }
}

export function getDefaultWordPressPatterns(): WordPressBlockPattern[] {
  return [
    {
      name: 'hero-nusantara',
      title: 'Hero Nusantara Elegan',
      description: 'Banner pengantar berukuran penuh dengan judul besar, deskripsi, dan tombol aksi.',
      categories: ['featured', 'call-to-action'],
      keywords: ['hero', 'banner', 'header', 'intro'],
      content: `<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}}},"backgroundColor":"primary","textColor":"background","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-background-color has-primary-background-color has-text-color has-background-color" style="padding-top:var(--wp--preset--spacing--50);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--50);padding-left:var(--wp--preset--spacing--30)">
  <!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"lineHeight":"1.15"}}} -->
  <h1 class="wp-block-heading has-text-align-center" style="line-height:1.15">Selamat Datang di Tema Nusantara</h1>
  <!-- /wp:heading -->

  <!-- wp:paragraph {"align":"center","fontSize":"large"} -->
  <p class="has-text-align-center has-large-font-size">Arsitektur tema WordPress modern berbasis Block Theme (Full Site Editing) dengan performa kilat.</p>
  <!-- /wp:paragraph -->

  <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
  <div class="wp-block-buttons">
    <!-- wp:button {"backgroundColor":"accent","textColor":"text"} -->
    <div class="wp-block-button"><a class="wp-block-button__link has-text-color has-text-color has-background has-accent-background-color wp-element-button" href="#explore">Mulai Jelajah</a></div>
    <!-- /wp:button -->
  </div>
  <!-- /wp:buttons -->
</div>
<!-- /wp:group -->`
    },
    {
      name: 'tiga-kolom-fitur',
      title: 'Tiga Kolom Fitur Unggulan',
      description: 'Struktur tiga kolom untuk memaparkan keunggulan, layanan, atau nilai jual produk.',
      categories: ['services', 'columns'],
      keywords: ['features', 'columns', 'services', 'layanan'],
      content: `<!-- wp:columns {"align":"wide","style":{"spacing":{"margin":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40"}}}} -->
<div class="wp-block-columns alignwide" style="margin-top:var(--wp--preset--spacing--40);margin-bottom:var(--wp--preset--spacing--40)">
  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:heading {"level":3} -->
    <h3 class="wp-block-heading">⚡ Kecepatan Tinggi</h3>
    <!-- /wp:heading -->
    <!-- wp:paragraph -->
    <p>Dibangun tanpa jQuery atau pustaka berat, menghasilkan waktu muat halaman yang instan.</p>
    <!-- /wp:paragraph -->
  </div>
  <!-- /wp:column -->
  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:heading {"level":3} -->
    <h3 class="wp-block-heading">🎨 Kustomisasi FSE</h3>
    <!-- /wp:heading -->
    <!-- wp:paragraph -->
    <p>Kelola seluruh tata letak situs melalui WordPress Site Editor bawaan tanpa coding.</p>
    <!-- /wp:paragraph -->
  </div>
  <!-- /wp:column -->
  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:heading {"level":3} -->
    <h3 class="wp-block-heading">🛡️ Standar WordPress 6.x</h3>
    <!-- /wp:heading -->
    <!-- wp:paragraph -->
    <p>Sepenuhnya memenuhi WordPress Theme Review Guidelines dan standar keamanan PHP/HTML.</p>
    <!-- /wp:paragraph -->
  </div>
  <!-- /wp:column -->
</div>
<!-- /wp:columns -->`
    },
    {
      name: 'cta-newsletter',
      title: 'Banner Ajakan Bertindak & Newsletter',
      description: 'Kotak ajakan berlangganan atau registrasi yang menarik perhatian pembaca.',
      categories: ['call-to-action'],
      keywords: ['cta', 'newsletter', 'langganan'],
      content: `<!-- wp:group {"align":"wide","style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}},"border":{"radius":"16px"}},"backgroundColor":"secondary"} -->
<div class="wp-block-group alignwide has-secondary-background-color has-background" style="border-radius:16px;padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--30)">
  <!-- wp:heading {"textAlign":"center","level":2} -->
  <h2 class="wp-block-heading has-text-align-center">Ingin Mendapatkan Kabar Terbaru?</h2>
  <!-- /wp:heading -->
  <!-- wp:paragraph {"align":"center"} -->
  <p class="has-text-align-center">Bergabunglah dengan ribuan pembaca setia Nusantara Theme Builder setiap minggunya.</p>
  <!-- /wp:paragraph -->
  <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
  <div class="wp-block-buttons">
    <!-- wp:button {"backgroundColor":"primary","textColor":"background"} -->
    <div class="wp-block-button"><a class="wp-block-button__link has-background-color has-background-color has-background has-primary-background-color wp-element-button" href="#langganan">Daftar Gratis</a></div>
    <!-- /wp:button -->
  </div>
  <!-- /wp:buttons -->
</div>
<!-- /wp:group -->`
    }
  ];
}

export function getDefaultWordPressSettings(project?: Project | null): WordPressSettings {
  const name = project?.name || 'Tema Nusantara';
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'tema-nusantara';

  const primaryColor = project?.themeSettings?.primaryColor || '#2563eb';
  const secondaryColor = project?.themeSettings?.secondaryColor || '#1e293b';
  const backgroundColor = project?.themeSettings?.backgroundColor || '#ffffff';
  const textColor = project?.themeSettings?.textColor || '#0f172a';
  const fontSans = project?.themeSettings?.fontFamilySans || 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const fontHeading = project?.themeSettings?.fontFamilyHeading || fontSans;

  const defaultTemplates: WordPressTemplateItem[] = [
    {
      id: 'index',
      title: 'Index / Beranda Utama',
      description: 'Template utama menampilkan query loop daftar artikel blog.',
      type: 'template',
      components: project?.pages?.[0]?.components?.length
        ? project.pages[0].components
        : createDefaultComponentsForTemplate('index')
    },
    {
      id: 'single',
      title: 'Single Post',
      description: 'Template tampilan detail satu artikel postingan.',
      type: 'template',
      components: createDefaultComponentsForTemplate('single')
    },
    {
      id: 'page',
      title: 'Page Statis',
      description: 'Template untuk halaman statis WordPress (Tentang, Kontak, dll.).',
      type: 'template',
      components: createDefaultComponentsForTemplate('page')
    },
    {
      id: 'archive',
      title: 'Arsip & Kategori',
      description: 'Template daftar arsip berdasarkan tanggal, penulis, kategori, dan tag.',
      type: 'template',
      components: createDefaultComponentsForTemplate('archive')
    },
    {
      id: 'search',
      title: 'Hasil Pencarian',
      description: 'Template untuk menampilkan hasil pencarian kata kunci situs.',
      type: 'template',
      components: createDefaultComponentsForTemplate('search')
    },
    {
      id: '404',
      title: 'Halaman 404',
      description: 'Template halaman saat konten yang dicari tidak ditemukan.',
      type: 'template',
      components: createDefaultComponentsForTemplate('404')
    }
  ];

  const defaultParts: WordPressTemplateItem[] = [
    {
      id: 'header',
      title: 'Header Bagian Atas',
      description: 'Template part untuk header global situs (logo, judul, navigasi).',
      type: 'part',
      area: 'header',
      components: createDefaultComponentsForTemplate('header')
    },
    {
      id: 'footer',
      title: 'Footer Bagian Bawah',
      description: 'Template part untuk footer global situs (hak cipta, tautan footer).',
      type: 'part',
      area: 'footer',
      components: createDefaultComponentsForTemplate('footer')
    }
  ];

  return {
    themeType: 'block',
    metadata: {
      themeName: name,
      themeUri: `https://github.com/nusantara-theme-builder/${slug}`,
      author: project?.metadata?.author || 'Pengembang Nusantara',
      authorUri: 'https://nusantara-builder.local',
      description: project?.metadata?.description || 'Tema WordPress responsif berbasis Block Theme (Full Site Editing) v3',
      version: project?.metadata?.version || '1.0.0',
      requiresAtLeast: '6.4',
      testedUpTo: '6.7',
      requiresPhp: '7.4',
      license: 'GNU General Public License v2 or later',
      licenseUri: 'http://www.gnu.org/licenses/gpl-2.0.html',
      textDomain: slug,
      tags: ['full-site-editing', 'block-patterns', 'custom-colors', 'responsive-layout', 'translation-ready']
    },
    themeJson: {
      $schema: 'https://schemas.wp.org/trunk/theme.json',
      version: 3,
      settings: {
        appearanceTools: true,
        useRootPaddingAwareAlignments: true,
        color: {
          palette: [
            { slug: 'primary', color: primaryColor, name: 'Warna Utama' },
            { slug: 'secondary', color: secondaryColor, name: 'Warna Sekunder' },
            { slug: 'background', color: backgroundColor, name: 'Latar Belakang' },
            { slug: 'text', color: textColor, name: 'Teks Konten' },
            { slug: 'accent', color: '#f59e0b', name: 'Aksen Emas' },
            { slug: 'surface', color: '#f4f4f5', name: 'Permukaan Kontainer' }
          ],
          custom: true,
          defaultPalette: false
        },
        typography: {
          fontFamilies: [
            {
              fontFamily: fontSans,
              name: 'Font Utama (Sans)',
              slug: 'primary'
            },
            {
              fontFamily: fontHeading,
              name: 'Font Judul (Heading)',
              slug: 'heading'
            }
          ],
          fontSizes: [
            { slug: 'small', size: '0.875rem', name: 'Kecil' },
            { slug: 'medium', size: '1rem', name: 'Normal' },
            { slug: 'large', size: '1.5rem', name: 'Besar' },
            { slug: 'x-large', size: '2.25rem', name: 'Sangat Besar' },
            { slug: '2x-large', size: '3rem', name: 'Ekstra Besar' }
          ],
          fluid: true,
          customFontSize: true,
          lineHeight: true
        },
        spacing: {
          blockGap: true,
          margin: true,
          padding: true,
          units: ['px', 'rem', 'em', '%', 'vh', 'vw']
        },
        layout: {
          contentSize: '840px',
          wideSize: '1200px'
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
      styles: {
        color: {
          background: 'var(--wp--preset--color--background)',
          text: 'var(--wp--preset--color--text)'
        },
        typography: {
          fontFamily: 'var(--wp--preset--font-family--primary)',
          fontSize: 'var(--wp--preset--font-size--medium)',
          lineHeight: '1.6'
        },
        elements: {
          link: {
            color: { text: 'var(--wp--preset--color--primary)' },
            ':hover': { color: { text: 'var(--wp--preset--color--accent)' } }
          },
          h1: {
            typography: {
              fontFamily: 'var(--wp--preset--font-family--heading)',
              fontSize: 'var(--wp--preset--font-size--2x-large)'
            }
          },
          h2: {
            typography: {
              fontFamily: 'var(--wp--preset--font-family--heading)',
              fontSize: 'var(--wp--preset--font-size--x-large)'
            }
          },
          button: {
            color: {
              background: 'var(--wp--preset--color--primary)',
              text: 'var(--wp--preset--color--background)'
            },
            border: { radius: '8px' }
          }
        }
      },
      templateParts: [
        { name: 'header', title: 'Header Utama', area: 'header' },
        { name: 'footer', title: 'Footer Utama', area: 'footer' }
      ]
    },
    activeTemplateId: 'index',
    templates: defaultTemplates,
    templateParts: defaultParts,
    customPatterns: getDefaultWordPressPatterns(),
    includeCustomCss: true,
    customCssContent: `/* Kustom CSS Tambahan untuk Tema Nusantara WordPress */
.wp-site-blocks {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.wp-site-blocks > main {
  flex: 1;
}

/* Transisi halus tombol dan link */
a, button {
  transition: all 0.2s ease-in-out;
}
`,
    includeFunctionsPhp: true,
    customFunctionsContent: `<?php
/**
 * Nusantara Theme Functions & Definitions
 * Disertifikasi untuk WordPress 6.x Full Site Editing
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

if ( ! function_exists( 'nusantara_theme_setup' ) ) :
function nusantara_theme_setup() {
    // Menambahkan dukungan block styles bawaan WordPress
    add_theme_support( 'wp-block-styles' );

    // Enqueue file editor style ke Gutenberg editor
    add_editor_style( 'style.css' );

    // Menambahkan dukungan responsive embeds (YouTube, Vimeo, dll.)
    add_theme_support( 'responsive-embeds' );

    // Menambahkan dukungan tag title dinamis
    add_theme_support( 'title-tag' );

    // Menambahkan dukungan gambar fitur (featured images)
    add_theme_support( 'post-thumbnails' );

    // Menambahkan dukungan format HTML5
    add_theme_support( 'html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ) );
}
endif;
add_action( 'after_setup_theme', 'nusantara_theme_setup' );

/**
 * Enqueue Stylesheets & Scripts
 */
function nusantara_enqueue_scripts() {
    // Enqueue style.css utama
    wp_enqueue_style( 'nusantara-style', get_stylesheet_uri(), array(), wp_get_theme()->get( 'Version' ) );

    // Enqueue file kustom CSS jika ada
    if ( file_exists( get_template_directory() . '/assets/css/custom.css' ) ) {
        wp_enqueue_style( 'nusantara-custom', get_template_directory_uri() . '/assets/css/custom.css', array( 'nusantara-style' ), wp_get_theme()->get( 'Version' ) );
    }
}
add_action( 'wp_enqueue_scripts', 'nusantara_enqueue_scripts' );
`,
    enableBlockStyles: true,
    enableResponsiveEmbeds: true
  };
}
