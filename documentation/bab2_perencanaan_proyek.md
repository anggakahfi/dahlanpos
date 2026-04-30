# BAB II — PERENCANAAN PROYEK

---

## A. Analisis Mitra

| | |
|---|---|
| **Nama Mitra** | Small Things Coffee |
| **Jenis Usaha** | Bisnis Makanan dan Minuman (F&B) — Kedai Kopi |
| **Skala Usaha** | UMKM — Satu atau lebih outlet/cabang |
| **Pengguna Sistem** | Pemilik Usaha (Owner) dan Kasir (Cashier) |

### Permasalahan Mitra

Berdasarkan hasil observasi dan wawancara awal dengan pengelola Small Things Coffee, diidentifikasi permasalahan-permasalahan berikut:

**a. Pencatatan transaksi masih dilakukan secara manual.**

Proses penjualan harian masih bergantung pada pencatatan di buku kas atau aplikasi sederhana yang tidak terintegrasi. Kondisi ini rentan terhadap kesalahan pencatatan, tidak memiliki *audit trail*, dan memperlambat proses pelayanan pelanggan.

**b. Tidak ada sistem manajemen stok yang terintegrasi.**

Ketersediaan produk tidak dapat dipantau secara real-time. Stok yang habis sering tidak terdeteksi lebih awal, sehingga berpotensi menyebabkan kerugian penjualan dan ketidakpuasan pelanggan.

**c. Laporan penjualan harian harus direkap secara manual.**

Pemilik tidak dapat memantau performa penjualan secara langsung. Rekap manual memakan waktu, data tidak bersifat *real-time*, dan membuka potensi manipulasi data oleh pihak yang tidak bertanggung jawab.

**d. Manajemen shift kasir tidak terstruktur.**

Tidak ada sistem pencatatan modal awal dan akhir shift kasir. Selisih kas tidak tercatat secara sistematis, sehingga menyulitkan pengawasan dan pertanggungjawaban keuangan harian.

**e. Pengelolaan outlet lebih dari satu cabang tidak terpusat.**

Data antar cabang tidak terintegrasi, dan pemilik tidak dapat memantau kinerja seluruh cabang dari satu tempat secara bersamaan.

**f. Biaya aplikasi POS komersial terlalu tinggi untuk skala UMKM.**

Aplikasi kasir berbayar yang tersedia di pasaran memiliki biaya berlangganan bulanan yang memberatkan bagi pelaku usaha skala kecil dan menengah, sehingga menyulitkan proses *scale-up* bisnis.

> **Referensi:** [`proposal_proyek.md § 1.2`](./proposal_proyek.md)

---

## B. Analisis Kelayakan Website

Analisis kelayakan dilakukan menggunakan kerangka SWOT (*Strengths, Weaknesses, Opportunities, Threats*) untuk menilai kelayakan pengembangan sistem **Small Things Coffee POS (DahlanPOS)**.

**Tabel 2.1 Analisis Kelayakan Sistem (SWOT)**

