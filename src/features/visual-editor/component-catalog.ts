/**
 * Nusantara Theme Builder — Component Catalog
 * Katalog lengkap komponen visual untuk Blogger dan WordPress
 */

import React from 'react';
import { ComponentCategory } from '../../types/project';
import {
  Heading,
  Menu,
  FileText,
  PanelLeft,
  Columns,
  Image as ImageIcon,
  Square,
  Type,
  Sparkles,
  LayoutGrid,
  Quote,
  Mail,
  SlidersHorizontal
} from 'lucide-react';

export interface ComponentDefinition {
  type: string;
  label: string;
  category: ComponentCategory;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  defaultProps: Record<string, unknown>;
  defaultStyles: Record<string, string>;
}

export const COMPONENT_CATALOG: ComponentDefinition[] = [
  {
    type: 'header',
    label: 'Header Judul / Masthead',
    category: 'header',
    icon: Heading,
    description: 'Judul utama blog atau identitas tema dengan slogan dan tipografi menonjol.',
    defaultProps: {
      title: 'Judul Blog Baru',
      subtitle: 'Slogan atau deskripsi pemikat tema.',
      showLogo: false
    },
    defaultStyles: {
      backgroundColor: '#171717',
      textColor: '#ffffff',
      padding: '2rem 1.5rem',
      textAlign: 'center',
      borderRadius: '0.5rem'
    }
  },
  {
    type: 'hero',
    label: 'Hero Banner Pikat',
    category: 'layout',
    icon: Sparkles,
    description: 'Bagian pembuka visual dengan judul besar, uraian, dan dua tombol aksi.',
    defaultProps: {
      title: 'Wujudkan Tema Impian Anda',
      subtitle: 'Desain visual modern berkecepatan tinggi tanpa batas kode.',
      buttonText: 'Mulai Menjelajah',
      buttonUrl: '#',
      secondaryButtonText: 'Pelajari Selengkapnya',
      secondaryButtonUrl: '#'
    },
    defaultStyles: {
      backgroundColor: '#1c1917',
      textColor: '#f5f5f4',
      padding: '3rem 2rem',
      textAlign: 'center',
      borderRadius: '0.75rem'
    }
  },
  {
    type: 'navigation',
    label: 'Menu Navigasi',
    category: 'navigation',
    icon: Menu,
    description: 'Bilah tautan menu beranda, kategori, laman penting, dan pencarian.',
    defaultProps: {
      brandText: 'Nusantara',
      items: [
        { id: '1', label: 'Beranda', url: '/' },
        { id: '2', label: 'Artikel', url: '/artikel' },
        { id: '3', label: 'Tentang Kami', url: '/tentang' },
        { id: '4', label: 'Kontak', url: '/kontak' }
      ]
    },
    defaultStyles: {
      backgroundColor: '#111827',
      textColor: '#e5e7eb',
      padding: '0.875rem 1.5rem',
      textAlign: 'left',
      borderRadius: '0.5rem'
    }
  },
  {
    type: 'article',
    label: 'Artikel / Posting Blog',
    category: 'article',
    icon: FileText,
    description: 'Tata letak artikel lengkap dengan judul, nama penulis, tanggal, dan kutipan.',
    defaultProps: {
      title: 'Menjelajahi Keindahan Budaya dan Inovasi Terbuka Nusantara',
      subtitle: 'Editorial • 5 Menit Baca',
      author: 'Redaksi Nusantara',
      date: '18 Oktober 2026',
      content: 'Kekayaan visual dan narasi lokal menjadi fondasi lahirnya template modern yang responsif dan ramah pembaca di seluruh penjuru negeri...',
      showDate: true,
      showAuthor: true,
      readMoreText: 'Baca Selengkapnya →'
    },
    defaultStyles: {
      backgroundColor: '#18181b',
      textColor: '#f4f4f5',
      padding: '1.75rem',
      textAlign: 'left',
      borderRadius: '0.5rem'
    }
  },
  {
    type: 'post-grid',
    label: 'Grid Daftar Berita / Postingan',
    category: 'article',
    icon: LayoutGrid,
    description: '3 kartu artikel tersusun berdampingan cocok untuk majalah atau portal berita.',
    defaultProps: {
      sectionTitle: 'Postingan Terkini',
      posts: [
        {
          id: 'p1',
          title: 'Strategi Desain Responsif Masa Kini',
          category: 'Teknologi',
          excerpt: 'Kiat praktis mengoptimalkan performa halaman pada layar seluler dan desktop.'
        },
        {
          id: 'p2',
          title: 'Melestarikan Ornamen Khas dalam UI Digital',
          category: 'Desain',
          excerpt: 'Perpaduan nilai estetika tradisional dengan elemen modern UI/UX.'
        },
        {
          id: 'p3',
          title: 'Kemudahan Ekspor Template ke Blogger & WordPress',
          category: 'Tutorial',
          excerpt: 'Alur kerja cepat tanpa perlu menulis baris XML atau PHP manual.'
        }
      ]
    },
    defaultStyles: {
      backgroundColor: '#0f172a',
      textColor: '#f8fafc',
      padding: '2rem 1.5rem',
      textAlign: 'left',
      borderRadius: '0.75rem'
    }
  },
  {
    type: 'content',
    label: 'Blok Teks & Informasi',
    category: 'content',
    icon: Type,
    description: 'Paragraf fleksibel dengan subjudul untuk menyajikan konten umum.',
    defaultProps: {
      title: 'Sekilas Tentang Platform Ini',
      content: 'Nusantara Theme Builder dirancang khusus bagi para narablog, desainer grafis, dan pengembang web di Indonesia untuk menghasilkan tema berkualitas tinggi.'
    },
    defaultStyles: {
      backgroundColor: '#18181b',
      textColor: '#f4f4f5',
      padding: '1.5rem',
      textAlign: 'left',
      borderRadius: '0.5rem'
    }
  },
  {
    type: 'media-image',
    label: 'Media Gambar / Banner Foto',
    category: 'media',
    icon: ImageIcon,
    description: 'Gambar responsif dengan dukungan aset lokal atau tautan eksternal dan takarir.',
    defaultProps: {
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      alt: 'Pemandangan Lanskap Alam',
      caption: 'Keindahan alam nusantara yang abadi.'
    },
    defaultStyles: {
      backgroundColor: '#09090b',
      textColor: '#a1a1aa',
      padding: '1rem',
      textAlign: 'center',
      borderRadius: '0.5rem'
    }
  },
  {
    type: 'quote',
    label: 'Kutipan & Testimoni',
    category: 'content',
    icon: Quote,
    description: 'Blok kutipan berbobot dengan nama narasumber dan jabatan.',
    defaultProps: {
      quote: 'Karya terbaik lahir dari kecintaan yang mendalam pada detail dan semangat berbagi manfaat.',
      author: 'Ki Hajar Dewantara',
      role: 'Tokoh Pendidikan & Kebudayaan'
    },
    defaultStyles: {
      backgroundColor: '#1e1b4b',
      textColor: '#e0e7ff',
      padding: '2rem 1.5rem',
      textAlign: 'center',
      borderRadius: '0.5rem'
    }
  },
  {
    type: 'features',
    label: 'Kolom Fitur Unggulan',
    category: 'layout',
    icon: Columns,
    description: '3 kolom ringkas menonjolkan fitur utama atau keunggulan tema.',
    defaultProps: {
      title: 'Keunggulan Tema Kami',
      items: [
        { id: 'f1', title: 'Performa Cepat', desc: 'Ukuran file ringan tanpa skrip berlebih.' },
        { id: 'f2', title: 'SEO Ramah Mesin Pencari', desc: 'Struktur kode semantik dan rapi.' },
        { id: 'f3', title: 'Kustomisasi Penuh', desc: 'Dapat diatur warnanya sesuka hati.' }
      ]
    },
    defaultStyles: {
      backgroundColor: '#111827',
      textColor: '#f9fafb',
      padding: '2rem 1.5rem',
      textAlign: 'left',
      borderRadius: '0.5rem'
    }
  },
  {
    type: 'cta',
    label: 'Tombol Aksi (Call To Action)',
    category: 'basic',
    icon: Square,
    description: 'Panggilan aksi dengan tombol interaktif dan ajakan memikat.',
    defaultProps: {
      title: 'Bergabunglah Bersama Komunitas Kami',
      subtitle: 'Dapatkan inspirasi desain tema dan perkembangan rilis terkini langsung ke email Anda.',
      buttonText: 'Daftar Sekarang Secara Gratis',
      buttonUrl: '#'
    },
    defaultStyles: {
      backgroundColor: '#2e1065',
      textColor: '#f3e8ff',
      padding: '2.5rem 1.5rem',
      textAlign: 'center',
      borderRadius: '0.75rem'
    }
  },
  {
    type: 'newsletter',
    label: 'Kotak Buletin Berlangganan',
    category: 'basic',
    icon: Mail,
    description: 'Kotak langganan surel dengan kolom input dan tombol berlangganan.',
    defaultProps: {
      title: 'Langganan Buletin Mingguan',
      subtitle: 'Tidak ada spam, hanya konten berbobot setiap hari Senin.',
      placeholder: 'Masukkan alamat email Anda...',
      buttonText: 'Langganan'
    },
    defaultStyles: {
      backgroundColor: '#18181b',
      textColor: '#f4f4f5',
      padding: '1.75rem',
      textAlign: 'center',
      borderRadius: '0.5rem'
    }
  },
  {
    type: 'sidebar',
    label: 'Sidebar Widget Pendukung',
    category: 'sidebar',
    icon: PanelLeft,
    description: 'Kotak widget profil singkat, media sosial, atau daftar arsip.',
    defaultProps: {
      title: 'Tentang Penulis',
      content: 'Penulis independen dan pemerhati teknologi perangkat lunak sumber terbuka.',
      widgetType: 'profile'
    },
    defaultStyles: {
      backgroundColor: '#141417',
      textColor: '#e4e4e7',
      padding: '1.25rem',
      textAlign: 'left',
      borderRadius: '0.375rem'
    }
  },
  {
    type: 'footer',
    label: 'Footer Hak Cipta & Navigasi',
    category: 'footer',
    icon: Columns,
    description: 'Bagian penutup situs dengan catatan hak cipta dan tautan hukum.',
    defaultProps: {
      title: '© 2026 Nusantara Theme Builder. Lisensi MIT.',
      subtitle: 'Dibuat untuk memberdayakan kreator konten Indonesia.',
      links: [
        { id: '1', label: 'Kebijakan Privasi', url: '#' },
        { id: '2', label: 'Syarat & Ketentuan', url: '#' },
        { id: '3', label: 'Bantuan', url: '#' }
      ]
    },
    defaultStyles: {
      backgroundColor: '#09090b',
      textColor: '#71717a',
      padding: '1.75rem 1.5rem',
      textAlign: 'center',
      borderRadius: '0.5rem'
    }
  }
];

export const CATEGORY_LABELS: Record<string, string> = {
  all: 'Semua',
  layout: 'Tata Letak',
  header: 'Kop / Header',
  navigation: 'Navigasi',
  article: 'Artikel & Blog',
  content: 'Konten',
  media: 'Media',
  basic: 'Aksi & CTA',
  sidebar: 'Sidebar',
  footer: 'Footer'
};
