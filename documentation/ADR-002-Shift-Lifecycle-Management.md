# ADR 002: Shift Lifecycle & Operating Hours Enforcement

## Status
Accepted

## Context
Saat ini, logika pembatasan waktu operasional outlet (jam buka dan jam tutup) hanya dieksekusi ketika Kasir **membuka** shift (`OpenShift`). Setelah shift terbuka, kasir bisa terus membuat transaksi kapan pun tanpa batasan waktu selama shift belum ditutup.

Masalah muncul jika kasir tidak menutup *browser* atau hanya *logout* seadanya tanpa menutup shift di hari tersebut. Shift akan menggantung (*stale*) dan bisa berjalan puluhan jam melewati bergantinya hari. Hal ini berdampak buruk terhadap laporan keuangan harian dan menghancurkan integritas (*accuracy*) perhitungan jumlah uang fisik (`EndingCash` dan `Discrepancy`) di setiap shift.

Kita tidak bisa begitu saja melakukan **Auto-Close Shift** via script per jam, sebab sistem Point of Sales mewajibkan kasir manusia yang menghitung dan menginput setoran fisik aktual mereka agar pembukuan selisih dapat dievaluasi.

## Decision
Kita akan menerapkan konsep **Shift Locked/Expiration** berdasarkan waktu operasional dan usia shift, ditambah mekanisme paksaan rekonsiliasi ke kasir secara *frontend*. 

Karena penegakan keamanan waktu secara ketat sangat merepotkan *developer* (yang kerap membangun aplikasi di malam hari saat *outlet* secara logis ditutup), di dalam iterasi perubahan yang sama kita akan menyematkan **Development Bypass**.

Rincian arsitekturnya:

1. **Aturan Usia Shift (Max 24 Jam):** 
   Jika umur sebuah shift sudah lebih dari 24 jam (`time.Since(shift.StartedAt)`), _semua_ transaksi baru diblokir.
2. **Aturan Operasional & Batas Toleransi:** 
   Di setiap proses pembuatan maupun pembatalan transaksi, sistem akan mengecek waktu _real-time_. Jika waktu saat ini telah melampaui `CloseTime` outlet ditambah dengan toleransi **30 Menit**, backend menolak transaksi dengan error `"Waktu operasional outlet telah berakhir. Harap segera Tutup Shift."`.
3. **Respons UI Penguncian Paksa:** 
   *Frontend* dirancang untuk membedakan kode *error* shift kedaluwarsa. Begitu tertangkap, layar keranjang/transaksi utama dilumpuhkan dan digantikan oleh *Alert Dialog* fatal yang tidak memiliki tombol batal, yang memaksa rute pindah secara *redirect* ke layar perhitungan uang / *Close Shift*.
4. **Environment Check (Development Bypass):** 
   Pengecekan nomor (2) dihiraukan/dilewati sepenuhnya jika menemukan *environment variable* `BYPASS_TIME_CHECK=true`. Demikian pula jika Outlet tidak diset nilai *operating hours*-nya di dalam _database_ (Field `NULL`, yang direpresentasikan sebagai toko 24 jam).

## Consequences

**Positif (Mitigasi Risiko):**
- Batas umur shift selaras dengan tutup kedai sungguhan. Kasir dipaksa jujur menyetor laci uang pada harinya, meminimalisir risiko uang menginap.
- Pengembangan tetap cepat, programmer cukup pakai bypass `BYPASS_TIME_CHECK` tanpa memanipulasi *database*.
- Tidak ada data selisih / *Discrepancy* uang yang ghoib yang akan biasa terjadi jika shift ditutup oleh *cronjob*.

**Negatif (Trade-offs Teknis):**
- Perlu ada perubahan rutin pada komponen Usecase setiap kali alur transaksi bertambah, dan refaktorisasi utilitas kalkulasi penzona waktu. 
- Harus dipastikan konfigurasi env di production _tidak_ memuat flag bypass secara tidak sengaja.
