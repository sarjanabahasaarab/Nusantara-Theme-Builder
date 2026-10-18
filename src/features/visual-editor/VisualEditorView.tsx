/**
 * Nusantara Theme Builder — Visual Editor View (Phase 1)
 * Fondasi editor visual drag-and-drop dengan @dnd-kit/sortable, palet komponen,
 * kanvas visual interaktif, dan Properties Inspector terpadu.
 */

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useProjectStore } from '../../stores/useProjectStore';
import { ThemeComponent, ComponentCategory } from '../../types/project';
import { createComponent } from '../../domain/project/project-factory';
import {
  Plus,
  Trash2,
  GripVertical,
  Sliders,
  Layers,
  Heading,
  Menu,
  FileText,
  PanelLeft,
  Columns,
  Image,
  Square,
  Type,
  Maximize2,
  Copy,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';

interface ComponentDefinition {
  type: string;
  label: string;
  category: ComponentCategory;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  defaultProps: Record<string, unknown>;
}

const AVAILABLE_COMPONENTS: ComponentDefinition[] = [
  {
    type: 'header',
    label: 'Header Judul',
    category: 'header',
    icon: Heading,
    description: 'Judul utama blog atau identitas tema dengan slogan.',
    defaultProps: {
      title: 'Judul Blog Baru',
      subtitle: 'Slogan atau deskripsi pemikat tema.'
    }
  },
  {
    type: 'navigation',
    label: 'Menu Navigasi',
    category: 'navigation',
    icon: Menu,
    description: 'Daftar tautan laman dan kategori.',
    defaultProps: {
      items: [
        { id: '1', label: 'Beranda', url: '/' },
        { id: '2', label: 'Kategori', url: '/kategori' },
        { id: '3', label: 'Tentang', url: '/tentang' }
      ]
    }
  },
  {
    type: 'article',
    label: 'Artikel / Posting',
    category: 'article',
    icon: FileText,
    description: 'Blok perenderan artikel lengkap dengan tanggal dan penulis.',
    defaultProps: {
      title: 'Tajuk Artikel Baru',
      content: 'Tuliskan paragraf pengantar atau kutipan artikel di sini...',
      showDate: true,
      showAuthor: true
    }
  },
  {
    type: 'content',
    label: 'Blok Teks / Konten',
    category: 'content',
    icon: Type,
    description: 'Paragraf fleksibel dengan tajuk sub-judul.',
    defaultProps: {
      title: 'Blok Informasi',
      content: 'Informasi pendukung mengenai isi website atau ringkasan topik terpilih.'
    }
  },
  {
    type: 'sidebar',
    label: 'Sidebar Widget',
    category: 'sidebar',
    icon: PanelLeft,
    description: 'Kolom widget pendukung, profil, atau daftar posting populer.',
    defaultProps: {
      title: 'Widget Samping',
      content: 'Isi widget, daftar tautan penting, atau cuplikan profil singkat.'
    }
  },
  {
    type: 'basic',
    label: 'Tombol Aksi (CTA)',
    category: 'basic',
    icon: Square,
    description: 'Tombol interaktif dengan tautan tujuan.',
    defaultProps: {
      title: 'Siap Mengambil Langkah Selanjutnya?',
      buttonText: 'Jelajahi Sekarang',
      buttonUrl: '#'
    }
  },
  {
    type: 'footer',
    label: 'Footer Situs',
    category: 'footer',
    icon: Columns,
    description: 'Catatan hak cipta dan navigasi kaki.',
    defaultProps: {
      title: '© 2026 Nusantara Theme Builder. Semua Hak Dilindungi.',
      subtitle: 'Dibuat dengan semangat keterbukaan.'
    }
  }
];

// Sortable Component Wrapper for Canvas
const SortableCanvasItem: React.FC<{
  component: ThemeComponent;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}> = ({ component, isSelected, onSelect, onDelete, onDuplicate }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: component.id
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`relative group rounded-lg border transition-all ${
        isSelected
          ? 'border-amber-400 ring-2 ring-amber-400/30 bg-neutral-900/90 shadow-lg'
          : 'border-neutral-800 hover:border-neutral-700 bg-neutral-900/50'
      }`}
    >
      {/* Component Toolbar / Drag Handle */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-950/80 rounded-t-lg border-b border-neutral-800 text-xs">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-neutral-500 hover:text-amber-400 p-0.5 rounded"
            title="Seret untuk mengubah urutan"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <span className="font-semibold text-neutral-200 text-[11px]">{component.label}</span>
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 uppercase">
            {component.type}
          </span>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
            title="Duplikat Komponen"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 text-neutral-400 hover:text-rose-400 rounded hover:bg-rose-500/10 transition-colors"
            title="Hapus Komponen"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Render Component Body */}
      <div
        className="p-4"
        style={{
          backgroundColor: component.styles.backgroundColor,
          color: component.styles.textColor,
          textAlign: component.styles.textAlign || 'left',
          padding: component.styles.padding || '1rem'
        }}
      >
        {component.type === 'header' && (
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight">{component.props.title || 'Header Title'}</h2>
            {component.props.subtitle && (
              <p className="text-xs opacity-75">{component.props.subtitle}</p>
            )}
          </div>
        )}

        {component.type === 'navigation' && (
          <nav className="flex flex-wrap gap-3 py-1 text-xs">
            {((component.props.items as Array<{ id: string; label: string }>) || []).map((it) => (
              <span key={it.id} className="opacity-80 hover:opacity-100 underline underline-offset-4">
                {it.label}
              </span>
            ))}
          </nav>
        )}

        {component.type === 'article' && (
          <article className="space-y-2">
            <h3 className="text-base font-bold">{component.props.title}</h3>
            <p className="text-xs leading-relaxed opacity-85 whitespace-pre-line">
              {component.props.content}
            </p>
          </article>
        )}

        {component.type === 'content' && (
          <div className="space-y-1.5">
            {component.props.title && <h4 className="text-sm font-semibold">{component.props.title}</h4>}
            <p className="text-xs leading-relaxed opacity-80 whitespace-pre-line">
              {component.props.content}
            </p>
          </div>
        )}

        {component.type === 'sidebar' && (
          <div className="p-3 bg-neutral-950/60 rounded border border-neutral-800 text-xs space-y-1.5">
            <span className="font-semibold text-amber-400 block">{component.props.title}</span>
            <p className="opacity-80 text-[11px] whitespace-pre-line">{component.props.content}</p>
          </div>
        )}

        {component.type === 'basic' && (
          <div className="space-y-2 py-1">
            {component.props.title && <p className="text-xs font-semibold">{component.props.title}</p>}
            <button className="px-4 py-1.5 rounded text-xs font-semibold bg-amber-400 text-neutral-950 shadow">
              {component.props.buttonText || 'Tombol Aksi'}
            </button>
          </div>
        )}

        {component.type === 'footer' && (
          <footer className="text-center text-xs opacity-70 py-2 border-t border-neutral-800 space-y-0.5">
            <p>{component.props.title}</p>
            {component.props.subtitle && <p className="text-[10px]">{component.props.subtitle}</p>}
          </footer>
        )}
      </div>
    </div>
  );
};

