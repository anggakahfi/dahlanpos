# Integration Testing Blueprint — Small Things Coffee POS Backend

**Versi:** 2.0  
**Stack:** Go 1.25 · Gin · PostgreSQL 15 · pgx/v5  
**Status:** Living Document  

---

## Daftar Isi

1. [Tujuan dan Filosofi](#1-tujuan-dan-filosofi)
2. [Ruang Lingkup (In-Scope vs Out-of-Scope)](#2-ruang-lingkup)
3. [Pendekatan dan Tooling](#3-pendekatan-dan-tooling)
4. [Arsitektur Test Environment](#4-arsitektur-test-environment)
5. [Pengelompokan Endpoint Berdasarkan Prioritas](#5-pengelompokan-endpoint-berdasarkan-prioritas)
6. [Skenario Test per Kelompok](#6-skenario-test-per-kelompok)
7. [Strategi Tambahan](#7-strategi-tambahan)
8. [Anatomi dan Konvensi Kode](#8-anatomi-dan-konvensi-kode)
9. [CI/CD Pipeline Integration](#9-cicd-pipeline-integration)
10. [Definition of Done](#10-definition-of-done)

---

## 1. Tujuan dan Filosofi

Integration Testing pada proyek ini bertujuan membuktikan bahwa **seluruh lapisan vertikal** — mulai dari HTTP Handler, Middleware, Usecase, Repository, hingga PostgreSQL — bekerja bersama sebagaimana mestinya di bawah kondisi data nyata.

Berbeda dengan Unit Test yang mengisolasi logika bisnis menggunakan mock, Integration Test di sini bersifat **black-box terhadap komponen**, namun **white-box terhadap database state**. Setiap tes menembak endpoint HTTP sungguhan dan kemudian memverifikasi perubahan yang terjadi di dalam database.

### Prinsip Utama

| Prinsip | Penjelasan |
|---------|------------|
| **Real Database, No Mock DB** | Setiap tes berjalan melawan instance PostgreSQL nyata (bukan in-memory stub) untuk menangkap edge case SQL seperti constraint violation dan deadlock. |
| **Isolated State** | Setiap test function mendapatkan database bersih — tidak ada data sisa dari test sebelumnya yang bisa mencemari hasil. |
| **Assert State, Not Just Response** | Keberhasilan sebuah tes dibuktikan oleh *dua* hal: HTTP response code/body yang benar, **dan** kondisi tabel database yang sesuai. |
| **Deterministic & Offline** | Test harus bisa berjalan di mesin developer tanpa koneksi internet dan menghasilkan hasil yang sama di setiap run. |
| **Fast Feedback** | Target total waktu eksekusi seluruh suite di bawah 60 detik menggunakan satu Docker container database. |

---

## 2. Ruang Lingkup

### 2.1 Yang Diuji (In-Scope)

```
✅ Interaksi nyata Handler → Usecase → Repository → PostgreSQL
✅ Database constraints (UNIQUE, FK, CHECK) dan bagaimana error-nya dipropagasi ke HTTP response
✅ ACID transactions: Commit & Rollback (contoh: checkout gagal di tengah loop items)
✅ Logika stock deduction yang berjalan di dalam database transaction
✅ Auth middleware (JWT validation end-to-end)
✅ RBAC middleware (403 Forbidden untuk role yang tidak berwenang)
✅ Shift lifecycle: open → transaksi → close → kalkulasi discrepancy
✅ Business rule enforcement (misal: tidak bisa buka shift jika sudah ada shift aktif)
✅ Query agregasi dan JOIN (laporan, dashboard summary)
✅ Pagination dan filtering pada endpoint list
```

### 2.2 Yang Tidak Diuji (Out-of-Scope)

```
❌ Unit Test logika murni (kalkulasi, string helper) → ke unit_test package
❌ Tests yang masih menggunakan GoMock untuk Repository → itu Unit Test, bukan Integration Test
❌ Frontend rendering, animasi, navigasi URL → tanggung jawab Cypress/Playwright
❌ Load & stress testing (throughput, p99 latency) → tanggung jawab k6/JMeter
❌ Third-party real calls: Google OAuth token validation → gunakan test bypass mode
❌ Resend API email delivery → di-mock sebagai fire-and-forget
❌ Cloudinary upload → di-mock di level handler test
```

---

## 3. Pendekatan dan Tooling

### 3.1 Stack Testing

| Komponen | Tool | Keterangan |
|----------|------|------------|
| HTTP Simulation | `net/http/httptest` + `httptest.NewRecorder()` | Native Go, tanpa spin-up OS port |
| Assertion | `github.com/stretchr/testify/assert` & `require` | `require` untuk precondition, `assert` untuk post-condition |
| Test DB Setup | Docker + `golang-migrate` | PostgreSQL container yang sama dengan production schema |
| DB Cleanup | Truncate dengan `RESTART IDENTITY CASCADE` | Per-test isolation |
| Fixture/Seed | Helper function `InsertTestFixture(t, db, ...)` | Reusable, typesafe |

### 3.2 Struktur Folder

```
backend/
└── internal/
    └── integration/
        ├── setup_test.go          # TestMain, SetupIntegrationEnv, teardown
        ├── helpers_test.go        # InsertTestFixture, MakeAuthToken, helpers
        ├── auth_integration_test.go
        ├── shift_integration_test.go
        ├── transaction_integration_test.go
        ├── backoffice_integration_test.go
        └── middleware_integration_test.go
```

> **Konvensi build tag:** Semua file integration test menggunakan tag `//go:build integration` di baris pertama sehingga tidak ikut dalam `go test ./...` biasa — hanya dijalankan saat ada flag `-tags integration`.

### 3.3 Cara Menjalankan

```bash
# Jalankan hanya integration tests
go test -v -tags integration ./internal/integration/... -timeout 120s

# Jalankan dengan coverage
go test -v -tags integration -coverprofile=coverage_integration.out ./internal/integration/...

# Jalankan subset tertentu
go test -v -tags integration -run TestShift ./internal/integration/...
```

---

## 4. Arsitektur Test Environment

### 4.1 Setup & Teardown Lifecycle

```
TestMain()
│
├── 1. Parse DATABASE_URL dari environment / default test URL
├── 2. Ping DB — gagal jika DB belum siap (docker-compose up)
├── 3. Run migrations (golang-migrate) → skema terbaru
├── 4. Jalankan seluruh test suite
└── 5. (Opsional) Drop test tables jika diperlukan

SetupTest() — per test function
│
├── 1. Truncate semua tabel operasional dengan RESTART IDENTITY CASCADE
├── 2. Seed data fixture minimal yang dibutuhkan test ini
└── 3. Build Gin router dengan konfigurasi yang sama dengan production

TeardownTest() — per test function
└── 1. Rollback jika ada transaksi yang terbuka
```

### 4.2 Helper Setup

```go
// internal/integration/setup_test.go

//go:build integration

package integration_test

import (
    "context"
    "net/http"
    "os"
    "testing"

    "github.com/gin-gonic/gin"
    "github.com/jackc/pgx/v5/pgxpool"
    "github.com/smallthingscoffee/pos-backend/internal/config"
    // ... semua imports
)

var (
    testDB  *pgxpool.Pool
    testApp *gin.Engine
)

func TestMain(m *testing.M) {
    gin.SetMode(gin.TestMode)

    dbURL := os.Getenv("TEST_DATABASE_URL")
    if dbURL == "" {
        dbURL = "postgres://root:password123@127.0.0.1:5433/smallthings_test?sslmode=disable"
    }

    var err error
    testDB, err = pgxpool.New(context.Background(), dbURL)
    if err != nil {
        panic("failed to connect to test database: " + err.Error())
    }
    defer testDB.Close()

    runMigrations(dbURL) // Jalankan migrate up

    os.Exit(m.Run())
}

// ResetDB dipanggil di awal setiap test untuk isolasi penuh
func ResetDB(t *testing.T) {
    t.Helper()
    _, err := testDB.Exec(context.Background(), `
        TRUNCATE TABLE
            transaction_items, transactions, shifts,
            activity_logs, product_modifier_groups,
            products, modifier_options, modifier_groups,
            categories, users, outlets, settings
        RESTART IDENTITY CASCADE;
        -- Re-insert singleton settings row
        INSERT INTO settings (id) VALUES (1) ON CONFLICT DO NOTHING;
    `)
    if err != nil {
        t.Fatalf("failed to reset db: %v", err)
    }
}

// BuildRouter membangun Gin router dengan semua dependensi nyata
func BuildRouter(t *testing.T) *gin.Engine {
    t.Helper()
    cfg := &config.Config{
        JWTSecret:      "integration-test-secret",
        GoogleClientID: "", // Trigger dev bypass
        CORSOrigin:     "http://localhost:3000",
    }
    // ... wire up semua repo, usecase, handler seperti main.go
    // return router
}
```

### 4.3 Fixture Helpers

```go
// internal/integration/helpers_test.go

//go:build integration

func InsertOutlet(t *testing.T, name string) uuid.UUID {
    t.Helper()
    var id uuid.UUID
    err := testDB.QueryRow(context.Background(),
        `INSERT INTO outlets (name, status) VALUES ($1, 'active') RETURNING id`, name,
    ).Scan(&id)
    require.NoError(t, err)
    return id
}

func InsertUser(t *testing.T, email string, role domain.UserRole, outletID *uuid.UUID) uuid.UUID {
    t.Helper()
    var id uuid.UUID
    err := testDB.QueryRow(context.Background(),
        `INSERT INTO users (name, email, role, outlet_id, status)
         VALUES ($1, $2, $3, $4, 'active') RETURNING id`,
        email, email, role, outletID,
    ).Scan(&id)
    require.NoError(t, err)
    return id
}

func InsertProduct(t *testing.T, name string, price float64, stock int, categoryID *uuid.UUID) uuid.UUID {
    t.Helper()
    var id uuid.UUID
    err := testDB.QueryRow(context.Background(),
        `INSERT INTO products (name, price, stock, unit, is_active, category_id)
         VALUES ($1, $2, $3, 'pcs', true, $4) RETURNING id`,
        name, price, stock, categoryID,
    ).Scan(&id)
    require.NoError(t, err)
    return id
}

func MakeAuthToken(t *testing.T, userID uuid.UUID, email string, role domain.UserRole, outletID *uuid.UUID) string {
    t.Helper()
    claims := jwt.MapClaims{
        "user_id": userID.String(),
        "email":   email,
        "role":    string(role),
        "exp":     time.Now().Add(time.Hour).Unix(),
    }
    if outletID != nil {
        claims["outlet_id"] = outletID.String()
    }
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    str, err := token.SignedString([]byte("integration-test-secret"))
    require.NoError(t, err)
    return str
}

func DoRequest(t *testing.T, router *gin.Engine, method, path, body, token string) *httptest.ResponseRecorder {
    t.Helper()
    var reqBody io.Reader
    if body != "" {
        reqBody = strings.NewReader(body)
    }
    req := httptest.NewRequest(method, path, reqBody)
    req.Header.Set("Content-Type", "application/json")
    if token != "" {
        req.Header.Set("Authorization", "Bearer "+token)
    }
    w := httptest.NewRecorder()
    router.ServeHTTP(w, req)
    return w
}
```

---

## 5. Pengelompokan Endpoint Berdasarkan Prioritas

Prioritas ditentukan berdasarkan tiga faktor: **dampak bisnis** (kerugian jika bug lolos), **kompleksitas alur lintas komponen**, dan **tingkat risiko regresi**.

### Tier 1 — Critical Path (Wajib Ada, Zero Tolerance)

> Bug di area ini menyebabkan kerugian finansial langsung, data corrupt, atau sistem tidak bisa digunakan sama sekali.

| No | Endpoint | Kenapa Critical |
|----|----------|-----------------|
| 1 | `POST /cashier/transactions` | Stock deduction + DB transaction ACID; bug = stok minus atau double deduct |
| 2 | `POST /cashier/transactions/:id/void` | Stock restore + status update; bug = stok tidak kembali atau double void |
| 3 | `POST /cashier/shifts/open` | Validasi shift aktif + jam operasional; bug = kasir bisa buka shift duplikat |
| 4 | `POST /cashier/shifts/close` | Kalkulasi discrepancy + RBAC ownership; bug = kasir tutup shift orang lain |
| 5 | `POST /api/v1/auth/login/oauth` | Auth flow end-to-end; bug = akun inactive bisa login |
| 6 | Auth Middleware (semua endpoint) | JWT validation; bug = unauthenticated access ke seluruh sistem |
| 7 | RBAC Middleware — `RequireRole(owner)` | Role enforcement; bug = kasir bisa akses backoffice |

### Tier 2 — High Priority (Penting, Diuji Sebelum Setiap Release)

> Bug di sini menyebabkan data tidak konsisten atau fitur bisnis utama tidak berjalan.

| No | Endpoint | Kenapa High Priority |
|----|----------|----------------------|
| 8 | `POST /backoffice/products` | FK category_id constraint, SetModifierGroups transaction |
| 9 | `PATCH /backoffice/products/:id/stock` | SetAbsoluteStock vs delta; bug = stok salah set |
| 10 | `DELETE /backoffice/categories/:id` | FK constraint check, error 409 jika masih dipakai produk |
| 11 | `GET /cashier/shifts/current/summary` | Agregasi cash sales per shift |
| 12 | `GET /cashier/menu` | JOIN categories + modifier_groups; bug = menu tidak tampil |
| 13 | `GET /backoffice/dashboard/summary` | Query agregasi multi-tabel; bug = angka laporan salah |
| 14 | `GET /backoffice/reports/transactions` | Pagination, filter date + outlet + payment_method |
| 15 | `GET /backoffice/reports/shifts` | Filter, pagination; bug = laporan shift tidak akurat |

### Tier 3 — Standard Priority (Diuji per Sprint)

> Bug di sini memengaruhi operasional tapi tidak menyebabkan kerugian langsung.

| No | Endpoint | Catatan |
|----|----------|---------|
| 16 | CRUD `/backoffice/employees` | Status toggle, email constraint |
| 17 | CRUD `/backoffice/outlets` | Status patch, delete FK guard |
| 18 | CRUD `/backoffice/modifier-groups` | Delete+cascade options, FK guard |
| 19 | `GET /cashier/transactions` | Filter by outlet_id dari JWT claims |
| 20 | `GET /cashier/transactions/:id` | Load items dengan JSON modifier |
| 21 | `PUT /backoffice/settings` | Singleton upsert JSONB |
| 22 | `GET /public/receipts/:id` | Public endpoint, no auth |
| 23 | `GET /backoffice/employees/activity` | Filter + pagination activity logs |

### Tier 4 — Low Priority (Best Effort)

> Edge case atau fitur jarang digunakan.

| No | Endpoint | Catatan |
|----|----------|---------|
| 24 | `GET /health` | Smoke test saja |
| 25 | `POST /auth/logout` | Stateless JWT; hanya log activity |
| 26 | `DELETE /backoffice/products/:id` | FK guard ke transaction_items |
| 27 | `GET /cashier/shifts/current` | Delegate ke FindOpenByUser |

---

## 6. Skenario Test per Kelompok

### 6.1 Tier 1 — Transaction Checkout Flow

```go
//go:build integration

package integration_test

// ─── Test: Checkout mengurangi stok di database ───────────────

func TestIntegration_Checkout_DeductsStock(t *testing.T) {
    // SETUP
    ResetDB(t)
    router := BuildRouter(t)

    outletID := InsertOutlet(t, "Test Outlet")
    userID := InsertUser(t, "kasir@test.com", domain.RoleCashier, &outletID)
    productID := InsertProduct(t, "Kopi Susu", 15000, 10, nil)
    shiftID := InsertShift(t, userID, outletID, 100000)
    token := MakeAuthToken(t, userID, "kasir@test.com", domain.RoleCashier, &outletID)

    payload := fmt.Sprintf(`{
        "shift_id": "%s", "outlet_id": "%s",
        "payment_method": "cash",
        "subtotal": 30000, "tax_amount": 0,
        "discount_amount": 0, "total_amount": 30000,
        "items": [{"product_id": "%s", "product_name": "Kopi Susu",
                   "quantity": 2, "unit_price": 15000, "modifiers": []}]
    }`, shiftID, outletID, productID)

    // ACTION
    w := DoRequest(t, router, "POST", "/api/v1/cashier/transactions", payload, token)

    // ASSERT: HTTP response
    assert.Equal(t, http.StatusCreated, w.Code)

    var resp map[string]interface{}
    require.NoError(t, json.Unmarshal(w.Body.Bytes(), &resp))
    assert.True(t, resp["success"].(bool))

    // ASSERT: Database state — stok HARUS berkurang 2
    var stockAfter int
    err := testDB.QueryRow(context.Background(),
        `SELECT stock FROM products WHERE id = $1`, productID,
    ).Scan(&stockAfter)
    require.NoError(t, err)
    assert.Equal(t, 8, stockAfter, "Stok harus berkurang dari 10 menjadi 8")
}

// ─── Test: Checkout gagal jika stok tidak cukup ──────────────

func TestIntegration_Checkout_Fails_InsufficientStock(t *testing.T) {
    ResetDB(t)
    router := BuildRouter(t)

    outletID := InsertOutlet(t, "Test Outlet")
    userID := InsertUser(t, "kasir@test.com", domain.RoleCashier, &outletID)
    productID := InsertProduct(t, "Stok Sedikit", 10000, 1, nil) // stock = 1
    shiftID := InsertShift(t, userID, outletID, 50000)
    token := MakeAuthToken(t, userID, "kasir@test.com", domain.RoleCashier, &outletID)

    payload := fmt.Sprintf(`{
        "shift_id": "%s", "outlet_id": "%s",
        "payment_method": "cash",
        "subtotal": 30000, "tax_amount": 0,
        "discount_amount": 0, "total_amount": 30000,
        "items": [{"product_id": "%s", "product_name": "Stok Sedikit",
                   "quantity": 3, "unit_price": 10000, "modifiers": []}]
    }`, shiftID, outletID, productID)

    w := DoRequest(t, router, "POST", "/api/v1/cashier/transactions", payload, token)

    // Stock 1 < qty 3; UPDATE ... WHERE stock >= $1 tidak mengenai row
    // Pastikan stok TIDAK berubah (rollback berjalan)
    var stockAfter int
    testDB.QueryRow(context.Background(),
        `SELECT stock FROM products WHERE id = $1`, productID,
    ).Scan(&stockAfter)
    assert.Equal(t, 1, stockAfter, "Stok tidak boleh berubah jika checkout gagal")
}

// ─── Test: Void Transaction mengembalikan stok ───────────────

func TestIntegration_VoidTransaction_RestoresStock(t *testing.T) {
    ResetDB(t)
    router := BuildRouter(t)

    outletID := InsertOutlet(t, "Test Outlet")
    userID := InsertUser(t, "kasir@test.com", domain.RoleCashier, &outletID)
    productID := InsertProduct(t, "Produk Void", 20000, 10, nil)
    shiftID := InsertShift(t, userID, outletID, 100000)
    token := MakeAuthToken(t, userID, "kasir@test.com", domain.RoleCashier, &outletID)

    // Buat transaksi terlebih dahulu
    checkoutPayload := fmt.Sprintf(`{
        "shift_id": "%s", "outlet_id": "%s",
        "payment_method": "cash", "subtotal": 20000,
        "tax_amount": 0, "discount_amount": 0, "total_amount": 20000,
        "items": [{"product_id": "%s", "product_name": "Produk Void",
                   "quantity": 1, "unit_price": 20000, "modifiers": []}]
    }`, shiftID, outletID, productID)

    w := DoRequest(t, router, "POST", "/api/v1/cashier/transactions", checkoutPayload, token)
    require.Equal(t, http.StatusCreated, w.Code)

    var createResp struct {
        Data struct{ ID string `json:"id"` } `json:"data"`
    }
    json.Unmarshal(w.Body.Bytes(), &createResp)
    txnID := createResp.Data.ID

    // Void transaksi
    wVoid := DoRequest(t, router, "POST",
        "/api/v1/cashier/transactions/"+txnID+"/void", "", token)
    assert.Equal(t, http.StatusOK, wVoid.Code)

    // Stok harus kembali ke 10
    var stockAfter int
    testDB.QueryRow(context.Background(),
        `SELECT stock FROM products WHERE id = $1`, productID,
    ).Scan(&stockAfter)
    assert.Equal(t, 10, stockAfter, "Stok harus kembali ke 10 setelah void")
}
```

### 6.2 Tier 1 — Shift Lifecycle

```go
// ─── Test: Open Shift sukses dan tolak duplikat ──────────────

func TestIntegration_OpenShift_PreventsDuplicate(t *testing.T) {
    ResetDB(t)
    router := BuildRouter(t)

    outletID := InsertOutlet(t, "Outlet A")
    userID := InsertUser(t, "kasir@test.com", domain.RoleCashier, &outletID)
    token := MakeAuthToken(t, userID, "kasir@test.com", domain.RoleCashier, &outletID)

    payload := fmt.Sprintf(`{"outlet_id": "%s", "starting_cash": 500000}`, outletID)

    // Buka shift pertama — harus sukses
    w1 := DoRequest(t, router, "POST", "/api/v1/cashier/shifts/open", payload, token)
    assert.Equal(t, http.StatusCreated, w1.Code)

    // Coba buka shift kedua — harus ditolak
    w2 := DoRequest(t, router, "POST", "/api/v1/cashier/shifts/open", payload, token)
    assert.Equal(t, http.StatusUnprocessableEntity, w2.Code)

    // Verifikasi hanya 1 shift open di DB
    var count int
    testDB.QueryRow(context.Background(),
        `SELECT COUNT(*) FROM shifts WHERE user_id = $1 AND status = 'open'`, userID,
    ).Scan(&count)
    assert.Equal(t, 1, count)
}

// ─── Test: Close Shift kalkulasi discrepancy benar ───────────

func TestIntegration_CloseShift_CalculatesDiscrepancyCorrectly(t *testing.T) {
    ResetDB(t)
    router := BuildRouter(t)

    outletID := InsertOutlet(t, "Outlet B")
    userID := InsertUser(t, "kasir@test.com", domain.RoleCashier, &outletID)
    productID := InsertProduct(t, "Item Close", 50000, 100, nil)
    shiftID := InsertShift(t, userID, outletID, 200000) // starting_cash 200.000
    token := MakeAuthToken(t, userID, "kasir@test.com", domain.RoleCashier, &outletID)

    // Buat 1 transaksi cash 50.000
    checkoutPayload := fmt.Sprintf(`{
        "shift_id": "%s", "outlet_id": "%s", "payment_method": "cash",
        "subtotal": 50000, "tax_amount": 0, "discount_amount": 0, "total_amount": 50000,
        "items": [{"product_id": "%s", "product_name": "Item Close",
                   "quantity": 1, "unit_price": 50000, "modifiers": []}]
    }`, shiftID, outletID, productID)
    DoRequest(t, router, "POST", "/api/v1/cashier/transactions", checkoutPayload, token)

    // Kasir memasukkan ending_cash 260.000 (padahal expected = 200k + 50k = 250k)
    closePayload := fmt.Sprintf(`{
        "shift_id": "%s", "ending_cash": 260000, "discrepancy_note": ""
    }`, shiftID)
    wClose := DoRequest(t, router, "POST", "/api/v1/cashier/shifts/close", closePayload, token)
    assert.Equal(t, http.StatusOK, wClose.Code)

    // Verifikasi data discrepancy di DB
    var expectedCash, discrepancy float64
    testDB.QueryRow(context.Background(),
        `SELECT expected_cash, discrepancy FROM shifts WHERE id = $1`, shiftID,
    ).Scan(&expectedCash, &discrepancy)

    assert.Equal(t, 250000.0, expectedCash, "Expected cash = starting + cash sales")
    assert.Equal(t, 10000.0, discrepancy,  "Discrepancy = ending - expected")
}

// ─── Test: Kasir tidak bisa tutup shift milik orang lain ─────

func TestIntegration_CloseShift_BlocksCrossUserAccess(t *testing.T) {
    ResetDB(t)
    router := BuildRouter(t)

    outletID := InsertOutlet(t, "Outlet C")
    user1ID := InsertUser(t, "kasir1@test.com", domain.RoleCashier, &outletID)
    user2ID := InsertUser(t, "kasir2@test.com", domain.RoleCashier, &outletID)
    shiftID := InsertShift(t, user1ID, outletID, 100000)

    // Token milik kasir2 mencoba tutup shift kasir1
    tokenUser2 := MakeAuthToken(t, user2ID, "kasir2@test.com", domain.RoleCashier, &outletID)
    closePayload := fmt.Sprintf(`{"shift_id": "%s", "ending_cash": 100000}`, shiftID)

    w := DoRequest(t, router, "POST", "/api/v1/cashier/shifts/close", closePayload, tokenUser2)
    assert.Equal(t, http.StatusUnprocessableEntity, w.Code)

    // Shift harus tetap 'open'
    var status string
    testDB.QueryRow(context.Background(),
        `SELECT status FROM shifts WHERE id = $1`, shiftID,
    ).Scan(&status)
    assert.Equal(t, "open", status)
}
```

### 6.3 Tier 1 — Auth & RBAC Middleware

```go
// ─── Test: Kasir tidak bisa akses backoffice ─────────────────

func TestIntegration_RBAC_CashierForbiddenFromBackoffice(t *testing.T) {
    ResetDB(t)
    router := BuildRouter(t)

    outletID := InsertOutlet(t, "Outlet")
    userID := InsertUser(t, "kasir@test.com", domain.RoleCashier, &outletID)
    token := MakeAuthToken(t, userID, "kasir@test.com", domain.RoleCashier, &outletID)

    endpoints := []string{
        "/api/v1/backoffice/employees",
        "/api/v1/backoffice/outlets",
        "/api/v1/backoffice/products",
        "/api/v1/backoffice/dashboard/summary",
    }

    for _, ep := range endpoints {
        t.Run("GET "+ep, func(t *testing.T) {
            w := DoRequest(t, router, "GET", ep, "", token)
            assert.Equal(t, http.StatusForbidden, w.Code,
                "Kasir harus mendapat 403 di endpoint: %s", ep)
        })
    }
}

// ─── Test: Request tanpa token mendapat 401 ───────────────────

func TestIntegration_Auth_UnauthorizedWithoutToken(t *testing.T) {
    ResetDB(t)
    router := BuildRouter(t)

    w := DoRequest(t, router, "GET", "/api/v1/cashier/menu", "", "") // no token
    assert.Equal(t, http.StatusUnauthorized, w.Code)
}
```

### 6.4 Tier 2 — Backoffice Product dengan FK Constraint

```go
// ─── Test: Create Product dengan FK category tidak ada ────────

func TestIntegration_CreateProduct_InvalidCategoryFK(t *testing.T) {
    ResetDB(t)
    router := BuildRouter(t)

    ownerID := InsertUser(t, "owner@test.com", domain.RoleOwner, nil)
    token := MakeAuthToken(t, ownerID, "owner@test.com", domain.RoleOwner, nil)

    nonExistentCategoryID := uuid.New()
    payload := fmt.Sprintf(`{
        "name": "Produk Baru", "price": 25000, "stock": 10,
        "unit": "pcs", "is_active": true, "category_id": "%s"
    }`, nonExistentCategoryID)

    w := DoRequest(t, router, "POST", "/api/v1/backoffice/products", payload, token)
    // FK violation → 500 atau 422 tergantung error handling
    assert.NotEqual(t, http.StatusCreated, w.Code,
        "Produk dengan FK category tidak valid tidak boleh dibuat")
}

// ─── Test: Delete Category yang masih dipakai produk ─────────

func TestIntegration_DeleteCategory_ConflictIfUsedByProduct(t *testing.T) {
    ResetDB(t)
    router := BuildRouter(t)

    ownerID := InsertUser(t, "owner@test.com", domain.RoleOwner, nil)
    token := MakeAuthToken(t, ownerID, "owner@test.com", domain.RoleOwner, nil)

    catID := InsertCategory(t, "Minuman")
    _ = InsertProduct(t, "Produk Dalam Kategori", 10000, 5, &catID)

    w := DoRequest(t, router, "DELETE",
        "/api/v1/backoffice/categories/"+catID.String(), "", token)
    assert.Equal(t, http.StatusConflict, w.Code)
}
```

### 6.5 Tier 2 — Dashboard Agregasi

```go
// ─── Test: Dashboard summary menghasilkan angka akurat ────────

func TestIntegration_Dashboard_AggregatesCorrectly(t *testing.T) {
    ResetDB(t)
    router := BuildRouter(t)

    outletID := InsertOutlet(t, "Cafe A")
    ownerID := InsertUser(t, "owner@test.com", domain.RoleOwner, nil)
    cashierID := InsertUser(t, "kasir@test.com", domain.RoleCashier, &outletID)
    productID := InsertProduct(t, "Kopi", 30000, 100, nil)
    shiftID := InsertShift(t, cashierID, outletID, 200000)
    ownerToken := MakeAuthToken(t, ownerID, "owner@test.com", domain.RoleOwner, nil)
    cashierToken := MakeAuthToken(t, cashierID, "kasir@test.com", domain.RoleCashier, &outletID)

    // Buat 2 transaksi: 1 cash, 1 qris
    for i := 0; i < 2; i++ {
        method := "cash"
        if i == 1 { method = "qris" }
        payload := fmt.Sprintf(`{
            "shift_id": "%s", "outlet_id": "%s", "payment_method": "%s",
            "subtotal": 30000, "tax_amount": 0, "discount_amount": 0, "total_amount": 30000,
            "items": [{"product_id": "%s", "product_name": "Kopi",
                       "quantity": 1, "unit_price": 30000, "modifiers": []}]
        }`, shiftID, outletID, method, productID)
        DoRequest(t, router, "POST", "/api/v1/cashier/transactions", payload, cashierToken)
    }

    // Ambil dashboard summary untuk hari ini
    now := time.Now()
    startDate := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC).
        Format(time.RFC3339)
    endDate := time.Date(now.Year(), now.Month(), now.Day(), 23, 59, 59, 0, time.UTC).
        Format(time.RFC3339)

    url := fmt.Sprintf("/api/v1/backoffice/dashboard/summary?start_date=%s&end_date=%s",
        url.QueryEscape(startDate), url.QueryEscape(endDate))

    w := DoRequest(t, router, "GET", url, "", ownerToken)
    assert.Equal(t, http.StatusOK, w.Code)

    var resp struct {
        Data struct {
            Metrics struct {
                TotalRevenue      float64 `json:"total_revenue"`
                TotalTransactions int64   `json:"total_transactions"`
            } `json:"metrics"`
        } `json:"data"`
    }
    require.NoError(t, json.Unmarshal(w.Body.Bytes(), &resp))
    assert.Equal(t, float64(60000), resp.Data.Metrics.TotalRevenue)
    assert.Equal(t, int64(2), resp.Data.Metrics.TotalTransactions)
}
```

---

## 7. Strategi Tambahan

### 7.1 Strategi Isolasi Database (Transaction Rollback Pattern)

Sebagai alternatif TRUNCATE, gunakan database transaction yang di-rollback setelah setiap test. Pendekatan ini lebih cepat untuk test yang banyak:

```go
func SetupTx(t *testing.T) (pgx.Tx, context.Context) {
    ctx := context.Background()
    tx, err := testDB.Begin(ctx)
    require.NoError(t, err)

    t.Cleanup(func() {
        tx.Rollback(ctx) // selalu rollback, tidak peduli test pass/fail
    })

    return tx, ctx
}
```

> **Trade-off:** Pattern ini tidak bisa digunakan untuk test yang menguji concurrent behavior atau test yang bergantung pada COMMIT untuk trigger/constraint deferrred.

### 7.2 Strategi Table-Driven Tests untuk Endpoint yang Sama

Gunakan table-driven test untuk menguji multiple skenario pada satu endpoint tanpa duplikasi setup:

```go
func TestIntegration_OpenShift_OperationalHoursValidation(t *testing.T) {
    tests := []struct {
        name      string
        openTime  string
        closeTime string
        wantCode  int
    }{
        {"Di dalam jam operasional",     "00:00:00", "23:59:00", http.StatusCreated},
        {"Di luar jam operasional",      "03:00:00", "03:01:00", http.StatusUnprocessableEntity},
        {"Tanpa jam operasional (bebas)", "",         "",         http.StatusCreated},
        {"Cross-midnight: sebelum close", "22:00:00", "02:00:00", http.StatusCreated},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            ResetDB(t)
            router := BuildRouter(t)

            // ... setup outlet dengan openTime/closeTime sesuai tt
            // ... DoRequest dan assert tt.wantCode
        })
    }
}
```

### 7.3 Strategi Race Condition Testing

Untuk memvalidasi bahwa advisory lock pada `transaction_repo.Create()` benar-benar mencegah duplicate `order_id`, jalankan concurrent checkout:

```go
func TestIntegration_Checkout_ConcurrentOrderIDUniqueness(t *testing.T) {
    ResetDB(t)
    router := BuildRouter(t)

    outletID := InsertOutlet(t, "Race Outlet")
    userID := InsertUser(t, "kasir@test.com", domain.RoleCashier, &outletID)
    productID := InsertProduct(t, "Item Rame", 10000, 100, nil)
    shiftID := InsertShift(t, userID, outletID, 500000)
    token := MakeAuthToken(t, userID, "kasir@test.com", domain.RoleCashier, &outletID)

    const goroutines = 10
    errors := make(chan error, goroutines)

    for i := 0; i < goroutines; i++ {
        go func() {
            payload := fmt.Sprintf(`{...}`, shiftID, outletID, productID)
            w := DoRequest(t, router, "POST", "/api/v1/cashier/transactions", payload, token)
            if w.Code != http.StatusCreated {
                errors <- fmt.Errorf("got status %d", w.Code)
            } else {
                errors <- nil
            }
        }()
    }

    successCount := 0
    for i := 0; i < goroutines; i++ {
        if err := <-errors; err == nil {
            successCount++
        }
    }

    // Semua 10 harus sukses dengan order_id yang unik
    assert.Equal(t, goroutines, successCount)

    var count int
    testDB.QueryRow(context.Background(),
        `SELECT COUNT(DISTINCT order_id) FROM transactions WHERE outlet_id = $1`, outletID,
    ).Scan(&count)
    assert.Equal(t, goroutines, count, "Setiap transaksi harus punya order_id unik")
}
```

### 7.4 Strategi Contract Testing (Response Schema Validation)

Pastikan response body selalu konsisten dengan `APIResponse` envelope yang diharapkan frontend:

```go
// helpers_test.go

func AssertAPIResponseShape(t *testing.T, body []byte, expectSuccess bool) map[string]interface{} {
    t.Helper()
    var resp map[string]interface{}
    require.NoError(t, json.Unmarshal(body, &resp))

    _, hasSuccess := resp["success"]
    assert.True(t, hasSuccess, "Response harus punya field 'success'")

    if expectSuccess {
        assert.True(t, resp["success"].(bool), "success harus true")
        _, hasData := resp["data"]
        assert.True(t, hasData, "Response sukses harus punya field 'data'")
    } else {
        assert.False(t, resp["success"].(bool), "success harus false")
        errObj, hasError := resp["error"]
        assert.True(t, hasError, "Response error harus punya field 'error'")
        if hasError {
            errMap := errObj.(map[string]interface{})
            assert.NotEmpty(t, errMap["code"], "'error.code' tidak boleh kosong")
            assert.NotEmpty(t, errMap["message"], "'error.message' tidak boleh kosong")
        }
    }

    return resp
}
```

### 7.5 Strategi Flaky Test Prevention

Test yang bergantung waktu (misal: shift dengan jam operasional) berpotensi flaky jika berjalan di boundary waktu tertentu. Gunakan pendekatan berikut:

```go
// ✅ BAIK: Inject waktu saat ini ke dalam test lewat mock time atau set jam yang pasti aman
func insertOutletWithSafeHours(t *testing.T) uuid.UUID {
    // Jam 00:00 - 23:59 → selalu valid di jam berapa pun test berjalan
    return InsertOutletWithHours(t, "00:00", "23:59")
}

// ✅ BAIK: Untuk test "di luar jam", gunakan window yang sangat sempit di masa lalu
func insertOutletWithCertainlyClosed(t *testing.T) uuid.UUID {
    return InsertOutletWithHours(t, "03:00", "03:01")
}

// ❌ BURUK: Hardcode jam yang bergantung waktu eksekusi
// InsertOutletWithHours(t, "09:00", "17:00") // flaky di luar jam ini
```

### 7.6 Strategi Negative Case Systematization

Setiap endpoint Tier 1 dan Tier 2 wajib memiliki setidaknya satu negative case dari masing-masing kategori berikut:

| Kategori | Contoh |
|----------|--------|
| **Missing Auth** | Request tanpa header `Authorization` → 401 |
| **Wrong Role** | Kasir akses endpoint owner → 403 |
| **Invalid UUID** | `/api/v1/cashier/transactions/bukan-uuid/void` → 400 |
| **Non-existent Resource** | Void transaksi dengan ID yang tidak ada → 422 |
| **Business Rule Violation** | Double void, buka shift duplikat → 422 |
| **DB Constraint Violation** | FK tidak valid, UNIQUE duplikat → 4xx |
| **Invalid JSON Body** | Body kosong atau malformed → 400 |

---

## 8. Anatomi dan Konvensi Kode

### 8.1 Struktur Standar Satu Test

```go
func TestIntegration_[Domain]_[Skenario](t *testing.T) {
    // ── 1. SETUP ──────────────────────────────────────────
    ResetDB(t)
    router := BuildRouter(t)

    // Seed data minimal (hanya yang dibutuhkan test ini)
    outletID := InsertOutlet(t, "Outlet Test")
    userID   := InsertUser(t, "kasir@test.com", domain.RoleCashier, &outletID)
    token    := MakeAuthToken(t, userID, "kasir@test.com", domain.RoleCashier, &outletID)

    // ── 2. ACTION ─────────────────────────────────────────
    w := DoRequest(t, router, "POST", "/api/v1/target/endpoint", `{...}`, token)

    // ── 3. ASSERT: HTTP Response ──────────────────────────
    assert.Equal(t, http.StatusCreated, w.Code)
    resp := AssertAPIResponseShape(t, w.Body.Bytes(), true)
    // ... cek field spesifik di resp["data"]

    // ── 4. ASSERT: Database State ─────────────────────────
    var actualValue SomeType
    err := testDB.QueryRow(context.Background(),
        `SELECT column FROM table WHERE id = $1`, someID,
    ).Scan(&actualValue)
    require.NoError(t, err)
    assert.Equal(t, expectedValue, actualValue, "Deskripsi kenapa ini penting")
}
```

### 8.2 Naming Convention

| Elemen | Convention | Contoh |
|--------|------------|--------|
| Test function | `TestIntegration_[Domain]_[Skenario]` | `TestIntegration_Checkout_DeductsStock` |
| Subtest | `[happy/sad path]: [deskripsi singkat]` | `t.Run("sad: stok tidak cukup", ...)` |
| Helper insert | `Insert[Entity]` | `InsertOutlet`, `InsertProduct` |
| Helper token | `MakeAuthToken` | `MakeAuthToken(t, id, email, role, outletID)` |

### 8.3 Checklist Sebelum Merge PR

- [ ] Semua test Tier 1 lulus
- [ ] Tidak ada test yang bergantung pada urutan eksekusi (independent)
- [ ] Setiap test memanggil `ResetDB(t)` di baris pertama
- [ ] Tidak ada hardcoded UUID atau timestamp
- [ ] Negative case minimal ada satu per endpoint yang diuji
- [ ] Test berjalan < 30 detik secara total pada mesin lokal

---

## 9. CI/CD Pipeline Integration

### 9.1 GitHub Actions Workflow

```yaml
# .github/workflows/integration-test.yml
name: Integration Tests

on:
  pull_request:
    branches: [main, develop]

jobs:
  integration-test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_USER: root
          POSTGRES_PASSWORD: password123
          POSTGRES_DB: smallthings_test
        ports:
          - 5433:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Set up Go
        uses: actions/setup-go@v5
        with:
          go-version: '1.25'

      - name: Install migrate
        run: go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

      - name: Run migrations on test DB
        run: |
          migrate -path ./backend/db/migrations \
            -database "postgres://root:password123@localhost:5433/smallthings_test?sslmode=disable" up
        working-directory: .

      - name: Run integration tests
        run: |
          go test -v -tags integration \
            -coverprofile=coverage_integration.out \
            ./internal/integration/... \
            -timeout 120s
        working-directory: ./backend
        env:
          TEST_DATABASE_URL: postgres://root:password123@localhost:5433/smallthings_test?sslmode=disable
          GIN_MODE: test

      - name: Upload coverage report
        uses: actions/upload-artifact@v4
        with:
          name: integration-coverage
          path: ./backend/coverage_integration.out
```

### 9.2 Strategi Gate: Kapan Build Dianggap Gagal

| Kondisi | Aksi |
|---------|------|
| Ada test Tier 1 yang gagal | ❌ Block merge |
| Ada test Tier 2 yang gagal | ❌ Block merge |
| Ada test Tier 3/4 yang gagal | ⚠️ Warning, tidak block |
| Coverage integration < 60% | ⚠️ Warning, tidak block |
| Test timeout > 120 detik | ❌ Block merge |

---

## 10. Definition of Done

Sebuah fitur dianggap **siap production** jika memenuhi semua kriteria berikut:

| Kriteria | Tolok Ukur |
|----------|------------|
| **Unit Test** | Semua logika bisnis di usecase ter-cover dengan mock |
| **Integration Test Tier 1** | 100% skenario happy & sad path lulus |
| **Integration Test Tier 2** | Minimal 80% skenario happy path lulus |
| **DB State Verified** | Setiap test Tier 1 memiliki minimal satu assertion ke database |
| **Negative Case Covered** | Minimal 1 negative case per endpoint baru |
| **No Flaky Tests** | Test harus lulus 3 kali berturut-turut di CI |
| **Performance** | Total suite waktu < 60 detik |

---

*Dokumen ini hidup dan harus diperbarui setiap kali ada penambahan endpoint atau perubahan business rule signifikan.*