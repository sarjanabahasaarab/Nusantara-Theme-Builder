/**
 * Nusantara Theme Builder — Unit Tests: Template Library
 * Pengujian: Ketersediaan template awal, isolasi data saat template digunakan,
 * dan perlindungan master template dari mutasi.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { STARTER_TEMPLATES, createStarterComponents, createNewProject } from '../../src/domain/project/project-factory';
import { clearMemoryStorage } from '../../src/services/storage/local-storage-adapter';
import { projectService } from '../../src/services/project-service';

describe('Template Library & Data Cloning Isolation', () => {
  beforeEach(() => {
    clearMemoryStorage();
  });

  it('memiliki 7 pilihan template awal termasuk Proyek Kosong sesuai spesifikasi Phase 2', () => {
    expect(STARTER_TEMPLATES.length).toBe(7);
    const ids = STARTER_TEMPLATES.map((t) => t.id);
    expect(ids).toContain('blank');
    expect(ids).toContain('personal-blog');
    expect(ids).toContain('news-blog');
    expect(ids).toContain('digital-magazine');
    expect(ids).toContain('portfolio');
    expect(ids).toContain('tech-blog');
    expect(ids).toContain('landing-page');
  });

  it('proyek kosong menghasilkan 0 komponen awal', () => {
    const blankComponents = createStarterComponents('blank');
    expect(blankComponents.length).toBe(0);
  });

  it('menggunakan template menghasilkan salinan independen tanpa memodifikasi template sumber', async () => {
    // 1. Check initial component count of news-blog template
    const initialComps = createStarterComponents('news-blog');
    const initialTitle = initialComps[0].props.title;

    // 2. Create project using news-blog template
    const newProj = await projectService.createNew('Warta Mandiri', 'wordpress', 'news-blog');
    expect(newProj.pages[0].components.length).toBe(initialComps.length);

    // 3. Mutate new project components
    newProj.pages[0].components[0].props.title = 'Judul Warta Dimutasi Pengguna';
    newProj.pages[0].components.pop();
    await projectService.save(newProj);

    // 4. Verify fresh starter components for news-blog remain pristine
    const freshComps = createStarterComponents('news-blog');
    expect(freshComps.length).toBe(initialComps.length);
    expect(freshComps[0].props.title).toBe(initialTitle);
  });
});
