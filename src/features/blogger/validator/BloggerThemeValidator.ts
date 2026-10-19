/**
 * Nusantara Theme Builder — Blogger Theme & XML Validator
 * Validasi 3 tingkat: Sintaks XML, Struktur Template Blogger, dan Kualitas & SEO
 * Lisensi: MIT
 */

import { XMLValidator, XMLParser } from 'fast-xml-parser';
import { ValidationItem, ValidationReport } from '../types/blogger';

export class BloggerThemeValidator {
  /**
   * Menjalankan validasi menyeluruh pada teks XML Blogger
   */
  public static validate(xml: string): ValidationReport {
    const syntaxErrors: ValidationItem[] = [];
    const templateIssues: ValidationItem[] = [];
    const qualityIssues: ValidationItem[] = [];

    let idCounter = 1;
    const makeId = () => `val-${idCounter++}`;

    // =========================================================================
    // 1. PEMERIKSAAN SINTAKS XML
    // =========================================================================
    if (!xml || xml.trim().length === 0) {
      syntaxErrors.push({
        id: makeId(),
        category: 'syntax',
        severity: 'error',
        title: 'Dokumen Kosong',
        message: 'Teks dokumen XML kosong, tidak ada data untuk divalidasi.',
        suggestion: 'Pastikan template tema telah digenerate sebelum validasi.'
      });
    } else {
      // Gunakan XMLValidator dari fast-xml-parser
      const syntaxCheck = XMLValidator.validate(xml, {
        allowBooleanAttributes: true
      });

      if (syntaxCheck !== true) {
        syntaxErrors.push({
          id: makeId(),
          category: 'syntax',
          severity: 'error',
          title: 'Galat Sintaks XML',
          message: syntaxCheck.err.msg || 'Sintaks XML tidak valid.',
          location: `Baris ${syntaxCheck.err.line}, Kolom ${syntaxCheck.err.col}`,
          suggestion: 'Periksa penutupan tag dan karakter khusus (&amp;, &lt;, &gt;) pada baris terkait.'
        });
      }

      // Periksa deklarasi XML
      if (!xml.startsWith('<?xml')) {
        syntaxErrors.push({
          id: makeId(),
          category: 'syntax',
          severity: 'warning',
          title: 'Deklarasi XML Hilang',
          message: 'Dokumen tidak diawali dengan deklarasi <?xml version="1.0" encoding="UTF-8" ?>',
          location: 'Baris 1',
          suggestion: 'Tambahkan deklarasi standar XML di baris paling pertama.'
        });
      }

      // Periksa DOCTYPE
      if (!xml.includes('<!DOCTYPE html>')) {
        syntaxErrors.push({
          id: makeId(),
          category: 'syntax',
          severity: 'warning',
          title: 'DOCTYPE HTML Hilang',
          message: 'Blogger merekomendasikan deklarasi <!DOCTYPE html> untuk rendering standar HTML5.',
          location: 'Baris 2',
          suggestion: 'Tambahkan <!DOCTYPE html> sebelum tag <html>.'
        });
      }
    }

    // =========================================================================
    // 2. PEMERIKSAAN STRUKTUR TEMPLATE BLOGGER
    // =========================================================================
    if (xml && xml.trim().length > 0) {
      // Namespace Blogger
      if (!xml.includes("xmlns:b='http://www.google.com/2005/gml/b'") && !xml.includes('xmlns:b="http://www.google.com/2005/gml/b"')) {
        templateIssues.push({
          id: makeId(),
          category: 'template',
          severity: 'error',
          title: 'Namespace Blogger Hilang',
          message: 'Tag <html> tidak menyertakan namespace resmi Blogger (xmlns:b="http://www.google.com/2005/gml/b").',
          location: 'Tag <html ...>',
          suggestion: 'Tambahkan xmlns:b="http://www.google.com/2005/gml/b" pada tag html pembuka.'
        });
      }

      // Elemen <b:skin>
      if (!xml.includes('<b:skin') || !xml.includes('</b:skin>')) {
        templateIssues.push({
          id: makeId(),
          category: 'template',
          severity: 'error',
          title: 'Elemen <b:skin> Wajib Ditemukan',
          message: 'Template Blogger harus memiliki setidaknya satu tag <b:skin> di dalam bagian <head>.',
          location: '<head>',
          suggestion: 'Sisipkan elemen <b:skin><![CDATA[ ... ]]></b:skin> untuk definisi CSS tema.'
        });
      }

      // Elemen <b:section>
      const sectionMatches = xml.match(/<b:section\b/gi) || [];
      if (sectionMatches.length === 0) {
        templateIssues.push({
          id: makeId(),
          category: 'template',
          severity: 'error',
          title: 'Section Blogger Hilang',
          message: 'Template tidak memiliki elemen <b:section>. Blogger memerlukan setidaknya satu section utama.',
          location: '<body>',
          suggestion: 'Tambahkan <b:section id="main" class="main"> di dalam body.'
        });
      }

      // Widget Blog1 (Utama)
      const hasBlogWidget = xml.includes("type='Blog'") || xml.includes('type="Blog"');
      if (!hasBlogWidget) {
        templateIssues.push({
          id: makeId(),
          category: 'template',
          severity: 'error',
          title: 'Widget Blog Utama Tidak Ditemukan',
          message: 'Template Blogger wajib memiliki widget bertipe "Blog" (misal: id="Blog1") untuk menampilkan postingan.',
          location: '<b:section id="main-section">',
          suggestion: 'Pastikan ada <b:widget id="Blog1" type="Blog"> dengan includable "main" di dalam section utama.'
        });
      }

      // Includable main
      if (hasBlogWidget && !xml.includes("id='main'") && !xml.includes('id="main"')) {
        templateIssues.push({
          id: makeId(),
          category: 'template',
          severity: 'warning',
          title: 'Includable "main" Tidak Ditemukan',
          message: 'Widget Blogger biasanya membutuhkan <b:includable id="main"> sebagai titik masuk rendering konten.',
          location: '<b:widget>',
          suggestion: 'Tambahkan <b:includable id="main"> di dalam setiap widget fungsional.'
        });
      }

      // Duplikasi ID Widget
      const widgetIdRegex = /<b:widget[^>]*\bid=['"]([^'"]+)['"]/gi;
      const widgetIds: string[] = [];
      let match: RegExpExecArray | null;
      while ((match = widgetIdRegex.exec(xml)) !== null) {
        const id = match[1];
        if (widgetIds.includes(id)) {
          templateIssues.push({
            id: makeId(),
            category: 'template',
            severity: 'error',
            title: `Duplikasi ID Widget: ${id}`,
            message: `Ditemukan lebih dari satu widget dengan id "${id}". ID widget di Blogger harus unik.`,
            location: `<b:widget id="${id}">`,
            suggestion: `Ubah ID widget kedua menjadi unik, contoh: ${id}_2.`
          });
        } else {
          widgetIds.push(id);
        }
      }

      // Tag placeholder yang belum diselesaikan
      if (xml.includes('TODO_') || xml.includes('PLACEHOLDER_')) {
        templateIssues.push({
          id: makeId(),
          category: 'template',
          severity: 'warning',
          title: 'Tanda Placeholder Ditemukan',
          message: 'Ditemukan string penanda placeholder (TODO_ atau PLACEHOLDER_) yang belum diisi nilai nyata.',
          suggestion: 'Lengkapi konfigurasi sebelum mengunggah ke Blogger.'
        });
      }
    }

    // =========================================================================
    // 3. PEMERIKSAAN KUALITAS, AKSESIBILITAS & SEO
    // =========================================================================
    if (xml && xml.trim().length > 0) {
      // Viewport responsif
      if (!xml.includes('name="viewport"') && !xml.includes("name='viewport'")) {
        qualityIssues.push({
          id: makeId(),
          category: 'quality_seo',
          severity: 'warning',
          title: 'Meta Viewport Responsif Hilang',
          message: 'Tidak ditemukan tag <meta content="width=device-width, initial-scale=1" name="viewport"/>.',
          location: '<head>',
          suggestion: 'Tambahkan meta viewport agar tema ramah perangkat mobile.'
        });
      }

      // Title dinamis
      if (!xml.includes('data:blog.pageTitle')) {
        qualityIssues.push({
          id: makeId(),
          category: 'quality_seo',
          severity: 'info',
          title: 'Tag Title Belum Dinamis',
          message: 'Judul halaman sebaiknya menggunakan <data:blog.pageTitle/> untuk SEO otomatis.',
          location: '<head><title>',
          suggestion: 'Gunakan <title><data:blog.pageTitle/></title>.'
        });
      }

      // Canonical link
      if (!xml.includes("rel='canonical'") && !xml.includes('rel="canonical"')) {
        qualityIssues.push({
          id: makeId(),
          category: 'quality_seo',
          severity: 'info',
          title: 'Tag Canonical URL Belum Ada',
          message: 'Canonical URL membantu mencegah isu konten duplikat pada Blogger.',
          location: '<head>',
          suggestion: "Tambahkan <link expr:href='data:blog.canonicalUrl' rel='canonical'/>."
        });
      }

      // Aksesibilitas: Gambar tanpa atribut alt
      const imgWithoutAltRegex = /<img\b(?![^>]*\balt=)[^>]*>/gi;
      const imgMatches = xml.match(imgWithoutAltRegex) || [];
      if (imgMatches.length > 0) {
        qualityIssues.push({
          id: makeId(),
          category: 'quality_seo',
          severity: 'warning',
          title: `${imgMatches.length} Tag <img> Tanpa Atribut Alt`,
          message: 'Ditemukan elemen gambar yang tidak memiliki atribut teks alternatif (alt).',
          location: '<body>',
          suggestion: 'Sediakan atribut alt atau expr:alt untuk aksesibilitas dan SEO gambar.'
        });
      }

      // Keamanan: Cek skrip berbahaya / inline eval
      if (xml.includes('eval(') || xml.includes('document.write(')) {
        qualityIssues.push({
          id: makeId(),
          category: 'quality_seo',
          severity: 'warning',
          title: 'Penggunaan JavaScript Berisiko',
          message: 'Ditemukan pemanggilan fungsi berisiko seperti eval() atau document.write() di dalam tema.',
          suggestion: 'Hindari penggunaan skrip tersebut untuk keamanan dan performa.'
        });
      }
    }

    const allIssues = [...syntaxErrors, ...templateIssues, ...qualityIssues];
    const totalErrors = allIssues.filter((i) => i.severity === 'error').length;
    const totalWarnings = allIssues.filter((i) => i.severity === 'warning').length;
    const totalInfos = allIssues.filter((i) => i.severity === 'info').length;

    return {
      isValid: totalErrors === 0,
      syntaxErrors,
      templateIssues,
      qualityIssues,
      totalErrors,
      totalWarnings,
      totalInfos,
      timestamp: new Date().toISOString()
    };
  }
}
