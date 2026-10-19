/**
 * Nusantara Theme Builder — Blogger Settings Panel
 * Panel Pengaturan Komprehensif Tema Blogger (Identitas, Tata Letak, Tampilan, Artikel, SEO)
 * Lisensi: MIT
 */

import React, { useState } from 'react';
import { useProjectStore } from '../../../stores/useProjectStore';
import { BloggerSettings } from '../types/blogger';
import { getDefaultBloggerSettings } from '../utils/defaultBloggerSettings';
import {
  Sliders,
  Layout,
  Palette,
  FileText,
  Search,
  Globe,
  Check,
  RotateCcw
} from 'lucide-react';

export const BloggerSettingsPanel: React.FC = () => {
  const { currentProject, updateThemeSettings, addToast } = useProjectStore();
  const [activeTab, setActiveTab] = useState<'identity' | 'layout' | 'appearance' | 'article' | 'seo'>('identity');

  if (!currentProject) return null;

  const defaultSettings = getDefaultBloggerSettings(currentProject);
  const bloggerSettings: BloggerSettings = {
    ...defaultSettings,
    ...(currentProject.themeSettings?.bloggerSettings || {})
  };

  const handleUpdate = (section: keyof BloggerSettings, patch: Record<string, unknown>) => {
    const currentSection = bloggerSettings[section];
    const updated = {
      ...bloggerSettings,
      [section]:
        typeof currentSection === 'object' && currentSection !== null
          ? { ...(currentSection as unknown as Record<string, unknown>), ...patch }
          : patch
    };

    updateThemeSettings({
      bloggerSettings: updated
    });
  };

  const handleResetSettings = () => {
    const reset = getDefaultBloggerSettings(currentProject);
    updateThemeSettings({ bloggerSettings: reset });
    addToast('info', 'Pengaturan tema Blogger dikembalikan ke nilai default.');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden text-xs text-neutral-300">
      {/* Settings Navigation Tabs */}
      <div className="grid grid-cols-5 border-b border-neutral-800 bg-neutral-950/60 text-center select-none">
        <button
          onClick={() => setActiveTab('identity')}
          className={`py-2 px-1 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors cursor-pointer border-b-2 ${
            activeTab === 'identity'
              ? 'border-orange-500 text-orange-400 font-bold bg-neutral-900/60'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
          title="Identitas Blog"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Identitas</span>
        </button>

        <button
          onClick={() => setActiveTab('layout')}
          className={`py-2 px-1 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors cursor-pointer border-b-2 ${
            activeTab === 'layout'
              ? 'border-orange-500 text-orange-400 font-bold bg-neutral-900/60'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
          title="Tata Letak & Grid"
        >
          <Layout className="w-3.5 h-3.5" />
          <span>Tata Letak</span>
        </button>

        <button
          onClick={() => setActiveTab('appearance')}
          className={`py-2 px-1 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors cursor-pointer border-b-2 ${
            activeTab === 'appearance'
              ? 'border-orange-500 text-orange-400 font-bold bg-neutral-900/60'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
          title="Tampilan & Warna"
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Tampilan</span>
        </button>

        <button
          onClick={() => setActiveTab('article')}
          className={`py-2 px-1 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors cursor-pointer border-b-2 ${
            activeTab === 'article'
              ? 'border-orange-500 text-orange-400 font-bold bg-neutral-900/60'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
          title="Format Artikel & Komentar"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Artikel</span>
        </button>

        <button
          onClick={() => setActiveTab('seo')}
          className={`py-2 px-1 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors cursor-pointer border-b-2 ${
            activeTab === 'seo'
              ? 'border-orange-500 text-orange-400 font-bold bg-neutral-900/60'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
          title="SEO Dasar & Metadata"
        >
          <Search className="w-3.5 h-3.5" />
          <span>SEO</span>
        </button>
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ================================================================= */}
        {/* 1. IDENTITAS BLOG */}
        {/* ================================================================= */}
        {activeTab === 'identity' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-300">Judul Blog (Fallback XML)</label>
              <input
                type="text"
                value={bloggerSettings.identity.blogTitle}
                onChange={(e) => handleUpdate('identity', { blogTitle: e.target.value })}
                className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 text-xs focus:border-orange-500 outline-none"
              />
              <span className="text-[10px] text-neutral-500 block">
                Catatan: Tema tetap mengutamakan tag dinamis <code>&lt;data:blog.title/&gt;</code> saat terpasang di Blogger.
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-300">Deskripsi Singkat Blog</label>
              <textarea
                rows={2}
                value={bloggerSettings.identity.blogDescription}
                onChange={(e) => handleUpdate('identity', { blogDescription: e.target.value })}
                className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 text-xs focus:border-orange-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-300">Tampilan Header</label>
              <select
                value={bloggerSettings.identity.showLogoWithTitle}
                onChange={(e) => handleUpdate('identity', { showLogoWithTitle: e.target.value })}
                className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 text-xs focus:border-orange-500 outline-none"
              >
                <option value="title_only">Hanya Judul Teks</option>
                <option value="logo_only">Hanya Gambar Logo</option>
                <option value="both">Keduanya (Logo dan Judul)</option>
              </select>
            </div>

            <div className="pt-2 border-t border-neutral-800/80 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bloggerSettings.identity.useDynamicTitleTag}
                  onChange={(e) => handleUpdate('identity', { useDynamicTitleTag: e.target.checked })}
                  className="rounded text-orange-500 focus:ring-0 bg-neutral-950 border-neutral-800"
                />
                <span className="text-[11px] text-neutral-200">Gunakan tag dinamis <code>&lt;data:blog.pageTitle/&gt;</code></span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bloggerSettings.identity.useDynamicDescription}
                  onChange={(e) => handleUpdate('identity', { useDynamicDescription: e.target.checked })}
                  className="rounded text-orange-500 focus:ring-0 bg-neutral-950 border-neutral-800"
                />
                <span className="text-[11px] text-neutral-200">Aktifkan deskripsi dinamis <code>&lt;data:blog.metaDescription/&gt;</code></span>
              </label>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 2. TATA LETAK */}
        {/* ================================================================= */}
        {activeTab === 'layout' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-300">Susunan Kolom (Layout Type)</label>
              <select
                value={bloggerSettings.layout.layoutType}
                onChange={(e) => handleUpdate('layout', { layoutType: e.target.value })}
                className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 text-xs focus:border-orange-500 outline-none"
              >
                <option value="two-column-right-sidebar">Dua Kolom (Sidebar Kanan)</option>
                <option value="two-column-left-sidebar">Dua Kolom (Sidebar Kiri)</option>
                <option value="one-column">Satu Kolom Penuh (Tanpa Sidebar)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-300">Lebar Maksimum Kontainer</label>
              <select
                value={bloggerSettings.layout.containerMaxWidth}
                onChange={(e) => handleUpdate('layout', { containerMaxWidth: e.target.value })}
                className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 text-xs focus:border-orange-500 outline-none"
              >
                <option value="1024px">Kecil (1024px)</option>
                <option value="1140px">Standar (1140px)</option>
                <option value="1200px">Lebar (1200px)</option>
                <option value="1280px">Ekstra Lebar (1280px)</option>
                <option value="1440px">Sinematik (1440px)</option>
                <option value="full">Lebar Penuh (100%)</option>
              </select>
            </div>

            {bloggerSettings.layout.layoutType !== 'one-column' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-300">Lebar Konten (%)</label>
                  <input
                    type="number"
                    min={50}
                    max={85}
                    value={bloggerSettings.layout.contentWidthPercent}
                    onChange={(e) => {
                      const cVal = Number(e.target.value);
                      handleUpdate('layout', {
                        contentWidthPercent: cVal,
                        sidebarWidthPercent: 100 - cVal
                      });
                    }}
                    className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 text-xs focus:border-orange-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-300">Lebar Sidebar (%)</label>
                  <input
                    type="number"
                    readOnly
                    value={bloggerSettings.layout.sidebarWidthPercent}
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 text-xs"
                  />
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-neutral-800/80 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bloggerSettings.layout.headerSticky}
                  onChange={(e) => handleUpdate('layout', { headerSticky: e.target.checked })}
                  className="rounded text-orange-500 focus:ring-0 bg-neutral-950 border-neutral-800"
                />
                <span className="text-[11px] text-neutral-200">Header Menempel (Sticky Header)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bloggerSettings.layout.enableBreadcrumbs}
                  onChange={(e) => handleUpdate('layout', { enableBreadcrumbs: e.target.checked })}
                  className="rounded text-orange-500 focus:ring-0 bg-neutral-950 border-neutral-800"
                />
                <span className="text-[11px] text-neutral-200">Aktifkan Navigasi Breadcrumbs di Artikel</span>
              </label>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 3. TAMPILAN & WARNA */}
        {/* ================================================================= */}
        {activeTab === 'appearance' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400">Warna Primer</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bloggerSettings.appearance.primaryColor}
                    onChange={(e) => handleUpdate('appearance', { primaryColor: e.target.value })}
                    className="w-7 h-7 rounded border border-neutral-800 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={bloggerSettings.appearance.primaryColor}
                    onChange={(e) => handleUpdate('appearance', { primaryColor: e.target.value })}
                    className="flex-1 px-2 py-1 bg-neutral-950 border border-neutral-800 rounded text-neutral-200 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400">Warna Sekunder</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bloggerSettings.appearance.secondaryColor}
                    onChange={(e) => handleUpdate('appearance', { secondaryColor: e.target.value })}
                    className="w-7 h-7 rounded border border-neutral-800 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={bloggerSettings.appearance.secondaryColor}
                    onChange={(e) => handleUpdate('appearance', { secondaryColor: e.target.value })}
                    className="flex-1 px-2 py-1 bg-neutral-950 border border-neutral-800 rounded text-neutral-200 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400">Warna Latar Halaman</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bloggerSettings.appearance.backgroundColor}
                    onChange={(e) => handleUpdate('appearance', { backgroundColor: e.target.value })}
                    className="w-7 h-7 rounded border border-neutral-800 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={bloggerSettings.appearance.backgroundColor}
                    onChange={(e) => handleUpdate('appearance', { backgroundColor: e.target.value })}
                    className="flex-1 px-2 py-1 bg-neutral-950 border border-neutral-800 rounded text-neutral-200 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400">Warna Teks Utama</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bloggerSettings.appearance.textColor}
                    onChange={(e) => handleUpdate('appearance', { textColor: e.target.value })}
                    className="w-7 h-7 rounded border border-neutral-800 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={bloggerSettings.appearance.textColor}
                    onChange={(e) => handleUpdate('appearance', { textColor: e.target.value })}
                    className="flex-1 px-2 py-1 bg-neutral-950 border border-neutral-800 rounded text-neutral-200 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-300">Gaya Sudut & Bayangan (Cards)</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={bloggerSettings.appearance.borderRadius}
                  onChange={(e) => handleUpdate('appearance', { borderRadius: e.target.value })}
                  className="px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200"
                >
                  <option value="0px">Kotak (0px)</option>
                  <option value="4px">Halus (4px)</option>
                  <option value="8px">Memikat (8px)</option>
                  <option value="16px">Melengkung (16px)</option>
                </select>

                <select
                  value={bloggerSettings.appearance.boxShadow}
                  onChange={(e) => handleUpdate('appearance', { boxShadow: e.target.value })}
                  className="px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200"
                >
                  <option value="none">Tanpa Bayangan</option>
                  <option value="sm">Bayangan Halus (sm)</option>
                  <option value="md">Bayangan Sedang (md)</option>
                  <option value="lg">Bayangan Menonjol (lg)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-300">Gaya Tombol</label>
              <select
                value={bloggerSettings.appearance.buttonStyle}
                onChange={(e) => handleUpdate('appearance', { buttonStyle: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200"
              >
                <option value="rounded">Sudut Melengkung Standar</option>
                <option value="pill">Bentuk Pil (Pill / Kapsul)</option>
                <option value="square">Persegi Tegas</option>
              </select>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 4. FORMAT ARTIKEL */}
        {/* ================================================================= */}
        {activeTab === 'article' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-neutral-300">Metadata Artikel yang Ditampilkan</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bloggerSettings.article.showAuthor}
                    onChange={(e) => handleUpdate('article', { showAuthor: e.target.checked })}
                    className="rounded text-orange-500 focus:ring-0 bg-neutral-950 border-neutral-800"
                  />
                  <span className="text-[11px] text-neutral-200">Nama Penulis Artikel</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bloggerSettings.article.showDate}
                    onChange={(e) => handleUpdate('article', { showDate: e.target.checked })}
                    className="rounded text-orange-500 focus:ring-0 bg-neutral-950 border-neutral-800"
                  />
                  <span className="text-[11px] text-neutral-200">Tanggal Publikasi</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bloggerSettings.article.showFeaturedImage}
                    onChange={(e) => handleUpdate('article', { showFeaturedImage: e.target.checked })}
                    className="rounded text-orange-500 focus:ring-0 bg-neutral-950 border-neutral-800"
                  />
                  <span className="text-[11px] text-neutral-200">Gambar Unggulan (Thumbnail)</span>
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-300">Teks Tombol Baca Selengkapnya</label>
              <input
                type="text"
                value={bloggerSettings.article.readMoreText}
                onChange={(e) => handleUpdate('article', { readMoreText: e.target.value })}
                className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 text-xs focus:border-orange-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-300">Sistem Komentar</label>
              <select
                value={bloggerSettings.article.commentsSystem}
                onChange={(e) => handleUpdate('article', { commentsSystem: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200"
              >
                <option value="blogger">Komentar Bawaan Blogger</option>
                <option value="disqus">Disqus Comments</option>
                <option value="none">Nonaktifkan Komentar</option>
              </select>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 5. SEO DASAR */}
        {/* ================================================================= */}
        {activeTab === 'seo' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bloggerSettings.seo.enableCanonical}
                  onChange={(e) => handleUpdate('seo', { enableCanonical: e.target.checked })}
                  className="rounded text-orange-500 focus:ring-0 bg-neutral-950 border-neutral-800"
                />
                <span className="text-[11px] text-neutral-200">Canonical Tag (Mencegah Duplikasi Konten)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bloggerSettings.seo.enableOpenGraph}
                  onChange={(e) => handleUpdate('seo', { enableOpenGraph: e.target.checked })}
                  className="rounded text-orange-500 focus:ring-0 bg-neutral-950 border-neutral-800"
                />
                <span className="text-[11px] text-neutral-200">Open Graph & Social Share Cards</span>
              </label>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-300">Pengaturan Robot Pengindeks (Meta Robots)</label>
              <select
                value={bloggerSettings.seo.metaRobots}
                onChange={(e) => handleUpdate('seo', { metaRobots: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200"
              >
                <option value="all">Index & Follow Semua Halaman (Standar)</option>
                <option value="noindex,follow">Noindex, Follow</option>
                <option value="index,nofollow">Index, Nofollow</option>
              </select>
            </div>

            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-[10px] text-neutral-400 space-y-1">
              <span className="font-semibold text-neutral-300 block">Klarifikasi Etis SEO:</span>
              <p>
                Tag SEO memastikan struktur HTML valid untuk perayap mesin pencari. Penerapan kode ini tidak menjamin peringkat pertama instan di Google.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Reset Button */}
      <div className="p-3 border-t border-neutral-800 bg-neutral-950/40 flex justify-between items-center shrink-0">
        <button
          onClick={handleResetSettings}
          className="text-neutral-500 hover:text-amber-400 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset ke Default</span>
        </button>
        <span className="text-[10px] font-mono text-neutral-500">
          Versi XML: Blogger v{bloggerSettings.version}
        </span>
      </div>
    </div>
  );
};
