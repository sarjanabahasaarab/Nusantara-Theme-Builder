/**
 * Nusantara Theme Builder — Blogger Structure Tree
 * Pohon hierarki komponen tema Blogger dengan indikator dukungan generator
 * Lisensi: MIT
 */

import React from 'react';
import { useProjectStore } from '../../../stores/useProjectStore';
import { BloggerComponentMapper } from '../generator/BloggerComponentMapper';
import {
  FolderTree,
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye
} from 'lucide-react';

export const BloggerStructureTree: React.FC = () => {
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

  const activePage =
    currentProject.pages.find((p) => p.id === activePageId) || currentProject.pages[0];
  const components = activePage ? activePage.components : [];

  const mappedList = BloggerComponentMapper.mapAllComponents(components);
  const summary = BloggerComponentMapper.getSupportSummary(mappedList);

  return (
    <div className="flex flex-col h-full overflow-hidden text-xs text-neutral-300">
      {/* Summary Header */}
      <div className="p-3 border-b border-neutral-800 bg-neutral-950/40 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-neutral-200 flex items-center gap-1.5">
            <FolderTree className="w-3.5 h-3.5 text-orange-400" />
            <span>Hierarki Komponen Tema</span>
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
            {components.length} Elemen
          </span>
        </div>

        {/* Support Stats Badges */}
        <div className="grid grid-cols-3 gap-1.5 text-[10px] text-center">
          <div className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <span className="font-bold block">{summary.supported}</span>
            <span>Didukung</span>
          </div>
          <div className="p-1.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <span className="font-bold block">{summary.partial}</span>
            <span>Sebagian</span>
          </div>
          <div className="p-1.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <span className="font-bold block">{summary.unsupported}</span>
            <span>Belum</span>
          </div>
        </div>
      </div>

      {/* Component Tree Nodes */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {components.length === 0 ? (
          <div className="py-8 text-center text-neutral-500 space-y-2">
            <FolderTree className="w-8 h-8 mx-auto opacity-40 text-neutral-600" />
            <p>Belum ada komponen di halaman ini.</p>
            <p className="text-[11px] text-neutral-600">
              Pilih komponen dari tab sebelah untuk mulai menyusun tema.
            </p>
          </div>
        ) : (
          components.map((comp, index) => {
            const mapped = mappedList[index];
            const isSelected = comp.id === selectedComponentId;
            const isFirst = index === 0;
            const isLast = index === components.length - 1;

            return (
              <div
                key={comp.id}
                onClick={() => selectComponent(comp.id)}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col gap-1.5 ${
                  isSelected
                    ? 'bg-neutral-800/90 border-orange-500 text-white shadow-sm ring-1 ring-orange-500/50'
                    : 'bg-neutral-900/50 hover:bg-neutral-900 border-neutral-800 text-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-5 h-5 rounded bg-neutral-950 flex items-center justify-center text-[10px] font-mono text-neutral-400 shrink-0">
                      {index + 1}
                    </span>
                    <span className="font-medium truncate text-xs">{comp.label}</span>
                  </div>

                  {/* Status Indicator */}
                  <div className="shrink-0 flex items-center gap-1">
                    {mapped?.supportStatus === 'supported' && (
                      <span title="Didukung penuh oleh generator Blogger">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </span>
                    )}
                    {mapped?.supportStatus === 'partial' && (
                      <span title="Didukung sebagian (dikonversi ke widget HTML)">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      </span>
                    )}
                    {mapped?.supportStatus === 'unsupported' && (
                      <span title="Belum didukung oleh generator Blogger">
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                  <span>
                    {mapped?.targetWidgetType ? `<${mapped.targetWidgetType}>` : 'unmapped'}
                  </span>
                  <span>Section: {mapped?.targetSection || 'main'}</span>
                </div>

                {/* Node Actions when Selected */}
                {isSelected && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-end gap-1 pt-1.5 border-t border-neutral-700/60 mt-1"
                  >
                    <button
                      onClick={() => moveComponentUp(comp.id)}
                      disabled={isFirst}
                      className="p-1 rounded bg-neutral-950 hover:bg-neutral-700 text-neutral-300 disabled:opacity-30 cursor-pointer"
                      title="Pindah ke Atas"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => moveComponentDown(comp.id)}
                      disabled={isLast}
                      className="p-1 rounded bg-neutral-950 hover:bg-neutral-700 text-neutral-300 disabled:opacity-30 cursor-pointer"
                      title="Pindah ke Bawah"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => duplicateComponent(comp.id)}
                      className="p-1 rounded bg-neutral-950 hover:bg-neutral-700 text-neutral-300 cursor-pointer"
                      title="Duplikasi Komponen"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeComponent(comp.id)}
                      className="p-1 rounded bg-neutral-950 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 cursor-pointer"
                      title="Hapus Komponen"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
