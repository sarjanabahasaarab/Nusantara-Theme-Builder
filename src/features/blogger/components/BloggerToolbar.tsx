/**
 * Nusantara Theme Builder — Blogger Toolbar
 * Toolbar atas khusus Blogger Builder (Phase 4)
 * Lisensi: MIT
 */

import React from 'react';
import { useProjectStore, ViewportMode } from '../../../stores/useProjectStore';
import {
  ArrowLeft,
  Save,
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  CheckCircle,
  Download,
  Upload,
  Sparkles,
  LayoutTemplate
} from 'lucide-react';

interface BloggerToolbarProps {
  onOpenValidation: () => void;
  onOpenImport: () => void;
  onOpenExport: () => void;
  onOpenTemplates: () => void;
}

export const BloggerToolbar: React.FC<BloggerToolbarProps> = ({
  onOpenValidation,
  onOpenImport,
  onOpenExport,
  onOpenTemplates
}) => {
  const {
    currentProject,
    setActiveView,
    saveCurrentProject,
    isDirty,
    saveStatus,
    undo,
    redo,
    undoStack,
    redoStack,
    viewportMode,
    setViewportMode
  } = useProjectStore();

  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;

  return (
    <header className="h-12 border-b border-neutral-800 bg-neutral-900/90 px-4 flex items-center justify-between gap-3 text-xs select-none backdrop-blur-md shrink-0 z-30">
      {/* Sisi Kiri: Kembali ke Dashboard & Identitas Proyek */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveView('dashboard')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
          title="Kembali ke Dashboard Utama"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-medium">Dashboard</span>
        </button>

        <div className="h-4 w-px bg-neutral-800 hidden sm:block" />

        <div className="flex items-center gap-2">
          <span className="font-bold text-neutral-200 truncate max-w-[140px] sm:max-w-[200px]">
            {currentProject?.name || 'Proyek Blogger'}
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/30">
            Blogger XML
          </span>
        </div>
      </div>

      {/* Sisi Tengah: Mode Tampilan Viewport Responsif */}
      <div className="flex items-center bg-neutral-950 rounded-lg border border-neutral-800 p-0.5">
        <button
          onClick={() => setViewportMode('desktop')}
          className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
            viewportMode === 'desktop' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
          }`}
          title="Pratinjau Desktop"
        >
          <Monitor className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setViewportMode('tablet')}
          className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
            viewportMode === 'tablet' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
          }`}
          title="Pratinjau Tablet"
        >
          <Tablet className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setViewportMode('mobile')}
          className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
            viewportMode === 'mobile' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
          }`}
          title="Pratinjau Ponsel"
        >
          <Smartphone className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Sisi Kanan: Aksi-Aksi Nyata */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Undo / Redo */}
        <div className="flex items-center bg-neutral-950/80 rounded-lg border border-neutral-800 p-0.5 hidden md:flex">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-30 rounded hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Urungkan Perubahan (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-30 rounded hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Ulangi Perubahan (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Template Awal Blogger */}
        <button
          onClick={onOpenTemplates}
          className="px-2.5 py-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/60 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          title="Pilih Template Awal Blogger"
        >
          <LayoutTemplate className="w-3.5 h-3.5 text-orange-400" />
          <span className="hidden lg:inline">Template Awal</span>
        </button>

        {/* Simpan Proyek */}
        <button
          onClick={() => saveCurrentProject()}
          disabled={!isDirty || saveStatus === 'saving'}
          className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-neutral-200 border border-neutral-700 font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
          title="Simpan Proyek ke Penyimpanan Lokal (Ctrl+S)"
        >
          <Save className="w-3.5 h-3.5 text-orange-400" />
          <span className="hidden sm:inline">Simpan</span>
        </button>

        {/* Validasi XML */}
        <button
          onClick={onOpenValidation}
          className="px-2.5 py-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/60 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          title="Periksa dan Validasi XML Blogger"
        >
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Validasi XML</span>
        </button>

        {/* Impor XML */}
        <button
          onClick={onOpenImport}
          className="px-2.5 py-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/60 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          title="Impor Template XML Blogger"
        >
          <Upload className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden md:inline">Impor XML</span>
        </button>

        {/* Ekspor XML */}
        <button
          onClick={onOpenExport}
          className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-neutral-950 font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          title="Ekspor Dokumen XML Tema Blogger"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Ekspor XML</span>
        </button>
      </div>
    </header>
  );
};
