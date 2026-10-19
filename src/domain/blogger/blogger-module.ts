/**
 * Nusantara Theme Builder — Modul Domain Blogger
 * Menghubungkan pemeriksaan kesiapan ekspor dengan generator & validator resmi (Phase 4)
 * Lisensi: MIT
 */

import { Project } from '../../types/project';
import { BloggerThemeGenerator } from '../../features/blogger/generator/BloggerThemeGenerator';
import { BloggerThemeValidator } from '../../features/blogger/validator/BloggerThemeValidator';

export interface BloggerExportReadiness {
  isReady: boolean;
  roadmapPhase: string;
  requirementsSummary: string[];
  blockers: string[];
  sampleXmlPreview: string;
}

export function checkBloggerExportReadiness(project: Project): BloggerExportReadiness {
  const isBlogger = project.targetPlatform === 'blogger';
  const blockers: string[] = [];

  if (!isBlogger) {
    blockers.push(`Proyek ini bertarget platform "${project.targetPlatform}", bukan Blogger.`);
  }

  // Generate real XML & validate
  const genResult = BloggerThemeGenerator.generate(project);
  const valResult = BloggerThemeValidator.validate(genResult.xml);

  if (!valResult.isValid) {
    for (const err of valResult.syntaxErrors) {
      blockers.push(err.message);
    }
    for (const err of valResult.templateIssues.filter((i) => i.severity === 'error')) {
      blockers.push(err.message);
    }
  }

  return {
    isReady: blockers.length === 0,
    roadmapPhase: 'Phase 4 (Blogger Builder & XML Generator Selesai)',
    requirementsSummary: [
      'Pemisahan elemen <b:skin> dengan CSS variabel terkompilasi',
      'Penyusunan <b:section> dan <b:widget> sesuai standar Blogspot v2/v3',
      'Penetapan id unik untuk widget bawaan (Header1, Blog1, Attribution1)',
      'Validasi XML 3-Tingkat (Sintaks, Struktur Template Blogger, Kualitas SEO)'
    ],
    blockers,
    sampleXmlPreview: genResult.xml
  };
}
