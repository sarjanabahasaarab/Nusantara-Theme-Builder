/**
 * Nusantara Theme Builder — Blogger Component Palette
 * Katalog komponen spesifik platform Blogger sesuai Spesifikasi 4.B
 * Lisensi: MIT
 */

import React, { useState } from 'react';
import { useProjectStore } from '../../../stores/useProjectStore';
import { createComponent } from '../../../domain/project/project-factory';
import {
  Heading,
  Menu,
  FileText,
  Sidebar as SidebarIcon,
  Search,
  Code2,
  Bookmark,
  Layers,
  ArrowRightLeft,
  Sliders,
  Sparkles,
  Plus,
  Info
} from 'lucide-react';

interface BloggerPaletteItem {
  id: string;
  name: string;
  categoryName: string;
  type: string;
  icon: React.ElementType;
  description: string;
  targetBloggerTag: string;
  supportLevel: 'Penuh' | 'Sebagian';
  defaultProps: Record<string, unknown>;
  defaultStyles: Record<string, unknown>;
}

export const BLOGGER_PALETTE_ITEMS: BloggerPaletteItem[] = [
  {
    id: 'b-header',
    name: 'Header Utama',
    categoryName: 'Header & Identitas',
    type: 'header',
    icon: Heading,
    description: 'Bagian tajuk atas tema berisi judul blog dan deskripsi dinamis.',
    targetBloggerTag: '<b:widget type="Header">',
    supportLevel: 'Penuh',
    defaultProps: {
      title: 'Judul Blog Blogger',
      subtitle: 'Deskripsi singkat seputar topik blog Anda.'
    },
    defaultStyles: { padding: '2rem 1.5rem', textAlign: 'center' }
  },
  {
    id: 'b-logo',
    name: 'Logo & Judul Blog',
    categoryName: 'Header & Identitas',
    type: 'logo',
    icon: Sparkles,
    description: 'Identitas logo visual disertai judul blog terformat.',
    targetBloggerTag: '<b:widget type="Header"> (useImage)',
    supportLevel: 'Penuh',
    defaultProps: {
      title: 'Nama Blog Anda',
      logoUrl: '',
      showTagline: true
    },
    defaultStyles: { padding: '1.5rem', textAlign: 'left' }
  },
  {
    id: 'b-nav',
    name: 'Menu Navigasi',
    categoryName: 'Navigasi',
    type: 'navigation',
    icon: Menu,
    description: 'Bilah tautan menu halaman utama (Beranda, Kategori, Kontak).',
    targetBloggerTag: '<b:widget type="PageList">',
    supportLevel: 'Penuh',
    defaultProps: {
      brandText: 'Menu Navigasi',
      items: [
        { id: '1', label: 'Beranda', url: '/' },
        { id: '2', label: 'Tentang', url: '/p/tentang.html' },
        { id: '3', label: 'Kategori', url: '/search/label/kategori' }
      ]
    },
    defaultStyles: { padding: '0.75rem 1rem' }
  },
  {
    id: 'b-article-list',
    name: 'Daftar Artikel (Index)',
    categoryName: 'Area Konten',
    type: 'article-list',
    icon: Layers,
    description: 'Daftar ringkasan postingan terbaru pada halaman beranda atau arsip.',
    targetBloggerTag: '<b:widget type="Blog"> (main loop)',
    supportLevel: 'Penuh',
    defaultProps: {
      postsCount: 6,
      showThumbnail: true,
      showDate: true,
      showSnippet: true
    },
    defaultStyles: { padding: '1rem 0' }
  },
  {
    id: 'b-single-article',
    name: 'Artikel Tunggal (Item)',
    categoryName: 'Area Konten',
    type: 'article',
    icon: FileText,
    description: 'Format tampilan artikel penuh saat pengunjung membuka tautan postingan.',
    targetBloggerTag: '<b:includable id="post">',
    supportLevel: 'Penuh',
    defaultProps: {
      title: 'Judul Tulisan Lengkap',
      author: 'Nama Penulis',
      date: '19 Oktober 2026',
      content: 'Teks artikel lengkap dengan tipografi yang rapi dan mudah dibaca...',
      showAuthor: true,
      showDate: true
    },
    defaultStyles: { padding: '1.5rem' }
  },
  {
    id: 'b-sidebar',
    name: 'Sidebar Kolom Samping',
    categoryName: 'Sidebar & Widget',
    type: 'sidebar',
    icon: SidebarIcon,
    description: 'Kolom samping untuk menampung widget pendukung tema.',
    targetBloggerTag: '<b:section id="sidebar">',
    supportLevel: 'Penuh',
    defaultProps: {
      title: 'Widget Samping',
      content: 'Isi widget pendukung sidebar blog Anda.'
    },
    defaultStyles: { padding: '1.25rem' }
  },
  {
    id: 'b-search',
    name: 'Kotak Pencarian (Search Box)',
    categoryName: 'Sidebar & Widget',
    type: 'search',
    icon: Search,
    description: 'Formulir pencarian postingan bawaan Blogger.',
    targetBloggerTag: '<b:widget type="BlogSearch">',
    supportLevel: 'Penuh',
    defaultProps: {
      title: 'Cari Artikel',
      placeholder: 'Ketik kata kunci lalu tekan enter...'
    },
    defaultStyles: { padding: '1rem' }
  },
  {
    id: 'b-pagination',
    name: 'Paginasi (Navigasi Halaman)',
    categoryName: 'Area Konten',
    type: 'pagination',
    icon: ArrowRightLeft,
    description: 'Tombol Posting Lebih Baru dan Posting Lebih Lama.',
    targetBloggerTag: '<b:includable id="nextprev">',
    supportLevel: 'Penuh',
    defaultProps: {
      olderLabel: 'Posting Lebih Lama →',
      newerLabel: '← Posting Lebih Baru'
    },
    defaultStyles: { padding: '1rem 0' }
  },
  {
    id: 'b-breadcrumb',
    name: 'Breadcrumb (Navigasi Jejak)',
    categoryName: 'Navigasi',
    type: 'breadcrumb',
    icon: Bookmark,
    description: 'Penunjuk remah roti posisi artikel (Beranda > Kategori > Judul).',
    targetBloggerTag: '<b:includable id="breadcrumbs">',
    supportLevel: 'Penuh',
    defaultProps: {
      separator: '>'
    },
    defaultStyles: { padding: '0.5rem 0' }
  },
  {
    id: 'b-footer',
    name: 'Footer & Atribusi',
    categoryName: 'Footer',
    type: 'footer',
    icon: Sliders,
    description: 'Area penutup halaman bawah tema dengan hak cipta dan kredit.',
    targetBloggerTag: '<b:widget type="Attribution">',
    supportLevel: 'Penuh',
    defaultProps: {
      title: 'Hak Cipta © 2026. Didukung oleh Blogger.'
    },
    defaultStyles: { padding: '2rem 1rem', textAlign: 'center' }
  },
  {
    id: 'b-custom-html',
    name: 'HTML & Skrip Khusus',
    categoryName: 'Tingkat Lanjut',
    type: 'html',
    icon: Code2,
    description: 'Kode HTML/CSS kustom untuk iklan, banner, atau elemen pihak ketiga.',
    targetBloggerTag: '<b:widget type="HTML">',
    supportLevel: 'Sebagian',
    defaultProps: {
      title: 'Widget HTML Kustom',
      content: '<!-- Masukkan kode HTML tersanitasi di sini -->'
    },
    defaultStyles: { padding: '1rem' }
  }
];

