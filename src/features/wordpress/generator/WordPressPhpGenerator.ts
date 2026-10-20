/**
 * Nusantara Theme Builder — WordPress PHP & Style.css Generator
 * Menghasilkan style.css header standar, functions.php aman, pattern header PHP, dan classic templates
 * Lisensi: MIT
 */

import { WordPressSettings, WordPressBlockPattern } from '../types/wordpress';

export function generateStyleCss(settings: WordPressSettings): string {
  const meta = settings.metadata;
  const tagsString = meta.tags?.length ? meta.tags.join(', ') : 'block-patterns, full-site-editing';

  return `/*
Theme Name: ${meta.themeName}
Theme URI: ${meta.themeUri || 'https://github.com/nusantara-theme-builder'}
Author: ${meta.author || 'Pengembang Nusantara'}
Author URI: ${meta.authorUri || 'https://nusantara-builder.local'}
Description: ${meta.description || 'Tema WordPress dibuat dengan Nusantara Theme Builder'}
Version: ${meta.version || '1.0.0'}
Requires at least: ${meta.requiresAtLeast || '6.4'}
Tested up to: ${meta.testedUpTo || '6.7'}
Requires PHP: ${meta.requiresPhp || '7.4'}
License: ${meta.license || 'GNU General Public License v2 or later'}
License URI: ${meta.licenseUri || 'http://www.gnu.org/licenses/gpl-2.0.html'}
Text Domain: ${meta.textDomain}
Tags: ${tagsString}

${meta.themeName} WordPress Theme, Copyright 2026 ${meta.author}.
Nusantara Theme Builder is distributed under the terms of the MIT License.
*/

/*
 * Gaya CSS Kustom Tambahan
 * Catatan: Pada WordPress Block Theme, sebagian besar aturan warna dan tipografi diatur melalui theme.json.
 */

:root {
  --ntb-smooth-transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

body {
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: inherit;
}
`;
}

export function generateFunctionsPhp(settings: WordPressSettings): string {
  if (settings.customFunctionsContent && settings.customFunctionsContent.trim().length > 0) {
    return settings.customFunctionsContent;
  }

  const prefix = settings.metadata.textDomain.replace(/-/g, '_');

  return `<?php
/**
 * Functions and definitions for ${settings.metadata.themeName}
 *
 * @package ${settings.metadata.themeName}
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

if ( ! function_exists( '${prefix}_setup' ) ) :
function ${prefix}_setup() {
    // Menambahkan dukungan block styles bawaan Gutenberg
    add_theme_support( 'wp-block-styles' );

    // Enqueue editor stylesheet ke dalam editor Gutenberg
    add_editor_style( 'style.css' );

    // Dukungan responsif video & media embeds
    add_theme_support( 'responsive-embeds' );

    // Tag judul situs dinamis
    add_theme_support( 'title-tag' );

    // Dukungan featured images
    add_theme_support( 'post-thumbnails' );

    // Dukungan HTML5 semantic markup
    add_theme_support( 'html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ) );

    // Terjemahan bahasa
    load_theme_textdomain( '${settings.metadata.textDomain}', get_template_directory() . '/languages' );
}
endif;
add_action( 'after_setup_theme', '${prefix}_setup' );

/**
 * Enqueue scripts and styles.
 */
function ${prefix}_scripts() {
    // Stylesheet utama tema
    wp_enqueue_style( '${settings.metadata.textDomain}-style', get_stylesheet_uri(), array(), wp_get_theme()->get( 'Version' ) );

    // Berkas kustom CSS tambahan jika ada
    if ( file_exists( get_template_directory() . '/assets/css/custom.css' ) ) {
        wp_enqueue_style(
            '${settings.metadata.textDomain}-custom',
            get_template_directory_uri() . '/assets/css/custom.css',
            array( '${settings.metadata.textDomain}-style' ),
            wp_get_theme()->get( 'Version' )
        );
    }
}
add_action( 'wp_enqueue_scripts', '${prefix}_scripts' );
`;
}

export function generatePatternPhp(pattern: WordPressBlockPattern, textDomain: string): string {
  const categories = pattern.categories?.length ? pattern.categories.join(', ') : 'featured';
  const keywords = pattern.keywords?.length ? pattern.keywords.join(', ') : '';

  return `<?php
/**
 * Title: ${pattern.title}
 * Slug: ${textDomain}/${pattern.name}
 * Categories: ${categories}
 * Description: ${pattern.description}
${keywords ? ` * Keywords: ${keywords}\n` : ''} */
?>
${pattern.content}
`;
}