| | **Positif** | **Negatif** |
|---|---|---|
| **Internal** | **Kekuatan (*Strengths*)** | **Kelemahan (*Weaknesses*)** |
| | 1. Infrastruktur *zero-cost* — seluruh layanan cloud berjalan tanpa biaya bulanan menggunakan *free tier* modern (Vercel, Railway, Neon, Cloudinary). | 1. Kapasitas tim terbatas (≤4 orang), sehingga pengerjaan fitur yang kompleks membutuhkan manajemen waktu yang ketat. |
| | 2. *Tech stack* modern dan terstruktur (Go + Next.js + PostgreSQL + Docker) memastikan sistem mudah dipelihara dan dikembangkan lebih lanjut. | 2. Layanan *hosting* gratis (*free tier*) memiliki potensi *cold start* — aplikasi memerlukan beberapa detik untuk merespons setelah lama tidak diakses. |
| | 3. Sistem multi-outlet terpusat memungkinkan pemilik memantau seluruh cabang dari satu dasbor secara *real-time*. | 3. Verifikasi pembayaran QRIS dilakukan secara manual oleh kasir, tidak ada integrasi otomatis dengan *payment gateway*. |
| | 4. Autentikasi berbasis Google OAuth (SSO) — tidak diperlukan pengelolaan kata sandi, aman dan mudah digunakan. | 4. Sistem dirancang untuk skala UMKM (5–10 pengguna bersamaan), belum mendukung beban pengguna yang sangat besar. |
| **Eksternal** | **Peluang (*Opportunities*)** | **Ancaman (*Threats*)** |
| | 1. Tingginya pertumbuhan bisnis F&B (kedai kopi) di Indonesia membuka peluang adopsi sistem oleh UMKM sejenis. | 1. Kebijakan *free tier* dari penyedia layanan cloud sewaktu-waktu dapat berubah, meningkatkan biaya operasional. |
| | 2. Proyek bersifat *open-source* sehingga dapat menjadi referensi dan portofolio bagi pengembang lain. | 2. Perubahan kebijakan Google OAuth dapat mempengaruhi alur autentikasi sistem. |
| | 3. Sistem dapat dikembangkan lebih lanjut dengan fitur tambahan seperti program loyalitas pelanggan, integrasi QRIS otomatis, atau laporan akuntansi lanjutan. | 3. Kompetitor aplikasi POS komersial terus berkembang, sehingga sistem perlu diperbarui secara berkala agar tetap relevan. |

> **Referensi:** [`proposal_proyek.md § 3.3`](./proposal_proyek.md) | [`infrastructure_cost.md`](./infrastructure_cost.md)

---

## C. Work Breakdown Structure (WBS)

*Work Breakdown Structure* (WBS) proyek DahlanPOS disusun secara hierarkis berdasarkan fase pengembangan untuk memastikan seluruh pekerjaan terdefinisi, terdistribusi, dan dapat dipantau dengan baik.

```
DahlanPOS Project — Small Things Coffee POS
│
├── Fase 0: Inisiasi & Perencanaan
│   ├── 0.1 Analisis requirement & wawancara klien
│   ├── 0.2 Penyusunan proposal proyek
│   ├── 0.3 Desain arsitektur sistem (Clean Architecture)
│   ├── 0.4 Desain database (ERD + DDL Migration Scripts)
│   └── 0.5 Setup environment & repository (GitHub)
│
├── Fase 1: Core Infrastructure
│   ├── 1.1 Setup Backend (Go/Gin boilerplate + Clean Architecture)
│   ├── 1.2 Setup Database Migrations & Seed Data (PostgreSQL)
│   ├── 1.3 Setup Frontend (Next.js 14 App Router + shadcn/ui)
│   ├── 1.4 Implementasi Google OAuth + JWT Authentication
│   ├── 1.5 RBAC Middleware (Owner & Cashier)
│   └── 1.6 Docker Compose Setup (Multi-service stack)
│
├── Fase 2: Modul Backoffice (Manajemen — Khusus Owner)
│   ├── 2.1 Dashboard & Metrik Penjualan (KPI, grafik harian/per jam)
│   ├── 2.2 Manajemen Kategori (CRUD)
│   ├── 2.3 Manajemen Modifier Groups & Options (CRUD)
│   ├── 2.4 Manajemen Produk (CRUD + Cloudinary Upload)
│   ├── 2.5 Manajemen Karyawan (CRUD + Toggle Status)
│   ├── 2.6 Manajemen Outlet/Cabang (CRUD)
│   ├── 2.7 Activity Log Viewer (Audit Trail)
│   ├── 2.8 Laporan Transaksi (dengan filter tanggal, outlet, metode bayar)
│   ├── 2.9 Laporan Shift (dengan filter kasir, outlet, tanggal)
│   └── 2.10 Pengaturan Sistem (Pajak, Metode Pembayaran, Struk)
│
├── Fase 3: Modul Kasir / POS (Operasional Harian)
│   ├── 3.1 Manajemen Shift (Buka & Tutup Shift)
│   ├── 3.2 Navigasi Menu (Tab Kategori + Grid Produk)
│   ├── 3.3 Keranjang Belanja (Cart State Management — Zustand)
│   ├── 3.4 Modifier Selection Modal (Kustomisasi Pesanan)
│   ├── 3.5 Alur Checkout Tunai (kalkulasi kembalian otomatis)
│   ├── 3.6 Alur Checkout QRIS (konfirmasi manual kasir)
│   ├── 3.7 Otomasi Pengurangan Stok (Atomic DB Transaction)
│   ├── 3.8 Struk Digital & QR Code (E-Receipt publik)
│   └── 3.9 Riwayat Transaksi & Pembatalan (Void)
│
├── Fase 4: Testing & Quality Assurance
│   ├── 4.1 Unit Testing (Backend Use Cases — Go test)
│   ├── 4.2 Integration Testing (Critical Path: Auth, Shift, Checkout)
│   ├── 4.3 UAT — User Acceptance Testing bersama klien
│   └── 4.4 Bug Fixing & Polish
│
└── Fase 5: Deployment & Serah Terima
    ├── 5.1 Deployment Frontend ke Vercel
    ├── 5.2 Deployment Backend ke Railway/Render
    ├── 5.3 Deployment Database ke Neon (Serverless PostgreSQL)
    ├── 5.4 Konfigurasi environment production (CORS, OAuth, Cloudinary)
    ├── 5.5 Penulisan README & dokumentasi final
    └── 5.6 Demo & Serah Terima ke Klien
```

