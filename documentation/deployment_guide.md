# 🚀 Panduan Deployment End-to-End: Vercel + HuggingFace Spaces

> **DahlanPOS (Small Things Coffee POS)**
> Frontend: Vercel (Next.js) | Backend: HuggingFace Spaces (Docker) | Database: Supabase/Neon (PostgreSQL)

---

## 📋 Daftar Isi

1. [Prasyarat](#1-prasyarat)
2. [Langkah 1 — Setup Database PostgreSQL (Cloud)](#2-langkah-1--setup-database-postgresql-cloud)
3. [Langkah 2 — Jalankan Migrasi Database](#3-langkah-2--jalankan-migrasi-database)
4. [Langkah 3 — Tambahkan Akun Owner (CLI Lokal)](#4-langkah-3--tambahkan-akun-owner-cli-lokal)
5. [Langkah 4 — Deploy Backend ke HuggingFace Spaces](#5-langkah-4--deploy-backend-ke-huggingface-spaces)
6. [Langkah 5 — Konfigurasi Frontend untuk Production](#6-langkah-5--konfigurasi-frontend-untuk-production)
7. [Langkah 6 — Deploy Frontend ke Vercel](#7-langkah-6--deploy-frontend-ke-vercel)
8. [Langkah 7 — Konfigurasi Google OAuth](#8-langkah-7--konfigurasi-google-oauth)
9. [Langkah 8 — Verifikasi & Testing](#9-langkah-8--verifikasi--testing)
10. [Post-Deploy: Menambahkan Owner Setelah Live](#10-post-deploy-menambahkan-owner-setelah-live)
11. [Troubleshooting](#11-troubleshooting)
12. [Arsitektur Production](#12-arsitektur-production)

---

## 1. Prasyarat

| Tool                | Keterangan                        | Link                                       |
|---------------------|-----------------------------------|--------------------------------------------|
| **Git**             | Version control                   | https://git-scm.com                        |
| **Go 1.25+**        | Untuk menjalankan CLI & migrasi   | https://go.dev/dl                          |
| **Node.js 21+**     | Untuk build frontend lokal        | https://nodejs.org                         |
| **Akun GitHub**     | Repository source code            | https://github.com                         |
| **Akun Vercel**     | Hosting frontend                  | https://vercel.com                         |
| **Akun HuggingFace**| Hosting backend (Docker Spaces)   | https://huggingface.co                     |
| **Akun Supabase**   | Database PostgreSQL cloud (gratis)| https://supabase.com                       |
| **golang-migrate**  | CLI tool untuk migrasi database   | https://github.com/golang-migrate/migrate  |

> [!IMPORTANT]
> Pastikan repository sudah di-push ke **GitHub** sebelum memulai deployment. Vercel dan HuggingFace Spaces akan menarik kode dari repository GitHub Anda.

---

## 2. Langkah 1 — Setup Database PostgreSQL (Cloud)

Kita butuh database PostgreSQL yang bisa diakses dari internet. Pilihan yang disarankan:

### Opsi A: Supabase (Rekomendasi — gratis)

1. Buka https://supabase.com → Klik **Start your project**
2. Buat project baru:
   - **Name**: `dahlanpos-production`
   - **Database Password**: buat password yang kuat, **simpan baik-baik!**
   - **Region**: pilih **Southeast Asia (Singapore)** untuk latensi rendah
3. Setelah project dibuat, navigasi ke **Settings → Database**
4. Salin **Connection string** (URI format):
   ```
   postgresql://postgres.[project-ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```
5. **Catat** URL ini — ini adalah `DATABASE_URL` Anda

> [!TIP]
> Supabase menyediakan dua mode koneksi:
> - **Session mode** (port `5432`) — untuk migrasi dan CLI
> - **Transaction mode** (port `6543`) — untuk aplikasi production
>
> Gunakan **Session mode** untuk migrasi, dan **Transaction mode** untuk backend.

### Opsi B: Neon (Alternatif — gratis)

1. Buka https://neon.tech → Sign up
2. Buat project → pilih region **Singapore**
3. Salin connection string dari dashboard

---

## 3. Langkah 2 — Jalankan Migrasi Database

Migrasi akan membuat semua tabel yang diperlukan di database production.

### Install golang-migrate

```powershell
# Windows (menggunakan scoop)
scoop install migrate

# Atau download binary dari:
# https://github.com/golang-migrate/migrate/releases
```

### Jalankan Migrasi

```powershell
# Set DATABASE_URL ke database production Anda (gunakan Session mode / port 5432)
$env:DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# Pindah ke folder backend
cd backend

# Jalankan semua migrasi
migrate -path db/migrations -database $env:DATABASE_URL up
```

**Output yang diharapkan:**
```
1/u create_extensions_and_types (xxx ms)
2/u create_outlets_and_users (xxx ms)
3/u create_product_catalog (xxx ms)
4/u create_shifts_and_transactions (xxx ms)
5/u create_settings_and_logs (xxx ms)
6/u create_triggers (xxx ms)
```

### (Opsional) Masukkan Seed Data

Jika ingin mengisi data demo untuk testing:

```powershell
# Menggunakan psql
psql $env:DATABASE_URL -f ../SEED_DATA.sql
```

> [!WARNING]
> **Jangan** jalankan SEED_DATA.sql di production jika Anda sudah punya data real. Seed data hanya untuk testing/demo.

---

## 4. Langkah 3 — Tambahkan Akun Owner (CLI Lokal)

CLI `add-owner` harus dijalankan dari mesin lokal, karena ia terhubung **langsung ke database**.

```powershell
# Pastikan masih di folder backend/
cd backend

# Set DATABASE_URL ke production (Session mode / port 5432)
$env:DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# Tambahkan akun owner — gunakan email Google yang akan dipakai login via OAuth
go run ./cmd/cli add-owner "Nama Anda" "email.google.anda@gmail.com"
```

**Output yang diharapkan:**
```
✅ Owner berhasil ditambahkan!
   ID    : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   Nama  : Nama Anda
   Email : email.google.anda@gmail.com
   Role  : owner
```

> [!IMPORTANT]
> Email yang didaftarkan **harus sama persis** dengan email akun Google yang akan digunakan untuk login via Google OAuth di aplikasi.

---

## 5. Langkah 4 — Deploy Backend ke HuggingFace Spaces

### 5.1. Buat Space Baru

1. Login ke https://huggingface.co
2. Klik **Profile** → **New Space**
3. Isi konfigurasi:
   - **Space name**: `dahlanpos-backend`
   - **License**: sesuaikan
   - **SDK**: pilih **Docker**
   - **Hardware**: **CPU Basic (Free)** cukup untuk mulai
   - **Visibility**: Public (atau Private jika perlu)
4. Klik **Create Space**

### 5.2. Siapkan Repository untuk HuggingFace

HuggingFace Spaces mengharuskan `Dockerfile` berada di **root** repository. Kita perlu membuat repo terpisah untuk backend, atau menggunakan subdirectory strategy.

**Strategi Rekomendasi: Buat repository terpisah untuk backend**

```powershell
# Buat folder baru di luar project
mkdir dahlanpos-backend-hf
cd dahlanpos-backend-hf

# Inisialisasi git
git init
git remote add origin https://huggingface.co/spaces/USERNAME/dahlanpos-backend

# Salin semua file backend
Copy-Item -Recurse -Path "..\dahlanpos-v0vercel\backend\*" -Destination "." -Exclude @("*.exe", "vendor", ".env", "*.log", "*.out")
```

### 5.3. Sesuaikan Dockerfile untuk HuggingFace

HuggingFace Spaces membutuhkan server berjalan di **port 7860**. Edit `Dockerfile`:

```dockerfile
FROM golang:1.25-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Build the binary
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o server ./cmd/server/main.go

FROM debian:bookworm-slim

# Install dependencies
RUN apt-get update && apt-get install -y ca-certificates tzdata && rm -rf /var/lib/apt/lists/*

# Set timezone to Asia/Jakarta
ENV TZ=Asia/Jakarta
RUN ln -sf /usr/share/zoneinfo/Asia/Jakarta /etc/localtime && echo "Asia/Jakarta" > /etc/timezone

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/server ./server

# Copy migrations and other assets
COPY db/migrations ./db/migrations

# HuggingFace Spaces WAJIB menggunakan port 7860
EXPOSE 7860

# Override port via environment variable
ENV PORT=7860

CMD ["./server"]
```

### 5.4. Konfigurasi Environment Variables (Secrets)

Di halaman Space di HuggingFace:

1. Klik **Settings** → Scroll ke **Repository secrets**
2. Tambahkan secret berikut:

| Variable             | Nilai                                                                  |
|----------------------|------------------------------------------------------------------------|
| `DATABASE_URL`       | `postgresql://postgres.[ref]:[pass]@...pooler.supabase.com:6543/postgres` |
| `JWT_SECRET`         | String random yang kuat (min. 32 karakter)                             |
| `GOOGLE_CLIENT_ID`   | Client ID dari Google Cloud Console                                    |
| `CORS_ORIGIN`        | `https://dahlanpos.vercel.app` (URL Vercel Anda nanti)                 |
| `PORT`               | `7860`                                                                 |
| `RESEND_API_KEY`     | API key dari Resend (untuk email)                                      |
| `CLOUDINARY_URL`     | URL Cloudinary Anda (untuk upload gambar)                              |

> [!CAUTION]
> Gunakan **Transaction mode** (port `6543`) untuk `DATABASE_URL` di production, bukan Session mode. Ini penting untuk koneksi pooling yang efisien.

### 5.5. Push & Deploy

```powershell
# Pastikan vendor ada
go mod vendor

git add .
git commit -m "Initial backend deployment"
git push origin main
```

HuggingFace akan otomatis **build Docker image** dan **deploy**. Monitor progress di tab **Logs** pada halaman Space Anda.

### 5.6. Verifikasi Backend

Setelah build selesai (biasanya 3-5 menit), test health endpoint:

```powershell
curl https://USERNAME-dahlanpos-backend.hf.space/health
```

**Response yang diharapkan:**
```json
{"status":"ok","timestamp":"2026-07-30T02:00:00Z"}
```

> [!NOTE]
> URL backend HuggingFace Spaces Anda akan berbentuk:
> `https://USERNAME-dahlanpos-backend.hf.space`
>
> Catat URL ini — akan digunakan di konfigurasi frontend.

---

## 6. Langkah 5 — Konfigurasi Frontend untuk Production

### 6.1. Update `next.config.mjs`

Untuk deployment ke Vercel, kita perlu mengubah rewrites agar mengarah ke backend HuggingFace:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/:path*`,
      },
    ]
  },
}

export default nextConfig
```

> [!IMPORTANT]
> Perubahan kunci: `destination` sekarang menggunakan `process.env.NEXT_PUBLIC_API_URL` alih-alih hardcoded `http://backend:8080`. Ini memungkinkan Vercel meneruskan API call ke backend HuggingFace.

### 6.2. Verifikasi Frontend API Client

File `frontend/lib/api.ts` sudah menggunakan pattern yang benar:
```typescript
const API_BASE = typeof window !== 'undefined' 
  ? '' 
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080')
```

- **Di browser**: API call melalui path relatif (`/api/v1/...`) → diteruskan oleh Vercel rewrites ke backend HF
- **Di server (SSR)**: menggunakan `NEXT_PUBLIC_API_URL` langsung

---

## 7. Langkah 6 — Deploy Frontend ke Vercel

### 7.1. Import Project dari GitHub

1. Login ke https://vercel.com
2. Klik **Add New** → **Project**
3. Klik **Import Git Repository** → pilih repository GitHub Anda
4. Pada halaman konfigurasi:
   - **Framework Preset**: `Next.js` (otomatis terdeteksi)
   - **Root Directory**: klik **Edit** → ketik `frontend`
   - **Build Command**: `npm run build` (default, biarkan)
   - **Output Directory**: biarkan default (`.next`)

### 7.2. Set Environment Variables

Di halaman konfigurasi Vercel, klik **Environment Variables** dan tambahkan:

| Variable                       | Nilai                                                    |
|--------------------------------|----------------------------------------------------------|
| `NEXT_PUBLIC_API_URL`          | `https://USERNAME-dahlanpos-backend.hf.space`            |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Client ID Google OAuth Anda                              |
| `NEXT_PUBLIC_SITE_URL`         | `https://dahlanpos.vercel.app` (atau custom domain Anda) |

> [!TIP]
> Anda bisa mengatur environment variables berbeda untuk setiap environment:
> - **Production**: URL production
> - **Preview**: URL staging/preview
> - **Development**: `http://localhost:8080`

### 7.3. Deploy

Klik **Deploy** dan tunggu proses build selesai (biasanya 1-3 menit).

**Setelah deploy berhasil**, Vercel akan memberikan URL production, misalnya:
```
https://dahlanpos.vercel.app
```

### 7.4. (Opsional) Custom Domain

1. Di dashboard Vercel, buka **Settings → Domains**
2. Tambahkan domain custom Anda
3. Ikuti instruksi untuk menambahkan DNS records (CNAME/A record)

---

## 8. Langkah 7 — Konfigurasi Google OAuth

Agar login Google OAuth bekerja di production, Anda perlu menambahkan URL production ke Google Cloud Console.

### 8.1. Update OAuth Consent Screen

1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. Navigasi ke **APIs & Services → Credentials**
3. Klik OAuth 2.0 Client ID yang digunakan
4. Tambahkan di **Authorized JavaScript origins**:
   ```
   https://dahlanpos.vercel.app
   ```
5. Tambahkan di **Authorized redirect URIs**:
   ```
   https://dahlanpos.vercel.app
   https://dahlanpos.vercel.app/auth/callback
   ```
6. Klik **Save**

> [!WARNING]
> Perubahan pada Google OAuth bisa memakan waktu **5-10 menit** untuk berlaku. Jika login gagal setelah deploy, tunggu beberapa saat dan coba lagi.

---

## 9. Langkah 8 — Verifikasi & Testing

### Checklist Verifikasi

```
□  Backend health check berhasil
   curl https://USERNAME-dahlanpos-backend.hf.space/health

□  Frontend terbuka di browser
   https://dahlanpos.vercel.app

□  Login dengan Google OAuth berhasil
   → Login menggunakan email yang didaftarkan sebagai owner

□  API call dari frontend ke backend berhasil
   → Cek di browser DevTools → Network tab

□  Data dari database tampil di dashboard
   → Pastikan products, categories, dll. muncul (jika seed data dipakai)
```

### Test End-to-End Flow

1. Buka `https://dahlanpos.vercel.app`
2. Klik **Login dengan Google**
3. Gunakan akun Google yang email-nya sudah didaftarkan sebagai owner
4. Verifikasi dashboard backoffice tampil dengan benar
5. Coba tambah produk, kategori, dll.
6. Coba buka modul kasir dan buat transaksi

---

## 10. Post-Deploy: Menambahkan Owner Setelah Live

### ❓ Apakah bisa menjalankan `./cmd/cli add-owner` setelah deploy?

**Ya, bisa!** Tetapi CLI harus dijalankan **dari mesin lokal** Anda, bukan dari Vercel atau HuggingFace. CLI terhubung langsung ke database, bukan ke server backend.

### Cara Menambahkan Owner Baru (Post-Deploy)

```powershell
# Di mesin lokal Anda
cd backend

# Set DATABASE_URL ke production (Session mode / port 5432 untuk koneksi langsung)
$env:DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# Tambahkan owner baru
go run ./cmd/cli add-owner "Owner Baru" "owner.baru@gmail.com"
```

### Persyaratan

| Syarat | Penjelasan |
|--------|------------|
| Go terinstall di mesin lokal | CLI ditulis dalam Go dan perlu di-compile |
| Akses ke `DATABASE_URL` production | Disimpan di Supabase/Neon dashboard |
| Koneksi internet | CLI terhubung langsung ke database cloud |
| Source code backend | File `./cmd/cli/main.go` dan dependencies-nya |

### Diagram Alur

```
┌─────────────────┐     direct connection     ┌──────────────────┐
│  Mesin Lokal    │ ───────────────────────►   │  Supabase        │
│  go run cli     │      DATABASE_URL          │  PostgreSQL      │
│  add-owner      │                            │  (port 5432)     │
└─────────────────┘                            └──────────────────┘
        │
        │ TIDAK melalui
        ▼
  ┌──────────────┐         ┌────────────────┐
  │   Vercel     │    ✗    │  HuggingFace   │
  │  (Frontend)  │         │  (Backend API) │
  └──────────────┘         └────────────────┘
```

> [!NOTE]
> CLI **tidak perlu** melewati backend API. Ia langsung terhubung ke database menggunakan `DATABASE_URL`. Jadi selama Anda punya akses ke database credentials, Anda selalu bisa menambah owner.

---

## 11. Troubleshooting

### Backend tidak bisa start di HuggingFace

| Gejala | Solusi |
|--------|--------|
| `Build failed` | Cek logs di tab Logs HF Space. Pastikan `go.mod` dan `go.sum` ada. |
| `Failed to connect to database` | Verifikasi `DATABASE_URL` di secrets. Pastikan format benar dan password tidak mengandung karakter special yang perlu di-escape. |
| `Port already in use` | Pastikan `PORT=7860` di environment. HF hanya mengekspos port 7860. |

### Frontend error di Vercel

| Gejala | Solusi |
|--------|--------|
| `Build failed` | Pastikan **Root Directory** di-set ke `frontend`. |
| `API calls gagal (CORS)` | Pastikan `CORS_ORIGIN` di backend HF = URL Vercel Anda. |
| `Google login gagal` | Pastikan URL Vercel sudah ditambahkan di Google Cloud Console Authorized Origins. |
| `Rewrites tidak bekerja` | Pastikan `NEXT_PUBLIC_API_URL` di Vercel diisi URL backend HF yang benar. |

### CLI `add-owner` gagal

| Gejala | Solusi |
|--------|--------|
| `connection refused` | Gunakan Session mode (port `5432`), bukan Transaction mode. |
| `password authentication failed` | Periksa kembali password database. Escape karakter special dengan URL encoding. |
| `relation "users" does not exist` | Migrasi belum dijalankan. Jalankan `migrate up` dulu. |

---

## 12. Arsitektur Production

```
                        ┌──────────────────────────────────┐
                        │         End User (Browser)        │
                        └──────────────┬───────────────────┘
                                       │
                                       ▼
                        ┌──────────────────────────────────┐
                        │           Vercel CDN              │
                        │     https://dahlanpos.vercel.app  │
                        │                                   │
                        │  ┌─────────────────────────────┐  │
                        │  │   Next.js (Frontend)         │  │
                        │  │   - SSR Pages                │  │
                        │  │   - Static Assets            │  │
                        │  │   - API Rewrites ──────────┐ │  │
                        │  └─────────────────────────────┘ │  │
                        └──────────────────────────────────┘  │
                                                              │
                           /api/v1/*  ◄───────────────────────┘
                                       │
                                       ▼
                        ┌──────────────────────────────────┐
                        │      HuggingFace Spaces           │
                        │   https://user-backend.hf.space   │
                        │                                   │
                        │  ┌─────────────────────────────┐  │
                        │  │   Go Backend (Gin)           │  │
                        │  │   - REST API                 │  │
                        │  │   - Auth (JWT + Google)      │  │
                        │  │   - Business Logic           │  │
                        │  └──────────┬──────────────────┘  │
                        └─────────────┼────────────────────┘
                                      │
                                      ▼
                        ┌──────────────────────────────────┐
                        │      Supabase / Neon              │
                        │   PostgreSQL Database             │
                        │                                   │
                        │   - Users, Products, Orders       │
                        │   - Shifts, Transactions          │
                        │   - Settings, Activity Logs       │
                        └──────────────────────────────────┘
```

### Estimasi Biaya (Free Tier)

| Layanan        | Tier     | Biaya   | Batasan                    |
|----------------|----------|---------|----------------------------|
| Vercel         | Hobby    | **$0**  | 100GB bandwidth/bulan      |
| HuggingFace    | CPU Free | **$0**  | 2 vCPU, 16GB RAM           |
| Supabase       | Free     | **$0**  | 500MB database, 50K rows   |
| **Total**      |          | **$0**  |                            |

> [!TIP]
> Stack ini **sepenuhnya gratis** untuk memulai. Upgrade ke paid tier hanya diperlukan jika traffic sudah tinggi atau storage database sudah penuh.

---

## Quick Reference: Semua Environment Variables

### Backend (HuggingFace Secrets)

```env
PORT=7860
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
RESEND_API_KEY=re_your_resend_api_key
CORS_ORIGIN=https://dahlanpos.vercel.app
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

### Frontend (Vercel Environment Variables)

```env
NEXT_PUBLIC_API_URL=https://USERNAME-dahlanpos-backend.hf.space
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
NEXT_PUBLIC_SITE_URL=https://dahlanpos.vercel.app
```

---

*Dokumen ini dibuat pada 30 Juli 2026. Perbarui URL dan credentials sesuai setup aktual Anda.*
