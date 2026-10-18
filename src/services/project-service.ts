/**
 * Nusantara Theme Builder — Project Service (Phase 1 & Phase 2)
 * Lapisan abstraksi manajemen proyek, operasi CRUD lengkap, duplikasi,
 * penggantian nama, impor/ekspor .ntbproject, dan pengelolaan berkas workspace.
 */

import {
  createNewProject,
  generateUUID,
  StarterTemplateId
} from '../domain/project/project-factory';
import {
  parseAndValidateProjectJson,
  validateProjectName,
  validateProjectStructure,
  validateRelativeWorkspacePath,
  ValidationResult
} from '../domain/project/project-validator';
import {
  Project,
  ProjectSummary,
  TargetPlatform,
  ProjectAsset,
  ProjectFileNode
} from '../types/project';
import { StorageAdapter } from './storage/storage-adapter';
import { TauriStorageAdapter } from './storage/tauri-storage-adapter';

export interface ProjectListOptions {
  platform?: 'all' | TargetPlatform;
  search?: string;
  sortBy?: 'updatedAt' | 'createdAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

class ProjectService {
  private storage: StorageAdapter;
  private saveLock = new Map<string, Promise<void>>();

  constructor(storageAdapter?: StorageAdapter) {
    this.storage = storageAdapter || new TauriStorageAdapter();
  }

  async getAllProjects(options?: ProjectListOptions): Promise<ProjectSummary[]> {
    let list = await this.storage.listProjects();

    if (options) {
      if (options.platform && options.platform !== 'all') {
        list = list.filter((p) => p.targetPlatform === options.platform);
      }

      if (options.search && options.search.trim()) {
        const query = options.search.toLowerCase().trim();
        list = list.filter((p) => p.name.toLowerCase().includes(query));
      }

      const sortBy = options.sortBy || 'updatedAt';
      const order = options.sortOrder || 'desc';

      list.sort((a, b) => {
        let cmp = 0;
        if (sortBy === 'name') {
          cmp = a.name.localeCompare(b.name, 'id');
        } else if (sortBy === 'createdAt') {
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else {
          cmp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        }
        return order === 'asc' ? cmp : -cmp;
      });
    }

    return list;
  }

  async getProjectById(id: string): Promise<Project | null> {
    return this.storage.getProject(id);
  }

  async createNew(
    name: string,
    platform: TargetPlatform,
    templateId: StarterTemplateId = 'personal-blog',
    storagePath?: string
  ): Promise<Project> {
    const nameCheck = validateProjectName(name);
    if (!nameCheck.isValid) {
      throw new Error(nameCheck.error || 'Nama proyek tidak valid.');
    }

    const project = createNewProject(name, platform, templateId, storagePath);
    await this.storage.saveProject(project);
    return project;
  }

  async save(project: Project): Promise<Project> {
    // Prevent race condition using project ID lock
    const currentLock = this.saveLock.get(project.id);
    if (currentLock) {
      await currentLock;
    }

    const savePromise = (async () => {
      // Validate structure before writing to disk
      const validation = validateProjectStructure(project);
      if (!validation.isValid) {
        throw new Error('Validasi skema proyek gagal: ' + validation.errors.join(', '));
      }

      const updated: Project = {
        ...project,
        updatedAt: new Date().toISOString()
      };
      await this.storage.saveProject(updated);
      return updated;
    })();

    this.saveLock.set(project.id, savePromise.then(() => {}));
    try {
      return await savePromise;
    } finally {
      this.saveLock.delete(project.id);
    }
  }

  async duplicateProject(id: string, newName?: string): Promise<Project> {
    const original = await this.storage.getProject(id);
    if (!original) {
      throw new Error(`Proyek dengan ID "${id}" tidak ditemukan.`);
    }

    const targetName = newName || `${original.name} (Salinan)`;
    const nameCheck = validateProjectName(targetName);
    if (!nameCheck.isValid) {
      throw new Error(nameCheck.error || 'Nama proyek duplikat tidak valid.');
    }

    const now = new Date().toISOString();
    const newId = generateUUID();

    // Deep clone pages and components with new IDs to guarantee independent state
    const clonedPages = original.pages.map((page) => ({
      ...page,
      id: 'page-' + Math.random().toString(36).substring(2, 9),
      components: page.components.map((c) => ({
        ...c,
        id: 'comp-' + Math.random().toString(36).substring(2, 9),
        props: JSON.parse(JSON.stringify(c.props)),
        styles: JSON.parse(JSON.stringify(c.styles))
      }))
    }));

    // Clone assets
    const clonedAssets = (original.assets || []).map((a) => ({
      ...a,
      id: 'asset-' + Math.random().toString(36).substring(2, 9),
      createdAt: now,
      updatedAt: now
    }));

    // Clone custom files
    const clonedFiles = (original.customFiles || []).map((f) => ({
      ...f,
      id: 'f-' + Math.random().toString(36).substring(2, 9),
      updatedAt: now
    }));

    const clonedProject: Project = {
      ...original,
      id: newId,
      name: targetName,
      createdAt: now,
      updatedAt: now,
      pages: clonedPages,
      assets: clonedAssets,
      customFiles: clonedFiles,
      metadata: {
        ...original.metadata,
        description: `Salinan dari "${original.name}"`
      }
    };

    await this.storage.saveProject(clonedProject);
    return clonedProject;
  }

  async renameProject(id: string, newName: string): Promise<Project> {
    const nameCheck = validateProjectName(newName);
    if (!nameCheck.isValid) {
      throw new Error(nameCheck.error || 'Nama proyek tidak valid.');
    }

    const project = await this.storage.getProject(id);
    if (!project) {
      throw new Error(`Proyek dengan ID "${id}" tidak ditemukan.`);
    }

    project.name = newName.trim();
    project.updatedAt = new Date().toISOString();
    await this.storage.saveProject(project);
    return project;
  }

  async delete(id: string): Promise<void> {
    await this.storage.deleteProject(id);
  }

  exportProject(project: Project): string {
    return JSON.stringify(project, null, 2);
  }

  exportAsJsonString(project: Project): string {
    return this.exportProject(project);
  }

  importFromJsonString(jsonString: string): {
    project: Project | null;
    validation: ValidationResult;
  } {
    return parseAndValidateProjectJson(jsonString);
  }

  async getStorageStats() {
    return this.storage.getStorageUsage();
  }
}

export const projectService = new ProjectService();