**Tabel 2.2 Milestone per Fase**

| Milestone | Deskripsi | Target Selesai |
|---|---|---|
| **M0** | Proposal disetujui, arsitektur & database difinalisasi, repository siap | Akhir Fase 0 |
| **M1** | Autentikasi Google OAuth berfungsi *end-to-end*, RBAC aktif, Docker stack berjalan | Akhir Fase 1 |
| **M2** | Seluruh modul Backoffice dapat digunakan Owner (CRUD selesai, laporan tersedia) | Akhir Fase 2 |
| **M3** | Alur kasir lengkap: buka shift → checkout → cetak struk → tutup shift | Akhir Fase 3 |
| **M4** | *Integration test* lulus, UAT selesai, 0 *critical bug* | Akhir Fase 4 |
| **M5** | Sistem *live* di URL publik, demo sukses, dokumentasi diserahkan | Akhir Fase 5 |

> **Referensi:** [`proposal_proyek.md § BAB 5`](./proposal_proyek.md)

---

## D. Kebutuhan Sumber Daya

### Sumber Daya Manusia

**Tabel 2.3 Daftar Sumber Daya Manusia**

| No. | Nama | NIM | Peran |
|---|---|---|---|
| 1 | M Fauzan Pradipta Dimas C | 2300018427 | Project Manager |
| 2 | Anggasta Vyaktatama Kahfi | 2300018434 | Fullstack Engineer |
| 3 | M Reyhan Panji Banuraga | 2300018439 | UI/UX Designer |
| 4 | *(akan dilengkapi)* | *(akan dilengkapi)* | Technical Writer |
| 5 | *(akan dilengkapi)* | *(akan dilengkapi)* | Quality Assurance |

#### 1. Project Manager

| | |
|---|---|
| **Nama** | M Fauzan Pradipta Dimas C |
| **NIM** | 2300018427 |

**Deskripsi Tugas dan Tanggung Jawab:**

1. Bertanggung jawab atas keberlangsungan dan arah proyek secara keseluruhan.
2. Membagi *job description* kepada seluruh anggota tim.
3. Menyusun proposal proyek dan dokumen perencanaan.
4. Membuat dan memantau *list* progres anggota tim secara berkala.
5. Menghubungkan mitra (klien) dengan anggota tim pengembang.
6. Menyusun *Memorandum of Agreement* (MoU) bersama mitra.
7. Menyusun berita acara setiap tahapan proyek.
8. Melaporkan progres tim kepada dosen pembimbing.
9. Menyusun laporan akhir proyek.
10. Menyusun log book kelompok.

#### 2. Fullstack Engineer

| | |
|---|---|
| **Nama** | Anggasta Vyaktatama Kahfi |
| **NIM** | 2300018434 |

