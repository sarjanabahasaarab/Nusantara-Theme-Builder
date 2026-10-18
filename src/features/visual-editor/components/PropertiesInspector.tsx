/**
 * Nusantara Theme Builder — Properties Inspector
 * Panel inspektur properti komprehensif: Konten, Gaya, Platform, serta Pengaturan Global Tema
 */

import React, { useState } from 'react';
import { useProjectStore } from '../../../stores/useProjectStore';
import {
  Sliders,
  Type,
  Palette,
  Code2,
  Trash2,
  X,
  RotateCcw,
  Plus,
  Image as ImageIcon,
  Check,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ExternalLink,
  Layers,
  Settings
} from 'lucide-react';
import { AssetPickerModal } from './AssetPickerModal';
import { ProjectAsset } from '../../../types/project';

export const PropertiesInspector: React.FC = () => {
  const {
    currentProject,
    activePageId,
    selectedComponentId,
    selectComponent,
    updateComponent,
    removeComponent,
    resetComponentStyles,
    updateThemeSettings,
    updatePage
  } = useProjectStore();

  const [inspectorTab, setInspectorTab] = useState<'content' | 'styles' | 'advanced'>('content');
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);

  if (!currentProject) return null;

  const activePage = currentProject.pages.find((p) => p.id === activePageId) || currentProject.pages[0];
  const selectedComp = activePage?.components.find((c) => c.id === selectedComponentId);

  // If a component is selected: Component Inspector
  if (selectedComp) {
    const handleAddNavItem = () => {
      const items = (selectedComp.props.items as Array<{ id: string; label: string; url: string }>) || [];
      const newItem = {
        id: 'item-' + Math.random().toString(36).substring(2, 7),
        label: 'Menu Baru',
        url: '#'
      };
      updateComponent(selectedComp.id, {
        props: { ...selectedComp.props, items: [...items, newItem] }
      });
    };

    const handleUpdateNavItem = (itemId: string, field: 'label' | 'url', val: string) => {
      const items = (selectedComp.props.items as Array<{ id: string; label: string; url: string }>) || [];
      const updated = items.map((it) => (it.id === itemId ? { ...it, [field]: val } : it));
      updateComponent(selectedComp.id, {
        props: { ...selectedComp.props, items: updated }
      });
    };

    const handleRemoveNavItem = (itemId: string) => {
      const items = (selectedComp.props.items as Array<{ id: string; label: string; url: string }>) || [];
      updateComponent(selectedComp.id, {
        props: { ...selectedComp.props, items: items.filter((it) => it.id !== itemId) }
      });
    };

    return (
      <aside className="w-80 border-l border-neutral-800 bg-neutral-900/60 flex flex-col shrink-0 overflow-hidden select-none">
        {/* Inspector Header */}
        <div className="p-3.5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Sliders className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-neutral-200 truncate uppercase tracking-wider">
                Inspector
              </h3>
              <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold">
                {selectedComp.type}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => removeComponent(selectedComp.id)}
              className="p-1 rounded text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Hapus Komponen"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => selectComponent(null)}
              className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Batal Pilih"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Component Title & Label */}
        <div className="px-3 py-2 bg-neutral-950/60 border-b border-neutral-800">
          <label className="text-[10px] text-neutral-400 block mb-1">Nama Label Komponen</label>
          <input
            type="text"
            value={selectedComp.label}
            onChange={(e) => updateComponent(selectedComp.id, { label: e.target.value })}
            className="w-full px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded text-xs text-neutral-200 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 border-b border-neutral-800 bg-neutral-950/80 text-[11px] font-medium text-center">
          <button
            onClick={() => setInspectorTab('content')}
            className={`py-2 transition-colors cursor-pointer border-b-2 flex items-center justify-center gap-1.5 ${
              inspectorTab === 'content'
                ? 'border-amber-400 text-amber-400 font-bold bg-neutral-900/50'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Type className="w-3 h-3" /> Konten
          </button>
          <button
            onClick={() => setInspectorTab('styles')}
            className={`py-2 transition-colors cursor-pointer border-b-2 flex items-center justify-center gap-1.5 ${
              inspectorTab === 'styles'
                ? 'border-amber-400 text-amber-400 font-bold bg-neutral-900/50'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Palette className="w-3 h-3" /> Gaya
          </button>
          <button
            onClick={() => setInspectorTab('advanced')}
            className={`py-2 transition-colors cursor-pointer border-b-2 flex items-center justify-center gap-1.5 ${
              inspectorTab === 'advanced'
                ? 'border-amber-400 text-amber-400 font-bold bg-neutral-900/50'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Code2 className="w-3 h-3" /> Lanjutan
          </button>
        </div>

        {/* Tab 1: Konten */}
        {inspectorTab === 'content' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* Title */}
            {selectedComp.props.title !== undefined && (
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-300 block">
                  Judul (Title)
                </label>
                <input
                  type="text"
                  value={String(selectedComp.props.title || '')}
                  onChange={(e) =>
                    updateComponent(selectedComp.id, {
                      props: { ...selectedComp.props, title: e.target.value }
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded text-neutral-200 focus:outline-none focus:border-amber-400"
                />
              </div>
            )}

            {/* Subtitle */}
            {selectedComp.props.subtitle !== undefined && (
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-300 block">
                  Subjudul / Slogan
                </label>
                <input
                  type="text"
                  value={String(selectedComp.props.subtitle || '')}
                  onChange={(e) =>
                    updateComponent(selectedComp.id, {
                      props: { ...selectedComp.props, subtitle: e.target.value }
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded text-neutral-200 focus:outline-none focus:border-amber-400"
                />
              </div>
            )}

            {/* Author for Article */}
            {selectedComp.props.author !== undefined && (
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-300 block">
                  Nama Penulis
                </label>
                <input
                  type="text"
                  value={String(selectedComp.props.author || '')}
                  onChange={(e) =>
                    updateComponent(selectedComp.id, {
                      props: { ...selectedComp.props, author: e.target.value }
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded text-neutral-200 focus:outline-none focus:border-amber-400"
                />
              </div>
            )}

            {/* Date for Article */}
            {selectedComp.props.date !== undefined && (
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-300 block">
                  Tanggal Publikasi
                </label>
                <input
                  type="text"
                  value={String(selectedComp.props.date || '')}
                  onChange={(e) =>
                    updateComponent(selectedComp.id, {
                      props: { ...selectedComp.props, date: e.target.value }
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded text-neutral-200 focus:outline-none focus:border-amber-400"
                />
              </div>
            )}

            {/* Content / Body textarea */}
            {selectedComp.props.content !== undefined && (
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-300 block">
                  Teks Konten / Paragraf
                </label>
                <textarea
                  rows={4}
                  value={String(selectedComp.props.content || '')}
                  onChange={(e) =>
                    updateComponent(selectedComp.id, {
                      props: { ...selectedComp.props, content: e.target.value }
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded text-neutral-200 focus:outline-none focus:border-amber-400 leading-relaxed"
                />
              </div>
            )}

            {/* Quote text for Quote component */}
            {selectedComp.props.quote !== undefined && (
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-300 block">
                  Kalimat Kutipan
                </label>
                <textarea
                  rows={3}
                  value={String(selectedComp.props.quote || '')}
                  onChange={(e) =>
                    updateComponent(selectedComp.id, {
                      props: { ...selectedComp.props, quote: e.target.value }
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded text-neutral-200 focus:outline-none focus:border-amber-400 font-serif italic"
                />
              </div>
            )}

            {/* Quote role */}
            {selectedComp.props.role !== undefined && (
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-300 block">
                  Jabatan / Keterangan Tokoh
                </label>
                <input
                  type="text"
                  value={String(selectedComp.props.role || '')}
                  onChange={(e) =>
                    updateComponent(selectedComp.id, {
                      props: { ...selectedComp.props, role: e.target.value }
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded text-neutral-200 focus:outline-none focus:border-amber-400"
                />
              </div>
            )}

            {/* Image URL & Asset Picker */}
            {selectedComp.props.imageUrl !== undefined && (
              <div className="space-y-2 p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-neutral-300">
                    URL Gambar
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsAssetPickerOpen(true)}
                    className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <ImageIcon className="w-3 h-3" /> Pilih dari Aset Proyek
                  </button>
                </div>
                <input
                  type="text"
                  value={String(selectedComp.props.imageUrl || '')}
                  onChange={(e) =>
                    updateComponent(selectedComp.id, {
                      props: { ...selectedComp.props, imageUrl: e.target.value }
                    })
                  }
                  placeholder="https://... atau data:image/..."
                  className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded font-mono text-xs text-neutral-300 focus:outline-none focus:border-amber-400"
                />
                {selectedComp.props.imageUrl && (
                  <div className="h-20 w-full rounded bg-neutral-900 border border-neutral-800 overflow-hidden flex items-center justify-center">
                    <img
                      src={String(selectedComp.props.imageUrl)}
                      alt="Pratinjau"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {selectedComp.props.alt !== undefined && (
                  <div className="space-y-1 pt-1">
                    <label className="text-[10px] text-neutral-400">Teks Alternatif (Alt)</label>
                    <input
                      type="text"
                      value={String(selectedComp.props.alt || '')}
                      onChange={(e) =>
                        updateComponent(selectedComp.id, {
                          props: { ...selectedComp.props, alt: e.target.value }
                        })
                      }
                      className="w-full px-2 py-1 bg-neutral-900 border border-neutral-800 rounded text-xs text-neutral-300"
                    />
                  </div>
                )}
                {selectedComp.props.caption !== undefined && (
                  <div className="space-y-1">
                    <label className="text-[10px] text-neutral-400">Takarir (Caption)</label>
                    <input
                      type="text"
                      value={String(selectedComp.props.caption || '')}
                      onChange={(e) =>
                        updateComponent(selectedComp.id, {
                          props: { ...selectedComp.props, caption: e.target.value }
                        })
                      }
                      className="w-full px-2 py-1 bg-neutral-900 border border-neutral-800 rounded text-xs text-neutral-300"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Button Text & URL */}
            {selectedComp.props.buttonText !== undefined && (
              <div className="space-y-2 p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                <span className="text-[11px] font-semibold text-neutral-300 block">
                  Tombol Aksi Utama
                </span>
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400">Teks Tombol</label>
                  <input
                    type="text"
                    value={String(selectedComp.props.buttonText || '')}
                    onChange={(e) =>
                      updateComponent(selectedComp.id, {
                        props: { ...selectedComp.props, buttonText: e.target.value }
                      })
                    }
                    className="w-full px-2 py-1 bg-neutral-900 border border-neutral-800 rounded text-xs text-neutral-200"
                  />
                </div>
                {selectedComp.props.buttonUrl !== undefined && (
                  <div className="space-y-1">
                    <label className="text-[10px] text-neutral-400">Tautan Tujuan (URL)</label>
                    <input
                      type="text"
                      value={String(selectedComp.props.buttonUrl || '')}
                      onChange={(e) =>
                        updateComponent(selectedComp.id, {
                          props: { ...selectedComp.props, buttonUrl: e.target.value }
                        })
                      }
                      className="w-full px-2 py-1 bg-neutral-900 border border-neutral-800 rounded text-xs text-neutral-200 font-mono"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Navigation Menu Items Editor */}
            {selectedComp.type === 'navigation' && (
              <div className="space-y-2.5 p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-neutral-300">Tautan Navigasi</span>
                  <button
                    onClick={handleAddNavItem}
                    className="px-2 py-0.5 rounded bg-amber-400 text-neutral-950 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Tambah
                  </button>
                </div>

                <div className="space-y-2 pt-1">
                  {((selectedComp.props.items as Array<{ id: string; label: string; url: string }>) || []).map(
                    (it) => (
                      <div key={it.id} className="p-2 rounded bg-neutral-900 border border-neutral-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={it.label}
                            onChange={(e) => handleUpdateNavItem(it.id, 'label', e.target.value)}
                            placeholder="Label Menu"
                            className="w-2/3 px-2 py-0.5 bg-neutral-950 border border-neutral-800 rounded text-xs text-neutral-200"
                          />
                          <button
                            onClick={() => handleRemoveNavItem(it.id)}
                            className="p-1 text-neutral-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={it.url}
                          onChange={(e) => handleUpdateNavItem(it.id, 'url', e.target.value)}
                          placeholder="URL Tautan"
                          className="w-full px-2 py-0.5 bg-neutral-950 border border-neutral-800 rounded font-mono text-[11px] text-neutral-300"
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Gaya & Layout */}
        {inspectorTab === 'styles' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* Colors */}
            <div className="space-y-3 p-3 bg-neutral-950 rounded-lg border border-neutral-800">
              <span className="text-[11px] font-semibold text-neutral-300 block">Warna Elemen</span>

              {/* Background Color */}
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400">Warna Latar Belakang</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedComp.styles.backgroundColor || '#18181b'}
                    onChange={(e) =>
                      updateComponent(selectedComp.id, {
                        styles: { ...selectedComp.styles, backgroundColor: e.target.value }
                      })
                    }
                    className="w-8 h-8 rounded border border-neutral-800 bg-neutral-900 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={selectedComp.styles.backgroundColor || ''}
                    onChange={(e) =>
                      updateComponent(selectedComp.id, {
                        styles: { ...selectedComp.styles, backgroundColor: e.target.value }
                      })
                    }
                    placeholder="#18181b atau transparent"
                    className="flex-1 px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded font-mono text-xs text-neutral-200"
                  />
                </div>
              </div>

              {/* Text Color */}
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400">Warna Teks</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedComp.styles.textColor || '#ffffff'}
                    onChange={(e) =>
                      updateComponent(selectedComp.id, {
                        styles: { ...selectedComp.styles, textColor: e.target.value }
                      })
                    }
                    className="w-8 h-8 rounded border border-neutral-800 bg-neutral-900 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={selectedComp.styles.textColor || ''}
                    onChange={(e) =>
                      updateComponent(selectedComp.id, {
                        styles: { ...selectedComp.styles, textColor: e.target.value }
                      })
                    }
                    placeholder="#ffffff"
                    className="flex-1 px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded font-mono text-xs text-neutral-200"
                  />
                </div>
              </div>
            </div>

            {/* Text Alignment */}
            <div className="space-y-2 p-3 bg-neutral-950 rounded-lg border border-neutral-800">
              <span className="text-[11px] font-semibold text-neutral-300 block">
                Perataan Teks (Alignment)
              </span>
              <div className="grid grid-cols-4 gap-1">
                {(['left', 'center', 'right', 'justify'] as const).map((align) => {
                  const isActive = (selectedComp.styles.textAlign || 'left') === align;
                  return (
                    <button
                      key={align}
                      onClick={() =>
                        updateComponent(selectedComp.id, {
                          styles: { ...selectedComp.styles, textAlign: align }
                        })
                      }
                      className={`py-1.5 rounded flex items-center justify-center transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-amber-400 text-neutral-950 font-bold'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                      }`}
                      title={`Rata ${align}`}
                    >
                      {align === 'left' && <AlignLeft className="w-3.5 h-3.5" />}
                      {align === 'center' && <AlignCenter className="w-3.5 h-3.5" />}
                      {align === 'right' && <AlignRight className="w-3.5 h-3.5" />}
                      {align === 'justify' && <AlignJustify className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Padding Presets */}
            <div className="space-y-2 p-3 bg-neutral-950 rounded-lg border border-neutral-800">
              <span className="text-[11px] font-semibold text-neutral-300 block">
                Ruang Dalam (Padding)
              </span>
              <div className="grid grid-cols-4 gap-1 text-[11px]">
                {[
                  { label: 'Kompak', val: '0.75rem' },
                  { label: 'Normal', val: '1.25rem' },
                  { label: 'Luas', val: '2rem' },
                  { label: 'Ekstra', val: '3rem' }
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() =>
                      updateComponent(selectedComp.id, {
                        styles: { ...selectedComp.styles, padding: item.val }
                      })
                    }
                    className={`py-1 rounded transition-colors cursor-pointer ${
                      selectedComp.styles.padding === item.val
                        ? 'bg-amber-400 text-neutral-950 font-bold'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Border Radius Presets */}
            <div className="space-y-2 p-3 bg-neutral-950 rounded-lg border border-neutral-800">
              <span className="text-[11px] font-semibold text-neutral-300 block">
                Lengkungan Sudut (Radius)
              </span>
              <div className="grid grid-cols-5 gap-1 text-[10px]">
                {[
                  { label: 'Nol', val: '0px' },
                  { label: 'S', val: '0.375rem' },
                  { label: 'M', val: '0.5rem' },
                  { label: 'L', val: '1rem' },
                  { label: 'Full', val: '9999px' }
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() =>
                      updateComponent(selectedComp.id, {
                        styles: { ...selectedComp.styles, borderRadius: item.val }
                      })
                    }
                    className={`py-1 rounded transition-colors cursor-pointer ${
                      selectedComp.styles.borderRadius === item.val
                        ? 'bg-amber-400 text-neutral-950 font-bold'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Shadow Presets */}
            <div className="space-y-2 p-3 bg-neutral-950 rounded-lg border border-neutral-800">
              <span className="text-[11px] font-semibold text-neutral-300 block">
                Bayangan (Box Shadow)
              </span>
              <div className="grid grid-cols-4 gap-1 text-[11px]">
                {[
                  { label: 'Tanpa', val: 'none' },
                  { label: 'Halus', val: '0 1px 3px rgba(0,0,0,0.3)' },
                  { label: 'Sedang', val: '0 4px 6px -1px rgba(0,0,0,0.4)' },
                  { label: 'Kuat', val: '0 10px 15px -3px rgba(0,0,0,0.5)' }
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() =>
                      updateComponent(selectedComp.id, {
                        styles: { ...selectedComp.styles, boxShadow: item.val }
                      })
                    }
                    className={`py-1 rounded transition-colors cursor-pointer ${
                      (selectedComp.styles.boxShadow || 'none') === item.val
                        ? 'bg-amber-400 text-neutral-950 font-bold'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Lanjutan & Platform */}
        {inspectorTab === 'advanced' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* Target Architecture Mapping */}
            <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-200">Arsitektur Target</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {currentProject.targetPlatform}
                </span>
              </div>

              {currentProject.targetPlatform === 'blogger' ? (
                <div className="space-y-1.5 text-[11px] text-neutral-400">
                  <p>Pemetaan XML Blogger:</p>
                  <code className="block p-2 rounded bg-neutral-900 font-mono text-[10px] text-amber-300 break-all">
                    {selectedComp.type === 'header' && "<b:widget id='Header1' type='Header' locked='true'/>"}
                    {selectedComp.type === 'navigation' && "<b:widget id='PageList1' type='PageList'/>"}
                    {selectedComp.type === 'article' && "<b:widget id='Blog1' type='Blog'/>"}
                    {selectedComp.type === 'sidebar' && "<b:widget id='HTML1' type='HTML'/>"}
                    {selectedComp.type !== 'header' &&
                      selectedComp.type !== 'navigation' &&
                      selectedComp.type !== 'article' &&
                      selectedComp.type !== 'sidebar' &&
                      `<b:section id='sec_${selectedComp.id}' maxwidgets='1'/>`}
                  </code>
                </div>
              ) : (
                <div className="space-y-1.5 text-[11px] text-neutral-400">
                  <p>Pemetaan WordPress Block:</p>
                  <code className="block p-2 rounded bg-neutral-900 font-mono text-[10px] text-blue-300 break-all">
                    {`<!-- wp:${selectedComp.type === 'header' ? 'template-part {"slug":"header"}' : 'group'} -->`}
                  </code>
                </div>
              )}
            </div>

            {/* Custom CSS Classes */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-neutral-300 block">
                Kelas CSS Kustom
              </label>
              <input
                type="text"
                value={selectedComp.styles.customClasses || ''}
                onChange={(e) =>
                  updateComponent(selectedComp.id, {
                    styles: { ...selectedComp.styles, customClasses: e.target.value }
                  })
                }
                placeholder="misal: my-custom-class shadow-glow"
                className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded font-mono text-xs text-neutral-200"
              />
            </div>

            {/* Reset to defaults */}
            <div className="pt-2">
              <button
                onClick={() => resetComponentStyles(selectedComp.id)}
                className="w-full py-2 px-3 rounded-lg border border-neutral-800 bg-neutral-950 hover:bg-neutral-800 text-neutral-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
                <span>Reset Gaya ke Default</span>
              </button>
            </div>
          </div>
        )}

        {/* Asset Picker Modal */}
        <AssetPickerModal
          isOpen={isAssetPickerOpen}
          onClose={() => setIsAssetPickerOpen(false)}
          onSelectAsset={(asset: ProjectAsset) => {
            const url = asset.dataUrl || asset.path;
            updateComponent(selectedComp.id, {
              props: {
                ...selectedComp.props,
                imageUrl: url,
                alt: asset.name
              }
            });
          }}
          selectedUrl={String(selectedComp.props.imageUrl || '')}
        />
      </aside>
    );
  }

  // If NO component is selected: Page & Global Theme Inspector
  return (
    <aside className="w-80 border-l border-neutral-800 bg-neutral-900/60 flex flex-col shrink-0 overflow-hidden select-none">
      <div className="p-3.5 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
            Pengaturan Tema & Halaman
          </h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {/* Active Page Info Card */}
        <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-neutral-200">Halaman Aktif</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
              {activePage?.components.length || 0} Komponen
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-neutral-400">Judul Halaman</label>
            <input
              type="text"
              value={activePage?.title || ''}
              onChange={(e) => updatePage(activePage.id, { title: e.target.value })}
              className="w-full px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded text-neutral-200 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-neutral-400">Slug URL</label>
            <input
              type="text"
              value={activePage?.slug || ''}
              onChange={(e) => updatePage(activePage.id, { slug: e.target.value })}
              className="w-full px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded font-mono text-neutral-300 text-xs"
            />
          </div>
        </div>

        {/* Global Theme Settings */}
        <div className="space-y-3 p-3 bg-neutral-950 rounded-xl border border-neutral-800">
          <span className="font-semibold text-neutral-200 block">Warna Tema Global</span>

          {/* Primary Color */}
          <div className="space-y-1">
            <label className="text-[10px] text-neutral-400">Warna Aksen Utama (Primary)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentProject.themeSettings.primaryColor}
                onChange={(e) => updateThemeSettings({ primaryColor: e.target.value })}
                className="w-8 h-8 rounded border border-neutral-800 bg-neutral-900 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={currentProject.themeSettings.primaryColor}
                onChange={(e) => updateThemeSettings({ primaryColor: e.target.value })}
                className="flex-1 px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded font-mono text-xs text-neutral-200"
              />
            </div>
          </div>

          {/* Canvas Background Color */}
          <div className="space-y-1">
            <label className="text-[10px] text-neutral-400">Warna Latar Belakang Kanvas</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentProject.themeSettings.backgroundColor}
                onChange={(e) => updateThemeSettings({ backgroundColor: e.target.value })}
                className="w-8 h-8 rounded border border-neutral-800 bg-neutral-900 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={currentProject.themeSettings.backgroundColor}
                onChange={(e) => updateThemeSettings({ backgroundColor: e.target.value })}
                className="flex-1 px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded font-mono text-xs text-neutral-200"
              />
            </div>
          </div>

          {/* Text Color */}
          <div className="space-y-1">
            <label className="text-[10px] text-neutral-400">Warna Teks Standar</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentProject.themeSettings.textColor}
                onChange={(e) => updateThemeSettings({ textColor: e.target.value })}
                className="w-8 h-8 rounded border border-neutral-800 bg-neutral-900 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={currentProject.themeSettings.textColor}
                onChange={(e) => updateThemeSettings({ textColor: e.target.value })}
                className="flex-1 px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded font-mono text-xs text-neutral-200"
              />
            </div>
          </div>
        </div>

        {/* Global Typography */}
        <div className="space-y-3 p-3 bg-neutral-950 rounded-xl border border-neutral-800">
          <span className="font-semibold text-neutral-200 block">Tipografi Global</span>

          <div className="space-y-1">
            <label className="text-[10px] text-neutral-400">Font Teks (Sans)</label>
            <select
              value={currentProject.themeSettings.fontFamilySans}
              onChange={(e) => updateThemeSettings({ fontFamilySans: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-200 text-xs"
            >
              <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Georgia">Georgia (Serif)</option>
              <option value="JetBrains Mono">JetBrains Mono (Monospace)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-neutral-400">Lebar Kontainer Maksimum</label>
            <select
              value={currentProject.themeSettings.containerMaxWidth}
              onChange={(e) =>
                updateThemeSettings({
                  containerMaxWidth: e.target.value as 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
                })
              }
              className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-200 text-xs"
            >
              <option value="sm">Kecil (640px)</option>
              <option value="md">Sedang (768px)</option>
              <option value="lg">Besar (1024px)</option>
              <option value="xl">Ekstra Besar (1280px)</option>
              <option value="2xl">2X Besar (1536px)</option>
              <option value="full">Lebar Penuh (100%)</option>
            </select>
          </div>
        </div>
      </div>
    </aside>
  );
};
