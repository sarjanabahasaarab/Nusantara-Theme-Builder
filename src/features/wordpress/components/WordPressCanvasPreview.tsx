/**
 * Nusantara Theme Builder — WordPress Canvas Preview
 * Kanvas pratinjau responsif dengan perenderan blok Gutenberg interaktif
 * Lisensi: MIT
 */

import React from 'react';
import { ThemeComponent } from '../../../types/project';
import { WordPressThemeJsonConfig } from '../types/wordpress';
import {
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Plus,
  Box,
  Layers
} from 'lucide-react';

interface WordPressCanvasPreviewProps {
  components: ThemeComponent[];
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  viewport: 'desktop' | 'tablet' | 'mobile';
  themeJson: WordPressThemeJsonConfig;
  activeTemplateTitle: string;
}

export const WordPressCanvasPreview: React.FC<WordPressCanvasPreviewProps> = ({
  components,
  selectedComponentId,
  onSelectComponent,
  viewport,
  themeJson,
  activeTemplateTitle
}) => {
  // Ambil warna tema dari theme.json
  const palette = themeJson?.settings?.color?.palette || [];
  const primaryColor = palette.find((c) => c.slug === 'primary')?.color || '#2563eb';
  const secondaryColor = palette.find((c) => c.slug === 'secondary')?.color || '#1e293b';
  const bgColor = palette.find((c) => c.slug === 'background')?.color || '#ffffff';
  const textColor = palette.find((c) => c.slug === 'text')?.color || '#0f172a';
  const accentColor = palette.find((c) => c.slug === 'accent')?.color || '#f59e0b';

  // Viewport width styling
  const getViewportWidthClass = () => {
    switch (viewport) {
      case 'mobile':
        return 'w-[375px] min-h-[667px] shadow-2xl rounded-2xl border-4 border-neutral-800';
      case 'tablet':
        return 'w-[768px] min-h-[1024px] shadow-2xl rounded-2xl border-4 border-neutral-800';
      case 'desktop':
      default:
        return 'w-full min-h-full rounded-lg border border-neutral-800';
    }
  };

  const renderComponent = (comp: ThemeComponent) => {
    const isSelected = comp.id === selectedComponentId;
    const props = comp.props || {};

    const wrapperClass = `relative group transition-all cursor-pointer ${
      isSelected
        ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-neutral-900 z-10'
        : 'hover:ring-1 hover:ring-blue-400/50'
    }`;

    let innerContent: React.ReactNode = null;

    switch (comp.type) {
      case 'navigation':
        innerContent = (
          <header className="px-6 py-4 flex items-center justify-between border-b border-neutral-200/20 bg-neutral-900/50 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-xs"
                style={{ backgroundColor: primaryColor }}
              >
                WP
              </div>
              <span className="font-bold text-sm tracking-tight text-white">
                {String(props.brandText || 'Nusantara Blog')}
              </span>
            </div>
            <nav className="flex items-center gap-4 text-xs font-medium text-neutral-300">
              <span className="hover:text-white">Beranda</span>
              <span className="hover:text-white">Artikel</span>
              <span className="hover:text-white">Tentang</span>
              <span className="hover:text-white">Kontak</span>
            </nav>
          </header>
        );
        break;

      case 'hero':
        innerContent = (
          <div
            className="px-6 py-16 text-center space-y-4"
            style={{
              backgroundColor: primaryColor,
              color: '#ffffff'
            }}
          >
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight">
              {String(props.headline || 'Membangun Peradaban Digital')}
            </h1>
            <p className="text-sm sm:text-base opacity-90 max-w-xl mx-auto">
              {String(props.subheadline || 'Karya terbaik dengan standar Full Site Editing')}
            </p>
            <div className="pt-2">
              <button
                className="px-5 py-2.5 rounded-lg font-bold text-xs shadow-lg transition-transform hover:scale-105"
                style={{ backgroundColor: accentColor, color: '#09090b' }}
              >
                {String(props.ctaText || 'Mulai Sekarang')}
              </button>
            </div>
          </div>
        );
        break;

      case 'article-list':
      case 'post-grid':
        innerContent = (
          <div className="p-6 space-y-4 bg-neutral-900/30">
            <h2 className="text-lg font-bold text-white">
              {String(props.title || 'Artikel Terbaru')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-neutral-800 bg-neutral-900/80 overflow-hidden space-y-2.5 pb-3"
                >
                  <div
                    className="h-32 bg-neutral-800 flex items-center justify-center text-xs font-mono text-neutral-500"
                    style={{ backgroundColor: '#27272a' }}
                  >
                    Featured Image {i}
                  </div>
                  <div className="px-3 space-y-1">
                    <span className="text-[10px] text-blue-400 font-semibold uppercase">
                      Teknologi
                    </span>
                    <h3 className="text-xs font-bold text-neutral-200 line-clamp-2">
                      {i === 1
                        ? 'Memahami Arsitektur Block Theme WordPress 6.x'
                        : i === 2
                        ? 'Panduan Lengkap Penyusunan theme.json v3'
                        : 'Meningkatkan Skor Kecepatan Web dengan FSE'}
                    </h3>
                    <p className="text-[11px] text-neutral-400 line-clamp-2">
                      WordPress memperkenalkan Site Editor untuk menyusun seluruh bagian website tanpa menulis kode PHP manual.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'article':
        innerContent = (
          <article className="p-6 max-w-2xl mx-auto space-y-4 bg-neutral-900/40 rounded-xl my-4">
            <div className="space-y-1">
              <span className="text-xs font-mono text-blue-400">18 Oktober 2026 • Oleh Redaksi</span>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                {String(props.title || 'Konten Artikel WordPress')}
              </h1>
            </div>
            <div className="h-44 bg-neutral-800 rounded-lg flex items-center justify-center text-xs text-neutral-400">
              Featured Image Banner (16:9)
            </div>
            <div className="text-xs leading-relaxed text-neutral-300 space-y-2">
              <p>
                {String(
                  props.content ||
                    'WordPress Block Theme (Full Site Editing) memberikan kebebasan mutlak kepada desainer dan pengembang untuk menata seluruh elemen web melalui blok Gutenberg tanpa harus menulis file PHP yang rumit.'
                )}
              </p>
              <p>
                Dengan berkas theme.json, seluruh palet warna, tipografi, dan spasi dapat diatur secara terpusat dan konsisten di seluruh template.
              </p>
            </div>
          </article>
        );
        break;

      case 'features':
        innerContent = (
          <div className="p-6 bg-neutral-950">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: '⚡ Kecepatan Tinggi', desc: 'Tanpa dependensi jQuery berat.' },
                { title: '🎨 Kustomisasi FSE', desc: 'Atur warna dan tata letak dari wp-admin.' },
                { title: '🛡️ Standar WP 6.x', desc: 'Aman dan memenuhi theme review guidelines.' }
              ].map((f, i) => (
                <div key={i} className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-1">
                  <h4 className="text-xs font-bold text-white">{f.title}</h4>
                  <p className="text-[11px] text-neutral-400">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'cta':
      case 'newsletter':
        innerContent = (
          <div
            className="p-8 text-center space-y-3 m-4 rounded-2xl"
            style={{ backgroundColor: secondaryColor, color: '#ffffff' }}
          >
            <h3 className="text-lg font-bold">
              {String(props.headline || 'Bergabung Bersama Kami')}
            </h3>
            <p className="text-xs text-neutral-300 max-w-md mx-auto">
              {String(props.subheadline || 'Dapatkan berita dan pembaruan rilis tema langsung di surel Anda.')}
            </p>
            <div className="pt-2">
              <button
                className="px-4 py-2 rounded-lg text-xs font-bold shadow transition-transform hover:scale-105"
                style={{ backgroundColor: primaryColor, color: '#ffffff' }}
              >
                {String(props.buttonText || 'Daftar Sekarang')}
              </button>
            </div>
          </div>
        );
        break;

      case 'footer':
        innerContent = (
          <footer className="p-6 border-t border-neutral-800 bg-neutral-950 text-neutral-400 text-xs text-center space-y-1">
            <p>{String(props.copyrightText || '© 2026 Nusantara Theme Builder. Ditenagai oleh WordPress.')}</p>
            <p className="text-[10px] text-neutral-500">
              Tema Block Theme v3 • Validated for WordPress 6.x FSE
            </p>
          </footer>
        );
        break;

      default:
        innerContent = (
          <div className="p-4 border border-dashed border-neutral-700 rounded-lg text-xs text-neutral-400 flex items-center justify-between">
            <span className="font-semibold text-neutral-300">{comp.name || comp.type}</span>
            <span className="font-mono text-[10px] text-neutral-500">wp:{comp.type}</span>
          </div>
        );
    }

    return (
      <div
        key={comp.id}
        onClick={(e) => {
          e.stopPropagation();
          onSelectComponent(comp.id);
        }}
        className={wrapperClass}
      >
        {isSelected && (
          <div className="absolute top-1 right-1 z-20 px-2 py-0.5 rounded bg-blue-600 text-white font-mono text-[9px] shadow-sm flex items-center gap-1">
            <Box className="w-2.5 h-2.5" />
            <span>wp:{comp.type}</span>
          </div>
        )}
        {innerContent}
      </div>
    );
  };

  return (
    <div
      onClick={() => onSelectComponent(null)}
      className="flex-1 overflow-y-auto bg-neutral-950/80 p-4 sm:p-6 flex flex-col items-center justify-start select-none"
    >
      {/* Viewport Info Header */}
      <div className="w-full max-w-4xl flex items-center justify-between text-xs text-neutral-400 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-semibold text-neutral-300">
            Pratinjau Template: {activeTemplateTitle}
          </span>
        </div>
        <span className="font-mono text-[10px] text-neutral-500">
          Viewport: {viewport.toUpperCase()}
        </span>
      </div>

      {/* Responsive Viewport Frame */}
      <div
        className={`bg-neutral-900 transition-all duration-300 overflow-hidden flex flex-col ${getViewportWidthClass()}`}
        style={{
          fontFamily: themeJson?.settings?.typography?.fontFamilies?.[0]?.fontFamily || 'inherit'
        }}
      >
        {components.length > 0 ? (
          components.map(renderComponent)
        ) : (
          <div className="py-24 text-center space-y-3 px-6">
            <Box className="w-10 h-10 text-neutral-600 mx-auto" />
            <h3 className="text-sm font-semibold text-neutral-300">
              Template ini masih kosong
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Silakan tambahkan komponen dari tab "Komponen" di sidebar kiri atau gunakan Block Patterns siap pakai.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