**Deskripsi Tugas dan Tanggung Jawab:**

1. Merancang dan mengimplementasikan arsitektur sistem secara menyeluruh (*backend* & *frontend*).
2. Membangun *backend* API menggunakan Go (Gin) dengan pola *Clean Architecture*.
3. Mengimplementasikan autentikasi Google OAuth 2.0 dan sistem RBAC berbasis JWT.
4. Membangun logika bisnis kritis: manajemen shift, transaksi atomik, dan pengurangan stok.
5. Mengembangkan antarmuka pengguna menggunakan Next.js 14 dan shadcn/ui.
6. Membuat dan mengelola skema database PostgreSQL beserta skrip migrasi.
7. Mengonfigurasi Docker Compose untuk menjalankan seluruh *stack* sistem.
8. Melakukan *deployment* sistem ke layanan *cloud* (Vercel, Railway, Neon).
9. Menulis unit test dan integration test untuk modul-modul kritis.

#### 3. UI/UX Designer

| | |
|---|---|
| **Nama** | M Reyhan Panji Banuraga |
| **NIM** | 2300018439 |

**Deskripsi Tugas dan Tanggung Jawab:**

1. Merancang desain antarmuka (*wireframe* dan *mockup*) seluruh halaman sistem.
2. Membuat *prototype* interaktif menggunakan Figma.
3. Memastikan pengalaman pengguna (*UX*) yang intuitif untuk modul kasir dan backoffice.
4. Membuat poster produk untuk keperluan presentasi dan publikasi.
5. Memproduksi video *teaser* atau demo produk.
6. Berkolaborasi dengan *Fullstack Engineer* untuk memastikan implementasi sesuai desain.

#### 4. Technical Writer

| | |
|---|---|
| **Nama** | *(akan dilengkapi)* |
| **NIM** | *(akan dilengkapi)* |

**Deskripsi Tugas dan Tanggung Jawab:**

1. Menyusun dokumentasi teknis sistem (API Specification, Data Model, NFR).
2. Menulis panduan instalasi dan penggunaan sistem (*README* & *Quick Start Guide*).
3. Menyusun laporan proyek dan log book individu.
4. Mendokumentasikan *Architectural Decision Records* (ADR).

#### 5. Quality Assurance

| | |
|---|---|
| **Nama** | *(akan dilengkapi)* |
| **NIM** | *(akan dilengkapi)* |

**Deskripsi Tugas dan Tanggung Jawab:**

1. Merancang dan mengeksekusi skenario *unit testing* pada modul *backend*.
2. Melaksanakan *integration testing* pada alur kritis (autentikasi, shift, checkout).
3. Melakukan pengujian UAT (*User Acceptance Testing*) bersama klien.
4. Mencatat dan melacak *bug* menggunakan *bug tracker*.
5. Membuat laporan hasil pengujian (*test case sheet*).
6. Membuat dan menghitung kuesioner SUS (*System Usability Scale*) untuk pengujian usabilitas.

> **Referensi:** [`proposal_proyek.md § BAB 2`](./proposal_proyek.md) | [`functional_requirement.md`](./functional_requirement.md)

---

### Sumber Daya Fisik

#### Alat

**Tabel 2.4 Spesifikasi Perangkat Keras Tim Pengembang**

| No. | Anggota | Perangkat | Spesifikasi | Fungsi |
|---|---|---|---|---|
| 1 | M Fauzan Pradipta Dimas C | Laptop | Min. Intel Core i5, RAM 8 GB, SSD | Manajemen proyek, penyusunan dokumen |
| 2 | Anggasta Vyaktatama Kahfi | Laptop/PC | Min. Intel Core i5, RAM 16 GB, SSD | Pengembangan *backend*, *frontend*, dan *deployment* |
| 3 | M Reyhan Panji Banuraga | Laptop | Min. Intel Core i5, RAM 8 GB | Desain UI/UX, pembuatan *prototype* |
| 4 | Technical Writer | Laptop | Min. Intel Core i3, RAM 8 GB | Penyusunan dokumentasi teknis |
| 5 | Quality Assurance | Laptop | Min. Intel Core i5, RAM 8 GB | Pengujian sistem (*testing*) |

