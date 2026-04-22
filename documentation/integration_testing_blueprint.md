# Integration Testing Blueprint — DahlanPOS Backend

**Versi:** 3.0
**Stack:** Go 1.25 · Gin · PostgreSQL 15 · pgx/v5
**Status:** Living Document — *Diperbarui: v3.0 refactor, kode implementasi dipindahkan ke file test aktual*

---

## Daftar Isi

1. [Tujuan dan Filosofi](#1-tujuan-dan-filosofi)
2. [Ruang Lingkup](#2-ruang-lingkup)
3. [Pendekatan dan Tooling](#3-pendekatan-dan-tooling)
4. [Arsitektur Test Environment](#4-arsitektur-test-environment)
5. [Pengelompokan Endpoint Berdasarkan Prioritas](#5-pengelompokan-endpoint-berdasarkan-prioritas)
6. [Skenario Test per Tier](#6-skenario-test-per-tier)
7. [Strategi Tambahan](#7-strategi-tambahan)
8. [Konvensi dan Standar Kode](#8-konvensi-dan-standar-kode)
9. [CI/CD Pipeline Integration](#9-cicd-pipeline-integration)
10. [Definition of Done](#10-definition-of-done)

---

## 1. Tujuan dan Filosofi

Integration Testing pada proyek ini bertujuan membuktikan bahwa **seluruh lapisan vertikal** — dari HTTP Handler, Middleware, Usecase, Repository, hingga PostgreSQL — bekerja bersama di bawah kondisi data nyata.

Berbeda dengan Unit Test yang mengisolasi logika bisnis via mock, Integration Test di sini bersifat **black-box terhadap komponen** namun **white-box terhadap database state**. Setiap tes menembak endpoint HTTP nyata dan memverifikasi perubahan yang terjadi langsung di tabel database.

### Prinsip Utama

| Prinsip | Penjelasan |
|---------|------------|
| **Real Database, No Mock DB** | Setiap tes berjalan melawan instance PostgreSQL nyata untuk menangkap edge case SQL seperti constraint violation dan deadlock. |
| **Isolated State** | Setiap test function mendapatkan database bersih — tidak ada data sisa dari test sebelumnya. |
| **Assert State, Not Just Response** | Keberhasilan dibuktikan oleh *dua* hal: HTTP response yang benar, **dan** state tabel database yang sesuai. |
| **Deterministic & Offline** | Test bisa berjalan di mesin developer tanpa koneksi internet dengan hasil yang konsisten di setiap run. |
| **Fast Feedback** | Target total waktu eksekusi seluruh suite di bawah 60 detik. |

---

## 2. Ruang Lingkup

### 2.1 Yang Diuji (In-Scope)

- Interaksi nyata Handler → Usecase → Repository → PostgreSQL
- Database constraints (UNIQUE, FK, CHECK) dan propagasinya ke HTTP response
- ACID transactions: Commit & Rollback (contoh: checkout gagal di tengah loop items)
- Logika stock deduction dan restorasi di dalam database transaction
- Auth middleware (JWT validation end-to-end)
- RBAC middleware (403 Forbidden untuk role tidak berwenang, 200 untuk role yang benar)
- Shift lifecycle: open → transaksi → close → kalkulasi discrepancy
- Business rule enforcement (shift duplikat, double void, akses antar-user)
- Query agregasi dan JOIN (laporan, dashboard summary)
- Pagination dan filtering pada endpoint list

### 2.2 Yang Tidak Diuji (Out-of-Scope)

- Unit Test logika murni (kalkulasi, string helper) → cukup di `unit_test` package
- Test menggunakan GoMock untuk Repository → dikategorikan sebagai Unit Test
- Frontend rendering, animasi, navigasi URL → tanggung jawab Playwright/Cypress
- Load & stress testing (throughput, p99 latency) → tanggung jawab k6/JMeter
- Google OAuth token validation nyata → gunakan dev bypass mode (GOOGLE_CLIENT_ID kosong)
- Cloudinary upload → di-mock di level test

---

## 3. Pendekatan dan Tooling

### 3.1 Stack Testing

| Komponen | Tool | Keterangan |
|----------|------|------------|
| HTTP Simulation | `net/http/httptest` | Native Go, tanpa spin-up OS port |
| Assertion | `testify/assert` & `testify/require` | `require` untuk precondition, `assert` untuk post-condition |
| Test DB | Docker container PostgreSQL 15 | Schema identik dengan production via migration files |
| DB Cleanup | `TRUNCATE ... RESTART IDENTITY CASCADE` | Dipanggil di awal setiap test function |
| Fixture/Seed | Helper functions `Insert*` | Typesafe, dipanggil inline di setiap test |

### 3.2 Struktur Folder

```
backend/internal/integration/
├── setup_test.go              # TestMain, ResetDB, BuildRouter
├── helpers_test.go            # Insert*, MakeAuthToken, MakeExpiredToken, DoRequest
├── auth_integration_test.go
├── shift_integration_test.go
├── transaction_integration_test.go
└── middleware_integration_test.go
```

> Semua file menggunakan build tag `//go:build integration` sehingga tidak ikut `go test ./...` biasa.

### 3.3 Cara Menjalankan

```bash
# Pastikan Docker container DB aktif terlebih dahulu
docker-compose up -d db

# Jalankan seluruh suite
TEST_DATABASE_URL="postgres://root:password123@127.0.0.1:5433/smallthings_test?sslmode=disable" \
  go test -v -tags integration ./internal/integration/... -timeout 120s

# Jalankan subset tertentu
go test -v -tags integration -run TestShift ./internal/integration/...
```

---

## 4. Arsitektur Test Environment

### 4.1 Lifecycle per Test Function

Setiap test function mengikuti pola yang sama secara konsisten:

1. **`ResetDB(t)`** — Truncate semua tabel operasional, re-insert singleton `settings`.
2. **`BuildRouter(t)`** — Bangun Gin router dengan semua dependensi nyata (production wiring).
3. **Seed data minimal** — Hanya data yang dibutuhkan test tersebut, via helper `Insert*`.
4. **Execute & Assert** — HTTP request via `DoRequest`, diikuti assertion DB state langsung.

### 4.2 Helper Tersedia

| Helper | Fungsi |
|--------|--------|
| `ResetDB(t)` | Bersihkan semua data, kembalikan DB ke state kosong |
| `BuildRouter(t)` | Bangun full Gin router dengan wiring production |
| `InsertOutlet(t, name)` | Seed outlet aktif, return UUID |
| `InsertUser(t, email, role, outletID)` | Seed user aktif, return UUID |
| `InsertProduct(t, name, price, stock, categoryID)` | Seed produk, return UUID |
| `InsertShift(t, userID, outletID, startingCash)` | Seed shift open, return UUID |
| `InsertCategory(t, name)` | Seed kategori, return UUID |
| `MakeAuthToken(t, userID, email, role, outletID)` | Generate JWT valid (exp 1 jam) |
| `MakeTokenWithSecret(t, wrongSecret)` | Generate JWT dengan secret salah (untuk security test) |
| `MakeExpiredToken(t)` | Generate JWT yang sudah expired (exp -1 jam) |
| `DoRequest(t, router, method, path, body, token)` | Eksekusi HTTP request via httptest |

### 4.3 Koneksi Database

Database test (`smallthings_test`) terpisah dari database production (`smallthings_db`). Migration dijalankan otomatis saat `TestMain` dengan membaca file `*.up.sql` secara sequential dari `backend/db/migrations/`.

---

## 5. Pengelompokan Endpoint Berdasarkan Prioritas

Prioritas ditentukan berdasarkan: **dampak bisnis** (kerugian jika bug lolos), **kompleksitas alur lintas komponen**, dan **tingkat risiko regresi**.

### Tier 1 — Critical Path (Zero Tolerance)

> Bug di area ini menyebabkan kerugian finansial langsung, data corrupt, atau sistem tidak bisa dipakai.

| # | Endpoint | Kenapa Critical | Skenario Wajib |
|---|----------|-----------------|----------------|
| 1 | `POST /cashier/transactions` | Stock deduction dalam DB transaction ACID | Happy path, stok tidak cukup (rollback), checkout di shift closed |
| 2 | `POST /cashier/transactions/:id/void` | Stock restore + status update | Happy path, double void, void milik kasir lain |
| 3 | `POST /cashier/shifts/open` | Validasi shift aktif per user | Happy path, shift duplikat |
| 4 | `POST /cashier/shifts/close` | Kalkulasi discrepancy + ownership | Happy path (angka benar), tutup shift orang lain |
| 5 | `POST /auth/login/oauth` | Auth flow end-to-end | Login sukses, user tidak terdaftar, user inactive |
| 6 | Auth Middleware | JWT validation seluruh sistem | Tanpa token (401), token expired (401), signature salah (401) |
| 7 | RBAC Middleware `RequireRole(owner)` | Role enforcement dua arah | Kasir ditolak (403), **owner diizinkan (200)** |

### Tier 2 — High Priority (Diuji Sebelum Release)

> Bug menyebabkan data tidak konsisten atau fitur bisnis utama tidak berjalan.

| # | Endpoint | Kenapa High Priority | Skenario Wajib |
|---|----------|----------------------|----------------|
| 8 | `POST /backoffice/products` | FK constraint category_id harus divalidasi; `modifier_group_ids` disimpan dalam transaksi terpisah | Happy path (produk tersimpan + modifier terhubung), category_id tidak valid → error |
| 9 | `PUT /backoffice/products/:id` | Update produk beserta modifier group linkage; Rollback jika modifier_group_id tidak ada | Happy path (data & modifier terupdate di DB), modifier_group_id invalid → error |
| 10 | `PATCH /backoffice/products/:id/stock` | `SetAbsoluteStock` harus set nilai absolut, bukan delta — bug disini = stok salah permanen | Happy path (stok di DB = nilai yang dikirim), stok negatif ditolak |
| 11 | `POST /backoffice/categories` | UNIQUE constraint pada nama kategori | Happy path (tersimpan), nama duplikat → error |
| 12 | `DELETE /backoffice/categories/:id` | FK guard — kategori yang dipakai produk tidak boleh dihapus | Hapus kategori kosong → 200, hapus kategori berisi produk → 409 |
| 13 | `DELETE /backoffice/modifier-groups/:id` | FK guard — modifier yang terhubung produk tidak boleh dihapus | Hapus modifier bebas → 200, hapus modifier terhubung produk → 409 |
| 14 | `GET /cashier/menu` | JOIN categories + modifier_groups + options; produk inactive tidak boleh muncul | Menu hanya berisi produk active, modifier_options ter-load, produk tanpa kategori tetap muncul |
| 15 | `GET /cashier/shifts/current/summary` | Agregasi cash sales + QRIS sales per shift harus akurat | Summary mencerminkan total transaksi aktif (paid), void tidak ikut dihitung |
| 16 | `GET /backoffice/dashboard/summary` | Agregasi multi-tabel lintas transaksi; angka salah = owner salah ambil keputusan | Revenue hari ini akurat, filter by outlet_id berfungsi |
| 17 | `GET /backoffice/reports/transactions` | Pagination + multi-filter (date, outlet, payment_method, search) | Happy path paginated, filter payment_method menghasilkan subset benar, filter date range berfungsi |
| 18 | `GET /backoffice/reports/shifts` | Filter by outlet_id + cashier_id + date range | Happy path paginated, filter cashier_id menghasilkan shift milik kasir tersebut saja |
| 19 | `GET /backoffice/reports/shifts/:id/summary` | Agregasi per-shift spesifik: total sales, void, cash, QRIS | Summary shift kosong (0 transaksi), summary shift dengan mix transaksi dan void |
| 20 | `PUT /backoffice/settings` | Singleton upsert JSONB — salah update = seluruh konfigurasi outlet berubah | Settings tersimpan di DB, GET setelah PUT mengembalikan nilai yang sama |

### Tier 3 — Standard Priority (Diuji per Sprint)

> Bug memengaruhi operasional tapi tidak menyebabkan kerugian langsung.

| # | Endpoint | Skenario Wajib |
|---|----------|----------------|
| 21 | `POST /backoffice/employees` | Happy path (tersimpan), email duplikat → error UNIQUE |
| 22 | `PATCH /backoffice/employees/:id/status` | Status `inactive` tersimpan di DB; user inactive tidak bisa login |
| 23 | `DELETE /backoffice/employees/:id` | Karyawan dengan riwayat shift tidak bisa dihapus → 409 |
| 24 | `POST /backoffice/outlets` | Happy path, nama duplikat → error |
| 25 | `PATCH /backoffice/outlets/:id/status` | Status tersimpan di DB |
| 26 | `DELETE /backoffice/outlets/:id` | Outlet dengan riwayat shift/transaksi tidak bisa dihapus → 409 |
| 27 | `GET /cashier/transactions` | Hanya transaksi dari outlet JWT yang tampil (auto-filter) |
| 28 | `GET /cashier/transactions/:id` | Items dengan JSONB modifier ter-load, 404 jika ID tidak ada |
| 29 | `GET /backoffice/employees/activity` | Filter by employee_id + activity_type + date range berfungsi |

### Tier 4 — Low Priority (Best Effort)

| # | Endpoint | Catatan |
|---|----------|---------|
| 30 | `GET /health` | Smoke test, harus 200 |
| 31 | `POST /auth/logout` | Stateless JWT; hanya pastikan activity log tercatat |
| 32 | `DELETE /backoffice/products/:id` | FK guard ke transaction_items — produk dengan riwayat transaksi → 409 |
| 33 | `GET /cashier/shifts/current` | Return null jika tidak ada shift aktif, return shift jika ada |
| 34 | `GET /backoffice/settings` | Selalu ada tepat satu row, tidak pernah 404 |
| 35 | `GET /public/receipts/:id` | Public endpoint tanpa auth, 404 jika tidak ada |

---

## 6. Skenario Test per Tier

### 6.1 Tier 1 — Transaksi

**File:** `transaction_integration_test.go`

| Test Function | Skenario | Assert HTTP | Assert DB |
|---------------|----------|-------------|-----------|
| `Checkout_DeductsStock` | Checkout 2 qty dari stok 10 | 201 Created | `stock = 8` |
| `Checkout_Fails_InsufficientStock` | Checkout 3 qty dari stok 1 | bukan 201 | `stock = 1` (tidak berubah) |
| `Checkout_Fails_OnClosedShift` | Checkout ke shift yang sudah closed | 422 | `stock` tidak berubah |
| `VoidTransaction_RestoresStock` | Void transaksi yang valid | 200 OK | `stock` kembali ke semula |
| `VoidTransaction_PreventDoubleVoid` | Void transaksi yang sudah di-void | bukan 200 | `stock` tidak naik 2x |
| `VoidTransaction_BlocksCrossUserVoid` | Kasir2 void transaksi kasir1 | bukan 200 | `payment_status = 'paid'` |

### 6.2 Tier 1 — Shift Lifecycle

**File:** `shift_integration_test.go`

| Test Function | Skenario | Assert HTTP | Assert DB |
|---------------|----------|-------------|-----------|
| `OpenShift_PreventsDuplicate` | Buka shift kedua saat ada yang aktif | shift-1: 201, shift-2: 422 | `COUNT shifts open = 1` |
| `CloseShift_CalculatesDiscrepancyCorrectly` | Tutup shift dengan ending_cash 260k, expected 250k | 200 OK | `discrepancy = 10000`, `expected_cash = 250000` |
| `CloseShift_BlocksCrossUserAccess` | Kasir2 tutup shift kasir1 | 422 | `status = 'open'` |

### 6.3 Tier 1 — Auth & Security

**File:** `auth_integration_test.go`, `middleware_integration_test.go`

| Test Function | Skenario | Assert HTTP |
|---------------|----------|-------------|
| `Auth_LoginOAuth_Success` | Login valid dengan dev bypass | 200, body memiliki `token` non-empty |
| `Auth_LoginOAuth_Unregistered` | Email tidak ada di DB | 403 |
| `Auth_LoginOAuth_InactiveUser` | User status = inactive | 403 |
| `Auth_UnauthorizedWithoutToken` | Request tanpa header Authorization | 401 |
| `Auth_InvalidSignature_Returns401` | Token di-sign dengan secret salah | 401 |
| `Auth_ExpiredToken_Returns401` | Token dengan `exp` di masa lalu | 401 |
| `RBAC_CashierForbiddenFromBackoffice` | Kasir akses 4 endpoint backoffice | 403 semua |
| `RBAC_OwnerCanAccessBackoffice` | Owner akses 3 endpoint backoffice | bukan 403/401 |

### 6.4 Tier 2 — Produk & Kategori

**File:** `backoffice_integration_test.go` (belum dibuat)

| Test Function | Skenario | Assert HTTP | Assert DB |
|---------------|----------|-------------|-----------|
| `CreateProduct_WithCategory_Succeeds` | Buat produk dengan category_id valid | 201 | Row di `products` dengan `category_id` benar |
| `CreateProduct_WithModifiers_LinksGroups` | Buat produk dengan modifier_group_ids | 201 | Row di `product_modifier_groups` ter-insert |
| `CreateProduct_InvalidCategory_Fails` | Buat produk dengan category_id tidak ada | error (4xx/5xx) | Tidak ada row baru di `products` |
| `UpdateProduct_StockPatch_SetsAbsolute` | PATCH stock dari 10 → 3 | 200 | `stock = 3` (bukan `stock = 10 - 3`) |
| `CreateCategory_DuplicateName_Fails` | Buat kategori dengan nama yang sudah ada | error (4xx) | Tetap 1 row kategori bernama itu |
| `DeleteCategory_WithProducts_Returns409` | Hapus kategori yang masih dipakai produk | 409 | Kategori masih ada di DB |
| `DeleteCategory_EmptyCategory_Succeeds` | Hapus kategori tanpa produk | 200 | Row terhapus dari `categories` |
| `DeleteModifier_LinkedToProduct_Returns409` | Hapus modifier yang terhubung produk | 409 | Modifier masih ada di DB |

### 6.5 Tier 2 — Menu & Agregasi

**File:** `backoffice_integration_test.go` (belum dibuat)

| Test Function | Skenario | Assert HTTP | Assert DB / Response |
|---------------|----------|-------------|----------------------|
| `GetMenu_OnlyActiveProducts` | Seed produk active + inactive | 200 | Response hanya berisi produk `is_active = true` |
| `GetMenu_LoadsModifierOptions` | Produk dengan modifier group | 200 | Response berisi `modifier_groups` dan `options` tersarang |
| `ShiftSummary_ExcludesVoidedTransactions` | 2 transaksi cash, 1 di-void | 200 | `cash_sales` = total 1 transaksi saja |
| `DashboardSummary_FilterByOutlet` | 2 outlet, masing-masing punya transaksi | 200 | Revenue menunjukkan hanya outlet yang di-filter |
| `ReportTransactions_FilterByPaymentMethod` | Mix cash + QRIS transactions | 200 | Hasil hanya berisi payment_method yang di-filter |
| `ReportShifts_FilterByCashier` | 2 kasir punya shift masing-masing | 200 | Hasil hanya shift milik cashier_id yang di-filter |
| `ReportShiftSummary_EmptyShift` | Shift tanpa transaksi | 200 | `total_sales = 0`, `total_transactions = 0` |
| `Settings_UpdateAndGet_Consistent` | Update settings lalu GET | PUT: 200, GET: 200 | Nilai yang di-GET sama dengan yang di-PUT |

---

## 7. Strategi Tambahan

### 7.1 Isolasi Database

Pendekatan utama menggunakan **TRUNCATE + RESTART IDENTITY CASCADE** yang dipanggil di awal setiap test. Strategi ini dipilih karena:
- Lebih mudah di-debug (state DB bersih total)
- Bekerja untuk test yang melibatkan COMMIT nyata (seperti stock deduction + transaction insert)

Alternatif: *transaction rollback pattern* — wrap test dalam `pgx.Tx` dan rollback di akhir. Lebih cepat, tapi tidak bisa digunakan untuk test yang menguji concurrent behavior atau deferred constraints.

### 7.2 Table-Driven Tests

Untuk endpoint yang memiliki banyak variasi input (misalnya validasi jam operasional shift), gunakan table-driven test dengan struct slice. Setiap case mendapat `ResetDB` dan `BuildRouter` sendiri untuk menjaga isolasi.

### 7.3 Race Condition Testing

Untuk valdasi advisory lock di `transaction_repo.Create()` (mencegah duplicate `order_id`), jalankan concurrent checkout dengan goroutine. Semua goroutine harus berhasil dengan `order_id` yang unik — tidak ada primary key conflict.

### 7.4 Contract Testing

Setiap response harus memenuhi envelope standar: `{ "success": bool, "data": any }` untuk sukses, `{ "success": false, "error": { "code": string, "message": string } }` untuk error. Validasi shape response ini penting untuk konsistensi kontrak dengan frontend.

### 7.5 Flaky Test Prevention

Test yang bergantung pada waktu (misalnya jam operasional shift) harus menggunakan window yang aman:
- Jam operasional `00:00–23:59` untuk skenario "selalu terbuka"
- Window sempit di masa lalu (`03:00–03:01`) untuk skenario "sudah tutup"
- Hindari hardcode jam seperti `09:00–17:00` yang akan flaky di luar jam tersebut

### 7.6 Kategori Negative Case

Setiap endpoint Tier 1 dan Tier 2 wajib memiliki setidaknya satu negative case dari kategori berikut:

| Kategori | Contoh |
|----------|--------|
| **Missing Auth** | Request tanpa header `Authorization` → 401 |
| **Wrong Role** | Kasir akses endpoint owner → 403 |
| **Invalid UUID** | Path param bukan UUID valid → 400 |
| **Non-existent Resource** | Void transaksi ID yang tidak ada → 422 |
| **Business Rule Violation** | Double void, shift duplikat → 422 |
| **DB Constraint Violation** | FK tidak valid, UNIQUE conflict → 4xx |
| **Closed State Action** | Transaksi di shift closed → 422 |

---

## 8. Konvensi dan Standar Kode

### 8.1 Pola Anatomi Test

Setiap test function mengikuti struktur **Setup → Action → Assert** secara konsisten:

1. `ResetDB(t)` dan `BuildRouter(t)` di baris pertama
2. Seed data minimal yang dibutuhkan (via helper `Insert*`)
3. Satu HTTP request via `DoRequest`
4. Assert HTTP status code
5. Assert DB state secara langsung via `testDB.QueryRow`

### 8.2 Naming Convention

| Elemen | Konvensi | Contoh |
|--------|----------|--------|
| Test function | `TestIntegration_[Domain]_[Skenario]` | `TestIntegration_Checkout_DeductsStock` |
| Helper insert | `Insert[Entity](t, ...)` | `InsertOutlet`, `InsertProduct` |
| Helper token | `Make*Token(t, ...)` | `MakeAuthToken`, `MakeExpiredToken` |

### 8.3 Checklist Sebelum Merge PR

**Tier 1 Critical Path (Zero Tolerance):**
- [ ] Semua test Tier 1 lulus (18 test aktual)
- [ ] Positive RBAC test ada: owner berhasil akses backoffice
- [ ] Security test ada: expired token → 401, tampered signature → 401
- [ ] Double-action test ada: double void ditolak
- [ ] Ownership test ada: kasir lain tidak bisa void/close milik kasir pertama
- [ ] Closed-state test ada: checkout di shift closed ditolak

**Standar Umum:**
- [ ] Setiap test memanggil `ResetDB(t)` sebagai baris pertama
- [ ] Tidak ada dependensi urutan eksekusi antar test
- [ ] Tidak ada hardcoded UUID atau timestamp
- [ ] Negative case minimal ada satu per endpoint baru
- [ ] Total waktu suite < 60 detik di mesin lokal

---

## 9. CI/CD Pipeline Integration

### 9.1 GitHub Actions

Workflow ditempatkan di `.github/workflows/integration-test.yml` dengan triggger pada setiap Pull Request ke branch `main` dan `develop`.

**Service yang dijalankan:** PostgreSQL 15 container dengan health check `pg_isready`.

**Steps:**
1. Checkout kode
2. Setup Go 1.25
3. Jalankan migration via `*.up.sql` files
4. Jalankan integration test dengan env `TEST_DATABASE_URL`
5. Upload coverage report sebagai artifact

### 9.2 Gate Policy

| Kondisi | Aksi CI |
|---------|---------|
| Ada test Tier 1 atau Tier 2 yang gagal | ❌ Block merge |
| Ada test Tier 3/4 yang gagal | ⚠️ Warning, tidak block |
| Coverage integration < 60% | ⚠️ Warning, tidak block |
| Test timeout > 120 detik | ❌ Block merge |

---

## 10. Definition of Done

Sebuah fitur dianggap **siap production** jika memenuhi semua kriteria berikut:

| Kriteria | Tolok Ukur |
|----------|------------|
| **Integration Test Tier 1** | 100% skenario happy & sad path lulus |
| **Integration Test Tier 2** | Minimal happy path lulus |
| **DB State Verified** | Setiap test Tier 1 punya minimal satu assertion langsung ke database |
| **Negative Case Covered** | Minimal 1 negative case per endpoint baru |
| **No Flaky Tests** | Test lulus 3 kali berturut-turut di CI |
| **Performance** | Total suite waktu < 60 detik |

---

> Kode implementasi selengkapnya tersedia di `backend/internal/integration/`. Dokumen ini hanya mendefinisikan **apa** yang diuji dan **mengapa** — bukan **bagaimana** kode ditulis secara detail.
>
> *Dokumen ini hidup dan harus diperbarui setiap kali ada penambahan endpoint atau perubahan business rule signifikan.*