export function generateReadmeTxt(settings: WordPressSettings): string {
  const meta = settings.metadata;
  return `=== ${meta.themeName} ===
Contributors: ${meta.author}
Tags: ${meta.tags.join(', ')}
Requires at least: ${meta.requiresAtLeast}
Tested up to: ${meta.testedUpTo}
Requires PHP: ${meta.requiresPhp}
Stable tag: ${meta.version}
License: ${meta.license}
License URI: ${meta.licenseUri}

${meta.description}

== Description ==
Tema WordPress modern yang dibuat secara visual dengan Nusantara Theme Builder.
Sepenuhnya kompatibel dengan WordPress 6.x Full Site Editing (FSE), block patterns, dan theme.json v3.

== Installation ==
1. Buka WordPress Admin Dashboard (wp-admin).
2. Navigasi ke Tampilan (Appearance) > Tema (Themes).
3. Klik tombol "Tambah Baru" (Add New), lalu klik "Unggah Tema" (Upload Theme).
4. Pilih berkas .zip tema ini dan klik "Pasang Sekarang" (Install Now).
5. Klik "Aktifkan" (Activate).
6. Buka Site Editor (Tampilan > Editor) untuk menyesuaikan tata letak dan gaya situs.

== Changelog ==
= ${meta.version} =
* Rilis perdana tema yang dihasilkan dengan Nusantara Theme Builder Phase 5.
`;
}

export function generateClassicIndexPhp(settings: WordPressSettings): string {
  return `<?php
/**
 * The main template file for ${settings.metadata.themeName} (Classic Fallback)
 *
 * @package ${settings.metadata.themeName}
 */

get_header(); ?>

<main id="primary" class="site-main">
  <?php
  if ( have_posts() ) :
    if ( is_home() && ! is_front_page() ) :
      ?>
      <header>
        <h1 class="page-title screen-reader-text"><?php single_post_title(); ?></h1>
      </header>
      <?php
    endif;

    while ( have_posts() ) :
      the_post();
      ?>
      <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
        <header class="entry-header">
          <?php the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' ); ?>
          <div class="entry-meta">
            <?php echo get_the_date(); ?> &bull; <?php the_author(); ?>
          </div>
        </header>

        <div class="entry-summary">
          <?php the_excerpt(); ?>
        </div>
      </article>
      <?php
    endwhile;

    the_posts_navigation();
  else :
    ?>
    <p><?php esc_html_e( 'Belum ada konten yang dipublikasikan.', '${settings.metadata.textDomain}' ); ?></p>
    <?php
  endif;
  ?>
</main>

<?php
get_footer();
`;
}

export function generateClassicHeaderPhp(settings: WordPressSettings): string {
  return `<?php
/**
 * The header for ${settings.metadata.themeName} (Classic Fallback)
 *
 * @package ${settings.metadata.themeName}
 */
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="profile" href="https://gmpg.org/xfn/11">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<div id="page" class="site">
  <header id="masthead" class="site-header">
    <div class="site-branding">
      <?php
      the_custom_logo();
      if ( is_front_page() && is_home() ) :
        ?>
        <h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
        <?php
      else :
        ?>
        <p class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></p>
        <?php
      endif;
      $description = get_bloginfo( 'description', 'display' );
      if ( $description || is_customize_preview() ) :
        ?>
        <p class="site-description"><?php echo $description; ?></p>
      <?php endif; ?>
    </div>
    <nav id="site-navigation" class="main-navigation">
      <?php
      wp_nav_menu( array(
        'theme_location' => 'menu-1',
        'menu_id'        => 'primary-menu',
      ) );
      ?>
    </nav>
  </header>
`;
}

export function generateClassicFooterPhp(settings: WordPressSettings): string {
  return `<?php
/**
 * The template for displaying the footer (Classic Fallback)
 *
 * @package ${settings.metadata.themeName}
 */
?>
  <footer id="colophon" class="site-footer">
    <div class="site-info">
      <span>&copy; <?php echo date( 'Y' ); ?> <?php bloginfo( 'name' ); ?>. Ditenagai oleh WordPress.</span>
    </div>
  </footer>
</div><!-- #page -->

<?php wp_footer(); ?>
</body>
</html>
`;
}
