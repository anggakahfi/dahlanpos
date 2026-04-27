# Dokumen Kebutuhan Fungsional (Functional Requirement) — Small Things Coffee POS

## 1. Pendahuluan

Small Things Coffee POS (DahlanPOS) adalah sistem Point of Sale multi-outlet berbasis web yang dirancang untuk bisnis makanan dan minuman (F&B). Sistem ini menyediakan manajemen terpusat melalui modul **Backoffice** untuk pemilik usaha dan operasional harian melalui modul **Kasir** untuk staf di outlet. Seluruh fitur diakses melalui browser tanpa instalasi aplikasi tambahan.

---

## 2. Peran Pengguna & Kontrol Akses (RBAC)

| ID | Peran Pengguna | Deskripsi Hak Akses | Enforced By |
|:---|:---|:---|:---|
| R1 | **Pemilik (Owner)** | Memiliki akses penuh ke modul Backoffice. Dapat mengelola seluruh outlet, karyawan, produk, pengaturan global, dan melihat laporan konsolidasi dari semua cabang. Dapat juga mengakses modul Kasir secara bersamaan melalui mekanisme Multi-Sesi. | JWT claim `role=owner` + middleware `RequireRole("owner")` |
| R2 | **Kasir (Cashier)** | Akses terbatas hanya pada modul Kasir. Terikat pada satu outlet spesifik yang ditetapkan melalui field `outlet_id` di tabel `users`. Dapat melakukan penjualan, mengelola shift, melihat riwayat transaksi outlet sendiri, dan melakukan void. | JWT claim `role=cashier` + auto-filter `outlet_id` dari JWT |

### 2.1 Matriks Akses Endpoint

| Endpoint Group | Owner | Cashier | Public |
|:---|:---:|:---:|:---:|
| `POST /auth/login/oauth` | ✅ | ✅ | ✅ |
| `POST /auth/logout` | ✅ | ✅ | ❌ |
| `GET /cashier/*` | ✅ | ✅ | ❌ |
| `POST /cashier/*` | ✅ | ✅ | ❌ |
| `GET /backoffice/*` | ✅ | ❌ | ❌ |
| `POST/PUT/PATCH/DELETE /backoffice/*` | ✅ | ❌ | ❌ |
| `GET /public/receipts/:id` | ✅ | ✅ | ✅ |

---

## 3. Modul 1: Autentikasi & Otorisasi

| ID | Fitur | Deskripsi Kebutuhan Fungsional | Validasi di Kode |
|:---|:---|:---|:---|
| F1.1 | **Login OAuth (Google SSO)** | Pengguna wajib melakukan autentikasi menggunakan Google OAuth. Backend memvalidasi Google ID Token melalui library `google.golang.org/api/idtoken`, kemudian mengekstrak email dari payload token. | `auth_usecase.go:LoginWithOAuth()` |
| F1.2 | **Verifikasi Email Terdaftar** | Sistem memeriksa apakah email yang diekstrak dari token Google sudah terdaftar di tabel `users`. Jika email tidak ditemukan, login ditolak dengan pesan *"email tidak terdaftar di sistem"*. | `auth_usecase.go:64-67` |
| F1.3 | **Validasi Status Aktif** | Meskipun email terdaftar, login akan ditolak jika status akun pengguna adalah `inactive`. Pesan error: *"akun anda dinonaktifkan, hubungi owner"*. Ini memungkinkan owner menonaktifkan akses secara instan tanpa menghapus data karyawan. | `auth_usecase.go:69-71` |
| F1.4 | **Penerbitan JWT Berbasis Peran** | Login yang berhasil menerbitkan JWT (JSON Web Token) dengan algoritma HS256. Token memuat `user_id`, `email`, `role`, dan `outlet_id` (nullable untuk owner). Masa berlaku: **24 jam**. | `auth_usecase.go:73-91` |
| F1.5 | **Multi-Sesi Browser** | Frontend mendukung dua slot sesi independen di localStorage (`auth_token_owner` dan `auth_token_cashier`), memungkinkan pemilik login sebagai Owner di tab Backoffice dan sebagai Cashier di tab Kasir secara bersamaan tanpa saling menimpa. | `api.ts:setAuthSession()` |
| F1.6 | **Pencatatan Aktivitas Login** | Setiap login yang berhasil secara otomatis mencatat entri ke tabel `activity_logs` dengan tipe `login`. | `auth_usecase.go:94-99` |
| F1.7 | **Logout dengan Invalidasi Sesi** | Endpoint logout menghapus token dari sisi klien. Frontend mendukung logout per-role (hanya menghapus sesi owner ATAU cashier) maupun full logout. | `api.ts:logout()`, `clearAuthSession()` |

