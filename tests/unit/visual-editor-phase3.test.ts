/**
 * Nusantara Theme Builder — Phase 3 Visual Editor Unit Tests
 * Pengujian operasi visual editor, manipulasi pohon komponen, dan manajemen multi-halaman
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useProjectStore } from '../../src/stores/useProjectStore';
import { COMPONENT_CATALOG } from '../../src/features/visual-editor/component-catalog';
import { createComponent } from '../../src/domain/project/project-factory';

describe('Phase 3: Visual Editor & Component Operations', () => {
  beforeEach(async () => {
    // Reset store and create a clean test project
    const store = useProjectStore.getState();
    await store.createProject('Proyek Uji Visual Editor', 'blogger', 'personal-blog');
  });

  it('memiliki katalog komponen yang lengkap dengan tipe valid', () => {
    expect(COMPONENT_CATALOG.length).toBeGreaterThanOrEqual(10);
    const types = COMPONENT_CATALOG.map((c) => c.type);
    expect(types).toContain('header');
    expect(types).toContain('hero');
    expect(types).toContain('navigation');
    expect(types).toContain('article');
    expect(types).toContain('content');
    expect(types).toContain('media-image');
    expect(types).toContain('footer');
  });

  it('dapat menambahkan komponen baru ke halaman aktif', () => {
    const store = useProjectStore.getState();
    const initialCount = store.currentProject!.pages[0].components.length;

    const newComp = createComponent('cta', 'Tombol Promosi', 'basic', {
      title: 'Dapatkan Promo',
      buttonText: 'Beli Sekarang'
    });

    store.addComponent(newComp);

    const updatedProject = useProjectStore.getState().currentProject!;
    expect(updatedProject.pages[0].components.length).toBe(initialCount + 1);
    expect(useProjectStore.getState().selectedComponentId).toBe(newComp.id);
    expect(useProjectStore.getState().isDirty).toBe(true);
  });

  it('dapat menduplikasi komponen pada posisi berikutnya', () => {
    const store = useProjectStore.getState();
    const firstComp = store.currentProject!.pages[0].components[0];
    const initialCount = store.currentProject!.pages[0].components.length;

    store.duplicateComponent(firstComp.id);

    const updatedProject = useProjectStore.getState().currentProject!;
    expect(updatedProject.pages[0].components.length).toBe(initialCount + 1);
    const duplicatedComp = updatedProject.pages[0].components[1];
    expect(duplicatedComp.label).toContain('(Salinan)');
    expect(duplicatedComp.type).toBe(firstComp.type);
    expect(duplicatedComp.id).not.toBe(firstComp.id);
  });

  it('dapat memindahkan posisi komponen ke atas dan ke bawah', () => {
    const store = useProjectStore.getState();
    const page = store.currentProject!.pages[0];
    const comp0Id = page.components[0].id;
    const comp1Id = page.components[1].id;

    // Move first component up (harus tetap di index 0 karena sudah di puncak)
    store.moveComponentUp(comp0Id);
    expect(useProjectStore.getState().currentProject!.pages[0].components[0].id).toBe(comp0Id);

    // Move first component down (tukar dengan index 1)
    store.moveComponentDown(comp0Id);
    expect(useProjectStore.getState().currentProject!.pages[0].components[0].id).toBe(comp1Id);
    expect(useProjectStore.getState().currentProject!.pages[0].components[1].id).toBe(comp0Id);

    // Move back up
    store.moveComponentUp(comp0Id);
    expect(useProjectStore.getState().currentProject!.pages[0].components[0].id).toBe(comp0Id);
  });

  it('dapat mengembalikan gaya komponen ke nilai default', () => {
    const store = useProjectStore.getState();
    const targetComp = store.currentProject!.pages[0].components[0];

    // Modifikasi gaya
    store.updateComponent(targetComp.id, {
      styles: { backgroundColor: '#ff0000', padding: '5rem' }
    });
    expect(
      useProjectStore.getState().currentProject!.pages[0].components[0].styles.backgroundColor
    ).toBe('#ff0000');

    // Reset gaya
    store.resetComponentStyles(targetComp.id);
    const resetted = useProjectStore.getState().currentProject!.pages[0].components[0];
    expect(resetted.styles.backgroundColor).toBe('transparent');
    expect(resetted.styles.padding).toBe('1.25rem');
  });

  it('dapat mengelola multi-halaman: tambah, ganti aktif, dan mencegah hapus halaman tunggal', () => {
    const store = useProjectStore.getState();
    expect(store.currentProject!.pages.length).toBe(1);

    // Tambah halaman baru
    store.addPage('Tentang Penulis', 'tentang-penulis');
    const projectWith2Pages = useProjectStore.getState().currentProject!;
    expect(projectWith2Pages.pages.length).toBe(2);
    expect(useProjectStore.getState().activePageId).toBe(projectWith2Pages.pages[1].id);

    // Ganti halaman aktif
    store.setActivePageId(projectWith2Pages.pages[0].id);
    expect(useProjectStore.getState().activePageId).toBe(projectWith2Pages.pages[0].id);

    // Hapus halaman kedua
    store.deletePage(projectWith2Pages.pages[1].id);
    expect(useProjectStore.getState().currentProject!.pages.length).toBe(1);

    // Coba hapus satu-satunya halaman yang tersisa (harus ditolak demi integritas)
    store.deletePage(projectWith2Pages.pages[0].id);
    expect(useProjectStore.getState().currentProject!.pages.length).toBe(1);
  });

  it('mendukung zoom level kanvas dalam batas aman 50% hingga 150%', () => {
    const store = useProjectStore.getState();
    store.setZoomLevel(80);
    expect(useProjectStore.getState().zoomLevel).toBe(80);

    // Batas bawah 50%
    store.setZoomLevel(20);
    expect(useProjectStore.getState().zoomLevel).toBe(50);

    // Batas atas 150%
    store.setZoomLevel(200);
    expect(useProjectStore.getState().zoomLevel).toBe(150);
  });
});
