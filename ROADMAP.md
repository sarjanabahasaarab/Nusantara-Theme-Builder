# Roadmap 10 Fase — Nusantara Theme Builder

Nusantara Theme Builder dikembangkan secara bertahap melalui 10 fase terstruktur untuk memastikan kestabilan kode, keamanan sistem, dan arsitektur yang dapat diperluas tanpa penulisan ulang (rewrite).

---

## Ringkasan Roadmap

### Phase 1 — Fondasi Aplikasi Desktop, Dashboard, dan Editor Dasar [SELESAI]
- Inisialisasi arsitektur Tauri 2 (Rust) + React 19 + TypeScript + Tailwind CSS.
- Sistem manajemen proyek lokal (format JSON v1.0.0 dengan validasi skema ketat).
- Top Toolbar interaktif dengan riwayat Undo/Redo dan status simpan riil.
- Dashboard profesional: metrik penyimpanan, starter templates, dan daftar proyek.
- Fondasi Visual Editor dengan `@dnd-kit/sortable` untuk penataan ulang komponen.
- Integrasi Monaco Editor dengan tema konsisten, nomor baris, dan penyorotan sintaks multi-bahasa.
- Modul arsitektur awal Blogger dan WordPress dengan transparansi kesiapan ekspor.
- Pengujian unit otomatis (Vitest) untuk validasi, serialisasi, storage, dan undo/redo.

---

### Phase 2 — Manajemen Proyek Lanjutan, Multi-Page, dan Aset Media
- Navigasi multi-halaman per proyek (Beranda, Arsip, Halaman Tunggal, Kontak).
- Pengelola aset lokal (gambar tema, ikon SVG, file CSS kustom, dan font).
- Sistem tag dan pengelompokan tema.
- Duplikasi proyek dan ekspor bundel arsip lokal.

---

### Phase 3 — Visual Editor Drag-and-Drop Lanjutan & Component Tree
- Pohon hirarki komponen visual (Component Tree view).
- Nesting komponen (wadah/kontainer di dalam komponen).
- Pengaturan breakpoint visual responsif (Desktop, Tablet, Mobile) per properti gaya.
- Palet komponen tingkat lanjut (Slider, Grid dinamis, Modal, Accordion).

---

### Phase 4 — Blogger Builder, XML Generator, & Validator Blogspot
- Kompilator layout komponen ke XML Template Blogger valid v2/v3.
- Serializer `<b:skin>`, variabel CSS dinamis Blogger, dan font Blogger.
- Pembangun seksi `<b:section>` dan pemetaan widget bawaan (`Header`, `Blog`, `FeaturedPost`, `PopularPosts`, `HTML`).
- Validator XML Well-Formedness dan kepatuhan DTD Google Blogger.
- Ekspor berkas `.xml` sekali klik yang siap diunggah ke dashboard Blogspot.

---

### Phase 5 — WordPress Builder, Full Site Editing (FSE), & ZIP Packager
- Generator `theme.json` v3 terkompilasi sesuai standar WordPress 6.x+.
- Generator berkas HTML Block Theme (`templates/` dan `parts/`).
- Dukungan Classic Theme (penyusunan `style.css`, `functions.php`, dan `index.php`).
- Pengemas berkas ZIP tema secara lokal tanpa ketergantungan server luar.
- Validasi struktur tema WordPress untuk memastikan kelulusan Theme Check.

---

### Phase 6 — Code Editor Lanjutan & Integrasi Model Dua Arah
- File explorer pohon berkas lengkap di dalam Code Editor.
- Pencarian dan penggantian teks global (Global Search & Replace).
- Sinkronisasi dua arah yang aman antara properti visual dan potongan kode tema.
- Diff viewer untuk membandingkan perubahan antar-versi simpanan.

---

### Phase 7 — Pratinjau Responsif Dinamis & Desain Tema Visual
- Kanvas pratinjau interaktif dengan viewport live-resizing.
- Generator skema warna harmonis (Color Palette Generator).
- Integrasi Google Fonts lokal tanpa pelacakan pengguna.
- Pratinjau mode gelap (Dark Mode) dan mode terang (Light Mode) berdampingan.

---

### Phase 8 — Komponen Lanjutan, SEO, Aksesibilitas, & Validasi Kualitas
- Pemeriksa aksesibilitas otomatis (WCAG 2.1 AA checklist).
- Generator tag meta SEO, OpenGraph, Twitter Cards, dan Schema.org JSON-LD.
- Analisis performa beban CSS/HTML dan rekomendasi optimasi.

---

### Phase 9 — Pengujian Integrasi, Keamanan, & CI/CD Lintas Platform
- Pengujian otomatis end-to-end (E2E) antarmuka desktop.
- Audit keamanan dependensi dan kepatuhan izin Tauri.
- Alur kerja GitHub Actions untuk kompilasi otomatis lintas platform (Windows, macOS, Linux).

---

### Phase 10 — Paket Installer, Rilis Open-Source, & Dokumentasi Pengguna
- Pembuatan installer native (`.msi` / `.exe` untuk Windows, `.dmg` untuk macOS, `.deb` / `.AppImage` untuk Linux).
- Panduan lengkap pengguna akhir berbahasa Indonesia.
- Portal dokumentasi komunitas dan rilis publik v1.0.0 di GitHub.