---

## 4. Modul 2: Backoffice (Manajemen — Khusus Owner)

Seluruh endpoint backoffice dilindungi oleh middleware `AuthMiddleware` + `RequireRole("owner")`. Kasir yang mencoba mengakses endpoint ini akan menerima HTTP 403 Forbidden.

### 4.1 Dashboard & Analitik

| ID | Fitur | Deskripsi Kebutuhan Fungsional | Validasi di Kode |
|:---|:---|:---|:---|
| F2.1 | **Ringkasan KPI** | Menampilkan metrik real-time: **Total Pendapatan**, **Jumlah Transaksi**, **Transaksi Void**, **Rata-rata Nilai Pesanan**, serta breakdown per metode pembayaran (Tunai & QRIS count/amount). Dapat difilter berdasarkan outlet dan rentang tanggal. | `dashboard_usecase.go:GetSummary()` |
| F2.2 | **Perbandingan Periode** | Menghitung persentase perubahan (Δ%) metrik dibandingkan periode sebelumnya (revenue, transactions, avg order). Ditampilkan sebagai indikator naik/turun di dashboard. | `dashboard_usecase.go:calcPctChange()` |
| F2.3 | **Grafik Pendapatan Harian** | Menyediakan data pendapatan per hari untuk visualisasi tren penjualan dalam rentang tanggal terpilih. | `DashboardRepository.GetDailyRevenue()` |
| F2.4 | **Grafik Pendapatan Per Jam** | Menyediakan data pendapatan per jam untuk mengidentifikasi jam sibuk operasional. | `DashboardRepository.GetHourlyRevenue()` |
| F2.5 | **Top 10 Produk Terlaris** | Menampilkan daftar produk dengan penjualan terbanyak berdasarkan kuantitas dan total revenue. | `DashboardRepository.GetTopItems()` |
| F2.6 | **Peringatan Stok Rendah** | Menampilkan daftar produk yang stoknya di bawah `low_stock_threshold` yang ditetapkan masing-masing produk. | `DashboardRepository.GetLowStockItems()` |

### 4.2 Katalog Produk

| ID | Fitur | Deskripsi Kebutuhan Fungsional | Validasi di Kode |
|:---|:---|:---|:---|
| F2.7 | **Manajemen Kategori (CRUD)** | Operasi CRUD untuk pengelompokan produk (contoh: Kopi, Non-Coffee, Pastry). Tabel `categories` dengan field `id` dan `name`. | `category_usecase.go`, endpoint `/backoffice/categories` |
| F2.8 | **Manajemen Modifikator (CRUD)** | Membuat grup modifikator (contoh: Ukuran, Tingkat Gula) dengan opsi (contoh: Regular +0, Large +5000). Setiap grup memiliki flag `required` yang menentukan apakah kasir wajib memilih opsi sebelum checkout. Opsi memiliki `price_impact` dan `sort_order`. | `modifier_usecase.go`, tabel `modifier_groups` + `modifier_options` |
| F2.9 | **Manajemen Produk (CRUD)** | Membuat/memperbarui produk dengan atribut: `name`, `price`, `category_id`, `stock`, `unit` (pcs/kg/liter/porsi/cup), `low_stock_threshold`, `description`, `image_url`, `is_active`, `is_favorite`. Mendukung penautan produk ke satu atau lebih modifier group melalui tabel pivot `product_modifier_groups`. | `product_usecase.go`, endpoint `/backoffice/products` |
| F2.10 | **Unggah Gambar Produk** | Endpoint upload gambar yang menerima file dan mengembalikan URL yang dapat digunakan untuk field `image_url` produk. Integrasi Cloudinary untuk penyimpanan cloud. | `BackofficeHandler.UploadImage()`, endpoint `POST /backoffice/upload` |
| F2.11 | **Manajemen Stok Manual** | Owner dapat menyesuaikan stok produk secara absolut (set ke nilai tertentu) melalui endpoint PATCH `/products/:id/stock`. Terpisah dari pengurangan otomatis saat transaksi. | `product_usecase.go:SetAbsoluteStock()` |

### 4.3 Manajemen SDM & Outlet