#### Bahan

**Tabel 2.5 Daftar Perangkat Lunak dan Layanan yang Digunakan**

| No. | Nama | Fungsi |
|---|---|---|
| 1 | **Go (Golang) 1.22** | Bahasa pemrograman utama untuk membangun *backend* API dengan performa tinggi. |
| 2 | **Next.js 14** | *Framework* React untuk membangun antarmuka pengguna (*frontend*) dengan *App Router*. |
| 3 | **PostgreSQL 16** | Sistem manajemen basis data relasional untuk menyimpan seluruh data sistem. |
| 4 | **Docker & Docker Compose** | *Containerization* untuk menjalankan seluruh *stack* sistem dalam satu perintah. |
| 5 | **Visual Studio Code** | Editor kode utama untuk implementasi *frontend* dan penulisan dokumentasi. |
| 6 | **Figma** | Alat desain UI/UX untuk membuat *wireframe*, *mockup*, dan *prototype* interaktif. |
| 7 | **Git & GitHub** | Sistem kontrol versi (*version control*) dan platform kolaborasi kode sumber. |
| 8 | **Vercel** | Platform *hosting* untuk *deployment frontend* Next.js secara gratis. |
| 9 | **Railway / Render** | Platform *hosting* untuk *deployment backend* Go API (*free tier*). |
| 10 | **Neon (Serverless Postgres)** | Layanan *cloud* database PostgreSQL gratis untuk lingkungan *production*. |
| 11 | **Cloudinary** | Layanan penyimpanan dan pengelolaan media (*image upload*) untuk foto produk. |
| 12 | **Google Cloud Console** | Pengelolaan OAuth 2.0 Client ID untuk fitur *Login with Google* (SSO). |
| 13 | **Postman** | Alat pengujian dan eksplorasi *endpoint* REST API selama pengembangan. |
| 14 | **draw.io / Mermaid** | Pembuatan diagram sistem (ERD, *Use Case*, *Activity Diagram*, *Sequence Diagram*). |
| 15 | **Microsoft Word / Markdown** | Penyusunan proposal, laporan proyek, dan log book kelompok maupun individu. |

> **Referensi:** [`tech_stack.md`](./tech_stack.md) | [`nfr_document.md`](./nfr_document.md) | [`infrastructure_cost.md`](./infrastructure_cost.md)

---

## E. Rencana Jadwal Pelaksanaan Proyek

Rencana jadwal pelaksanaan proyek disusun berdasarkan tahapan kegiatan yang direncanakan selama periode pengerjaan dari bulan Maret hingga Juli. Setiap bulan terdiri dari 4 minggu pelaksanaan.

**Tabel 2.6 Rencana Jadwal Pelaksanaan Proyek**

