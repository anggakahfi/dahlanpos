# PROJECT CHARTER
# SMALL THINGS COFFEE POS (DahlanPOS)
### *Sistem Point of Sale Berbasis Web untuk Bisnis F&B*

---

<div align="center">

**Nomor Dokumen:** PC-DAHLANPOS-001  
**Versi:** 1.0  
**Tanggal:** April 2026  
**Status:** Aktif

</div>

---

## 1.2 Project Charter

**Project Charter (Piagam Proyek)** adalah dokumen resmi pendek yang menyatakan bahwa sebuah proyek eksis atau dimulai. Dokumen ini memberikan otoritas formal kepada tim pengembang untuk menggunakan sumber daya organisasi dalam menjalankan proyek **Small Things Coffee POS (DahlanPOS)**.

---

## A. Tujuan

Tujuan dari proyek **Pembangunan Sistem Point of Sale Small Things Coffee (DahlanPOS)** adalah sebagai berikut:

1. **Digitalisasi Operasional Kasir:** Mengembangkan sistem kasir berbasis web (*Point of Sale*) yang memungkinkan proses penjualan dilakukan secara digital, cepat, dan bebas dari kesalahan pencatatan manual — menggantikan metode pembukuan konvensional yang masih digunakan.

2. **Manajemen Stok Terintegrasi:** Menyediakan sistem yang secara otomatis mengurangi jumlah stok setiap kali terjadi penjualan (*atomic stock deduction*), sehingga pemilik dan kasir selalu mengetahui ketersediaan produk secara akurat dan *real-time*.

3. **Manajemen Shift Terstruktur:** Menyediakan fitur buka dan tutup shift kasir yang mencatat modal awal, total pendapatan per metode pembayaran, dan selisih kas (*discrepancy*) secara transparan dan dapat diverifikasi kapan saja oleh pemilik.

4. **Pelaporan Terpusat untuk Pemilik:** Menyediakan halaman dasbor dan laporan penjualan multi-cabang yang dapat diakses pemilik dari mana saja melalui browser, mencakup analitik KPI, grafik pendapatan, produk terlaris, dan peringatan stok rendah.

5. **Infrastruktur Berbiaya Nol:** Merancang dan membangun sistem yang dapat beroperasi secara *online* tanpa biaya layanan bulanan (*zero-cost infrastructure*), sehingga solusi ini dapat dimanfaatkan oleh usaha kecil dan menengah F&B tanpa beban finansial tambahan.

6. **Kemudahan Pemasangan & Keberlangsungan Sistem:** Menghasilkan sistem yang lengkap dengan dokumentasi teknis dan panduan penggunaan, sehingga dapat dipasang dan dioperasikan secara mandiri oleh pihak lain tanpa memerlukan bantuan langsung dari tim pengembang.

---

## B. Ruang Lingkup

Ruang lingkup pengembangan proyek **DahlanPOS** mencakup modul dan fitur sebagai berikut:

### Dalam Lingkup (*In-Scope*):

#### Modul 1: Autentikasi & Keamanan Akses
1. Login menggunakan akun **Google OAuth 2.0** (Single Sign-On) — tanpa username/password manual.
2. Verifikasi email karyawan yang terdaftar; hanya akun yang didaftarkan pemilik yang dapat masuk.
3. Pembagian **dua peran pengguna** dengan hak akses berbeda: **Pemilik (Owner)** dan **Kasir (Cashier)**.
4. Dukungan **multi-sesi browser** — pemilik dapat membuka tampilan Backoffice dan Kasir secara bersamaan di dua tab.
5. Pencatatan log aktivitas otomatis (login, logout, buka/tutup shift, transaksi).

#### Modul 2: Backoffice — Manajemen (Khusus Pemilik)
1. **Dasbor analitik** dengan metrik KPI real-time: total pendapatan, jumlah transaksi, rata-rata nilai pesanan, perbandingan periode, grafik harian/per-jam, dan produk terlaris.
2. **Peringatan stok rendah** otomatis berdasarkan ambang batas yang ditetapkan per produk.
3. Manajemen **katalog produk** lengkap: tambah, ubah, hapus produk beserta kategori, foto produk (*upload ke Cloudinary*), harga, stok, dan penandaan favorit.
4. Manajemen **modifikator pesanan** (contoh: ukuran, topping) dengan dampak harga per opsi.
5. Manajemen **karyawan**: daftarkan akun, atur jabatan dan outlet, nonaktifkan akses secara instan.
6. Manajemen **cabang/outlet**: tambah dan kelola data lokasi cabang beserta jam operasional.
7. **Laporan transaksi** lengkap dengan filter tanggal, outlet, dan metode pembayaran.
8. **Laporan shift** kasir: rekap perbandingan kas yang diharapkan vs. yang tersedia.
9. **Pengaturan sistem**: metode pembayaran (tunai/QRIS), persentase pajak, dan tampilan struk digital.