| ID | Fitur | Deskripsi Kebutuhan Fungsional | Validasi di Kode |
|:---|:---|:---|:---|
| F2.12 | **Manajemen Karyawan (CRUD)** | Mendaftarkan karyawan baru dengan `name`, `email` (unik), `role` (owner/cashier), dan `outlet_id` (wajib untuk cashier). Email yang didaftarkan adalah email Google yang akan digunakan untuk login OAuth. | `employee_usecase.go:Create()` |
| F2.13 | **Toggle Status Karyawan** | Mengubah status karyawan antara `active` dan `inactive` melalui endpoint PATCH. Karyawan inactive tidak dapat login (ditolak di F1.3). Ini adalah mekanisme pencabutan akses instan. | `employee_usecase.go:UpdateStatus()` |
| F2.14 | **Email Onboarding Otomatis** | Saat karyawan baru dibuat dan API key Resend tersedia, sistem secara asinkron mengirim email selamat datang berisi instruksi login. | `employee_usecase.go:sendWelcomeEmail()` |
| F2.15 | **Log Aktivitas** | Melihat catatan audit dari tindakan karyawan. Setiap log berisi: `user_id`, `outlet_id`, `activity_type` (login/logout/start_shift/end_shift/transaction), `details`, dan `created_at`. Mendukung filter dan pagination. | `employee_usecase.go:ListActivityLogs()`, tabel `activity_logs` |
| F2.16 | **Manajemen Outlet (CRUD)** | Membuat dan mengelola lokasi cabang fisik: `name`, `address`, `phone`, `email`, `open_time`, `close_time`, `status` (active/inactive). Field `open_time` dan `close_time` digunakan untuk validasi jam operasional shift. | `outlet_usecase.go`, tabel `outlets` |
| F2.17 | **Toggle Status Outlet** | Mengubah status outlet antara `active` dan `inactive` melalui endpoint PATCH. | `outlet_usecase.go:UpdateStatus()` |

### 4.4 Laporan & Pengaturan

| ID | Fitur | Deskripsi Kebutuhan Fungsional | Validasi di Kode |
|:---|:---|:---|:---|
| F2.18 | **Laporan Transaksi** | Daftar lengkap semua penjualan dengan filter: rentang tanggal, outlet, metode pembayaran, dan pencarian berdasarkan order_id. Menyertakan total revenue pada response metadata. Mendukung pagination. | Endpoint `GET /backoffice/reports/transactions` |
| F2.19 | **Laporan Shift** | Melacak seluruh shift kasir dengan informasi: waktu buka/tutup, durasi, modal awal, uang kas akhir, expected cash, selisih (discrepancy), breakdown tunai vs QRIS, dan catatan selisih. Filter: outlet, kasir, rentang tanggal. | Endpoint `GET /backoffice/reports/shifts` |
| F2.20 | **Detail Ringkasan Shift** | Melihat ringkasan agregat untuk shift spesifik: total penjualan, jumlah transaksi, breakdown tunai/QRIS, total void, dan expected cash. | Endpoint `GET /backoffice/reports/shifts/:id/summary` |
| F2.21 | **Pengaturan Pembayaran** | Mengatur metode pembayaran yang tersedia di kasir: `cash_enabled` dan `qris_enabled` (boolean). | `settings.go:SettingsPayment` |
| F2.22 | **Pengaturan Pajak** | Mengatur konfigurasi pajak: `enabled` (on/off), `rate` (persentase), `name` (nama pajak), `type` (exclusive/inclusive). | `settings.go:SettingsTax` |
| F2.23 | **Pengaturan Struk** | Mengatur tampilan struk: `logo_url`, `header_text`, `footer_message`, dan `show_tax_breakdown` (tampilkan rincian pajak di struk). | `settings.go:SettingsReceipt` |

---

## 5. Modul 3: Kasir (Operasional Harian)

Seluruh endpoint kasir dilindungi oleh middleware `AuthMiddleware`. Akses terbuka untuk role `owner` dan `cashier`. Data transaksi dan riwayat di-filter otomatis berdasarkan `outlet_id` dari JWT claims untuk kasir.

### 5.1 Manajemen Shift

