/**
 * Nusantara Theme Builder — WordPress Toolbar
 * Toolbar atas khusus WordPress Builder dengan kontrol FSE, Viewport, Validasi, dan Ekspor ZIP
 * Lisensi: MIT
 */

import React from 'react';
import { useProjectStore } from '../../../stores/useProjectStore';
import {
  Blocks,
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Download,
  Upload,
  Sparkles,
  Save,
  ArrowLeft,
  FileCode,
  Layers
} from 'lucide-react';
import { WordPressThemeType } from '../types/wordpress';

interface WordPressToolbarProps {
  themeType: WordPressThemeType;
  onChangeThemeType: (type: WordPressThemeType) => void;
  viewport: 'desktop' | 'tablet' | 'mobile';
  onChangeViewport: (vp: 'desktop' | 'tablet' | 'mobile') => void;
  onOpenValidation: () => void;
  onOpenImport: () => void;
  onOpenExport: () => void;
  onOpenStarters: () => void;
  validationScore?: number;
  totalErrors?: number;
  totalWarnings?: number;
}

export const WordPressToolbar: React.FC<WordPressToolbarProps> = ({
  themeType,
  onChangeThemeType,
  viewport,
  onChangeViewport,
  onOpenValidation,
  onOpenImport,
  onOpenExport,
  onOpenStarters,
  validationScore = 100,
  totalErrors = 0,
  totalWarnings = 0
}) => {
  const {
    currentProject,
    setActiveView,
    saveCurrentProject,
    saveStatus,
    undo,
    redo,
    undoStack,
    redoStack
  } = useProjectStore();

  const canUndo = (undoStack?.length || 0) > 0;
  const canRedo = (redoStack?.length || 0) > 0;

  return (
    <header className="h-12 border-b border-neutral-800 bg-neutral-900/90 px-3 flex items-center justify-between gap-2 shrink-0 select-none">
      {/* Kiri: Navigasi Dashboard & Info Tema */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveView('dashboard')}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
          title="Kembali ke Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </button>

        <div className="h-4 w-px bg-neutral-800 mx-1 hidden sm:block" />

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Blocks className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-neutral-200 truncate max-w-[140px] md:max-w-[200px]">
                {currentProject?.name || 'Tema WordPress'}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 font-mono border border-blue-500/20">
                {themeType === 'block' ? 'Block Theme (FSE)' : 'Classic Theme'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tengah: Mode Switcher, Undo/Redo & Viewport Switcher */}
      <div className="flex items-center gap-1.5 md:gap-3">
        {/* Theme Type Switcher */}
        <div className="hidden lg:flex items-center bg-neutral-950 p-0.5 rounded-lg border border-neutral-800 text-[11px]">
          <button
            onClick={() => onChangeThemeType('block')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              themeType === 'block'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Modern Full Site Editing (theme.json & Gutenberg HTML)"
          >
            Block Theme (FSE)
          </button>
          <button
            onClick={() => onChangeThemeType('classic')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              themeType === 'classic'
                ? 'bg-neutral-800 text-neutral-200'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Classic PHP Theme Foundation"
          >
            Classic PHP
          </button>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center bg-neutral-950 p-0.5 rounded-lg border border-neutral-800">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              canUndo
                ? 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                : 'text-neutral-600 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              canRedo
                ? 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                : 'text-neutral-600 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Viewport Switcher */}
        <div className="flex items-center bg-neutral-950 p-0.5 rounded-lg border border-neutral-800">
          <button
            onClick={() => onChangeViewport('desktop')}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              viewport === 'desktop'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Pratinjau Desktop (100%)"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onChangeViewport('tablet')}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              viewport === 'tablet'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Pratinjau Tablet (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onChangeViewport('mobile')}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              viewport === 'mobile'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Pratinjau Mobile (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Kanan: Starter, Validasi, Impor, Ekspor ZIP & Simpan */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={onOpenStarters}
          className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 border border-neutral-700"
          title="Pilih Starter Template WordPress"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden md:inline">Starter</span>
        </button>

        <button
          onClick={onOpenValidation}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 border ${
            totalErrors > 0
              ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
              : totalWarnings > 0
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
          }`}
          title="Uji Standar Tema WordPress"
        >
          {totalErrors > 0 ? (
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          )}
          <span className="hidden sm:inline">Validasi</span>
          <span className="font-mono text-[10px] px-1 rounded bg-black/30">
            {validationScore}%
          </span>
        </button>

        <button
          onClick={onOpenImport}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 border border-neutral-700"
          title="Impor theme.json atau style.css"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Impor</span>
        </button>

        <button
          onClick={onOpenExport}
          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm shadow-blue-900/30"
          title="Ekspor Paket ZIP Siap Pasang ke wp-admin"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Ekspor .ZIP</span>
        </button>

        <button
          onClick={() => saveCurrentProject()}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 border border-neutral-700"
          title="Simpan Proyek (Ctrl+S)"
        >
          <Save className="w-3.5 h-3.5 text-neutral-400" />
          <span className="hidden lg:inline">
            {saveStatus === 'saved' ? 'Tersimpan' : 'Simpan'}
          </span>
        </button>
      </div>
    </header>
  );
};
