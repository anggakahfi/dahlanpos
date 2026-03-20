# Small Things Coffee POS

An open-source, minimal, single-tenant Point of Sale system built specifically for F&B operations like Small Things Coffee. Designed for simplicity, speed, and zero monthly infrastructure costs.

## Tech Stack
- **Frontend**: Next.js 14, React, Tailwind CSS, shadcn/ui
- **Backend**: Golang (Gin framework)
- **Database**: PostgreSQL 15
- **Authentication**: Google OAuth 2.0 (Zero password management)
- **Media Storage**: Cloudinary (Free Tier)

## Quick Start (Local Setup)
The easiest way to run the entire stack (Frontend, Backend, and Database with seeded data) is via Docker Compose:

```bash
docker compose up --build -d
```

- **Frontend UI**: `http://localhost:3000`
- **Backend API**: `http://localhost:8080`
- **PostgreSQL**: `localhost:5432`

*(Note: Ensure your `.env` files with Google OAuth Client IDs and Cloudinary API wrappers are set up before running the frontend/backend services).*

## Default Login
`SEED_DATA.sql` automatically registers the following emails to be authorized for login:
- **Owner**: `owner@smallthings.com`
- **Cashier**: `cashier@smallthings.com`

*Since this app uses Google OAuth, you must log in with a Google Account that matches those exact emails (or change the seed data to match your actual Google Email).*

## License
Released under the [MIT License](LICENSE).
