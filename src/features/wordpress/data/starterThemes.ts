/**
 * Nusantara Theme Builder — Koleksi Starter Themes WordPress
 * Template awal siap pakai untuk berbagai tipe situs WordPress Block Theme
 * Lisensi: MIT
 */

import { WordPressSettings } from '../types/wordpress';
import { getDefaultWordPressSettings } from '../utils/defaultWordPressSettings';

export interface WordPressStarterTemplate {
  id: string;
  name: string;
  category: 'blog' | 'news' | 'portfolio' | 'business';
  description: string;
  previewColor: string;
  badge: string;
  features: string[];
  getSettings: () => Partial<WordPressSettings>;
}

export const WORDPRESS_STARTER_THEMES: WordPressStarterTemplate[] = [
  {
    id: 'nusantara-modern',
    name: 'Nusantara Modern FSE',
    category: 'blog',
    description: 'Tema universal modern dengan kecepatan tinggi, palet warna elegan, dan dukungan penuh Full Site Editing.',
    previewColor: '#2563eb',
    badge: 'Populer & Fleksibel',
    features: ['Hero Banner Interaktif', 'Query Loop Dinamis', 'Newsletter CTA', 'Standar theme.json v3'],
    getSettings: () => {
      const base = getDefaultWordPressSettings();
      return {
        ...base,
        metadata: {
          ...base.metadata,
          themeName: 'Nusantara Modern FSE',
          description: 'Tema WordPress universal modern dengan performa tinggi dan tipografi tajam.'
        }
      };
    }
  },
  {
    id: 'warta-nusantara',
    name: 'Warta Nusantara (Portal Berita)',
    category: 'news',
    description: 'Dirancang khusus untuk portal berita, media digital, majalah, dan jurnalisme independen.',
    previewColor: '#dc2626',
    badge: 'Media & Berita',
    features: ['Grid Berita Multi-Kolom', 'Sidebar Widget Terkini', 'Meta Penulis & Tanggal', 'Kategori Terstruktur'],
    getSettings: () => {
      const base = getDefaultWordPressSettings();
      return {
        ...base,
        metadata: {
          ...base.metadata,
          themeName: 'Warta Nusantara',
          textDomain: 'warta-nusantara',
          description: 'Tema portal berita dan media digital modern berbasis Gutenberg Block Theme.'
        },
        themeJson: {
          ...base.themeJson,
          settings: {
            ...base.themeJson.settings,
            color: {
              palette: [
                { slug: 'primary', color: '#dc2626', name: 'Merah Berita' },
                { slug: 'secondary', color: '#18181b', name: 'Hitam Tajuk' },
                { slug: 'background', color: '#ffffff', name: 'Putih Kertas' },
                { slug: 'text', color: '#1f2937', name: 'Teks Berita' },
                { slug: 'accent', color: '#b91c1c', name: 'Aksen Marun' },
                { slug: 'surface', color: '#f3f4f6', name: 'Latar Abu-abu' }
              ]
            }
          }
        }
      };
    }
  },
  {
    id: 'karya-kreatif',
    name: 'Karya Kreatif (Portofolio & Agensi)',
    category: 'portfolio',
    description: 'Tema visual berestetika tinggi dengan latar gelap eksklusif, tipografi tebal, dan showcase karya.',
    previewColor: '#7c3aed',
    badge: 'Agensi & Kreatif',
    features: ['Tema Gelap Modern', 'Grid Portofolio Imersif', 'Kutipan Testimoni Klien', 'Tata Letak Luas'],
    getSettings: () => {
      const base = getDefaultWordPressSettings();
      return {
        ...base,
        metadata: {
          ...base.metadata,
          themeName: 'Karya Kreatif',
          textDomain: 'karya-kreatif',
          description: 'Tema portofolio dan agensi kreatif dengan estetika modern imersif.'
        },
        themeJson: {
          ...base.themeJson,
          settings: {
            ...base.themeJson.settings,
            color: {
              palette: [
                { slug: 'primary', color: '#7c3aed', name: 'Ungu Kreatif' },
                { slug: 'secondary', color: '#18181b', name: 'Abu Gelap' },
                { slug: 'background', color: '#09090b', name: 'Hitam Pekat' },
                { slug: 'text', color: '#f4f4f5', name: 'Teks Terang' },
                { slug: 'accent', color: '#ec4899', name: 'Aksen Pink' },
                { slug: 'surface', color: '#18181b', name: 'Permukaan Kartu' }
              ]
            }
          },
          styles: {
            color: {
              background: '#09090b',
              text: '#f4f4f5'
            }
          }
        }
      };
    }
  },
  {
    id: 'usaha-nusantara',
    name: 'Usaha Nusantara (Bisnis & UMKM)',
    category: 'business',
    description: 'Tema kredibel dan profesional untuk usaha kecil, perusahaan jasa, startup, dan profil bisnis.',
    previewColor: '#059669',
    badge: 'Bisnis & Korporat',
    features: ['Penjelasan Layanan', 'Tiga Pilar Nilai Usaha', 'Formulir Kontak Cepat', 'Informasi Lokasi'],
    getSettings: () => {
      const base = getDefaultWordPressSettings();
      return {
        ...base,
        metadata: {
          ...base.metadata,
          themeName: 'Usaha Nusantara',
          textDomain: 'usaha-nusantara',
          description: 'Tema profil perusahaan dan UMKM profesional dengan tata letak rapi.'
        },
        themeJson: {
          ...base.themeJson,
          settings: {
            ...base.themeJson.settings,
            color: {
              palette: [
                { slug: 'primary', color: '#059669', name: 'Hijau Zamrud' },
                { slug: 'secondary', color: '#0f172a', name: 'Biru Malam' },
                { slug: 'background', color: '#ffffff', name: 'Putih Bersih' },
                { slug: 'text', color: '#334155', name: 'Teks Slate' },
                { slug: 'accent', color: '#10b981', name: 'Aksen Mint' },
                { slug: 'surface', color: '#f8fafc', name: 'Latar Halus' }
              ]
            }
          }
        }
      };
    }
  }
];
