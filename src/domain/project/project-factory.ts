/**
 * Nusantara Theme Builder — Project Factory
 * Menghasilkan model proyek starter dengan skema valid v1.0.0
 */

import { Project, TargetPlatform, ThemeComponent } from '../../types/project';

export type StarterTemplateId =
  | 'personal-blog'
  | 'news-blog'
  | 'digital-magazine'
  | 'portfolio'
  | 'tech-blog'
  | 'landing-page';

export interface StarterTemplateInfo {
  id: StarterTemplateId;
  name: string;
  description: string;
  recommendedPlatform: TargetPlatform;
  category: string;
  badge: string;
}

export const STARTER_TEMPLATES: StarterTemplateInfo[] = [
  {
    id: 'personal-blog',
    name: 'Blog Personal',
    description: 'Tata letak bersih untuk catatan pribadi, cerita reflektif, dan artikel opini.',
    recommendedPlatform: 'blogger',
    category: 'Blog & Editorial',
    badge: 'Populer'
  },
  {
    id: 'news-blog',
    name: 'Blog Berita',
    description: 'Grid multi-kolom dengan sorotan tajuk berita utama, ticker, dan kategori.',
    recommendedPlatform: 'wordpress',
    category: 'Media & Berita',
    badge: 'Multi-kolom'
  },
  {
    id: 'digital-magazine',
    name: 'Majalah Digital',
    description: 'Desain visual berkelas untuk publikasi gaya hidup, budaya, dan ulasan mendalam.',
    recommendedPlatform: 'wordpress',
    category: 'Publikasi',
    badge: 'Visual Rich'
  },
  {
    id: 'portfolio',
    name: 'Portofolio Kreatif',
    description: 'Showcase karya visual, studi kasus desain, dan profil profesional.',
    recommendedPlatform: 'blogger',
    category: 'Portofolio',
    badge: 'Minimalis'
  },
  {
    id: 'tech-blog',
    name: 'Blog Teknologi',
    description: 'Tipografi modern yang ramah cuplikan kode, tutorial, dan dokumentasi teknologi.',
    recommendedPlatform: 'blogger',
    category: 'Teknologi',
    badge: 'Code Friendly'
  },
  {
    id: 'landing-page',
    name: 'Landing Page Produk',
    description: 'Hero section berdaya pikat tinggi, fitur utama, testimoni, dan CTA konversi.',
    recommendedPlatform: 'wordpress',
    category: 'Marketing',
    badge: 'Konversi'
  }
];

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'ntb-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now().toString(36);
}

export function createComponent(
  type: string,
  label: string,
  category: ThemeComponent['category'],
  props: ThemeComponent['props'] = {},
  styles: ThemeComponent['styles'] = {}
): ThemeComponent {
  return {
    id: 'comp-' + Math.random().toString(36).substring(2, 9),
    type,
    label,
    category,
    props,
    styles: {
      padding: '1.25rem',
      borderRadius: '0.375rem',
      ...styles
    }
  };
}

