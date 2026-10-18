# Nusantara Theme Builder — Phase 3 Documentation

## Advanced Visual Editor, Drag-and-Drop, Component Tree, and Properties Inspector

### 1. Ringkasan Fitur Phase 3
Phase 3 membawa Nusantara Theme Builder ke tingkat perangkat lunak desktop profesional dengan menghadirkan **Visual Editor** berkinerja tinggi yang responsif, modular, dan terhubung langsung ke model data terpadu (single source of truth).

### 2. Arsitektur Empat Area Workspace

#### A. Top Toolbar & Header
- **Logo & Identitas**: Nusantara Theme Builder dengan badge rilis `Phase 3`.
- **Nama & Platform Proyek**: Menampilkan nama proyek aktif, badge target `Blogger` / `WordPress`, serta shortcut File Explorer.
- **Kontrol Viewport Responsif**: Beralih seketika antara tampilan Desktop (100% / max-w-5xl), Tablet (768px), dan Ponsel (375px).
- **Indikator Simpan Riil**: Menampilkan status `Tersimpan` (dengan waktu simpan), `Menyimpan...` (animasi putar), `Ada perubahan` (dirty indicator), dan `Gagal simpan`.
- **Riwayat Perubahan (Undo/Redo)**: Terintegrasi penuh dengan riwayat hingga 25 langkah perubahan, dilengkapi shortcut desktop global (`Ctrl+Z`, `Ctrl+Y`).
- **Simpan & Ekspor**: Tombol simpan ke penyimpanan lokal dan unduh berkas `.ntbproject`.

#### B. Left Sidebar Panel (4 Tab Terpadu)
1. **Tab Komponen (Component Palette)**:
   - Pencarian komponen seketika berdasarkan nama dan deskripsi.
   - Filter kategori: Semua, Tata Letak, Kop / Header, Navigasi, Artikel & Blog, Konten, Media, Aksi & CTA, Sidebar, Footer.
   - Katalog 13 komponen visual kaya:
     - Header Judul / Masthead
     - Hero Banner Pikat
     - Menu Navigasi
     - Artikel / Posting Blog
     - Grid Berita / Postingan
     - Blok Teks & Informasi
     - Media Gambar / Spanduk Foto
     - Kutipan & Testimoni
     - Kolom Fitur Unggulan
     - Tombol Aksi (CTA)
     - Kotak Buletin Berlangganan
     - Sidebar Widget Pendukung
     - Footer Hak Cipta & Tautan
   - Tombol cepat `+` untuk menambahkan komponen ke halaman aktif.
2. **Tab Struktur (Component Tree)**:
   - Visualisasi hierarki pohon komponen pada halaman yang aktif.
   - Penyorotan sinkron saat komponen dipilih di kanvas.
   - Tombol aksi pada tiap node: Pindah ke Atas (▲), Pindah ke Bawah (▼), Duplikasi (⧉), dan Hapus (🗑).
3. **Tab Aset (Project Assets Integration)**:
   - Terhubung langsung dengan aset Phase 2 di penyimpanan lokal.
   - Pratinjau gambar, nama berkas, ukuran, dan format.
   - Tombol `Terapkan`: Menyisipkan URL aset ke komponen aktif (misal foto artikel, hero banner, atau spanduk gambar).
   - Tombol `Gambar Baru`: Membuat komponen gambar baru di kanvas secara instan menggunakan aset terpilih.
   - Kotak unggah gambar lokal langsung dari editor.
4. **Tab Halaman (Pages Management)**:
   - Pengelolaan multi-halaman proyek (`currentProject.pages`).
   - Penanda halaman Beranda / Home.
   - Formulir pembuatan halaman baru (Judul, slug URL, status beranda).
   - Edit judul & slug halaman.
   - Hapus halaman dengan pengaman pencegahan penghapusan halaman tunggal.

#### C. Center Canvas Workspace
- **Latar Kanvas Netral Desktop**: Pola grid bertitik halus untuk fokus visual maksimal.
- **Top Canvas Bar**:
  - Pemilih dropdown halaman aktif.
  - Pengatur skala Zoom: `Zoom Out (-)`, `50%`, `75%`, `100%`, `125%`, `Zoom In (+)`, dan tombol Reset ke 100%.
  - Indikator dimensi kanvas nyata.
- **Sistem Drag-and-Drop (@dnd-kit/sortable)**:
  - Pengurutan vertikal yang mulus dengan pegangan seret (grip handle).
  - Indikator transparansi saat diseret.
- **Perenderan Komponen Tingkat Tinggi**:
  - Menerapkan warna latar, warna teks, padding, margin, perataan teks, lengkungan sudut (border radius), dan bayangan (shadow) secara langsung.
  - Bilah tindakan mengambang pada komponen aktif:
    - Label & tipe komponen.
    - Naik (▲), Turun (▼), Duplikasi (⧉), Hapus (🗑).
- **Empty Canvas Dropzone**: Pilihan cepat starter komponen saat halaman baru dibuat kosong.

#### D. Right Sidebar (Properties Inspector)
- **Saat Komponen Dipilih**:
  - Sub-tab **Konten**: Mengatur judul, subjudul, paragraf, penulis, tanggal, takarir gambar, teks & URL tombol, serta pengelola daftar menu navigasi.
  - Sub-tab **Gaya**: Pemilih warna latar & teks (color picker + hex), perataan teks (kiri, tengah, kanan, justify), preset padding, lengkungan sudut, dan bayangan.
  - Sub-tab **Lanjutan**: Informasi pemetaan arsitektur Blogger XML (`<b:widget>`) atau WordPress Gutenberg block (`<!-- wp:... -->`), kelas CSS kustom, dan tombol Reset Gaya ke Default.
  - Modal Pemilih Aset (`AssetPickerModal`): Terbuka langsung dari input gambar untuk memilih gambar proyek secara visual.
- **Saat Tidak Ada Komponen Dipilih**:
  - Menampilkan **Pengaturan Halaman Aktif**: Judul halaman dan slug URL.
  - Menampilkan **Pengaturan Global Tema**: Warna utama (primary accent), warna latar kanvas, warna teks, font sans utama, dan batas lebar kontainer (sm, md, lg, xl, 2xl, full).

### 3. Pengujian Kualitas (Testing & QA)
- 10 berkas pengujian unit dengan 52 skenario pengujian telah dijalankan dan lulus 100% (`vitest run`):
  - `tests/unit/visual-editor-phase3.test.ts` (7 skenario: katalog komponen, penambahan komponen, duplikasi, pemindahan posisi, reset gaya, multi-halaman, batas zoom kanvas).
  - Serta 45 pengujian dari Phase 1 & 2 tetap lulus tanpa regresi.
