# 📋 NON-FUNCTIONAL REQUIREMENTS (NFR) — Small Things Coffee POS Backend

**Project:** Small Things Coffee POS
**Tech Stack:** Golang (Gin), PostgreSQL 15+, JWT, Next.js
**Infrastructure:** Local Docker Compose / Free Tier (Railway/Render)
**Target:** Open Source Demo / Thesis Project
**License:** MIT License

---

## 🎯 1. PERFORMANCE REQUIREMENTS

### 1.1 Response Time
| Endpoint Type | Target | Notes |
|---------------|--------|-------|
| Generic CRUD | < 100ms | Direct DB query |
| `GET /cashier/menu` | < 200ms | Bundled payload |
| Reports / Aggregates | < 500ms | Date filtering |

> **Note:** Because this targets free-tier hosting (like Render/Railway), **cold starts** taking several seconds are fully acceptable during the initial request after a period of user inactivity.

### 1.2 Throughput & Scalability
- **Concurrency:** Built for 5–10 concurrent users (1 Owner, a few Cashiers).
- **Architecture:** Monolith. No horizontal scaling or load balancing required. 
- **Connection Pooling:** Minimal. Standard database connections are sufficient without external poolers like PgBouncer.

---

## 🔒 2. SECURITY REQUIREMENTS

### 2.1 Authentication & Authorization

```text
Authentication:
├── Strategy: Google OAuth (OpenID Connect)
├── Mechanism: Backend verifies Google Token -> Issues internal JWT
├── Benefit: No password storage, zero hashing complexity
└── Location: Authorization: Bearer <token>

RBAC (Role-Based Access Control):
├── Owner: Full system access
└── Cashier: Strictly POS operations (Cart, Shift, Transactions)
```

### 2.2 Application Security
- **CORS:** Allowed origins configured to the Frontend URL (or localhost).
- **Validation:** Go struct tag validation (`binding:"required"`) on all incoming JSON payloads.

---

## 🗄️ 3. DATABASE REQUIREMENTS

### 3.1 Design Standards
- **Isolation:** Single-tenant only. Pure domain-focused schema.
- **Primary Keys:** UUID (`uuid_generate_v4()`).
- **Images:** Image URLs point to Cloudinary hosted files.
- **Stock Integrity:** Pessimistic locking (`FOR UPDATE`) when deducting stock during checkout.

### 3.2 Backup & Recovery
- Not strictly required for the demo, but a `pg_dump` cron script can be provided if running on a $4 VPS.
- Database runs inside a Docker standard volume.

---

## 🚀 4. DEPLOYMENT & OPEN SOURCE REQUIREMENTS

To ensure maximum visibility and ease of use for academic supervisors or job recruiters, the project strictly adheres to open-source developer experience (DX) standards.

### 4.1 1-Command Deployment (Docker Compose)
The entire stack must spin up flawlessly with a single command:
```bash
docker compose up --build -d
```
**Architecture inside Docker:**
1. **Frontend Service:** Next.js built with `output: 'standalone'` to massively shrink image size (~150MB).
2. **Backend Service:** Compiled Golang binary Alpine image (~50MB).
3. **Database Service:** PostgreSQL 15 with automatic initialization from `SEED_DATA.sql`.

### 4.2 Seed Data Automation
Upon the very first database startup, Docker must run a `SEED_DATA.sql` script that automatically populates:
- 1 Owner Account
- 1 Cashier Account 
- 5 Categories
- 10 Coffee/Snack Products
- Sample Modifier Groups (Size, Sugar, Ice)

### 4.3 Documentation
The repository must contain a high-quality `README.md` covering:
- Project Goal & Tech Stack
- PREREQUISITES (Docker, Google OAuth Client ID)
- Quickstart Guide
- Default Login Credentials (if bypassing OAuth for local dev)
- System Architecture Diagram

---

## 📝 5. CODE QUALITY

### 5.1 Project Layout (Golang)
```
backend/
├── cmd/api/main.go            # Entry point
├── internal/
│   ├── handler/               # HTTP controllers
│   ├── middleware/            # JWT, CORS
│   ├── service/               # Core business logic
│   └── repository/            # PostgreSQL queries
├── db/migrations/             # golang-migrate SQL
└── Dockerfile                 # Multi-stage optimized build
```

### 5.2 Frontend Layout (Next.js)
```
frontend/
├── app/                       # App context
├── components/                # UI components
├── lib/                       # Utilities and API clients
├── next.config.js             # Includes standalone build output
└── Dockerfile                 # Multi-stage optimized build
```