| ID | Fitur | Deskripsi Kebutuhan Fungsional | Validasi di Kode |
|:---|:---|:---|:---|
| F3.1 | **Buka Shift (Open Shift)** | Kasir wajib memasukkan `outlet_id` dan jumlah `starting_cash` (≥ 0) sebelum dapat melakukan penjualan. Sistem memvalidasi: (a) tidak ada shift aktif lain milik user yang sama, (b) outlet berada dalam jam operasional (`open_time`–`close_time`). Membuat entri di tabel `shifts` dengan status `open`. | `shift_usecase.go:OpenShift()` |
| F3.2 | **Validasi Shift Tunggal** | Setiap kasir hanya boleh memiliki **satu shift aktif** pada satu waktu. Percobaan membuka shift kedua ditolak dengan pesan *"anda masih memiliki shift aktif"*. | `shift_usecase.go:38-41` |
| F3.3 | **Ringkasan Shift Aktif** | Melihat ringkasan real-time selama shift berlangsung: total penjualan, jumlah transaksi, breakdown tunai vs QRIS (jumlah & nominal), total void, modal awal, dan expected cash. | `shift_usecase.go:GetShiftSummary()` |
| F3.4 | **Tutup Shift (Close Shift)** | Kasir memasukkan `ending_cash` dan `discrepancy_note` (opsional). Sistem menghitung: `expected_cash = starting_cash + total_cash_sales`, `discrepancy = ending_cash - expected_cash`. Validasi kepemilikan shift: kasir hanya bisa menutup shift miliknya sendiri. | `shift_usecase.go:CloseShift()` |

### 5.2 Menu & Keranjang

| ID | Fitur | Deskripsi Kebutuhan Fungsional | Validasi di Kode |
|:---|:---|:---|:---|
| F3.5 | **Navigasi Menu** | Menampilkan seluruh produk aktif (`is_active=true`) beserta kategori dan modifier group yang terhubung. Data dimuat melalui satu endpoint `/cashier/menu` yang mengembalikan `categories`, `items`, dan `modifier_groups`. | `cashier_usecase.go:GetMenu()` |
| F3.6 | **Manajemen Keranjang (Cart)** | State management keranjang menggunakan Zustand (global store). Mendukung: tambah item (dengan deteksi duplikat berdasarkan produk + modifier signature), ubah kuantitas, hapus item, dan bersihkan keranjang. Kuantitas dibatasi oleh stok tersedia di sisi klien. | `useCartStore.ts` |
| F3.7 | **Modifikator Pesanan** | Saat menambahkan produk yang memiliki modifier group, sistem menampilkan dialog pilihan kustomisasi. Modifier yang dipilih mengubah harga item (`price_impact`). Signature modifier digunakan untuk mendeteksi item duplikat di keranjang. | `item-modifier-dialog.tsx` |

### 5.3 Checkout & Pembayaran

| ID | Fitur | Deskripsi Kebutuhan Fungsional | Validasi di Kode |
|:---|:---|:---|:---|
| F3.8 | **Pembayaran Tunai** | Menangani transaksi tunai. Frontend menghitung kembalian. Backend menerima payload transaksi lengkap termasuk `payment_method: "cash"`. | Endpoint `POST /cashier/transactions` |
| F3.9 | **Pembayaran QRIS** | Mode verifikasi manual: kasir secara visual mengonfirmasi bahwa pembayaran dari pelanggan sudah masuk, lalu mengonfirmasi di POS. **Tidak ada integrasi payment gateway otomatis.** Backend menerima `payment_method: "qris"`. | Endpoint `POST /cashier/transactions` |
| F3.10 | **Validasi Shift Sebelum Transaksi** | Sebelum membuat transaksi, sistem memvalidasi: (a) shift masih berstatus `open`, (b) shift belum melewati batas waktu operasional outlet (dengan toleransi 30 menit). | `transaction_usecase.go:26-43` |
| F3.11 | **Pengurangan Stok Atomik** | Stok produk dikurangi secara atomik dalam database transaction yang sama dengan pembuatan transaksi. Menggunakan `UPDATE ... WHERE stock >= $1` untuk mencegah stok negatif. Jika stok tidak mencukupi, seluruh transaksi di-rollback. | `transaction_repo.go:84-96` |
| F3.12 | **Pembuatan Order ID Unik** | Order ID dihasilkan otomatis dengan format `ORD-{OUTLET_PREFIX}-{YYYYMMDD}-{SEQ}`. Menggunakan PostgreSQL advisory lock per-outlet untuk mencegah race condition pada pembuatan order bersamaan. Perhitungan sequence berbasis waktu lokal (Asia/Jakarta). | `transaction_repo.go:31-54` |
| F3.13 | **Kalkulasi Pajak & Diskon** | Transaksi mendukung field `subtotal`, `tax_amount`, `discount_amount`, dan `total_amount`. Kalkulasi pajak dilakukan di frontend berdasarkan konfigurasi dari pengaturan sistem (F2.22). | `domain/transaction.go:CreateTransactionRequest` |