export const BloggerComponentPalette: React.FC = () => {
  const { addComponent, addToast } = useProjectStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Semua' },
    { id: 'Header & Identitas', label: 'Header' },
    { id: 'Navigasi', label: 'Navigasi' },
    { id: 'Area Konten', label: 'Konten' },
    { id: 'Sidebar & Widget', label: 'Sidebar' },
    { id: 'Footer', label: 'Footer' },
    { id: 'Tingkat Lanjut', label: 'Lanjutan' }
  ];

  const filteredItems = BLOGGER_PALETTE_ITEMS.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.targetBloggerTag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.categoryName === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddComponent = (item: BloggerPaletteItem) => {
    const newComponent = createComponent(
      item.type,
      item.name,
      'basic',
      item.defaultProps,
      item.defaultStyles
    );
    addComponent(newComponent);
    addToast('success', `Komponen "${item.name}" ditambahkan ke tema Blogger.`);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden text-xs text-neutral-300">
      {/* Search Input */}
      <div className="p-3 border-b border-neutral-800 bg-neutral-950/40">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari komponen Blogger..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pt-2 pb-0.5 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-orange-500 text-neutral-950 font-bold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Component Cards List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredItems.map((item) => {
          const IconComp = item.icon;
          return (
            <div
              key={item.id}
              className="p-2.5 rounded-xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/80 hover:border-neutral-700 transition-all group flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                    <IconComp className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-200 group-hover:text-white leading-tight">
                      {item.name}
                    </h4>
                    <span className="text-[10px] font-mono text-neutral-500 block">
                      {item.targetBloggerTag}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleAddComponent(item)}
                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-orange-500 hover:text-neutral-950 text-neutral-300 transition-colors cursor-pointer"
                  title="Tambah ke Kanvas Tema"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-[11px] text-neutral-400 leading-relaxed">
                {item.description}
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-neutral-800/50 text-[10px]">
                <span className="text-neutral-500">{item.categoryName}</span>
                <span
                  className={`font-semibold ${
                    item.supportLevel === 'Penuh' ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {item.supportLevel === 'Penuh' ? '✓ Didukung Penuh' : '⚠ Didukung Sebagian'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