export function createStarterComponents(templateId: StarterTemplateId): ThemeComponent[] {
  switch (templateId) {
    case 'personal-blog':
      return [
        createComponent('header', 'Header Minimalis', 'header', {
          title: 'Catatan Sang Pengelana',
          subtitle: 'Kumpulan cerita harian, refleksi pemikiran, dan pandangan hidup.'
        }),
        createComponent('navigation', 'Bilah Navigasi', 'navigation', {
          items: [
            { id: '1', label: 'Beranda', url: '/' },
            { id: '2', label: 'Tentang Saya', url: '/tentang' },
            { id: '3', label: 'Arsip Tulisan', url: '/arsip' },
            { id: '4', label: 'Kontak', url: '/kontak' }
          ]
        }),
        createComponent('article', 'Artikel Utama', 'article', {
          title: 'Menemukan Kedamaian di Antara Riuh Rendah Kota',
          content: 'Setiap sudut jalanan memiliki ceritanya sendiri. Tatkala senja turun membungkus cakrawala, aroma kopi dan gemerlap lampu jalan mulai menyapa...',
          showDate: true,
          showAuthor: true
        }),
        createComponent('content', 'Ringkasan Catatan Terkini', 'content', {
          title: 'Tulisan Pilihan Pekan Ini',
          content: 'Simak beberapa renungan pendek mengenai kesederhanaan, produktivitas bermakna, dan perjalanan di alam terbuka.'
        }),
        createComponent('footer', 'Footer Hak Cipta', 'footer', {
          title: '© 2026 Catatan Sang Pengelana. Dibuat dengan Nusantara Theme Builder.',
          subtitle: 'Semua hak dilindungi undang-undang.'
        })
      ];

    case 'news-blog':
      return [
        createComponent('header', 'Kop Berita Utama', 'header', {
          title: 'WARTA NUSANTARA',
          subtitle: 'Portal Berita Independen & Terpercaya Tanah Air'
        }),
        createComponent('navigation', 'Kategori Berita', 'navigation', {
          items: [
            { id: '1', label: 'Nasional', url: '/nasional' },
            { id: '2', label: 'Ekonomi', url: '/ekonomi' },
            { id: '3', label: 'Teknologi', url: '/teknologi' },
            { id: '4', label: 'Budaya', url: '/budaya' },
            { id: '5', label: 'Opini', url: '/opini' }
          ]
        }),
        createComponent('article', 'Berita Utama (Breaking News)', 'article', {
          title: 'Inovasi Ekosistem Digital Terbuka Berbasis Desktop Nusantara',
          content: 'Inisiatif perangkat lunak desktop mandiri untuk mendukung kreator konten dan blogger lokal resmi diluncurkan dengan standar industri modern.',
          showDate: true,
          showAuthor: true
        }),
        createComponent('sidebar', 'Kolom Opini & Terpopuler', 'sidebar', {
          title: 'Paling Banyak Dibaca',
          content: '1. Transformasi Digital Desa Wisata\n2. Perkembangan Kecerdasan Buatan Terbuka\n3. Analisis Ekonomi Kreatif Nusantara'
        }),
        createComponent('footer', 'Footer Portal Berita', 'footer', {
          title: 'PT Warta Nusantara Media. Pedoman Media Siber.',
          subtitle: 'Redaksi: Jakarta & Bandung.'
        })
      ];

    case 'digital-magazine':
      return [
        createComponent('header', 'Masthead Majalah', 'header', {
          title: 'PANORAMA',
          subtitle: 'Jurnal Seni, Arsitektur, dan Gaya Hidup Nusantara'
        }),
        createComponent('navigation', 'Menu Edisi', 'navigation', {
          items: [
            { id: '1', label: 'Edisi Bulan Ini', url: '/edisi' },
            { id: '2', label: 'Galeri Visual', url: '/galeri' },
            { id: '3', label: 'Wawancara Eksklusif', url: '/wawancara' }
          ]
        }),
        createComponent('content', 'Sorotan Sampul (Cover Story)', 'content', {
          title: 'Harmoni Tenun Tradisional dalam Desain Kontemporer',
          content: 'Menyelami proses penciptaan karya para perajin lokal yang memadukan pewarna alami dengan filosofi leluhur di era modern.'
        }),
        createComponent('footer', 'Footer Majalah', 'footer', {
          title: 'Panorama Digital Magazine — ISSN 2999-1000'
        })
      ];

    case 'portfolio':
      return [
        createComponent('header', 'Profil Hero', 'header', {
          title: 'Raden Bagus Prakoso',
          subtitle: 'Senior UI/UX Designer & Frontend Engineer berbasis di Yogyakarta.'
        }),
        createComponent('navigation', 'Navigasi Portofolio', 'navigation', {
          items: [
            { id: '1', label: 'Karya Pilihan', url: '#karya' },
            { id: '2', label: 'Keahlian', url: '#keahlian' },
            { id: '3', label: 'Tentang', url: '#tentang' },
            { id: '4', label: 'Hubungi', url: '#kontak' }
          ]
        }),
        createComponent('content', 'Karya Terpilih', 'content', {
          title: 'Aplikasi Desain Sistem & Desktop Tools',
          content: 'Membangun pengalaman antarmuka yang cepat, intuitif, dan dapat diakses untuk jutaan pengguna aktif bulanan.'
        }),
        createComponent('basic', 'Tombol Aksi (Call To Action)', 'basic', {
          title: 'Mari Berkolaborasi',
          buttonText: 'Unduh CV / Kontak Saya',
          buttonUrl: 'mailto:kontak@example.com'
        }),
        createComponent('footer', 'Footer Portofolio', 'footer', {
          title: '© 2026 Raden Bagus Prakoso. All rights reserved.'
        })
      ];

    case 'tech-blog':
      return [
        createComponent('header', 'Header Dev Hub', 'header', {
          title: '</> KODE NUSANTARA',
          subtitle: 'Eksplorasi Rust, TypeScript, Desktop Apps & Sistem Terdistribusi'
        }),
        createComponent('navigation', 'Kategori Tech', 'navigation', {
          items: [
            { id: '1', label: 'Tutorial', url: '/tutorial' },
            { id: '2', label: 'Arsitektur', url: '/arsitektur' },
            { id: '3', label: 'Open Source', url: '/open-source' }
          ]
        }),
        createComponent('article', 'Artikel Teknis', 'article', {
          title: 'Membangun Arsitektur Desktop Cepat Menggunakan Tauri 2 dan React 19',
          content: 'Pembahasan menyeluruh mengenai komunikasi IPC asinkron, isolasi memori Rust, dan sinkronisasi state aplikasi desktop.',
          showDate: true,
          showAuthor: true
        }),
        createComponent('footer', 'Footer Tech', 'footer', {
          title: 'Dikelola oleh Komunitas Pengembang Open Source Nusantara'
        })
      ];

    case 'landing-page':
    default:
      return [
        createComponent('header', 'Hero Section Konversi', 'header', {
          title: 'Wujudkan Website Impian Anda Lebih Cepat',
          subtitle: 'Platform visual terpadu untuk merancang tema modern tanpa batas kreativitas.'
        }),
        createComponent('basic', 'Tombol Utama Hero', 'basic', {
          buttonText: 'Mulai Uji Coba Gratis',
          buttonUrl: '#daftar'
        }),
        createComponent('content', 'Tiga Pilar Keunggulan', 'content', {
          title: 'Kecepatan, Fleksibilitas, dan Kode Bersih',
          content: 'Dihasilkan dari arsitektur teruji yang memprioritaskan performa rendering, standar web modern, dan kepatuhan SEO.'
        }),
        createComponent('footer', 'Footer Landing Page', 'footer', {
          title: 'Nusantara Theme Builder — Solusi Pembuatan Tema Modern'
        })
      ];
  }
}

