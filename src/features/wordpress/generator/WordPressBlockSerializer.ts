/**
 * Nusantara Theme Builder — WordPress Block Serializer
 * Mengonversi model komponen visual UI menjadi markup blok Gutenberg resmi:
 * <!-- wp:block-name {attributes} -->...<!-- /wp:block-name -->
 * Lisensi: MIT
 */

import { ThemeComponent } from '../../../types/project';

function escapeHtml(text: string): string {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function serializeComponentToGutenberg(
  comp: ThemeComponent,
  themeSlug: string = 'tema-nusantara'
): string {
  const props = comp.props || {};

  switch (comp.type) {
    case 'navigation': {
      const brandText = String(props.brandText || 'Nusantara');
      const links = Array.isArray(props.links) ? props.links : [];

      const navLinksMarkup = links
        .map(
          (link: { label?: string; url?: string }) =>
            `<!-- wp:navigation-link {"label":"${escapeHtml(
              link.label || 'Tautan'
            )}","url":"${escapeHtml(link.url || '#')}"} /-->`
        )
        .join('\n    ');

      return `<!-- wp:group {"align":"wide","layout":{"type":"flex","justifyContent":"space-between"}} -->
<div class="wp-block-group alignwide">
  <!-- wp:group {"layout":{"type":"flex"}} -->
  <div class="wp-block-group">
    <!-- wp:site-logo {"width":48} /-->
    <!-- wp:site-title {"level":1} -->
    <h1 class="wp-block-site-title"><a href="/">${escapeHtml(brandText)}</a></h1>
    <!-- /wp:site-title -->
  </div>
  <!-- /wp:group -->

  <!-- wp:navigation {"layout":{"type":"flex","justifyContent":"right"}} -->
    ${navLinksMarkup || '<!-- wp:page-list /-->'}
  <!-- /wp:navigation -->
</div>
<!-- /wp:group -->`;
    }

    case 'header': {
      const title = String(props.title || 'Judul Utama Situs');
      const subtitle = String(props.subtitle || '');

      return `<!-- wp:group {"align":"wide","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide">
  <!-- wp:heading {"textAlign":"center","level":1} -->
  <h1 class="wp-block-heading has-text-align-center">${escapeHtml(title)}</h1>
  <!-- /wp:heading -->
  ${
    subtitle
      ? `<!-- wp:paragraph {"align":"center","fontSize":"medium"} -->
  <p class="has-text-align-center has-medium-font-size">${escapeHtml(subtitle)}</p>
  <!-- /wp:paragraph -->`
      : ''
  }
</div>
<!-- /wp:group -->`;
    }

    case 'hero': {
      const headline = String(props.headline || 'Membangun Peradaban Digital');
      const subheadline = String(props.subheadline || 'Karya terbaik untuk negeri');
      const ctaText = String(props.ctaText || 'Mulai Sekarang');
      const ctaLink = String(props.ctaLink || '#');

      return `<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}}},"backgroundColor":"primary","textColor":"background","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-background-color has-primary-background-color has-text-color has-background-color" style="padding-top:var(--wp--preset--spacing--50);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--50);padding-left:var(--wp--preset--spacing--30)">
  <!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"lineHeight":"1.15"}}} -->
  <h1 class="wp-block-heading has-text-align-center" style="line-height:1.15">${escapeHtml(
    headline
  )}</h1>
  <!-- /wp:heading -->

  <!-- wp:paragraph {"align":"center","fontSize":"large"} -->
  <p class="has-text-align-center has-large-font-size">${escapeHtml(subheadline)}</p>
  <!-- /wp:paragraph -->

  <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
  <div class="wp-block-buttons">
    <!-- wp:button {"backgroundColor":"accent","textColor":"text"} -->
    <div class="wp-block-button"><a class="wp-block-button__link has-text-color has-accent-background-color has-background wp-element-button" href="${escapeHtml(
      ctaLink
    )}">${escapeHtml(ctaText)}</a></div>
    <!-- /wp:button -->
  </div>
  <!-- /wp:buttons -->
</div>
<!-- /wp:group -->`;
    }

    case 'article-list':
    case 'post-grid': {
      const title = String(props.title || 'Artikel Terbaru');
      const perPage = Number(props.postsPerPage || 6);

      return `<!-- wp:group {"align":"wide","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide">
  <!-- wp:heading {"level":2} -->
  <h2 class="wp-block-heading">${escapeHtml(title)}</h2>
  <!-- /wp:heading -->

  <!-- wp:query {"queryId":1,"query":{"perPage":${perPage},"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false},"align":"wide","layout":{"type":"grid","columnCount":3}} -->
  <div class="wp-block-query alignwide">
    <!-- wp:post-template -->
      <!-- wp:post-featured-image {"isLink":true,"aspectRatio":"16/9"} /-->
      <!-- wp:post-title {"isLink":true,"fontSize":"large"} /-->
      <!-- wp:group {"layout":{"type":"flex"}} -->
      <div class="wp-block-group">
        <!-- wp:post-date /-->
        <!-- wp:post-author {"showAvatar":false} /-->
      </div>
      <!-- /wp:group -->
      <!-- wp:post-excerpt {"moreText":"Baca Selengkapnya"} /-->
    <!-- /wp:post-template -->

    <!-- wp:query-pagination {"layout":{"type":"flex","justifyContent":"center"}} -->
      <!-- wp:query-pagination-previous /-->
      <!-- wp:query-pagination-numbers /-->
      <!-- wp:query-pagination-next /-->
    <!-- /wp:query-pagination -->
  </div>
  <!-- /wp:query -->
</div>
<!-- /wp:group -->`;
    }

    case 'article': {
      return `<!-- wp:group {"align":"wide","layout":{"type":"constrained","contentSize":"840px"}} -->
<div class="wp-block-group alignwide">
  <!-- wp:post-title {"level":1} /-->
  <!-- wp:group {"layout":{"type":"flex"}} -->
  <div class="wp-block-group">
    <!-- wp:post-date /-->
    <!-- wp:post-author /-->
    <!-- wp:post-terms {"term":"category"} /-->
  </div>
  <!-- /wp:group -->
  <!-- wp:post-featured-image {"align":"wide"} /-->
  <!-- wp:post-content {"layout":{"type":"constrained"}} /-->
  <!-- wp:post-comments /-->
</div>
<!-- /wp:group -->`;
    }

    case 'features': {
      const items = Array.isArray(props.items) ? props.items : [
        { title: 'Performa Cepat', desc: 'Waktu respon instan dan ringan.' },
        { title: 'Block Theme', desc: 'Dukungan penuh WordPress Site Editor.' },
        { title: 'Standar WP 6.x', desc: 'Aman dan siap produksi.' }
      ];

      const columnsMarkup = items
        .map(
          (item: { title?: string; desc?: string; icon?: string }) => `  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:heading {"level":3} -->
    <h3 class="wp-block-heading">${escapeHtml(item.title || 'Fitur Unggulan')}</h3>
    <!-- /wp:heading -->
    <!-- wp:paragraph -->
    <p>${escapeHtml(item.desc || 'Keterangan fitur unggulan yang dirancang untuk pengguna.')}</p>
    <!-- /wp:paragraph -->
  </div>
  <!-- /wp:column -->`
        )
        .join('\n');

      return `<!-- wp:columns {"align":"wide"} -->
<div class="wp-block-columns alignwide">
${columnsMarkup}
</div>
<!-- /wp:columns -->`;
    }

    case 'cta':
    case 'newsletter': {
      const headline = String(props.headline || 'Bergabung Bersama Kami');
      const subheadline = String(props.subheadline || 'Dapatkan berita dan pembaruan terbaru langsung di kotak masuk Anda.');
      const buttonText = String(props.buttonText || 'Daftar Sekarang');

      return `<!-- wp:group {"align":"wide","style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}},"border":{"radius":"12px"}},"backgroundColor":"secondary","textColor":"background","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide has-secondary-background-color has-background-color has-background has-text-color" style="border-radius:12px;padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--30)">
  <!-- wp:heading {"textAlign":"center","level":2} -->
  <h2 class="wp-block-heading has-text-align-center">${escapeHtml(headline)}</h2>
  <!-- /wp:heading -->
  <!-- wp:paragraph {"align":"center"} -->
  <p class="has-text-align-center">${escapeHtml(subheadline)}</p>
  <!-- /wp:paragraph -->
  <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
  <div class="wp-block-buttons">
    <!-- wp:button {"backgroundColor":"primary","textColor":"background"} -->
    <div class="wp-block-button"><a class="wp-block-button__link has-background-color has-primary-background-color has-background wp-element-button" href="#action">${escapeHtml(buttonText)}</a></div>
    <!-- /wp:button -->
  </div>
  <!-- /wp:buttons -->
</div>
<!-- /wp:group -->`;
    }

    case 'footer': {
      const copyright = String(props.copyrightText || '© 2026 Nusantara Theme Builder. Ditenagai oleh WordPress.');

      return `<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}}},"backgroundColor":"secondary","textColor":"background","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-secondary-background-color has-background-color has-background has-text-color" style="padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--30)">
  <!-- wp:group {"align":"wide","layout":{"type":"flex","justifyContent":"space-between"}} -->
  <div class="wp-block-group alignwide">
    <!-- wp:site-title {"level":2} /-->
    <!-- wp:paragraph {"fontSize":"small"} -->
    <p class="has-small-font-size">${escapeHtml(copyright)}</p>
    <!-- /wp:paragraph -->
  </div>
  <!-- /wp:group -->
</div>
<!-- /wp:group -->`;
    }

    case 'sidebar': {
      return `<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
  <!-- wp:search {"label":"Cari","showLabel":false,"buttonText":"Cari"} /-->
  <!-- wp:heading {"level":3} -->
  <h3 class="wp-block-heading">Kategori</h3>
  <!-- /wp:heading -->
  <!-- wp:categories /-->
  <!-- wp:heading {"level":3} -->
  <h3 class="wp-block-heading">Artikel Terkini</h3>
  <!-- /wp:heading -->
  <!-- wp:latest-posts {"postsToShow":5,"displayPostDate":true} /-->
</div>
<!-- /wp:group -->`;
    }

    case 'quote': {
      const quoteText = String(props.text || 'Desain yang baik adalah desain yang bermanfaat dan mudah digunakan.');
      const author = String(props.author || 'Dieter Rams');

      return `<!-- wp:quote {"align":"center"} -->
<blockquote class="wp-block-quote has-text-align-center"><p>${escapeHtml(quoteText)}</p><cite>${escapeHtml(author)}</cite></blockquote>
<!-- /wp:quote -->`;
    }

    case 'image': {
      const url = String(props.url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80');
      const alt = String(props.alt || 'Gambar ilustrasi');
      const caption = String(props.caption || '');

      return `<!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="${escapeHtml(url)}" alt="${escapeHtml(alt)}"/>${
        caption ? `<figcaption class="wp-element-caption">${escapeHtml(caption)}</figcaption>` : ''
      }</figure>
<!-- /wp:image -->`;
    }

    case 'heading': {
      const text = String(props.text || 'Judul Seksi');
      const level = Number(props.level || 2);

      return `<!-- wp:heading {"level":${level}} -->
<h${level} class="wp-block-heading">${escapeHtml(text)}</h${level}>
<!-- /wp:heading -->`;
    }

    case 'text':
    case 'content': {
      const text = String(props.content || props.text || 'Paragraf konten teks.');
      return `<!-- wp:paragraph -->
<p>${escapeHtml(text)}</p>
<!-- /wp:paragraph -->`;
    }

    case 'button': {
      const text = String(props.text || 'Tombol Aksi');
      const url = String(props.url || '#');

      return `<!-- wp:buttons -->
<div class="wp-block-buttons">
  <!-- wp:button -->
  <div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="${escapeHtml(url)}">${escapeHtml(text)}</a></div>
  <!-- /wp:button -->
</div>
<!-- /wp:buttons -->`;
    }

    case 'divider': {
      return `<!-- wp:separator -->
<hr class="wp-block-separator has-alpha-channel-opacity"/>
<!-- /wp:separator -->`;
    }

    case 'spacer': {
      const height = String(props.height || '40px');
      return `<!-- wp:spacer {"height":"${escapeHtml(height)}"} -->
<div style="height:${escapeHtml(height)}" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->`;
    }

    default: {
      return `<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
  <!-- wp:paragraph -->
  <p>${escapeHtml(comp.name || comp.type)}</p>
  <!-- /wp:paragraph -->
</div>
<!-- /wp:group -->`;
    }
  }
}

export function serializeComponentsToTemplateHtml(
  components: ThemeComponent[],
  themeSlug: string,
  includeHeaderPart: boolean = true,
  includeFooterPart: boolean = true
): string {
  const parts: string[] = [];

  if (includeHeaderPart) {
    parts.push(`<!-- wp:template-part {"slug":"header","theme":"${themeSlug}","area":"header","tagName":"header"} /-->`);
  }

  parts.push(`<!-- wp:group {"tagName":"main","style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40"}}},"layout":{"type":"constrained"}} -->
<main class="wp-block-group" style="padding-top:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40)">`);

  for (const comp of components) {
    parts.push(serializeComponentToGutenberg(comp, themeSlug));
  }

  parts.push(`</main>
<!-- /wp:group -->`);

  if (includeFooterPart) {
    parts.push(`<!-- wp:template-part {"slug":"footer","theme":"${themeSlug}","area":"footer","tagName":"footer"} /-->`);
  }

  return parts.join('\n\n');
}
