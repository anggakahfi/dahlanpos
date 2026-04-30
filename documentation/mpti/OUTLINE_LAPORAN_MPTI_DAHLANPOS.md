# 📋 OUTLINE LAPORAN PROYEK MPTI — DahlanPOS
## Small Things Coffee POS: Sistem Point of Sale Berbasis Web untuk Bisnis F&B Multi-Outlet

> **Catatan:** Outline ini disusun berdasarkan pola laporan alumni MPTI UAD (Lestari Putro 2025, Apotek Segar 2025) yang disesuaikan dengan konteks proyek DahlanPOS. Item bertanda `[PLACEHOLDER]` perlu diisi dengan data aktual.

---

## HALAMAN DEPAN & ADMINISTRASI

- [ ] **Halaman Judul** — Judul proyek, nama anggota tim + NIM, Prodi, Fakultas, Universitas, Tahun
- [ ] **Lembar Pengesahan** — Tanda tangan Pembimbing, Penguji, Kaprodi
- [ ] **Kata Pengantar**
- [ ] **Daftar Isi**
  - Halaman Depan & Administrasi
  - BAB I Pendahuluan
  - BAB II Perencanaan Proyek
  - BAB III Pelaksanaan Proyek
  - BAB IV Penutup
  - Daftar Pustaka & Lampiran
- [ ] **Daftar Gambar**
  - Gambar 1. Gantt Chart Proyek
  - Gambar 2. Use Case Diagram Sistem DahlanPOS
  - Gambar 3-6. Activity Diagram (Login, Shift, Transaksi, Void)
  - Gambar 7-9. Sequence Diagram (OAuth, Checkout, Shift Validasi)
  - Gambar 10. Entity Relationship Diagram (ERD)
  - Gambar 11. Arsitektur Deployment
  - Gambar 12+. Screenshot Tampilan UI & Foto Dokumentasi
- [ ] **Daftar Tabel**
  - Tabel 1. Daftar Stakeholder
  - Tabel 2. Analisis SWOT & Risiko
  - Tabel 3. Kebutuhan SDM & Perangkat Fisik
  - Tabel 4. Rencana Anggaran Biaya (RAB)
  - Tabel 5. Responsibility Matrix (RACI)
  - Tabel 6. Realisasi Jadwal Proyek
  - Tabel 7. Kebutuhan Fungsional & Non-Fungsional
  - Tabel 8. Skenario & Hasil Pengujian Black-box
- [ ] **Daftar Kode Program**
  - Code 1. Implementasi Autentikasi OAuth & Middleware RBAC
  - Code 2. Logika Database Transaction (Atomic Checkout)
  - Code 3. Validasi Shift & Waktu Operasional
  - Code 4. Manajemen State Keranjang Kasir (Zustand)

---

## BAB I — PENDAHULUAN

### 1.1 Latar Belakang
- Transformasi digital UMKM F&B di Indonesia
- Permasalahan pencatatan manual pada bisnis kedai kopi
- Kebutuhan sistem kasir terjangkau & multi-outlet
- Referensi literatur/jurnal pendukung (minimal 3–5 sumber)
> **Sumber yang sudah ada:** [proposal_proyek.md § 1.1](../proposal_proyek.md)

### 1.2 Project Charter

#### A. Tujuan Proyek
1. Digitalisasi operasional kasir (T1)
2. Manajemen stok otomatis (T2)
3. Manajemen shift terstruktur (T3)
4. Pelaporan terpusat multi-cabang (T4)
5. Biaya operasional nol / zero-cost infrastructure (T5)
6. Mudah dipasang & diwariskan (T6)
> **Sumber:** [proposal_proyek.md § 1.3](../proposal_proyek.md)

#### B. Ruang Lingkup
- Modul Login & Keamanan (Google OAuth, RBAC)
- Modul Backoffice (Dashboard, Katalog, SDM, Laporan, Pengaturan)
- Modul Kasir (Shift, Menu, Cart, Checkout, Struk, Void)
- Modul Publik (E-Receipt QR)
- Batasan: Out-of-Scope items
> **Sumber:** [proposal_proyek.md § 1.5](../proposal_proyek.md), [functional_requirement.md](../functional_requirement.md)

