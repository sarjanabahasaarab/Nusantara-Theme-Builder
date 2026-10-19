/**
 * Nusantara Theme Builder — Blogger Theme Generator
 * Generator utama yang mengonversi model Project menjadi dokumen XML Blogger
 * Lisensi: MIT
 */

import { Project, ThemeComponent } from '../../../types/project';
import { BloggerSettings, BloggerMappedComponent } from '../types/blogger';
import { BloggerTemplateSerializer } from './BloggerTemplateSerializer';
import { BloggerComponentMapper } from './BloggerComponentMapper';
import { getDefaultBloggerSettings } from '../utils/defaultBloggerSettings';

export interface GenerationResult {
  xml: string;
  mappedComponents: BloggerMappedComponent[];
  unsupportedComponents: ThemeComponent[];
  hasWarnings: boolean;
  warnings: string[];
  settingsUsed: BloggerSettings;
  generatedAt: string;
  charCount: number;
}

export class BloggerThemeGenerator {
  /**
   * Menghasilkan tema XML Blogger lengkap dari model Project
   */
  public static generate(
    project: Project,
    customSettings?: Partial<BloggerSettings>
  ): GenerationResult {
    // 1. Dapatkan setting gabungan
    const defaultSettings = getDefaultBloggerSettings(project);
    const savedSettings = project.themeSettings?.bloggerSettings || {};
    const settings: BloggerSettings = {
      ...defaultSettings,
      ...savedSettings,
      ...customSettings,
      identity: {
        ...defaultSettings.identity,
        ...(savedSettings.identity || {}),
        ...(customSettings?.identity || {})
      },
      layout: {
        ...defaultSettings.layout,
        ...(savedSettings.layout || {}),
        ...(customSettings?.layout || {})
      },
      appearance: {
        ...defaultSettings.appearance,
        ...(savedSettings.appearance || {}),
        ...(customSettings?.appearance || {})
      },
      article: {
        ...defaultSettings.article,
        ...(savedSettings.article || {}),
        ...(customSettings?.article || {})
      },
      seo: {
        ...defaultSettings.seo,
        ...(savedSettings.seo || {}),
        ...(customSettings?.seo || {})
      }
    };

    // 2. Kumpulkan seluruh komponen dari halaman aktif / beranda
    const homePage = project.pages.find((p) => p.isHome) || project.pages[0];
    const components = homePage ? homePage.components : [];

    // 3. Petakan komponen ke struktur Blogger
    const mappedComponents = BloggerComponentMapper.mapAllComponents(components);
    const unsupportedComponents = mappedComponents
      .filter((m) => m.supportStatus === 'unsupported')
      .map((m) => m.component);

    // 4. Catat peringatan
    const warnings: string[] = [];
    if (unsupportedComponents.length > 0) {
      warnings.push(
        `${unsupportedComponents.length} komponen bertipe belum didukung dan akan diabaikan atau dimasukkan sebagai komentar XML.`
      );
    }
    const partialCount = mappedComponents.filter((m) => m.supportStatus === 'partial').length;
    if (partialCount > 0) {
      warnings.push(
        `${partialCount} komponen berstatus 'didukung sebagian' dan diterjemahkan sebagai widget HTML.`
      );
    }

    // 5. Serialize menjadi XML Blogger
    const xml = BloggerTemplateSerializer.serializeTheme(project, settings, components);

    return {
      xml,
      mappedComponents,
      unsupportedComponents,
      hasWarnings: warnings.length > 0,
      warnings,
      settingsUsed: settings,
      generatedAt: new Date().toISOString(),
      charCount: xml.length
    };
  }
}
