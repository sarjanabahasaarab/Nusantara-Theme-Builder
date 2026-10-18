/**
 * Nusantara Theme Builder — Unit Tests: Validasi Proyek & Input
 */

import { describe, it, expect } from 'vitest';
import {
  validateProjectName,
  validateProjectStructure,
  parseAndValidateProjectJson,
  MAX_PROJECT_FILE_SIZE_BYTES
} from '../../src/domain/project/project-validator';
import { createNewProject } from '../../src/domain/project/project-factory';

describe('Project Name Validation', () => {
  it('menolak nama kosong atau hanya spasi', () => {
    expect(validateProjectName('').isValid).toBe(false);
    expect(validateProjectName('   ').isValid).toBe(false);
  });

  it('menolak nama yang terlalu pendek (< 2 karakter)', () => {
    expect(validateProjectName('a').isValid).toBe(false);
  });

  it('menolak nama yang terlalu panjang (> 80 karakter)', () => {
    const longName = 'A'.repeat(81);
    expect(validateProjectName(longName).isValid).toBe(false);
  });

  it('menolak karakter sistem file terlarang (< > : " / \\ | ? *)', () => {
    expect(validateProjectName('Proyek <Tema>').isValid).toBe(false);
    expect(validateProjectName('Tema:Blog').isValid).toBe(false);
    expect(validateProjectName('Blog/Indo').isValid).toBe(false);
  });

  it('menerima nama proyek yang sah', () => {
    expect(validateProjectName('Blog Nusantara 2026').isValid).toBe(true);
    expect(validateProjectName('Warta Indonesia').isValid).toBe(true);
    expect(validateProjectName('Portfolio-Desain_V2').isValid).toBe(true);
  });
});

describe('Project Structure Validation', () => {
  it('memvalidasi proyek yang dibuat oleh project factory sebagai valid', () => {
    const project = createNewProject('Test Project', 'blogger', 'personal-blog');
    const result = validateProjectStructure(project);
    expect(result.isValid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it('menolak struktur tanpa schemaVersion', () => {
    const project: any = createNewProject('Test Project', 'blogger');
    delete project.schemaVersion;
    const result = validateProjectStructure(project);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes('schemaVersion'))).toBe(true);
  });

  it('menolak platform target yang tidak didukung', () => {
    const project: any = createNewProject('Test Project', 'blogger');
    project.targetPlatform = 'drupal';
    const result = validateProjectStructure(project);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes('Platform target'))).toBe(true);
  });

  it('menolak proyek tanpa halaman', () => {
    const project = createNewProject('Test Project', 'wordpress');
    project.pages = [];
    const result = validateProjectStructure(project);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes('minimal harus memiliki 1 halaman'))).toBe(true);
  });
});

describe('JSON Parsing & Malicious Input Handling', () => {
  it('berhasil mem-parsing JSON proyek yang valid', () => {
    const project = createNewProject('Proyek Valid', 'blogger');
    const jsonStr = JSON.stringify(project);
    const parsed = parseAndValidateProjectJson(jsonStr);
    expect(parsed.project).not.toBeNull();
    expect(parsed.validation.isValid).toBe(true);
    expect(parsed.project?.name).toBe('Proyek Valid');
  });

  it('menolak string JSON yang rusak (malformed syntax)', () => {
    const malformed = '{"name": "Rusak", ';
    const parsed = parseAndValidateProjectJson(malformed);
    expect(parsed.project).toBeNull();
    expect(parsed.validation.isValid).toBe(false);
    expect(parsed.validation.errors[0]).toContain('File bukan format JSON');
  });

  it('menolak string yang melebihi batas ukuran maksimal (10MB)', () => {
    // Simulate oversized file
    const hugeFakeString = '{"fake": "data"}'.padEnd(MAX_PROJECT_FILE_SIZE_BYTES + 10, ' ');
    const parsed = parseAndValidateProjectJson(hugeFakeString);
    expect(parsed.project).toBeNull();
    expect(parsed.validation.isValid).toBe(false);
    expect(parsed.validation.errors[0]).toContain('melebihi batas aman');
  });
});
