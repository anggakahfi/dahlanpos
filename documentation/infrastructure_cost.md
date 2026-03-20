# Small Things Coffee POS — Infrastructure Cost Analysis

> **Goal:** Run an impressive, portfolio-ready POS system for a thesis defense and recruiter demos at **Rp 0 / month**.

---

## 1. Component Breakdown

To run this open-source demo continuously without incurring personal costs, we leverage generous Free Tiers from modern cloud providers.

| Component | Provider (Free Tier) | Cost/Month |
|-----------|-----------------------|------------|
| **Frontend** | **Vercel** (Hobby Plan) | **Rp 0** |
| **Backend API** | **Railway** or **Render** | **Rp 0** |
| **Database** | **Neon** (Serverless Postgres) or **Supabase** | **Rp 0** |
| **Media Host** | **Cloudinary** (Generous free tier) | **Rp 0** |
| **Authentication**| **Google Cloud Console** (OAuth API) | **Rp 0** |
| **Local Dev** | **Docker Compose** | **Rp 0** |
| **TOTAL** | | **Rp 0** |

---

## 2. Why This Stack is Perfect for a CV & Thesis

### ✅ Zero Financial Risk
You can leave the project running for months. When a recruiter looks at your repository and clicks the "Live Demo" link, it will just work, and you won't bleed money.

### ✅ Modern "Cloud-Native" Architecture
Using separated Frontend (Vercel), Backend Containerization (Railway), Serverless Postgres (Neon), and CDN caching for images (Cloudinary) shows extreme architectural maturity. This is exactly how modern tech startups assemble MVPs.

### ✅ Acceptable Trade-offs
The only downside of Free Tier backend hosting (specifically Render or Railway) is **Cold Starts**. If the backend hasn't been pinged in 15 minutes, the provider spins down the container to save resources. The next request might take 10-20 seconds to "wake" it up. 
**Mitigation:** For a thesis presentation or recruiter interview, simply open the app 2 minutes before the presentation to "warm up" the container. After that, it responds in <100ms.

---

## 3. Alternative: Continuous Uptime (The Rp 50k Option)

If you *absolutely* despise cold starts and want 24/7 instant responses, you can completely bypass Railway/Render and rent a cheap local VPS to run the Docker Compose directly.

| Provider | Spec | Price/Month |
|----------|------|-------------|
| **IDCloudHost** | 1 vCPU, 1 GB RAM, 20 GB SSD | **Rp 50.000** |

*Deployment:* You would install Docker on this VPS, copy the `docker-compose.yml`, and run `docker compose up -d` for the Backend and Database. The Frontend remains on Vercel for free CDN delivery.

---

## 4. Removed Costs from Previous SaaS Design

By pivoting from a heavy Multi-Tenant SaaS to a sharp Single-Tenant Open Source model, we have successfully eliminated:
1. **Xendit Payment Gateway Fees** (Rp 4.000 + 0.7% per transaction) - No longer needed, as QRIS is handled manually offline.
2. **Cloudflare R2** - Replaced natively with Cloudinary (easier setup for simple image hosting).
3. **Huge VPS Requirements** - Because we aren't handling DB multi-tenant concurrency and webhook bursts, memory needs drop drastically.
