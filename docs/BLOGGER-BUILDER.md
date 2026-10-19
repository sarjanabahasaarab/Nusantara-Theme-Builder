# Nusantara Theme Builder — Blogger Builder Guide (Phase 4)

Panduan operasional dan arsitektur modul **Blogger Theme Builder** pada Nusantara Theme Builder.

---

## 1. Ikhtisar

Modul **Blogger Builder** memungkinkan pengembang web, perancang antarmuka, dan kreator blog menyusun tema Google Blogger (Blogspot) secara visual maupun kode, memvalidasi struktur dokumen XML v2/v3, mengimpor tema yang sudah ada, serta mengekspor file tema berekstensi `.xml` siap pakai.

---

## 2. Alur Kerja (Workflow)

```
[ Visual Editor / Palette ]
             ↓
[ Blogger Component Mapper ] ─── (Status: Supported / Partial / Unsupported)
             ↓
[ Blogger Theme Generator ] ─── (Settings: Identity, Layout, Appearance, Article, SEO)
             ↓
[ Blogger Theme Validator ] ─── (3 Tingkat: Sintaks, Struktur Template, Kualitas & SEO)
             ↓
[ Blogger Export Service ] ─── (Pemeriksaan Pra-Ekspor, UTF-8 Encoding, Download .xml)
```

---

## 3. Komponen Workspace Blogger Builder

1. **Top Toolbar:**
   - Navigasi kembali ke Dashboard utama.
   - Indikator nama proyek aktif dan target platform Blogger XML.
   - Pilihan viewport responsif: **Desktop** (100% / max-w), **Tablet** (768px), dan **Ponsel** (375px).
   - Tombol **Undo / Redo** terintegrasi riwayat perubahan.
   - Tombol **Template Awal** untuk memuat 5 preset tema Blogger.
   - Tombol **Simpan Proyek** ke penyimpanan lokal aman.
   - Tombol **Validasi XML**, **Impor XML**, dan **Ekspor XML**.

2. **Sidebar Kiri (3 Tab):**
   - **Komponen:** Katalog elemen Blogger (Header, Logo, Navigasi, Area Konten, Daftar Artikel, Artikel Tunggal, Sidebar, Widget Populer/Label, Search Box, Paginasi, Breadcrumb, HTML Khusus).
   - **Struktur:** Pohon hierarki komponen tema dengan indikator dukungan generator (*Didukung Penuh*, *Didukung Sebagian*, *Belum Didukung*) dan kontrol pemindahan posisi (Naik/Turun/Duplikasi/Hapus).
   - **Halaman:** Penjelasan kontekstual halaman Blogger (Beranda, Artikel, Halaman Statis, Arsip, Pencarian, Label) dan ekspresi kondisional (`<b:if cond="...">`).

3. **Kanvas Tengah (Center Canvas):**
   - Simulasi tata letak Blogger responsif dengan bingkai window.
   - Perubahan ukuran viewport kanvas nyata saat memilih Desktop/Tablet/Ponsel.
   - Data artikel contoh yang secara eksplisit ditandai sebagai **Data Pratinjau (Simulasi Blogger)**.
   - Komponen dapat diklik untuk langsung membuka pengaturannya di panel kanan.

4. **Inspector Kanan (Properties Inspector):**
   - Saat komponen dipilih: Menampilkan tab Konten, Gaya, dan info Pemetaan XML Blogger.
   - Saat tidak ada komponen dipilih: Menampilkan tab Pengaturan Global Tema Blogger (Identitas, Tata Letak, Tampilan, Format Artikel, dan SEO Dasar).

---

## 4. Cara Mengimpor Tema Blogger

1. Klik tombol **Impor XML** pada Toolbar atas Blogger Builder.
2. Pilih file `.xml` tema Blogger lama Anda (maksimum ukuran 5 MB).
3. Sistem akan mem-parsing dokumen secara aman tanpa mengeksekusi skrip JavaScript apapun.
4. Ringkasan hasil impor ditampilkan:
   - Jumlah section dan widget yang terdeteksi.
   - Variabel warna yang berhasil diekstrak dari blok `<b:skin>`.
   - Komponen visual yang berhasil dipetakan.
   - Peringatan jika ada widget khusus yang tidak dapat dipetakan secara sempurna.
5. Klik **Terapkan ke Proyek Aktif** untuk mengonversi ke kanvas visual.

---

## 5. Cara Memvalidasi & Memperbaiki Kesalahan

1. Klik tombol **Validasi XML**.
2. Validator 3-tingkat akan memeriksa:
   - **Sintaks XML:** Well-formedness, tag pembuka/penutup, karakter khusus.
   - **Struktur Blogger:** Keberadaan `<b:skin>`, `<b:section>`, widget `type="Blog"`, keunikan ID widget, dan includable `main`.
   - **Kualitas & SEO:** Viewport responsif, tag `<title>`, canonical link, teks alt gambar, dan pemanggilan JS berisiko.
3. Setiap masalah menyertakan tingkat keparahan (*Galat*, *Peringatan*, *Rekomendasi*), lokasi baris/elemen, dan saran perbaikan langsung.

---

## 6. Cara Mengekspor & Mengunggah Tema ke Blogger

1. Klik tombol **Ekspor XML**.
2. Sistem menjalankan pemeriksaan pra-ekspor otomatis.
3. Tentukan nama file (default: `[nama-proyek]-blogger-theme.xml`).
4. Klik **Unduh File .xml** (disimpan dengan encoding UTF-8).
5. **Pemasangan di Blogger:**
   - Masuk ke [blogger.com](https://www.blogger.com).
   - Buka menu **Tema** di bilah kiri.
   - Klik menu titik tiga atau panah di sebelah tombol **Sesuaikan**.
   - Pilih **Pulihkan (Restore)**.
   - Unggah file `.xml` hasil ekspor.
   - *Rekomendasi Keamanan:* Selalu unduh cadangan (*backup*) tema lama Anda sebelum melakukan pemulihan tema baru.