export function createNewProject(
  name: string,
  targetPlatform: TargetPlatform,
  templateId: StarterTemplateId = 'personal-blog'
): Project {
  const now = new Date().toISOString();
  const id = generateUUID();
  const components = createStarterComponents(templateId);

  return {
    schemaVersion: '1.0.0',
    id,
    name: name.trim() || 'Proyek Tanpa Nama',
    targetPlatform,
    createdAt: now,
    updatedAt: now,
    themeSettings: {
      primaryColor: targetPlatform === 'blogger' ? '#ea580c' : '#2563eb',
      secondaryColor: '#64748b',
      backgroundColor: '#0a0a0a',
      textColor: '#f8fafc',
      fontFamilySans: 'Plus Jakarta Sans',
      fontFamilyHeading: 'Plus Jakarta Sans',
      containerMaxWidth: 'xl',
      darkModeSupport: true
    },
    pages: [
      {
        id: 'page-home',
        title: 'Beranda (Home)',
        slug: '/',
        isHome: true,
        components
      }
    ],
    assets: [],
    metadata: {
      author: 'Pengembang Nusantara',
      description: `Proyek tema ${targetPlatform === 'blogger' ? 'Blogger' : 'WordPress'} dibuat menggunakan Nusantara Theme Builder.`,
      version: '0.1.0',
      license: 'MIT',
      tags: [targetPlatform, templateId, 'phase-1']
    }
  };
}
