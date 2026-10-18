/**
 * Nusantara Theme Builder — Project Validator
 * Memvalidasi integritas skema data proyek, ukuran file, dan mencegah injeksi berbahaya.
 */

import { Project, TargetPlatform, ThemeComponent } from '../../types/project';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const SUPPORTED_SCHEMA_VERSIONS = ['1.0.0'];
export const MAX_PROJECT_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export function validateProjectName(name: string): { isValid: boolean; error?: string } {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Nama proyek tidak boleh kosong.' };
  }
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return { isValid: false, error: 'Nama proyek minimal 2 karakter.' };
  }
  if (trimmed.length > 80) {
    return { isValid: false, error: 'Nama proyek maksimal 80 karakter.' };
  }
  // Disallow forbidden filesystem characters like < > : " / \ | ? *
  const forbiddenCharsRegex = /[<>:"/\\|?*\x00-\x1F]/;
  if (forbiddenCharsRegex.test(trimmed)) {
    return { isValid: false, error: 'Nama proyek mengandung karakter terlarang (< > : " / \\ | ? *).' };
  }
  return { isValid: true };
}

export function validateComponent(comp: unknown, path: string): string[] {
  const errors: string[] = [];
  if (!comp || typeof comp !== 'object') {
    return [`Komponen pada ${path} tidak valid.`];
  }
  const c = comp as Partial<ThemeComponent>;

  if (!c.id || typeof c.id !== 'string') {
    errors.push(`Komponen pada ${path} tidak memiliki ID string valid.`);
  }
  if (!c.type || typeof c.type !== 'string') {
    errors.push(`Komponen ${c.id || path} tidak memiliki tipe valid.`);
  }
  if (!c.label || typeof c.label !== 'string') {
    errors.push(`Komponen ${c.id || path} tidak memiliki label valid.`);
  }
  if (!c.category || typeof c.category !== 'string') {
    errors.push(`Komponen ${c.id || path} tidak memiliki kategori valid.`);
  }
  if (c.children && Array.isArray(c.children)) {
    c.children.forEach((child, index) => {
      errors.push(...validateComponent(child, `${path}.children[${index}]`));
    });
  }
  return errors;
}

export function validateProjectStructure(data: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      errors: ['Data proyek harus berupa objek JSON.'],
      warnings: []
    };
  }

  const p = data as Partial<Project>;

  // Check Schema Version
  if (!p.schemaVersion || typeof p.schemaVersion !== 'string') {
    errors.push('Format file tidak memiliki field schemaVersion.');
  } else if (!SUPPORTED_SCHEMA_VERSIONS.includes(p.schemaVersion)) {
    errors.push(`Versi skema "${p.schemaVersion}" tidak didukung. Versi yang didukung: ${SUPPORTED_SCHEMA_VERSIONS.join(', ')}.`);
  }

  // Check ID
  if (!p.id || typeof p.id !== 'string' || p.id.trim().length === 0) {
    errors.push('ID proyek wajib ada dan berupa string unik.');
  }

  // Check Name
  const nameCheck = validateProjectName(p.name || '');
  if (!nameCheck.isValid && nameCheck.error) {
    errors.push(nameCheck.error);
  }

  // Check Target Platform
  const validPlatforms: TargetPlatform[] = ['blogger', 'wordpress'];
  if (!p.targetPlatform || !validPlatforms.includes(p.targetPlatform)) {
    errors.push(`Platform target tidak valid. Harus salah satu dari: ${validPlatforms.join(', ')}.`);
  }

  // Check Timestamps
  if (!p.createdAt || typeof p.createdAt !== 'string') {
    errors.push('Waktu pembuatan (createdAt) tidak valid.');
  }
  if (!p.updatedAt || typeof p.updatedAt !== 'string') {
    errors.push('Waktu pembaruan (updatedAt) tidak valid.');
  }

  // Check Theme Settings
  if (!p.themeSettings || typeof p.themeSettings !== 'object') {
    errors.push('Pengaturan tema (themeSettings) tidak ditemukan atau tidak valid.');
  } else {
    if (!p.themeSettings.primaryColor) {
      warnings.push('Pengaturan primaryColor tidak didefinisikan, default akan digunakan.');
    }
  }

  // Check Pages & Components
  if (!p.pages || !Array.isArray(p.pages) || p.pages.length === 0) {
    errors.push('Proyek minimal harus memiliki 1 halaman.');
  } else {
    p.pages.forEach((page, pageIdx) => {
      if (!page.id || !page.title) {
        errors.push(`Halaman #${pageIdx + 1} tidak memiliki ID atau judul yang valid.`);
      }
      if (!Array.isArray(page.components)) {
        errors.push(`Daftar komponen pada halaman "${page.title || pageIdx}" harus berupa array.`);
      } else {
        page.components.forEach((comp, compIdx) => {
          errors.push(...validateComponent(comp, `pages[${pageIdx}].components[${compIdx}]`));
        });
      }
    });
  }

  // Check Metadata
  if (!p.metadata || typeof p.metadata !== 'object') {
    warnings.push('Metadata proyek tidak lengkap, nilai default akan digunakan.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function parseAndValidateProjectJson(jsonString: string): {
  project: Project | null;
  validation: ValidationResult;
} {
  if (jsonString.length > MAX_PROJECT_FILE_SIZE_BYTES) {
    return {
      project: null,
      validation: {
        isValid: false,
        errors: [`Ukuran file (${(jsonString.length / (1024 * 1024)).toFixed(2)} MB) melebihi batas aman maksimal 10 MB.`],
        warnings: []
      }
    };
  }

  try {
    const parsed = JSON.parse(jsonString);
    const validation = validateProjectStructure(parsed);
    if (!validation.isValid) {
      return { project: null, validation };
    }
    return { project: parsed as Project, validation };
  } catch (err) {
    return {
      project: null,
      validation: {
        isValid: false,
        errors: ['File bukan format JSON yang valid: ' + (err instanceof Error ? err.message : String(err))],
        warnings: []
      }
    };
  }
}