export const VisualEditorView: React.FC = () => {
  const {
    currentProject,
    selectedComponentId,
    selectComponent,
    addComponent,
    updateComponent,
    removeComponent,
    reorderComponents,
    updateThemeSettings,
    viewportMode,
    addToast
  } = useProjectStore();

  const [activeCategory, setActiveCategory] = useState<ComponentCategory | 'all'>('all');
  const [componentToDelete, setComponentToDelete] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (!currentProject) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-neutral-400 text-xs">
        Buka atau buat proyek terlebih dahulu untuk mengakses Visual Editor.
      </div>
    );
  }

  const activePage = currentProject.pages[0];
  const components = activePage?.components || [];
  const selectedComp = components.find((c) => c.id === selectedComponentId);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderComponents(String(active.id), String(over.id));
    }
  };

  const handleAddPresetComponent = (def: ComponentDefinition) => {
    const newComp = createComponent(def.type, def.label, def.category, { ...def.defaultProps });
    addComponent(newComp);
    addToast('info', `Komponen "${def.label}" ditambahkan ke halaman.`);
  };

  const handleDuplicateComponent = (comp: ThemeComponent) => {
    const clone = createComponent(
      comp.type,
      `${comp.label} (Salinan)`,
      comp.category,
      JSON.parse(JSON.stringify(comp.props)),
      JSON.parse(JSON.stringify(comp.styles))
    );
    addComponent(clone);
    addToast('info', `Komponen "${comp.label}" berhasil diduplikasi.`);
  };

  // Viewport width styling
  let canvasWidthClass = 'w-full max-w-4xl';
  if (viewportMode === 'tablet') canvasWidthClass = 'w-[768px]';
  if (viewportMode === 'mobile') canvasWidthClass = 'w-[375px]';

  return (
    <div className="flex-1 flex h-[calc(100vh-3rem)] overflow-hidden select-none bg-neutral-950">
      {/* Left Panel: Component Palette */}
      <aside className="w-64 border-r border-neutral-800 bg-neutral-900/40 flex flex-col shrink-0">
        <div className="p-3.5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
              Palet Komponen
            </h3>
          </div>
          <span className="text-[10px] font-mono text-neutral-500">{AVAILABLE_COMPONENTS.length} Item</span>
        </div>

        {/* Component list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {AVAILABLE_COMPONENTS.map((def) => {
            const Icon = def.icon;
            return (
              <div
                key={def.type}
                className="group p-2.5 rounded-lg border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-850 hover:border-neutral-700 transition-all flex items-start gap-2.5"
              >
                <div className="p-2 rounded bg-neutral-800 group-hover:bg-amber-500/10 group-hover:text-amber-400 text-neutral-400 transition-colors shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-200 truncate">{def.label}</span>
                    <button
                      onClick={() => handleAddPresetComponent(def)}
                      className="p-1 rounded text-neutral-400 hover:text-neutral-950 hover:bg-amber-400 transition-colors"
                      title="Tambah ke kanvas"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[10px] text-neutral-400 line-clamp-2 mt-0.5 leading-snug">
                    {def.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info notice */}
        <div className="p-2.5 border-t border-neutral-800 bg-neutral-950/60 text-[10px] text-neutral-500 leading-tight">
          💡 Klik <Plus className="w-3 h-3 inline text-amber-400" /> untuk menambahkan komponen ke halaman aktif.
        </div>
      </aside>

      {/* Center: Visual Canvas Workspace */}
      <main
        onClick={() => selectComponent(null)}
        className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center bg-neutral-950 relative"
      >
        <div className={`${canvasWidthClass} transition-all duration-200 flex flex-col space-y-4`}>
          {/* Canvas Header bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-neutral-900/80 rounded-lg border border-neutral-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 font-medium">Halaman Aktif:</span>
              <span className="font-semibold text-white">{activePage?.title || 'Beranda'}</span>
              <span className="text-[10px] font-mono text-neutral-500">({components.length} Komponen)</span>
            </div>

            <div className="text-[11px] text-neutral-400">
              Target: <strong className="uppercase text-amber-400 font-mono">{currentProject.targetPlatform}</strong>
            </div>
          </div>

          {/* Canvas Sortable List */}
          <div
            className="min-h-[500px] p-4 rounded-xl border border-neutral-800/80 shadow-2xl transition-all space-y-3"
            style={{
              backgroundColor: currentProject.themeSettings.backgroundColor,
              color: currentProject.themeSettings.textColor,
              fontFamily: `${currentProject.themeSettings.fontFamilySans}, sans-serif`
            }}
          >
            {components.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-neutral-500 space-y-2 border-2 border-dashed border-neutral-800 rounded-lg">
                <Layers className="w-8 h-8 text-neutral-600" />
                <p className="text-xs">Kanvas masih kosong.</p>
                <p className="text-[11px] text-neutral-600">
                  Pilih salah satu komponen dari palet di sebelah kiri untuk menambahkannya.
                </p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={components.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {components.map((comp) => (
                    <SortableCanvasItem
                      key={comp.id}
                      component={comp}
                      isSelected={comp.id === selectedComponentId}
                      onSelect={() => selectComponent(comp.id)}
                      onDelete={() => removeComponent(comp.id)}
                      onDuplicate={() => handleDuplicateComponent(comp)}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      </main>

      {/* Right Panel: Properties Inspector */}
      <aside className="w-72 border-l border-neutral-800 bg-neutral-900/40 flex flex-col shrink-0">
        <div className="p-3.5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
              Properties Inspector
            </h3>
          </div>
          {selectedComp && (
            <button
              onClick={() => selectComponent(null)}
              className="text-[10px] text-neutral-400 hover:text-white"
            >
              Batal Pilih
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
          {selectedComp ? (
            <div className="space-y-4">
              {/* Identity & Metadata */}
              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Tipe:</span>
                  <span className="text-amber-400 uppercase font-bold">{selectedComp.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">ID:</span>
                  <span className="text-neutral-300">{selectedComp.id}</span>
                </div>
              </div>

              {/* Label */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-neutral-300 uppercase tracking-wider block">
                  Label Komponen
                </label>
                <input
                  type="text"
                  value={selectedComp.label}
                  onChange={(e) => updateComponent(selectedComp.id, { label: e.target.value })}
                  className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded text-neutral-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Title prop if supported */}
              {selectedComp.props.title !== undefined && (
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-neutral-300 uppercase tracking-wider block">
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
                    className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded text-neutral-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              {/* Subtitle prop if supported */}
              {selectedComp.props.subtitle !== undefined && (
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-neutral-300 uppercase tracking-wider block">
                    Subjudul
                  </label>
                  <input
                    type="text"
                    value={String(selectedComp.props.subtitle || '')}
                    onChange={(e) =>
                      updateComponent(selectedComp.id, {
                        props: { ...selectedComp.props, subtitle: e.target.value }
                      })
                    }
                    className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded text-neutral-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              {/* Content prop if supported */}
              {selectedComp.props.content !== undefined && (
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-neutral-300 uppercase tracking-wider block">
                    Isi Konten
                  </label>
                  <textarea
                    rows={4}
                    value={String(selectedComp.props.content || '')}
                    onChange={(e) =>
                      updateComponent(selectedComp.id, {
                        props: { ...selectedComp.props, content: e.target.value }
                      })
                    }
                    className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded text-neutral-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              {/* Button Text prop if supported */}
              {selectedComp.props.buttonText !== undefined && (
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-neutral-300 uppercase tracking-wider block">
                    Teks Tombol
                  </label>
                  <input
                    type="text"
                    value={String(selectedComp.props.buttonText || '')}
                    onChange={(e) =>
                      updateComponent(selectedComp.id, {
                        props: { ...selectedComp.props, buttonText: e.target.value }
                      })
                    }
                    className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded text-neutral-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              {/* Styling Options */}
              <div className="pt-2 border-t border-neutral-800 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Penyesuaian Gaya (Styling)
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-neutral-400">Warna Latar</label>
                    <input
                      type="color"
                      value={selectedComp.styles.backgroundColor || '#171717'}
                      onChange={(e) =>
                        updateComponent(selectedComp.id, {
                          styles: { ...selectedComp.styles, backgroundColor: e.target.value }
                        })
                      }
                      className="w-full h-8 bg-neutral-950 border border-neutral-800 rounded cursor-pointer p-0.5"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-neutral-400">Warna Teks</label>
                    <input
                      type="color"
                      value={selectedComp.styles.textColor || '#f5f5f5'}
                      onChange={(e) =>
                        updateComponent(selectedComp.id, {
                          styles: { ...selectedComp.styles, textColor: e.target.value }
                        })
                      }
                      className="w-full h-8 bg-neutral-950 border border-neutral-800 rounded cursor-pointer p-0.5"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400">Perataan Teks (Alignment)</label>
                  <select
                    value={selectedComp.styles.textAlign || 'left'}
                    onChange={(e) =>
                      updateComponent(selectedComp.id, {
                        styles: {
                          ...selectedComp.styles,
                          textAlign: e.target.value as 'left' | 'center' | 'right' | 'justify'
                        }
                      })
                    }
                    className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded text-neutral-200"
                  >
                    <option value="left">Rata Kiri</option>
                    <option value="center">Rata Tengah</option>
                    <option value="right">Rata Kanan</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            /* Global Theme Settings when no component is selected */
            <div className="space-y-4">
              <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 text-neutral-400 text-xs">
                <span className="font-semibold text-neutral-200 block mb-1">Pengaturan Global Tema</span>
                Pilih salah satu komponen di kanvas untuk memeriksa properti spesifik, atau ubah pengaturan tema global di bawah ini.
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400">Warna Utama Tema (Primary)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentProject.themeSettings.primaryColor}
                      onChange={(e) => updateThemeSettings({ primaryColor: e.target.value })}
                      className="w-8 h-8 rounded border border-neutral-800 bg-neutral-950 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={currentProject.themeSettings.primaryColor}
                      onChange={(e) => updateThemeSettings({ primaryColor: e.target.value })}
                      className="flex-1 px-3 py-1 bg-neutral-950 border border-neutral-800 rounded font-mono text-xs text-neutral-200"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400">Warna Latar Belakang (Canvas)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentProject.themeSettings.backgroundColor}
                      onChange={(e) => updateThemeSettings({ backgroundColor: e.target.value })}
                      className="w-8 h-8 rounded border border-neutral-800 bg-neutral-950 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={currentProject.themeSettings.backgroundColor}
                      onChange={(e) => updateThemeSettings({ backgroundColor: e.target.value })}
                      className="flex-1 px-3 py-1 bg-neutral-950 border border-neutral-800 rounded font-mono text-xs text-neutral-200"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400">Font Tulisan Utama</label>
                  <select
                    value={currentProject.themeSettings.fontFamilySans}
                    onChange={(e) => updateThemeSettings({ fontFamilySans: e.target.value })}
                    className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded text-neutral-200 text-xs"
                  >
                    <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Georgia">Georgia (Serif)</option>
                    <option value="Courier New">Courier New (Mono)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};
