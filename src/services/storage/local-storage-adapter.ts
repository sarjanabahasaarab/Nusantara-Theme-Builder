/**
 * Nusantara Theme Builder — LocalStorage Adapter
 * Implementasi penyimpanan lokal untuk peramban dan fallback memori aman (Node/SSR/Test).
 */

import { Project, ProjectSummary } from '../../types/project';
import { StorageAdapter } from './storage-adapter';

const INDEX_KEY = 'ntb_projects_index';
const PROJECT_PREFIX = 'ntb_project_';

// In-memory fallback map when localStorage is not available (e.g. Vitest in Node.js)
const memoryStorage = new Map<string, string>();

function safeGetItem(key: string): string | null {
  if (typeof localStorage !== 'undefined') {
    try {
      return localStorage.getItem(key);
    } catch {
      return memoryStorage.get(key) || null;
    }
  }
  return memoryStorage.get(key) || null;
}

function safeSetItem(key: string, value: string): void {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(key, value);
      return;
    } catch {
      // Fallback
    }
  }
  memoryStorage.set(key, value);
}

export function clearMemoryStorage(): void {
  memoryStorage.clear();
}

function safeRemoveItem(key: string): void {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.removeItem(key);
      return;
    } catch {
      // Fallback
    }
  }
  memoryStorage.delete(key);
}

export class LocalStorageAdapter implements StorageAdapter {
  isTauriEnvironment(): boolean {
    return false;
  }

  async listProjects(): Promise<ProjectSummary[]> {
    try {
      const indexRaw = safeGetItem(INDEX_KEY);
      if (!indexRaw) return [];
      const list: ProjectSummary[] = JSON.parse(indexRaw);
      return Array.isArray(list) ? list : [];
    } catch (err) {
      console.warn('Gagal memuat indeks proyek lokal:', err);
      return [];
    }
  }

  async getProject(id: string): Promise<Project | null> {
    try {
      const dataRaw = safeGetItem(PROJECT_PREFIX + id);
      if (!dataRaw) return null;
      return JSON.parse(dataRaw) as Project;
    } catch (err) {
      console.error(`Gagal memuat proyek dengan id "${id}":`, err);
      return null;
    }
  }

  async saveProject(project: Project): Promise<void> {
    try {
      const key = PROJECT_PREFIX + project.id;
      const json = JSON.stringify(project);
      safeSetItem(key, json);

      // Update index
      const summaries = await this.listProjects();
      const existingIdx = summaries.findIndex((s) => s.id === project.id);
      
      const componentCount = project.pages.reduce(
        (acc, p) => acc + (p.components?.length || 0),
        0
      );

      const summary: ProjectSummary = {
        id: project.id,
        name: project.name,
        targetPlatform: project.targetPlatform,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        pageCount: project.pages.length,
        componentCount
      };

      if (existingIdx >= 0) {
        summaries[existingIdx] = summary;
      } else {
        summaries.unshift(summary);
      }

      // Sort by updatedAt descending
      summaries.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      safeSetItem(INDEX_KEY, JSON.stringify(summaries));
    } catch (err) {
      throw new Error(
        'Gagal menyimpan proyek ke penyimpanan lokal: ' +
          (err instanceof Error ? err.message : String(err))
      );
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      safeRemoveItem(PROJECT_PREFIX + id);
      const summaries = await this.listProjects();
      const filtered = summaries.filter((s) => s.id !== id);
      safeSetItem(INDEX_KEY, JSON.stringify(filtered));
    } catch (err) {
      throw new Error(
        'Gagal menghapus proyek: ' + (err instanceof Error ? err.message : String(err))
      );
    }
  }

  async getStorageUsage(): Promise<{ usedBytes: number; projectCount: number; mode: string }> {
    let usedBytes = 0;
    if (typeof localStorage !== 'undefined') {
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith(PROJECT_PREFIX) || key === INDEX_KEY)) {
            const val = localStorage.getItem(key) || '';
            usedBytes += (key.length + val.length) * 2;
          }
        }
      } catch {
        // Ignored
      }
    } else {
      for (const [k, v] of memoryStorage.entries()) {
        usedBytes += (k.length + v.length) * 2;
      }
    }

    const projects = await this.listProjects();
    return {
      usedBytes,
      projectCount: projects.length,
      mode: typeof localStorage !== 'undefined' ? 'Web LocalStorage Sandbox' : 'Local Memory Sandbox'
    };
  }
}
