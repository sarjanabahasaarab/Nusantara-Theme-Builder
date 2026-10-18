/**
 * Nusantara Theme Builder — Unit Tests: Storage Operations
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageAdapter, clearMemoryStorage } from '../../src/services/storage/local-storage-adapter';
import { createNewProject } from '../../src/domain/project/project-factory';

describe('LocalStorage Adapter Service', () => {
  let adapter: LocalStorageAdapter;

  beforeEach(() => {
    // Clear storage for test isolation
    clearMemoryStorage();
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    adapter = new LocalStorageAdapter();
  });

  it('dapat menyimpan dan memuat kembali proyek', async () => {
    const proj = createNewProject('Proyek Storage Test', 'blogger');
    await adapter.saveProject(proj);

    const loaded = await adapter.getProject(proj.id);
    expect(loaded).not.toBeNull();
    expect(loaded?.id).toBe(proj.id);
    expect(loaded?.name).toBe('Proyek Storage Test');
  });

  it('dapat menampilkan daftar indeks proyek terbaru secara berurutan', async () => {
    const proj1 = createNewProject('Proyek Pertama', 'blogger');
    const proj2 = createNewProject('Proyek Kedua', 'wordpress');

    await adapter.saveProject(proj1);
    await adapter.saveProject(proj2);

    const list = await adapter.listProjects();
    expect(list.length).toBe(2);
    expect(list.some((p) => p.name === 'Proyek Pertama')).toBe(true);
    expect(list.some((p) => p.name === 'Proyek Kedua')).toBe(true);
  });

  it('dapat menghapus proyek dari penyimpanan dan memperbarui indeks', async () => {
    const proj = createNewProject('Proyek Hapus', 'blogger');
    await adapter.saveProject(proj);

    let list = await adapter.listProjects();
    expect(list.length).toBe(1);

    await adapter.deleteProject(proj.id);

    list = await adapter.listProjects();
    expect(list.length).toBe(0);

    const check = await adapter.getProject(proj.id);
    expect(check).toBeNull();
  });

  it('menghitung metrik kapasitas penyimpanan lokal yang digunakan', async () => {
    const proj = createNewProject('Proyek Metrik', 'blogger');
    await adapter.saveProject(proj);

    const usage = await adapter.getStorageUsage();
    expect(usage.projectCount).toBe(1);
    expect(usage.usedBytes).toBeGreaterThan(0);
    expect(usage.mode).toBeDefined();
  });
});
