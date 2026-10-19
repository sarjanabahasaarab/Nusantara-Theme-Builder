/**
 * Nusantara Theme Builder — Blogger Starter Templates
 * 5 Template awal bertarget Blogger: Personal, Berita, Majalah, Teknologi, Pendidikan
 * Lisensi: MIT
 */

import { ThemeComponent, ThemeSettings } from '../../../types/project';
import { BloggerSettings } from '../types/blogger';
import { createComponent } from '../../../domain/project/project-factory';

export interface BloggerStarterTemplate {
  id: string;
  name: string;
  category: 'personal' | 'news' | 'magazine' | 'tech' | 'education';
  description: string;
  badge: string;
  themeSettings: Partial<ThemeSettings>;
  bloggerSettings: Partial<BloggerSettings>;
  components: ThemeComponent[];
}

export const BLOGGER_STARTER_TEMPLATES: BloggerStarterTemplate[] = [
  {
    id: 'blogger-personal-blog',
    name: 'Blog Personal Minimalis',
    category: 'personal',
    description: 'Tata letak bersih dan nyaman dibaca untuk catatan harian, esai, dan opini pribadi.',
    badge: 'Populer',
    themeSettings: {
      primaryColor: '#f59e0b',
      secondaryColor: '#d97706',
      backgroundColor: '#09090b',
      textColor: '#f4f4f5',
      fontFamilySans: 'Plus Jakarta Sans',
      fontFamilyHeading: 'Plus Jakarta Sans',
      containerMaxWidth: 'lg'
    },
    bloggerSettings: {
      version: '2',
      layout: {
        containerMaxWidth: '1140px',
        layoutType: 'two-column-right-sidebar',
        contentWidthPercent: 70,
        sidebarWidthPercent: 30,
        headerSticky: true,
        enableBreadcrumbs: true,
        enablePagination: true,
        postsPerPage: 5
      },
      article: {
        showFeaturedImage: true,
        imageAspectRatio: '16:9',
        showAuthor: true,
        showDate: true,
        showLabels: true,
        showCommentsCount: true,
        showSnippet: true,
        snippetLength: 140,
        readMoreText: 'Lanjut Membaca →',
        enableComments: true,
        commentsSystem: 'blogger'
      }
    },
    components: [
      createComponent('header', 'Header Profil & Judul Blog', 'header', {
        title: 'Jurnal Catatan Nusantara',
        subtitle: 'Berbagi gagasan, cerita inspiratif, dan refleksi hidup.'
      }, { padding: '2rem 1rem', textAlign: 'center' }),
      createComponent('navigation', 'Menu Navigasi Utama', 'navigation', {
        brandText: 'Jurnal Nusantara',
        items: [
          { id: '1', label: 'Beranda', url: '/' },
          { id: '2', label: 'Tentang Saya', url: '/p/tentang.html' },
          { id: '3', label: 'Arsip Tulisan', url: '/p/arsip.html' },
          { id: '4', label: 'Kontak', url: '/p/kontak.html' }
        ]
      }),
      createComponent('article', 'Artikel Utama Blog', 'article', {
        title: 'Menyemai Kreativitas di Era Digital Nusantara',
        author: 'Rian Pratama',
        date: '19 Oktober 2026',
        content: 'Perkembangan teknologi modern membuka peluang besar bagi kreator konten lokal untuk menyuarakan perspektif autentik ke panggung dunia.',
        showAuthor: true,
        showDate: true
      }),
      createComponent('sidebar', 'Widget Samping Penulis', 'sidebar', {
        title: 'Tentang Penulis',
        content: 'Halo! Saya seorang penulis lepas dan pengembang web yang antusias mengeksplorasi ekosistem teknologi Indonesia.'
      }),
      createComponent('footer', 'Footer Hak Cipta', 'footer', {
        title: 'Hak Cipta © 2026 Jurnal Catatan Nusantara. Didukung oleh Blogger.'
      })
    ]
  },
  {
    id: 'blogger-news-portal',
    name: 'Portal Berita Kilat',
    category: 'news',
    description: 'Format berita terstruktur dengan grid artikel multi-kolom dan widget berita terpopuler.',
    badge: 'Media Berita',
    themeSettings: {
      primaryColor: '#ef4444',
      secondaryColor: '#b91c1c',
      backgroundColor: '#0a0a0a',
      textColor: '#f5f5f5',
      fontFamilySans: 'Plus Jakarta Sans',
      fontFamilyHeading: 'Plus Jakarta Sans',
      containerMaxWidth: 'xl'
    },
    bloggerSettings: {
      version: '2',
      layout: {
        containerMaxWidth: '1280px',
        layoutType: 'two-column-right-sidebar',
        contentWidthPercent: 72,
        sidebarWidthPercent: 28,
        headerSticky: true,
        enableBreadcrumbs: true,
        enablePagination: true,
        postsPerPage: 8
      },
      article: {
        showFeaturedImage: true,
        imageAspectRatio: '16:9',
        showAuthor: true,
        showDate: true,
        showLabels: true,
        showCommentsCount: true,
        showSnippet: true,
        snippetLength: 160,
        readMoreText: 'Baca Berita Lengkap',
        enableComments: true,
        commentsSystem: 'blogger'
      }
    },
    components: [
      createComponent('header', 'Header Portal Berita', 'header', {
        title: 'Warta Nusantara Harian',
        subtitle: 'Kabar aktual, terpercaya, dan terdepan dari seluruh pelosok negeri.'
      }, { padding: '1.5rem 1rem', textAlign: 'left' }),
      createComponent('navigation', 'Navigasi Kategori Berita', 'navigation', {
        brandText: 'WARTA NUSANTARA',
        items: [
          { id: '1', label: 'Terkini', url: '/' },
          { id: '2', label: 'Politik', url: '/search/label/politik' },
          { id: '3', label: 'Ekonomi', url: '/search/label/ekonomi' },
          { id: '4', label: 'Teknologi', url: '/search/label/teknologi' },
          { id: '5', label: 'Olahraga', url: '/search/label/olahraga' }
        ]
      }),
      createComponent('article', 'Berita Utama Terkini', 'article', {
        title: 'Transformasi Digital Nasional Memasuki Babak Baru 2026',
        author: 'Tim Redaksi',
        date: '19 Oktober 2026',
        content: 'Pemerintah dan komunitas teknologi meluncurkan serangkaian inisiatif percepatan adopsi infrastruktur awan dan platform open-source di tanah air.',
        showAuthor: true,
        showDate: true
      }),
      createComponent('sidebar', 'Widget Berita Terpopuler', 'sidebar', {
        title: 'Berita Paling Banyak Dibaca',
        content: 'Daftar topik terhangat minggu ini yang diperbarui secara dinamis.'
      }),
      createComponent('footer', 'Footer Redaksi Berita', 'footer', {
        title: 'Warta Nusantara Media Group. Pedoman Media Siber.'
      })
    ]
  },
  {
    id: 'blogger-digital-magazine',
    name: 'Majalah Digital Gaya Hidup',
    category: 'magazine',
    description: 'Desain visual berkelas untuk publikasi fashion, kuliner, pariwisata, dan seni rupa.',
    badge: 'Editorial',
    themeSettings: {
      primaryColor: '#ec4899',
      secondaryColor: '#be185d',
      backgroundColor: '#0c0a09',
      textColor: '#fafaf9',
      fontFamilySans: 'Plus Jakarta Sans',
      fontFamilyHeading: 'Plus Jakarta Sans',
      containerMaxWidth: 'xl'
    },
    bloggerSettings: {
      version: '2',
      layout: {
        containerMaxWidth: '1200px',
        layoutType: 'two-column-right-sidebar',
        contentWidthPercent: 68,
        sidebarWidthPercent: 32,
        headerSticky: false,
        enableBreadcrumbs: true,
        enablePagination: true,
        postsPerPage: 6
      }
    },
    components: [
      createComponent('header', 'Header Majalah Editorial', 'header', {
        title: 'Pesona Nusantara Magazine',
        subtitle: 'Inspirasi Gaya Hidup, Seni Tradisi, dan Ragam Kuliner'
      }),
      createComponent('navigation', 'Menu Majalah', 'navigation', {
        brandText: 'PESONA',
        items: [
          { id: '1', label: 'Editorial', url: '/' },
          { id: '2', label: 'Destinasi', url: '/search/label/destinasi' },
          { id: '3', label: 'Kuliner', url: '/search/label/kuliner' },
          { id: '4', label: 'Kultur', url: '/search/label/kultur' }
        ]
      }),
      createComponent('article', 'Feature Story Majalah', 'article', {
        title: 'Menjelajahi Keindahan Tenun Ikat Tradisional Sumba',
        author: 'Maya Sastrawan',
        date: '19 Oktober 2026',
        content: 'Keanggunan motif kain tenun ikat bukan sekadar lembaran kain, melainkan tutur filosofis peradaban leluhur Nusantara.'
      }),
      createComponent('sidebar', 'Widget Rekomendasi Destinasi', 'sidebar', {
        title: 'Destinasi Pilihan Bulan Ini',
        content: 'Ulasan eksklusif tempat wisata tersembunyi.'
      }),
      createComponent('footer', 'Footer Majalah', 'footer', {
        title: 'Pesona Nusantara Magazine © 2026. Hak cipta dilindungi undang-undang.'
      })
    ]
  },
  {
    id: 'blogger-tech-blog',
    name: 'Blog Teknologi & Koding',
    category: 'tech',
    description: 'Dirancang khusus untuk programmer, ulasan gawai, open-source, dan tutorial pengembang.',
    badge: 'Developer',
    themeSettings: {
      primaryColor: '#3b82f6',
      secondaryColor: '#1d4ed8',
      backgroundColor: '#030712',
      textColor: '#f9fafb',
      fontFamilySans: 'Plus Jakarta Sans',
      fontFamilyHeading: 'Plus Jakarta Sans',
      containerMaxWidth: 'xl'
    },
    bloggerSettings: {
      version: '2',
      layout: {
        containerMaxWidth: '1200px',
        layoutType: 'two-column-right-sidebar',
        contentWidthPercent: 70,
        sidebarWidthPercent: 30,
        headerSticky: true,
        enableBreadcrumbs: true,
        enablePagination: true,
        postsPerPage: 6
      }
    },
    components: [
      createComponent('header', 'Header Tech Stack', 'header', {
        title: 'Dev Nusantara Labs',
        subtitle: 'Tutorial React, Rust, Desktop App, dan Arsitektur Web Modern'
      }),
      createComponent('navigation', 'Menu Tech', 'navigation', {
        brandText: 'DEV NUSANTARA',
        items: [
          { id: '1', label: 'Home', url: '/' },
          { id: '2', label: 'Tutorial', url: '/search/label/tutorial' },
          { id: '3', label: 'Open Source', url: '/search/label/opensource' },
          { id: '4', label: 'Tools', url: '/p/tools.html' }
        ]
      }),
      createComponent('article', 'Artikel Koding & Tutorial', 'article', {
        title: 'Membangun Aplikasi Desktop Modern dengan Tauri 2 dan Rust',
        author: 'Arif Hidayat',
        date: '19 Oktober 2026',
        content: 'Tauri 2 menghadirkan arsitektur multi-window, isolasi keamanan tinggi, dan konsumsi memori sangat minim dibanding framework web konvensional.'
      }),
      createComponent('sidebar', 'Widget Tech Resources', 'sidebar', {
        title: 'Repositori GitHub Populer',
        content: 'Koleksi library open source karya anak bangsa.'
      }),
      createComponent('footer', 'Footer Tech Blog', 'footer', {
        title: 'Dev Nusantara Labs. Dilisensikan di bawah lisensi MIT.'
      })
    ]
  },
  {
    id: 'blogger-education',
    name: 'Portal Edukasi & Pembelajaran',
    category: 'education',
    description: 'Format materi kuliah, kursus online, silabus, dan modul pembelajaran daring.',
    badge: 'Akademik',
    themeSettings: {
      primaryColor: '#10b981',
      secondaryColor: '#047857',
      backgroundColor: '#022c22',
      textColor: '#ecfdf5',
      fontFamilySans: 'Plus Jakarta Sans',
      fontFamilyHeading: 'Plus Jakarta Sans',
      containerMaxWidth: 'lg'
    },
    bloggerSettings: {
      version: '2',
      layout: {
        containerMaxWidth: '1140px',
        layoutType: 'two-column-right-sidebar',
        contentWidthPercent: 70,
        sidebarWidthPercent: 30,
        headerSticky: true,
        enableBreadcrumbs: true,
        enablePagination: true,
        postsPerPage: 6
      }
    },
    components: [
      createComponent('header', 'Header Portal Edukasi', 'header', {
        title: 'Akademi Cerdas Nusantara',
        subtitle: 'Modul belajar gratis untuk kemajuan generasi muda Indonesia.'
      }),
      createComponent('navigation', 'Menu Silabus', 'navigation', {
        brandText: 'AKADEMI CERDAS',
        items: [
          { id: '1', label: 'Beranda', url: '/' },
          { id: '2', label: 'Modul Belajar', url: '/search/label/modul' },
          { id: '3', label: 'Kuis Online', url: '/p/kuis.html' },
          { id: '4', label: 'Daftar Pustaka', url: '/p/pustaka.html' }
        ]
      }),
      createComponent('article', 'Modul Belajar Utama', 'article', {
        title: 'Pengantar Pemikiran Komputasional untuk Siswa SMA',
        author: 'Dra. Siti Rahmah',
        date: '19 Oktober 2026',
        content: 'Konsep dekomposisi masalah dan pengenalan pola mempermudah kita menyelesaikan tantangan kompleks dalam kehidupan sehari-hari.'
      }),
      createComponent('sidebar', 'Widget Silabus Mingguan', 'sidebar', {
        title: 'Jadwal Kuliah Umum',
        content: 'Informasi webinar gratis setiap hari Sabtu pukul 09.00 WIB.'
      }),
      createComponent('footer', 'Footer Akademik', 'footer', {
        title: 'Yayasan Pendidikan Cerdas Nusantara © 2026.'
      })
    ]
  }
];
