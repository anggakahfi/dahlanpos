# DahlanPOS - Manual Bug Tracker (Sad Path Exploratory Testing)

Gunakan dokumen ini untuk mencatat bug fungsionalitas yang Anda temukan saat melakukan "Exploratory Testing".
Anda bisa mengisi tabel di bawah ini. Jika ada bug yang butuh segera diperbaiki, sampaikan ke saya (Antigravity).

## Panduan Cepat Setup Testing
Sebelum mulai testing aliran fitur, pastikan database dalam kondisi segar (hanya berisi master data).
Masuk ke terminal di folder `backend/` lalu jalankan perintah:
```bash
go run reset_demo.go
```
*Ini akan membersihkan shift, transaksi, dan log, tapi membiarkan akun, outlet, dan produk tetap ada.*

---

## 🐞 Daftar Bug Ditemukan

| ID | Kategori Skenario | Langkah Reproduksi (Langkah demi Langkah) | Ekspektasi (Seharusnya Bagaimana) | Aktual (Yang Terjadi Saat Ini) | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| BUG-01 | Shift / State | 1. Login kasir <br>2. Buka shift <br>3. Refresh browser (F5) | Aplikasi tetap mengenali bahwa shift sedang aktif untuk kasir tersebut | (Isi hasilnya) | `UNTESTED` |
| BUG-02 | Cart / Pembayaran | 1. Masukkan item $20 <br>2. Klik Bayar Berulang Kali / Double-click | Tombol disable setelah klik pertama, cuma terjadi 1 transaksi | (Isi hasilnya) | `UNTESTED` |
| BUG-03 | Cart / Validasi | 1. Kosongkan keranjang <br>2. Coba paksa klik tombol Bayar | Tombol harusnya ter-disable atau memunculkan error | (Isi hasilnya) | `UNTESTED` |
| BUG-04 | Keamanan Role | 1. Login sebagai Owner <br>2. Ubah URL ke `/cashier` di address bar | Harus diarahkan ke halaman Unauthorized atau dikembalikan ke Dashboard | (Isi hasilnya) | `UNTESTED` |
| BUG-05 | Keamanan Role | 1. Login sebagai Kasir <br>2. Ubah URL ke `/admin/dashboard` | Harus ditolak aksesnya | (Isi hasilnya) | `UNTESTED` |
| BUG-06 | Cart / Ubah Qty | 1. Masukkan kopi <br>2. Ubah Qty ke angka negatif (-1) atau teks | Harus ada validasi minimum angka = 0 = hapus produk | (Isi hasilnya) | `UNTESTED` |
| BUG-07 | ... | (tambahkan bug lain yang Anda temukan di sini) | | | `OPEN` |

---

### Catatan Tambahan saat Testing
*   Fokus pada alur yang bukan _Happy Path_ (misal: masukin nominal bayar kurang dari total, dan lain-lain).
*   Jika layar tiba-tiba "Blank White", biasanya bisa tekan `F12` (Developer Tools) -> `Console` dan ambil screenshot pesan error warna merah.
