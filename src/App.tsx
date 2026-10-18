/**
 * Nusantara Theme Builder — Main Application Shell
 * Lisensi: MIT
 * Phase 1 & Phase 2 Architecture
 */

import React, { useEffect, useState } from 'react';
import { useProjectStore } from './stores/useProjectStore';
import { TopToolbar } from './components/layout/TopToolbar';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { DashboardView } from './features/dashboard/DashboardView';
import { ProjectsManagerView } from './features/projects/ProjectsManagerView';
import { VisualEditorView } from './features/visual-editor/VisualEditorView';
import { CodeEditorView } from './features/code-editor/CodeEditorView';
import { FileExplorerView } from './features/file-explorer/FileExplorerView';
import { AssetManagementView } from './features/assets/AssetManagementView';
import { BloggerBuilderView } from './features/blogger/BloggerBuilderView';
import { WordPressBuilderView } from './features/wordpress/WordPressBuilderView';
import { TemplateLibraryView } from './features/templates/TemplateLibraryView';
import { SettingsView } from './features/settings/SettingsView';

export default function App() {
  const {
    activeView,
    refreshProjects,
    recentProjects,
    currentProject,
    createProject,
    openProject,
    saveCurrentProject,
    undo,
    redo
  } = useProjectStore();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Initialize projects on load & seed default project if first launch
  useEffect(() => {
    const init = async () => {
      await refreshProjects();
      const currentList = useProjectStore.getState().recentProjects;
      if (currentList.length === 0) {
        // First run seed: Personal Blog for immediate exploration
        await createProject('Blog Personal Nusantara', 'blogger', 'personal-blog');
      } else if (!currentProject) {
        // Automatically open most recent project
        await openProject(currentList[0].id);
      }
    };
    init();
  }, []);

  // Global Desktop Keyboard Shortcuts (Ctrl/Cmd + S, Z, Y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      if (isCtrlOrCmd && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveCurrentProject();
      } else if (isCtrlOrCmd && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      } else if (
        (isCtrlOrCmd && e.key.toLowerCase() === 'y') ||
        (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveCurrentProject, undo, redo]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-neutral-950 text-neutral-100 select-none">
      {/* Top Application Toolbar */}
      <TopToolbar />

      {/* Main Desktop Workspace Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Dynamic View Router */}
        <div className="flex-1 flex flex-col overflow-hidden bg-neutral-950">
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'projects' && <ProjectsManagerView />}
          {activeView === 'visual-editor' && <VisualEditorView />}
          {activeView === 'code-editor' && <CodeEditorView />}
          {activeView === 'file-explorer' && <FileExplorerView />}
          {activeView === 'assets' && <AssetManagementView />}
          {activeView === 'blogger' && <BloggerBuilderView />}
          {activeView === 'wordpress' && <WordPressBuilderView />}
          {activeView === 'templates' && <TemplateLibraryView />}
          {activeView === 'settings' && <SettingsView />}
        </div>
      </div>

      {/* Notifications overlay */}
      <ToastContainer />
    </div>
  );
}
