/**
 * Nusantara Theme Builder — Blogger Export Service
 * Layanan ekspor dokumen XML tema Blogger dengan encoding UTF-8 dan pemeriksaan pra-ekspor
 * Lisensi: MIT
 */

import { Project } from '../../../types/project';
import { BloggerSettings, ValidationReport } from '../types/blogger';
import { BloggerThemeGenerator, GenerationResult } from '../generator/BloggerThemeGenerator';
import { BloggerThemeValidator } from '../validator/BloggerThemeValidator';

export interface PreExportCheck {
  canExport: boolean;
  validation: ValidationReport;
  generation: GenerationResult;
  suggestedFileName: string;
  fileSizeBytes: number;
  blockers: string[];
  warnings: string[];
}

export class BloggerExportService {
  /**
   * Menghasilkan nama file default aman untuk ekspor Blogger
   */
  public static getSuggestedFileName(projectName: string): string {
    const safeName = (projectName || 'tema-blogger')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    return `${safeName || 'tema'}-blogger-theme.xml`;
  }

  /**
   * Menjalankan checklist pemeriksaan lengkap sebelum ekspor dilakukan
   */
  public static performPreExportCheck(
    project: Project,
    customSettings?: Partial<BloggerSettings>
  ): PreExportCheck {
    const generation = BloggerThemeGenerator.generate(project, customSettings);
    const validation = BloggerThemeValidator.validate(generation.xml);

    const blockers: string[] = [];
    const warnings: string[] = [...generation.warnings];

    if (!validation.isValid) {
      blockers.push(`Ditemukan ${validation.totalErrors} galat sintaks/struktur kritis yang harus diperbaiki.`);
    }

    if (validation.totalWarnings > 0) {
      warnings.push(`Ditemukan ${validation.totalWarnings} peringatan kualitas/SEO pada template.`);
    }

    const suggestedFileName = this.getSuggestedFileName(project.name);
    const fileSizeBytes = new Blob([generation.xml], { type: 'application/xml;charset=utf-8' }).size;

    return {
      canExport: blockers.length === 0,
      validation,
      generation,
      suggestedFileName,
      fileSizeBytes,
      blockers,
      warnings
    };
  }

  /**
   * Melakukan ekspor file .xml dengan encoding UTF-8
   */
  public static exportToFile(xmlContent: string, fileName: string): boolean {
    try {
      const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName.endsWith('.xml') ? fileName : `${fileName}.xml`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      console.error('Gagal mengekspor file XML Blogger:', err);
      return false;
    }
  }
}
