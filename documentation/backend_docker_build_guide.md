# Panduan Build Docker Backend (DahlanPOS)

## Konteks Dockerfile
Arsitektur _container_ backend DahlanPOS menggunakan pendekatan **"Pre-built Binary"** untuk mempercepat proses pembuatan image dan menekan ukuran file Docker. Pendekatan ini tercermin pada baris di `backend/Dockerfile`:
```dockerfile
# Copy the pre-built Linux binary (built on host)
COPY server_linux ./server
```
Artinya, Docker sama sekali **TIDAK** melakukan proses kompilasi kode (`go build`) di dalam container miliknya sendiri. Docker hanya akan meng-copy file bernama `server_linux` dari folder `backend/` milik Anda (sistem Windows Anda).

## Implikasi Terhadap Development
Konfigurasi ini memunculkan sebuah jebakan umum: 
Jika Anda mengedit *source code* Go (seperti menambah / mengubah logika), dan Anda langsung menekan tombol _Restart Docker_ atau mengetikkan `docker compose up --build`, perubahan kodingan Anda **TIDAK AKAN** terdeteksi pada aplikasi. 
Hal tersebut dikarenakan _docker_ hanya menyalin (_copy_) file instruksi `server_linux` versi lama (yang di-build di hari sebelumnya).

## Standard Operation Procedure (SOP) Build

Supaya kodingan Go versi terbaru yang baru saja Anda ubah bisa masuk dan berjalan di dalam Docker, Anda wajib melakukan **Cross-Compile (Kompilasi dari Windows ke Linux)** secara manual sebelum me-restart container, dengan cara:

### Tahap 1: Kompilasi Binary Khusus Linux
Buka Terminal _Command Prompt_ atau _PowerShell_ yang sedang berada di dalam direktori `backend/`, lalu jalankan instruksi ini:

**PowerShell:**
```powershell
$env:GOOS="linux"; $env:GOARCH="amd64"; go build -o server_linux ./cmd/server
```

**Git Bash / WSL / Linux / Mac:**
```bash
GOOS=linux GOARCH=amd64 go build -o server_linux ./cmd/server
```
*(Perintah ini bertugas membaca kode Go terbaru milik Anda dan membungkusnya menjadi satu file hijau `.exe / executable` tanpa nama tambahan yang bisa dijalankan di Linux, yang diberi nama `server_linux`)*

### Tahap 2: Build & Restart Docker Compose
Setelah kompilasi usai dan file `server_linux` diperbarui detiknya, barulah Anda boleh meminta _Docker Compose_ untuk mengemas pembaruannya. Kembali ke folder akar dahlanpos (level atas) dan terminal Anda bisa menjalankan:

```powershell
docker compose up -d --build backend
```

Bila instruksi berjalan, maka Backend DahlanPOS Anda sudah resmi ter-update dengan logika kodingan Go yang termutakhir!
