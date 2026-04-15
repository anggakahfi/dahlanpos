# Dokumen Kebutuhan Fungsional (Functional Requirement) — Small Things Coffee POS

## 1. Pendahuluan
Small Things Coffee POS adalah sistem Point of Sale multi-outlet yang dirancang untuk bisnis makanan dan minuman (F&B). Sistem ini menyediakan manajemen terpusat melalui modul Backoffice dan operasional lokal melalui modul Kasir.

---

## 2. Peran Pengguna & Kontrol Akses

| ID | Peran Pengguna | Deskripsi Hak Akses |
|:---|:---|:---|
| R1 | **Pemilik (Owner)** | Memiliki akses penuh ke modul Backoffice dan Kasir. Dapat mengelola semua outlet, karyawan, dan pengaturan global. Dapat melihat laporan dari seluruh cabang. |
| R2 | **Kasir (Cashier)** | Akses terbatas hanya pada modul Kasir. Terkunci pada outlet tertentu yang ditugaskan. Dapat melakukan penjualan, mengelola shift, dan melihat riwayat transaksi lokal. |

---

## 3. Modul 1: Autentikasi & Otorisasi

| ID | Fitur | Deskripsi Kebutuhan Fungsional |
|:---|:---|:---|
| F1.1 | Login OAuth | Pengguna wajib melakukan autentikasi menggunakan Google OAuth (Single Sign-On). |
| F1.2 | Verifikasi Email | Sistem memverifikasi apakah email Google terdaftar dalam basis data karyawan. Akses ditolak jika email tidak terdaftar atau status akun "nonaktif". |
| F1.3 | Manajemen Sesi | Login yang berhasil akan menerbitkan JWT (JSON Web Token) berbasis peran. |
| F1.4 | Multi-Sesi | Sistem mendukung "Multi-Session" yang memungkinkan pemilik tetap login sebagai owner sambil menggunakan slot kasir di browser yang sama. |

---

## 4. Modul 2: Backoffice (Manajemen)

| ID | Fitur | Deskripsi Kebutuhan Fungsional |
|:---|:---|:---|
| F2.1 | Ringkasan Dashboard | Melihat metrik penjualan real-time (Pendapatan, Transaksi, Rata-rata Pesanan) dengan filter outlet atau rentang tanggal. |
| F2.2 | Manajemen Kategori | Operasi CRUD untuk pengelompokan produk (contoh: Kopi, Makanan Ringan). |
| F2.3 | Manajemen Modifikator | Membuat grup (contoh: Ukuran, Tingkat Gula) dan opsi modifikator (contoh: Large +5000). |
| F2.4 | Manajemen Produk | Membuat/memperbarui produk dengan nama, harga, kategori, stok, dan unggah gambar ke Cloudinary. |
| F2.5 | Manajemen Karyawan | Mendaftarkan email karyawan, menetapkan peran, dan mengatur status aktif/nonaktif untuk mencabut akses secara instan. |
| F2.6 | Log Aktivitas | Melihat catatan audit detail dari tindakan yang dilakukan oleh karyawan. |
| F2.7 | Manajemen Outlet | Membuat dan mengelola lokasi cabang fisik (Nama, Alamat, Telepon). |
| F2.8 | Laporan Transaksi | Daftar lengkap semua penjualan dengan filter tanggal, outlet, dan metode pembayaran. |
| F2.9 | Laporan Shift | Melacak kinerja kasir, perbandingan uang tunai sistem vs aktual, dan catatan selisih. |
| F2.10| Pengaturan Sistem | Mengatur metode pembayaran (Tunai/QRIS), logo struk, teks header/footer, dan konfigurasi pajak. |

---

## 5. Modul 3: Kasir (Operasional)

| ID | Fitur | Deskripsi Kebutuhan Fungsional |
|:---|:---|:---|
| F3.1 | Buka Shift (Open Shift) | Kasir wajib memasukkan jumlah modal awal sebelum dapat melakukan penjualan. |
| F3.2 | Ringkasan Shift Aktif | Melihat rincian penjualan berjalan (Tunai vs QRIS) selama shift berlangsung. |
| F3.3 | Tutup Shift (Close Shift) | Kasir memasukkan uang tunai akhir dan catatan selisih jika jumlahnya tidak sesuai dengan ekspektasi sistem. |
| F3.4 | Navigasi Menu | Menjelajahi produk berdasarkan tab kategori yang tersedia. |
| F3.5 | Manajemen Keranjang | Menambah produk ke keranjang, menyesuaikan jumlah, atau menghapus item. |
| F3.6 | Modifikator Pesanan | Menampilkan pilihan kustomisasi (contoh: Topping, Ukuran) jika produk memiliki modifikator. |
| F3.7 | Pembayaran Tunai | Menangani transaksi menggunakan uang tunai standar. |
| F3.8 | Pembayaran QRIS | Mode verifikasi manual (Kasir memverifikasi layar pembayaran pelanggan secara fisik lalu mengonfirmasi di POS). |
| F3.9 | Otomasi Stok | Mengurangi stok produk secara otomatis segera setelah pembayaran berhasil. |
| F3.10| Struk Transaksi | Menghasilkan struk digital dengan opsi cetak atau dilihat melalui link QR code publik. |
| F3.11| Riwayat Transaksi | Melihat daftar transaksi terbaru di outlet tersebut dan melakukan pembatalan (void). |

---

## 6. Logika Sistem & Batasan

| ID | Logika / Batasan | Deskripsi |
|:---|:---|:---|
| L1 | Isolasi Multi-Outlet | Transaksi dan shift bersifat silo (terpisah) secara ketat berdasarkan outlet masing-masing. |
| L2 | Integritas Stok | Sistem mencegah pembayaran jika stok tidak mencukupi (jika pelacakan stok diaktifkan). |
| L3 | Persistensi Data | Semua catatan transaksi dan shift bersifat permanen; hanya pembatalan (void) yang diizinkan untuk transaksi (meninggalkan jejak audit). |