#### C. Stakeholder
| No | Stakeholder | Peran | Kepentingan |
|----|-------------|-------|-------------|
| 1 | `[PLACEHOLDER: Nama Klien/Mitra]` | Klien / Pemilik Usaha | Validasi kebutuhan, UAT, penerima produk |
| 2 | `[PLACEHOLDER: Dosen Pembimbing]` | Pembimbing Akademik | Tinjauan milestone, penilaian |
| 3 | Tim Pengembang DahlanPOS | Pelaksana Proyek | Pengembangan end-to-end |
| 4 | `[PLACEHOLDER: Dosen Penguji]` | Penguji | Evaluasi akhir |
| 5 | Kasir Outlet / End User | Pengguna Akhir | Operasional harian POS |

---

## BAB II — PERENCANAAN PROYEK

### 2.1 Model Proses / Metodologi Pengembangan
- **Iterative + Agile (Modified Scrum)** dengan sprint 1–2 minggu
- Alasan pemilihan metodologi (vs Waterfall)
- Artefak Scrum: Sprint Planning, Review, Retrospective, Product Backlog
> **Sumber:** [proposal_proyek.md § 3.4](../proposal_proyek.md)

### 2.2 Analisis Kelayakan (SWOT)

| | Positif | Negatif |
|---|---|---|
| **Internal** | Strengths | Weaknesses |
| **Eksternal** | Opportunities | Threats |

- **Strengths:** Zero-cost infra, modern tech stack, multi-outlet, open-source
- **Weaknesses:** Keterbatasan tim (≤4 orang), cold-start pada free tier
- **Opportunities:** Adopsi UMKM F&B lain, portfolio akademik, kontribusi open-source
- **Threats:** Layanan gratis berubah kebijakan, cold-start mengganggu demo

### 2.3 Analisis Risiko

| ID | Risiko | Probabilitas | Dampak | Mitigasi |
|----|--------|-------------|--------|----------|
| R01–R08 | *(Salin & sesuaikan dari proposal)* | | | |
> **Sumber:** [proposal_proyek.md § 3.3](../proposal_proyek.md)

### 2.4 Work Breakdown Structure (WBS)
- Fase 0: Inisiasi & Perencanaan
- Fase 1: Core Infrastructure
- Fase 2: Modul Backoffice
- Fase 3: Modul Kasir (POS)
- Fase 4: Testing & QA
- Fase 5: Deployment & Serah Terima
> **Sumber:** [proposal_proyek.md § BAB 5](../proposal_proyek.md)

### 2.5 Gantt Chart / Jadwal Pelaksanaan
- Timeline per minggu (M1–M14 atau sesuaikan)
- Milestone per Fase (M0–M5)
> **Sumber:** [proposal_proyek.md § BAB 6](../proposal_proyek.md)

### 2.6 Kebutuhan Sumber Daya

#### A. Sumber Daya Manusia (SDM)
| No | Nama | NIM | Peran/Jobdesk | Tanggung Jawab |
|----|------|-----|---------------|----------------|
| 1 | M Fauzan Pradipta Dimas C | 2300018427 | Project Manager | `[detail]` |
| 2 | Anggasta Vyaktatama Kahfi | 2300018434 | Fullstack Engineer | `[detail]` |
| 3 | M Reyhan Panji Banuraga | 2300018439 | UI/UX Designer | `[detail]` |
| 4 | `[PLACEHOLDER]` | `[NIM]` | Technical Writer | `[detail]` |
| 5 | `[PLACEHOLDER]` | `[NIM]` | Quality Assurance | `[detail]` |
> **Sumber:** [proposal_proyek.md § BAB 2](../proposal_proyek.md)

#### B. Sumber Daya Fisik / Perangkat
| No | Sumber Daya | Spesifikasi | Keterangan |
|----|-------------|-------------|------------|
| 1 | Laptop/PC | Min. Intel i5, RAM 8GB, SSD | Development & testing |
| 2 | Koneksi Internet | Min. 20 Mbps | Kolaborasi, deployment |
| 3 | Docker Desktop | Free (personal use) | Containerization |
| 4 | VS Code / GoLand | Editor kode | Development |
| 5 | Figma | Free plan | UI/UX design & prototype |
| 6 | Git + GitHub | Free | Version control |
| 7 | Browser (Chrome/Edge) | Latest | Testing & debugging |