#### Modul 3: Kasir — Operasional Harian
1. **Manajemen shift**: buka shift (input modal awal), ringkasan shift berjalan, tutup shift (input kas akhir + perhitungan selisih otomatis).
2. **Navigasi menu**: tampilan produk aktif per kategori dengan foto dan harga.
3. **Keranjang belanja** dengan manajemen kuantitas dan pendeteksi duplikat berbasis *modifier signature*.
4. **Dialog kustomisasi pesanan** untuk produk ber-modifier dengan kalkulasi harga otomatis.
5. **Checkout tunai**: kalkulasi kembalian otomatis.
6. **Checkout QRIS**: konfirmasi manual oleh kasir setelah memverifikasi pembayaran dari pelanggan.
7. **Pengurangan stok atomik** yang dijamin tidak dapat menghasilkan stok negatif (*ACID transaction*).
8. **Struk digital** yang dapat dicetak maupun diakses via tautan QR oleh pelanggan.
9. **Riwayat transaksi** dengan kemampuan *void* (pembatalan) disertai pengembalian stok otomatis.

#### Modul 4: Infrastruktur & Deployment
1. Containerisasi seluruh layanan menggunakan **Docker & Docker Compose** untuk kemudahan *local setup*.
2. *Deployment* ke layanan cloud *free-tier*: **Vercel** (Frontend), **Railway/Render** (Backend), **Neon** (Database PostgreSQL).
3. Penyimpanan foto produk di **Cloudinary** (free tier).

### Di Luar Lingkup (*Out-of-Scope*):
- Integrasi otomatis *payment gateway* untuk verifikasi QRIS (dilakukan secara manual oleh kasir).
- Program loyalitas pelanggan (poin, diskon member, voucher).
- Aplikasi mobile native (Android/iOS) — sistem diakses melalui browser.
- Laporan akuntansi lanjutan (neraca, laporan laba-rugi).
- Manajemen pembelian bahan baku dari pemasok.
- Sistem multi-tenant (lebih dari satu bisnis/pemilik yang berbeda secara bersamaan).

---

## C. Stakeholder

Stakeholder adalah seluruh pihak — individu, kelompok, maupun lembaga — yang memiliki kepentingan atau peran dalam proyek ini. Setiap tindakan, keputusan, atau hasil dari proyek akan memberikan dampak langsung maupun tidak langsung kepada mereka.

### Tabel 1.1 — Tabel Stakeholder

| No | Nama Stakeholder | Peran | Kepentingan / Kebutuhan |
|:--:|:---|:---|:---|
| 1 | Pemilik / Pengelola Small Things Coffee | Klien utama & Pemilik Produk | Memiliki sistem kasir yang menggantikan pencatatan manual, memberikan visibilitas penuh atas penjualan dan stok semua cabang, serta dapat digunakan tanpa biaya langganan bulanan. |
| 2 | Tim Pengembang DahlanPOS | Pelaksana Proyek (Fullstack) | Bertanggung jawab atas analisis kebutuhan, desain arsitektur, pengembangan *backend* (Go/Gin), *frontend* (Next.js), integrasi fitur, pengujian, dan *deployment* sistem. |
| 3 | Kasir / Staf Operasional Outlet | Pengguna Akhir (Kasir) | Memerlukan antarmuka kasir yang cepat, intuitif, dan tidak memerlukan pelatihan teknis mendalam untuk mengelola shift, melayani transaksi, dan mencetak struk. |
| 4 | Dosen Pembimbing | Pembimbing Akademik | Memberikan arahan teknis dan akademis, meninjau *milestone* proyek, serta melakukan penilaian akhir terhadap kualitas sistem dan dokumentasi. |
| 5 | Google Cloud (Identity Provider) | Penyedia Layanan Autentikasi | Menyediakan layanan Google OAuth 2.0 untuk SSO — memungkinkan seluruh karyawan masuk dengan akun Google tanpa perlu manajemen *password* terpisah. |
| 6 | Cloudinary | Penyedia Penyimpanan Media | Menyediakan layanan penyimpanan dan pengiriman foto produk (*CDN*) secara *cloud-based* dengan tier gratis yang memadai untuk skala UMKM. |
| 7 | Vercel / Railway / Neon | Penyedia Infrastruktur Cloud | Menyediakan platform *hosting* untuk *frontend*, *backend*, dan *database* PostgreSQL agar sistem dapat diakses secara online tanpa biaya operasional bulanan. |

### Uraian Lengkap Stakeholder:

**1. Pemilik / Pengelola Small Things Coffee**

