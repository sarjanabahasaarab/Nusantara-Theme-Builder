/**
 * Nusantara Theme Builder — Project Service
 * Menyediakan operasi CRUD proyek, impor/ekspor file JSON, serta validasi integritas.
 */

import {
  createNewProject,
  StarterTemplateId
} from '../domain/project/project-factory';
import {
  parseAndValidateProjectJson,
  ValidationResult
} from '../domain/project/project-validator';
import { Project, ProjectSummary, TargetPlatform } from '../types/project';
import { StorageAdapter } from './storage/storage-adapter';
import { TauriStorageAdapter } from './storage/tauri-storage-adapter';

class ProjectService {
  private storage: StorageAdapter;

  constructor(storageAdapter?: StorageAdapter) {
    this.storage = storageAdapter || new TauriStorageAdapter();
  }

  async getAllProjects(): Promise<ProjectSummary[]> {
    return this.storage.listProjects();
  }

  async getProjectById(id: string): Promise<Project | null> {
    return this.storage.getProject(id);
  }

  async createNew(
    name: string,
    platform: TargetPlatform,
    templateId: StarterTemplateId = 'personal-blog'
  ): Promise<Project> {
    const project = createNewProject(name, platform, templateId);
    await this.storage.saveProject(project);
    return project;
  }

  async save(project: Project): Promise<Project> {
    const updated: Project = {
      ...project,
      updatedAt: new Date().toISOString()
    };
    await this.storage.saveProject(updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.storage.deleteProject(id);
  }

  exportAsJsonString(project: Project): string {
    return JSON.stringify(project, null, 2);
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