### 2.7 Rencana Nilai Proyek / Anggaran (RAB)
- Rincian biaya infrastruktur (Rp 0 — zero-cost strategy)
- Rincian biaya pengembangan (jasa tim)
- Cadangan 10%
- Total estimasi proyek
> **Sumber:** [proposal_proyek.md § BAB 8](../proposal_proyek.md), [infrastructure_cost.md](../infrastructure_cost.md)

### 2.8 Responsibility Matrix (RACI)
- Tabel RACI per deliverable/tugas (R/A/C/I)
> **Sumber:** [proposal_proyek.md § BAB 7](../proposal_proyek.md)

---

## BAB III — PELAKSANAAN PROYEK

### 3.1 Realisasi Jadwal Pelaksanaan
- Tabel perbandingan: Rencana vs Realisasi per tahapan
- Analisis ketepatan waktu & deviasi

### 3.2 Realisasi Hasil Pekerjaan

#### A. Realisasi Project Manager
- Pembentukan tim & pembagian jobdesk
- Penyusunan proposal & MoU
- Koordinasi rapat & bimbingan dospem
- Monitoring & evaluasi progress
- Bukti foto/screenshot: rapat, bimbingan, komunikasi klien

#### B. Realisasi System Analyst
1. **Kebutuhan Fungsional** — Tabel kebutuhan fungsional per modul
   > **Sumber:** [functional_requirement.md](../functional_requirement.md)
2. **Kebutuhan Non-Fungsional** — Performance, Security, Deployment
   > **Sumber:** [nfr_document.md](../nfr_document.md)
3. **Use Case Diagram** — Interaksi Owner & Cashier dengan sistem
4. **Activity Diagram** — Alur proses per fitur utama:
   - Login OAuth
   - Buka Shift → Transaksi → Tutup Shift
   - Void Transaksi
   - CRUD Produk (Backoffice)
5. **Sequence Diagram** — Alur teknis minimal:
   - Login & JWT Token Issuance
   - Checkout Atomic Transaction
6. **Entity Relationship Diagram (ERD)**
   > **Sumber:** [data_model.md](../data_model.md), [proposal_proyek.md Lampiran B](../proposal_proyek.md)

#### C. Realisasi UI/UX Designer
1. **Wireframe / Mockup** — Desain awal per halaman
2. **Prototype Interaktif** (Figma) — Link & screenshot
3. **Daftar Halaman UI:**
   - Login Page
   - Backoffice: Dashboard, Kategori, Produk, Karyawan, Outlet, Laporan, Pengaturan
   - Kasir: Shift Open/Close, Menu Grid, Cart, Checkout, Receipt, Riwayat Transaksi
   - Public: E-Receipt

#### D. Realisasi Frontend Developer
1. **Arsitektur Frontend** — Next.js 14 App Router, Feature-based structure
2. **Cuplikan Kode & Penjelasan** per halaman/komponen kunci:
   - Authentication flow (`api.ts`)
   - Cart state management (`useCartStore.ts`)
   - Checkout flow
   - Receipt page
3. **Screenshot Tampilan Akhir** per halaman
> **Sumber:** [tech_stack.md § Frontend](../tech_stack.md)

#### E. Realisasi Backend Developer
1. **Arsitektur Backend** — Clean Architecture (Handler → UseCase → Repository)
2. **Cuplikan Kode & Penjelasan** per modul kunci:
   - Auth UseCase (OAuth + JWT)
   - Shift UseCase (Open/Close + Validation)
   - Transaction UseCase (Atomic Checkout + Stock Deduction)
   - Void Transaction
3. **API Specification** — Daftar endpoint REST API
   > **Sumber:** [api_specification.md](../api_specification.md)
4. **Arsitektur Database** — ERD final, daftar tabel & relasi
   > **Sumber:** [data_model.md](../data_model.md)
> **Sumber:** [tech_stack.md § Backend](../tech_stack.md)

#### F. Realisasi Quality Assurance / Tester
1. **Strategi Pengujian** — Unit test, integration test, UAT
2. **Hasil Pengujian Unit Test** — Coverage & hasil
   > **Sumber:** [unit_testing_blueprint.md](../unit_testing_blueprint.md)
3. **Hasil Pengujian Integrasi** — Skenario critical path
   > **Sumber:** [integration_testing_blueprint.md](../integration_testing_blueprint.md)
