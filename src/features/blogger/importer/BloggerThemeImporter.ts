/**
 * Nusantara Theme Builder — Blogger Theme Importer
 * Mengimpor dan mem-parsing template Blogger XML secara aman
 * Mengekstrak konfigurasi warna, widget, layout, dan mengonversinya ke model Project
 * Lisensi: MIT
 */

import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { ThemeComponent, Project } from '../../../types/project';
import { BloggerImportResult, BloggerSettings } from '../types/blogger';
import { getDefaultBloggerSettings } from '../utils/defaultBloggerSettings';
import { createComponent } from '../../../domain/project/project-factory';

export class BloggerThemeImporter {
  // Maksimum batas ukuran file XML yang aman untuk diparsing (5 MB)
  public static readonly MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

  /**
   * Mengimpor teks XML template Blogger secara aman
   */
  public static importXml(xmlContent: string, currentProject?: Project | null): BloggerImportResult {
    const warnings: string[] = [];
    const errors: string[] = [];
    const detectedWidgetTypes: string[] = [];
    const unsupportedElements: string[] = [];
    const mappedComponents: ThemeComponent[] = [];

    // 1. Validasi ukuran teks
    const byteLength = new Blob([xmlContent]).size;
    if (byteLength > this.MAX_FILE_SIZE_BYTES) {
      return {
        success: false,
        rawXmlLength: byteLength,
        skinVariablesCount: 0,
        sectionsCount: 0,
        widgetsCount: 0,
        detectedWidgetTypes: [],
        mappedComponents: [],
        unsupportedElements: [],
        warnings: [],
        errors: [`Ukuran file XML melebihi batas aman 5 MB (${(byteLength / (1024 * 1024)).toFixed(2)} MB).`]
      };
    }

    if (!xmlContent || xmlContent.trim().length === 0) {
      return {
        success: false,
        rawXmlLength: 0,
        skinVariablesCount: 0,
        sectionsCount: 0,
        widgetsCount: 0,
        detectedWidgetTypes: [],
        mappedComponents: [],
        unsupportedElements: [],
        warnings: [],
        errors: ['Isi file XML kosong.']
      };
    }

    // 2. Validasi Sintaks XML
    const isValidSyntax = XMLValidator.validate(xmlContent, {
      allowBooleanAttributes: true
    });

    if (isValidSyntax !== true) {
      return {
        success: false,
        rawXmlLength: byteLength,
        skinVariablesCount: 0,
        sectionsCount: 0,
        widgetsCount: 0,
        detectedWidgetTypes: [],
        mappedComponents: [],
        unsupportedElements: [],
        warnings: [],
        errors: [
          `Format XML rusak atau tidak valid: ${isValidSyntax.err.msg} (Baris ${isValidSyntax.err.line}, Kolom ${isValidSyntax.err.col})`
        ]
      };
    }

    // 3. Verifikasi apakah ini benar-benar template Blogger
    const hasBloggerNamespace =
      xmlContent.includes('xmlns:b=') ||
      xmlContent.includes('<b:skin') ||
      xmlContent.includes('<b:section') ||
      xmlContent.includes('<b:widget');

    if (!hasBloggerNamespace) {
      return {
        success: false,
        rawXmlLength: byteLength,
        skinVariablesCount: 0,
        sectionsCount: 0,
        widgetsCount: 0,
        detectedWidgetTypes: [],
        mappedComponents: [],
        unsupportedElements: [],
        warnings: [],
        errors: [
          'File XML ini bukan template Blogger yang valid (tidak ditemukan elemen <b:skin>, <b:section>, atau namespace Blogger).'
        ]
      };
    }

    // 4. Deteksi Sections & Widgets melalui regex / safe token scanning
    const sectionMatches = xmlContent.match(/<b:section\b[^>]*>/gi) || [];
    const widgetMatches = xmlContent.match(/<b:widget\b[^>]*>/gi) || [];

    // Deteksi tipe widget
    const widgetTypeRegex = /\btype=['"]([^'"]+)['"]/gi;
    let match: RegExpExecArray | null;
    while ((match = widgetTypeRegex.exec(xmlContent)) !== null) {
      const type = match[1];
      if (!detectedWidgetTypes.includes(type)) {
        detectedWidgetTypes.push(type);
      }
    }

    // 5. Ekstraksi Variabel CSS dari <b:skin>
    let primaryColor = '#f59e0b';
    let secondaryColor = '#d97706';
    let backgroundColor = '#09090b';
    let textColor = '#f4f4f5';
    let skinVariablesCount = 0;

    const skinMatch = xmlContent.match(/<b:skin[^>]*>([\s\S]*?)<\/b:skin>/i);
    if (skinMatch && skinMatch[1]) {
      const skinContent = skinMatch[1];

      // Cari CSS Variables
      const primaryVar = skinContent.match(/--primary-color\s*:\s*([^;}\s]+)/i);
      if (primaryVar) {
        primaryColor = primaryVar[1];
        skinVariablesCount++;
      }
      const secondaryVar = skinContent.match(/--secondary-color\s*:\s*([^;}\s]+)/i);
      if (secondaryVar) {
        secondaryColor = secondaryVar[1];
        skinVariablesCount++;
      }
      const bgVar = skinContent.match(/--bg-color\s*:\s*([^;}\s]+)/i);
      if (bgVar) {
        backgroundColor = bgVar[1];
        skinVariablesCount++;
      }
      const textVar = skinContent.match(/--text-color\s*:\s*([^;}\s]+)/i);
      if (textVar) {
        textColor = textVar[1];
        skinVariablesCount++;
      }
    } else {
      warnings.push('Elemen <b:skin> tidak ditemukan atau kosong. Warna default sistem akan digunakan.');
    }

    // 6. Pemetaan Bagian yang Dikenali ke Komponen Visual
    // Header
    if (detectedWidgetTypes.includes('Header') || xmlContent.includes('Header1')) {
      const titleMatch = xmlContent.match(/<b:widget[^>]*\bid=['"]Header1['"][^>]*\btitle=['"]([^'"]+)['"]/i);
      const blogTitle = titleMatch ? titleMatch[1] : (currentProject?.name || 'Blog Impor Blogger');

      mappedComponents.push(
        createComponent('header', 'Header & Judul Blog', 'header', {
          title: blogTitle,
          subtitle: 'Tema diimpor dari file Blogger XML'
        }, {
          padding: '2rem 1.5rem',
          textAlign: 'center'
        })
      );
    }

    // Navigation / PageList
    if (detectedWidgetTypes.includes('PageList') || xmlContent.includes('PageList1')) {
      mappedComponents.push(
        createComponent('navigation', 'Menu Navigasi Blog', 'navigation', {
          brandText: currentProject?.name || 'Blog',
          items: [
            { id: '1', label: 'Beranda', url: '/' },
            { id: '2', label: 'Daftar Isi', url: '/p/daftar-isi.html' },
            { id: '3', label: 'Kontak', url: '/p/kontak.html' }
          ]
        })
      );
    }

    // Blog Main Post
    if (detectedWidgetTypes.includes('Blog') || xmlContent.includes('Blog1')) {
      mappedComponents.push(
        createComponent('article', 'Area Konten Postingan Blogger', 'article', {
          title: 'Tajuk Artikel Contoh dari Impor Blogger',
          author: 'Admin Blogger',
          date: '19 Oktober 2026',
          content: 'Konten postingan tema Blogger ini telah berhasil dipetakan ke dalam struktur visual Nusantara Theme Builder.',
          showAuthor: true,
          showDate: true
        })
      );
    }

    // Sidebar Widgets
    if (detectedWidgetTypes.includes('PopularPosts') || detectedWidgetTypes.includes('Label')) {
      mappedComponents.push(
        createComponent('sidebar', 'Widget Samping Populer & Label', 'sidebar', {
          title: 'Artikel Populer & Kategori',
          content: 'Widget pendukung yang diekstrak dari section sidebar Blogger.'
        })
      );
    }

    // Footer / Attribution
    if (detectedWidgetTypes.includes('Attribution') || xmlContent.includes('Attribution1')) {
      mappedComponents.push(
        createComponent('footer', 'Footer Hak Cipta', 'footer', {
          title: `Hak Cipta © ${currentProject?.name || 'Blog'}. Diimpor ke Nusantara Theme Builder.`
        })
      );
    }

    // Catat elemen yang belum didukung
    for (const wType of detectedWidgetTypes) {
      if (!['Header', 'PageList', 'Blog', 'PopularPosts', 'Label', 'Attribution', 'HTML'].includes(wType)) {
        unsupportedElements.push(`Widget <b:widget type="${wType}">`);
      }
    }

    if (unsupportedElements.length > 0) {
      warnings.push(
        `${unsupportedElements.length} widget khusus (${unsupportedElements.join(', ')}) tidak dapat dikonversi ke komponen visual langsung dan perlu penyesuaian manual.`
      );
    }

    const extractedSettings: Partial<BloggerSettings> = {
      appearance: {
        ...getDefaultBloggerSettings().appearance,
        primaryColor,
        secondaryColor,
        backgroundColor,
        textColor
      }
    };

    return {
      success: true,
      rawXmlLength: byteLength,
      skinVariablesCount,
      sectionsCount: sectionMatches.length,
      widgetsCount: widgetMatches.length,
      detectedWidgetTypes,
      extractedSettings,
      mappedComponents,
      unsupportedElements,
      warnings,
      errors: []
    };
  }
}
