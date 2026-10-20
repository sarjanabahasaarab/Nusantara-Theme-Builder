/**
 * Nusantara Theme Builder — WordPress Gutenberg Component Palette
 * Katalog blok Gutenberg resmi untuk disusun ke dalam template atau template part
 * Lisensi: MIT
 */

import React, { useState } from 'react';
import { ThemeComponent } from '../../../types/project';
import {
  Type,
  Layout,
  Columns,
  Image as ImageIcon,
  Compass,
  FileText,
  ListFilter,
  Sparkles,
  MessageSquare,
  Box,
  Heading,
  SplitSquareVertical,
  Maximize2,
  Mail,
  PanelRight,
  Sliders,
  Plus
} from 'lucide-react';

interface WordPressComponentPaletteProps {
  onAddComponent: (comp: ThemeComponent) => void;
  activeTemplateTitle: string;
}

interface BlockDefinition {
  type: ThemeComponent['type'];
  name: string;
  category: 'site' | 'post' | 'content' | 'layout' | 'cta';
  icon: React.ReactNode;
  description: string;
  gutenbergTag: string;
  createDefaultProps: () => Record<string, unknown>;
}

export const WordPressComponentPalette: React.FC<WordPressComponentPaletteProps> = ({
  onAddComponent,
  activeTemplateTitle
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const blocks: BlockDefinition[] = [
    // Site & Navigation
    {
      type: 'navigation',
      name: 'Site Title & Navigasi',
      category: 'site',
      icon: <Compass className="w-4 h-4 text-blue-400" />,
      description: 'Blok header global dengan logo, judul situs, dan menu navigasi responsif.',
      gutenbergTag: 'wp:navigation & wp:site-title',
      createDefaultProps: () => ({
        brandText: 'Nama Situs',
        links: [
          { label: 'Beranda', url: '/' },
          { label: 'Blog', url: '/blog' },
          { label: 'Tentang', url: '/tentang' },
          { label: 'Kontak', url: '/kontak' }
        ]
      })
    },
    {
      type: 'header',
      name: 'Judul Halaman (Header)',
      category: 'site',
      icon: <Heading className="w-4 h-4 text-indigo-400" />,
      description: 'Heading terstruktur untuk judul seksi atau tajuk arsip kategori.',
      gutenbergTag: 'wp:heading & wp:paragraph',
      createDefaultProps: () => ({
        title: 'Judul Halaman WordPress',
        subtitle: 'Deskripsi singkat topik atau pengantar konten.'
      })
    },

    // Post & Query
    {
      type: 'article-list',
      name: 'Query Loop (Daftar Artikel)',
      category: 'post',
      icon: <ListFilter className="w-4 h-4 text-emerald-400" />,
      description: 'Blok loop artikel dinamis dengan gambar fitur, judul, kutipan, dan paginasi.',
      gutenbergTag: 'wp:query & wp:post-template',
      createDefaultProps: () => ({
        title: 'Artikel Terbaru',
        columns: 3,
        postsPerPage: 6
      })
    },
    {
      type: 'article',
      name: 'Single Post Content',
      category: 'post',
      icon: <FileText className="w-4 h-4 text-cyan-400" />,
      description: 'Tata letak artikel tunggal dengan judul, info penulis, gambar utama, dan komentar.',
      gutenbergTag: 'wp:post-content & wp:post-comments',
      createDefaultProps: () => ({
        title: 'Judul Artikel Menarik',
        author: 'Redaksi',
        date: '18 Oktober 2026',
        category: 'Tutorial',
        content: 'WordPress Block Theme memungkinkan pembuatan tata letak halaman yang bersih dan dinamis.'
      })
    },

    // Content & Typography
    {
      type: 'heading',
      name: 'Heading Blok (H2-H4)',
      category: 'content',
      icon: <Type className="w-4 h-4 text-amber-400" />,
      description: 'Blok tajuk seksi dengan level hierarki semantik HTML5.',
      gutenbergTag: 'wp:heading',
      createDefaultProps: () => ({
        text: 'Tajuk Seksi Baru',
        level: 2
      })
    },
    {
      type: 'text',
      name: 'Paragraf Teks',
      category: 'content',
      icon: <Type className="w-4 h-4 text-neutral-400" />,
      description: 'Blok paragraf teks reguler dengan pengaturan tipografi.',
      gutenbergTag: 'wp:paragraph',
      createDefaultProps: () => ({
        content: 'Ini adalah paragraf konten yang dapat diatur ukurannya melalui panel inspektur.'
      })
    },
    {
      type: 'quote',
      name: 'Kutipan (Quote)',
      category: 'content',
      icon: <MessageSquare className="w-4 h-4 text-purple-400" />,
      description: 'Kutipan berbobot dengan atribusi sumber atau testimoni pembaca.',
      gutenbergTag: 'wp:quote',
      createDefaultProps: () => ({
        text: 'Kreativitas adalah kecerdasan yang sedang bersenang-senang.',
        author: 'Albert Einstein'
      })
    },
    {
      type: 'image',
      name: 'Gambar Media',
      category: 'content',
      icon: <ImageIcon className="w-4 h-4 text-pink-400" />,
      description: 'Gambar responsif dengan keterangan caption dan rasio aspek.',
      gutenbergTag: 'wp:image',
      createDefaultProps: () => ({
        url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80',
        alt: 'Ilustrasi Komputer',
        caption: 'Membangun tema WordPress modern dengan Nusantara Builder'
      })
    },

    // Layout & Groups
    {
      type: 'hero',
      name: 'Cover / Hero Banner',
      category: 'layout',
      icon: <Maximize2 className="w-4 h-4 text-rose-400" />,
      description: 'Banner pengantar berukuran lebar dengan judul mencolok dan tombol CTA.',
      gutenbergTag: 'wp:cover / wp:group',
      createDefaultProps: () => ({
        headline: 'Selamat Datang di Situs Kami',
        subheadline: 'Tema WordPress generasi baru dengan Gutenberg FSE.',
        ctaText: 'Pelajari Selengkapnya',
        ctaLink: '#selengkapnya'
      })
    },
    {
      type: 'features',
      name: 'Kolom Fitur (3 Kolom)',
      category: 'layout',
      icon: <Columns className="w-4 h-4 text-emerald-400" />,
      description: 'Tata letak grid multi-kolom untuk memaparkan layanan atau keunggulan.',
      gutenbergTag: 'wp:columns & wp:column',
      createDefaultProps: () => ({
        items: [
          { title: 'Cepat & Ringan', desc: 'Waktu respon kilat tanpa dependensi berlebih.' },
          { title: 'Full Site Editing', desc: 'Atur warna, font, dan layout dari wp-admin.' },
          { title: 'Aman & Standar', desc: 'Sesuai dengan pedoman resmi WordPress 6.x.' }
        ]
      })
    },
    {
      type: 'button',
      name: 'Tombol Aksi (Buttons)',
      category: 'layout',
      icon: <Box className="w-4 h-4 text-blue-400" />,
      description: 'Blok tombol kustom dengan tautan dan warna tema.',
      gutenbergTag: 'wp:buttons & wp:button',
      createDefaultProps: () => ({
        text: 'Klik Di Sini',
        url: '#'
      })
    },
    {
      type: 'divider',
      name: 'Separator Garis',
      category: 'layout',
      icon: <SplitSquareVertical className="w-4 h-4 text-neutral-500" />,
      description: 'Garis pemisah horizontal antar seksi konten.',
      gutenbergTag: 'wp:separator',
      createDefaultProps: () => ({})
    },

    // Widgets & Action
    {
      type: 'cta',
      name: 'Call to Action (CTA)',
      category: 'cta',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      description: 'Kotak penawaran atau ajakan bertindak dengan kontras warna tinggi.',
      gutenbergTag: 'wp:group {"align":"wide"}',
      createDefaultProps: () => ({
        headline: 'Siap Meluncurkan Proyek Baru?',
        subheadline: 'Dapatkan dukungan teknis dan pembaruan rutin tema setiap bulannya.',
        buttonText: 'Mulai Sekarang'
      })
    },
    {
      type: 'newsletter',
      name: 'Langganan Newsletter',
      category: 'cta',
      icon: <Mail className="w-4 h-4 text-teal-400" />,
      description: 'Formulir langganan surel untuk membangun komunitas pembaca setia.',
      gutenbergTag: 'wp:group & wp:search',
      createDefaultProps: () => ({
        headline: 'Kabar Mingguan Nusantara',
        subheadline: 'Kumpulan artikel pilihan dan tutorial langsung di surel Anda.',
        buttonText: 'Langganan'
      })
    },
    {
      type: 'sidebar',
      name: 'Area Widget / Sidebar',
      category: 'cta',
      icon: <PanelRight className="w-4 h-4 text-orange-400" />,
      description: 'Sidebar dengan pencarian, daftar kategori, dan artikel terpopuler.',
      gutenbergTag: 'wp:search, wp:categories, wp:latest-posts',
      createDefaultProps: () => ({})
    },
    {
      type: 'footer',
      name: 'Footer & Hak Cipta',
      category: 'site',
      icon: <Layout className="w-4 h-4 text-neutral-400" />,
      description: 'Template part bagian bawah situs dengan info hak cipta dan navigasi footer.',
      gutenbergTag: 'wp:template-part {"slug":"footer"}',
      createDefaultProps: () => ({
        copyrightText: '© 2026 Nusantara Theme Builder. Hak cipta dilindungi undang-undang.'
      })
    }
  ];

  const filteredBlocks = blocks.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase()) ||
      b.gutenbergTag.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || b.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleAdd = (def: BlockDefinition) => {
    const newComp: ThemeComponent = {
      id: `wp-${def.type}-${Date.now().toString(36)}`,
      type: def.type,
      name: def.name,
      props: def.createDefaultProps(),
      styles: {
        padding: '24px'
      }
    };
    onAddComponent(newComp);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-neutral-900/40">
      {/* Target Info */}
      <div className="p-3 border-b border-neutral-800 bg-neutral-950/60">
        <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
          <span>Menyusun Template:</span>
          <span className="font-semibold text-blue-400 truncate max-w-[130px]">
            {activeTemplateTitle}
          </span>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari blok Gutenberg..."
          className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-750 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1 p-2 border-b border-neutral-800 overflow-x-auto text-[10px] bg-neutral-950/30">
        {[
          { id: 'all', label: 'Semua' },
          { id: 'site', label: 'Situs & Header' },
          { id: 'post', label: 'Posting & Query' },
          { id: 'content', label: 'Konten' },
          { id: 'layout', label: 'Tata Letak' },
          { id: 'cta', label: 'Aksi & Widget' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-2 py-0.5 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white font-medium'
                : 'bg-neutral-800/80 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Block List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {filteredBlocks.map((block) => (
          <div
            key={block.name}
            className="group p-2.5 rounded-xl border border-neutral-800 bg-neutral-900/70 hover:bg-neutral-850 hover:border-blue-500/40 transition-all flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800 group-hover:border-blue-500/30">
                  {block.icon}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-neutral-200 group-hover:text-white">
                    {block.name}
                  </h4>
                  <span className="text-[10px] font-mono text-neutral-500">
                    &lt;!-- {block.gutenbergTag} --&gt;
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleAdd(block)}
                className="p-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white transition-colors cursor-pointer"
                title={`Tambahkan ke ${activeTemplateTitle}`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[11px] text-neutral-400 leading-tight">
              {block.description}
            </p>
          </div>
        ))}

        {filteredBlocks.length === 0 && (
          <div className="text-center py-8 text-neutral-500 text-xs">
            Tidak ada blok yang cocok dengan pencarian "{search}".
          </div>
        )}
      </div>
    </div>
  );
};