### 5.4 Struk & Riwayat

| ID | Fitur | Deskripsi Kebutuhan Fungsional | Validasi di Kode |
|:---|:---|:---|:---|
| F3.14 | **Struk Digital** | Setelah transaksi berhasil, menghasilkan struk digital yang menampilkan detail pesanan, rincian item, pajak, total, dan metode pembayaran. | Frontend `/cashier/receipt` |
| F3.15 | **E-Receipt Publik (QR Code)** | Struk dapat diakses oleh siapa saja melalui URL publik `/r/{transaction_id}` **tanpa autentikasi**. Endpoint backend `/api/v1/public/receipts/:id` mengembalikan data transaksi, pengaturan struk (logo, header, footer), dan informasi outlet. Memungkinkan pelanggan melihat struk via QR code. | `public_handler.go:GetReceipt()` |
| F3.16 | **Riwayat Transaksi** | Melihat daftar transaksi di outlet yang bersangkutan dengan pagination. Kasir hanya melihat transaksi dari outlet mereka (auto-filter dari JWT `outlet_id`). | `cashier_handler.go:ListTransactions()` |
| F3.17 | **Pembatalan Transaksi (Void)** | Membatalkan transaksi yang sudah dibayar. Validasi: (a) transaksi belum pernah di-void sebelumnya (mencegah double-void), (b) transaksi berada di shift milik kasir yang sama, (c) shift masih dalam jam operasional. Void secara otomatis **mengembalikan stok** produk yang terbatalkan. Catatan audit ditulis ke `activity_logs`. | `transaction_usecase.go:VoidTransaction()`, `transaction_repo.go:Void()` |

---

## 6. Modul 4: Endpoint Publik

| ID | Fitur | Deskripsi Kebutuhan Fungsional | Validasi di Kode |
|:---|:---|:---|:---|
| F4.1 | **Halaman Struk Publik** | Halaman SSR (Server-Side Rendered) yang menampilkan struk digital lengkap untuk transaksi tertentu. Diakses melalui URL `/r/{id}`. Tidak memerlukan login. Digunakan sebagai target QR code pada struk kasir. | Frontend `/r/[id]/page.tsx`, backend `GET /public/receipts/:id` |

---

## 7. Logika Sistem & Batasan (Business Rules)

### 7.1 Integritas Data

| ID | Logika / Batasan | Deskripsi | Enforced By |
|:---|:---|:---|:---|
| L1 | **Isolasi Multi-Outlet** | Transaksi dan shift bersifat silo per-outlet. Kasir hanya melihat data outlet mereka. Owner dapat melihat lintas outlet melalui filter. | JWT `outlet_id` claim + auto-filter di handler |
| L2 | **Integritas Stok Atomik** | Stok dikurangi secara atomik dalam satu database transaction bersama pembuatan transaksi. Jika stok tidak mencukupi untuk satu item saja, seluruh transaksi gagal (rollback). Tidak mungkin terjadi stok negatif. | `UPDATE products SET stock = stock - $1 WHERE stock >= $1` + `dbTx.Rollback()` |
| L3 | **Persistensi & Audit Trail** | Semua catatan transaksi dan shift bersifat permanen (tidak ada hard-delete). Hanya void yang diizinkan, yang meninggalkan jejak audit. Setiap void, login, logout, buka/tutup shift tercatat di `activity_logs`. | Tabel `activity_logs` + tipe `activity_type` enum |
| L4 | **Concurrency Safety** | Pembuatan order ID menggunakan PostgreSQL advisory lock (`pg_advisory_xact_lock`) per-outlet untuk mencegah duplikat saat dua kasir checkout bersamaan. | `transaction_repo.go:35` |

### 7.2 Validasi Waktu Operasional

| ID | Logika / Batasan | Deskripsi | Enforced By |
|:---|:---|:---|:---|
| L5 | **Validasi Jam Operasional (Buka Shift)** | Kasir tidak dapat membuka shift di luar jam operasional outlet (`open_time`–`close_time`). Mendukung jadwal lintas tengah malam (contoh: 17:00–02:00). | `time_helper.go:checkOperatingHours()` |
| L6 | **Validasi Jam Operasional (Transaksi)** | Kasir tidak dapat membuat transaksi baru atau void jika waktu saat ini sudah melewati jam tutup outlet + **toleransi 30 menit**. Pesan: *"Waktu operasional outlet telah berakhir. Harap segera Tutup Shift."* | `time_helper.go:checkShiftExpiration()` |
| L7 | **Validasi Shift Basi (Stale Shift)** | Shift yang sudah dibuka lebih dari **24 jam** secara otomatis dianggap expired. Kasir tidak dapat membuat transaksi atau void pada shift tersebut. | `time_helper.go:88-89` |
| L8 | **Bypass Mode Pengembangan** | Environment variable `BYPASS_TIME_CHECK=true` menonaktifkan seluruh validasi waktu operasional untuk keperluan pengembangan dan demo. | `time_helper.go:14-16` |

