/**
 * Nusantara Theme Builder — Unit Tests: Undo & Redo System
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useProjectStore } from '../../src/stores/useProjectStore';
import { createComponent } from '../../src/domain/project/project-factory';

describe('Undo / Redo Operation Stack', () => {
  beforeEach(async () => {
    // Reset and seed a test project
    await useProjectStore.getState().createProject('Undo Test Proj', 'blogger', 'personal-blog');
  });

  it('menyimpan snapshot ke undoStack saat komponen baru ditambahkan', () => {
    const store = useProjectStore.getState();
    const initialUndoLength = store.undoStack.length;
    const initialComponentCount = store.currentProject?.pages[0].components.length || 0;

    const newComp = createComponent('article', 'Artikel Tambahan', 'article');
    store.addComponent(newComp);

    const updated = useProjectStore.getState();
    expect(updated.undoStack.length).toBe(initialUndoLength + 1);
    expect(updated.currentProject?.pages[0].components.length).toBe(initialComponentCount + 1);
    expect(updated.isDirty).toBe(true);
    expect(updated.saveStatus).toBe('dirty');
  });

  it('dapat melakukan undo dan mengembalikan daftar komponen seperti semula', () => {
    const store = useProjectStore.getState();
    const initialComponentCount = store.currentProject?.pages[0].components.length || 0;

    const newComp = createComponent('basic', 'Tombol Uji', 'basic');
    store.addComponent(newComp);

    expect(useProjectStore.getState().currentProject?.pages[0].components.length).toBe(
      initialComponentCount + 1
    );

    // Call Undo
    useProjectStore.getState().undo();

    const afterUndo = useProjectStore.getState();
    expect(afterUndo.currentProject?.pages[0].components.length).toBe(initialComponentCount);
    expect(afterUndo.redoStack.length).toBe(1);
  });

  it('dapat melakukan redo setelah undo dipanggil', () => {
    const store = useProjectStore.getState();
    const initialComponentCount = store.currentProject?.pages[0].components.length || 0;

    const newComp = createComponent('basic', 'Tombol Uji Redo', 'basic');
    store.addComponent(newComp);
    store.undo();

    expect(useProjectStore.getState().currentProject?.pages[0].components.length).toBe(
      initialComponentCount
    );

    // Call Redo
    useProjectStore.getState().redo();

    const afterRedo = useProjectStore.getState();
    expect(afterRedo.currentProject?.pages[0].components.length).toBe(initialComponentCount + 1);
    expect(afterRedo.redoStack.length).toBe(0);
  });
});
