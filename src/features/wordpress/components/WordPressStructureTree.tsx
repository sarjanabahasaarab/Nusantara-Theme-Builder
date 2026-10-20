/**
 * Nusantara Theme Builder — WordPress Structure Tree
 * Pohon struktur blok Gutenberg pada template atau template part aktif
 * Lisensi: MIT
 */

import React from 'react';
import { ThemeComponent } from '../../../types/project';
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  Copy,
  Layers,
  Code2,
  Box,
  Eye
} from 'lucide-react';

interface WordPressStructureTreeProps {
  components: ThemeComponent[];
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDuplicate: (index: number) => void;
  onDelete: (index: number) => void;
  activeTemplateTitle: string;
}

export const WordPressStructureTree: React.FC<WordPressStructureTreeProps> = ({
  components,
  selectedComponentId,
  onSelectComponent,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  activeTemplateTitle
}) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-neutral-900/40">
      {/* Header Info */}
      <div className="p-3 border-b border-neutral-800 bg-neutral-950/60 flex items-center justify-between text-xs text-neutral-400">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>Struktur:</span>
          <span className="font-semibold text-neutral-200 truncate max-w-[120px]">
            {activeTemplateTitle}
          </span>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
          {components.length} Blok
        </span>
      </div>

      {/* Component Tree List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {components.map((comp, idx) => {
          const isSelected = comp.id === selectedComponentId;
          const isFirst = idx === 0;
          const isLast = idx === components.length - 1;

          return (
            <div
              key={comp.id}
              onClick={() => onSelectComponent(comp.id)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                isSelected
                  ? 'bg-blue-950/40 border-blue-500/60 text-white shadow-sm ring-1 ring-blue-500/30'
                  : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700 text-neutral-300'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-xs font-mono font-bold ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {idx + 1}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold truncate">
                      {comp.name || comp.type}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 truncate block">
                    wp:{comp.type}
                  </span>
                </div>
              </div>

              {/* Action Controls */}
              <div
                className="flex items-center gap-0.5 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onMoveUp(idx)}
                  disabled={isFirst}
                  className={`p-1 rounded hover:bg-neutral-800 transition-colors ${
                    isFirst ? 'text-neutral-700 cursor-not-allowed' : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Pindahkan Ke Atas"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onMoveDown(idx)}
                  disabled={isLast}
                  className={`p-1 rounded hover:bg-neutral-800 transition-colors ${
                    isLast ? 'text-neutral-700 cursor-not-allowed' : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Pindahkan Ke Bawah"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDuplicate(idx)}
                  className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  title="Duplikat Blok"
                >
                  <Copy className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onDelete(idx)}
                  className="p-1 rounded text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors"
                  title="Hapus Blok"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}

        {components.length === 0 && (
          <div className="text-center py-12 px-4 space-y-2">
            <Box className="w-8 h-8 text-neutral-600 mx-auto" />
            <p className="text-xs text-neutral-400">
              Template ini belum memiliki blok Gutenberg.
            </p>
            <p className="text-[11px] text-neutral-500">
              Pilih tab "Komponen" untuk menambahkan elemen pertama.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
