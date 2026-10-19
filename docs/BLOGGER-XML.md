# Nusantara Theme Builder — Blogger XML Specification (Phase 4)

Spesifikasi teknis format XML Google Blogger Blogspot v2/v3 yang dihasilkan oleh Nusantara Theme Builder.

---

## 1. Deklarasi Dokumen & Namespace

Dokumen XML tema yang valid menggunakan deklarasi HTML5 dan namespace resmi Google Blogger:

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html>
<html b:css='false' b:responsive='true' b:version='2' class='v2' expr:dir='data:blog.languageDirection' xmlns='http://www.w3.org/1999/xhtml' xmlns:b='http://www.google.com/2005/gml/b' xmlns:data='http://www.google.com/2005/gml/data' xmlns:expr='http://www.google.com/2005/gml/expr'>
```

### Namespace:
- `xmlns='http://www.w3.org/1999/xhtml'`: Namespace XHTML standar.
- `xmlns:b='http://www.google.com/2005/gml/b'`: Namespace elemen struktural Blogger (`<b:skin>`, `<b:section>`, `<b:widget>`, `<b:includable>`, `<b:include>`, `<b:loop>`, `<b:if>`).
- `xmlns:data='http://www.google.com/2005/gml/data'`: Namespace penyedia data Blogger (`<data:blog.title/>`, `<data:post.body/>`).
- `xmlns:expr='http://www.google.com/2005/gml/expr'`: Namespace evaluasi atribut dinamis (`expr:href="..."`, `expr:alt="..."`).

---

## 2. Struktur Elemen Kunci

### A. `<b:skin>`
Elemen pembungkus stylesheet CSS yang didefinisikan dengan blok `<![CDATA[ ... ]]>`.
Di dalamnya, Nusantara Theme Builder mendeklarasikan variabel CSS modern pada `:root`:
- `--primary-color`
- `--secondary-color`
- `--bg-color`
- `--text-color`
- `--surface-color`
- `--border-color`
- `--font-sans`
- `--max-container`

### B. `<b:section>`
Wadah penampung widget. Atribut penting:
- `id`: Pengenal unik section (misal: `header-section`, `main-section`, `sidebar-section`, `footer-section`).
- `maxwidgets`: Batas jumlah widget yang diizinkan di dalam section.
- `showaddelement`: Menentukan apakah tombol "Tambahkan Gadget" muncul di dashboard Blogger (`yes` atau `no`).

### C. `<b:widget>`
Elemen fungsional Blogger. Atribut:
- `id`: Pengenal unik widget (misal: `Header1`, `Blog1`, `PageList1`, `Attribution1`, `PopularPosts1`, `Label1`, `HTML1`).
- `type`: Jenis widget resmi Blogger (`Header`, `Blog`, `PageList`, `Attribution`, `PopularPosts`, `Label`, `BlogSearch`, `HTML`).
- `locked`: Menentukan apakah widget dapat dipindahkan/dihapus di dashboard tata letak Blogger (`true` atau `false`).
- `title`: Judul widget yang ditampilkan.

### D. `<b:includable>` dan `<b:include>`
Sub-rutin penampil konten widget:
- `id='main'`: Includable wajib sebagai titik masuk rendering.
- `id='post'`: Includable perulangan artikel individual.
- `id='nextprev'`: Includable paginasi halaman.

---

## 3. Aturan Escaping Karakter Khusus

Untuk menjamin well-formedness XML:
- Tanda ampersand `&` di-escape menjadi `&amp;`.
- Kurung sudut buka `<` di-escape menjadi `&lt;`.
- Kurung sudut tutup `>` di-escape menjadi `&gt;`.
- Tanda kutip dua `"` di-escape menjadi `&quot;`.
- Tanda kutip satu `'` di-escape menjadi `&apos;`.
- Karakter Unicode (Aksara Nusantara, huruf vokal beraksen, simbol em-dash `—`) dipertahankan secara utuh dalam encoding UTF-8 tanpa merusak pembacaan parser.

---

## 4. Batasan Kompatibilitas

- Komponen visual non-bawaan Blogger (seperti Hero Banner kompleks, CTA promo, atau Testimonial Slider) dipetakan sebagai widget `HTML` tersanitasi.
- Form newsletter diintegrasikan sebagai form HTML statis atau form pihak ketiga karena Blogger tidak mengelola database pelanggan email mandiri.