Pemilik usaha berperan sebagai klien utama dan pemilik produk (*product owner*) dalam proyek ini. Mereka memiliki kebutuhan mendasar untuk mendigitalisasi operasional kasir yang sebelumnya dilakukan secara manual — rentan terhadap kesalahan pencatatan, tidak ada rekap stok yang akurat, dan laporan penjualan harus direkap di akhir hari secara manual.

Pemilik membutuhkan sistem yang memberikan visibilitas penuh atas seluruh operasional bisnis: siapa kasir yang sedang berjaga, berapa pendapatan hari ini, produk apa yang stoknya hampir habis, dan bagaimana perbandingan performa antar-cabang. Sebagai stakeholder utama, pemilik juga berperan aktif dalam validasi kebutuhan, persetujuan desain antarmuka, dan pengujian penerimaan (*User Acceptance Testing*).

**2. Tim Pengembang DahlanPOS**

Tim pengembang adalah pelaksana proyek yang bertanggung jawab penuh atas seluruh tahapan pembangunan sistem — mulai dari analisis kebutuhan, desain database dan arsitektur, pengembangan *backend* menggunakan Go (Gin + Clean Architecture), pengembangan *frontend* menggunakan Next.js 14, integrasi layanan pihak ketiga (Google OAuth, Cloudinary), hingga *deployment* dan serah terima sistem.

| No. | Nama | NIM | Peran |
|:--:|:---|:---|:---|
| 1 | M Fauzan Pradipta Dimas C | 2300018427 | Project Manager |
| 2 | Anggasta Vyaktatama Kahfi | 2300018434 | Fullstack Engineer |
| 3 | M Reyhan Panji Banuraga | 2300018439 | UI/UX Designer |
| 4 | *(akan dilengkapi)* | *(akan dilengkapi)* | Technical Writer |
| 5 | *(akan dilengkapi)* | *(akan dilengkapi)* | Quality Assurance |

Tim ini bertugas menerjemahkan kebutuhan klien menjadi fitur yang tepat, efisien, terdokumentasi, dan mudah dikembangkan lebih lanjut. Mereka juga bertanggung jawab untuk melakukan komunikasi aktif dengan semua stakeholder agar sistem yang dibangun sesuai harapan.

**3. Kasir / Staf Operasional Outlet**

Kasir adalah pengguna akhir (*end user*) yang berinteraksi langsung dengan modul Kasir setiap hari. Kepentingan utama mereka adalah antarmuka yang sederhana dan responsif: membuka shift, melayani pesanan pelanggan, memproses pembayaran (tunai atau QRIS), dan menutup shift dengan perhitungan selisih kas yang otomatis.

Karena kasir tidak selalu memiliki latar belakang teknis, *user experience* yang intuitif menjadi aspek krusial. Sistem harus dapat dioperasikan sepenuhnya dari browser di komputer atau tablet tanpa instalasi aplikasi tambahan.

**4. Dosen Pembimbing**

Dosen pembimbing berperan sebagai pengawas akademik proyek. Mereka memberikan arahan teknis, mengevaluasi kemajuan pada setiap *milestone*, dan menilai kualitas sistem dari sisi rekayasa perangkat lunak — termasuk arsitektur kode, kelengkapan dokumentasi, dan hasil pengujian. Persetujuan dosen pembimbing diperlukan sebelum proyek dinyatakan selesai secara akademik.

**5. Google Cloud (Identity Provider)**

Google Cloud menyediakan layanan Google OAuth 2.0 yang digunakan sebagai satu-satunya mekanisme autentikasi sistem. Seluruh karyawan yang ingin mengakses DahlanPOS wajib memiliki akun Google (Gmail) yang sudah didaftarkan oleh pemilik. Ketersediaan dan keandalan layanan ini bersifat kritikal — tanpa Google OAuth, tidak ada pengguna yang dapat masuk ke sistem.

**6. Cloudinary**

Cloudinary menyediakan layanan penyimpanan dan pengiriman foto produk secara *cloud-based*. Setiap kali pemilik mengunggah foto produk melalui Backoffice, gambar tersebut dikirimkan dan disimpan di Cloudinary, kemudian URL gambar disimpan di database PostgreSQL. Cloudinary dipilih karena menyediakan tier gratis yang memadai untuk skala operasional UMKM dan mendukung pengiriman gambar melalui CDN global.

**7. Vercel / Railway / Neon (Penyedia Infrastruktur Cloud)**

Ketiga layanan ini membentuk infrastruktur *hosting* sistem secara lengkap:
- **Vercel** meng-*host* aplikasi *frontend* Next.js dengan CI/CD otomatis dan CDN global.
- **Railway atau Render** meng-*host* API *backend* berbasis Go dalam container Docker.
- **Neon** menyediakan database PostgreSQL *serverless* yang skalabel.

