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

## B. Analisis Kelayakan Sistem

Analisis kelayakan dilakukan menggunakan kerangka SWOT (*Strengths, Weaknesses, Opportunities, Threats*) untuk menilai kelayakan pengembangan sistem **Small Things Coffee POS (DahlanPOS)** dari perspektif manfaat bisnis dan pengalaman pengguna.

**Tabel 2.1 Analisis Kelayakan Sistem (SWOT)**

| | **Positif** | **Negatif** |
|---|---|---|
| **Internal** | **Kekuatan (*Strengths*)** | **Kelemahan (*Weaknesses*)** |
| | 1. Sistem dapat dijalankan tanpa biaya berlangganan bulanan, sehingga tidak membebani keuangan usaha skala UMKM. | 1. Tim pengembang berjumlah kecil, sehingga penyesuaian fitur atas permintaan mendadak memerlukan waktu lebih lama. |
| | 2. Antarmuka kasir dirancang sederhana dan responsif, sehingga kasir baru dapat mengoperasikan sistem tanpa pelatihan teknis yang panjang. | 2. Sistem membutuhkan koneksi internet yang stabil untuk dapat beroperasi secara optimal. |
| | 3. Pemilik usaha dapat memantau performa seluruh cabang dan laporan penjualan harian dari satu halaman dasbor kapan saja. | 3. Konfirmasi pembayaran QRIS masih dilakukan secara manual oleh kasir, sehingga menambah satu langkah dalam proses transaksi. |
| | 4. Sistem masuk menggunakan akun Google yang sudah dimiliki, tanpa perlu mengingat kata sandi baru — aman dan praktis. | 4. Kapasitas pengguna bersamaan masih terbatas, sesuai skala operasional UMKM saat ini. |
| **Eksternal** | **Peluang (*Opportunities*)** | **Ancaman (*Threats*)** |
| | 1. Pertumbuhan bisnis kedai kopi di Indonesia yang pesat membuka peluang adopsi sistem kasir digital oleh UMKM F&B sejenis. | 1. Perubahan kebijakan layanan infrastruktur digital yang digunakan dapat meningkatkan biaya operasional sistem di masa depan. |
| | 2. Sistem yang terdokumentasi dengan baik dapat dikembangkan lebih lanjut atau diadaptasi oleh usaha lain dengan kebutuhan serupa. | 2. Ketergantungan pada layanan pihak ketiga untuk proses masuk (*login*) berpotensi terdampak jika kebijakan layanan tersebut berubah. |
| | 3. Sistem dapat diperluas dengan fitur tambahan seperti program loyalitas pelanggan, laporan keuangan lanjutan, atau konfirmasi pembayaran otomatis seiring pertumbuhan usaha. | 3. Aplikasi kasir komersial terus berkembang dengan fitur yang semakin lengkap, sehingga sistem perlu diperbarui secara berkala agar tetap kompetitif. |

Berdasarkan pemetaan SWOT di atas, dirumuskan empat strategi lintas kuadran sebagai berikut:

**1. Strategi S-O (*Strengths – Opportunities*)**

a. Memanfaatkan kemudahan penggunaan dan nol biaya berlangganan sebagai nilai utama yang ditawarkan kepada pelaku UMKM F&B, sehingga mendorong adopsi sistem kasir digital secara lebih luas di kalangan usaha sejenis.

b. Mengoptimalkan fitur dasbor terpusat dan laporan penjualan otomatis sebagai solusi nyata bagi pemilik usaha yang selama ini kesulitan memantau performa toko tanpa harus hadir langsung di lokasi.

c. Memastikan sistem dirancang dengan fondasi yang dapat dikembangkan, sehingga fitur-fitur baru seperti program loyalitas pelanggan atau laporan keuangan dapat ditambahkan seiring pertumbuhan kebutuhan bisnis tanpa harus membangun ulang dari awal.

**2. Strategi S-T (*Strengths – Threats*)**

a. Menjaga keunggulan pengalaman pengguna — kecepatan transaksi, antarmuka yang bersih, dan kemudahan navigasi — sebagai pembeda utama dibandingkan aplikasi kasir komersial yang umumnya lebih rumit dan mahal.

b. Menerapkan mekanisme hak akses yang ketat sehingga data transaksi dan laporan keuangan hanya dapat diakses oleh pihak yang berwenang, melindungi kepentingan bisnis dari risiko kebocoran informasi.

c. Mendokumentasikan prosedur cadangan dan pemulihan sistem agar operasional toko dapat tetap berjalan dan data tidak hilang meskipun terjadi gangguan pada layanan pihak ketiga.

**3. Strategi W-O (*Weaknesses – Opportunities*)**

a. Membangun sistem dengan struktur yang modular dan terorganisasi sehingga penambahan fitur baru dapat dilakukan secara bertahap tanpa mengganggu operasional kasir yang sedang berjalan.

b. Mengotomasi pencatatan shift, stok, dan transaksi harian untuk mengurangi ketergantungan pada proses manual, sehingga kasir dapat lebih fokus pada pelayanan pelanggan.

c. Menjajaki peluang kemitraan dengan program digitalisasi UMKM guna mendukung keberlanjutan pengembangan sistem apabila kebutuhan fitur melebihi kapasitas tim saat ini.

**4. Strategi W-T (*Weaknesses – Threats*)**

a. Mengurangi seluruh pencatatan manual — mulai dari transaksi penjualan, pengelolaan stok, hingga rekap shift — sehingga potensi kesalahan manusia berkurang dan data yang dihasilkan lebih dapat diandalkan untuk pengambilan keputusan bisnis.

b. Menyediakan panduan penggunaan sistem yang ringkas dan mudah dipahami oleh pemilik maupun kasir, agar sistem digunakan secara konsisten dan sesuai prosedur operasional sejak hari pertama.

