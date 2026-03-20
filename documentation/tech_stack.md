# DahlanPOS Technology Stack

DahlanPOS is built using a modern, scalable, and type-safe "monorepo" architecture, separating the client-side user interface from the server-side logic and database.

Berikut adalah detail lengkap teknologi yang digunakan untuk membangun DahlanPOS, dikalibrasi untuk memenuhi 5 Pilar Arsitektur Akademis (*Readable, Maintainable, Debuggable, Predictable, Demoable*).

## 1. Frontend (Client-Side)

Bagian antarmuka pengguna (UI) dan interaksi kasir/admin dibangun menggunakan teknologi berbasis komponen dengan separasi logika (Feature-based Folder Structure) untuk menjamin pemeliharaan jangka panjang.

*   **Framework Utama**: Next.js 14 (App Router)
*   **Library UI**: React 18
*   **Bahasa Pemrograman**: TypeScript (dengan Strict Typing)
*   **Styling & CSS**: Tailwind CSS
*   **Komponen UI**: shadcn/ui (berbasis Radix UI Primitives untuk aksesibilitas tinggi)
*   **Ikon**: Lucide React
*   **Data Fetching & Server State**: TanStack Query (React Query)
    *   *Fungsi:* Handle caching otomatis, sinkronisasi data API, loading states, dan Optimistic UI (khusus modul kasir). Menghindari penggunaan `useEffect` manual yang rawan bug.
*   **Global State Management**: Zustand
    *   *Fungsi:* Menyimpan state kompleks secara terprediksi (*predictable*), khususnya untuk Keranjang Belanja (Cart) di sistem POS tanpa *prop-drilling* berlapis.
*   **Form Handling & Validation**: React Hook Form + Zod
    *   *Fungsi:* Mengelola form *(Submit & Error)* dengan efisien, ditambah perlindungan validasi skema (*Schema Validation*) ketat dari Zod sebelum dikirim ke server.

## 2. Backend (Server-Side)

Logika bisnis utama, manajemen state yang persisten, dan penyediaan API endpoints dilakukan oleh backend yang ringan, cepat, dan terstruktur.

*   **Bahasa Pemrograman**: Go (Golang) 1.22
*   **Arsitektur**: Clean Architecture (Domain, UseCase, Repository, Handler) yang memastikan *Separation of Concern*.
*   **Web Framework (Router)**: Gin Gonic (`gin-gonic/gin`)
*   **Database Driver**: pgx v5 (`jackc/pgx/v5`) - *Native PostgreSQL driver with connection pooling + Parameterized Query untuk mencegah SQL Injection.*
*   **Autentikasi & Sekuriti**: 
    *   JSON Web Tokens (`golang-jwt/jwt/v5`) untuk otorisasi endpoint dengan standar industri.
    *   Google OAuth 2.0 Client (`google.golang.org/api/idtoken`) untuk SSO (Single Sign-On).
*   **Transaksi Finansial (POS)**: Menggunakan Database Transaction (ACID) bawaan PostgreSQL (`tx.Begin()`) untuk operasi kritis pembayaran & pemotongan stok.

## 3. Database

Sistem penyimpanan data relasional yang kokoh untuk menjamin integritas data inventaris, kasir, dan laporan:

*   **RDBMS**: PostgreSQL 16
*   **Migration Tool**: Native SQL scripts (diatur di dalam folder `db/migrations`)
*   **Primary Keys**: Menggunakan UUID (`uuid-ossp` extension) untuk desentralisasi dan keamanan referensi objek.

## 4. Infrastructure & Deployment (DevOps)

Infrastruktur pendukung untuk menjamin kemudahan *development* lokal maupun saat production *deployment*.

*   **Containerization**: Docker & Docker Compose
    *   *Backend Service*: Menggunakan multi-stage Dockerfile berbasis Alpine Linux untuk memangkas *image size*.
    *   *Database Service*: *Container* PostgreSQL resmi.
*   **Hosting Frontend**: Vercel (untuk perlakuan optimal CI/CD Next.js).
*   **Hosting Backend (TBD)**: AWS EC2 / DigitalOcean Droplet / Google Cloud Run.

## 5. Third-Party Integrations & External Services

Sistem eksternal yang dihubungkan untuk memperluas fungsionalitas aplikasi:

*   **Identity Provider**: Google Cloud Console (OAuth Client ID) untuk fitur "Log in with Google".
*   **Payment Gateway**: Xendit (Dalam tahap perencanaan/integrasi) untuk penerimaan QRIS / E-Wallet dinamis pada *Cashier Module*.
