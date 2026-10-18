/**
 * Nusantara Theme Builder — Unit Tests: Project Factory & UUID
 */

import { describe, it, expect } from 'vitest';
import {
  createNewProject,
  generateUUID,
  createComponent,
  STARTER_TEMPLATES
} from '../../src/domain/project/project-factory';

describe('Project Factory & UUID Generation', () => {
  it('menghasilkan ID proyek yang unik pada setiap panggilan', () => {
    const id1 = generateUUID();
    const id2 = generateUUID();
    expect(id1).not.toBe(id2);
    expect(typeof id1).toBe('string');
    expect(id1.length).toBeGreaterThan(5);
  });

  it('membuat proyek baru dengan konfigurasi platform Blogger yang benar', () => {
    const proj = createNewProject('Blog Saya', 'blogger', 'personal-blog');
    expect(proj.name).toBe('Blog Saya');
    expect(proj.targetPlatform).toBe('blogger');
    expect(proj.schemaVersion).toBe('1.0.0');
    expect(proj.pages.length).toBe(1);
    expect(proj.pages[0].components.length).toBeGreaterThan(0);
    expect(proj.themeSettings.primaryColor).toBe('#ea580c');
  });

  it('membuat proyek baru dengan konfigurasi platform WordPress yang benar', () => {
    const proj = createNewProject('Portal Berita', 'wordpress', 'news-blog');
    expect(proj.name).toBe('Portal Berita');
    expect(proj.targetPlatform).toBe('wordpress');
    expect(proj.themeSettings.primaryColor).toBe('#2563eb');
    expect(proj.pages[0].components.some((c) => c.type === 'article')).toBe(true);
  });

  it('menyediakan starter template terverifikasi sesuai spesifikasi', () => {
    expect(STARTER_TEMPLATES.length).toBeGreaterThanOrEqual(6);
    const ids = STARTER_TEMPLATES.map((t) => t.id);
    expect(ids).toContain('blank');
    expect(ids).toContain('personal-blog');
    expect(ids).toContain('news-blog');
    expect(ids).toContain('digital-magazine');
    expect(ids).toContain('portfolio');
    expect(ids).toContain('tech-blog');
    expect(ids).toContain('landing-page');
  });

  it('membuat komponen baru dengan ID dan gaya default', () => {
    const comp = createComponent('article', 'Artikel Utama', 'article', { title: 'Halo' });
    expect(comp.id).toBeDefined();
    expect(comp.id.startsWith('comp-')).toBe(true);
    expect(comp.type).toBe('article');
    expect(comp.label).toBe('Artikel Utama');
    expect(comp.styles.padding).toBeDefined();
  });
});
