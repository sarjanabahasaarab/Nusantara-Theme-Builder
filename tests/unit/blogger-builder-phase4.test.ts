/**
 * Nusantara Theme Builder — Phase 4: Blogger Builder Unit Tests
 * Pengujian generator XML, serializer, mapper komponen, validator 3-tingkat, impor, dan ekspor
 * Lisensi: MIT
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { XMLValidator } from 'fast-xml-parser';
import { useProjectStore } from '../../src/stores/useProjectStore';
import { BloggerThemeGenerator } from '../../src/features/blogger/generator/BloggerThemeGenerator';
import { BloggerTemplateSerializer } from '../../src/features/blogger/generator/BloggerTemplateSerializer';
import { BloggerComponentMapper } from '../../src/features/blogger/generator/BloggerComponentMapper';
import { BloggerThemeValidator } from '../../src/features/blogger/validator/BloggerThemeValidator';
import { BloggerThemeImporter } from '../../src/features/blogger/importer/BloggerThemeImporter';
import { BloggerExportService } from '../../src/features/blogger/exporter/BloggerExportService';
import { createComponent } from '../../src/domain/project/project-factory';
import { BLOGGER_STARTER_TEMPLATES } from '../../src/features/blogger/data/bloggerStarterTemplates';

describe('Phase 4: Blogger Theme Builder & XML Engine', () => {
  beforeEach(async () => {
    const store = useProjectStore.getState();
    await store.createProject('Proyek Uji Blogger', 'blogger', 'personal-blog');
  });

  // 1. Generator XML Menghasilkan Dokumen Valid
  it('menghasilkan XML yang well-formed dan dapat diparsing oleh XMLValidator', () => {
    const project = useProjectStore.getState().currentProject!;
    const result = BloggerThemeGenerator.generate(project);

    expect(result.xml).toBeDefined();
    expect(result.xml.length).toBeGreaterThan(500);

    // Verifikasi well-formedness sintaks XML
    const isValid = XMLValidator.validate(result.xml, { allowBooleanAttributes: true });
    expect(isValid).toBe(true);
  });

  // 2. Karakter Unicode dan Escaping Karakter Khusus
  it('melakukan escaping karakter &, <, >, dan tanda kutip dengan benar serta mempertahankan Unicode', () => {
    const escaped = BloggerTemplateSerializer.escapeXml('Nusantara & "Kreator" <Hebat> \'2026\'');
    expect(escaped).toBe('Nusantara &amp; &quot;Kreator&quot; &lt;Hebat&gt; &apos;2026&apos;');

    // Uji karakter Unicode bahasa Indonesia dan simbol
    const project = useProjectStore.getState().currentProject!;
    const customProject = {
      ...project,
      name: 'Blog Kebudayaan: Gamelan & Tenun Ikat (Nusa Tenggara)',
      metadata: {
        ...project.metadata,
        description: 'Warisan leluhur Nusantara — keindahan seni & kearifan lokal.'
      }
    };

    const gen = BloggerThemeGenerator.generate(customProject);
    expect(gen.xml).toContain('Gamelan &amp; Tenun Ikat (Nusa Tenggara)');
    expect(BloggerTemplateSerializer.escapeXml(customProject.metadata.description)).toBe(
      'Warisan leluhur Nusantara — keindahan seni &amp; kearifan lokal.'
    );

    const isValid = XMLValidator.validate(gen.xml, { allowBooleanAttributes: true });
    expect(isValid).toBe(true);
  });

  // 3. Elemen Wajib Template Blogger
  it('menyertakan struktur resmi Blogger (<b:skin>, <b:section>, <b:widget id="Blog1" type="Blog">, <b:includable>)', () => {
    const project = useProjectStore.getState().currentProject!;
    const result = BloggerThemeGenerator.generate(project);

    // Namespace
    expect(result.xml).toContain("xmlns:b='http://www.google.com/2005/gml/b'");
    expect(result.xml).toContain("xmlns:data='http://www.google.com/2005/gml/data'");
    expect(result.xml).toContain("xmlns:expr='http://www.google.com/2005/gml/expr'");

    // b:skin CDATA
    expect(result.xml).toContain('<b:skin><![CDATA[');
    expect(result.xml).toContain(']]></b:skin>');

    // b:section
    expect(result.xml).toContain("<b:section id='header-section'");
    expect(result.xml).toContain("<b:section id='main-section'");

    // b:widget Blog1
    expect(result.xml).toContain("<b:widget id='Blog1'");
    expect(result.xml).toContain("type='Blog'");

    // Includable
    expect(result.xml).toContain("<b:includable id='main'");
    expect(result.xml).toContain("<b:includable id='post'");
  });

  // 4. Pengaturan Visual Mengalir ke CSS Variabel <b:skin>
  it('menyematkan nilai themeSettings dan bloggerSettings ke variabel CSS dalam <b:skin>', () => {
    const store = useProjectStore.getState();
    store.updateThemeSettings({
      primaryColor: '#e11d48',
      backgroundColor: '#0f172a',
      textColor: '#f8fafc',
      fontFamilySans: 'Inter'
    });

    const project = useProjectStore.getState().currentProject!;
    const result = BloggerThemeGenerator.generate(project);

    expect(result.xml).toContain('--primary-color: #e11d48');
    expect(result.xml).toContain('--bg-color: #0f172a');
    expect(result.xml).toContain('--text-color: #f8fafc');
  });

  // 5. Pemetaan Komponen Visual (BloggerComponentMapper)
  it('memetakan komponen visual ke target Blogger dengan status supported, partial, dan unsupported yang akurat', () => {
    const headerComp = createComponent('header', 'Header', 'header');
    const navComp = createComponent('navigation', 'Nav', 'navigation');
    const articleComp = createComponent('article', 'Artikel', 'article');
    const heroComp = createComponent('hero', 'Hero', 'layout');
    const unknownComp = createComponent('super-unknown-widget', 'Widget Asing', 'basic');

    const mappedHeader = BloggerComponentMapper.mapComponent(headerComp);
    expect(mappedHeader.supportStatus).toBe('supported');
    expect(mappedHeader.targetWidgetType).toBe('Header');

    const mappedNav = BloggerComponentMapper.mapComponent(navComp);
    expect(mappedNav.supportStatus).toBe('supported');
    expect(mappedNav.targetWidgetType).toBe('PageList');

    const mappedArticle = BloggerComponentMapper.mapComponent(articleComp);
    expect(mappedArticle.supportStatus).toBe('supported');
    expect(mappedArticle.targetWidgetType).toBe('Blog');

    const mappedHero = BloggerComponentMapper.mapComponent(heroComp);
    expect(mappedHero.supportStatus).toBe('partial');

    const mappedUnknown = BloggerComponentMapper.mapComponent(unknownComp);
    expect(mappedUnknown.supportStatus).toBe('unsupported');
  });

  // 6. Validator 3-Tingkat (Syntax, Template, Quality/SEO)
  it('mendeteksi galat sintaks XML, struktur Blogger yang hilang, dan isu SEO', () => {
    // Uji XML rusak sintaks
    const brokenXml = '<html b:version="2"><head><title>Unclosed</head></html>';
    const brokenReport = BloggerThemeValidator.validate(brokenXml);
    expect(brokenReport.isValid).toBe(false);
    expect(brokenReport.totalErrors).toBeGreaterThan(0);
    expect(brokenReport.syntaxErrors.length).toBeGreaterThan(0);

    // Uji XML valid sintaks tetapi bukan template Blogger
    const plainHtml = '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html><html><head><title>Test</title></head><body>Hello</body></html>';
    const plainReport = BloggerThemeValidator.validate(plainHtml);
    expect(plainReport.isValid).toBe(false);
    expect(plainReport.templateIssues.some((i) => i.title.includes('b:skin'))).toBe(true);
    expect(plainReport.templateIssues.some((i) => i.title.includes('Blog'))).toBe(true);

    // Uji XML template hasil generator resmi
    const project = useProjectStore.getState().currentProject!;
    const gen = BloggerThemeGenerator.generate(project);
    const validReport = BloggerThemeValidator.validate(gen.xml);
    expect(validReport.isValid).toBe(true);
    expect(validReport.totalErrors).toBe(0);
  });

  // 7. Impor XML Blogger yang Aman
  it('menolak file rusak secara aman dan dapat mengimpor XML Blogger valid', () => {
    // 1. File kosong / rusak
    const emptyResult = BloggerThemeImporter.importXml('');
    expect(emptyResult.success).toBe(false);
    expect(emptyResult.errors.length).toBeGreaterThan(0);

    const corruptResult = BloggerThemeImporter.importXml('<b:skin>unclosed');
    expect(corruptResult.success).toBe(false);

    // 2. Impor template Blogger valid
    const validSampleXml = `<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html>
<html b:css='false' b:version='2' xmlns='http://www.w3.org/1999/xhtml' xmlns:b='http://www.google.com/2005/gml/b'>
<head>
  <b:skin><![CDATA[
    :root {
      --primary-color: #3b82f6;
      --bg-color: #020617;
      --text-color: #f1f5f9;
    }
  ]]></b:skin>
</head>
<body>
  <b:section id='header-section'>
    <b:widget id='Header1' title='Blog Import Test' type='Header'/>
  </b:section>
  <b:section id='main-section'>
    <b:widget id='Blog1' title='Posts' type='Blog'/>
  </b:section>
</body>
</html>`;

    const importRes = BloggerThemeImporter.importXml(validSampleXml);
    expect(importRes.success).toBe(true);
    expect(importRes.sectionsCount).toBe(2);
    expect(importRes.widgetsCount).toBe(2);
    expect(importRes.detectedWidgetTypes).toContain('Header');
    expect(importRes.detectedWidgetTypes).toContain('Blog');
    expect(importRes.extractedSettings?.appearance?.primaryColor).toBe('#3b82f6');
    expect(importRes.mappedComponents.length).toBeGreaterThanOrEqual(1);
  });

  // 8. Ekspor Service & Pemeriksaan Pra-Ekspor
  it('menghasilkan nama file yang benar dan pre-export check yang lolos untuk proyek valid', () => {
    const project = useProjectStore.getState().currentProject!;
    const fileName = BloggerExportService.getSuggestedFileName('Proyek Warta Nusantara');
    expect(fileName).toBe('proyek-warta-nusantara-blogger-theme.xml');

    const check = BloggerExportService.performPreExportCheck(project);
    expect(check.canExport).toBe(true);
    expect(check.validation.isValid).toBe(true);
    expect(check.fileSizeBytes).toBeGreaterThan(500);
  });

  // 9. Pustaka 5 Template Awal Khusus Blogger
  it('menyediakan 5 template awal khusus Blogger yang valid untuk digenerate', () => {
    expect(BLOGGER_STARTER_TEMPLATES.length).toBe(5);

    const categories = BLOGGER_STARTER_TEMPLATES.map((t) => t.category);
    expect(categories).toContain('personal');
    expect(categories).toContain('news');
    expect(categories).toContain('magazine');
    expect(categories).toContain('tech');
    expect(categories).toContain('education');

    // Setiap template harus memiliki komponen terstruktur
    for (const tmpl of BLOGGER_STARTER_TEMPLATES) {
      expect(tmpl.components.length).toBeGreaterThanOrEqual(3);
    }
  });
});
