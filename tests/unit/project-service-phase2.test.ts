/**
 * Nusantara Theme Builder — Unit Tests: Phase 2 Project Service Operations
 * Pengujian: Penggandaan proyek (independent state), Ganti nama, dan pencegahan tabrakan.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { projectService } from '../../src/services/project-service';
import { clearMemoryStorage } from '../../src/services/storage/local-storage-adapter';

describe('Project Service — Phase 2 Operations', () => {
  beforeEach(() => {
    clearMemoryStorage();
  });

  it('berhasil menggandakan proyek dengan ID baru dan state yang benar-benar independen', async () => {
    const original = await projectService.createNew('Proyek Master', 'blogger', 'personal-blog');
    const originalCompCount = original.pages[0].components.length;
    const originalComponentId = original.pages[0].components[0].id;

    const cloned = await projectService.duplicateProject(original.id, 'Proyek Master Duplikat');

    expect(cloned.id).not.toBe(original.id);
    expect(cloned.name).toBe('Proyek Master Duplikat');
    expect(cloned.pages[0].components.length).toBe(originalCompCount);

    // Ensure cloned component ID is newly generated (no shared state)
    const clonedComponentId = cloned.pages[0].components[0].id;
    expect(clonedComponentId).not.toBe(originalComponentId);

    // Verify modifying cloned project does not alter original in storage
    cloned.pages[0].components[0].props.title = 'Judul Telah Diubah di Duplikat';
    await projectService.save(cloned);

    const reloadedOriginal = await projectService.getProjectById(original.id);
    expect(reloadedOriginal?.pages[0].components[0].props.title).not.toBe('Judul Telah Diubah di Duplikat');
  });

  it('berhasil mengganti nama proyek dengan nama yang valid', async () => {
    const proj = await projectService.createNew('Nama Awal', 'wordpress');
    const renamed = await projectService.renameProject(proj.id, 'Nama Baru');

    expect(renamed.name).toBe('Nama Baru');

    const loaded = await projectService.getProjectById(proj.id);
    expect(loaded?.name).toBe('Nama Baru');
  });

  it('menolak penggantian nama dengan karakter terlarang atau nama kosong', async () => {
    const proj = await projectService.createNew('Nama Aman', 'blogger');

    await expect(projectService.renameProject(proj.id, '')).rejects.toThrow();
    await expect(projectService.renameProject(proj.id, 'Nama/Terlarang')).rejects.toThrow();
    await expect(projectService.renameProject(proj.id, 'CON')).rejects.toThrow();
  });

  it('dapat mengekspor dan mengimpor kembali proyek format .ntbproject', async () => {
    const proj = await projectService.createNew('Proyek Ekspor', 'wordpress', 'tech-blog');
    const exportedStr = projectService.exportProject(proj);

    expect(exportedStr).toContain('"schemaVersion": "1.0.0"');
    expect(exportedStr).toContain('"name": "Proyek Ekspor"');

    const imported = projectService.importFromJsonString(exportedStr);
    expect(imported.validation.isValid).toBe(true);
    expect(imported.project?.id).toBe(proj.id);
  });
});