### 7.3 Keamanan

| ID | Logika / Batasan | Deskripsi | Enforced By |
|:---|:---|:---|:---|
| L9 | **Validasi Kepemilikan Shift** | Kasir hanya bisa menutup shift miliknya sendiri (`shift.UserID == userID`). Pesan error: *"anda tidak berhak menutup shift milik karyawan lain"*. | `shift_usecase.go:88-90` |
| L10 | **Validasi Kepemilikan Void** | Kasir hanya bisa men-void transaksi dari shift miliknya sendiri. Pesan error: *"anda tidak berhak men-void transaksi milik kasir lain"*. | `transaction_usecase.go:119-121` |
| L11 | **Pencegahan Double-Void** | Transaksi yang sudah berstatus `void` tidak bisa di-void ulang. | `transaction_usecase.go:110-112` |
| L12 | **Proteksi Token Tampered** | Middleware JWT menggunakan safe type assertion untuk semua claim. Token dengan payload tidak valid (tampered) akan ditolak tanpa menyebabkan server panic. | `middleware/auth.go:60-78` |
| L13 | **CORS Policy** | Backend membatasi origin yang diizinkan melalui environment variable `CORS_ORIGIN`, memastikan hanya frontend resmi yang dapat berkomunikasi dengan API. | `middleware/cors.go` |
| L14 | **Dev Bypass OAuth** | Jika `GIN_MODE != release` DAN Google Client ID tidak dikonfigurasi, sistem mengizinkan bypass OAuth untuk pengembangan lokal (ID token dianggap sebagai raw email). Bypass ini **otomatis dinonaktifkan di mode production**. | `auth_usecase.go:44-49` |

---

## 8. Ringkasan Entitas Data

| Entitas | Tabel | Atribut Kunci | Relasi |
|:---|:---|:---|:---|
| Outlet | `outlets` | name, address, phone, email, open_time, close_time, status | → users, shifts, transactions |
| User | `users` | name, email (UNIQUE), role, status, outlet_id | → shifts, activity_logs |
| Category | `categories` | name | → products |
| Product | `products` | name, price, stock, unit, low_stock_threshold, is_active, is_favorite, image_url | → category, modifier_groups (M:N) |
| Modifier Group | `modifier_groups` | name, required | → modifier_options, products (M:N) |
| Modifier Option | `modifier_options` | name, price_impact, sort_order | → modifier_group |
| Shift | `shifts` | user_id, outlet_id, starting_cash, ending_cash, expected_cash, discrepancy, status | → user, outlet, transactions |
| Transaction | `transactions` | order_id (UNIQUE), shift_id, outlet_id, subtotal, tax_amount, discount_amount, total_amount, payment_method, payment_status | → shift, outlet, transaction_items |
| Transaction Item | `transaction_items` | product_id, product_name, quantity, unit_price, subtotal, modifiers (JSONB) | → transaction, product |
| Activity Log | `activity_logs` | user_id, outlet_id, activity_type, details | → user, outlet |
| Settings | `settings` | payment (JSON), tax (JSON), receipt (JSON) | Singleton (1 row) |

---

## 9. Alur Proses Utama (Critical Paths)

### 9.1 Alur Transaksi (Happy Path)

```
Login OAuth → Buka Shift (input modal awal)
  → Pilih Produk → Pilih Modifier (jika ada) → Tambah ke Keranjang
  → Checkout → Pilih Metode Bayar (Tunai/QRIS)
  → Backend: Validasi Shift + Hitung Subtotal + Deduct Stok (Atomic)
  → Transaksi Berhasil → Tampilkan Struk Digital + QR Code
  → (opsional) Void Transaksi → Stok Dikembalikan
  → Tutup Shift (input kas akhir → hitung selisih)
```

### 9.2 Alur Void Transaksi

```
Kasir buka Riwayat Transaksi → Pilih transaksi → Klik Void
  → Backend: Validasi (belum void + shift milik kasir + dalam jam operasional)
  → Update status = 'void' + Restore stok per item
  → Catat di activity_logs
```
