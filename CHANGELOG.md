# Catatan Perubahan (Changelog) — Nusantara Theme Builder

Format dokumentasi perubahan mengikuti standar [Keep a Changelog](https://keepachangelog.com/id/1.0.0/).

---

## [0.4.0] — 2026-10-19 (Phase 4: Blogger Theme Builder)

### Ditambahkan
- **Modul Penuh Blogger Builder**: Antarmuka kerja khusus pembuatan tema Blogger dengan Toolbar, Sidebar 3 tab, Kanvas responsif, dan Inspektur properti terintegrasi.
- **Generator & Serializer XML Blogger (`BloggerThemeGenerator.ts`, `BloggerTemplateSerializer.ts`)**:
  - Menghasilkan dokumen XML berstandar resmi Google Blogger v2/v3 dengan namespace `xmlns:b`, `xmlns:data`, `xmlns:expr`.
  - Serializer CSS variabel dinamis di dalam blok `<b:skin><![CDATA[ ... ]]></b:skin>`.
  - Penyusunan section utama (`header-section`, `nav-section`, `main-section`, `sidebar-section`, `footer-section`).
  - Pemetaan widget bawaan Blogger (`Header`, `PageList`, `Blog`, `PopularPosts`, `Label`, `Attribution`, `HTML`) dan sub-rutin `<b:includable id='main'>`, `<b:includable id='post'>`, `<b:includable id='nextprev'>`.
- **Pemetaan Komponen Visual (`BloggerComponentMapper.ts`)**: Menentukan status dukungan komponen (*Supported*, *Partial*, *Unsupported*) dengan pelaporan peringatan sebelum ekspor.
- **Validator 3-Tingkat (`BloggerThemeValidator.ts`)**:
  - Pemeriksaan Sintaks XML menggunakan library `fast-xml-parser` dengan informasi baris/kolom.
  - Pemeriksaan Struktur Template Blogger (keberadaan `<b:skin>`, `<b:section>`, widget Blog1, keunikan ID).
  - Pemeriksaan Kualitas, Aksesibilitas, dan SEO (viewport responsif, canonical link, alt image, deteksi skrip berisiko).
- **Impor Tema Blogger XML (`BloggerThemeImporter.ts`, `BloggerImportModal.tsx`)**:
  - Parsing aman file `.xml` dengan batas ukuran 5 MB dan isolasi script (anti-XSS/anti-XXE).
  - Ekstraksi otomatis variabel CSS dan deteksi widget untuk dipetakan ke kanvas proyek.
- **Ekspor Dokumen XML (`BloggerExportService.ts`, `BloggerExportModal.tsx`)**:
  - Pemeriksaan pra-ekspor otomatis dengan checklist blocker dan peringatan.
  - Unduhan file `.xml` ber-encoding UTF-8 dan panduan langkah pemulihan tema di dashboard Blogger.
- **Pustaka 5 Template Awal Khusus Blogger (`bloggerStarterTemplates.ts`, `BloggerTemplatesModal.tsx`)**:
  - Blog Personal Minimalis, Portal Berita Kilat, Majalah Digital Gaya Hidup, Blog Teknologi & Koding, dan Portal Edukasi & Pembelajaran.
- **Pengujian Unit Otomatis**: Menambahkan `tests/unit/blogger-builder-phase4.test.ts` (9 pengujian komprehensif, total 61 tes lolos).
- **Dokumentasi Lengkap**: `docs/BLOGGER-BUILDER.md`, `docs/BLOGGER-XML.md`, dan `docs/PHASE-4.md`.

---

## [0.3.0] — 2026-10-18 (Phase 3: Visual Editor, DND, Tree, & Inspector)

### Ditambahkan
- Visual Editor tingkat lanjut dengan `@dnd-kit/core` dan `@dnd-kit/sortable`.
- Left Sidebar 4 tab: Komponen, Struktur (Component Tree), Aset, dan Halaman.
- Right Properties Inspector 3 tab (Konten, Gaya & Tata Letak, Platform & Lanjutan).
- Kontrol Zoom kanvas (50% - 150%) dan viewport toggle (Desktop, Tablet, Ponsel).
- Modal pemilih aset cepat (`AssetPickerModal`).

---

## [0.2.0] — 2026-10-17 (Phase 2: Project Management, File Explorer, & Assets)

### Ditambahkan
- Wizard pembuatan proyek 5 langkah terstruktur dengan validasi sistem berkas.
- Format file proyek internal terstandarisasi `.ntbproject`.
- Operasi proyek lokal: duplikasi, penggantian nama, penghapusan aman, impor, dan ekspor.
- File Explorer workspace dengan visualisasi pohon berkas dan perlindungan path traversal.
- Pengelola aset lokal dengan sanitasi keamanan SVG dan resolusi tabrakan nama file.
- Perpustakaan template 7 kategori awal.

---

## [0.1.0] — 2026-10-16 (Phase 1: Foundation)

### Ditambahkan
- Fondasi awal aplikasi desktop (Tauri 2 + React 19 + TypeScript + Tailwind CSS).
- Store state engine terpusat menggunakan Zustand dengan riwayat Undo/Redo imutabel.
- Monaco Code Editor terpasang langsung.
- Kerangka awal arsitektur Blogger dan WordPress.
