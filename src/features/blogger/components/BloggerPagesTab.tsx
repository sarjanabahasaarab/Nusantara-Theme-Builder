/**
 * Nusantara Theme Builder — Blogger Pages Tab
 * Konteks halaman Blogger: Beranda, Artikel, Halaman Statis, Arsip, Pencarian, Label
 * Menjelaskan batasan dan kapabilitas nyata platform Blogger
 * Lisensi: MIT
 */

import React, { useState } from 'react';
import {
  Home,
  FileText,
  FileCode,
  Archive,
  Search,
  Tag,
  Info,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface BloggerPageContext {
  id: string;
  name: string;
  code: string;
  condExpression: string;
  icon: React.ElementType;
  description: string;
  controllable: 'Penuh' | 'Parsial melalui Kondisional';
  supportedFeatures: string[];
  limitations: string[];
}

export const BLOGGER_PAGE_CONTEXTS: BloggerPageContext[] = [
  {
    id: 'index',
    name: 'Beranda (Homepage / Index)',
    code: 'data:blog.pageType == "index"',
    condExpression: '<b:if cond=\'data:blog.pageType == "index"\'>',
    icon: Home,
    description: 'Halaman utama blog yang memuat daftar postingan terbaru, slider, atau grid artikel.',
    controllable: 'Penuh',
    supportedFeatures: ['Hero banner khusus beranda', 'Perulangan posting utama', 'Widget sidebar dinamis', 'Paginasi'],
    limitations: ['Jumlah posting per halaman diatur melalui pengaturan global Blogger']
  },
  {
    id: 'item',
    name: 'Artikel Tunggal (Single Post)',
    code: 'data:blog.pageType == "item"',
    condExpression: '<b:if cond=\'data:blog.pageType == "item"\'>',
    icon: FileText,
    description: 'Tampilan penuh satu artikel dengan isi tulisan, gambar unggulan, komentar, dan tombol berbagi.',
    controllable: 'Penuh',
    supportedFeatures: ['Isi postingan penuh (<data:post.body/>)', 'Breadcrumb jejak navigasi', 'Kolom komentar bawaan/Disqus', 'Penulis & Tanggal'],
    limitations: ['Komentar mengikuti setelan izin Google/Blogger']
  },
  {
    id: 'static_page',
    name: 'Halaman Statis (Pages)',
    code: 'data:blog.pageType == "static_page"',
    condExpression: '<b:if cond=\'data:blog.pageType == "static_page"\'>',
    icon: FileCode,
    description: 'Halaman non-postingan seperti Tentang Kami, Kontak, atau Kebijakan Privasi.',
    controllable: 'Penuh',
    supportedFeatures: ['Isi halaman statis', 'Menyembunyikan tanggal posting', 'Menonaktifkan widget tertentu'],
    limitations: ['Tidak memiliki fitur kategori label']
  },
  {
    id: 'archive',
    name: 'Arsip Bulanan / Tahunan',
    code: 'data:blog.pageType == "archive"',
    condExpression: '<b:if cond=\'data:blog.pageType == "archive"\'>',
    icon: Archive,
    description: 'Halaman indeks kronologis postingan berdasarkan bulan dan tahun publikasi.',
    controllable: 'Parsial melalui Kondisional',
    supportedFeatures: ['Judul arsip otomatis (<data:blog.pageName/>)', 'Daftar ringkasan posting'],
    limitations: ['Blogger mengelompokkan arsip secara otomatis berdasarkan tanggal']
  },
  {
    id: 'search',
    name: 'Hasil Pencarian (Search)',
    code: 'data:blog.searchQuery',
    condExpression: '<b:if cond=\'data:blog.searchQuery\'>',
    icon: Search,
    description: 'Tampilan hasil pencarian kata kunci oleh pengunjung blog.',
    controllable: 'Parsial melalui Kondisional',
    supportedFeatures: ['Pesan status pencarian', 'Daftar postingan relevan'],
    limitations: ['Hasil pencarian di-query oleh mesin bawaan Google']
  },
  {
    id: 'label',
    name: 'Kategori / Label',
    code: 'data:blog.searchLabel',
    condExpression: '<b:if cond=\'data:blog.searchLabel\'>',
    icon: Tag,
    description: 'Halaman arsip artikel yang dikelompokkan berdasarkan tag atau label tertentu.',
    controllable: 'Parsial melalui Kondisional',
    supportedFeatures: ['Judul label aktif (<data:blog.searchLabel/>)', 'Penyaringan daftar posting'],
    limitations: ['Daftar label harus didaftarkan di dalam postingan Blogger']
  }
];

export const BloggerPagesTab: React.FC = () => {
  const [selectedContext, setSelectedContext] = useState<string>('index');

  const current = BLOGGER_PAGE_CONTEXTS.find((c) => c.id === selectedContext) || BLOGGER_PAGE_CONTEXTS[0];
  const IconComponent = current.icon;

  return (
    <div className="flex flex-col h-full overflow-hidden text-xs text-neutral-300">
      {/* Header Info */}
      <div className="p-3 border-b border-neutral-800 bg-neutral-950/40 space-y-1">
        <h4 className="font-semibold text-neutral-200">Konteks Halaman Blogger</h4>
        <p className="text-[11px] text-neutral-400">
          Format tema Blogger menggunakan template tunggal yang beradaptasi melalui ekspresi kondisional (<code>&lt;b:if&gt;</code>).
        </p>
      </div>

      {/* Page List */}
      <div className="p-3 border-b border-neutral-800 space-y-1 max-h-48 overflow-y-auto">
        {BLOGGER_PAGE_CONTEXTS.map((page) => {
          const PageIcon = page.icon;
          const isActive = page.id === selectedContext;
          return (
            <button
              key={page.id}
              onClick={() => setSelectedContext(page.id)}
              className={`w-full p-2 rounded-lg text-left transition-colors flex items-center justify-between cursor-pointer ${
                isActive
                  ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30 font-semibold'
                  : 'bg-neutral-900/40 hover:bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <PageIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{page.name}</span>
              </div>
              <span className="text-[9px] font-mono opacity-60 shrink-0">
                {page.id}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Context Detail */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
              <IconComponent className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-bold text-neutral-200">{current.name}</h5>
              <span className="text-[10px] text-neutral-500 font-mono">
                Tingkat Kontrol: {current.controllable}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-neutral-400 leading-relaxed">
            {current.description}
          </p>

          <div className="p-2 rounded bg-neutral-950 border border-neutral-800 font-mono text-[10px] text-orange-400 break-all select-all">
            {current.condExpression}
          </div>
        </div>

        {/* Supported Features */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
            Fitur yang Disesuaikan di Tema:
          </span>
          <div className="space-y-1">
            {current.supportedFeatures.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-[11px] text-neutral-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Limitations Notice */}
        <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-800/30 text-[11px] text-amber-300/90 space-y-1">
          <div className="flex items-center gap-1 font-semibold text-amber-400 text-[10px] uppercase">
            <Info className="w-3 h-3" />
            <span>Keterbatasan Platform Blogger:</span>
          </div>
          {current.limitations.map((lim, idx) => (
            <p key={idx} className="leading-relaxed">
              • {lim}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
