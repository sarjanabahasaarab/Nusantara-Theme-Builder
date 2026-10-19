/**
 * Nusantara Theme Builder — Blogger Component Mapper
 * Menerjemahkan komponen visual UI ke struktur section dan widget Blogger
 * Menentukan status dukungan (supported, partial, unsupported)
 * Lisensi: MIT
 */

import { ThemeComponent } from '../../../types/project';
import { BloggerMappedComponent, ComponentSupportStatus } from '../types/blogger';

export class BloggerComponentMapper {
  /**
   * Memetakan komponen visual ke komponen target Blogger
   */
  public static mapComponent(comp: ThemeComponent): BloggerMappedComponent {
    const type = (comp.type || '').toLowerCase();

    switch (type) {
      case 'header':
      case 'logo':
        return {
          component: comp,
          targetWidgetType: 'Header',
          targetSection: 'header',
          supportStatus: 'supported',
          notes: 'Diterjemahkan menjadi <b:widget id="Header1" type="Header"> bawaan Blogger.'
        };

      case 'navigation':
      case 'menu':
        return {
          component: comp,
          targetWidgetType: 'PageList',
          targetSection: 'navigation',
          supportStatus: 'supported',
          notes: 'Diterjemahkan menjadi <b:widget id="PageList1" type="PageList"> dengan link daftar halaman.'
        };

      case 'article':
      case 'single-article':
        return {
          component: comp,
          targetWidgetType: 'Blog',
          targetSection: 'main',
          supportStatus: 'supported',
          notes: 'Diterjemahkan ke dalam template includable post <b:includable id="post"> pada widget Blog1.'
        };

      case 'article-list':
      case 'post-grid':
      case 'blog':
        return {
          component: comp,
          targetWidgetType: 'Blog',
          targetSection: 'main',
          supportStatus: 'supported',
          notes: 'Diterjemahkan ke dalam perulangan postingan utama Blogger <b:loop values="data:posts" var="post">.'
        };

      case 'sidebar':
      case 'widget':
        return {
          component: comp,
          targetWidgetType: 'PopularPosts',
          targetSection: 'sidebar',
          supportStatus: 'supported',
          notes: 'Ditempatkan di dalam section sidebar Blogger dengan opsi widget terkonfigurasi.'
        };

      case 'search':
      case 'search-box':
        return {
          component: comp,
          targetWidgetType: 'BlogSearch',
          targetSection: 'sidebar',
          supportStatus: 'supported',
          notes: 'Diterjemahkan menjadi widget pencarian bawaan Blogger <b:widget type="BlogSearch">.'
        };

      case 'pagination':
        return {
          component: comp,
          targetWidgetType: 'Blog',
          targetSection: 'main',
          supportStatus: 'supported',
          notes: 'Diterjemahkan menjadi <b:includable id="nextprev"> untuk tombol postingan lebih lama/baru.'
        };

      case 'breadcrumb':
        return {
          component: comp,
          targetWidgetType: 'Blog',
          targetSection: 'main',
          supportStatus: 'supported',
          notes: 'Diterjemahkan ke dalam navigasi remah roti halaman item/posting dengan Microdata.'
        };

      case 'footer':
      case 'attribution':
        return {
          component: comp,
          targetWidgetType: 'Attribution',
          targetSection: 'footer',
          supportStatus: 'supported',
          notes: 'Diterjemahkan menjadi <b:widget id="Attribution1" type="Attribution"> di footer.'
        };

      case 'html':
      case 'custom-html':
      case 'code':
        return {
          component: comp,
          targetWidgetType: 'HTML',
          targetSection: 'main',
          supportStatus: 'supported',
          notes: 'Diterjemahkan menjadi <b:widget type="HTML"> dengan sanitasi kode.'
        };

      case 'hero':
      case 'cta':
      case 'features':
      case 'quote':
      case 'content':
      case 'media-image':
        return {
          component: comp,
          targetWidgetType: 'HTML',
          targetSection: 'main',
          supportStatus: 'partial',
          notes: 'Blogger tidak memiliki widget khusus untuk tipe ini; diterjemahkan sebagai widget HTML statis/desain tersanitasi.'
        };

      case 'newsletter':
        return {
          component: comp,
          targetWidgetType: 'HTML',
          targetSection: 'sidebar',
          supportStatus: 'partial',
          notes: 'Blogger tidak mengelola database email secara mandiri; form pendaftaran buletin diterjemahkan via widget HTML formulir eksternal.'
        };

      default:
        return {
          component: comp,
          targetWidgetType: undefined,
          targetSection: 'main',
          supportStatus: 'unsupported',
          notes: `Tipe komponen "${comp.type}" belum didukung penuh oleh generator Blogger dan akan dimasukkan sebagai komentar XML.`
        };
    }
  }

  /**
   * Memetakan seluruh komponen dalam halaman ke struktur Blogger
   */
  public static mapAllComponents(components: ThemeComponent[]): BloggerMappedComponent[] {
    return components.map((c) => this.mapComponent(c));
  }

  /**
   * Menghitung ringkasan status dukungan komponen
   */
  public static getSupportSummary(mapped: BloggerMappedComponent[]) {
    let supported = 0;
    let partial = 0;
    let unsupported = 0;

    for (const item of mapped) {
      if (item.supportStatus === 'supported') supported++;
      else if (item.supportStatus === 'partial') partial++;
      else unsupported++;
    }

    return {
      total: mapped.length,
      supported,
      partial,
      unsupported,
      hasUnsupported: unsupported > 0
    };
  }
}
