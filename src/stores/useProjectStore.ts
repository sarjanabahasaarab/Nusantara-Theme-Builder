/**
 * Nusantara Theme Builder — Zustand Global Store
 * Satu sumber kebenaran (single source of truth) untuk state aplikasi,
 * manajemen proyek, visual editor, inspector, Monaco editor, dan riwayat undo/redo.
 */

import { create } from 'zustand';
import { Project, ProjectSummary, ThemeComponent, ThemeSettings } from '../types/project';
import { projectService } from '../services/project-service';
import { StarterTemplateId } from '../domain/project/project-factory';

export type ActiveAppView =
  | 'dashboard'
  | 'projects'
  | 'visual-editor'
  | 'code-editor'
  | 'blogger'
  | 'wordpress'
  | 'templates'
  | 'settings';

export type SaveStatus = 'saved' | 'saving' | 'dirty' | 'error';
export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: number;
}

export interface CodeDocument {
  id: string;
  name: string;
  language: 'json' | 'html' | 'xml' | 'css' | 'php';
  content: string;
  isReadOnly?: boolean;
}

interface ProjectState {
  // Navigation & UI state
  activeView: ActiveAppView;
  viewportMode: ViewportMode;
  notifications: ToastMessage[];

  // Project state
  currentProject: Project | null;
  recentProjects: ProjectSummary[];
  isDirty: boolean;
  saveStatus: SaveStatus;
  lastSavedAt: string | null;
  activePageId: string;
  selectedComponentId: string | null;

  // Code editor state
  codeDocuments: CodeDocument[];
  activeCodeDocId: string;

  // Undo / Redo history
  undoStack: Project[];
  redoStack: Project[];

  // Storage metrics
  storageInfo: { usedBytes: number; projectCount: number; mode: string };

  // Actions
  setActiveView: (view: ActiveAppView) => void;
  setViewportMode: (mode: ViewportMode) => void;
  addToast: (type: ToastMessage['type'], message: string) => void;
  removeToast: (id: string) => void;

  refreshProjects: () => Promise<void>;
  createProject: (name: string, platform: 'blogger' | 'wordpress', templateId?: StarterTemplateId) => Promise<boolean>;
  openProject: (id: string) => Promise<boolean>;
  saveCurrentProject: () => Promise<boolean>;
  closeProject: () => void;
  deleteProject: (id: string) => Promise<boolean>;
  importProjectFromJson: (jsonString: string) => Promise<{ success: boolean; error?: string }>;

  // Component editing
  selectComponent: (id: string | null) => void;
  addComponent: (component: ThemeComponent, targetIndex?: number) => void;
  updateComponent: (id: string, updates: Partial<ThemeComponent>) => void;
  removeComponent: (id: string) => void;
  reorderComponents: (activeId: string, overId: string) => void;
  updateThemeSettings: (updates: Partial<ThemeSettings>) => void;

  // Undo / Redo
  undo: () => void;
  redo: () => void;

  // Code editor actions
  setActiveCodeDocId: (docId: string) => void;
  updateActiveCodeContent: (newContent: string) => void;
}

const MAX_HISTORY_STEPS = 25;

