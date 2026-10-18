/**
 * Nusantara Theme Builder — Component Tree Tab
 * Tampilan hierarki pohon komponen untuk halaman yang sedang aktif
 */

import React from 'react';
import { useProjectStore } from '../../../stores/useProjectStore';
import {
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  FolderTree,
  Sliders,
  Heading,
  Menu,
  FileText,
  PanelLeft,
  Columns,
  Image as ImageIcon,
  Square,
  Type,
  Sparkles,
  LayoutGrid,
  Quote,
  Mail
} from 'lucide-react';
import { ThemeComponent } from '../../../types/project';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  header: Heading,
  hero: Sparkles,
  navigation: Menu,
  article: FileText,
  'post-grid': LayoutGrid,
  content: Type,
  'media-image': ImageIcon,
  quote: Quote,
  features: Columns,
  cta: Square,
  newsletter: Mail,
  sidebar: PanelLeft,
  footer: Columns
};

export const ComponentTreeTab: React.FC = () => {
  const {
    currentProject,
    activePageId,
    selectedComponentId,
    selectComponent,
    moveComponentUp,
    moveComponentDown,
    duplicateComponent,
    removeComponent
  } = useProjectStore();

  if (!currentProject) return null;

  const activePage = currentProject.pages.find((p) => p.id === activePageId) || currentProject.pages[0];
  const components = activePage?.components || [];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header Info */}
      <div className="p-3 border-b border-neutral-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-neutral-300">
          <FolderTree className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold truncate max-w-[140px]">{activePage?.title || 'Halaman'}</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-950 border border-neutral-800 text-neutral-400">
          {components.length} node
        </span>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {components.length === 0 ? (
          <div className="py-12 text-center text-neutral-500 space-y-2">
            <FolderTree className="w-8 h-8 mx-auto text-neutral-600" />
            <p className="text-xs">Struktur komponen masih kosong.</p>
            <p className="text-[11px] text-neutral-600">
              Pilih tab "Komponen" di atas untuk menambahkan elemen ke halaman ini.
            </p>
          </div>
        ) : (
          components.map((comp: ThemeComponent, idx: number) => {
            const isSelected = comp.id === selectedComponentId;
            const IconComponent = ICON_MAP[comp.type] || Type;
            const isFirst = idx === 0;
            const isLast = idx === components.length - 1;

            return (
              <div
                key={comp.id}
                onClick={() => selectComponent(comp.id)}
                className={`group flex items-center justify-between px-2.5 py-2 rounded-lg border text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-400/80 text-amber-300 shadow-sm'
                    : 'bg-neutral-900/60 border-neutral-800/80 text-neutral-300 hover:bg-neutral-850 hover:border-neutral-700'
                }`}
              >
                {/* Node info */}
                <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                  <span className="text-[10px] font-mono text-neutral-500 shrink-0">#{idx + 1}</span>
                  <div
                    className={`p-1 rounded shrink-0 ${
                      isSelected ? 'bg-amber-400 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate text-xs">{comp.label}</p>
                    <span className="text-[9px] font-mono text-neutral-500 uppercase">{comp.type}</span>
                  </div>
                </div>

                {/* Node Quick Actions */}
                <div className="flex items-center gap-0.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveComponentUp(comp.id);
                    }}
                    disabled={isFirst}
                    className="p-1 text-neutral-400 hover:text-white disabled:opacity-20 disabled:hover:text-neutral-400 rounded hover:bg-neutral-800 transition-colors cursor-pointer disabled:cursor-not-allowed"
                    title="Pindahkan ke Atas"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveComponentDown(comp.id);
                    }}
                    disabled={isLast}
                    className="p-1 text-neutral-400 hover:text-white disabled:opacity-20 disabled:hover:text-neutral-400 rounded hover:bg-neutral-800 transition-colors cursor-pointer disabled:cursor-not-allowed"
                    title="Pindahkan ke Bawah"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateComponent(comp.id);
                    }}
                    className="p-1 text-neutral-400 hover:text-amber-400 rounded hover:bg-neutral-800 transition-colors cursor-pointer"
                    title="Duplikat Komponen"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeComponent(comp.id);
                    }}
                    className="p-1 text-neutral-400 hover:text-rose-400 rounded hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Hapus Komponen"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Tree Footer Tips */}
      <div className="p-2.5 border-t border-neutral-800 bg-neutral-950/60 text-[10px] text-neutral-500">
        💡 Klik node untuk memilih komponen & mengatur propertinya di Inspector.
      </div>
    </div>
  );
};
