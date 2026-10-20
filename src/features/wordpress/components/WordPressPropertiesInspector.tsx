/**
 * Nusantara Theme Builder — WordPress Properties Inspector
 * Inspektur properti 3-tab: Blok Terpilih, Global Styles (theme.json), dan Validasi Cepat
 * Lisensi: MIT
 */

import React, { useState } from 'react';
import { ThemeComponent } from '../../../types/project';
import {
  WordPressThemeJsonConfig,
  WordPressValidationResult
} from '../types/wordpress';
import {
  Sliders,
  Palette,
  CheckCircle2,
  AlertTriangle,
  Type,
  Maximize2,
  Box,
  Layers
} from 'lucide-react';

interface WordPressPropertiesInspectorProps {
  selectedComponent: ThemeComponent | null;
  onUpdateComponentProps: (componentId: string, props: Record<string, unknown>) => void;
  themeJson: WordPressThemeJsonConfig;
  onUpdateThemeJson: (updated: WordPressThemeJsonConfig) => void;
  validation: WordPressValidationResult;
  onOpenValidationModal: () => void;
}

export const WordPressPropertiesInspector: React.FC<WordPressPropertiesInspectorProps> = ({
  selectedComponent,
  onUpdateComponentProps,
  themeJson,
  onUpdateThemeJson,
  validation,
  onOpenValidationModal
}) => {
  const [activeTab, setActiveTab] = useState<'block' | 'styles' | 'validation'>('block');

  const palette = themeJson?.settings?.color?.palette || [];

  const handleUpdatePaletteColor = (slug: string, newColor: string) => {
    const updatedPalette = palette.map((c) =>
      c.slug === slug ? { ...c, color: newColor } : c
    );
    onUpdateThemeJson({
      ...themeJson,
      settings: {
        ...themeJson.settings,
        color: {
          ...themeJson.settings.color,
          palette: updatedPalette
        }
      }
    });
  };

  const handleUpdateFont = (slug: string, newFontFamily: string) => {
    const fontFamilies = themeJson?.settings?.typography?.fontFamilies || [];
    const updatedFonts = fontFamilies.map((f) =>
      f.slug === slug ? { ...f, fontFamily: newFontFamily } : f
    );
    onUpdateThemeJson({
      ...themeJson,
      settings: {
        ...themeJson.settings,
        typography: {
          ...themeJson.settings.typography,
          fontFamilies: updatedFonts
        }
      }
    });
  };

  const handleUpdateLayout = (field: 'contentSize' | 'wideSize', value: string) => {
    onUpdateThemeJson({
      ...themeJson,
      settings: {
        ...themeJson.settings,
        layout: {
          ...themeJson.settings.layout,
          [field]: value
        }
      }
    });
  };

  const compProps = selectedComponent?.props || {};

  const handlePropChange = (key: string, value: any) => {
    if (!selectedComponent) return;
    onUpdateComponentProps(selectedComponent.id, {
      ...compProps,
      [key]: value
    });
  };

  return (
    <aside className="w-80 border-l border-neutral-800 bg-neutral-900/50 flex flex-col shrink-0 overflow-hidden select-none">
      {/* Tab Header */}
      <div className="grid grid-cols-3 border-b border-neutral-800 bg-neutral-950/80 text-xs">
        <button
          onClick={() => setActiveTab('block')}
          className={`py-2.5 flex items-center justify-center gap-1.5 font-medium transition-colors cursor-pointer border-b-2 ${
            activeTab === 'block'
              ? 'border-blue-500 text-blue-400 font-bold bg-neutral-900/50'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
          title="Atribut Blok Gutenberg Terpilih"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Blok</span>
        </button>

        <button
          onClick={() => setActiveTab('styles')}
          className={`py-2.5 flex items-center justify-center gap-1.5 font-medium transition-colors cursor-pointer border-b-2 ${
            activeTab === 'styles'
              ? 'border-blue-500 text-blue-400 font-bold bg-neutral-900/50'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
          title="Visual Editor theme.json (Warna, Font, Layout)"
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Styles</span>
        </button>

        <button
          onClick={() => setActiveTab('validation')}
          className={`py-2.5 flex items-center justify-center gap-1.5 font-medium transition-colors cursor-pointer border-b-2 ${
            activeTab === 'validation'
              ? 'border-blue-500 text-blue-400 font-bold bg-neutral-900/50'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
          title="Uji Standar WordPress"
        >
          {validation.isValid ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          )}
          <span>Validasi</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
        {/* Tab 1: Atribut Blok Terpilih */}
        {activeTab === 'block' && (
          <div className="space-y-3">
            {selectedComponent ? (
              <>
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">
                    Blok Terpilih
                  </span>
                  <h4 className="font-semibold text-white">
                    {selectedComponent.name || selectedComponent.type}
                  </h4>
                  <span className="text-[10px] font-mono text-blue-400">
                    &lt;!-- wp:{selectedComponent.type} /--&gt;
                  </span>
                </div>

                {/* Form Dinamis Berdasarkan Tipe Blok */}
                {(selectedComponent.type === 'hero' || selectedComponent.type === 'cta') && (
                  <div className="space-y-2">
                    <div>
                      <label className="text-neutral-400 block mb-1 font-semibold">Judul Utama (Headline)</label>
                      <input
                        type="text"
                        value={String(compProps.headline || '')}
                        onChange={(e) => handlePropChange('headline', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-750 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-neutral-400 block mb-1 font-semibold">Subjudul / Deskripsi</label>
                      <textarea
                        value={String(compProps.subheadline || '')}
                        onChange={(e) => handlePropChange('subheadline', e.target.value)}
                        rows={2}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-750 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-neutral-400 block mb-1 font-semibold">Teks Tombol</label>
                        <input
                          type="text"
                          value={String(compProps.ctaText || compProps.buttonText || '')}
                          onChange={(e) => handlePropChange('ctaText', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-750 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-neutral-400 block mb-1 font-semibold">Link Tombol</label>
                        <input
                          type="text"
                          value={String(compProps.ctaLink || compProps.buttonLink || '#')}
                          onChange={(e) => handlePropChange('ctaLink', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-750 text-white font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedComponent.type === 'header' && (
                  <div className="space-y-2">
                    <div>
                      <label className="text-neutral-400 block mb-1 font-semibold">Judul Header</label>
                      <input
                        type="text"
                        value={String(compProps.title || '')}
                        onChange={(e) => handlePropChange('title', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-750 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-neutral-400 block mb-1 font-semibold">Subjudul</label>
                      <input
                        type="text"
                        value={String(compProps.subtitle || '')}
                        onChange={(e) => handlePropChange('subtitle', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-750 text-white"
                      />
                    </div>
                  </div>
                )}

                {selectedComponent.type === 'navigation' && (
                  <div className="space-y-2">
                    <div>
                      <label className="text-neutral-400 block mb-1 font-semibold">Nama Situs / Brand</label>
                      <input
                        type="text"
                        value={String(compProps.brandText || '')}
                        onChange={(e) => handlePropChange('brandText', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-750 text-white"
                      />
                    </div>
                  </div>
                )}

                {(selectedComponent.type === 'article-list' || selectedComponent.type === 'post-grid') && (
                  <div className="space-y-2">
                    <div>
                      <label className="text-neutral-400 block mb-1 font-semibold">Judul Daftar Post</label>
                      <input
                        type="text"
                        value={String(compProps.title || 'Artikel Terbaru')}
                        onChange={(e) => handlePropChange('title', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-750 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-neutral-400 block mb-1 font-semibold">Jumlah Post per Halaman</label>
                      <input
                        type="number"
                        min={1}
                        max={24}
                        value={Number(compProps.postsPerPage || 6)}
                        onChange={(e) => handlePropChange('postsPerPage', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-750 text-white"
                      />
                    </div>
                  </div>
                )}

                {selectedComponent.type === 'footer' && (
                  <div className="space-y-2">
                    <div>
                      <label className="text-neutral-400 block mb-1 font-semibold">Teks Hak Cipta</label>
                      <textarea
                        value={String(compProps.copyrightText || '')}
                        onChange={(e) => handlePropChange('copyrightText', e.target.value)}
                        rows={2}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-750 text-white"
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 px-4 space-y-2 text-neutral-500">
                <Box className="w-8 h-8 text-neutral-600 mx-auto" />
                <p className="text-xs text-neutral-400">
                  Belum ada blok yang dipilih.
                </p>
                <p className="text-[11px]">
                  Klik salah satu blok pada kanvas tengah atau dari tab "Struktur" di sidebar kiri.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Global Styles (theme.json) */}
        {activeTab === 'styles' && (
          <div className="space-y-4">
            {/* Color Palette */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-neutral-300 font-semibold">
                <Palette className="w-3.5 h-3.5 text-blue-400" />
                <span>Palet Warna (theme.json)</span>
              </div>

              <div className="space-y-1.5">
                {palette.map((col) => (
                  <div
                    key={col.slug}
                    className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-neutral-200 block text-[11px]">
                        {col.name}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500">
                        --wp--preset--color--{col.slug}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-neutral-400">
                        {col.color}
                      </span>
                      <input
                        type="color"
                        value={col.color}
                        onChange={(e) => handleUpdatePaletteColor(col.slug, e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer border border-neutral-700 bg-transparent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-neutral-300 font-semibold">
                <Type className="w-3.5 h-3.5 text-amber-400" />
                <span>Font Families</span>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-neutral-400 block mb-1 text-[11px]">Font Sans (Utama)</label>
                  <input
                    type="text"
                    value={themeJson?.settings?.typography?.fontFamilies?.find((f) => f.slug === 'primary')?.fontFamily || ''}
                    onChange={(e) => handleUpdateFont('primary', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-750 text-white font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>

            {/* Layout Dimensions */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-neutral-300 font-semibold">
                <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Dimensi Layout</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-neutral-400 block mb-1 text-[11px]">Content Size</label>
                  <input
                    type="text"
                    value={themeJson?.settings?.layout?.contentSize || '840px'}
                    onChange={(e) => handleUpdateLayout('contentSize', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-750 text-white font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1 text-[11px]">Wide Size</label>
                  <input
                    type="text"
                    value={themeJson?.settings?.layout?.wideSize || '1200px'}
                    onChange={(e) => handleUpdateLayout('wideSize', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-750 text-white font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Validasi Cepat */}
        {activeTab === 'validation' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-center">
              <div className="flex items-center justify-center gap-2">
                {validation.isValid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                )}
                <span className="font-bold text-white text-sm">
                  Skor: {validation.scorePercent}%
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                {validation.isValid
                  ? 'Tema memenuhi seluruh standar WordPress Block Theme 6.x.'
                  : `Ditemukan ${validation.totalErrors} galat dan ${validation.totalWarnings} peringatan.`}
              </p>
              <button
                onClick={onOpenValidationModal}
                className="w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Buka Laporan Lengkap
              </button>
            </div>

            <div className="space-y-1.5">
              {validation.items.map((item) => (
                <div
                  key={item.id}
                  className={`p-2 rounded-lg border text-[11px] space-y-0.5 ${
                    item.type === 'error'
                      ? 'bg-red-950/30 border-red-800/40 text-red-300'
                      : item.type === 'warning'
                      ? 'bg-amber-950/30 border-amber-800/40 text-amber-300'
                      : 'bg-blue-950/30 border-blue-800/40 text-blue-300'
                  }`}
                >
                  <span className="font-semibold block">{item.message}</span>
                  <span className="opacity-80 block">{item.recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