4. **Pengujian Black-box / Fungsional** — Tabel skenario & hasil (Pass/Fail)
5. **Pengujian UAT** — Hasil pengujian bersama klien
6. **Metode Evaluasi Tambahan** (pilih salah satu):
   - System Usability Scale (SUS)
   - User Experience Questionnaire (UEQ)
   - Framework PIECES

#### G. Realisasi Deployment / DevOps
1. **Arsitektur Deployment** — Diagram infrastruktur (Vercel + Backend Host + Neon + Cloudinary)
2. **Proses Docker Build & Compose** — Screenshot proses
   > **Sumber:** [backend_docker_build_guide.md](../backend_docker_build_guide.md)
3. **Konfigurasi Production** — Environment variables, CORS, dll
4. **Screenshot Hasil Deploy** — URL live, tampilan produksi

### 3.3 Penjaminan Kualitas Proyek
- Praktik code review
- Bug tracking & resolution
  > **Sumber:** [manual_bug_tracker.md](../manual_bug_tracker.md)
- Architectural Decision Records (ADR)
  > **Sumber:** [ADR-001](../ADR-001-Token-Lifecycle-Management.md), [ADR-002](../ADR-002-Shift-Lifecycle-Management.md)

### 3.4 Keberlanjutan Proyek
- Rencana maintenance pasca serah terima
- Panduan penggunaan untuk klien
- Masa garansi (jika ada)
- Potensi pengembangan fitur lanjutan

---

## BAB IV — PENUTUP

### 4.1 Kesimpulan
- Ringkasan pencapaian proyek terhadap tujuan (T1–T6)
- Evaluasi keberhasilan berdasarkan kriteria penerimaan

### 4.2 Saran
- Rekomendasi pengembangan fitur di masa depan
- Saran untuk proyek sejenis

---

## DAFTAR PUSTAKA
- Minimal 5–10 referensi (jurnal, buku, dokumentasi resmi)
- Format: APA atau IEEE sesuai panduan prodi
> **Sumber awal:** [proposal_proyek.md § Daftar Pustaka](../proposal_proyek.md)

---

## LAMPIRAN

### Lampiran Administrasi
- [ ] **Lampiran A** — Proposal Proyek (versi final)
- [ ] **Lampiran B** — Surat Perintah Kerja / MoU dengan Mitra
- [ ] **Lampiran C** — Log Book Kelompok (minimal 7x pertemuan)
- [ ] **Lampiran D** — Log Book Individu (minimal 7x per anggota)
- [ ] **Lampiran E** — Foto Dokumentasi Kegiatan Proyek (rapat, bimbingan, serah terima)
- [ ] **Lampiran F** — Bukti Serah Terima Proyek
- [ ] **Lampiran G** — Bukti Pembayaran (jika komersial)

### Lampiran Teknikal
- [ ] **Lampiran H** — Source Code (link GitHub repository)
- [ ] **Lampiran I** — Hosting & Domain (URL live demo)
- [ ] **Lampiran J** — Link Video Profil Produk Luaran Proyek
- [ ] **Lampiran K** — Poster Produk Luaran Proyek
- [ ] **Lampiran L** — Slide Presentasi Proyek

---

---

# 📊 DAFTAR DOKUMEN & DIAGRAM YANG DIPERLUKAN

## A. Dokumen Manajerial / Bisnis

| No | Dokumen | Status | Sumber/Catatan |
|----|---------|--------|----------------|
| 1 | Project Charter | 🟡 Ada sebagian | Susun ulang dari `proposal_proyek.md` |
| 2 | Proposal Proyek | ✅ Ada | `proposal_proyek.md` |
| 3 | MoU / Surat Kerjasama Mitra | ❌ Belum | `[PLACEHOLDER]` |
| 4 | SWOT Analysis | 🟡 Ada sebagian | Ada di proposal, perlu versi tabel formal |
| 5 | Risk Register | ✅ Ada | Tabel risiko di `proposal_proyek.md § 3.3` |
| 6 | WBS (Work Breakdown Structure) | ✅ Ada | `proposal_proyek.md § BAB 5` |
| 7 | Gantt Chart | ✅ Ada (template) | `proposal_proyek.md § BAB 6`, perlu realisasi |
| 8 | RACI Matrix | ✅ Ada | `proposal_proyek.md § BAB 7` |
| 9 | RAB (Rencana Anggaran Biaya) | ✅ Ada | `proposal_proyek.md § BAB 8`, `infrastructure_cost.md` |
| 10 | Log Book Kelompok | ❌ Belum | `[PLACEHOLDER]` — minimal 7x |
| 11 | Log Book Individu | ❌ Belum | `[PLACEHOLDER]` — minimal 7x per orang |
| 12 | Notulen Rapat / Bimbingan | ❌ Belum | `[PLACEHOLDER]` |
| 13 | Berita Acara Serah Terima | ❌ Belum | `[PLACEHOLDER]` |
| 14 | Hasil UAT / Sign-off Klien | ❌ Belum | `[PLACEHOLDER]` |