function createCodeDocumentsForProject(project: Project | null): CodeDocument[] {
  if (!project) {
    return [
      {
        id: 'sample-html',
        name: 'sample-template.html',
        language: 'html',
        content: `<!-- Contoh Template HTML Sederhana -->
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Pratinjau Tema</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1>Selamat Datang di Nusantara Theme Builder</h1>
  </header>
  <main>
    <p>Silakan buat atau buka proyek untuk melihat dokumen proyek nyata.</p>
  </main>
</body>
</html>`
      }
    ];
  }

  const isBlogger = project.targetPlatform === 'blogger';

  return [
    {
      id: 'project-json',
      name: `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-project.json`,
      language: 'json',
      content: JSON.stringify(project, null, 2),
      isReadOnly: false
    },
    {
      id: 'sample-html',
      name: 'preview-structure.html',
      language: 'html',
      content: `<!-- Pratinjau Struktur HTML untuk Proyek "${project.name}" -->
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>${project.name}</title>
  <style>
    :root {
      --primary: ${project.themeSettings.primaryColor};
      --bg: ${project.themeSettings.backgroundColor};
      --text: ${project.themeSettings.textColor};
    }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: ${project.themeSettings.fontFamilySans}, sans-serif;
      margin: 0;
      padding: 1rem;
    }
  </style>
</head>
<body>
  <div id="site-wrapper">
    <!-- Komponen visual yang terpasang: ${project.pages[0]?.components.length || 0} buah -->
    <h1>${project.name}</h1>
    <p>${project.metadata.description}</p>
  </div>
</body>
</html>`
    },
    {
      id: isBlogger ? 'blogger-draft' : 'wp-theme-json',
      name: isBlogger ? 'blogger-template-draft.xml' : 'theme.json',
      language: isBlogger ? 'xml' : 'json',
      content: isBlogger
        ? `<?xml version="1.0" encoding="UTF-8" ?>
<!-- Draft Skema XML Blogger (Tahap Persiapan Phase 4) -->
<html xmlns='http://www.w3.org/1999/xhtml' xmlns:b='http://www.google.com/2005/gml/b' xmlns:data='http://www.google.com/2005/gml/data'>
<head>
  <b:skin><![CDATA[
    body { background-color: ${project.themeSettings.backgroundColor}; color: ${project.themeSettings.textColor}; }
  ]]></b:skin>
</head>
<body>
  <b:section id='header' maxwidgets='1' showaddelement='no'>
    <b:widget id='Header1' locked='true' title='${project.name}' type='Header'/>
  </b:section>
</body>
</html>`
        : JSON.stringify(
            {
              $schema: 'https://schemas.wp.org/trunk/theme.json',
              version: 3,
              title: project.name,
              settings: {
                color: {
                  palette: [
                    { slug: 'primary', color: project.themeSettings.primaryColor, name: 'Utama' },
                    { slug: 'background', color: project.themeSettings.backgroundColor, name: 'Latar' }
                  ]
                }
              }
            },
            null,
            2
          )
    }
  ];
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  activeView: 'dashboard',
  viewportMode: 'desktop',
  notifications: [],

  currentProject: null,
  recentProjects: [],
  isDirty: false,
  saveStatus: 'saved',
  lastSavedAt: null,
  activePageId: 'page-home',
  selectedComponentId: null,

  codeDocuments: createCodeDocumentsForProject(null),
  activeCodeDocId: 'sample-html',

  undoStack: [],
  redoStack: [],

  storageInfo: { usedBytes: 0, projectCount: 0, mode: 'Local' },

  setActiveView: (view) => set({ activeView: view }),
  setViewportMode: (mode) => set({ viewportMode: mode }),

  addToast: (type, message) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    set((state) => ({
      notifications: [...state.notifications, { id, type, message, timestamp: Date.now() }]
    }));
    setTimeout(() => {
      get().removeToast(id);
    }, 4500);
  },

  removeToast: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    }));
  },

  refreshProjects: async () => {
    try {
      const list = await projectService.getAllProjects();
      const stats = await projectService.getStorageStats();
      set({ recentProjects: list, storageInfo: stats });
    } catch (err) {
      console.error('Gagal memperbarui daftar proyek:', err);
    }
  },

  createProject: async (name, platform, templateId = 'personal-blog') => {
    try {
      set({ saveStatus: 'saving' });
      const newProj = await projectService.createNew(name, platform, templateId);
      const docs = createCodeDocumentsForProject(newProj);
      
      set({
        currentProject: newProj,
        activePageId: newProj.pages[0]?.id || 'page-home',
        selectedComponentId: null,
        isDirty: false,
        saveStatus: 'saved',
        lastSavedAt: new Date().toLocaleTimeString('id-ID'),
        undoStack: [],
        redoStack: [],
        codeDocuments: docs,
        activeCodeDocId: docs[0].id,
        activeView: 'visual-editor'
      });

      await get().refreshProjects();
      get().addToast('success', `Proyek "${newProj.name}" berhasil dibuat!`);
      return true;
    } catch (err) {
      set({ saveStatus: 'error' });
      get().addToast('error', 'Gagal membuat proyek: ' + (err instanceof Error ? err.message : String(err)));
      return false;
    }
  },

  openProject: async (id) => {
    try {
      const project = await projectService.getProjectById(id);
      if (!project) {
        get().addToast('error', 'Proyek tidak ditemukan.');
        return false;
      }
      const docs = createCodeDocumentsForProject(project);

      set({
        currentProject: project,
        activePageId: project.pages[0]?.id || 'page-home',
        selectedComponentId: null,
        isDirty: false,
        saveStatus: 'saved',
        lastSavedAt: new Date(project.updatedAt).toLocaleTimeString('id-ID'),
        undoStack: [],
        redoStack: [],
        codeDocuments: docs,
        activeCodeDocId: docs[0].id,
        activeView: 'visual-editor'
      });

      get().addToast('info', `Proyek "${project.name}" dibuka.`);
      return true;
    } catch (err) {
      get().addToast('error', 'Gagal membuka proyek: ' + (err instanceof Error ? err.message : String(err)));
      return false;
    }
  },

  saveCurrentProject: async () => {
    const { currentProject } = get();
    if (!currentProject) return false;

    try {
      set({ saveStatus: 'saving' });
      const saved = await projectService.save(currentProject);
      const docs = createCodeDocumentsForProject(saved);

      set({
        currentProject: saved,
        isDirty: false,
        saveStatus: 'saved',
        lastSavedAt: new Date().toLocaleTimeString('id-ID'),
        codeDocuments: docs
      });

      await get().refreshProjects();
      get().addToast('success', 'Perubahan berhasil disimpan ke penyimpanan lokal.');
      return true;
    } catch (err) {
      set({ saveStatus: 'error' });
      get().addToast('error', 'Gagal menyimpan proyek: ' + (err instanceof Error ? err.message : String(err)));
      return false;
    }
  },

  closeProject: () => {
    set({
      currentProject: null,
      selectedComponentId: null,
      isDirty: false,
      saveStatus: 'saved',
      undoStack: [],
      redoStack: [],
      activeView: 'dashboard',
      codeDocuments: createCodeDocumentsForProject(null),
      activeCodeDocId: 'sample-html'
    });
  },

  deleteProject: async (id) => {
    try {
      const target = get().recentProjects.find((p) => p.id === id);
      await projectService.delete(id);
      
      if (get().currentProject?.id === id) {
        get().closeProject();
      }

      await get().refreshProjects();
      get().addToast('info', `Proyek "${target?.name || id}" berhasil dihapus.`);
      return true;
    } catch (err) {
      get().addToast('error', 'Gagal menghapus proyek: ' + (err instanceof Error ? err.message : String(err)));
      return false;
    }
  },

  importProjectFromJson: async (jsonString) => {
    const parsed = projectService.importFromJsonString(jsonString);
    if (!parsed.project || !parsed.validation.isValid) {
      const err = parsed.validation.errors.join('; ');
      get().addToast('error', 'File proyek ditolak: ' + err);
      return { success: false, error: err };
    }

    try {
      // Check if project with same ID already exists to prevent silent overwrite
      const existing = await projectService.getProjectById(parsed.project.id);
      let projectToSave = parsed.project;
      if (existing) {
        // Generate new ID and notify user
        const newId = 'ntb-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36);
        projectToSave = {
          ...parsed.project,
          id: newId,
          name: `${parsed.project.name} (Salinan Impor)`,
          updatedAt: new Date().toISOString()
        };
        get().addToast('warning', 'ID duplikat terdeteksi. Proyek diimpor sebagai salinan baru.');
      }

      await projectService.save(projectToSave);
      await get().refreshProjects();
      await get().openProject(projectToSave.id);
      get().addToast('success', `Proyek "${projectToSave.name}" berhasil diimpor!`);
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      get().addToast('error', 'Gagal mengimpor file: ' + msg);
      return { success: false, error: msg };
    }
  },

  selectComponent: (id) => set({ selectedComponentId: id }),

  addComponent: (component, targetIndex) => {
    const { currentProject, activePageId, undoStack } = get();
    if (!currentProject) return;

    // Push to undo stack
    const newUndo = [...undoStack, JSON.parse(JSON.stringify(currentProject))].slice(-MAX_HISTORY_STEPS);

    const updatedPages = currentProject.pages.map((p) => {
      if (p.id !== activePageId) return p;
      const comps = [...p.components];
      if (typeof targetIndex === 'number' && targetIndex >= 0 && targetIndex <= comps.length) {
        comps.splice(targetIndex, 0, component);
      } else {
        comps.push(component);
      }
      return { ...p, components: comps };
    });

    const updatedProj: Project = {
      ...currentProject,
      pages: updatedPages,
      updatedAt: new Date().toISOString()
    };

    set({
      currentProject: updatedProj,
      selectedComponentId: component.id,
      isDirty: true,
      saveStatus: 'dirty',
      undoStack: newUndo,
      redoStack: []
    });
  },

  updateComponent: (id, updates) => {
    const { currentProject, activePageId, undoStack } = get();
    if (!currentProject) return;

    const newUndo = [...undoStack, JSON.parse(JSON.stringify(currentProject))].slice(-MAX_HISTORY_STEPS);

    const updatedPages = currentProject.pages.map((p) => {
      if (p.id !== activePageId) return p;
      return {
        ...p,
        components: p.components.map((c) => {
          if (c.id !== id) return c;
          return {
            ...c,
            ...updates,
            props: { ...c.props, ...updates.props },
            styles: { ...c.styles, ...updates.styles }
          };
        })
      };
    });

    set({
      currentProject: {
        ...currentProject,
        pages: updatedPages,
        updatedAt: new Date().toISOString()
      },
      isDirty: true,
      saveStatus: 'dirty',
      undoStack: newUndo,
      redoStack: []
    });
  },

  removeComponent: (id) => {
    const { currentProject, activePageId, undoStack, selectedComponentId } = get();
    if (!currentProject) return;

    const newUndo = [...undoStack, JSON.parse(JSON.stringify(currentProject))].slice(-MAX_HISTORY_STEPS);

    const updatedPages = currentProject.pages.map((p) => {
      if (p.id !== activePageId) return p;
      return {
        ...p,
        components: p.components.filter((c) => c.id !== id)
      };
    });

    set({
      currentProject: {
        ...currentProject,
        pages: updatedPages,
        updatedAt: new Date().toISOString()
      },
      selectedComponentId: selectedComponentId === id ? null : selectedComponentId,
      isDirty: true,
      saveStatus: 'dirty',
      undoStack: newUndo,
      redoStack: []
    });
  },

  reorderComponents: (activeId, overId) => {
    const { currentProject, activePageId, undoStack } = get();
    if (!currentProject || activeId === overId) return;

    const currentPage = currentProject.pages.find((p) => p.id === activePageId);
    if (!currentPage) return;

    const oldIndex = currentPage.components.findIndex((c) => c.id === activeId);
    const newIndex = currentPage.components.findIndex((c) => c.id === overId);
    if (oldIndex === -1 || newIndex === -1) return;

    const newUndo = [...undoStack, JSON.parse(JSON.stringify(currentProject))].slice(-MAX_HISTORY_STEPS);

    const newComps = [...currentPage.components];
    const [moved] = newComps.splice(oldIndex, 1);
    newComps.splice(newIndex, 0, moved);

    const updatedPages = currentProject.pages.map((p) =>
      p.id === activePageId ? { ...p, components: newComps } : p
    );

    set({
      currentProject: {
        ...currentProject,
        pages: updatedPages,
        updatedAt: new Date().toISOString()
      },
      isDirty: true,
      saveStatus: 'dirty',
      undoStack: newUndo,
      redoStack: []
    });
  },

  updateThemeSettings: (updates) => {
    const { currentProject, undoStack } = get();
    if (!currentProject) return;

    const newUndo = [...undoStack, JSON.parse(JSON.stringify(currentProject))].slice(-MAX_HISTORY_STEPS);

    set({
      currentProject: {
        ...currentProject,
        themeSettings: { ...currentProject.themeSettings, ...updates },
        updatedAt: new Date().toISOString()
      },
      isDirty: true,
      saveStatus: 'dirty',
      undoStack: newUndo,
      redoStack: []
    });
  },

  undo: () => {
    const { currentProject, undoStack, redoStack } = get();
    if (undoStack.length === 0 || !currentProject) return;

    const prev = undoStack[undoStack.length - 1];
    const newUndo = undoStack.slice(0, -1);
    const newRedo = [JSON.parse(JSON.stringify(currentProject)), ...redoStack].slice(0, MAX_HISTORY_STEPS);

    set({
      currentProject: prev,
      undoStack: newUndo,
      redoStack: newRedo,
      isDirty: true,
      saveStatus: 'dirty'
    });
  },

  redo: () => {
    const { currentProject, undoStack, redoStack } = get();
    if (redoStack.length === 0 || !currentProject) return;

    const next = redoStack[0];
    const newRedo = redoStack.slice(1);
    const newUndo = [...undoStack, JSON.parse(JSON.stringify(currentProject))].slice(-MAX_HISTORY_STEPS);

    set({
      currentProject: next,
      undoStack: newUndo,
      redoStack: newRedo,
      isDirty: true,
      saveStatus: 'dirty'
    });
  },

  setActiveCodeDocId: (docId) => set({ activeCodeDocId: docId }),

  updateActiveCodeContent: (newContent) => {
    const { codeDocuments, activeCodeDocId } = get();
    const updated = codeDocuments.map((doc) => {
      if (doc.id !== activeCodeDocId) return doc;
      return { ...doc, content: newContent };
    });
    set({ codeDocuments: updated });
  }
}));
