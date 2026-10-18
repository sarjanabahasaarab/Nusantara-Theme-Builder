/**
 * Nusantara Theme Builder — Visual Editor View (Phase 3)
 * Advanced Visual Editor dengan Drag-and-Drop, 4 Tab Sidebar (Komponen, Struktur,
 * Aset, Halaman), Kanvas Interaktif Responsif + Zoom, dan Properties Inspector.
 * Lisensi: MIT
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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { useProjectStore, ViewportMode } from '../../stores/useProjectStore';
import {
  Layers,
  FolderTree,
  Image as ImageIcon,
  FileText,
  Monitor,
  Tablet,
  Smartphone,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Heading,
  Plus,
  Sliders,
  ChevronDown
} from 'lucide-react';

import { ComponentPaletteTab } from './components/ComponentPaletteTab';
import { ComponentTreeTab } from './components/ComponentTreeTab';
import { AssetsTab } from './components/AssetsTab';
import { PagesTab } from './components/PagesTab';
import { SortableCanvasItem } from './components/CanvasRenderer';
import { PropertiesInspector } from './components/PropertiesInspector';
import { createComponent } from '../../domain/project/project-factory';

export const VisualEditorView: React.FC = () => {
  const {
    currentProject,
    activePageId,
    setActivePageId,
    selectedComponentId,
    selectComponent,
    addComponent,
    removeComponent,
    duplicateComponent,
    reorderComponents,
    moveComponentUp,
    moveComponentDown,
    viewportMode,
    setViewportMode,
    zoomLevel,
    setZoomLevel,
    addToast
  } = useProjectStore();

  const [activeSidebarTab, setActiveSidebarTab] = useState<'components' | 'tree' | 'assets' | 'pages'>('components');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (!currentProject) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-neutral-400 text-xs space-y-3">
        <Layers className="w-10 h-10 text-neutral-600 animate-pulse" />
        <p className="text-sm font-medium text-neutral-300">Belum ada proyek aktif.</p>
        <p className="text-neutral-500 max-w-sm text-center">
          Silakan buka atau buat proyek baru melalui Dashboard untuk mulai merancang tata letak tema secara visual.
        </p>
      </div>
    );
  }

  const activePage =
    currentProject.pages.find((p) => p.id === activePageId) || currentProject.pages[0];
  const components = activePage?.components || [];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderComponents(String(active.id), String(over.id));
    }
  };

  // Quick Starter Preset Adders
  const handleAddStarterPreset = (type: 'hero' | 'blog' | 'article') => {
    if (type === 'hero') {
      const hero = createComponent(
        'hero',
        'Hero Banner Pembuka',
        'layout',
        {
          title: 'Selamat Datang di Tema Nusantara',
          subtitle: 'Desain visual responsif berkecepatan tinggi.',
          buttonText: 'Jelajahi Sekarang',
          buttonUrl: '#'
        },
        { padding: '3rem 2rem', textAlign: 'center', backgroundColor: '#1c1917', textColor: '#f5f5f4' }
      );
      addComponent(hero);
    } else if (type === 'blog') {
      const nav = createComponent('navigation', 'Menu Navigasi', 'navigation', {
        brandText: currentProject.name,
        items: [
          { id: '1', label: 'Beranda', url: '/' },
          { id: '2', label: 'Artikel', url: '/artikel' },
          { id: '3', label: 'Tentang', url: '/tentang' }
        ]
      });
      addComponent(nav);
    } else {
      const art = createComponent('article', 'Artikel Utama', 'article', {
        title: 'Judul Tulisan Baru',
        author: 'Redaksi',
        date: '18 Oktober 2026',
        content: 'Tuliskan paragraf pengantar artikel di sini...',
        showDate: true,
        showAuthor: true
      });
      addComponent(art);
    }
    addToast('info', 'Komponen starter ditambahkan ke halaman.');
  };

  // Viewport Container Width
  let canvasWidthClass = 'w-full max-w-5xl';
  let viewportDimensionLabel = 'Desktop (1200px+)';
  if (viewportMode === 'tablet') {
    canvasWidthClass = 'w-[768px]';
    viewportDimensionLabel = 'Tablet (768px)';
  } else if (viewportMode === 'mobile') {
    canvasWidthClass = 'w-[375px]';
    viewportDimensionLabel = 'Ponsel (375px)';
  }

  // Max Container Width from Theme Settings
  let maxContainerStyle: React.CSSProperties = {};
  if (viewportMode === 'desktop') {
    const mw = currentProject.themeSettings.containerMaxWidth;
    if (mw === 'sm') maxContainerStyle = { maxWidth: '640px' };
    else if (mw === 'md') maxContainerStyle = { maxWidth: '768px' };
    else if (mw === 'lg') maxContainerStyle = { maxWidth: '1024px' };
    else if (mw === 'xl') maxContainerStyle = { maxWidth: '1280px' };
    else if (mw === '2xl') maxContainerStyle = { maxWidth: '1536px' };
    else if (mw === 'full') maxContainerStyle = { maxWidth: '100%' };
  }

  return (
    <div className="flex-1 flex h-[calc(100vh-3rem)] overflow-hidden select-none bg-neutral-950">
      {/* 1. Left Sidebar: Tabs (Komponen, Struktur, Aset, Halaman) */}
      <aside className="w-72 border-r border-neutral-800 bg-neutral-900/50 flex flex-col shrink-0 overflow-hidden">
        {/* Sidebar Tab Header */}
        <div className="grid grid-cols-4 border-b border-neutral-800 bg-neutral-950/90 text-neutral-400">
          <button
            onClick={() => setActiveSidebarTab('components')}
            className={`py-2.5 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors cursor-pointer border-b-2 ${
              activeSidebarTab === 'components'
                ? 'border-amber-400 text-amber-400 font-bold bg-neutral-900/60'
                : 'border-transparent hover:text-neutral-200'
            }`}
            title="Katalog Komponen yang dapat ditambahkan"
          >
            <Layers className="w-4 h-4" />
            <span>Komponen</span>
          </button>

          <button
            onClick={() => setActiveSidebarTab('tree')}
            className={`py-2.5 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors cursor-pointer border-b-2 ${
              activeSidebarTab === 'tree'
                ? 'border-amber-400 text-amber-400 font-bold bg-neutral-900/60'
                : 'border-transparent hover:text-neutral-200'
            }`}
            title="Pohon Struktur Komponen Halaman Aktif"
          >
            <FolderTree className="w-4 h-4" />
            <span>Struktur</span>
          </button>

          <button
            onClick={() => setActiveSidebarTab('assets')}
            className={`py-2.5 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors cursor-pointer border-b-2 ${
              activeSidebarTab === 'assets'
                ? 'border-amber-400 text-amber-400 font-bold bg-neutral-900/60'
                : 'border-transparent hover:text-neutral-200'
            }`}
            title="Aset Media & Gambar Proyek"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Aset</span>
          </button>

          <button
            onClick={() => setActiveSidebarTab('pages')}
            className={`py-2.5 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors cursor-pointer border-b-2 ${
              activeSidebarTab === 'pages'
                ? 'border-amber-400 text-amber-400 font-bold bg-neutral-900/60'
                : 'border-transparent hover:text-neutral-200'
            }`}
            title="Manajemen Halaman Proyek"
          >
            <FileText className="w-4 h-4" />
            <span>Halaman</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-hidden">
          {activeSidebarTab === 'components' && <ComponentPaletteTab />}
          {activeSidebarTab === 'tree' && <ComponentTreeTab />}
          {activeSidebarTab === 'assets' && <AssetsTab />}
          {activeSidebarTab === 'pages' && <PagesTab />}
        </div>
      </aside>

      {/* 2. Center: Visual Canvas Workspace with Zoom & Viewport */}
      <main
        onClick={() => selectComponent(null)}
        className="flex-1 flex flex-col overflow-hidden bg-neutral-950 relative"
      >
        {/* Canvas Top Bar Controls */}
        <div className="h-10 px-4 bg-neutral-900/80 border-b border-neutral-800 flex items-center justify-between text-xs shrink-0 select-none backdrop-blur-xs z-10">
          {/* Active Page Selector */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 font-medium hidden sm:inline">Halaman:</span>
            <div className="relative">
              <select
                value={activePageId}
                onChange={(e) => setActivePageId(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-amber-400 font-semibold focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {currentProject.pages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} {p.isHome ? '(Beranda)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 hidden md:inline">
              ({components.length} komponen)
            </span>
          </div>

          {/* Viewport & Zoom Controls */}
          <div className="flex items-center gap-2">
            {/* Viewport Toggles */}
            <div className="flex items-center bg-neutral-950 rounded-lg border border-neutral-800 p-0.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setViewportMode('desktop');
                }}
                className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                  viewportMode === 'desktop' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                }`}
                title="Tampilan Desktop (100% / max-w)"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setViewportMode('tablet');
                }}
                className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                  viewportMode === 'tablet' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                }`}
                title="Tampilan Tablet (768px)"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setViewportMode('mobile');
                }}
                className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                  viewportMode === 'mobile' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                }`}
                title="Tampilan Ponsel (375px)"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="h-4 w-px bg-neutral-800 hidden sm:block" />

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-neutral-950 rounded-lg border border-neutral-800 px-1 py-0.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomLevel(zoomLevel - 15);
                }}
                disabled={zoomLevel <= 50}
                className="p-1 text-neutral-400 hover:text-white disabled:opacity-30 rounded transition-colors cursor-pointer"
                title="Perkecil Kanvas (-15%)"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              <span className="text-[11px] font-mono px-1 text-neutral-300 min-w-[38px] text-center">
                {zoomLevel}%
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomLevel(zoomLevel + 15);
                }}
                disabled={zoomLevel >= 150}
                className="p-1 text-neutral-400 hover:text-white disabled:opacity-30 rounded transition-colors cursor-pointer"
                title="Perbesar Kanvas (+15%)"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              {zoomLevel !== 100 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomLevel(100);
                  }}
                  className="p-1 text-neutral-500 hover:text-amber-400 rounded transition-colors cursor-pointer ml-0.5"
                  title="Kembalikan Skala ke 100%"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Dimension Tag */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-neutral-500 font-mono">
            <span>{viewportDimensionLabel}</span>
          </div>
        </div>

        {/* Scrollable Canvas Viewport */}
        <div className="flex-1 overflow-auto p-6 sm:p-8 flex flex-col items-center bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:16px_16px]">
          <div
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out'
            }}
            className={`${canvasWidthClass} transition-all duration-200 flex flex-col shrink-0`}
          >
            {/* Viewport Frame Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-t-xl text-xs select-none">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="text-[11px] text-neutral-400 font-mono ml-2">
                  /{activePage.slug}
                </span>
              </div>

              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                Mode: {currentProject.targetPlatform}
              </span>
            </div>

            {/* Canvas Sortable Area */}
            <div
              style={{
                backgroundColor: currentProject.themeSettings.backgroundColor,
                color: currentProject.themeSettings.textColor,
                fontFamily: `${currentProject.themeSettings.fontFamilySans}, sans-serif`,
                ...maxContainerStyle
              }}
              className="min-h-[600px] p-4 sm:p-6 rounded-b-xl border-x border-b border-neutral-800 shadow-2xl space-y-4 transition-colors"
            >
              {components.length === 0 ? (
                /* Empty Canvas State */
                <div className="min-h-[450px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-neutral-800 rounded-xl space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center text-amber-400">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-neutral-200">Kanvas Halaman Ini Masih Kosong</h3>
                    <p className="text-xs text-neutral-400 max-w-sm">
                      Mulai susun tata letak halaman Anda dengan memilih komponen dari palet di sebelah kiri atau pilih starter di bawah:
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <button
                      onClick={() => handleAddStarterPreset('hero')}
                      className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>+ Tambah Hero Banner</span>
                    </button>
                    <button
                      onClick={() => handleAddStarterPreset('blog')}
                      className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Heading className="w-3.5 h-3.5 text-amber-400" />
                      <span>+ Tambah Menu Navigasi</span>
                    </button>
                    <button
                      onClick={() => handleAddStarterPreset('article')}
                      className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>+ Tambah Artikel</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Sortable Canvas Context */
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={components.map((c) => c.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {components.map((comp, idx) => (
                      <SortableCanvasItem
                        key={comp.id}
                        component={comp}
                        index={idx}
                        totalCount={components.length}
                        isSelected={comp.id === selectedComponentId}
                        onSelect={() => selectComponent(comp.id)}
                        onDelete={() => removeComponent(comp.id)}
                        onDuplicate={() => duplicateComponent(comp.id)}
                        onMoveUp={() => moveComponentUp(comp.id)}
                        onMoveDown={() => moveComponentDown(comp.id)}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 3. Right Sidebar: Properties Inspector (Content, Styles, Platform, Theme) */}
      <PropertiesInspector />
    </div>
  );
};
