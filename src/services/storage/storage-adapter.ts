/**
 * Nusantara Theme Builder — Storage Adapter Interface
 * Abstraksi penyimpanan lokal: mendukung LocalStorage (Web) dan Tauri Filesystem (Desktop)
 */

import { Project, ProjectSummary } from '../../types/project';

export interface StorageAdapter {
  isTauriEnvironment(): boolean;
  listProjects(): Promise<ProjectSummary[]>;
  getProject(id: string): Promise<Project | null>;
  saveProject(project: Project): Promise<void>;
  deleteProject(id: string): Promise<void>;
  getStorageUsage(): Promise<{ usedBytes: number; projectCount: number; mode: string }>;
}
