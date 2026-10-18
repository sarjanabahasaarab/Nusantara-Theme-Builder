# Nusantara Theme Builder

> **Software Desktop Open-Source Pembuat Template Blogger dan Theme WordPress**  
> *Phase 1 — Fondasi Aplikasi Desktop, Dashboard, Penyimpanan Lokal, dan Editor Dasar*

![Lisensi](https://img.shields.io/badge/license-MIT-green.svg)
![Target](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue.svg)
![Arsitektur](https://img.shields.io/badge/architecture-Tauri%202%20%2B%20React%2019-orange.svg)

---

## 📌 Deskripsi

**Nusantara Theme Builder** adalah software desktop open-source yang dirancang untuk mempermudah kreator, pengembang web, dan komunitas di Indonesia dalam membuat, mengedit, mempratinjau, dan mengekspor template Blogger (Blogspot) serta theme WordPress secara visual maupun kode.

Ini adalah **Phase 1** dari roadmap 10 fase. Fokus utama Phase 1 adalah membangun fondasi aplikasi yang benar-benar berfungsi, arsitektur yang bersih, penyimpanan data lokal di komputer pengguna, editor visual drag-and-drop dasar, integrasi Monaco Editor, serta arsitektur persiapan untuk Blogger dan WordPress.

---

## 🚀 Fitur Phase 1 yang Tersedia

1. **Dashboard Profesional**:
   - Ringkasan statistik penyimpanan lokal dan jumlah proyek.
   - Akses cepat pembuatan proyek baru, pembukaan proyek tersimpan, dan impor proyek.
   - Daftar proyek terbaru yang tersimpan secara riil.
   - 6 Starter Template data v1.0.0 (Blog personal, Berita, Majalah digital, Portofolio, Blog teknologi, Landing page).
   - Ringkasan Roadmap 10 Fase dan panduan singkat penggunaan.

2. **Manajemen Proyek Lokal**:
   - Pembuatan proyek baru dengan validasi nama dan pilihan platform target (Blogger atau WordPress).
   - Penyimpanan proyek lokal menggunakan model skema terstandarisasi JSON v1.0.0.
   - Pemuatan dan pembukaan kembali proyek yang telah disimpan.
   - Penghapusan proyek yang disertai dialog konfirmasi aman untuk mencegah kehilangan data.
   - Ekspor proyek ke file `.json`.
   - Impor proyek dari file `.json` dengan validasi struktur dan pencegahan penimpaan file secara diam-diam.

3. **Top Toolbar & Kontrol Sistem**:
   - Indikator status simpan riil: *Menyimpan...*, *Tersimpan*, *Ada perubahan*, dan *Gagal simpan*.
   - Riwayat **Undo (Ctrl+Z)** dan **Redo (Ctrl+Y)** untuk perubahan komponen dan gaya.
   - Tombol **Simpan (Ctrl+S)**.
   - Tombol **Pratinjau** responsif (Desktop, Tablet 768px, Ponsel 375px).
   - Pengalih viewport kanvas visual.
   - Menu Bantuan & Roadmap.

4. **Visual Editor (Drag-and-Drop Foundation)**:
   - Palet komponen terstruktur: Header, Navigasi, Artikel, Konten, Sidebar, Tombol Aksi (CTA), dan Footer.
   - Kanvas visual interaktif dengan pengurutan letak komponen menggunakan `@dnd-kit/sortable`.
   - Pemilihan komponen untuk diperiksa propertinya.
   - Duplikasi dan penghapusan komponen langsung dari kanvas.
   - **Properties Inspector**: Mengubah judul, subjudul, konten teks, perataan teks, warna latar, warna teks, dan font secara langsung.
   - Pengaturan tema global (warna primer, latar kanvas, font tulisan).

5. **Code Editor (Monaco Editor)**:
   - Integrasi Monaco Editor terpasang langsung di dalam workspace.
   - Tema gelap konsisten (`vs-dark`), penomoran baris, pencarian bawaan, dan pelipatan kode (code folding).
   - Tab penjelajah dokumen:
     - `*-project.json`: Model data proyek aktif.
     - `preview-structure.html`: Dokumen struktur HTML pratinjau.
     - `blogger-template-draft.xml` / `theme.json`: Draf arsitektur masa depan.
   - Penegasan batas arsitektur bahwa file JSON proyek adalah data internal, bukan kode sumber tema jadi.

6. **Arsitektur Khusus Blogger (Persiapan Phase 4)**:
   - Target proyek Blogger Blogspot v2/v3.
   - Definisi struktur hirarki layout XML: `<b:skin>`, `<b:section>`, `<b:widget>`, dan `<b:includable>`.
   - Modul kesiapan ekspor dan contoh cetak biru XML template.

7. **Arsitektur Khusus WordPress (Persiapan Phase 5)**:
   - Target proyek WordPress.
   - Pemisahan konsep Full Site Editing (FSE) Block Theme (`theme.json`, `templates/`, `parts/`) dengan Classic PHP Theme (`style.css`, `functions.php`).
   - Draf konfigurasi `theme.json` v3 yang siap dikembangkan lebih lanjut.

8. **Pengaturan & Diagnostik**:
   - Diagnostik kapasitas penyimpanan lokal terpakai.
   - Fitur pencadangan seluruh proyek ke dalam satu bundel berkas `.json`.
   - Informasi lisensi open-source MIT.

---

## ⚠️ Fitur yang Belum Tersedia di Phase 1 (Transparansi Roadmap)

Sesuai dengan panduan arsitektur yang jujur, fitur berikut dijadwalkan pada fase berikutnya dan **tidak disimulasikan secara palsu** di Phase 1:
- **Phase 4**: Serializer XML Blogger lengkap, validasi DTD Google Blogger, dan ekspor satu-klik berkas `.xml` ke Blogspot.
- **Phase 5**: Kompilator blok Gutenberg, generator berkas PHP Classic Theme, dan pengemasan file `.zip` siap pasang di WordPress.
- **Phase 6**: File tree explorer disk langsung dan sinkronisasi dua arah kode-ke-visual.

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
- **Unit Testing**: Vitest

---

## 📦 Prasyarat Instalasi

1. **Node.js**: Versi 18.x atau lebih baru (direkomendasikan v20 LTS).
2. **npm** atau **pnpm**.
3. **Rust & Cargo** (khusus jika ingin mengompilasi biner desktop native via Tauri):
   - Kunjungi [https://rustup.rs](https://rustup.rs) untuk memasang Rust.
   - Untuk Windows: Pasang Visual Studio C++ Build Tools dan WebView2 Runtime.
   - Untuk Linux (Ubuntu/Debian): `sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget libssl-dev libgtk-3-dev`.

---

## 🛠️ Cara Memasang Dependensi

Jalankan perintah berikut di direktori proyek:
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

## 🔧 Cara Mengatasi Masalah Umum (Troubleshooting)

1. **Port 3000 Sedang Digunakan**:
   - Jika port 3000 telah terpakai oleh proses lain, hentikan proses tersebut atau ubah konfigurasi port pada `vite.config.ts`.
2. **Kompilasi Rust / Tauri Gagal**:
   - Pastikan toolchain Rust Anda sudah mutakhir: `rustup update`.
   - Di Linux, pastikan seluruh pustaka pengembang WebKitGTK telah terpasang.
3. **Penyimpanan Lokal Penuh**:
   - Buka menu **Pengaturan**, lalu unduh cadangan proyek Anda sebelum membersihkan cache peramban.

---

## 🚀 Panduan Mengunggah Phase 1 ke GitHub

1. Inisialisasi git pada repositori lokal:
   ```bash
   git init
   git add .
   git commit -m "feat: release Phase 1 Nusantara Theme Builder"
   ```
2. Buat repositori baru di GitHub bernama `nusantara-theme-builder`.
3. Hubungkan remote dan push branch utama:
   ```bash
   git branch -M main
   git remote add origin https://github.com/USERNAME/nusantara-theme-builder.git
   git push -u origin main
   ```

---

## 🤝 Cara Berkontribusi

Kontribusi dari seluruh pengembang dan kreator Indonesia sangat dinantikan:
1. Fork repositori ini.
2. Buat branch fitur baru (`git checkout -b fitur/nama-fitur`).
3. Pastikan semua unit test lulus (`npm run test` dan `npm run typecheck`).
4. Commit perubahan Anda (`git commit -m 'feat: implementasi fitur baru'`).
5. Push ke branch Anda (`git push origin fitur/nama-fitur`).
6. Buka **Pull Request** ke repositori utama.

---

## 📄 Lisensi

Proyek ini dirilis di bawah naungan **[Lisensi MIT](LICENSE)**. Anda bebas menggunakan, memodifikasi, dan mendistribusikan perangkat lunak ini secara terbuka.
