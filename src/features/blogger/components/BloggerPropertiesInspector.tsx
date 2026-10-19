/**
 * Nusantara Theme Builder — Blogger Properties Inspector
 * Inspector kanan: properti komponen terpilih atau pengaturan tema global Blogger
 * Lisensi: MIT
 */

import React, { useState } from 'react';
import { useProjectStore } from '../../../stores/useProjectStore';
import { BloggerSettingsPanel } from '../settings/BloggerSettingsPanel';
import { BloggerComponentMapper } from '../generator/BloggerComponentMapper';
import {
  Sliders,
  Type,
  Palette,
  Layout,
  Trash2,
  X,
  RotateCcw,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  CheckCircle2,
  AlertTriangle,
  Code2
} from 'lucide-react';

export const BloggerPropertiesInspector: React.FC = () => {
  const {
    currentProject,
    activePageId,
    selectedComponentId,
    selectComponent,
    updateComponent,
    removeComponent,
    resetComponentStyles
  } = useProjectStore();

  const [activeTab, setActiveTab] = useState<'content' | 'styles' | 'blogger'>('content');

  if (!currentProject) return null;

  const activePage =
    currentProject.pages.find((p) => p.id === activePageId) || currentProject.pages[0];
  const selectedComp = activePage?.components.find((c) => c.id === selectedComponentId);

  // Jika tidak ada komponen yang dipilih, tampilkan Pengaturan Global Blogger
  if (!selectedComp) {
    return (
      <aside className="w-80 border-l border-neutral-800 bg-neutral-900/60 flex flex-col shrink-0 overflow-hidden">
        <div className="h-10 px-4 border-b border-neutral-800 bg-neutral-950/80 flex items-center justify-between text-xs font-semibold text-neutral-200">
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-orange-400" />
            <span>Pengaturan Tema Blogger</span>
          </span>
          <span className="text-[10px] font-mono text-neutral-500">Global</span>
        </div>
        <BloggerSettingsPanel />
      </aside>
    );
  }

  // Jika ada komponen terpilih: tampilkan inspektur komponen Blogger
  const mapped = BloggerComponentMapper.mapComponent(selectedComp);

  return (
    <aside className="w-80 border-l border-neutral-800 bg-neutral-900/60 flex flex-col shrink-0 overflow-hidden text-xs text-neutral-300">
      {/* Header Inspektur Komponen */}
      <div className="h-11 px-4 border-b border-neutral-800 bg-neutral-950/80 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2 truncate">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30 shrink-0">
            {selectedComp.type}
          </span>
          <span className="font-bold text-neutral-200 truncate">{selectedComp.label}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => removeComponent(selectedComp.id)}
            className="p-1 rounded hover:bg-rose-950/40 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
            title="Hapus Komponen"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => selectComponent(null)}
            className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Tutup & Kembali ke Pengaturan Tema"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mapping Status Info Pill */}
      <div className="p-2.5 bg-neutral-950/40 border-b border-neutral-800 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5">
          {mapped.supportStatus === 'supported' ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          )}
          <span className="font-mono text-[10px] text-neutral-400">
            {mapped.targetWidgetType ? `<${mapped.targetWidgetType}>` : 'HTML fallback'}
          </span>
        </div>
        <span
          className={`text-[10px] font-semibold ${
            mapped.supportStatus === 'supported' ? 'text-emerald-400' : 'text-amber-400'
          }`}
        >
          {mapped.supportStatus === 'supported' ? 'Didukung Penuh' : 'Didukung Sebagian'}
        </span>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 border-b border-neutral-800 bg-neutral-950/80 text-center select-none text-[11px]">
        <button
          onClick={() => setActiveTab('content')}
          className={`py-2 font-medium transition-colors cursor-pointer border-b-2 ${
            activeTab === 'content'
              ? 'border-orange-500 text-orange-400 font-bold bg-neutral-900/60'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Konten
        </button>
        <button
          onClick={() => setActiveTab('styles')}
          className={`py-2 font-medium transition-colors cursor-pointer border-b-2 ${
            activeTab === 'styles'
              ? 'border-orange-500 text-orange-400 font-bold bg-neutral-900/60'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Gaya
        </button>
        <button
          onClick={() => setActiveTab('blogger')}
          className={`py-2 font-medium transition-colors cursor-pointer border-b-2 ${
            activeTab === 'blogger'
              ? 'border-orange-500 text-orange-400 font-bold bg-neutral-900/60'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Blogger
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: KONTEN */}
        {activeTab === 'content' && (
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-neutral-400">Label Komponen</label>
              <input
                type="text"
                value={selectedComp.label}
                onChange={(e) => updateComponent(selectedComp.id, { label: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded text-neutral-100 text-xs focus:border-orange-500 outline-none"
              />
            </div>

            {selectedComp.props.title !== undefined && (
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-neutral-400">Judul / Tajuk</label>
                <input
                  type="text"
                  value={String(selectedComp.props.title || '')}
                  onChange={(e) =>
                    updateComponent(selectedComp.id, {
                      props: { ...selectedComp.props, title: e.target.value }
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded text-neutral-100 text-xs focus:border-orange-500 outline-none"
                />
              </div>
            )}

            {selectedComp.props.subtitle !== undefined && (
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-neutral-400">Subjudul / Deskripsi</label>
                <textarea
                  rows={2}
                  value={String(selectedComp.props.subtitle || '')}
                  onChange={(e) =>
                    updateComponent(selectedComp.id, {
                      props: { ...selectedComp.props, subtitle: e.target.value }
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded text-neutral-100 text-xs focus:border-orange-500 outline-none"
                />
              </div>
            )}

            {selectedComp.props.content !== undefined && (
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-neutral-400">Isi Konten</label>
                <textarea
                  rows={4}
                  value={String(selectedComp.props.content || '')}
                  onChange={(e) =>
                    updateComponent(selectedComp.id, {
                      props: { ...selectedComp.props, content: e.target.value }
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded text-neutral-100 text-xs focus:border-orange-500 outline-none"
                />
              </div>
            )}

            {selectedComp.props.buttonText !== undefined && (
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-neutral-400">Teks Tombol</label>
                <input
                  type="text"
                  value={String(selectedComp.props.buttonText || '')}
                  onChange={(e) =>
                    updateComponent(selectedComp.id, {
                      props: { ...selectedComp.props, buttonText: e.target.value }
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded text-neutral-100 text-xs focus:border-orange-500 outline-none"
                />
              </div>
            )}
          </div>
        )}

        {/* TAB 2: GAYA & LAYOUT */}
        {activeTab === 'styles' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-neutral-400">Warna Latar</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={selectedComp.styles.backgroundColor || '#000000'}
                    onChange={(e) =>
                      updateComponent(selectedComp.id, {
                        styles: { ...selectedComp.styles, backgroundColor: e.target.value }
                      })
                    }
                    className="w-6 h-6 rounded border border-neutral-800 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={selectedComp.styles.backgroundColor || 'transparent'}
                    onChange={(e) =>
                      updateComponent(selectedComp.id, {
                        styles: { ...selectedComp.styles, backgroundColor: e.target.value }
                      })
                    }
                    className="w-full px-2 py-1 bg-neutral-950 border border-neutral-800 rounded text-neutral-200 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-neutral-400">Warna Teks</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={selectedComp.styles.textColor || '#ffffff'}
                    onChange={(e) =>
                      updateComponent(selectedComp.id, {
                        styles: { ...selectedComp.styles, textColor: e.target.value }
                      })
                    }
                    className="w-6 h-6 rounded border border-neutral-800 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={selectedComp.styles.textColor || 'inherit'}
                    onChange={(e) =>
                      updateComponent(selectedComp.id, {
                        styles: { ...selectedComp.styles, textColor: e.target.value }
                      })
                    }
                    className="w-full px-2 py-1 bg-neutral-950 border border-neutral-800 rounded text-neutral-200 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-neutral-400">Perataan Teks</label>
              <div className="grid grid-cols-4 gap-1 bg-neutral-950 p-1 rounded border border-neutral-800">
                {(['left', 'center', 'right', 'justify'] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() =>
                      updateComponent(selectedComp.id, {
                        styles: { ...selectedComp.styles, textAlign: align }
                      })
                    }
                    className={`py-1 flex items-center justify-center rounded cursor-pointer ${
                      selectedComp.styles.textAlign === align
                        ? 'bg-orange-500 text-neutral-950'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {align === 'left' && <AlignLeft className="w-3.5 h-3.5" />}
                    {align === 'center' && <AlignCenter className="w-3.5 h-3.5" />}
                    {align === 'right' && <AlignRight className="w-3.5 h-3.5" />}
                    {align === 'justify' && <AlignJustify className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-neutral-400">Padding</label>
              <select
                value={selectedComp.styles.padding || '1rem'}
                onChange={(e) =>
                  updateComponent(selectedComp.id, {
                    styles: { ...selectedComp.styles, padding: e.target.value }
                  })
                }
                className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded text-neutral-200 text-xs"
              >
                <option value="0.5rem">Kecil (0.5rem / 8px)</option>
                <option value="1rem">Sedang (1rem / 16px)</option>
                <option value="1.5rem">Besar (1.5rem / 24px)</option>
                <option value="2rem">Ekstra Besar (2rem / 32px)</option>
                <option value="3rem">Super Lebar (3rem / 48px)</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                onClick={() => resetComponentStyles(selectedComp.id)}
                className="w-full py-1.5 rounded bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-orange-400 border border-neutral-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Kembalikan Gaya ke Default</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: SPESIFIK BLOGGER */}
        {activeTab === 'blogger' && (
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1.5">
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block">
                Pemetaan XML Blogger:
              </span>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                {mapped.notes}
              </p>
              <div className="pt-1 font-mono text-[10px] text-neutral-500">
                Section Tujuan: <code>{mapped.targetSection}</code>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-neutral-400">Blogger Widget ID (Opsional)</label>
              <input
                type="text"
                placeholder={mapped.targetWidgetType ? `${mapped.targetWidgetType}1` : 'CustomHTML1'}
                readOnly
                className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-400 font-mono text-xs cursor-not-allowed"
              />
              <span className="text-[10px] text-neutral-500">
                ID widget dikelola otomatis oleh generator tema untuk menjamin keunikan skema.
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