Ketiga layanan ini dipilih karena masing-masing menyediakan tier gratis yang cukup untuk operasional sistem skala UMKM, mewujudkan strategi **Zero-Cost Infrastructure** yang menjadi salah satu tujuan utama proyek.

---

## D. Kriteria Keberhasilan

Proyek **DahlanPOS** dinyatakan berhasil apabila seluruh kondisi berikut terpenuhi:

| No | Kriteria | Indikator Terukur |
|:--:|:---|:---|
| 1 | Seluruh fitur *In-Scope* telah dibangun dan berfungsi. | Checklist fitur (Bab B) selesai 100%. |
| 2 | Pengujian otomatis pada alur kritis lulus. | Unit test & integration test ≥ 80% *pass rate*. |
| 3 | Sistem dapat dipasang secara mandiri. | Berhasil dijalankan mengikuti panduan `docker compose up --build`. |
| 4 | Demo langsung berjalan tanpa gangguan. | Demo di hadapan dosen pembimbing dan klien berjalan lancar. |
| 5 | Dokumentasi teknis tersedia lengkap. | README, panduan instalasi, dan dokumen teknis diserahkan. |
| 6 | Klien menyatakan puas. | Penandatanganan dokumen penerimaan (UAT *sign-off*). |

---

## E. Batasan & Asumsi

### Batasan Proyek:
- Sistem dirancang untuk **maksimal 5–10 pengguna aktif bersamaan** (1 Pemilik + sejumlah Kasir).
- Setiap karyawan **wajib memiliki akun Google (Gmail)** yang sudah didaftarkan terlebih dahulu oleh pemilik — tidak ada pendaftaran mandiri.
- Pembayaran QRIS **diverifikasi secara visual oleh kasir** (tanpa integrasi payment gateway otomatis).
- Sistem menggunakan layanan cloud *free-tier* yang mungkin mengalami *cold-start* beberapa detik setelah lama tidak aktif.
- Durasi proyek mengikuti kalender akademik Semester 6 Program Studi Informatika.

### Asumsi:
- Pemilik bersedia melakukan satu kali konfigurasi awal layanan Google OAuth (dipandu penuh oleh tim pengembang).
- Setiap karyawan yang menggunakan sistem sudah memiliki akun Google aktif.
- Perangkat kasir (komputer atau tablet) menggunakan browser Google Chrome atau Microsoft Edge versi terbaru.
- Tim pengembang memiliki perangkat dengan kapasitas memadai untuk keperluan pembangunan dan pengujian sistem.

---

## F. Anggaran & Infrastruktur

| Komponen Infrastruktur | Layanan | Biaya/Bulan |
|:---|:---|:---:|
| *Frontend Hosting* | Vercel (Hobby Plan) | Rp 0 |
| *Backend API Hosting* | Railway / Render (Free Tier) | Rp 0 |
| *Database* | Neon Serverless PostgreSQL (Free Tier) | Rp 0 |
| Penyimpanan Media | Cloudinary (Free Tier) | Rp 0 |
| Autentikasi | Google Cloud Console (OAuth API) | Rp 0 |
| *Email Delivery* | Resend API (Free Tier) | Rp 0 |
| *Version Control* | GitHub (Free) | Rp 0 |
| **Total Infrastruktur** | | **Rp 0 / bulan** |

> **Catatan:** Komponen biaya utama adalah jasa pengembangan (jasa tim), yang dirinci lebih lanjut dalam dokumen Rencana Anggaran Biaya (RAB) pada Bab 8 Proposal Proyek.

---

## G. Persetujuan & Pengesahan

Dengan ditandatanganinya dokumen ini, seluruh pihak di bawah ini menyatakan bahwa proyek **Small Things Coffee POS (DahlanPOS)** secara resmi **disetujui untuk dimulai**, dan tim pengembang diberi otoritas untuk menggunakan sumber daya yang disepakati guna menyelesaikan proyek sesuai ruang lingkup, jadwal, dan anggaran yang telah diuraikan dalam dokumen ini.

| Nama | Jabatan | Tanda Tangan | Tanggal |
|:---|:---|:---:|:---:|
| <!-- [Nama Dosen Pembimbing] --> | Dosen Pembimbing | __________ | __________ |
| M Fauzan Pradipta Dimas C | Ketua Tim / Project Manager | __________ | __________ |
| <!-- [Nama Perwakilan Klien] --> | Perwakilan Klien / Pemilik Usaha | __________ | __________ |

---

*Dokumen ini merupakan bagian dari Proposal Proyek Small Things Coffee POS (DahlanPOS).*  
*Dibuat oleh Tim Pengembang DahlanPOS — Program Studi Informatika, April 2026.*