c. Membangun fitur riwayat aktivitas yang dapat dipantau pemilik, sehingga setiap anomali operasional — seperti pembatalan transaksi yang tidak wajar — dapat terdeteksi lebih awal dan ditindaklanjuti dengan cepat.

> **Referensi:** [`proposal_proyek.md § 3.3`](./proposal_proyek.md) | [`infrastructure_cost.md`](./infrastructure_cost.md)


---

## C. Work Breakdown Structure (WBS)

*Work Breakdown Structure* (WBS) proyek DahlanPOS disusun secara hierarkis mengikuti kerangka *Software Development Life Cycle* (SDLC) yang terdiri dari lima fase utama: **Inisiasi & Perencanaan**, **Analisis & Perancangan**, **Implementasi**, **Pengujian**, dan **Penerapan & Penutupan**. Struktur ini memastikan seluruh pekerjaan terdefinisi, dapat didelegasikan, dan memiliki kriteria keberhasilan yang terukur pada setiap fasenya.

```
DahlanPOS Project — Small Things Coffee POS
│
├── Fase 1: Inisiasi & Perencanaan
│   ├── 1.1 Identifikasi kebutuhan & wawancara pemangku kepentingan (klien)
│   ├── 1.2 Penyusunan & pengesahan proposal proyek
│   ├── 1.3 Pembentukan tim & penetapan peran (Project Charter)
│   ├── 1.4 Penyusunan rencana jadwal & anggaran proyek (WBS, Gantt Chart)
│   └── 1.5 Penandatanganan perjanjian kemitraan (MoU)
│
├── Fase 2: Analisis & Perancangan Sistem
│   ├── 2.1 Analisis Kebutuhan Fungsional & Non-Fungsional (SRS)
│   ├── 2.2 Pemodelan proses bisnis (Use Case & Activity Diagram)
│   ├── 2.3 Perancangan arsitektur sistem (komponen, lapisan, & integrasi)
│   ├── 2.4 Perancangan basis data (ERD & skema relasional)
│   ├── 2.5 Perancangan antarmuka pengguna (Wireframe & Prototype)
│   └── 2.6 Penetapan infrastruktur & lingkungan pengembangan
│
├── Fase 3: Implementasi Sistem
│   ├── 3.1 Implementasi Infrastruktur Dasar
│   │   ├── 3.1.1 Konfigurasi lingkungan pengembangan & repositori versi
│   │   ├── 3.1.2 Pembangunan fondasi sistem (basis data, kerangka API, otentikasi)
│   │   └── 3.1.3 Implementasi kontrol akses berbasis peran (RBAC)
│   ├── 3.2 Implementasi Modul Manajemen (Pengguna: Pemilik)
│   │   ├── 3.2.1 Dasbor & pelaporan penjualan (KPI & grafik)
│   │   ├── 3.2.2 Manajemen data master (produk, kategori, varian produk)
│   │   ├── 3.2.3 Manajemen operasional (karyawan, outlet, pengaturan sistem)
│   │   └── 3.2.4 Pencatatan aktivitas sistem (jejak audit)
│   └── 3.3 Implementasi Modul Kasir / POS (Pengguna: Kasir)
│       ├── 3.3.1 Manajemen sesi kerja (buka & tutup shift)
│       ├── 3.3.2 Alur penjualan & pemilihan produk
│       ├── 3.3.3 Proses pembayaran (tunai & QRIS)
│       ├── 3.3.4 Penerbitan bukti transaksi digital (struk & QR)
│       └── 3.3.5 Riwayat transaksi & pembatalan (void)
│
├── Fase 4: Pengujian & Penjaminan Kualitas
│   ├── 4.1 Pengujian Unit (validasi logika per komponen)
│   ├── 4.2 Pengujian Integrasi (validasi antar-komponen & alur kritis)
│   ├── 4.3 Pengujian Sistem & Kinerja (end-to-end & beban)
│   ├── 4.4 Pengujian Kebergunaan — SUS (System Usability Scale)
│   ├── 4.5 Pengujian Penerimaan Pengguna / UAT (bersama klien)
│   └── 4.6 Perbaikan & penyempurnaan berdasarkan hasil pengujian
│
└── Fase 5: Penerapan & Penutupan Proyek
    ├── 5.1 Penerapan sistem ke lingkungan produksi (deployment)
    ├── 5.2 Konfigurasi & verifikasi lingkungan produksi
    ├── 5.3 Penyusunan dokumentasi teknis & panduan pengguna akhir
    ├── 5.4 Penulisan laporan akhir proyek
    ├── 5.5 Demo & serah terima sistem kepada klien
    └── 5.6 Penutupan proyek & evaluasi pasca-implementasi
```

**Tabel 2.2 Milestone per Fase SDLC**

| Milestone | Fase | Deskripsi Kriteria Keberhasilan | Target Selesai |
|---|---|---|---|
| **M1** | Inisiasi & Perencanaan | Proposal disahkan, tim terbentuk, MoU ditandatangani, WBS & jadwal disetujui | Akhir Fase 1 |
| **M2** | Analisis & Perancangan | Dokumen SRS difinalisasi, ERD & arsitektur disetujui, prototipe UI disepakati klien | Akhir Fase 2 |
| **M3** | Implementasi | Seluruh modul (manajemen & kasir) selesai dibangun dan berjalan di lingkungan pengembangan | Akhir Fase 3 |
| **M4** | Pengujian | Seluruh skenario uji lulus, UAT disetujui klien, nol *bug* kritis tersisa | Akhir Fase 4 |
| **M5** | Penerapan & Penutupan | Sistem *live* di lingkungan produksi, dokumentasi diserahkan, serah terima klien selesai | Akhir Fase 5 |

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
