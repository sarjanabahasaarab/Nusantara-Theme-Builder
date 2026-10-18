/**
 * Nusantara Theme Builder — Top Toolbar
 * Baris atas standar aplikasi desktop: Logo, Nama Proyek, Status Simpan Riil,
 * Undo/Redo, Simpan, Pratinjau, Viewport, dan Ekspor .ntbproject.
 */

import React, { useState } from 'react';
import { useProjectStore } from '../../stores/useProjectStore';
import {
  Undo2,
  Redo2,
  Save,
  Eye,
  Download,
  HelpCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Monitor,
  Tablet,
  Smartphone,
  Plus,
  FolderTree
} from 'lucide-react';
import { PreviewModal } from '../modals/PreviewModal';
import { AboutModal } from '../modals/AboutModal';
import { ProjectCreationWizardModal } from '../modals/ProjectCreationWizardModal';

export const TopToolbar: React.FC = () => {
  const {
    currentProject,
    saveStatus,
    lastSavedAt,
    isDirty,
    saveCurrentProject,
    undo,
    redo,
    undoStack,
    redoStack,
    viewportMode,
    setViewportMode,
    exportCurrentProjectFile,
    setActiveView
  } = useProjectStore();

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;

  return (
    <>
      <header className="h-12 bg-neutral-900/90 border-b border-neutral-800/80 px-4 flex items-center justify-between select-none z-30 shrink-0 backdrop-blur-md">
        {/* Left Section: Logo & Active Project */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-neutral-950 font-bold text-xs shadow-md">
              N
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold tracking-tight text-neutral-100 flex items-center gap-1.5">
                Nusantara Theme Builder
                <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                  Phase 3
                </span>
              </span>
            </div>
          </div>

          <div className="h-4 w-px bg-neutral-800 mx-1 hidden sm:block" />

          {/* Active project display */}
          {currentProject ? (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-medium text-neutral-200 max-w-[180px] truncate" title={currentProject.name}>
                {currentProject.name}
              </span>
              <span
                className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full font-semibold border ${
                  currentProject.targetPlatform === 'blogger'
                    ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                    : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                }`}
              >
                {currentProject.targetPlatform}
              </span>

              <button
                onClick={() => setActiveView('file-explorer')}
                className="p-1 text-neutral-500 hover:text-amber-400 rounded transition-colors"
                title="Buka File Explorer Proyek Ini"
              >
                <FolderTree className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-neutral-500 italic">Tidak ada proyek aktif</span>
              <button
                onClick={() => setIsWizardOpen(true)}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 hover:underline ml-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Buat Proyek
              </button>
            </div>
          )}
        </div>

        {/* Center Section: Viewport Controls */}
        <div className="hidden md:flex items-center gap-1 bg-neutral-950/80 p-0.5 rounded-lg border border-neutral-800">
          <button
            onClick={() => setViewportMode('desktop')}
            className={`p-1.5 rounded text-xs flex items-center gap-1 transition-colors ${
              viewportMode === 'desktop' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Tampilan Desktop"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewportMode('tablet')}
            className={`p-1.5 rounded text-xs flex items-center gap-1 transition-colors ${
              viewportMode === 'tablet' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Tampilan Tablet"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewportMode('mobile')}
            className={`p-1.5 rounded text-xs flex items-center gap-1 transition-colors ${
              viewportMode === 'mobile' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Tampilan Ponsel"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Section: Actions & Realistic Save Status */}
        <div className="flex items-center gap-2">
          {/* Save Status Badge */}
          {currentProject && (
            <div className="hidden lg:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-neutral-950 border border-neutral-800">
              {saveStatus === 'saving' && (
                <>
                  <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />
                  <span className="text-[11px] text-amber-400">Menyimpan...</span>
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  <span className="text-[11px] text-emerald-400 font-medium">Tersimpan</span>
                  {lastSavedAt && <span className="text-[10px] text-neutral-500 font-mono">({lastSavedAt})</span>}
                </>
              )}
              {saveStatus === 'dirty' && (
                <>
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span className="text-[11px] text-amber-300">Ada perubahan</span>
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <AlertCircle className="w-3 h-3 text-rose-400" />
                  <span className="text-[11px] text-rose-400">Gagal simpan</span>
                </>
              )}
            </div>
          )}

          {/* Undo & Redo */}
          <div className="flex items-center bg-neutral-950/80 rounded-lg border border-neutral-800 p-0.5">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="p-1.5 text-neutral-300 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-300 rounded hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="p-1.5 text-neutral-300 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-300 rounded hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Save Button */}
          {currentProject && (
            <button
              onClick={() => saveCurrentProject()}
              disabled={!isDirty || saveStatus === 'saving'}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-neutral-200 border border-neutral-700 transition-all cursor-pointer disabled:cursor-not-allowed"
              title="Simpan Proyek ke Penyimpanan Lokal (Ctrl+S)"
            >
              <Save className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Simpan</span>
            </button>
          )}

          {/* Export .ntbproject Button */}
          {currentProject && (
            <button
              onClick={exportCurrentProjectFile}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors border border-neutral-800 cursor-pointer"
              title="Ekspor Proyek (.ntbproject)"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Preview Trigger */}
          {currentProject && (
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold shadow-sm transition-all cursor-pointer"
              title="Pratinjau Tema Interaktif"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Pratinjau</span>
            </button>
          )}

          {/* Help & About */}
          <button
            onClick={() => setIsAboutOpen(true)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Bantuan & Roadmap 10 Fase"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Modals */}
      <PreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <ProjectCreationWizardModal isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
    </>
  );
};
