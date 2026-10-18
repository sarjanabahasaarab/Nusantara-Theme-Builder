# Nusantara Theme Builder

> **Software Desktop Open-Source Pembuat Template Blogger dan Theme WordPress**  
> *Phase 2 — Project Management, File Explorer, Template Library, dan Asset Management*

![Lisensi](https://img.shields.io/badge/license-MIT-green.svg)
![Target](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue.svg)
![Arsitektur](https://img.shields.io/badge/architecture-Tauri%202%20%2B%20React%2019-orange.svg)
![Vitest](https://img.shields.io/badge/tests-45%20passed-brightgreen.svg)

---

## 📌 Deskripsi

**Nusantara Theme Builder** adalah software desktop open-source yang dirancang untuk mempermudah kreator, pengembang web, dan komunitas di Indonesia dalam membuat, mengedit, mempratinjau, dan mengekspor template Blogger (Blogspot) serta theme WordPress secara visual maupun kode.

Aplikasi telah menyelesaikan **Phase 1** dan **Phase 2** dari roadmap 10 fase. Pada Phase 2, fokus utama adalah menghadirkan sistem manajemen proyek yang matang (wizard 5 langkah, duplikasi independen, ganti nama), File Explorer workspace dengan proteksi path traversal, perpustakaan template awal, serta pengelola aset lokal dengan sanitasi keamanan SVG.

---

## 🚀 Fitur yang Tersedia (Phase 1 & Phase 2)

### 1. Project Dashboard & Manajemen Proyek Lanjutan (Phase 2 Selesai)
- **Wizard Pembuatan Proyek 5-Langkah**:
  1. *Identitas*: Nama proyek (dengan validasi karakter sistem berkas, panjang min/max, dan proteksi reserved names).
  2. *Target Ekosistem*: Blogger (Blogspot) vs WordPress Theme.
  3. *Tata Letak Awal*: Pilihan 7 starter template termasuk *Proyek Kosong*.
  4. *Jalur Berkas*: Pemilihan direktori kerja penyimpanan lokal.
  5. *Konfirmasi*: Tinjauan konfigurasi dan inisialisasi state proyek.
- **Pencarian, Filter, & Pengurutan Proyek**: Filter platform target, pencarian instan nama, dan pengurutan dinamis berdasarkan tanggal pembaruan, tanggal pembuatan, atau nama alfabetis.
- **Operasi Proyek Lengkap**:
  - `duplicateProject`: Menggandakan proyek dengan ID unik baru dan kloning komponen tanpa berbagi state.
  - `renameProject`: Mengganti nama proyek dengan validasi sistem berkas.
  - `deleteProject`: Menghapus proyek dari disk lokal disertai dialog konfirmasi aman.
- **Format File Proyek Terstandarisasi (`.ntbproject`)**:
  - Ekspor proyek aktif ke format berkas `.ntbproject`.
  - Impor berkas `.ntbproject` atau `.json` dengan validasi skema v1.0.0, batas ukuran file (maks 10 MB), dan perlindungan anti-timpa otomatis.

### 2. File Explorer Workspace (Phase 2 Selesai)
- Menampilkan pohon direktori internal proyek aktif:
  ```
  project-name/
  ├── project.ntbproject
  ├── pages/
  ├── components/
  ├── assets/
  ├── styles/
  ├── scripts/
  └── docs/
  ```
- Navigasi folder interaktif (*expand / collapse*).
- Membuat berkas teks baru (`.css`, `.js`, `.json`, `.html`, `.md`, `.txt`) dan folder baru.
- Mengganti nama berkas/folder dan menghapus berkas.
- Editor teks terintegrasi untuk membaca dan mengedit berkas teks workspace secara langsung.
- **Proteksi Keamanan Workspace**:
  - Membatasi manipulasi berkas hanya di dalam folder proyek.
  - Pencegahan *path traversal* (`..`) dan penolakan path absolut berbahaya.
  - Folder sistem (`pages`, `components`, `assets`) dilindungi dari penghapusan atau penggantian nama yang tidak disengaja.

### 3. Pengelola Aset Lokal (Phase 2 Selesai)
- Dukungan gambar (PNG, JPEG, WebP, GIF), ikon SVG, font lokal (WOFF, WOFF2, TTF), serta berkas teks/kode (CSS, JS, HTML).
- Unggah multi-berkas melalui file picker komputer.
- **Resolusi Tabrakan Nama Otomatis**: Jika nama berkas bertabrakan, sistem otomatis memberikan nama unik (`hero.png` -> `hero-1.png`).
- Pratinjau thumbnail gambar instan dan dialog modal inspeksi detail.
- **Sanitasi Keamanan SVG**: Memindai konten SVG secara otomatis untuk menolak tag `<script>` atau event handler XSS (`onload=`, `javascript:`, dsb.).
- Batas ukuran aset aman: Maksimal 5 MB per berkas.

### 4. Template Library Terisolasi (Phase 2 Selesai)
- 7 Starter Templates:
  - *Proyek Kosong*: Kanvas bersih murni tanpa komponen.
  - *Blog Personal*: Tata letak catatan harian dan reflektif.
  - *Portal Berita*: Grid tajuk berita, ticker, dan kategori multi-kolom.
  - *Majalah Digital*: Publikasi gaya hidup berkelas dan visual rich.
  - *Portofolio*: Showcase karya visual dan profil profesional.
  - *Blog Teknologi*: Tipografi ramah kode dan dokumentasi teknis.
  - *Landing Page*: Hero section konversi, pilar fitur, dan CTA.
- Modal detail template dengan daftar komponen dan preview skema.
- **Kloning Terisolasi**: Membuat proyek dari template menghasilkan salinan independen tanpa memutasi data master template.

### 5. Visual Editor & Inspector (Fondasi Phase 1)
- Kanvas visual interaktif dengan pengurutan drag-and-drop `@dnd-kit/sortable`.
- Palet komponen terstruktur (*Header, Navigasi, Artikel, Konten, Sidebar, Tombol Aksi, Footer*).
- Properties Inspector untuk mengubah judul, subjudul, konten teks, perataan teks, warna latar, warna teks, dan font.
- Pengaturan tema global (warna primer, warna kanvas, font tulisan).
- Duplikasi dan penghapusan komponen kanvas.
- Riwayat **Undo (Ctrl+Z)** dan **Redo (Ctrl+Y)** imutabel hingga 25 langkah.

### 6. Monaco Code Editor (Fondasi Phase 1)
- Monaco Editor terpasang langsung dengan tema gelap konsisten (`vs-dark`).
- Tab navigasi dokumen: `*.ntbproject`, `preview-structure.html`, dan `blogger-template-draft.xml` / `theme.json`.

### 7. Arsitektur Blogger & WordPress
- Blogger: Target Blogger Blogspot v2/v3, pemetaan `<b:skin>`, `<b:section>`, `<b:widget>`, dsb.
- WordPress: Pemisahan Full Site Editing (FSE) Block Theme (`theme.json` v3, `templates/`, `parts/`) dengan Classic PHP Theme (`style.css`, `functions.php`).

---

## 💻 Tumpukan Teknologi

- **Desktop Framework**: Tauri 2 (Rust)
- **Frontend Core**: React 19 + TypeScript (Strict Mode)
- **Bundler & Tooling**: Vite
- **Styling**: Tailwind CSS
- **State Engine**: Zustand
- **Code Editor**: Monaco Editor (`@monaco-editor/react`)
- **Drag-and-Drop**: `@dnd-kit/core` & `@dnd-kit/sortable`
- **Ikonografi**: Lucide React
- **Unit Testing**: Vitest (45 pengujian lulus)

---

## 📦 Prasyarat Instalasi

1. **Node.js**: Versi 18.x atau lebih baru (direkomendasikan v20 LTS).
2. **npm** atau **pnpm**.
3. **Rust & Cargo** (khusus kompilasi biner desktop native via Tauri):
   - Kunjungi [https://rustup.rs](https://rustup.rs) untuk memasang Rust.
   - Untuk Windows: Visual Studio C++ Build Tools & WebView2 Runtime.
   - Untuk Linux (Ubuntu/Debian): `sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget libssl-dev libgtk-3-dev`.

---

## 🛠️ Cara Memasang Dependensi

```bash
npm install
```

---

## 🖥️ Cara Menjalankan Mode Development

### Mode Antarmuka Web (Dev Server):
```bash
npm run dev
```
Buka browser pada alamat `http://localhost:3000`.

### Mode Desktop Native (Tauri):
```bash
npm run tauri dev
```

---

## 🧪 Cara Menjalankan Pengujian

Jalankan rangkaian unit test otomatis (Vitest):
```bash
npm run test
```

Pemeriksaan tipe data TypeScript:
```bash
npm run typecheck
```

Linter:
```bash
npm run lint
```

---

## 🏗️ Cara Membangun (Build)

### 1. Build Frontend Saja:
```bash
npm run build
```
Hasil kompilasi file statis akan berada di dalam direktori `dist/`.

### 2. Build Aplikasi Desktop Native:
```bash
npm run tauri build
```
File installer (`.exe`/`.msi` di Windows, `.dmg` di macOS, `.deb`/`.AppImage` di Linux) akan dihasilkan di folder `src-tauri/target/release/bundle/`.

---

## 🚀 Panduan Mengunggah Phase 2 ke GitHub

```bash
git add .
git commit -m "feat: implementasi Phase 2 (Project Management, File Explorer, Template Library, Asset Management)"
git push origin main
```

---

## 📄 Lisensi

Proyek ini dirilis di bawah naungan **[Lisensi MIT](LICENSE)**.
