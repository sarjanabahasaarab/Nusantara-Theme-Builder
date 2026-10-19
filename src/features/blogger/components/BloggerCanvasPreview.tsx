/**
 * Nusantara Theme Builder — Blogger Canvas Preview
 * Kanvas pratinjau responsif tema Blogger dengan data simulasi yang jelas
 * Mengikuti perubahan gaya, layout, dan pemilihan komponen secara real-time
 * Lisensi: MIT
 */

import React from 'react';
import { useProjectStore } from '../../../stores/useProjectStore';
import { BloggerSettings } from '../types/blogger';
import { getDefaultBloggerSettings } from '../utils/defaultBloggerSettings';
import {
  Sparkles,
  User,
  Calendar,
  MessageSquare,
  Search,
  ExternalLink,
  ChevronRight,
  Bookmark,
  Info
} from 'lucide-react';

export const BloggerCanvasPreview: React.FC = () => {
  const { currentProject, viewportMode, selectedComponentId, selectComponent } = useProjectStore();

  if (!currentProject) return null;

  const defaultSettings = getDefaultBloggerSettings(currentProject);
  const settings: BloggerSettings = {
    ...defaultSettings,
    ...(currentProject.themeSettings?.bloggerSettings || {})
  };

  const { identity, layout, appearance, article } = settings;

  // Viewport Container Dimensions
  let viewportWidthClass = 'w-full max-w-5xl';
  if (viewportMode === 'tablet') {
    viewportWidthClass = 'w-[768px]';
  } else if (viewportMode === 'mobile') {
    viewportWidthClass = 'w-[375px]';
  }

  // Simulated Mock Posts (Jelas ditandai sebagai data simulasi pratinjau)
  const mockPosts = [
    {
      id: 'mock-1',
      title: 'Membangun Ekosistem Template Blogger Modern di Indonesia',
      date: '19 Oktober 2026',
      author: 'Redaksi Nusantara',
      snippet:
        'Melalui arsitektur XML v2/v3 yang terstruktur, pengembang dapat menyusun tema Blogger yang cepat, ramah mesin pencari, dan sepenuhnya responsif.',
      label: 'Teknologi',
      commentsCount: 5
    },
    {
      id: 'mock-2',
      title: 'Optimalisasi Desain Berbasis Variabel CSS pada Tema Blogspot',
      date: '18 Oktober 2026',
      author: 'Rian Pratama',
      snippet:
        'Penggunaan variabel warna dan tipografi di dalam blok <b:skin> mempermudah kostumisasi tema tanpa harus merombak seluruh baris kode stylesheet.',
      label: 'Tutorial',
      commentsCount: 2
    }
  ];

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6 flex flex-col items-center bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:16px_16px]">
      {/* Viewport Frame */}
      <div
        className={`${viewportWidthClass} transition-all duration-200 flex flex-col shrink-0 rounded-xl overflow-hidden shadow-2xl border border-neutral-800 bg-neutral-950`}
      >
        {/* Frame Window Bar */}
        <div className="px-4 py-2 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between text-xs select-none">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-[11px] font-mono text-neutral-400 ml-2">
              https://{currentProject.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.blogspot.com/
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
              Pratinjau Blogger ({viewportMode})
            </span>
          </div>
        </div>

        {/* Data Pratinjau Notice Banner */}
        <div className="px-4 py-1.5 bg-orange-950/30 border-b border-orange-800/30 text-[11px] text-orange-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span>Mode Pratinjau Tema: Menampilkan data simulasi postingan Blogger</span>
          </span>
          <span className="text-[10px] opacity-75 font-mono">Blogger XML v{settings.version}</span>
        </div>

        {/* Simulated Blog Content Area */}
        <div
          style={{
            backgroundColor: appearance.backgroundColor,
            color: appearance.textColor,
            fontFamily: `${appearance.fontFamilySans}, sans-serif`,
            fontSize: appearance.fontSizeBase
          }}
          className="min-h-[600px] flex flex-col"
        >
          {/* Header */}
          <header
            onClick={() => selectComponent('header-widget')}
            style={{
              backgroundColor: appearance.surfaceColor,
              borderColor: appearance.borderColor
            }}
            className={`border-b p-6 text-center transition-all cursor-pointer ${
              selectedComponentId === 'header-widget' ? 'ring-2 ring-orange-500' : ''
            }`}
          >
            <h1
              style={{
                color: appearance.primaryColor,
                fontFamily: `${appearance.fontFamilyHeading}, sans-serif`
              }}
              className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            >
              {identity.blogTitle}
            </h1>
            <p className="text-xs sm:text-sm opacity-80 max-w-xl mx-auto mt-1">
              {identity.blogDescription}
            </p>
          </header>

          {/* Navigation Bar */}
          <nav
            onClick={() => selectComponent('nav-widget')}
            style={{
              backgroundColor: appearance.surfaceColor,
              borderColor: appearance.borderColor
            }}
            className={`border-b px-6 py-2.5 transition-all cursor-pointer ${
              selectedComponentId === 'nav-widget' ? 'ring-2 ring-orange-500' : ''
            }`}
          >
            <div className="flex items-center justify-center flex-wrap gap-6 text-xs font-semibold">
              <span className="text-orange-400 font-bold hover:underline cursor-pointer">Beranda</span>
              <span className="opacity-80 hover:opacity-100 hover:text-orange-400 cursor-pointer">Tentang</span>
              <span className="opacity-80 hover:opacity-100 hover:text-orange-400 cursor-pointer">Kategori</span>
              <span className="opacity-80 hover:opacity-100 hover:text-orange-400 cursor-pointer">Arsip</span>
              <span className="opacity-80 hover:opacity-100 hover:text-orange-400 cursor-pointer">Kontak</span>
            </div>
          </nav>

          {/* Main Layout Area */}
          <div className="flex-1 p-4 sm:p-6 max-w-5xl w-full mx-auto">
            <div
              className={`flex flex-col gap-6 ${
                layout.layoutType === 'two-column-right-sidebar'
                  ? 'md:flex-row'
                  : layout.layoutType === 'two-column-left-sidebar'
                  ? 'md:flex-row-reverse'
                  : ''
              }`}
            >
              {/* Main Column (Posting) */}
              <main
                style={{
                  width: layout.layoutType !== 'one-column' ? `${layout.contentWidthPercent}%` : '100%'
                }}
                className="space-y-6"
              >
                {mockPosts.map((post) => (
                  <article
                    key={post.id}
                    onClick={() => selectComponent('blog-post-widget')}
                    style={{
                      backgroundColor: appearance.surfaceColor,
                      borderColor: appearance.borderColor,
                      borderRadius: appearance.borderRadius
                    }}
                    className={`p-5 sm:p-6 border transition-all cursor-pointer shadow-sm ${
                      selectedComponentId === 'blog-post-widget' ? 'ring-2 ring-orange-500' : ''
                    }`}
                  >
                    {/* Post Meta */}
                    <div className="flex items-center gap-3 text-[11px] opacity-75 mb-2">
                      <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 font-semibold font-mono">
                        {post.label}
                      </span>
                      {article.showAuthor && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-orange-400" />
                          <span>{post.author}</span>
                        </span>
                      )}
                      {article.showDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{post.date}</span>
                        </span>
                      )}
                    </div>

                    {/* Post Title */}
                    <h2
                      style={{
                        fontFamily: `${appearance.fontFamilyHeading}, sans-serif`
                      }}
                      className="text-lg sm:text-xl font-bold hover:text-orange-400 transition-colors cursor-pointer mb-2.5"
                    >
                      {post.title}
                    </h2>

                    {/* Post Snippet */}
                    <p className="text-xs sm:text-sm opacity-85 leading-relaxed mb-4">
                      {post.snippet}
                    </p>

                    {/* Read More Button & Comments Count */}
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60">
                      <button
                        style={{
                          backgroundColor: appearance.primaryColor,
                          borderRadius:
                            appearance.buttonStyle === 'pill'
                              ? '9999px'
                              : appearance.buttonStyle === 'square'
                              ? '0px'
                              : '6px'
                        }}
                        className="px-3.5 py-1.5 text-xs font-bold text-neutral-950 hover:opacity-90 transition-opacity cursor-pointer shadow"
                      >
                        {article.readMoreText}
                      </button>

                      {article.showCommentsCount && (
                        <span className="flex items-center gap-1 text-[11px] opacity-70">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{post.commentsCount} Komentar</span>
                        </span>
                      )}
                    </div>
                  </article>
                ))}

                {/* Simulated Pagination */}
                <div className="flex justify-between items-center py-2 text-xs font-semibold text-orange-400">
                  <span className="hover:underline cursor-pointer">← Halaman Sebelumnya</span>
                  <span className="hover:underline cursor-pointer">Halaman Berikutnya →</span>
                </div>
              </main>

              {/* Sidebar Column */}
              {layout.layoutType !== 'one-column' && (
                <aside
                  style={{
                    width: `${layout.sidebarWidthPercent}%`
                  }}
                  className="space-y-4"
                >
                  {/* Search Widget */}
                  <div
                    onClick={() => selectComponent('search-widget')}
                    style={{
                      backgroundColor: appearance.surfaceColor,
                      borderColor: appearance.borderColor,
                      borderRadius: appearance.borderRadius
                    }}
                    className={`p-4 border transition-all cursor-pointer ${
                      selectedComponentId === 'search-widget' ? 'ring-2 ring-orange-500' : ''
                    }`}
                  >
                    <h3 className="font-bold text-xs uppercase tracking-wider text-orange-400 mb-2">
                      Cari Artikel
                    </h3>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="Ketik kata kunci..."
                        className="w-full px-2.5 py-1 text-xs bg-neutral-950 border border-neutral-800 rounded outline-none"
                        readOnly
                      />
                      <button className="px-2.5 py-1 bg-orange-500 text-neutral-950 font-bold rounded text-xs">
                        <Search className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Popular Posts Widget */}
                  <div
                    onClick={() => selectComponent('popular-widget')}
                    style={{
                      backgroundColor: appearance.surfaceColor,
                      borderColor: appearance.borderColor,
                      borderRadius: appearance.borderRadius
                    }}
                    className={`p-4 border transition-all cursor-pointer ${
                      selectedComponentId === 'popular-widget' ? 'ring-2 ring-orange-500' : ''
                    }`}
                  >
                    <h3 className="font-bold text-xs uppercase tracking-wider text-orange-400 mb-2 pb-1 border-b border-neutral-800">
                      Artikel Populer
                    </h3>
                    <ul className="space-y-2 text-xs">
                      <li className="hover:text-orange-400 cursor-pointer flex items-center justify-between">
                        <span>1. Panduan Desain Tema Blogger</span>
                        <ChevronRight className="w-3 h-3 opacity-50" />
                      </li>
                      <li className="hover:text-orange-400 cursor-pointer flex items-center justify-between">
                        <span>2. Menguasai Tag &lt;b:skin&gt;</span>
                        <ChevronRight className="w-3 h-3 opacity-50" />
                      </li>
                      <li className="hover:text-orange-400 cursor-pointer flex items-center justify-between">
                        <span>3. Kiat Kecepatan Loading Tema</span>
                        <ChevronRight className="w-3 h-3 opacity-50" />
                      </li>
                    </ul>
                  </div>
                </aside>
              )}
            </div>
          </div>

          {/* Footer */}
          <footer
            onClick={() => selectComponent('footer-widget')}
            style={{
              backgroundColor: appearance.surfaceColor,
              borderColor: appearance.borderColor
            }}
            className={`border-t p-6 text-center text-xs opacity-75 mt-8 transition-all cursor-pointer ${
              selectedComponentId === 'footer-widget' ? 'ring-2 ring-orange-500' : ''
            }`}
          >
            <p>
              Hak Cipta © 2026 {identity.blogTitle}. Dibuat dengan <strong>Nusantara Theme Builder</strong>.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};