| No. | Kegiatan | Mar W1 | Mar W2 | Mar W3 | Mar W4 | Apr W1 | Apr W2 | Apr W3 | Apr W4 | Mei W1 | Mei W2 | Mei W3 | Mei W4 | Jun W1 | Jun W2 | Jun W3 | Jun W4 | Jul W1 | Jul W2 | Jul W3 | Jul W4 |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | Melakukan Riset Pasar | ✓ | ✓ | | | | | | | | | | | | | | | | | | |
| 2 | Mengidentifikasi Kebutuhan Pelanggan | ✓ | ✓ | | | | | | | | | | | | | | | | | | |
| 3 | Menentukan Persyaratan Layanan | | ✓ | ✓ | | | | | | | | | | | | | | | | | |
| 4 | Mengembangkan Model Bisnis | | | ✓ | ✓ | | | | | | | | | | | | | | | | |
| 5 | Membuat Proposal Proyek | | | ✓ | ✓ | | | | | | | | | | | | | | | | |
| 6 | Menentukan Lingkup Proyek | | | | ✓ | ✓ | | | | | | | | | | | | | | | |
| 7 | Mengembangkan Rencana Proyek | | | | ✓ | ✓ | | | | | | | | | | | | | | | |
| 8 | Mengidentifikasi dan Merekrut Mitra | | | | | ✓ | ✓ | | | | | | | | | | | | | | |
| 9 | Menetapkan Perjanjian Kemitraan | | | | | | ✓ | ✓ | | | | | | | | | | | | | |
| 10 | Mengintegrasikan Layanan Mitra | | | | | | | ✓ | ✓ | | | | | | | | | | | | |
| 11 | Diskusi Mitra | | | | | ✓ | ✓ | ✓ | | | | | | | | | | | | | |
| 12 | Penandatanganan MoU | | | | | | | ✓ | | | | | | | | | | | | | |
| 13 | Analisis Kebutuhan Sistem & Pembuatan Diagram UML | | | | | | | | ✓ | ✓ | | | | | | | | | | | |
| 14 | Desain UI/UX | | | | | | | | ✓ | ✓ | ✓ | | | | | | | | | | |
| 15 | Pengembangan *Front-End* | | | | | | | | | ✓ | ✓ | ✓ | ✓ | | | | | | | | |
| 16 | Pengembangan *Back-End* | | | | | | | | | ✓ | ✓ | ✓ | ✓ | | | | | | | | |
| 17 | *Unit Testing* | | | | | | | | | | | ✓ | ✓ | | | | | | | | |
| 18 | *Integration Testing* | | | | | | | | | | | | ✓ | ✓ | | | | | | | |
| 19 | *Sistem End-to-End Testing* | | | | | | | | | | | | | ✓ | ✓ | | | | | | |
| 20 | *Acceptance Testing* | | | | | | | | | | | | | | ✓ | ✓ | | | | | |
| 21 | *Performance Testing* | | | | | | | | | | | | | | | ✓ | | | | | |
| 22 | *Usability Testing* | | | | | | | | | | | | | | | ✓ | ✓ | | | | |
| 23 | *Compatibility Testing* | | | | | | | | | | | | | | | | ✓ | | | | |
| 24 | Perbaikan Sistem (Jika Terdapat) | | | | | | | | | | | | | | | | ✓ | ✓ | | | |
| 25 | Serah Terima | | | | | | | | | | | | | | | | | | ✓ | | |
| 26 | Pembuatan Laporan Akhir | | | | | | | | | | | | | | | | | ✓ | ✓ | ✓ | |
| 27 | Penutupan Proyek | | | | | | | | | | | | | | | | | | | ✓ | ✓ |

> **Keterangan:** W = Minggu. Mar = Maret, Apr = April, Mei = Mei, Jun = Juni, Jul = Juli.

> **Referensi:** [`proposal_proyek.md § BAB 6`](./proposal_proyek.md)

---

## F. Rencana Nilai Proyek

**Tabel 2.7 Rencana Anggaran Biaya Proyek**

*(Bagian ini akan diisi setelah negosiasi dan kesepakatan nilai proyek dengan mitra.)*

| No. | Komponen Biaya | Volume | Satuan | Harga Satuan (Rp) | Jumlah (Rp) |
|---|---|---|---|---|---|
| | | | | | |
| | **TOTAL** | | | | |

---

*— Akhir BAB II —*

*Referensi dokumen terkait dalam codebase:*
- [`proposal_proyek.md`](./proposal_proyek.md) — Proposal Proyek Lengkap (Latar Belakang, Scope, WBS, Jadwal, RAB)
- [`functional_requirement.md`](./functional_requirement.md) — Dokumen Kebutuhan Fungsional Sistem
- [`nfr_document.md`](./nfr_document.md) — Dokumen Kebutuhan Non-Fungsional
- [`tech_stack.md`](./tech_stack.md) — Dokumentasi Teknologi yang Digunakan
- [`infrastructure_cost.md`](./infrastructure_cost.md) — Analisis Biaya Infrastruktur
- [`mpti/OUTLINE_LAPORAN_MPTI_DAHLANPOS.md`](./mpti/OUTLINE_LAPORAN_MPTI_DAHLANPOS.md) — Outline Laporan MPTI
