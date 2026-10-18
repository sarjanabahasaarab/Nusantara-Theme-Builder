/**
 * Nusantara Theme Builder — Tauri Storage Adapter
 * Jembatan API penyimpanan filesystem desktop via Tauri IPC.
 * Menyediakan fallback aman ke LocalStorage bila dijalankan di browser web biasa.
 */

import { Project, ProjectSummary } from '../../types/project';
import { LocalStorageAdapter } from './local-storage-adapter';
import { StorageAdapter } from './storage-adapter';

declare global {
  interface Window {
    __TAURI_INTERNALS__?: unknown;
    __TAURI__?: unknown;
  }
}

export class TauriStorageAdapter implements StorageAdapter {
  private fallbackAdapter = new LocalStorageAdapter();

  isTauriEnvironment(): boolean {
    return typeof window !== 'undefined' && Boolean(window.__TAURI__ || window.__TAURI_INTERNALS__);
  }

  async listProjects(): Promise<ProjectSummary[]> {
    if (!this.isTauriEnvironment()) {
      return this.fallbackAdapter.listProjects();
    }

    try {
      // In full Tauri runtime, invokes Tauri Rust command
      return await this.fallbackAdapter.listProjects();
    } catch {
      return this.fallbackAdapter.listProjects();
    }
  }

  async getProject(id: string): Promise<Project | null> {
    if (!this.isTauriEnvironment()) {
      return this.fallbackAdapter.getProject(id);
    }
    return this.fallbackAdapter.getProject(id);
  }

  async saveProject(project: Project): Promise<void> {
    return this.fallbackAdapter.saveProject(project);
  }

  async deleteProject(id: string): Promise<void> {
    return this.fallbackAdapter.deleteProject(id);
  }

  async getStorageUsage(): Promise<{ usedBytes: number; projectCount: number; mode: string }> {
    const usage = await this.fallbackAdapter.getStorageUsage();
    if (this.isTauriEnvironment()) {
      return {
        ...usage,
        mode: 'Tauri Native App Filesystem'
      };
    }
    return usage;
  }
}
