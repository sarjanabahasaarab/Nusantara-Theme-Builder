/**
 * Nusantara Theme Builder — Blogger Theme Builder View (Phase 4)
 * Workspace Penuh Pembuat Tema Blogger dengan Visual Editor, Generator XML,
 * Pemetaan Komponen, Validator 3-Tingkat, Impor Aman, dan Ekspor .xml.
 * Lisensi: MIT
 */

import React, { useState } from 'react';
import { useProjectStore } from '../../stores/useProjectStore';
import { BloggerToolbar } from './components/BloggerToolbar';
import { BloggerComponentPalette } from './components/BloggerComponentPalette';
import { BloggerStructureTree } from './components/BloggerStructureTree';
import { BloggerPagesTab } from './components/BloggerPagesTab';
import { BloggerCanvasPreview } from './components/BloggerCanvasPreview';
import { BloggerPropertiesInspector } from './components/BloggerPropertiesInspector';
import { BloggerValidationModal } from './components/BloggerValidationModal';
import { BloggerImportModal } from './components/BloggerImportModal';
import { BloggerExportModal } from './components/BloggerExportModal';
import { BloggerTemplatesModal } from './components/BloggerTemplatesModal';
import {
  Layers,
  FolderTree,
  FileText,
  AlertTriangle,
  FolderPlus,
  Sparkles
} from 'lucide-react';
import { NewProjectModal } from '../../components/modals/NewProjectModal';

export const BloggerBuilderView: React.FC = () => {
  const { currentProject, createProject, selectComponent } = useProjectStore();

  const [activeSidebarTab, setActiveSidebarTab] = useState<'components' | 'tree' | 'pages'>('components');
  const [isValidationOpen, setIsValidationOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  // Jika belum ada proyek aktif
  if (!currentProject) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-neutral-400 text-xs space-y-4 max-w-md mx-auto text-center">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
          <Layers className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-neutral-200">Blogger Builder</h2>
          <p className="text-neutral-500">
            Silakan buka proyek bertarget Blogger atau buat proyek baru untuk mulai merancang dan mengekspor template Blogger XML.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={async () => {
              await createProject('Blog Personal Blogger', 'blogger', 'personal-blog');
            }}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-neutral-950 font-bold rounded-lg text-xs transition-colors cursor-pointer shadow flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Buat Proyek Cepat</span>
          </button>
          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold rounded-lg text-xs transition-colors cursor-pointer border border-neutral-700"
          >
            Pilih Konfigurasi Proyek...
          </button>
        </div>

        <NewProjectModal
          isOpen={isNewProjectModalOpen}
          onClose={() => setIsNewProjectModalOpen(false)}
        />
      </div>
    );
  }

  // Jika proyek bertarget WordPress, berikan notifikasi jujur dan ramah
  const isBloggerProject = currentProject.targetPlatform === 'blogger';

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3rem)] overflow-hidden select-none bg-neutral-950">
      {/* 1. Toolbar Atas Khusus Blogger */}
      <BloggerToolbar
        onOpenValidation={() => setIsValidationOpen(true)}
        onOpenImport={() => setIsImportOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
      />

      {/* Target Platform Notice (jika membuka proyek non-Blogger) */}
      {!isBloggerProject && (
        <div className="px-4 py-2 bg-amber-950/40 border-b border-amber-800/40 text-amber-300 text-xs flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Proyek ini awalnya bertarget "{currentProject.targetPlatform}". Generator Blogger akan mengadaptasi model layout ke skema XML Blogspot.
            </span>
          </div>
          <span className="text-[10px] font-mono text-amber-400">Mode Kompatibilitas Blogger</span>
        </div>
      )}

      {/* 2. Workspace Utama (Sidebar Kiri + Kanvas Tengah + Inspektur Kanan) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Kiri: Tab Komponen, Struktur, dan Halaman */}
        <aside className="w-72 border-r border-neutral-800 bg-neutral-900/50 flex flex-col shrink-0 overflow-hidden">
          {/* Sidebar Tab Header */}
          <div className="grid grid-cols-3 border-b border-neutral-800 bg-neutral-950/90 text-neutral-400">
            <button
              onClick={() => setActiveSidebarTab('components')}
              className={`py-2.5 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors cursor-pointer border-b-2 ${
                activeSidebarTab === 'components'
                  ? 'border-orange-500 text-orange-400 font-bold bg-neutral-900/60'
                  : 'border-transparent hover:text-neutral-200'
              }`}
              title="Katalog Komponen Blogger"
            >
              <Layers className="w-4 h-4" />
              <span>Komponen</span>
            </button>

            <button
              onClick={() => setActiveSidebarTab('tree')}
              className={`py-2.5 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors cursor-pointer border-b-2 ${
                activeSidebarTab === 'tree'
                  ? 'border-orange-500 text-orange-400 font-bold bg-neutral-900/60'
                  : 'border-transparent hover:text-neutral-200'
              }`}
              title="Hierarki Pohon Struktur Tema"
            >
              <FolderTree className="w-4 h-4" />
              <span>Struktur</span>
            </button>

            <button
              onClick={() => setActiveSidebarTab('pages')}
              className={`py-2.5 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors cursor-pointer border-b-2 ${
                activeSidebarTab === 'pages'
                  ? 'border-orange-500 text-orange-400 font-bold bg-neutral-900/60'
                  : 'border-transparent hover:text-neutral-200'
              }`}
              title="Konteks Halaman Blogger"
            >
              <FileText className="w-4 h-4" />
              <span>Halaman</span>
            </button>
          </div>

          {/* Sidebar Body */}
          <div className="flex-1 overflow-hidden">
            {activeSidebarTab === 'components' && <BloggerComponentPalette />}
            {activeSidebarTab === 'tree' && <BloggerStructureTree />}
            {activeSidebarTab === 'pages' && <BloggerPagesTab />}
          </div>
        </aside>

        {/* Workspace Tengah: Kanvas Pratinjau Tema Responsif */}
        <main
          onClick={() => selectComponent(null)}
          className="flex-1 flex flex-col overflow-hidden bg-neutral-950 relative"
        >
          <BloggerCanvasPreview />
        </main>

        {/* Inspektur Kanan: Properti Komponen atau Pengaturan Tema Blogger */}
        <BloggerPropertiesInspector />
      </div>

      {/* 3. Modal-Modal Aksi Nyata */}
      <BloggerValidationModal
        isOpen={isValidationOpen}
        onClose={() => setIsValidationOpen(false)}
      />

      <BloggerImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      />

      <BloggerExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      <BloggerTemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
      />
    </div>
  );
};
