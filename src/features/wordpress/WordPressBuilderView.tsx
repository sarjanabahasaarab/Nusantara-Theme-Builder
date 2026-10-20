/**
 * Nusantara Theme Builder — WordPress Builder View (Phase 5)
 * Workspace Lengkap Pembuat Tema WordPress Block Theme (Full Site Editing) & Classic Foundation
 * Memenuhi spesifikasi Phase 5: theme.json v3, Templates, Template Parts, Block Patterns,
 * Properties Inspector, Validator 4-Tingkat, Impor Tema, dan Ekspor Paket .ZIP Siap Pasang.
 * Lisensi: MIT
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useProjectStore } from '../../stores/useProjectStore';
import { WordPressToolbar } from './components/WordPressToolbar';
import { WordPressComponentPalette } from './components/WordPressComponentPalette';
import { WordPressStructureTree } from './components/WordPressStructureTree';
import { WordPressTemplatesTab } from './components/WordPressTemplatesTab';
import { WordPressPatternsTab } from './components/WordPressPatternsTab';
import { WordPressMetadataTab } from './components/WordPressMetadataTab';
import { WordPressCanvasPreview } from './components/WordPressCanvasPreview';
import { WordPressPropertiesInspector } from './components/WordPressPropertiesInspector';
import { WordPressExportModal } from './components/WordPressExportModal';
import { WordPressValidationModal } from './components/WordPressValidationModal';
import { WordPressImportModal } from './components/WordPressImportModal';
import { WordPressStarterModal } from './components/WordPressStarterModal';
import { getDefaultWordPressSettings } from './utils/defaultWordPressSettings';
import { generateWordPressThemePackage } from './generator/WordPressThemeGenerator';
import { validateWordPressTheme } from './validator/WordPressThemeValidator';
import {
  WordPressSettings,
  WordPressThemeType,
  WordPressTemplateItem,
  WordPressBlockPattern
} from './types/wordpress';
import { ThemeComponent } from '../../types/project';
import {
  Blocks,
  FolderTree,
  FileCode,
  Sparkles,
  Sliders,
  AlertTriangle,
  FolderPlus
} from 'lucide-react';
import { NewProjectModal } from '../../components/modals/NewProjectModal';

export const WordPressBuilderView: React.FC = () => {
  const { currentProject, updateThemeSettings, addToast, createProject } = useProjectStore();

  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<
    'components' | 'tree' | 'templates' | 'patterns' | 'metadata'
  >('components');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  // Modals state
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isValidationOpen, setIsValidationOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isStartersOpen, setIsStartersOpen] = useState(false);

  // Inisialisasi state WordPress Settings dari project store atau default
  const [settings, setSettings] = useState<WordPressSettings>(() => {
    if (currentProject?.themeSettings?.wordpressSettings) {
      return currentProject.themeSettings.wordpressSettings;
    }
    return getDefaultWordPressSettings(currentProject);
  });

  // Sinkronisasi saat project berubah
  useEffect(() => {
    if (currentProject?.themeSettings?.wordpressSettings) {
      setSettings(currentProject.themeSettings.wordpressSettings);
    } else if (currentProject) {
      setSettings(getDefaultWordPressSettings(currentProject));
    }
  }, [currentProject?.id]);

  // Simpan perubahan settings ke dalam project store
  const syncSettingsToStore = (newSettings: WordPressSettings) => {
    setSettings(newSettings);
    if (currentProject) {
      updateThemeSettings({
        wordpressSettings: newSettings
      });
    }
  };

  // Identifikasi template atau template part aktif
  const isPartActive = settings.templateParts.some((p) => p.id === settings.activeTemplateId);
  const activeTemplateItem: WordPressTemplateItem = useMemo(() => {
    if (isPartActive) {
      return (
        settings.templateParts.find((p) => p.id === settings.activeTemplateId) ||
        settings.templateParts[0]
      );
    }
    return (
      settings.templates.find((t) => t.id === settings.activeTemplateId) ||
      settings.templates[0]
    );
  }, [settings.activeTemplateId, settings.templates, settings.templateParts, isPartActive]);

  const activeComponents = activeTemplateItem.components || [];

  // Update komponen pada template/part aktif
  const updateActiveComponents = (updatedComponents: ThemeComponent[]) => {
    if (isPartActive) {
      const updatedParts = settings.templateParts.map((p) =>
        p.id === activeTemplateItem.id ? { ...p, components: updatedComponents } : p
      );
      syncSettingsToStore({ ...settings, templateParts: updatedParts });
    } else {
      const updatedTemplates = settings.templates.map((t) =>
        t.id === activeTemplateItem.id ? { ...t, components: updatedComponents } : t
      );
      syncSettingsToStore({ ...settings, templates: updatedTemplates });
    }
  };

  // Handlers manipulasi komponen
  const handleAddComponent = (newComp: ThemeComponent) => {
    const updated = [...activeComponents, newComp];
    updateActiveComponents(updated);
    setSelectedComponentId(newComp.id);
    addToast('success', `Blok "${newComp.name}" ditambahkan ke ${activeTemplateItem.title}.`);
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const updated = [...activeComponents];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    updateActiveComponents(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index >= activeComponents.length - 1) return;
    const updated = [...activeComponents];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    updateActiveComponents(updated);
  };

  const handleDuplicate = (index: number) => {
    const source = activeComponents[index];
    const copy: ThemeComponent = {
      ...source,
      id: `${source.type}-${Date.now().toString(36)}`,
      name: `${source.name} (Salinan)`
    };
    const updated = [...activeComponents];
    updated.splice(index + 1, 0, copy);
    updateActiveComponents(updated);
    setSelectedComponentId(copy.id);
    addToast('info', `Blok "${source.name}" diduplikat.`);
  };

  const handleDelete = (index: number) => {
    const target = activeComponents[index];
    const updated = activeComponents.filter((_, idx) => idx !== index);
    updateActiveComponents(updated);
    if (selectedComponentId === target.id) {
      setSelectedComponentId(null);
    }
    addToast('info', `Blok "${target.name}" dihapus.`);
  };

  const handleUpdateComponentProps = (
    componentId: string,
    props: Record<string, unknown>
  ) => {
    const updated = activeComponents.map((c) =>
      c.id === componentId ? { ...c, props } : c
    );
    updateActiveComponents(updated);
  };

  // Handlers konfigurasi tema
  const handleChangeThemeType = (type: WordPressThemeType) => {
    syncSettingsToStore({ ...settings, themeType: type });
    addToast('info', `Beralih ke mode ${type === 'block' ? 'Block Theme (FSE)' : 'Classic PHP Theme'}.`);
  };

  const handleSelectTemplate = (id: string) => {
    syncSettingsToStore({ ...settings, activeTemplateId: id });
    setSelectedComponentId(null);
  };

  const handleAddTemplate = (newTemplate: WordPressTemplateItem) => {
    if (newTemplate.type === 'part') {
      syncSettingsToStore({
        ...settings,
        templateParts: [...settings.templateParts, newTemplate],
        activeTemplateId: newTemplate.id
      });
    } else {
      syncSettingsToStore({
        ...settings,
        templates: [...settings.templates, newTemplate],
        activeTemplateId: newTemplate.id
      });
    }
    addToast('success', `Template "${newTemplate.title}" berhasil dibuat.`);
  };

  const handleInsertPattern = (pattern: WordPressBlockPattern) => {
    const newComp: ThemeComponent = {
      id: `wp-pattern-${Date.now().toString(36)}`,
      type: 'hero',
      name: `Pattern: ${pattern.title}`,
      props: {
        headline: pattern.title,
        subheadline: pattern.description
      },
      styles: {}
    };
    handleAddComponent(newComp);
    addToast('success', `Pattern "${pattern.title}" disisipkan ke template.`);
  };

  // Komponen terpilih
  const selectedComponent =
    activeComponents.find((c) => c.id === selectedComponentId) || null;

  // Validasi tema
  const validation = useMemo(() => validateWordPressTheme(settings), [settings]);

  // Paket tema yang dihasilkan
  const themePackage = useMemo(() => generateWordPressThemePackage(settings), [settings]);

  if (!currentProject) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-neutral-400 text-xs space-y-4 max-w-md mx-auto text-center select-none">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
          <Blocks className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-neutral-200">WordPress Builder (Phase 5)</h2>
          <p className="text-neutral-500">
            Silakan buka proyek bertarget WordPress atau buat proyek baru untuk mulai merancang tema Block Theme Full Site Editing dan mengekspor paket .zip siap instalasi.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={async () => {
              await createProject('Tema Nusantara Modern', 'wordpress', 'personal-blog');
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer shadow flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Buat Proyek WordPress Cepat</span>
          </button>
          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold rounded-lg text-xs transition-colors cursor-pointer border border-neutral-700"
          >
            Pilih Konfigurasi...
          </button>
        </div>

        <NewProjectModal
          isOpen={isNewProjectModalOpen}
          onClose={() => setIsNewProjectModalOpen(false)}
        />
      </div>
    );
  }

  const isWpProject = currentProject.targetPlatform === 'wordpress';

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3rem)] overflow-hidden select-none bg-neutral-950">
      {/* 1. Top Toolbar Khusus WordPress */}
      <WordPressToolbar
        themeType={settings.themeType}
        onChangeThemeType={handleChangeThemeType}
        viewport={viewport}
        onChangeViewport={setViewport}
        onOpenValidation={() => setIsValidationOpen(true)}
        onOpenImport={() => setIsImportOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenStarters={() => setIsStartersOpen(true)}
        validationScore={validation.scorePercent}
        totalErrors={validation.totalErrors}
        totalWarnings={validation.totalWarnings}
      />

      {/* Target Platform Notice (jika membuka proyek non-WordPress) */}
      {!isWpProject && (
        <div className="px-4 py-2 bg-blue-950/40 border-b border-blue-800/40 text-blue-300 text-xs flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              Proyek ini awalnya bertarget "{currentProject.targetPlatform}". Generator WordPress akan mengonversi model layout ke Block Theme FSE (theme.json v3 & Gutenberg blocks).
            </span>
          </div>
          <span className="text-[10px] font-mono text-blue-400">Mode Adaptasi WordPress</span>
        </div>
      )}

      {/* 2. Workspace Utama (Sidebar Kiri + Kanvas Tengah + Inspektur Kanan) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Kiri: 5 Tab (Komponen, Struktur, Templates, Patterns, Metadata) */}
        <aside className="w-72 border-r border-neutral-800 bg-neutral-900/50 flex flex-col shrink-0 overflow-hidden">
          {/* Header Tab Icons */}
          <div className="grid grid-cols-5 border-b border-neutral-800 bg-neutral-950/90 text-neutral-400">
            <button
              onClick={() => setActiveSidebarTab('components')}
              className={`py-2.5 flex flex-col items-center justify-center gap-1 text-[9px] font-medium transition-colors cursor-pointer border-b-2 ${
                activeSidebarTab === 'components'
                  ? 'border-blue-500 text-blue-400 font-bold bg-neutral-900/60'
                  : 'border-transparent hover:text-neutral-200'
              }`}
              title="Katalog Blok Gutenberg"
            >
              <Blocks className="w-3.5 h-3.5" />
              <span>Blok</span>
            </button>

            <button
              onClick={() => setActiveSidebarTab('tree')}
              className={`py-2.5 flex flex-col items-center justify-center gap-1 text-[9px] font-medium transition-colors cursor-pointer border-b-2 ${
                activeSidebarTab === 'tree'
                  ? 'border-blue-500 text-blue-400 font-bold bg-neutral-900/60'
                  : 'border-transparent hover:text-neutral-200'
              }`}
              title="Pohon Struktur Blok"
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>Struktur</span>
            </button>

            <button
              onClick={() => setActiveSidebarTab('templates')}
              className={`py-2.5 flex flex-col items-center justify-center gap-1 text-[9px] font-medium transition-colors cursor-pointer border-b-2 ${
                activeSidebarTab === 'templates'
                  ? 'border-blue-500 text-blue-400 font-bold bg-neutral-900/60'
                  : 'border-transparent hover:text-neutral-200'
              }`}
              title="Manajemen Templates & Parts"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Template</span>
            </button>

            <button
              onClick={() => setActiveSidebarTab('patterns')}
              className={`py-2.5 flex flex-col items-center justify-center gap-1 text-[9px] font-medium transition-colors cursor-pointer border-b-2 ${
                activeSidebarTab === 'patterns'
                  ? 'border-blue-500 text-blue-400 font-bold bg-neutral-900/60'
                  : 'border-transparent hover:text-neutral-200'
              }`}
              title="Koleksi Block Patterns"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Patterns</span>
            </button>

            <button
              onClick={() => setActiveSidebarTab('metadata')}
              className={`py-2.5 flex flex-col items-center justify-center gap-1 text-[9px] font-medium transition-colors cursor-pointer border-b-2 ${
                activeSidebarTab === 'metadata'
                  ? 'border-blue-500 text-blue-400 font-bold bg-neutral-900/60'
                  : 'border-transparent hover:text-neutral-200'
              }`}
              title="style.css & functions.php"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Metadata</span>
            </button>
          </div>

          {/* Konten Sidebar Kiri */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {activeSidebarTab === 'components' && (
              <WordPressComponentPalette
                onAddComponent={handleAddComponent}
                activeTemplateTitle={activeTemplateItem.title}
              />
            )}

            {activeSidebarTab === 'tree' && (
              <WordPressStructureTree
                components={activeComponents}
                selectedComponentId={selectedComponentId}
                onSelectComponent={setSelectedComponentId}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                activeTemplateTitle={activeTemplateItem.title}
              />
            )}

            {activeSidebarTab === 'templates' && (
              <WordPressTemplatesTab
                templates={settings.templates}
                templateParts={settings.templateParts}
                activeTemplateId={settings.activeTemplateId}
                onSelectTemplate={handleSelectTemplate}
                onAddTemplate={handleAddTemplate}
              />
            )}

            {activeSidebarTab === 'patterns' && (
              <WordPressPatternsTab
                patterns={settings.customPatterns}
                onInsertPattern={handleInsertPattern}
                activeTemplateTitle={activeTemplateItem.title}
              />
            )}

            {activeSidebarTab === 'metadata' && (
              <WordPressMetadataTab
                settings={settings}
                onUpdateMetadata={(meta) =>
                  syncSettingsToStore({
                    ...settings,
                    metadata: { ...settings.metadata, ...meta }
                  })
                }
                onUpdateSettings={(updated) =>
                  syncSettingsToStore({ ...settings, ...updated })
                }
              />
            )}
          </div>
        </aside>

        {/* Kanvas Tengah: Pratinjau Blok Gutenberg */}
        <WordPressCanvasPreview
          components={activeComponents}
          selectedComponentId={selectedComponentId}
          onSelectComponent={setSelectedComponentId}
          viewport={viewport}
          themeJson={settings.themeJson}
          activeTemplateTitle={activeTemplateItem.title}
        />

        {/* Inspektur Kanan: Properties Inspector */}
        <WordPressPropertiesInspector
          selectedComponent={selectedComponent}
          onUpdateComponentProps={handleUpdateComponentProps}
          themeJson={settings.themeJson}
          onUpdateThemeJson={(tj) => syncSettingsToStore({ ...settings, themeJson: tj })}
          validation={validation}
          onOpenValidationModal={() => setIsValidationOpen(true)}
        />
      </div>

      {/* 3. Dialog Modal */}
      <WordPressExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        themePackage={themePackage}
        onToast={addToast}
      />

      <WordPressValidationModal
        isOpen={isValidationOpen}
        onClose={() => setIsValidationOpen(false)}
        validation={validation}
      />

      <WordPressImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onApplyImport={(imported) => syncSettingsToStore({ ...settings, ...imported })}
        onToast={addToast}
      />

      <WordPressStarterModal
        isOpen={isStartersOpen}
        onClose={() => setIsStartersOpen(false)}
        onSelectStarter={(starterSettings) =>
          syncSettingsToStore({ ...settings, ...starterSettings })
        }
        onToast={addToast}
      />
    </div>
  );
};
