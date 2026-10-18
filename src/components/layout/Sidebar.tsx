/**
 * Nusantara Theme Builder — Sidebar Navigasi Utama
 * Menu navigasi desktop terstruktur (Phase 1 & Phase 2).
 */

import React from 'react';
import { useProjectStore, ActiveAppView } from '../../stores/useProjectStore';
import {
  LayoutDashboard,
  FolderOpen,
  Palette,
  Code2,
  FolderTree,
  ImageIcon,
  FileCode,
  Blocks,
  Library,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  id: ActiveAppView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
  requiresProject?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const { activeView, setActiveView, currentProject } = useProjectStore();

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'projects',
      label: 'Proyek Saya',
      icon: FolderOpen
    },
    {
      id: 'visual-editor',
      label: 'Visual Editor',
      icon: Palette,
      requiresProject: true
    },
    {
      id: 'code-editor',
      label: 'Code Editor',
      icon: Code2,
      badge: 'Monaco',
      badgeColor: 'text-amber-400 bg-amber-500/10'
    },
    {
      id: 'file-explorer',
      label: 'File Explorer',
      icon: FolderTree,
      badge: 'Phase 2',
      badgeColor: 'text-emerald-400 bg-emerald-500/10',
      requiresProject: true
    },
    {
      id: 'assets',
      label: 'Aset Proyek',
      icon: ImageIcon,
      badge: 'Phase 2',
      badgeColor: 'text-emerald-400 bg-emerald-500/10',
      requiresProject: true
    },
    {
      id: 'blogger',
      label: 'Blogger Builder',
      icon: FileCode,
      badge: 'Phase 4',
      badgeColor: 'text-orange-400 bg-orange-500/10'
    },
    {
      id: 'wordpress',
      label: 'WordPress Builder',
      icon: Blocks,
      badge: 'Phase 5',
      badgeColor: 'text-blue-400 bg-blue-500/10'
    },
    {
      id: 'templates',
      label: 'Template Library',
      icon: Library
    },
    {
      id: 'settings',
      label: 'Pengaturan',
      icon: Settings
    }
  ];

  return (
    <aside
      className={`h-[calc(100vh-3rem)] bg-neutral-900/60 border-r border-neutral-800/80 flex flex-col justify-between transition-all duration-200 select-none shrink-0 ${
        isCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Navigation list */}
      <div className="p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          const isProjectMissing = item.requiresProject && !currentProject;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (!isProjectMissing) {
                  setActiveView(item.id);
                }
              }}
              disabled={isProjectMissing}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all relative ${
                isActive
                  ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30'
                  : isProjectMissing
                  ? 'text-neutral-600 opacity-50 cursor-not-allowed hover:bg-transparent'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
              title={
                isProjectMissing
                  ? `${item.label} (Buka atau buat proyek terlebih dahulu)`
                  : item.label
              }
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-neutral-400'}`} />
              
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between text-left">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-medium ${item.badgeColor || 'bg-neutral-800 text-neutral-400'}`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              )}

              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-amber-400 rounded-r" />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer toggle button */}
      <div className="p-2 border-t border-neutral-800/80">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 transition-colors text-xs cursor-pointer"
          title={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!isCollapsed && <span className="ml-2 text-[11px]">Ciutkan Menu</span>}
        </button>
      </div>
    </aside>
  );
};
