/**
 * Nusantara Theme Builder — Unit Tests: File Explorer Service
 * Pengujian: Pengelolaan struktur berkas, pembuatan file/folder,
 * proteksi sistem folder, dan pencegahan path traversal.
 */

import { describe, it, expect } from 'vitest';
import { fileExplorerService } from '../../src/services/file-explorer-service';
import { createNewProject } from '../../src/domain/project/project-factory';
import { validateRelativeWorkspacePath } from '../../src/domain/project/project-validator';

describe('File Explorer Service & Workspace Security', () => {
  it('menghasilkan pohon berkas default lengkap dengan folder sistem yang dilindungi', () => {
    const proj = createNewProject('Test Explorer', 'blogger');
    const tree = fileExplorerService.getProjectFileTree(proj);

    const folderNames = tree.filter((n) => n.type === 'folder').map((n) => n.name);
    expect(folderNames).toContain('pages');
    expect(folderNames).toContain('components');
    expect(folderNames).toContain('assets');
    expect(folderNames).toContain('styles');
    expect(folderNames).toContain('scripts');
    expect(folderNames).toContain('docs');
  });

  it('dapat membuat berkas teks baru di dalam folder workspace', () => {
    const proj = createNewProject('Test Explorer', 'blogger');
    let tree = fileExplorerService.getProjectFileTree(proj);

    const res = fileExplorerService.createFile(tree, 'styles', 'custom.css', 'body { margin: 0; }');
    expect(res.error).toBeUndefined();

    const stylesFolder = res.updatedNodes.find((n) => n.name === 'styles');
    expect(stylesFolder?.children?.some((c) => c.name === 'custom.css')).toBe(true);
  });

  it('menolak pembuatan file dengan path traversal ("..")', () => {
    const proj = createNewProject('Test Explorer', 'blogger');
    const tree = fileExplorerService.getProjectFileTree(proj);

    const res = fileExplorerService.createFile(tree, 'styles/../../etc', 'passwd', 'evil');
    expect(res.error).toBeDefined();
    expect(res.error).toContain('Path traversal');
  });

  it('memvalidasi fungsi validateRelativeWorkspacePath menolak path berbahaya', () => {
    expect(validateRelativeWorkspacePath('../outside.txt').isValid).toBe(false);
    expect(validateRelativeWorkspacePath('/etc/passwd').isValid).toBe(false);
    expect(validateRelativeWorkspacePath('C:\\Windows\\system32').isValid).toBe(false);
    expect(validateRelativeWorkspacePath('styles/custom.css').isValid).toBe(true);
  });

  it('mencegah penghapusan folder sistem yang dilindungi', () => {
    const proj = createNewProject('Test Explorer', 'blogger');
    const tree = fileExplorerService.getProjectFileTree(proj);
    const pagesFolder = tree.find((n) => n.name === 'pages');

    expect(pagesFolder).toBeDefined();
    if (pagesFolder) {
      const res = fileExplorerService.deleteNode(tree, pagesFolder.id);
      expect(res.error).toBeDefined();
      expect(res.error).toContain('dilindungi');
    }
  });

  it('mencegah penggantian nama folder sistem', () => {
    const proj = createNewProject('Test Explorer', 'blogger');
    const tree = fileExplorerService.getProjectFileTree(proj);
    const assetsFolder = tree.find((n) => n.name === 'assets');

    expect(assetsFolder).toBeDefined();
    if (assetsFolder) {
      const res = fileExplorerService.renameNode(tree, assetsFolder.id, 'renamed-assets');
      expect(res.error).toBeDefined();
      expect(res.error).toContain('tidak dapat diganti');
    }
  });
});