## B. Dokumen & Diagram Teknikal

| No | Dokumen/Diagram | Status | Sumber/Catatan |
|----|-----------------|--------|----------------|
| 1 | Functional Requirement | ✅ Ada | `functional_requirement.md` |
| 2 | Non-Functional Requirement | ✅ Ada | `nfr_document.md` |
| 3 | Tech Stack Documentation | ✅ Ada | `tech_stack.md` |
| 4 | API Specification | ✅ Ada | `api_specification.md` |
| 5 | Data Model / ERD | ✅ Ada | `data_model.md` + ERD Mermaid di proposal |
| 6 | Use Case Diagram | ❌ Belum | 1 Diagram Utuh (Generic, All Actors: Owner & Cashier) |
| 7 | Activity Diagram | ❌ Belum | 4 Diagram Spesifik (AD Login, AD Shift, AD Transaksi, AD Void) |
| 8 | Sequence Diagram | ❌ Belum | 2-3 Diagram Teknis (SD Login OAuth, SD Checkout Atomic, SD Shift Validasi) |
| 9 | Architecture Diagram (Deployment) | ✅ Ada | `proposal_proyek.md` Lampiran C |
| 10 | Wireframe / Mockup UI | ❌ Belum | `[PLACEHOLDER]` — dari Figma |
| 11 | Prototype Interaktif (Figma) | ❌ Belum | `[PLACEHOLDER]` — link Figma |
| 12 | Screenshot Tampilan Akhir | ❌ Belum | Perlu capture per halaman |
| 13 | ADR (Arch. Decision Records) | ✅ Ada | `ADR-001`, `ADR-002` |
| 14 | Unit Testing Blueprint | ✅ Ada | `unit_testing_blueprint.md` |
| 15 | Integration Testing Blueprint | ✅ Ada | `integration_testing_blueprint.md` |
| 16 | Hasil Pengujian (Black-box) | ❌ Belum | Perlu tabel skenario Pass/Fail |
| 17 | Hasil Pengujian SUS/UEQ | ❌ Belum | Perlu survei & perhitungan |
| 18 | Bug Tracker Log | ✅ Ada | `manual_bug_tracker.md` |
| 19 | Docker Build Guide | ✅ Ada | `backend_docker_build_guide.md` |
| 20 | Poster Produk | ❌ Belum | `[PLACEHOLDER]` |
| 21 | Video Demo Produk | ❌ Belum | `[PLACEHOLDER]` |

---

## 📝 CATATAN PENTING

> [!IMPORTANT]
> **Perbedaan utama DahlanPOS vs referensi alumni:**
> - Alumni menggunakan **Waterfall**, DahlanPOS menggunakan **Agile/Scrum** → sesuaikan narasi metodologi
> - DahlanPOS memiliki **arsitektur lebih kompleks** (Go backend + Next.js frontend + Docker) → BAB III teknikal akan lebih padat
> - DahlanPOS menerapkan **zero-cost infrastructure** → highlight di bagian RAB & deployment
> - Alumni memisahkan realisasi **per peran individu** → ikuti pola ini untuk BAB III.2

> [!TIP]
> **Prioritas pengerjaan:**
> 1. Lengkapi dokumen administrasi (MoU, LogBook, Notulen) — ini **wajib** untuk lampiran
> 2. Buat diagram UML yang belum ada (Use Case, Activity, Sequence)
> 3. Capture screenshot tampilan akhir semua halaman
> 4. Lakukan pengujian SUS/UEQ dengan responden
> 5. Susun narasi BAB I–IV berdasarkan outline ini
