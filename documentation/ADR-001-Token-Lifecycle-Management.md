# ADR 001: Token Lifecycle Management & Revocation (Refresh Token)

## Status
Proposed / Accepted (Sesuai usulan)

## Context
Saat ini sistem otentikasi DahlanPOS menggunakan single Access Token berupa Stateless JWT dengan masa berlaku 24 jam. Pada arsitektur POS (Point of Sales) di mana perangkat biasanya digunakan secara bergantian (shared devices) pada tiap pergantian shift, hal ini menimbulkan risiko keamanan yang sangat kritis. 

*Window of Attack* terlampau luas: Jika seorang kasir lupa menutup sesi atau sekadar menutup browser tanpa *logout* penuh, sesi JWT-nya akan terus valid selama sisa waktu 24 jam. Hal ini membuka celah sistem disalahgunakan oleh kasir shift berikutnya, memicu *fraud* laporan keuangan shift, atau lebih buruk lagi jika *device* dicuri/disadap. Selain itu, pendekatan *pure stateless* yang digunakan saat ini berarti *backend* tidak memiliki skema untuk memaksa pembatalan (revoke) akses pada suatu sesi yang dicurigai.

## Decision
Kita akan mengadopsi standar otentikasi **Short-lived Access Token + Long-lived Refresh Token** yang disertai dengan kemampuan *revocation* sesi secara tersentralisasi.

Rincian arsitekturnya:
1. **Access Token (JWT / Stateless):** Durasi dipersingkat menjadi maksimal **15 - 60 Menit**. Token ini diserahkan kepada frontend.
2. **Refresh Token (Opaque String / Stateful):** Durasi **7 Hari**. Token ini dihasilkan bersamaan dengan Access Token, dan secara spesifik akan dikirimkan sebagai `HttpOnly` Secure Cookie dari Backend sehingga lebih aman dari eksploitasi skrip XSS.
3. **Penyimpanan Server-Side:** String unik *Refresh Token* (beserta ID User, status Revoked, dan Expiry) akan disimpan/di-*track* dalam database (`PostgreSQL`) sebagai layer *stateful* di DahlanPOS. 
4. **Logout Mechanism:** Pemanggilan endpoint `/auth/logout` akan membatalkan (menandai *revoked*) Refresh Token spesifik di *database*, serta menginstruksikan browser untuk menghapus/membersihkan (clear) *cookie* tersebut.

## Consequences

**Positif (Mitigasi Risiko):**
- *Window of Attack* dari kebocoran Access Token menyusut drastis ke hitungan menit maksimal (15 menit).
- Terdapat metode penindakan *Immediate Revocation*. Tim operasional (melalui *Backoffice*) bisa memutus akses dari suatu perangkat tanpa menunggu token 24 jam kedaluwarsa.
- Otomatis menambal potensi "pemboncengan akun" oleh Kasir pada perangkat *shared*.

**Negatif (Trade-offs Teknis):**
- *Frontend* (Next.js) memerlukan penambahan logika HTTP Interceptor (mis. axios interceptor) untuk bisa meng-_handle_ sinyal *401 Unauthorized*, kemudian secara mulus meminta ulang access token ke endpoint `/auth/refresh`, sebelum mengulang kembali HTTP Request yang gagal tadi.
- Backend tidak lagi 100% *stateless*, ada tambahan *database hit* saat fase login, *refresh*, dan *logout*.
- Penambahan skema tabel *database* baru.

## References
- *SWE Authentication Fundamentals*
- Pertimbangan Keamanan Data *Point of Sales* & Operasional *Shift Device*.
