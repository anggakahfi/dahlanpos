# LAPORAN PROYEK
SISTEM PENDATAAN OBAT UNTUK APOTEK SEGAR BERBASIS WEBSITE
```
Oleh:
```
```
Lisya Kartikawarna Maharani (2200018209)
```
```
Aliya Sofura Nuzband (2200018210)
```
```
Alfah (2200018235)
```
```
Kurnia Meiliyani (2200018242)
```
```
Nabila Awalia (2200018245)
```
PROGRAM STUDI S1 INFORMATIKA
FAKULTAS TEKNOLOGI INDUSTRI
UNIVERSITAS AHMAD DAHLAN
TAHUN 2025
2
LEMBAR PENGESAHAN
SISTEM PENDATAAN OBAT APOTEK SEGAR BERBASIS WEBSITE
Yogyakarta
Kaprodi S1 Informatika
Dr. Murinto, S.Si., M.Kom.
NIPM. 19730710 200409 111 0951298
3
KATA PENGANTAR
Segala puji dan syukur kami panjatkan ke hadirat Tuhan Yang Maha Esa
atas rahmat dan hidayah-Nya sehingga kami dapat menyelesaikan laporan proyek
ini dengan lancar. Laporan ini disusun sebagai salah satu bentuk pemenuhan tugas
akhir pada mata kuliah Manajemen Proyek Teknologi Informasi, dengan judul
"Sistem Pendataan Obat Apotek Segar Berbasis Website".
Laporan ini memuat seluruh tahapan yang kami jalani dalam proses
pengembangan sistem pendataan obat, mulai dari identifikasi kebutuhan sistem,
perancangan antarmuka, implementasi fungsi, hingga tahap pengujian dan
evaluasi website. Kami berharap laporan ini dapat memberikan penjelasan yang
menyeluruh mengenai proses dan hasil dari proyek yang telah kami kerjakan, serta
menjadi referensi yang bermanfaat bagi pihak-pihak yang membutuhkan.
Kami menyadari bahwa dalam proses penyusunan laporan ini masih
terdapat berbagai kekurangan. Oleh karena itu, kami sangat mengharapkan saran
dan masukan yang membangun untuk penyempurnaan di masa mendatang.
Ucapan terima kasih kami sampaikan kepada semua pihak yang telah memberikan
dukungan dan bantuan selama pengerjaan proyek ini, khususnya kepada:
1. Bapak Dr. Murinto, S.Si., M.Kom., selaku Kepala Program Studi Informatika
Universitas Ahmad Dahlan Yogyakarta.
2. Ibu Dwi Normawati, S.T., M.Eng. selaku dosen yang telah memberikan
arahan dan bimbingan selama pelaksanaan proyek.
3. Pihak Apotek Segar yang telah memberikan kesempatan serta informasi
yang dibutuhkan dalam pengembangan sistem.
4. Seluruh anggota tim pengembang, atas kerja sama dan kontribusi yang luar
biasa selama pelaksanaan proyek ini.
Akhir kata, semoga laporan ini dapat memberikan manfaat dan menjadi kontribusi
nyata dalam penerapan teknologi informasi, khususnya dalam bidang manajemen
data pada layanan kesehatan.
Yogyakarta, 12 Juli 2025
Hormat Kami
Web Masters Technology
4
DAFTAR ISI
LEMBAR PENGESAHAN ..................................................................................................... 2
KATA PENGANTAR ............................................................................................................ 3
DAFTAR ISI ........................................................................................................................ 4
DAFTAR GAMBAR ............................................................................................................. 6
SOURCE CODE................................................................................................................... 8
DAFTAR TABEL .................................................................................................................. 9
BAB I PENDAHULUAN ..................................................................................................... 10
A. Latar Belakang ........................................................................................................... 10
B. Project Charter .......................................................................................................... 11
1. Tujuan .............................................................................................................. 11
2. Ruang Lingkup ................................................................................................. 12
3. Stakeholder...................................................................................................... 15
BAB II PERENCANAAN PROYEK ....................................................................................... 17
A. Analisis Kelayakan ..................................................................................................... 17
B. Work Breakdown Structure....................................................................................... 19
C. Kebutuhan Sumber Daya .......................................................................................... 22
1. Sumber Daya Manusia ..................................................................................... 22
2. Sumber Daya Fisik............................................................................................ 25
D. Rencana Jadwal Pelaksanaan Proyek ........................................................................ 26
E. Rencana Nilai Proyek ................................................................................................. 28
BAB III PELAKSANAAN PROYEK ....................................................................................... 30
A. Realisasi Jadwal Pelaksanaan .................................................................................... 30
B. Realisasi Hasil Pekerjaan ........................................................................................... 31
C. Penjaminan Kualitas Proyek ...................................................................................... 96
5
D. Keberlanjutan Proyek ................................................................................................ 97
BAB IV Penutup .............................................................................................................. 98
A. Kesimpulan ................................................................................................................ 98
B. Saran.......................................................................................................................... 99
DAFTAR PUSTAKA ......................................................................................................... 100
LAMPIRAN .................................................................................................................... 101
A. Proposal Proyek....................................................................................................... 101
B. Surat Perintah Kerja Dengan Mitra ......................................................................... 102
C. Log Book Kelompok Sudah Terisi Minimal 7x ......................................................... 105
D. Log Book Individu Sudah Terisi Minimal 7x ............................................................. 107
E. Foto Dokumentasi Kegiatan Proyek ........................................................................ 115
F. Bukti Serah Terima Proyek ...................................................................................... 116
G. Bukti Pembayaran ................................................................................................... 118
H. Tools: Source Code Dan Hosting ............................................................................. 119
I. Link Video Profil Produk Luatan Proyek .................................................................. 119
J. Poster Produk Luaran Proyek .................................................................................. 120
K. Slide Presentasi Proyek ........................................................................................... 120
6
DAFTAR GAMBAR
Gambar 1. 1. Stakeholder ................................................................................................. 15
Gambar 2. 1. Rencana Nilai Proyek ................................................................................... 28
Gambar 3. 1. Poster .......................................................................................................... 35
Gambar 3. 2. Use Case Diagram........................................................................................ 38
Gambar 3. 3. ERD .............................................................................................................. 40
Gambar 3. 4. Activity Diagram Login ................................................................................ 41
Gambar 3. 5. Activity Diagram Beranda............................................................................ 42
Gambar 3. 6. Activity Diagram Data Obat ......................................................................... 43
Gambar 3. 7. Activity Diagram Pemasok........................................................................... 40
Gambar 3. 8. Activity Diagram Transaksi Obat Masuk ..................................................... 41
Gambar 3. 9. Activity Diargam Transaksi Obat Keluar ...................................................... 42
Gambar 3. 10. Activity Diagram Laporan Stok Obat ......................................................... 43
Gambar 3. 11. Activity Diagram Laporan Obat Masuk ..................................................... 44
Gambar 3. 12. Activity Diagram Laporan Obat Keluar ...................................................... 45
Gambar 3. 13. Activity Diagram Manajemen User ........................................................... 46
Gambar 3. 14. Activity Diagram Profil............................................................................... 47
Gambar 3. 15. Sequence Diagram Login Admin ............................................................... 48
Gambar 3. 16. Sequence Diagram Admin ......................................................................... 49
Gambar 3. 17. UI Halaman Login ..................................................................................... 51
Gambar 3. 18. UI Halaman Dashboard ............................................................................. 51
Gambar 3. 19. UI Halaman Data Obat .............................................................................. 52
Gambar 3. 20. UI Halaman Input Obat ............................................................................. 53
Gambar 3. 21. UI Halaman Pemasok ................................................................................ 53
Gambar 3. 22. UI Halaman Transaksi Obat Masuk ........................................................... 54
Gambar 3. 23. UI Halaman Transaksi Obat Keluar............................................................ 55
Gambar 3. 24. UI Halaman Laporan Stok Obat ................................................................. 55
Gambar 3. 25. UI Halaman Laporan Obat Masuk ............................................................. 56
Gambar 3. 26. UI Halaman Manajemen User ................................................................... 57
Gambar 3. 27. UI Halaman Profil User .............................................................................. 57
Gambar 3. 28 Prototype pada Figma ................................................................................ 58
Gambar 3. 29. Frontend Tampilan Dashboard ................................................................. 67
Gambar 3. 30. Frontend Tampilan Data Obat................................................................... 68
7
Gambar 3. 31 Frontend Tampilan Input Obat .................................................................. 69
Gambar 3. 32 Frontend Tampilan Laporan Stok Obat ...................................................... 70
Gambar 3. 33. Frontend Tampilan Laporan Obat Masuk ................................................. 70
Gambar 3. 34 Frontend Tampilan Pemasok ..................................................................... 71
8
SOURCE CODE
Source Code 3. 1 Library Bootsrap.................................................................................... 59
Source Code 3. 2 library CSS ............................................................................................ 60
Source Code 3. 3 Library Jquery ........................................................................................ 60
Source Code 3. 4 Plugin jQuery maskMoney .................................................................... 60
Source Code 3. 5 Plugin Data Tables................................................................................. 61
Source Code 3. 6 Plugin Chosen........................................................................................ 61
Source Code 3. 7 Plugin Datepicker .................................................................................. 61
Source Code 3. 8 Plugin SlimScroll .................................................................................... 62
Source Code 3. 9 Implementasi Boostrap Button ............................................................. 62
Source Code 3. 10 Implementasi CSS................................................................................ 63
Source Code 3. 11 Frontend Sidebar Menu ...................................................................... 64
Source Code 3. 12 Frontend Input Data Obat................................................................... 65
Source Code 3. 13 Tampilan Laporan Stok Obat .............................................................. 66
Source Code 3. 14 Tambah data user ............................................................................... 66
Source Code 3. 15 Beranda.php........................................................................................ 72
Source Code 3. 16 Lap-obat-keluar: cetak.php ................................................................. 74
Source Code 3. 17 Lap-obat-masuk : cetak.php ............................................................... 76
Source Code 3. 18 Obat : Form.php .................................................................................. 77
Source Code 3. 19 Obat : proses.php................................................................................ 80
Source Code 3. 20 Obat-keluar : form.php ....................................................................... 82
Source Code 3. 21 Password : proses.php ........................................................................ 84
Source Code 3. 22 Profil : form.php .................................................................................. 87
Source Code 3. 23 User : form.php ................................................................................... 88
Source Code 3. 24 Check Login.php .................................................................................. 89
9
DAFTAR TABEL
Tabel 2. 1. Analisis SWOT .................................................................................................. 17
Tabel 2. 2. Work Breakdown Structure ............................................................................. 19
Tabel 2. 3. Sumber Daya Manusia .................................................................................... 22
Tabel 2. 4. Sumber Daya Fisik ........................................................................................... 25
Tabel 2. 6. Pengeluaran..................................................................................................... 28
Tabel 2. 7. Pemasukan ...................................................................................................... 29
Tabel 3. 1 Jadwal Pelaksanaan Proyek .............................................................................. 26
Tabel 3. 2. Realisasi Jadwal Pelaksaan .............................................................................. 30
Tabel 3. 3. Project Charter ................................................................................................ 31
Tabel 3. 4. Gantt chart ...................................................................................................... 32
Tabel 3. 5. Kebutuhan Fungsional ..................................................................................... 36
Tabel 3. 6. Kebutuhan Non-Fungsional ............................................................................. 37
Tabel 3. 8. Realisasi Pembagian Tugas Tester & Back end 2 ............................................. 91
Tabel 3. 9. Pengujian Sistem Pada Blackbox Tetsting ....................................................... 92
Tabel 3. 10 Pengujian tahap 2 menggunakan Black-box Testing ...................................... 93
Tabel 3. 11. Hasil Pengujian Menggunakan Framework PIECES ....................................... 94
Tabel 3. 12. Penjelasan Hasil Pengujian menggunakan framework PIECES ..................... 95
10
BAB I PENDAHULUAN
A. Latar Belakang
Perkembangan teknologi informasi yang begitu pesat dalam dua
dekade terakhir telah mendorong transformasi digital di hampir seluruh
sektor kehidupan manusia, termasuk di bidang kesehatan dan farmasi.
Perubahan ini memungkinkan transisi dari sistem konvensional menuju
sistem digital yang lebih terintegrasi dan efisien. Dalam konteks ini,
pemanfaatan sistem informasi berbasis web menjadi solusi yang
menjanjikan untuk meningkatkan efisiensi, transparansi, dan
akuntabilitas dalam pengelolaan data kesehatan, termasuk data obat-
obatan di apotek[1].
Sebagai unit pelayanan kesehatan yang berperan dalam distribusi
obat kepada masyarakat, apotek membutuhkan sistem manajemen data
yang akurat dan dapat diandalkan. Sayangnya, sebagian besar apotek
masih menggunakan metode pencatatan manual seperti buku besar
atau spreadsheet sederhana, yang rentan terhadap kesalahan input,
keterlambatan pembaruan data stok, dan kesulitan dalam pelacakan
kadaluarsa obat. Hal ini berdampak negatif terhadap mutu pelayanan
dan keselamatan pasien[2]. Penelitian sebelumnya menunjukkan bahwa
sistem manual dalam pengelolaan data obat menyulitkan proses
pendataan, memperlambat transaksi, serta meningkatkan risiko
kekeliruan dalam pengelolaan stok[3].
Untuk menjawab tantangan tersebut, diperlukan pengembangan
dan implementasi sistem informasi manajemen apotek berbasis web
yang mampu mengelola stok, memantau masa kadaluarsa obat, dan
menghasilkan laporan secara otomatis serta real-time. Sistem ini
memungkinkan akses informasi yang lebih cepat dan tepat bagi staf
maupun manajemen apotek, serta mendukung pengambilan keputusan
yang lebih akurat dalam pengadaan dan distribusi obat[4]. Studi di RS
11
Bina Kasih juga menunjukkan bahwa sistem informasi berbasis web
mampu meningkatkan efisiensi pencatatan, mempercepat pelaporan,
dan mengurangi kesalahan pencatatan hingga 80%.
Apotek Segar sebagai salah satu apotek yang berkembang turut
menghadapi permasalahan serupa. Pengelolaan data obat masih
dilakukan secara konvensional, sehingga menimbulkan risiko tinggi
terhadap kesalahan pencatatan seperti stok yang tidak akurat dan
keterlambatan identifikasi masa kedaluwarsa. Hal ini berdampak pada
efisiensi operasional dan kepuasan pelanggan. Oleh karena itu,
dibutuhkan sistem pendataan obat yang mampu memberikan notifikasi
kedaluwarsa, laporan harian, serta rekapitulasi pembelian dan
pengeluaran obat secara real-time.
Dengan mengimplementasikan sistem informasi pendataan obat
berbasis web, Apotek Segar diharapkan dapat meningkatkan efisiensi
kerja, mengurangi beban administratif, dan memberikan pelayanan
yang lebih cepat serta akurat kepada masyarakat. Selain menjadi bagian
dari adaptasi terhadap transformasi digital di sektor farmasi, sistem ini
juga diharapkan dapat menjadi dasar pengambilan keputusan strategis
berbasis data dalam pengadaan, promosi, hingga perencanaan bisnis
jangka panjang.
B. Project Charter
1. Tujuan
Tujuan utama dari pengembangan website "Apotek Segar" adalah
sebagai berikut:
```
a) Meningkatkan Efisiensi Pengelolaan Data Obat
```
Membantu apotek dalam mencatat, memperbarui, dan
mengelola data obat secara sistematis dan terpusat dalam satu
platform berbasis web.
12
```
b) Mempermudah Pelacakan Stok Obat
```
Memungkinkan staf apotek untuk memantau jumlah stok obat
secara real-time guna menghindari kekurangan atau kelebihan
persediaan.
```
c) Mendukung Proses Pengambilan Keputusan
```
Menyediakan laporan dan data yang akurat terkait jenis obat,
jumlah stok, dan riwayat transaksi untuk mendukung keputusan
manajerial.
```
d) Meningkatkan Akurasi dan Keamanan Data
```
Mengurangi risiko kesalahan pencatatan manual dan memastikan
data obat tersimpan dengan aman serta dapat diakses kapan saja.
```
e) Mempermudah Proses Audit dan Pengawasan
```
Memudahkan pemilik apotek atau pihak terkait dalam melakukan
audit terhadap pergerakan dan persediaan obat.
```
f) Memberikan Aksesibilitas yang Lebih Baik
```
Karena berbasis web, sistem dapat diakses dari berbagai
perangkat dan lokasi selama terhubung dengan internet, tanpa
terbatas oleh perangkat tertentu.
2. Ruang Lingkup
Proyek ini dirancang untuk mengembangkan Sistem
Pendataan Obat berbasis website untuk Apotek Segar. Sistem ini
bertujuan untuk membantu pengelolaan data obat secara digital
agar lebih efisien, akurat, dan mudah diakses, baik oleh petugas
apotek maupun pihak manajemen.
Fitur utama dalam proyek:
1. Dashboard Utama
Menampilkan statistik stok obat diantaranya jumlah stok obat
yang tersedia, jumlah data obat masuk, jumlah laporan stok
obat, dan jumlah laporan obat masuk yang ditampilkan pada
halaman utama website.
13
2. Tambah Stok Obat
Fitur untuk menambah obat baru, dengan data lengkap seperti
nama obat, kategori, harga, stok, dan tanggal kadaluarsa.
3. Edit dan Hapus Obat
Menyediakan opsi untuk memperbarui informasi obat atau
menghapusnya dari sistem.
4. Pencarian Obat
Pencarian berdasarkan nama obat, kategori, atau ID obat untuk
memudahkan akses informasi.
5. Login dengan Username dan Password
Setiap pengguna harus memiliki akun dengan username dan
password yang kuat.
6. Tampilan Responsif
Tampilan responsif memastikan admin dapat mengelola sistem
```
dengan mudah di berbagai perangkat (desktop, tablet,
```
```
smartphone) tanpa kesulitan.
```
7. Ubah Password
Pengguna dapat mengubah password dengan mengakses
pengaturan akun, memasukkan password lama, dan memilih
password baru yang aman.
8. Laporan stok obat
Menampilkan informasi terkait jumlah stok obat yang tersedia,
serta status stok obat yang hampir habis atau sudah
kadaluarsa, untuk membantu admin dalam mengelola
persediaan obat.
9. Laporan obat masuk
Mencatat dan menampilkan data obat yang masuk ke apotek,
termasuk tanggal masuk, jumlah obat, dan pemasok, untuk
memantau aliran obat yang diterima dan memastikan
pengelolaan stok yang baik.
14
10. laporan obat terjual
Mencatat dan menampilkan data obat yang keluar ke apotek,
termasuk tanggal keluar, jumlah obat, untuk memantau aliran
obat yang terjual dan memastikan pengelolaan penjualan yang
baik.
11. Logout
Admin mengakhiri sesi login, keluar dari sistem, dan diarahkan
ke halaman login untuk memastikan keamanan dan mencegah
akses tidak sah.
Pengguna Sistem:
● Admin – mengelola pengguna dan data utama.
● Apoteker – memantau stok, mengelola data obat, dan
membuat laporan.
● Staff Gudang – mencatat stok masuk dan keluar.
Batasan Proyek:
● Sistem akan dikembangkan dalam jangka waktu empat
bulan.
● Fokus utama pengembangan adalah untuk penggunaan
internal apotek, bukan untuk transaksi penjualan
online ke pelanggan umum.
● Proyek ini mencakup masa garansi selama 1 bulan
setelah sistem selesai dan diserahkan.
● Untuk tetap menikmati fasilitas website setelahnya,
pengguna cukup melakukan perpanjangan domain dan
hosting secara berkala.
● Biaya domain dan hosting tidak termasuk ke dalam
biaya jasa pembuatan website ini, dan menjadi
tanggung jawab pihak Apotek Segar.
15
3. Stakeholder
Berikut adalah penjelasan stakeholder untuk proyek "Sistem pendataan
obat untuk apotek segar berbasis website"
Gambar 1. 1. Stakeholder
Fungsi dan Tugas dari stakeholder dari Sistem pendataan obat untuk
apotek segar berbasis website:
a. Pemilik Apotek
Pemilik apotek bertanggung jawab sebagai pengambil keputusan
utama dalam pengembangan dan penerapan sistem pendataan obat.
Perannya meliputi penyediaan anggaran, persetujuan terhadap
rancangan sistem, serta pemantauan terhadap keberhasilan
implementasi sistem. Pemilik juga memastikan bahwa sistem dapat
meningkatkan efisiensi operasional dan memudahkan pengawasan
terhadap pengelolaan obat di apotek.
b. Admin Apotek
Admin apotek berperan sebagai pengguna utama yang menjalankan
sistem secara langsung dalam operasional harian. Tugasnya meliputi
input data obat baru, memperbarui stok obat, memeriksa histori
transaksi obat masuk/keluar, dan mencetak laporan data obat. Admin
16
juga menjadi penghubung antara pihak pengembang dengan pemilik
apotek apabila terjadi kendala teknis atau dibutuhkan pengembangan
fitur baru.
c. Tim Pengembang IT
Tim Pengembang IT berfungsi untuk merancang, mengembangkan,
dan memastikan Sistem Pendataan Obat untuk Apotek Segar berbasis
website berjalan sesuai dengan kebutuhan operasional apotek. Tugas
pengembang meliputi menganalisis kebutuhan pengguna dan alur
kerja pengelolaan obat di apotek, merancang arsitektur sistem yang
efisien dan skalabel, serta mengembangkan aplikasi web yang
mendukung fitur pencatatan data obat, manajemen stok, serta cetak
laporan obat.
d. Distributor Apotek
Distributor obat merupakan pihak eksternal yang menyuplai obat ke
apotek. Dalam sistem ini, distributor berperan menerima informasi
terkait permintaan pasokan obat dari admin, serta memberikan data
pengiriman dan faktur. Sistem ini memungkinkan admin untuk
mencatat riwayat pemesanan dari distributor serta memantau status
pengiriman, sehingga pengelolaan pasokan obat dapat dilakukan
secara lebih terstruktur dan efisien.
17
BAB II PERENCANAAN PROYEK
A. Analisis Kelayakan
Tabel 2. 1. Analisis SWOT
```
STRENGTH (KEKUATAN) - Mempercepat proses
```
pendataan dan pencatatan
stok obat secara real-time.
- Kemudahan dalam memantau
ketersediaan obat kapan saja dan di
mana saja.
- Meningkatkan efisiensi kerja
apoteker dan staf apotek.
- Pengelolaan data obat
menjadi lebih terstruktur dan
terdokumentasi dengan baik.
- Penggunaan sistem berbasis
web mengurangi
ketergantungan pada
pencatatan manual.
WEAKNESSES
```
(KELEMAHAN)
```
- Membutuhkan koneksi internet yang
stabil untuk akses sistem.
- Biaya awal pengembangan sistem
bisa tinggi.
- Kemungkinan kurangnya keahlian
teknis pengguna dalam
mengoperasikan sistem.
- Potensi kesalahan input data oleh
pengguna yang belum terlatih.
- Ketergantungan pada perangkat
elektronik.
18
OPPORUNITIE
S
```
(KESEMPATA
```
```
N)
```
- Potensi integrasi dengan sistem
lain seperti layanan resep online
atau konsultasi apoteker.
- Dapat dikembangkan menjadi sistem
multi-cabang untuk apotek yang
memiliki banyak lokasi.
- Mendukung upaya digitalisasi sektor
kesehatan.
- Memungkinkan analisis data
penjualan dan stok obat untuk
perencanaan bisnis.
- Dapat memberikan laporan otomatis
dan akurat untuk pengambilan
keputusan manajemen.
```
THREATS (ANCAMAN) - Risiko keamanan data apabila
```
sistem tidak dilengkapi proteksi
yang memadai.
- Gangguan server atau sistem
bisa menghambat
operasional apotek.
- Persaingan dengan sistem serupa dari
penyedia teknologi lain.
- Resistensi dari karyawan yang sudah
terbiasa dengan sistem manual.
- Perubahan regulasi dari pemerintah
yang mempengaruhi sistem
pendataan obat.
19
B. Work Breakdown Structure
Tabel 2. 2. Work Breakdown Structure
TASK ID TASK DESKRIPSI
1 Perencanaan Proyek
1.1 Penentuan Tim Proyek
1.1. 1 Identifikasi Keterampilan yang Diperlukan
1.1. 2 Penentuan Tanggung Jawab Setiap Anggota
1.1. 3 Pembentukan Struktur Tim
1.2 Mencari Client
1.3 Pembuatan Proposal Client
1.3. 1 Penyusunan Proposal
1.3. 2 Komunikasi Proposal dengan Client
1.3. 3 Persetujuan MoU
1.4 Mendefinisikan tujuan proyek
1.5 Mendefinisikan Resiko
1.6 Analisis Kebutuhan
1.6. 1 Mendefinisikan Kebutuhan Pengguna
1.6. 2
```
Mendefinisikan Kebutuhan Sistem (kebutuhan fungsional
```
```
dan non-fungsional)
```
1.7 Penjadwalan
1.7. 1 Penyusunan Jadwal Proyek
1.7. 2 Alokasi Waktu untuk Setiap Tahapan
1.8 Penganggaran
1.8. 1 Identifikasi Biaya
20
1.8. 2 Penyusunan Rincian Anggaran
1.8. 3 Review dan Persetujuan Anggaran
1.9 Pembuatan MoU
1.9. 1 Penyusunan MoU
1.9. 2 Komunikasi MoU dengan Klien
1.9. 3 Persetujuan MoU
2 Desain Aplikasi
2.1 Merancang Kebutuhan Sistem
2.1. 1 Merancang Flowchart
2.1. 2 Merancang entity relationship diagram
2.1. 3 Desain Database
```
2.2 Perancangan (UI/UX)
```
2.2. 1 Desain Antarmuka
2.2. 2 Desain Prototype
2.2.2. 1 Pengujian Prototype
2.2.2 2 Revisi Prototype
3 Pengembangan Aplikasi Apotek
3.1 Merancang algoritma pemrograman
3.2 Pengembangan Frontend dan Backend
3.3 Pengembangan halaman pengguna
3.4 Pengembangan halaman utama
3.5 Pengembangan halaman pencarian obat
3.5. 1 Pencarian berdasarkan nama obat
3.5. 2 Pencarian berdasarkan kategori
3.5. 3 Pencarian berdasarkan kriteria lain
21
3.6 Pengembangan halaman laporan obat
3.6. 1 Laporan stok obat
3.6. 2 Laporan obat masuk
3.6. 3 Laporan obat terjual
3.7 Pengembangan halaman ubah password
3.8 Pengembangan halaman profil
3.9 Pengembangan fitur cetak
4.0 Pengembangan fitur edit obat
4.1 Pengembangan fitur hapus obat
4.2 Pengembangan fitur logout
4 Pengujian aplikasi
4.1 Pengujian kelayakan sistem
4.2 Pengujian fungsional
5 Peluncuran aplikasi
5.1 Pelatihan pengguna
5.2 Serah terima sistem kepada client
5.3 Peluncuran ke publik
6 Pemeliharaan dan Pembaharuan sistem
6.1 Pemantauan Kinerja
6.2 Penanganan Bug
6.3 Pembaruan Fitur
22
C. Kebutuhan Sumber Daya
1. Sumber Daya Manusia
Tabel 2. 3. Sumber Daya Manusia
No. Posisi dan Peran Deskripsi Tugas
1. Project Manager &
```
Frontend (Lisya
```
Kartiwarna
```
Maharani_2200018209)
```
Project Manager
a. Membentuk tim proyek
b. Mempin setiap pertemuan rapat
c. Memimpin penentuan, pembagian
jobdesk masing-masing anggota
d. Membuat proposal proyek untuk
client
e. Membuat rincian biaya pemasukan,
pengeluaran, dan rekapitulasi dana
total
f. Mengelola dana secara maksimal
dan efektif
g. Membuat Laporan MPTI hasil
pengerjaan yang bekerja sama
dengan seluruh anggota
Frontend
a. Membangun antarmuka pengguna
berbasis web menggunakan HTML,
CSS, dan JavaScript.
b. Berkolaborasi dengan desainer
UI/UX untuk menerapkan desain ke
dalam kode.
23
c. Memastikan kompatibilitas lintas
peramban dan responsivitas situs
web.
2. System Analyst (Nabila
```
Awalia_2200018245)
```
a. Menganalisis kebutuhan fungsional
dan kebutuhan non fungsional
b. Melakukan analisis terhadap sistem
yang akan dibuat
c. Membuat proses bisnis, UML, alur
dan fitur yang akan digunakan
system
3. Backend (Aliya Sofura
```
Nuzband_2200018210)
```
a. Membangun logika bisnis, basis data,
dan fungsi server menggunakan
bahasa pemrograman seperti
Python, PHP, atau Node.js.
b. Mengelola keamanan dan
skalabilitas sistem.
4. UI/UX Designer &
Frontend
```
(Alfah_2200018235)
```
UI/UX Designer
a. Merancang antarmuka website yang
menarik, fungsional, dan mudah
dipahami.
b. Mengembangkan wireframe,
mockup, dan prototype sebagai
bagian dari proses desain iteratif.
c. Membuat prototype interaktif yang
dapat diuji langsung oleh pengguna.
d. Melakukan pengujian UI/UX
```
(usability testing) dan menganalisis
```
feedback untuk meningkatkan
kualitas pengalaman pengguna.
24
Frontend
a. Membangun antarmuka pengguna
berbasis web menggunakan HTML,
CSS, dan JavaScript.
b. Memastikan situs web tampil
dengan baik berbagai jenis browser
dan perangkat, seperti komputer,
tablet, dan ponsel.
5. Quality Assurance
Engineer & Backend
```
(Kurnia
```
```
Meiliyani_2200018242)
```
Quality Assurance Engineer
a. Bertanggung jawab atas pengujian
perangkat lunak untuk memastikan
kualitas produk.
b. Mengembangkan skenario
pengujian dan melakukan pengujian
fungsional, pengujian integrasi, dan
pengujian kinerja.
c. Melacak dan melaporkan bug serta
bekerja sama dengan pengembang
untuk perbaikan.
Backend
a. Membantu pekerjaan pengembang
backend utama.
b. Mendesain skema database.
c. Debugging dan log error aplikasi
25
2. Sumber Daya Fisik
Tabel 2. 4. Sumber Daya Fisik
No. Sumber Daya
Fisik
Deskripsi
1. Komputer dan
Perangkat
Keras
Laptop atau PC dengan spesifikasi tinggi untuk
pengembangan dan pengujian website Apotek
Segar, dengan kriteria sebagai berikut:
● Sistem operasi Windows 10/11 Pro
● RAM minimal 16GB
● Processor Intel Core i3/i5/i7
2. Perangkat
Keras
● IDE pengembangan seperti Visual Studio
Code untuk menulis dan mengelola kode
dengan efisien.
● Perangkat lunak desain seperti Figma
untuk merancang antarmuka pengguna
yang menarik dan fungsional.
● Sistem manajemen basis data seperti
MySQL untuk mengelola data apotek
dengan aman dan terstruktur
3. Koneksi
Internet
Koneksi internet dengan kecepatan minimal 50
Mbps diperlukan untuk memastikan proses
pengembangan dan pengujian online berjalan
dengan lancar tanpa gangguan.
4. Server untuk
hosting
Server yang memiliki kapasitas penyimpanan dan
kecepatan akses yang memadai untuk
mendukung proses hosting website setelah
peluncuran.
26
D. Rencana Jadwal Pelaksanaan Proyek
Tabel 3. 1 Jadwal Pelaksanaan Proyek
27
Tabel 2.5. tersebut menampilkan tabel rencana jadwal pelaksanaan proyek
yang berbentuk mirip dengan Gantt Chart, berisi daftar kegiatan, durasi,
```
tanggal mulai (Start Date), tanggal selesai (End Date), serta visualisasi waktu
```
pelaksanaan dalam bulan Maret hingga September 2025.
1. Perencanaan Proyek
• Dilaksanakan selama 15 hari, mulai 13 Maret 2025 hingga 27
Maret 2025.
• Tahap ini mencakup penentuan tim proyek, tujuan, risiko,
analisis kebutuhan, serta penyusunan jadwal awal.
2. Desain Aplikasi
• Berlangsung selama 42 hari, dari 31 Maret 2025 sampai 12
Mei 2025.
• Fokus utama adalah perancangan sistem, pembuatan
```
automata pengguna (UI/UX), serta desain database.
```
3. Pengembangan Aplikasi Apotek
• Dilaksanakan selama 50 hari, dimulai 13 Mei 2025 hingga 25
Juli 2025.
• Tahap ini melibatkan perancangan program, pengembangan
frontend dan backend, pembuatan halaman pembayaran,
serta integrasi fitur.
4. Pengujian Aplikasi
• Berdurasi 6 hari, mulai 28 Juli 2025 hingga 4 Agustus 2025.
```
• Bertujuan menguji penggunaan (UAT), keamanan data
```
pembayaran, dan performa aplikasi agar sesuai kebutuhan
pengguna.
5. Peluncuran Aplikasi
• Dilakukan selama 3 hari, dari 5 Agustus 2025 hingga 7 Agustus
2025.
• Meliputi serah terima ke klien dan peluncuran ke publik.
28
6. Pemeliharaan dan Pembaruan Sistem
• Berlangsung selama 30 hari, mulai 8 Agustus 2025 hingga 9
September 2025.
• Mencakup pemantauan kinerja, perbaikan bug, serta
penambahan fitur baru agar sistem tetap optimal.
E. Rencana Nilai Proyek
Gambar 2. 1. Rencana Nilai Proyek
1. Pengeluaran
Tabel 2. 5. Pengeluaran
No Komponen Jumlah Total
Biaya Kerja Tim Rp 168.000 Rp 840.000
1. Nabila Awalia (System
```
Analyst)
```
Rp 45.000 Rp 213.000
2. Alfah (UI/UX Design & Rp 113.500 Rp 281.500
29
```
Frontend)
```
3. Lisya Kartikawarna Maharani
```
(Manajer Proyek &
```
```
Pengembang Frontend 2)
```
Rp 38.500 Rp 206.500
4. Aliya Sofura Nuzband
```
(Backend Utama)
```
Rp 115.000 Rp 283.000
5. Kurnia Meiliyani (Quality
Assurance Engineer &
```
Backend 2)
```
Rp 145.000 Rp 313.000
6. Hosting 1 tahun Rp 1.700.000 Rp
1.700.000
Total Pengeluaran Rp
2.997.000
2. Pemasukan
Tabel 2. 6. Pemasukan
No Komponen Jumlah Total
1. DP 1 30% Rp 900.000
2. Pelunasan 70% Rp 2.100.000
Total Pemasukan Rp 3.000.000
30
BAB III PELAKSANAAN PROYEK
A. Realisasi Jadwal Pelaksanaan
Tabel ini beriskan realisasi dari tugas yang sudah kami laksanakan selama
proyek MPTI berlangsung.
Tabel 3. 2. Realisasi Jadwal Pelaksaan
31
B. Realisasi Hasil Pekerjaan
1. Project Manager
```
a) Lisya Kartikawarna Maharani - 2200018209
```
```
1) Membuat Project Charter
```
Project charter adalah dokumen formal yang mengesahkan
sebuah proyek dan memberikan wewenang kepada manajer
proyek untuk memulai dan mengelola proyek. Berikut detail
Project Charter milik kami.
Tabel 3. 3. Project Charter
```
2) Mengatur Durasi Pelaksanaan Proyek dengan menggunakan Gantt Chart
```
Gantt Chart adalah representasi grafis dari jadwal proyek, yang menggunakan
diagram batang untuk menunjukkan tugas-tugas proyek, durasi, dan
ketergantungan antar tugas dalam linimasa. Gantts Chart ini digunakan untuk
Judul Proyek Sistem Pendataan Obat Apotek Segar
Tanggal Mulai 14 Maret 2025
Tanggal Selesai 25 Juli 2025
Manager Proyek Lisya K Maharani
Deskripsi Proyek Sistem Pendataan Obat Apotek Segar ini dibuat
dengan tujuan untuk memudahkan dalam
proses pendataan obat sehingga dapat menjadi
lebih akurat dan efisien.
Ruang Lingkup
Proyek
Analisis Kebutuhan Pengguna, Desain UI/UX,
Pengembangan Front-End dan Back-End,
Integrasi Data, Pengujian dan Uji Coba.
Estimasi Biaya Rp 3.000.000,-00
```
Stakeholder Klien (Pemilik Apotek Segar), Tim Pengembang
```
```
IT (Web Masters Technology)
```
Kriteria Sukses
Proyek
Klien dapat mengelola pendataan obat yang
ada di Apoteknya dengan mudah, cepat, dan
akurat.
Risiko dan Masalah Fitur atau desain akhir tidak sesuai dengan
harapan klien, penundaan rilis website
menyebabkan kerugian finansial dan reputasi.
```
Persetujuan Klien (Pemilik Apotek Segar), Tim Pengembang
```
```
IT (Web Masters Technology)
```
32
mengelola waktu, memastikan setiap tahap berjalan sesuai rencana, dan
menghindari keterlambatan proyek. Berikut adalah Gantt Chart dari pengerjaan
proyek kami.
Tabel 3. 4. Gantt chart
33
```
3) Membuat Agenda Pertemuan dengan Klien
```
```
Tanggal: 7 Maret 2025
```
```
Waktu: 20.00 – 22.00 WIB
```
```
Tempat: Google Meet
```
```
Peserta:
```
1. Bapak Suryadi (Pemilik Apotek Segar – Klien)
2. Lisya Kartikawarna Maharani
3. Aliya Sofura Nuzband
4. Alfah
5. Kurnia Meiliyani
6. Nabila Awalia
```
Agenda:
```
Diskusi kebutuhan dan harapan pengguna terhadap sistem pendataan obat
berbasis website.
```
Pembahasan:
```
1. Latar Belakang Proyek
Lisya K Maharani menjelaskan bahwa sistem ini bertujuan untuk
mempermudah pengelolaan data obat di Apotek Segar, seperti pendataan
obat masuk, keluar, stok, dan riwayat transaksi.
2. Kebutuhan Utama dari Klien
a. Bapak Suryandi menyampaikan bahwa saat ini pencatatan obat masih
dilakukan secara manual menggunakan buku tulis dan Excel.
b. Klien ingin sistem yang mudah digunakan, dapat diakses melalui
komputer dan smartphone, serta memiliki fitur pencarian cepat.
34
3. Fitur yang diinginkan:
a. Pendataan obat masuk dan keluar
b. Informasi stok obat terkini
c. Laporan obat terlaris dan stok menipis
d. Notifikasi otomatis jika stok obat di bawah ambang batas
tertentu
e. Login khusus untuk admin (hanya untuk staf apotek)
f. Riwayat transaksi keluar masuk obat
4. Hak akses
a. Klien menginginkan hanya admin/staf tertentu yang dapat login
ke sistem.
b. Setiap tindakan yang dilakukan oleh admin harus tercatat (audit
```
trail ringan).
```
5. Desain & akses
a. Klien tidak membutuhkan tampilan yang terlalu rumit, cukup
bersih dan fungsional.
b. Website akan diprioritaskan untuk diakses melalui komputer di
meja kasir, tetapi tetap responsif untuk smartphone jika
dibutuhkan.
6. Kebutuhan cetak atau laporan
Klien menginginkan agar data transaksi dapat dicetak atau diunduh
dalam format PDF/Excel, terutama untuk keperluan laporan
bulanan.
7. Ketersediaan data
```
Klien bersedia menyediakan data obat yang tersedia saat ini (nama,
```
```
jumlah, kode, tanggal kadaluarsa, dll) dalam bentuk Excel untuk tahap
```
awal migrasi data.
35
```
4) Membuat Poster
```
Gambar 3. 1. Poster
36
2. System Analyst
```
a) Nabila Awalia - 2200018245
```
```
1) Kebutuhan fungsional
```
Kebutuhan fungsional merupakan kebutuhan yang berhubungan
dengan proses bisnis dari sistem yang dibuat. Kebutuhan
fungsional web dapat dilihat pada tabel.
Tabel 3. 5. Kebutuhan Fungsional
ID Parameter Deskripsi
SKPL-KF-001 Avaibility Mengacu pada kemampuan
perangkat lunak tersebut
untuk selalu tersedia dan
berfungsi dengan baik saat
dibutuhkan oleh pengguna.
SKPL-KF-002 Reliabitly Beroperasi tanpa gangguan.
SKPL-KF-003 Ergonomy Mengacu pada desain
antarmuka pengguna yang
memperhatikan kenyamanan,
efisiensi, dan kegunaan
pengguna. Dalam aplikasi
apotek, ergonomi berarti
menempatkan fungsi dan fitur
dengan cara yang intuitif,
mengurangi kelelahan visual
atau fisik pengguna.
SKPL-KF-004 Portabilty Merujuk pada kemampuan
suatu aplikasi untuk diinstal,
dijalankan, dan digunakan
dengan mudah di berbagai
platform atau lingkungan yang
berbeda.
SKPL-KF-005 Memory Not Assign
37
SKPL-KF-006 Response
time
Software mampu mengirim
notifikasi email kepada
pengguna maksimal dalam
waktu 30 detik.
SKPL-KF-007 Safety Not Assign
```
2) Kebutuhan non-fungsional
```
Tabel 3. 6. Kebutuhan Non-Fungsional
ID Deskripsi
SKPL-KNF-001 Software dapat menampilkan form sign
SKPL-KNF-002 Software dapat menampilkan menu-menu di
aplikasi
SKPL-KNF-003 Software dapat menampilkan notifikasi pada
desktop
SKPL-KNF-004 Software dapat menampilkan transaksi yang
sedang berjalan
SKPL-KNF-005 Software dapat menampilkan manajemen
stok
SKPL-KNF-006 Software dapat mengirimkan notifikasi
SKPL-KNF-007 Mengintegrasikan aplikasi apotek dengan
perangkat keras seperti barcode scanner atau
printer struk
38
```
3) Membuat Use Case Diagram
```
Gambar 3. 2. Use Case Diagram
Use case diagram ini menggambarkan interaksi antara aktor
Admin dengan sistem pengelolaan data obat. Admin adalah satu-
satunya aktor yang memiliki akses penuh untuk menjalankan
seluruh fungsi yang tersedia di sistem.
```
a) Login
```
Sebagai langkah awal, Admin harus melakukan proses login
terlebih dahulu untuk dapat mengakses seluruh fitur sistem.
Proses login ini termasuk dalam alur utama dan bersifat wajib
sebelum tindakan lainnya dapat dilakukan.
39
```
b) Data Obat
```
Setelah berhasil login, Admin dapat mengakses menu Data Obat yang
menjadi pusat dari berbagai fungsi lainnya. Menu ini mencakup
berbagai aktivitas penting terkait pengelolaan obat.
```
c) Laporan Stok
```
```
Sistem menyertakan (include) fitur untuk menampilkan Laporan Stok
```
sebagai bagian dari pengelolaan data obat, sehingga Admin dapat
melihat jumlah dan status ketersediaan obat secara berkala.
```
d) Obat Masuk
```
Fungsi Obat Masuk digunakan untuk mencatat data masuknya obat ke
dalam gudang, yang terhubung langsung dengan data obat.
```
e) Obat Keluar
```
Fungsi Obat Keluar digunakan untuk mencatat pengeluaran obat,
misalnya untuk distribusi atau penjualan, dan merupakan bagian
integral dari pengelolaan data obat.
```
f) Transaksi
```
Setiap pemasukan atau pengeluaran obat tercatat dalam Transaksi,
yang juga merupakan bagian dari proses pengelolaan data obat.
```
g) Pemasok
```
Data obat juga mencakup informasi Pemasok sebagai pihak yang
menyediakan obat, dan menjadi bagian dari sistem yang wajib dikelola.
```
h) Edit Data
```
Admin dapat melakukan Edit Data pada informasi obat yang sudah ada.
Fitur ini bersifat opsional dan hanya digunakan jika diperlukan
perubahan terhadap data obat.
40
```
i) Hapus Data
```
Selain mengedit, Admin juga bisa melakukan Hapus Data untuk
menghilangkan data obat yang sudah tidak relevan atau salah input.
Secara keseluruhan, diagram ini menunjukkan bahwa Admin memiliki
kendali penuh atas sistem, mulai dari login, pengelolaan data obat secara
menyeluruh, hingga pembuatan laporan dan pencatatan transaksi. Relasi
<<include>> menunjukkan bahwa fitur tersebut adalah bagian penting
```
dari fitur utama (data obat), sedangkan <<extend>> menunjukkan fitur
```
tambahan yang dapat digunakan dalam kondisi tertentu.
```
4) Membuat ERD
```
```
Entity Relationship Diagram (ERD) adalah diagram yang digunakan
```
untuk menggambarkan hubungan antar entitas dalam basis data.
Diagram ini membantu dalam merancang dan memvisualisasikan
struktur basis data dengan menunjukkan entitas, atribut, dan hubungan
antar entitas tersebut. dapat dilihat pada tampilan sebagai berikut:
Gambar 3. 3. ERD
41
```
5) Activity Diagram
```
Dalam perancangan menggunakan UML, diperlukan
adanya activity Diagram adalah untuk menggambarkan proses
bisnis dan urutan aktivitas dalam sebuah proses.
```
a) Login
```
Gambar 3. 4. Activity Diagram Login
Gambar 3.4. menggambarkan alur proses login admin pada
sistem pendataan obat "Apotek Segar". Proses dimulai ketika
admin mengakses halaman login, kemudian sistem menampilkan
form login. Admin memasukkan username dan password, lalu
sistem melakukan validasi. Jika data valid, sistem menampilkan
halaman utama sistem pendataan obat. Proses login kemudian
selesai.
42
```
b) Beranda
```
Gambar 3. 5. Activity Diagram Beranda
Gambar 3.5. menggambarkan alur aktivitas admin pada
halaman beranda sistem. Proses dimulai ketika admin mengakses
halaman beranda, lalu sistem menampilkan form login. Setelah
berhasil login, admin dapat memilih menu yang tersedia di
halaman beranda. Sistem kemudian mengeksekusi menu yang
dipilih, sehingga admin bisa mengelola atau melihat data. Proses
berakhir setelah sistem mengeksekusi menu sesuai pilihan admin.
43
```
c) Data Obat
```
Gambar 3. 6. Activity Diagram Data Obat
Gambar 3.6. menunjukkan alur pengelolaan data obat oleh admin
dalam sistem. Proses dimulai dengan membuka halaman data obat, lalu
sistem menampilkan data yang ada. Admin dapat memilih untuk
mengedit data, kemudian sistem menyimpan perubahan. Admin juga bisa
menambah data obat baru, dan sistem akan menyimpannya. Setelah
itu,admin dapat melihat kembali data obat yang telah diperbarui atau
ditambahkan. Proses berakhir setelah data dikelola sesuai kebutuhan.
40
```
d) Pemasok
```
Gambar 3. 7. Activity Diagram Pemasok
Gambar 3.7. menunjukkan alur pengelolaan data obat oleh admin
dalam sistem. Proses dimulai dengan membuka halaman data obat, lalu
sistem menampilkan data yang ada. Admin dapat memilih untuk mengedit
data, kemudian sistem menyimpan perubahan. Admin juga bisa
menambah data obat baru, dan sistem akan menyimpannya. Setelah itu,
admin dapat melihat kembali data obat yang telah diperbarui atau
ditambahkan. Proses berakhir setelah data dikelola sesuai kebutuhan.
41
```
e) Transaksi Obat Masuk
```
Gambar 3. 8. Activity Diagram Transaksi Obat Masuk
Gambar 3.8. menjelaskan proses admin dalam mengelola
transaksi obat masuk. Admin membuka halaman transaksi obat
masuk, lalu sistem menampilkan data yang tersedia. Admin dapat
mengedit data transaksi, dan sistem akan menyimpannya. Selain itu,
admin juga bisa menambahkan data transaksi baru yang kemudian
disimpan oleh sistem. Setelah itu, admin dapat melihat data transaksi
obat masuk yang sudah diperbarui hingga proses selesai.
42
```
f) Transaksi Obat Keluar
```
Gambar 3. 9. Activity Diargam Transaksi Obat Keluar
Gambar 3.9. menggambarkan proses admin dalam mengelola transaksi
obat keluar. Admin membuka halaman transaksi obat keluar, sistem
menampilkan data yang ada, lalu admin dapat mengubah atau
menambahkan data. Setiap perubahan atau penambahan akan disimpan
oleh sistem, dan admin dapat melihat kembali data transaksi obat keluar
yang sudah diperbarui hingga proses selesai.
43
```
g) Laporan Stok Obat
```
Gambar 3. 10. Activity Diagram Laporan Stok Obat
Gambar 3.10. menggambarkan proses admin dalam mengakses
laporan stok obat. Admin membuka halaman laporan stok obat,
sistem menampilkan data stok, lalu admin bisa mencari data
dengan mengetik kata kunci atau langsung mencetak laporan.
Setelah itu, sistem menampilkan halaman cetak laporan stok obat
hingga proses selesai.
44
```
h) Laporan Obat Masuk
```
Gambar 3. 11. Activity Diagram Laporan Obat Masuk
Gambar 3.11. menggambarkan alur aktivitas admin pada
halaman laporan obat keluar. Proses dimulai ketika admin
membuka halaman laporan obat keluar, lalu sistem menampilkan
form laporan. Selanjutnya admin mengisi tanggal awal dan akhir,
kemudian mengklik tombol cetak. Sistem menyaring data obat
berdasarkan tanggal yang diinput dan menampilkan halaman
cetak laporan obat keluar. Setelah itu admin dapat mencetak
laporan obat keluar. Proses berakhir setelah laporan berhasil
dicetak.
45
```
i) Laporan Obat Keluar
```
Gambar 3. 12. Activity Diagram Laporan Obat Keluar
Gambar 3.12. menggambarkan alur aktivitas admin pada
halaman laporan obat keluar. Proses dimulai ketika admin
membuka halaman laporan obat keluar, lalu sistem menampilkan
form laporan. Selanjutnya admin mengisi tanggal awal dan akhir,
kemudian mengklik tombol cetak. Sistem menyaring data obat
berdasarkan tanggal yang diinput dan menampilkan halaman
cetak laporan obat keluar. Setelah itu admin dapat mencetak
laporan obat keluar. Proses berakhir setelah laporan berhasil
dicetak.
46
```
j) Manajemen User
```
Gambar 3. 13. Activity Diagram Manajemen User
Gambar 3.13. menggambarkan alur aktivitas admin pada halaman
manajemen user. Proses dimulai ketika admin membuka halaman
manajemen user, kemudian sistem menampilkan data user. Admin
dapat melihat data user dan mengklik tombol “tambah” untuk
menambahkan user baru. Selanjutnya sistem menampilkan form
input user. Admin mengisi data berupa username, password, nama
user, dan hak akses, lalu mengklik tombol “simpan”. Sistem
kemudian menyimpan data yang diinput dan menampilkan
notifikasi sukses. Proses berakhir setelah data user berhasil
disimpan.
47
```
k) Profil
```
Gambar 3. 14. Activity Diagram Profil
Gambar 3.14. menggambarkan alur aktivitas admin dalam proses
ubah password pada halaman profil. Proses dimulai ketika admin
membuka halaman profil, lalu sistem menampilkan data profil. Admin
dapat memilih apakah ingin mengubah profil atau tidak. Jika tidak, admin
hanya melihat profil dan proses selesai. Jika ya, admin menekan tombol
“ubah”, kemudian sistem menampilkan form ubah profil. Admin mengisi
form ubah profil dan mengklik tombol “simpan”. Setelah itu, sistem
memperbarui data dan menampilkan profil yang sudah diperbarui. Proses
berakhir setelah profil berhasil diubah atau ditampilkan kembali.
48
```
5) Sequence Diagram
```
Sequence Diagram adalah jenis diagram interaksi dalam Unified Modeling
```
Language (UML) yang menunjukkan bagaimana objek berinteraksi dalam
```
urutan waktu tertentu. Diagram ini menggambarkan urutan pesan yang
dikirim antara objek dalam sistem untuk melakukan fungsi tertentu atau
menyelesaikan suatu proses. Berikut adalah use case diagram dari Apotek
```
Segar:
```
```
a) Login Admin
```
Gambar 3. 15. Sequence Diagram Login Admin
Gambar 3.15. menggambarkan alur proses login admin pada
sistem. Proses dimulai ketika admin mengakses website, kemudian
sistem menampilkan dashboard dan halaman login. Admin
memasukkan username serta password, lalu sistem mengirimkan
data ke proses validasi. Jika data valid, sistem memberikan akses ke
website dan menampilkan dashboard. Namun jika data tidak valid,
sistem menampilkan pesan error. Proses selesai setelah admin
berhasil login atau menerima notifikasi error.
49
```
b) Sequence Diagram Admin
```
Gambar 3. 16. Sequence Diagram Admin
Gambar 3.16. menggambarkan alur aktivitas admin setelah
melakukan login ke sistem. Admin dapat melakukan berbagai
```
pengelolaan data, antara lain: mengelola data pelanggan (melihat,
```
```
menambah, mengedit, menghapus), mengelola data obat, mengelola
```
data pemasok, dan mengelola data transaksi. Selain itu, admin juga dapat
melakukan pencetakan laporan obat berdasarkan periode tertentu. Pada
akhir proses, admin bisa mengakses maupun keluar dari profil.
50
3. User Interface & User Experience (UI/UX Design)
```
a) Alfah – 2200018235
```
Sebagai UI/UX Designer, Bertanggung jawab merancang tampilan
antarmuka pengguna dan pengalaman pengguna pada website. Proses ini
mencakup penyusunan konsep desain sesuai kebutuhan, pembuatan
tampilan yang konsisten serta responsif di berbagai perangkat, dan
penyusunan navigasi agar mudah dipahami. Selain itu, juga bertanggung
jawab melakukan evaluasi dan revisi desain berdasarkan uji coba serta
masukan tim, sehingga menghasilkan antarmuka yang nyaman digunakan.
Dalam proses pengembangan antarmuka, dilakukan beberapa revisi
berdasarkan masukan dan kebutuhan klien. Revisi ini bertujuan untuk
menyesuaikan tampilan serta fungsi sistem agar lebih sesuai dengan
identitas brand sekaligus memberikan pengalaman pengguna yang lebih
baik. Adapun revisi yang dilakukan antara lain:
```
1) Perubahan warna tampilan utama agar lebih selaras dengan identitas
```
brand klien.
```
2) Penambahan fitur Data Pemasok untuk memudahkan pengelolaan
```
informasi pemasok obat.
```
3) Penyesuaian tata letak menu agar navigasi lebih sederhana dan mudah
```
dipahami pengguna.
```
4) Perbaikan ukuran font dan ikon agar tampilan lebih jelas serta nyaman
```
digunakan di berbagai perangkat.
Hasil akhir dari proses perancangan UI/UX menunjukkan tampilan
antarmuka yang lebih konsisten, responsif, dan mudah digunakan. Warna
serta elemen visual telah disesuaikan dengan identitas brand klien sehingga
memberikan kesan profesional. Navigasi dibuat lebih sederhana sehingga
pengguna dapat mengakses fitur dengan cepat tanpa kebingungan.. Dengan
demikian, desain yang dihasilkan tidak hanya memenuhi kebutuhan klien,
tetapi juga meningkatkan pengalaman pengguna secara keseluruhan.
51
Gambar 3. 17. UI Halaman Login
Pada gambar 3.17 menunjukan halaman login pada gambar menampilkan
antarmuka awal Sistem Informasi Manajemen Apotek. Pada tampilan ini,
pengguna diminta untuk memasukkan username dan password agar dapat
mengakses sistem. Desainnya sederhana dengan kotak login berisi dua kolom
input serta tombol Login berwarna biru. Halaman ini berfungsi sebagai pintu
masuk utama yang memastikan hanya pengguna terdaftar yang dapat mengakses
fitur-fitur sistem.
Gambar 3. 18. UI Halaman Dashboard
52
Pada gambar 3.18 menampilkan halaman Beranda pada Sistem Informasi
Manajemen Apotek. Pada tampilan ini, pengguna dapat langsung mengakses
beberapa menu utama melalui kotak navigasi cepat seperti Data Obat, Data Obat
Masuk, Laporan Stok Obat, Laporan Obat Masuk, dan Laporan Obat Terjual. Di sisi
kiri terdapat menu navigasi umum yang terdiri dari Beranda, Data Obat, Pemasok,
Transaksi, Laporan, serta Manajemen User. Desain ini dibuat sederhana dengan
tata letak yang teratur agar memudahkan pengguna dalam mengakses fitur
penting secara lebih cepat dan efisien.
Gambar 3. 19. UI Halaman Data Obat
Pada gambar 3.19 menampilkan halaman Laporan Stok Obat pada Sistem
Informasi Manajemen Apotek. Pada tampilan ini, pengguna dapat melihat data
obat secara rinci yang terdiri dari nomor urut, kode obat, nama obat, harga beli,
harga jual, jumlah stok, serta satuan obat. Informasi ini memudahkan admin atau
petugas apotek dalam memantau ketersediaan obat, membandingkan harga beli
dan harga jual, serta memastikan jumlah stok selalu terkontrol. Selain itu, terdapat
juga fitur cetak laporan yang memudahkan penyimpanan maupun pencetakan
data sebagai arsip. Desain tabel dibuat sederhana, terstruktur, dan mudah dibaca
agar informasi dapat diakses dengan cepat oleh pengguna.
53
Gambar 3. 20. UI Halaman Input Obat
Pada gambar 3.20 menunjukan halaman input data obat dirancang dengan
fokus pada kemudahan dan kejelasan dalam pengisian informasi. Pada halaman
ini, tersedia formulir yang berisi kolom-kolom penting seperti kode obat, nama
obat, jenis obat, kategori, harga, jumlah stok, serta pemasok. Setiap kolom disusun
secara rapi dan berurutan, sehingga meminimalisir kebingungan pengguna saat
melakukan input.
Gambar 3. 21. UI Halaman Pemasok
54
Halaman Pemasok berfungsi untuk menampilkan daftar pemasok obat yang
bekerja sama dengan apotek. Informasi yang ditampilkan meliputi kode pemasok,
nama pemasok, dan nomor HP. Admin dapat menambahkan pemasok baru
dengan tombol Tambah, serta melakukan edit atau hapus data pemasok melalui
tombol aksi yang tersedia.
Gambar 3. 22. UI Halaman Transaksi Obat Masuk
Halaman transaksi obat masuk pada Sistem Informasi Manajemen Apotek
menampilkan data obat yang baru diterima dari pemasok. Informasi yang
ditampilkan meliputi nomor, kode transaksi, tanggal, kode obat, nama obat,
jumlah masuk, satuan, serta pemasok. Pada halaman ini admin dapat menambah
data baru melalui tombol “Tambah” serta mengelola data dengan fitur edit dan
hapus. Navigasi menu di sisi kiri juga memudahkan akses ke halaman lain seperti
beranda, data obat, pemasok, transaksi, laporan, dan manajemen user.
55
Gambar 3. 23. UI Halaman Transaksi Obat Keluar
Halaman Transaksi Obat Keluar pada Sistem Informasi Manajemen Apotek
digunakan untuk mencatat obat yang keluar. Data yang ditampilkan meliputi:
nomor, kode transaksi, tanggal, kode & nama obat, jumlah keluar, serta satuan.
Admin dapat menambah, mengedit, dan menghapus data. Navigasi di sisi kiri
memudahkan akses ke beranda, data obat, pemasok, transaksi, laporan, dan
manajemen user.
Gambar 3. 24. UI Halaman Laporan Stok Obat
56
Halaman laporan stok obat pada Sistem Informasi Manajemen Apotek
menampilkan daftar ketersediaan obat yang ada di apotek. Informasi yang
disajikan mencakup nomor, kode obat, nama obat, harga beli, harga jual,
jumlah stok, serta satuan. Halaman ini memudahkan admin untuk memantau
jumlah persediaan obat secara detail, sehingga dapat dilakukan pengendalian
stok dengan lebih efektif. Selain itu, terdapat tombol “Cetak” yang berfungsi
untuk mencetak laporan stok obat dalam bentuk dokumen. Navigasi di sisi kiri
juga menyediakan akses cepat ke menu lain seperti data obat, pemasok,
transaksi, laporan, dan manajemen user.
Gambar 3. 25. UI Halaman Laporan Obat Masuk
Pada gambar 3.26 menunjukan halaman Laporan Obat Masuk digunakan
untuk menampilkan data obat yang masuk berdasarkan rentang tanggal yang
dipilih. Admin cukup mengisi periode tanggal awal dan akhir, kemudian
menekan tombol Cetak untuk menghasilkan laporan. Fitur ini memudahkan
pemantauan stok masuk secara lebih terstruktur.
57
Gambar 3. 26. UI Halaman Manajemen User
Pada gambar 3.27 menunjukan halaman Manajemen User digunakan untuk
mengelola akun pengguna sistem. Data yang ditampilkan meliputi nomor,
username, nama user, dan hak akses. Tersedia tombol edit untuk memperbarui
data dan hapus untuk menghapus akun, sehingga pengelolaan akses lebih mudah
dan aman.
Gambar 3. 27. UI Halaman Profil User
58
Pada gambar 3.28 menunjukn halaman profil user pada Sistem Informasi
Manajemen Apotek berfungsi untuk menampilkan informasi pribadi
pengguna yang telah terdaftar dalam sistem. Pada halaman ini ditampilkan
data penting seperti nama lengkap, alamat email, nomor telepon, serta peran
```
atau hak akses pengguna (misalnya admin, kasir, atau pemilik). Selain itu,
```
halaman profil juga dilengkapi dengan fitur untuk melakukan pembaruan
data, seperti mengubah kata sandi, memperbarui foto profil, maupun
mengedit informasi kontak jika terjadi perubahan. Desain halaman dibuat
sederhana namun informatif, dengan penempatan elemen yang rapi agar
mudah dipahami pengguna.
Gambar 3. 28 Prototype pada Figma
Pada gambar 3.28 menunjukkan prototype navigasi sistem informasi
apotek yang dirancang menggunakan Figma. Alur dimulai dari halaman login,
kemudian pengguna diarahkan ke dashboard sebagai pusat navigasi utama.
Dari dashboard, pengguna dapat mengakses berbagai menu seperti data obat
untuk mengelola informasi obat, pemasok untuk mencatat data pemasok,
serta fitur obat masuk dan obat keluar untuk mencatat distribusi obat. Selain
itu, terdapat menu laporan yang mencakup laporan stok obat, laporan obat
masuk, laporan obat keluar, hingga laporan penjualan yang dapat dicetak.
Sistem ini juga dilengkapi dengan manajemen user dan pengaturan profil
pengguna. Garis penghubung pada prototype menggambarkan alur interaksi
dan perpindahan antarhalaman sesuai fungsi yang tersedia dalam sistem.
59
4. Frontend
```
a) Alfah - 2200018235 & Lisya Kartika M - 2200018209
```
Frontend Developer bertanggung jawab mengembangkan tampilan
antarmuka website dengan menggunakan HTML dan CSS untuk menyusun
struktur serta gaya halaman. Untuk mempercepat dan mempermudah proses
desain, digunakan library Bootstrap sehingga tampilan lebih responsif dan
konsisten di berbagai perangkat. Interaktivitas pada website diimplementasikan
melalui JavaScript dengan dukungan library jQuery serta plugin tambahan
seperti Chosen untuk pemilihan data, Datepicker untuk input tanggal, dan
MaskMoney untuk format angka. Selain itu, Frontend Developer juga
memastikan navigasi mudah dipahami serta tampilan antarmuka nyaman
digunakan oleh pengguna.
<link rel="shortcut icon" href="assets/img/logo.png" />
<link href="assets/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
Source Code 3. 1 Library Bootsrap
Library Bootstrap yang dipanggil melalui file bootstrap.min.css berfungsi sebagai
framework CSS untuk memudahkan pengembang dalam membuat tampilan web. Di
dalamnya sudah tersedia berbagai class siap pakai untuk komponen seperti tombol,
form, tabel, navigasi, dan layout grid sehingga tampilan web menjadi rapi, konsisten,
serta responsif di berbagai perangkat. Kegunaan library Bootstrap adalah untuk
mempercepat dan mempermudah proses pembuatan tampilan web. Dengan Bootstrap,
developer tidak perlu menulis kode CSS dari awal karena sudah tersedia class bawaan
yang bisa langsung digunakan, misalnya untuk mengatur form, tombol, tabel, atau
layout.
<link href="assets/plugins/font-awesome-4.6.3/css/font-
awesome.min.css" rel="stylesheet" type="text/css" />
<link href="assets/plugins/datatables/dataTables.bootstrap.css"
```
rel="stylesheet" type="text/css" />
```
<link href="assets/plugins/datepicker/datepicker.min.css" rel="stylesheet"
```
type="text/css" />
```
<link rel="stylesheet" type="text/css"
```
href="assets/plugins/chosen/css/chosen.min.css" />
```
60
<link href="assets/css/AdminLTE.min.css" rel="stylesheet" type="text/css"
/>
<link href="assets/css/skins/skin-blue.min.css" rel="stylesheet"
```
type="text/css" />
```
<link href="assets/plugins/datepicker/datepicker3.css" rel="stylesheet"
```
type="text/css" />
```
<link href="assets/css/style.css" rel="stylesheet" type="text/css" />
Source Code 3. 2 library CSS
Kumpulan library CSS dan style pendukung tersebut digunakan untuk
mempercantik tampilan serta menambahkan fungsi pada sistem. Font Awesome
dipakai untuk menyediakan berbagai ikon siap pakai, sedangkan DataTables
digunakan agar tabel lebih interaktif dengan fitur pencarian, pengurutan, dan
pagination. Library Datepicker memudahkan pengguna dalam memilih tanggal
melalui tampilan kalender, sementara Chosen berfungsi untuk memperindah
dropdown agar lebih mudah digunakan. Template AdminLTE beserta skin
bawaannya digunakan untuk memberikan tampilan admin yang modern dan
responsif. Selain itu, terdapat file style.css yang berisi pengaturan tambahan
khusus sesuai kebutuhan sistem sehingga tampilan menjadi lebih konsisten dan
sesuai keinginan pengembang.
<script src="assets/plugins/slimScroll/jquery.slimscroll.min.js"
```
type="text/javascript"></script> <script
```
```
src="assets/js/jquery.maskMoney.min.js"></script>
```
Source Code 3. 3 Library Jquery
jQuery adalah library JavaScript yang sangat populer, berfungsi untuk
mempermudah manipulasi DOM, penanganan event, animasi, dan komunikasi
AJAX. Dengan jQuery, penulisan kode JavaScript jadi lebih singkat dan efisien.
<script src="assets/js/jquery.maskMoney.min.js"></script>
Source Code 3. 4 Plugin jQuery maskMoney
Plugin jQuery maskMoney merupakan library tambahan yang berfungsi untuk
memformat input angka menjadi format mata uang secara otomatis. Dengan
plugin ini, pengguna tidak perlu mengetik tanda pemisah ribuan atau simbol mata
61
uang secara manual, karena sistem akan langsung menyesuaikan format penulisan
sesuai kebutuhan.
<script src="assets/plugins/datatables/jquery.dataTables.js"
```
type="text/javascript"></script>
```
<script src="assets/plugins/datatables/dataTables.bootstrap.js"
```
type="text/javascript"></script>
```
Source Code 3. 5 Plugin Data Tables
Plugin DataTables adalah library jQuery yang digunakan untuk meningkatkan
fungsi tabel HTML menjadi lebih interaktif dan dinamis. Dengan menggunakan
plugin ini, tabel dapat dilengkapi berbagai fitur seperti pencarian data secara
```
langsung (searching), pengurutan kolom (sorting), serta pembagian halaman
```
```
otomatis (pagination). Selain itu, DataTables juga mendukung integrasi dengan
```
Bootstrap sehingga tampilan tabel menjadi lebih rapi, responsif, dan mudah
digunakan.
<script src="assets/plugins/chosen/js/chosen.jquery.min.js"></script>
Source Code 3. 6 Plugin Chosen
Plugin Chosen adalah library jQuery yang berfungsi untuk mempercantik dan
mempermudah penggunaan elemen select pada form. Dengan plugin ini, daftar
pilihan yang panjang dapat ditampilkan secara lebih rapi dan dilengkapi fitur
pencarian sehingga pengguna bisa menemukan opsi dengan cepat. Selain itu,
Chosen juga mendukung tampilan yang responsif serta lebih ramah pengguna
dibandingkan dropdown standar bawaan HTML.
<script src="assets/plugins/datepicker/bootstrap-datepicker.min.js"
```
type="text/javascript"></script>
```
Source Code 3. 7 Plugin Datepicker
Plugin Bootstrap Datepicker adalah library JavaScript yang digunakan untuk
```
menambahkan fitur pemilihan tanggal (date picker) pada form input. Dengan
```
plugin ini, pengguna dapat memilih tanggal melalui tampilan kalender interaktif,
sehingga lebih praktis dan mengurangi kesalahan input manual. Selain itu,
Datepicker juga mendukung berbagai format tanggal, penyesuaian tampilan, serta
62
integrasi yang baik dengan Bootstrap, sehingga form terlihat lebih rapi dan mudah
digunakan.
<script src="assets/plugins/slimScroll/jquery.slimscroll.min.js"
```
type="text/javascript"></script>
```
Source Code 3. 8 Plugin SlimScroll
Plugin jQuery SlimScroll adalah library JavaScript yang digunakan untuk membuat
tampilan scrollbar menjadi lebih ramping, elegan, dan dapat dikustomisasi sesuai
kebutuhan. Dengan SlimScroll, elemen yang memiliki konten panjang bisa
ditampilkan dalam area terbatas dengan scrollbar khusus tanpa mengubah tata
letak keseluruhan halaman. Plugin ini sangat bermanfaat untuk menjaga kerapian
tampilan antarmuka, terutama pada panel, sidebar, atau kontainer data yang
memiliki isi cukup banyak.
.btn-link,
.btn-link:active,
.btn-link.active,
.btn-link[disabled],
```
fieldset[disabled] .btn-link {
```
```
background-color: transparent;
```
```
-webkit-box-shadow: none;
```
```
box-shadow: none;
```
```
}
```
.btn-link,
.btn-link:hover,
.btn-link:focus,
```
.btn-link:active {
```
```
border-color: transparent;
```
```
}
```
input[type="submit"].btn-block,
input[type="reset"].btn-block,
```
input[type="button"].btn-block {
```
```
width: 100%;
```
```
}
```
Source Code 3. 9 Implementasi Boostrap Button
Pada source code 3.9 merupakan potongan kode CSS di atas merupakan
bagian dari implementasi kustomisasi Bootstrap pada elemen tombol, khususnya
class .btn-link dan .btn-block. Pada kode tersebut, Bootstrap yang awalnya sudah
menyediakan style standar untuk tombol, dikembangkan lagi dengan
63
menambahkan aturan baru seperti penghapusan background-color, box-shadow,
serta pengaturan border-color agar tampilan tombol lebih sederhana dan bersih.
Selain itu, terdapat pengaturan untuk elemen tombol dengan class .btn-block agar
```
memiliki lebar penuh (full width) sesuai ukuran kontainer. Kustomisasi ini
```
dilakukan agar tampilan tombol lebih sesuai dengan kebutuhan desain antarmuka
pada sistem yang dibangun.
```
.skin-blue .main-header .navbar {
```
```
background-color: #74c0fc;
```
/*warna topbar*/
```
}
```
```
.skin-blue .main-header .logo {
```
```
background-color: #74c0fc;
```
/*warna bg logo*/
```
color: #fff;
```
```
border-bottom: 0 solid transparent;
```
```
}
```
```
.skin-blue .sidebar-menu>li.header {
```
```
color: #00b3ff;
```
```
font-size: 20px;
```
```
font-weight: bold;
```
```
background: #ffffff;
```
/*warna teks header sidebar*/
```
}
```
```
.skin-blue .sidebar-menu>li>a {
```
```
font-size: 20px;
```
```
padding-top: 15px;
```
```
padding-bottom: 15px;
```
```
}
```
.skin-blue .sidebar-menu>li>a:hover,
```
.skin-blue .sidebar-menu>li.active>a {
```
```
color: #363636;
```
```
background: #e6e6e6;
```
```
border-left-color: #a2c4d8;
```
```
}
```
Source Code 3. 10 Implementasi CSS
Pada source code 3.10 merupakan potongan kode tersebut merupakan
implementasi CSS untuk mengatur tampilan halaman beranda, khususnya bagian
header dan sidebar. Aturan yang diterapkan mencakup pengaturan warna latar
belakang pada topbar dan logo, warna serta ukuran teks pada header sidebar,
64
hingga efek hover pada menu sidebar. Selain itu, terdapat penyesuaian ukuran
font, padding, dan warna background sidebar agar tampilan halaman lebih rapi,
konsisten, dan sesuai dengan tema aplikasi. Selain itu, implementasi CSS tersebut
juga berfungsi untuk memberikan identitas visual pada sistem dengan
penggunaan warna yang seragam sehingga antarmuka terlihat lebih profesional.
Penyesuaian pada bagian sidebar dan header membantu meningkatkan
```
pengalaman pengguna (user experience), karena menu navigasi menjadi lebih
```
jelas, mudah dibaca, dan nyaman digunakan.
<ul class="sidebar-menu">
<li class="header">MAIN MENU</li>
<li><a href="?module=beranda"><i class="fa fa-home"></i> Beranda </a></li>
<li><a href="?module=obat"><i class="fa fa-folder"></i> Data Obat </a></li>
<li><a href="?module=pemasok"><i class="fa fa-cube"></i> Pemasok
</a></li>
<li class="treeview">
<a href="#"><i class="fa fa-exchange"></i> <span>Transaksi</span></a>
<ul class="treeview-menu">
<li><a href="?module=obat_masuk">Obat Masuk</a></li>
<li><a href="?module=obat_keluar">Obat Keluar</a></li>
</ul>
</li>
<li class="treeview">
<a href="#"><i class="fa fa-file-text"></i> <span>Laporan</span></a>
<ul class="treeview-menu">
<li><a href="?module=lap_stok">Stok Obat</a></li>
<li><a href="?module=lap_obat_masuk">Obat Masuk</a></li>
<li><a href="?module=lap_obat_keluar">Obat Keluar</a></li>
</ul>
</li>
<li><a href="?module=user"><i class="fa fa-user"></i> Manajemen
User</a></li>
<li><a href="?module=password"><i class="fa fa-lock"></i> Ubah
Password</a></li>
</ul>
Source Code 3. 11 Frontend Sidebar Menu
Pada source code 3.11 merupakan potongan kode di atas merupakan bagian
penting dari sidebar menu yang digunakan untuk navigasi utama pada Sistem
Informasi Manajemen Apotek. Sidebar ini menampilkan menu utama seperti
65
Beranda, Data Obat, Pemasok, Transaksi, Laporan, Manajemen User, dan Ubah
Password. Beberapa menu juga memiliki submenu, contohnya pada menu
Transaksi yang berisi pilihan Obat Masuk dan Obat Keluar, serta menu Laporan
yang menampilkan laporan stok obat, obat masuk, dan obat keluar. Dengan
struktur ini, pengguna dapat dengan mudah mengakses halaman-halaman utama
sistem secara cepat dan terorganisir.
Source Code 3. 12 Frontend Input Data Obat
Pada source code 3.12 merupakan potongan kode form input ini digunakan
untuk mengisi data obat secara lengkap, dimulai dari kode obat yang otomatis
```
terisi dengan “OB001” dan tidak bisa diubah (readonly), nama obat dengan
```
petunjuk teks “Masukkan nama obat”, harga beli dan harga jual yang wajib diisi
```
dan dapat diakses melalui ID masing-masing (harga_beli dan harga_jual), serta
```
satuan obat yang dipilih dari dropdown dengan opsi “Botol”, “Box”, “Kotak”,
“Strip”, dan “Tube”. Semua field menggunakan atribut required agar pengguna
<!-- Input Kode Obat -->
<input type="text" name="kode_obat" value="OB001" readonly required>
<!-- Input Nama Obat -->
<input type="text" name="nama_obat" placeholder="Masukkan nama obat" required>
<!-- Input Harga Beli -->
<input type="text" id="harga_beli" name="harga_beli" placeholder="Masukkan harga
beli" required>
<!-- Input Harga Jual -->
<input type="text" id="harga_jual" name="harga_jual" placeholder="Masukkan harga
jual" required>
<!-- Pilihan Satuan -->
<select name="satuan" required>
<option value="Botol">Botol</option>
<option value="Box">Box</option>
<option value="Kotak">Kotak</option>
<option value="Strip">Strip</option>
<option value="Tube">Tube</option>
</select>
66
tidak dapat meninggalkannya kosong saat menyimpan data, sehingga memastikan
data obat yang dimasukkan lengkap dan valid.
<body>
<div id="title">
LAPORAN STOK OBAT
</div>
<tr class="tr-title">
<th height="20" align="center" valign="middle">NO.</th>
<th height="20" align="center" valign="middle">KODE OBAT</th>
<th height="20" align="center" valign="middle">NAMA OBAT</th>
<th height="20" align="center" valign="middle">HARGA BELI</th>
<th height="20" align="center" valign="middle">HARGA JUAL</th>
<th height="20" align="center" valign="middle">STOK</th>
<th height="20" align="center" valign="middle">SATUAN</th>
</tr>
<tbody>
Source Code 3. 13 Tampilan Laporan Stok Obat
Pada source code 3.13 menunjukkan kode program yang digunakan untuk
menampilkan laporan stok obat. Pada kode tersebut dibuat struktur tabel yang
memuat informasi obat seperti kode obat, nama obat, harga beli, harga jual, stok,
dan satuan. Kode ini juga terhubung dengan database sehingga data yang
tersimpan dapat ditampilkan secara otomatis ke dalam tabel laporan stok obat.
Selain itu, halaman ini menyediakan tombol cetak untuk menghasilkan laporan
dalam bentuk dokumen.
<h1>
<i class="fa fa-user icon-title"></i> Manajemen User
<a class="btn btn-primary btn-social pull-right"
```
href="?module=form_user&form=add" title="Tambah Data" data-
```
```
toggle="tooltip">
```
<i class="fa fa-plus"></i> Tambah
</a>
</h1
Source Code 3. 14 Tambah data user
Kode tersebut digunakan untuk menampilkan header halaman Manajemen User. Di
dalamnya terdapat judul dengan ikon user serta sebuah tombol Tambah yang berfungsi
mengarahkan pengguna ke form penambahan data user baru.
67
Hasil implementasi dari frontend pada sistem informasi apotek ditunjukkan
melalui tampilan antarmuka yang sederhana namun fungsional. Setiap menu yang
telah dibuat pada bagian sidebar dapat diakses dengan mudah oleh pengguna,
seperti menu Beranda, Data Obat, Pemasok, Transaksi, Laporan, hingga
Manajemen User. Desain frontend memanfaatkan kombinasi HTML, CSS, dan
template AdminLTE sehingga menghasilkan tampilan yang rapi, responsif, serta
mendukung pengalaman pengguna yang lebih baik. Dengan adanya implementasi
ini, pengguna dapat melakukan pengelolaan data dan navigasi antar halaman
secara cepat dan terstruktur sesuai dengan kebutuhan sistem.
Gambar 3. 29. Frontend Tampilan Dashboard
Pada Gambar 3.36 ditampilkan halaman Dashboard sebagai tampilan utama
setelah pengguna berhasil login. Dashboard menyajikan data berupa jumlah obat,
obat masuk, stok obat, dan laporan obat dalam bentuk kartu agar mudah
dipahami. Pada sisi kiri terdapat menu navigasi utama yang terdiri dari Beranda,
Data Obat, Pemasok, Transaksi, Laporan, dan Manajemen User untuk
memudahkan akses ke berbagai fitur sistem.
68
Gambar 3. 30. Frontend Tampilan Data Obat
Pada Gambar 3.37 ditampilkan halaman Data Obat yang digunakan
untuk mengelola informasi seluruh obat di apotek. Data yang ditampilkan
mencakup kode obat, gambar, nama obat, harga beli, harga jual, jumlah stok,
dan satuan obat sehingga memudahkan admin dalam memantau ketersediaan
serta harga obat. Setiap baris data dilengkapi tombol edit untuk memperbarui
informasi dan tombol hapus untuk menghilangkan data yang tidak diperlukan.
Di bagian kanan atas, terdapat tombol Tambah yang berfungsi menambahkan
data obat baru ke dalam sistem. Dengan adanya halaman ini, pengelolaan obat
menjadi lebih terstruktur, cepat, dan akurat karena semua informasi tersimpan
dalam satu tampilan yang terorganisir.
69
Gambar 3. 31 Frontend Tampilan Input Obat
Pada gambar 3.34 memnujukan hasil implementasi frontend pada menu
Input Obat dari Sistem Informasi Manajemen Apotek. Pada halaman ini
pengguna dapat mengisi data obat secara lengkap, meliputi kode obat,
nama obat, harga beli, harga jual, stok, satuan, serta menambahkan foto
obat. Terdapat tombol Simpan untuk menyimpan data ke dalam sistem dan
tombol Batal jika ingin membatalkan pengisian. Desain antarmuka dibuat
sederhana dengan struktur yang rapi agar mudah dipahami oleh pengguna.
```
Selain itu, navigasi menu di sisi kiri layar (sidebar) memudahkan pengguna
```
dalam berpindah ke halaman lain seperti Beranda, Pemasok, Transaksi,
Laporan, dan Manajemen User, sehingga mendukung kelancaran
operasional apotek secara keseluruhan.
70
Gambar 3. 32 Frontend Tampilan Laporan Stok Obat
Pada gambar 3.44 menunjukan hasil implementasi frontend pada sistem
informasi manajemen apotek ditunjukkan pada halaman laporan stok obat.
Tampilan ini menyajikan data obat secara terstruktur dalam bentuk tabel,
meliputi nomor, kode obat, nama obat, harga beli, harga jual, jumlah stok,
dan satuan. Desain antarmuka dibuat sederhana dan responsif dengan
sidebar menu di sisi kiri yang memudahkan pengguna untuk berpindah ke
fitur lain seperti data obat, pemasok, transaksi, laporan, dan manajemen
user. Dengan adanya tampilan ini, pengguna dapat dengan mudah
memantau ketersediaan obat secara real time, sehingga mendukung
pengelolaan stok obat yang lebih efisien dan akurat.
Gambar 3. 33. Frontend Tampilan Laporan Obat Masuk
71
Gambar 3.45 menampilkan halaman Laporan Data Obat Masuk pada
Sistem Informasi Manajemen Apotek. Pada tampilan ini, pengguna dapat
memilih rentang tanggal untuk menampilkan data obat yang masuk ke
apotek sesuai periode yang diinginkan. Setelah menentukan tanggal awal
hingga tanggal akhir, pengguna dapat menekan tombol Cetak untuk
menghasilkan laporan dalam bentuk dokumen. Menu di sisi kiri
menyediakan navigasi ke berbagai fitur sistem, seperti Beranda, Data Obat,
```
Pemasok, Transaksi, Laporan (Stok Obat, Obat Masuk, Obat Keluar), serta
```
Manajemen User. Halaman ini memudahkan pengelolaan dan pelacakan
data obat masuk secara lebih terstruktur dan akurat.
Gambar 3. 34 Frontend Tampilan Pemasok
Gambar 3.46 menampilkan halaman Data Pemasok pada Sistem
Informasi Manajemen Apotek. Pada halaman ini ditampilkan daftar
pemasok obat yang terdaftar, meliputi nomor urut, kode pemasok, nama
pemasok, dan nomor telepon. Terdapat pula tombol untuk menambah
data pemasok baru, serta fitur untuk mengubah atau menghapus data
yang sudah ada. Menu navigasi di sisi kiri tetap menyediakan akses ke
Beranda, Data Obat, Transaksi, Laporan, dan Manajemen User. Halaman
ini berfungsi untuk mengelola informasi pemasok sehingga proses
pengadaan obat menjadi lebih teratur dan mudah dilacak.
72
5. Back end
```
a) Aliya Sofura Nuzband - 2200018210
```
<?php
// Laporan Obat Keluar
```
$query = mysqli_query($mysqli, "SELECT COUNT(kode_transaksi) as jumlah
```
```
FROM is_obat_keluar")
```
```
or die('Ada kesalahan pada query tampil Data Obat Keluar: ' .
```
```
mysqli_error($mysqli));
```
```
$data = mysqli_fetch_assoc($query); ?>
```
```
<h3><?php echo $data['jumlah']; ?></h3>
```
<p>Laporan Obat Keluar</p>
Source Code 3. 15 Beranda.php
```
Penjelasan :
```
Line 1–5 → Membuka PHP, menjalankan query untuk menghitung jumlah
kode_obat di tabel is_obat, lalu menyimpan hasil ke $data.
```
Line 6–8 → Menampilkan jumlah obat ($data['jumlah']) dan label "Laporan Stok
```
Obat".
Line 10–14 → Query untuk menghitung jumlah transaksi obat masuk dari tabel
is_obat_masuk.
Line 15–17 → Menampilkan jumlah transaksi obat masuk dan labelnya.
Line 19–23 → Query untuk menghitung jumlah transaksi obat keluar dari tabel
is_obat_keluar.
Line 24–26 → Menampilkan jumlah transaksi obat keluar dan labelnya.
<?php
```
session_start();
```
```
ob_start();
```
```
require_once "../../config/database.php";
```
73
```
include "../../config/fungsi_tanggal.php";
```
```
include "../../config/fungsi_rupiah.php";
```
```
$hari_ini = date("d-m-Y");
```
```
$tgl1 = $_GET['tgl_awal'];
```
```
$explode = explode('-',$tgl1);
```
```
$tgl_awal = $explode[2]."-".$explode[1]."-".$explode[0];
```
```
$tgl2 = $_GET['tgl_akhir'];
```
```
$explode = explode('-',$tgl2);
```
```
$tgl_akhir = $explode[2]."-".$explode[1]."-".$explode[0];
```
```
if (isset($_GET['tgl_awal'])) {
```
```
$no = 1;
```
// Query data obat keluar sesuai rentang tanggal
```
$query = mysqli_query($mysqli, "SELECT
```
a.kode_transaksi,a.tanggal_keluar,a.kode_obat,a.jumlah_keluar,b.kode_obat
,b.nama_obat,b.satuan
FROM is_obat_keluar as a INNER JOIN is_obat as b ON
a.kode_obat=b.kode_obat
WHERE a.tanggal_keluar BETWEEN '$tgl_awal' AND
'$tgl_akhir'
```
ORDER BY a.kode_transaksi ASC")
```
```
or die('Ada kesalahan pada query tampil Transaksi :
```
```
'.mysqli_error($mysqli));
```
```
$count = mysqli_num_rows($query);
```
```
}?>
```
<?php
```
session_start();
```
```
ob_start();
```
```
require_once "../../config/database.php";
```
```
include "../../config/fungsi_tanggal.php";
```
```
include "../../config/fungsi_rupiah.php";
```
74
```
$hari_ini = date("d-m-Y");
```
```
$tgl1 = $_GET['tgl_awal'];
```
```
$explode = explode('-',$tgl1);
```
```
$tgl_awal = $explode[2]."-".$explode[1]."-".$explode[0];
```
```
$tgl2 = $_GET['tgl_akhir'];
```
```
$explode = explode('-',$tgl2);
```
```
$tgl_akhir = $explode[2]."-".$explode[1]."-".$explode[0];
```
```
if (isset($_GET['tgl_awal'])) {
```
```
$no = 1;
```
// Query data obat keluar sesuai rentang tanggal
```
$query = mysqli_query($mysqli, "SELECT
```
a.kode_transaksi,a.tanggal_keluar,a.kode_obat,a.jumlah_keluar,b.kode_obat
,b.nama_obat,b.satuan
FROM is_obat_keluar as a INNER JOIN is_obat as b ON
a.kode_obat=b.kode_obat
WHERE a.tanggal_keluar BETWEEN '$tgl_awal' AND
'$tgl_akhir'
```
ORDER BY a.kode_transaksi ASC")
```
```
or die('Ada kesalahan pada query tampil Transaksi :
```
```
'.mysqli_error($mysqli));
```
```
$count = mysqli_num_rows($query);}?>
```
```
Line 10–12 → Mengambil nilai tanggal akhir dari parameter URL (tgl_akhir),
```
memecahnya, lalu mengubah urutannya menjadi format YYYY-mm-dd.
Line 13–21 → Mengecek apakah parameter tgl_awal ada.
Line 22 → Menutup blok if.
Line 23 → Menutup tag PHP.
Source Code 3. 16 Lap-obat-keluar: cetak.php
```
Penjelasan :
```
```
Line 1–2 → Membuka tag PHP, memulai session (session_start()) dan output
```
75
```
buffering (ob_start()).
```
```
Line 3–5 → Memanggil file konfigurasi database (database.php) serta fungsi
```
```
tambahan untuk format tanggal (fungsi_tanggal.php) dan rupiah
```
```
(fungsi_rupiah.php).
```
Line 6 → Mendapatkan tanggal hari ini dalam format dd-mm-YYYY.
```
Line 7–9 → Mengambil nilai tanggal awal dari parameter URL (tgl_awal),
```
```
memecahnya dengan explode(), lalu mengubah urutannya menjadi format YYYY-
```
mm-dd.
<?php
```
session_start();
```
```
ob_start();
```
```
require_once "../../config/database.php";
```
```
include "../../config/fungsi_tanggal.php";
```
```
include "../../config/fungsi_rupiah.php";
```
```
$hari_ini = date("d-m-Y");
```
```
$tgl1 = $_GET['tgl_awal'];
```
```
$explode = explode('-',$tgl1);
```
```
$tgl_awal = $explode[2]."-".$explode[1]."-".$explode[0];
```
```
$tgl2 = $_GET['tgl_akhir'];
```
```
$explode = explode('-',$tgl2);
```
```
$tgl_akhir = $explode[2]."-".$explode[1]."-".$explode[0];
```
```
if (isset($_GET['tgl_awal'])) {
```
```
$no = 1;
```
// Query data obat masuk sesuai rentang tanggal
```
$query = mysqli_query($mysqli, "SELECT
```
a.kode_transaksi,a.tanggal_masuk,a.kode_obat,a.jumlah_masuk,b.kode_oba
t,b.nama_obat,b.satuan,a.pemasok
FROM is_obat_masuk as a INNER JOIN is_obat as b ON
76
a.kode_obat=b.kode_obat
WHERE a.tanggal_masuk BETWEEN '$tgl_awal' AND
'$tgl_akhir'
```
ORDER BY a.kode_transaksi ASC")
```
```
or die('Ada kesalahan pada query tampil Transaksi :
```
```
'.mysqli_error($mysqli));
```
```
$count = mysqli_num_rows($query);
```
```
}?>
```
Source Code 3. 17 Lap-obat-masuk : cetak.php
```
Penjelasan :
```
```
Line 1–2 → Membuka PHP, memulai session (session_start()) dan output
```
```
buffering (ob_start()).
```
Line 3–5 → Memanggil file konfigurasi database dan fungsi tambahan
```
(fungsi_tanggal.php, fungsi_rupiah.php).
```
Line 6 → Mendapatkan tanggal hari ini dalam format dd-mm-YYYY.
```
Line 7–9 → Mengambil parameter tgl_awal dari URL ($_GET), memecah format
```
dd-mm-yyyy menjadi array, lalu mengubahnya ke format yyyy-mm-dd.
Line 10–12 → Mengambil parameter tgl_akhir dari URL, memecah formatnya,
lalu mengubah ke yyyy-mm-dd.
Line 13–21 → Mengecek apakah tgl_awal tersedia.
Line 22 → Menutup blok if.
Line 23 → Menutup tag PHP.
<?php
// Form tambah data obat
```
if ($_GET['form'] == 'add') {
```
// Membuat kode obat otomatis
```
$query_id = mysqli_query($mysqli, "SELECT RIGHT(kode_obat,6) as kode
```
77
```
FROM is_obat ORDER BY kode_obat DESC LIMIT 1")
```
```
or die('Ada kesalahan pada query tampil kode_obat : ' .
```
```
mysqli_error($mysqli));
```
```
$count = mysqli_num_rows($query_id);
```
```
if ($count <> 0) {
```
```
$data_id = mysqli_fetch_assoc($query_id);
```
```
$kode = $data_id['kode'] + 1;
```
```
} else {
```
```
$kode = 1;}
```
```
$buat_id = str_pad($kode, 6, "0", STR_PAD_LEFT);
```
```
$kode_obat = "B$buat_id";
```
```
// ...form input data obat...}
```
// Form edit data obat
```
elseif ($_GET['form'] == 'edit') {
```
```
if (isset($_GET['id'])) {
```
```
$query = mysqli_query($mysqli, "SELECT
```
kode_obat,nama_obat,harga_beli,harga_jual,satuan FROM is_obat WHERE
```
kode_obat='$_GET[id]'")
```
```
or die('Ada kesalahan pada query tampil Data obat : ' .
```
```
mysqli_error($mysqli));
```
```
$data = mysqli_fetch_assoc($query);
```
```
}}?>
```
Source Code 3. 18 Obat : Form.php
```
Penjelasan :
```
Line 1–2 → Membuka PHP dan mengecek apakah form yang dipanggil adalah
```
add (tambah data).
```
Line 3–5 → Menjalankan query untuk mengambil 6 digit terakhir dari kode_obat
78
dengan urutan kode terbaru. Jika gagal, tampilkan pesan error.
Line 6 → Menghitung jumlah baris hasil query.
```
Line 7–9 → Jika data ada ($count <> 0), ambil kode terakhir lalu tambahkan +1
```
untuk membuat kode baru.
Line 10–11 → Jika tidak ada data sama sekali, set kode awal = 1.
Line 12–13 → Membuat kode obat baru dengan str_pad agar tetap 6 digit
```
(misalnya 000001), lalu ditambahkan prefix B (contoh hasil: B000001).
```
Line 14 → Disiapkan untuk form input data obat baru.
Line 16–18 → Jika form yang dipanggil adalah edit dan parameter id ada di URL,
jalankan query untuk mengambil data obat berdasarkan kode_obat yang dipilih.
Line 19 → Jika query gagal, tampilkan pesan error.
Line 20 → Ambil hasil query sebagai array asosiatif untuk mengisi data di form
edit.
Line 22 → Menutup blok PHP.
<?php
```
session_start();
```
```
require_once "../../config/database.php";
```
// Cek login
```
if (empty($_SESSION['username']) && empty($_SESSION['password'])) {
```
```
echo "<meta http-equiv='refresh' content='0; url=index.php?alert=1'>";
```
```
} else {
```
// INSERT
```
if ($_GET['act'] == 'insert') {
```
```
if (isset($_POST['simpan'])) {
```
```
$kode_obat = mysqli_real_escape_string($mysqli,
```
```
trim($_POST['kode_obat']));
```
```
$obat = mysqli_real_escape_string($mysqli, trim($_POST['obat']));
```
```
$nama_obat = mysqli_real_escape_string($mysqli,
```
79
```
trim($_POST['nama_obat']));
```
```
$harga_beli = str_replace('.', '', mysqli_real_escape_string($mysqli,
```
```
trim($_POST['harga_beli'])));
```
```
$harga_jual = str_replace('.', '', mysqli_real_escape_string($mysqli,
```
```
trim($_POST['harga_jual'])));
```
```
$satuan = mysqli_real_escape_string($mysqli, trim($_POST['satuan']));
```
```
$created_user = $_SESSION['id_user'];
```
```
$query = mysqli_query($mysqli, "INSERT INTO
```
```
is_obat(kode_obat,obat,nama_obat,harga_beli,harga_jual,satuan,created_us
```
```
er,updated_user)
```
```
VALUES('$kode_obat','$nama_obat','$harga_beli','$harga_jual','$satuan','$cr
```
```
eated_user','$created_user')")
```
```
or die('Ada kesalahan pada query insert : ' . mysqli_error($mysqli));
```
```
if ($query) {
```
```
header("location: ../../main.php?module=obat&alert=1");
```
```
}}}
```
// UPDATE
```
elseif ($_GET['act'] == 'update') {
```
```
if (isset($_POST['simpan'])) {
```
```
if (isset($_POST['kode_obat'])) {
```
```
$kode_obat = mysqli_real_escape_string($mysqli,
```
```
trim($_POST['kode_obat']));
```
```
$obat = mysqli_real_escape_string($mysqli, trim($_POST['obat']));
```
```
$nama_obat = mysqli_real_escape_string($mysqli,
```
```
trim($_POST['nama_obat']));
```
```
$harga_beli = str_replace('.', '', mysqli_real_escape_string($mysqli,
```
```
trim($_POST['harga_beli'])));
```
```
$harga_jual = str_replace('.', '', mysqli_real_escape_string($mysqli,
```
```
trim($_POST['harga_jual'])));
```
```
$satuan = mysqli_real_escape_string($mysqli,
```
80
```
trim($_POST['satuan']));
```
```
$updated_user = $_SESSION['id_user'];
```
```
$query = mysqli_query($mysqli, "UPDATE is_obat SET obat =
```
'$obat',
```
nama_obat = '$nama_obat',
```
```
harga_beli = '$harga_beli',
```
```
harga_jual = '$harga_jual',
```
```
satuan = '$satuan',
```
```
updated_user= '$updated_user'
```
```
WHERE kode_obat = '$kode_obat'")
```
```
or die('Ada kesalahan pada query update : ' .
```
```
mysqli_error($mysqli));
```
```
if ($query) {
```
```
header("location: ../../main.php?module=obat&alert=2");
```
```
}}}}
```
// DELETE
```
elseif ($_GET['act'] == 'delete') {
```
```
if (isset($_GET['id'])) {
```
```
$kode_obat = $_GET['id'];
```
```
$query = mysqli_query($mysqli, "DELETE FROM is_obat WHERE
```
```
kode_obat='$kode_obat'")
```
```
or die('Ada kesalahan pada query delete : ' . mysqli_error($mysqli));
```
```
if ($query) {
```
```
header("location: ../../main.php?module=obat&alert=3");
```
```
}}}}?>
```
Source Code 3. 19 Obat : proses.php
```
Penjelasan :
```
Line 1–2 → Mulai session dan hubungkan ke database.
```
Line 4–6 → Cek apakah user sudah login (cek $_SESSION['username'] &
```
81
```
$_SESSION['password']). Jika belum, redirect ke halaman login dengan alert=1.
```
```
Line 7–24 (INSERT)
```
```
Jika act=insert dan tombol simpan ditekan → ambil data dari form (kode_obat,
```
```
obat, nama_obat, harga_beli, harga_jual, satuan).
```
Data difilter dengan mysqli_real_escape_string agar aman dari SQL injection.
harga_beli dan harga_jual dibersihkan dari tanda titik.
Data dimasukkan ke tabel is_obat dengan query INSERT.
Jika berhasil, redirect ke main.php?module=obat&alert=1.
```
Line 25–49 (UPDATE)
```
Jika act=update dan tombol simpan ditekan → ambil data dari form berdasarkan
kode_obat.
Data difilter dengan cara yang sama, lalu jalankan query UPDATE untuk
mengganti data lama.
Jika berhasil, redirect ke main.php?module=obat&alert=2.
```
Line 50–59 (DELETE)
```
Jika act=delete dan parameter id ada → ambil kode_obat dari URL.
Jalankan query DELETE untuk menghapus data obat sesuai kode_obat.
Jika berhasil, redirect ke main.php?module=obat&alert=3.
Line 60 → Menutup blok if login.
Line 61 → Menutup tag PHP.
<?php
```
if ($_GET['form']=='add') {
```
// Membuat kode transaksi otomatis
```
$query_id = mysqli_query($mysqli, "SELECT RIGHT(kode_transaksi,7) as kode
```
FROM is_obat_keluar
```
ORDER BY kode_transaksi DESC LIMIT 1")
```
```
or die('Ada kesalahan pada query tampil kode_transaksi :
```
```
'.mysqli_error($mysqli));
```
```
$count = mysqli_num_rows($query_id);
```
82
```
if ($count <> 0) {
```
```
$data_id = mysqli_fetch_assoc($query_id);
```
```
$kode = $data_id['kode']+1;
```
```
} else {
```
```
$kode = 1;
```
```
}
```
```
$tahun = date("Y");
```
```
$buat_id = str_pad($kode, 7, "0", STR_PAD_LEFT);
```
```
$kode_transaksi = "TK-$tahun-$buat_id";
```
// ...form input data obat keluar...
// Dropdown obat diambil dari tabel is_obat
```
$query_obat = mysqli_query($mysqli, "SELECT kode_obat, nama_obat FROM
```
```
is_obat ORDER BY nama_obat ASC")
```
```
or die('Ada kesalahan pada query tampil obat: '.mysqli_error($mysqli));
```
// ...form input stok, jumlah keluar, total stok...
```
}
```
?>
```
Penjelasan:
```
Source Code 3. 20 Obat-keluar : form.php
```
Penjelasan :
```
Line 1–2 → Membuka tag PHP dan mengecek apakah $_GET['form'] bernilai
'add'. Jika iya, maka jalankan proses untuk tambah data obat keluar.
Line 3–6 → Membuat query untuk mengambil 7 digit terakhir dari
kode_transaksi pada tabel is_obat_keluar, diurutkan berdasarkan transaksi
terakhir. Jika query error, tampilkan pesan.
```
Line 7 → Hitung jumlah baris hasil query ($count).
```
Line 8–10 → Jika data transaksi sudah ada, ambil nilai kode terakhir lalu
83
tambahkan +1.
Line 11–12 → Jika tidak ada data transaksi, set kode awal = 1.
Line 14–16 → Membuat format kode transaksi baru dengan menambahkan
```
tahun sekarang (date("Y")) dan merapikan jadi 7 digit menggunakan str_pad.
```
Hasil akhir format: TK-[tahun]-[0000001].
Line 17 → Komentar, tempat untuk menambahkan form input data obat keluar.
```
Line 18–20 → Query untuk mengambil daftar obat (kode_obat dan nama_obat)
```
dari tabel is_obat untuk ditampilkan di dropdown. Jika query gagal, tampilkan
pesan error.
Line 21 → Komentar, tempat untuk menambahkan input stok, jumlah keluar,
dan total stok.
Line 22 → Penutup blok if.
Line 23 → Menutup tag PHP.
<?php
```
session_start();
```
```
require_once "../../config/database.php";
```
// Cek login
```
if (empty($_SESSION['username']) && empty($_SESSION['password'])) {
```
```
echo "<meta http-equiv='refresh' content='0; url=index.php?alert=1'>";
```
```
} else {
```
```
if (isset($_POST['simpan'])) {
```
```
if (isset($_SESSION['id_user'])) {
```
```
$old_pass = md5(mysqli_real_escape_string($mysqli,
```
```
trim($_POST['old_pass'])));
```
```
$new_pass = md5(mysqli_real_escape_string($mysqli,
```
```
trim($_POST['new_pass'])));
```
```
$retype_pass = md5(mysqli_real_escape_string($mysqli,
```
```
trim($_POST['retype_pass'])));
```
84
```
$id_user = $_SESSION['id_user'];
```
// Cek password lama
```
$sql = mysqli_query($mysqli, "SELECT password FROM is_users WHERE
```
```
id_user=$id_user")
```
```
or die('Ada kesalahan pada query seleksi password : ' .
```
```
mysqli_error($mysqli));
```
```
$data = mysqli_fetch_assoc($sql);
```
```
if ($old_pass != $data['password']) {
```
```
header("Location: ../../main.php?module=password&alert=1");
```
```
} else {
```
// Cek password baru dan konfirmasi
```
if ($new_pass != $retype_pass) {
```
```
header("Location: ../../main.php?module=password&alert=2");
```
```
} else {
```
// Update password
```
$query = mysqli_query($mysqli, "UPDATE is_users SET password =
```
```
'$new_pass' WHERE id_user = '$id_user'")
```
```
or die('Ada kesalahan pada query update password : ' .
```
```
mysqli_error($mysqli));
```
```
if ($query) {
```
```
header("location: ../../main.php?module=password&alert=3");
```
```
}}}}}}?>
```
Source Code 3. 21 Password : proses.php
```
Penjelasan:
```
```
Line 1–2 → Membuka PHP, memulai session (session_start()), dan
```
menghubungkan ke database dengan require_once.
Line 4–6 → Mengecek apakah session username dan password kosong. Jika iya,
85
```
redirect ke index.php?alert=1 (belum login).
```
Line 7–9 → Jika user sudah login, cek apakah tombol simpan ditekan
```
(isset($_POST['simpan'])) dan id_user tersedia di session.
```
Line 10–13 → Mengambil input password lama, password baru, dan retype
password dari form, lalu diamankan dengan mysqli_real_escape_string, trim, dan
```
dienkripsi md5(). Menyimpan juga id_user dari session.
```
Line 15–17 → Menjalankan query untuk mengambil password lama dari
database berdasarkan id_user.
Line 18 → Ambil hasil query dalam bentuk array asosiatif.
Line 20–21 → Jika password lama yang diinput tidak sama dengan password di
```
database, redirect ke halaman password dengan alert=1 (password lama salah).
```
Line 23–25 → Jika password baru tidak sama dengan retype password, redirect
```
ke halaman password dengan alert=2 (konfirmasi password salah).
```
Line 27–30 → Jika semua valid, update password di tabel is_users dengan
```
password baru ($new_pass). Jika berhasil, redirect ke halaman password dengan
```
```
alert=3 (berhasil update).
```
Line 33–34 → Tutup blok if dan else.
Line 35 → Menutup tag PHP.
<?php
```
if (isset($_POST['id_user'])) {
```
// Query untuk mengambil data user berdasarkan id_user
```
$query = mysqli_query($mysqli, "SELECT * FROM is_users WHERE
```
```
id_user='$_POST[id_user]'")
```
```
or die('Ada kesalahan pada query tampil data user : '.mysqli_error($mysqli));
```
```
$data = mysqli_fetch_assoc($query);
```
```
}
```
?>
<!-- Form edit profil user -->
<form role="form" class="form-horizontal" method="POST"
86
```
action="modules/profil/proses.php?act=update" enctype="multipart/form-
```
data">
<div class="box-body">
```
<input type="hidden" name="id_user" value="<?php echo $data['id_user'];
```
?>">
<div class="form-group">
<label class="col-sm-2 control-label">Username</label>
<div class="col-sm-5">
<input type="text" class="form-control" name="username"
```
autocomplete="off" value="<?php echo $data['username']; ?>" required>
```
</div>
</div>
<div class="form-group">
<label class="col-sm-2 control-label">Nama User</label>
<div class="col-sm-5">
<input type="text" class="form-control" name="nama_user"
```
autocomplete="off" value="<?php echo $data['nama_user']; ?>" required>
```
</div>
</div>
<div class="form-group">
<label class="col-sm-2 control-label">Email</label>
<div class="col-sm-5">
<input type="email" class="form-control" name="email"
```
autocomplete="off" value="<?php echo $data['email']; ?>">
```
</div>
</div>
<div class="form-group">
<label class="col-sm-2 control-label">Telepon</label>
<div class="col-sm-5">
<input type="text" class="form-control" name="telepon"
87
```
autocomplete="off" maxlength="13" onKeyPress="return
```
```
goodchars(event,'0123456789',this)" value="<?php echo $data['telepon']; ?>">
```
</div>
</div>
</div><!-- /.box body -->
<div class="box-footer">
<div class="form-group">
<div class="col-sm-offset-2 col-sm-10">
<input type="submit" class="btn btn-primary btn-submit" name="simpan"
```
value="Simpan">
```
<a href="?module=profil" class="btn btn-default btn-reset">Batal</a>
</div>
</div>
</div><!-- /.box footer -->
</form>
Source Code 3. 22 Profil : form.php
```
Penjelasan:
```
Line 1–5 → Mengecek apakah ada id_user yang dikirim lewat POST. Jika ada,
jalankan query untuk mengambil data user dari tabel is_users berdasarkan
id_user. Hasil query disimpan ke $data.
Line 7 → Komentar HTML untuk menandai form edit profil user.
Line 8–9 → Membuka form dengan method POST, action mengarah ke
modules/profil/proses.php?act=update, dan enctype="multipart/form-data"
```
(untuk mendukung upload file jika ada).
```
Line 10 → Membuka div box-body sebagai container isi form.
Line 11 → Input hidden yang menyimpan id_user, supaya tetap terbawa saat
submit.
Line 12–17 → Form group untuk Username. Label di sebelah kiri, input text di
```
kanan dengan nilai awal dari database ($data['username']).
```
Line 18–23 → Form group untuk Nama User. Input text diisi dengan
88
$data['nama_user'].
Line 24–29 → Form group untuk Email. Input type email, value diisi dengan
$data['email'].
Line 30–35 → Form group untuk Telepon. Input text dengan maksimal 13 digit,
```
hanya bisa angka (goodchars), value diisi dengan $data['telepon'].
```
Line 36 → Menutup div box-body.
```
Line 37–45 → Bagian footer form: tombol Simpan (submit) dan tombol Batal
```
```
(reset → kembali ke ?module=profil).
```
Line 46 → Menutup div box-footer.
Line 47 → Menutup tag form.
<?php
// Form tambah user
```
if ($_GET['form']=='add') {
```
// ...form input user baru...
```
}
```
// Form edit user
```
elseif ($_GET['form']=='edit') {
```
```
if (isset($_GET['id'])) {
```
// Query untuk mengambil data user berdasarkan id_user
```
$query = mysqli_query($mysqli, "SELECT * FROM is_users WHERE
```
```
id_user='$_GET[id]'")
```
```
or die('Ada kesalahan pada query tampil data user :
```
```
'.mysqli_error($mysqli));
```
```
$data = mysqli_fetch_assoc($query);
```
// ...form edit user...
```
}
```
```
}
```
?>
Source Code 3. 23 User : form.php
89
```
Penjelasan:
```
Line 1 → Membuka tag PHP.
Line 2–5 → Form Tambah User → menampilkan form input user baru.
Line 7–16 → Form Edit User → ambil data berdasarkan id_user lalu tampilkan
form edit user.
```
require_once "config/database.php";
```
```
$username = mysqli_real_escape_string($mysqli,
```
```
stripslashes(strip_tags(htmlspecialchars(trim($_POST['username'])))));
```
```
$password = md5(mysqli_real_escape_string($mysqli,
```
```
stripslashes(strip_tags(htmlspecialchars(trim($_POST['password']))))));
```
```
if (!ctype_alnum($username) OR !ctype_alnum($password)) {
```
```
header("Location: index.php?alert=1");}
```
```
$query = mysqli_query($mysqli, "SELECT * FROM is_users WHERE
```
```
username='$username' AND password='$password'") or die('Ada kesalahan
```
```
pada query user: '.mysqli_error($mysqli));
```
```
$rows = mysqli_num_rows($query);
```
```
if ($rows > 0) {
```
```
$data = mysqli_fetch_assoc($query);
```
```
session_start();
```
```
$_SESSION['id_user'] = $data['id_user'];
```
```
$_SESSION['username'] = $data['username'];
```
```
$_SESSION['password'] = $data['password'];
```
```
$_SESSION['nama_user'] = $data['nama_user'];
```
```
$_SESSION['hak_akses'] = $data['hak_akses'];
```
```
header("Location: main.php?module=beranda");}
```
```
else {
```
```
header("Location: index.php?alert=1");}
```
Source Code 3. 24 Check Login.php
90
```
Penjelasan :
```
```
Line 1 → require_once "config/database.php";
```
Mengimpor file konfigurasi database agar bisa melakukan koneksi MySQL.
Line 2 → Mengambil input username dari form POST, kemudian dibersihkan
dengan fungsi:
```
trim() → hapus spasi di awal/akhir.
```
```
htmlspecialchars() → mencegah injeksi HTML.
```
```
strip_tags() → hapus tag HTML.
```
```
stripslashes() → hapus backslashes.
```
```
mysqli_real_escape_string() → escape karakter khusus agar aman dari SQL
```
Injection.
Line 3 → Mengambil input password dengan cara yang sama seperti username,
lalu dienkripsi dengan MD5.
Line 4–6 → Mengecek apakah username dan password hanya terdiri dari
```
huruf/angka (ctype_alnum).
```
Jika ada karakter lain, redirect ke index.php?alert=1.
Line 7 → Menjalankan query untuk mencari user berdasarkan username dan
password di tabel is_users.
Jika query gagal, tampilkan pesan error.
```
Line 8 → mysqli_num_rows($query) → menghitung jumlah baris hasil query (cek
```
```
apakah user ditemukan).
```
```
Line 9–19 → Jika ada user ($rows > 0):
```
```
Line 10 → Ambil data user dengan mysqli_fetch_assoc().
```
Line 12 → Mulai session.
```
Line 13–17 → Simpan data user ke dalam variabel session (id_user, username,
```
```
password, nama_user, hak_akses).
```
Line 19 → Redirect ke main.php?module=beranda.
Line 21–23 → Jika user tidak ditemukan, redirect kembali ke index.php?alert=1.
91
6. Quality Assurance Engineer
```
a) Kurnia Meiliyani - 2200018242
```
Tabel 3. 7. Realisasi Pembagian Tugas Tester & Back end 2
NO Agenda Kerja Hari, Tanggal Waktu Hasil
1. Membuat MOU
bersama tim
pengembang
21 April 2025 120 Menit MOU telah
diselesaikan dan
ditanda
tangangani
2. Menguji setiap fitur
dan fungsi dari
website
Untuk memastikan
Semuanya bekerja
sesuai
spesifikasi.
25 Juni 2025 120 menit Hasil tester dapat
dilihat pada
gambar dibawah
ini
5. Memastikan website
berfungsi dengan baik
di berbagai browser
```
(Chrome, Firefox,
```
```
Safari, Edge, dll.)
```
dan perangkat
```
(desktop,
```
```
tablet,smartphone).
```
26 Juni 2025 120 menit Hasil tester dapat
dilihat pada
gambar dibawah
ini
6. Membantu Back end
Utama untuk
menyelesaikan
permasalahan pada
fungsi web pada
bagian index.php dan
Check Login.php
19 Juni 2025 900 menit
92
1. Pengujian sistem menggunakan Blackbox Testing
Pengujian Pertama Pada tanggal 25 juli, tabel ini menunjukkan bahwa kedua
pengujian tidak berhasil sesuai dengan harapan.
Tabel 3. 8. Pengujian Sistem Pada Blackbox Tetsting
No Nama Test
Case
Langkah Uji Data
Uji
Expected
Result
Actual
Result
Status
1
Penghapusan
data
pemasok
Mengklik
tampilan
hapus
pemasok
Kimia
farma
Tidak Berhasil
Terhapus
Data
pemasok
tidak
terhapus
Gagal
2
Mencetak
laporan Obat
Keluar
Klik tanda
print/cetak
,pilih tanggal
mulai selesai
dan cetak
-
Tidak berhasil
menampilkan
data obat
keluar
Data obat
keluar tidak
tampil Gagal
• Pengujian pertama gagal karena data pemasok tidak terhapus setelah
dilakukan langkah uji.
• Pengujian kedua gagal karena data obat keluar tidak muncul setelah
melakukan langkah uji untuk mencetak laporan.
Ini menunjukkan adanya masalah dalam implementasi atau fungsi aplikasi yang
perlu diperbaiki agar sesuai dengan hasil yang diinginkan. Dan setelah laporan
pengujian di dua bagian ini gagal saya serahkan kepada backend untuk
memperbaikinya. Hasil pengujian setelah semua kesalahan di atas di perbaiki.
Pengujian kedua Pada tanggal 27 juli:
Ini menunjukkan adanya masalah dalam implementasi atau fungsi aplikasi yang
perlu diperbaiki agar sesuai dengan hasil yang diinginkan. Dan setelah laporan
pengujian di dua bagian ini gagal saya serahkan kepada backend untuk
memperbaikinya. Hasil pengujian setelah semua kesalahan di atas di perbaiki.
Pengujian kedua Pada tanggal 27 juli:
93
Tabel 3. 9 Pengujian tahap 2 menggunakan Black-box Testing
94
2. Menguji setiap fitur dan fungsi dari website untuk memastikan semuanya
bekerja sesuai spesifikasi.
Tabel 3. 10. Hasil Pengujian Menggunakan Framework PIECES
95
Tabel 3. 11. Penjelasan Hasil Pengujian menggunakan framework PIECES
Berdasarkan hasil pengujian menggunakan framework PIECES, didapatkan hasil
sebagai berikut:
```
a) Pada aspek Performance, menunjukkan hasil “Puas”. Hal ini ditunjukkan
```
dari responden yang merasa sistem berjalan stabil, respon cepat, dan
navigasi interaktif.
```
b) Pada aspek Information and Data, memperoleh hasil “Puas”, di mana
```
informasi pada website dianggap mudah diakses, relevan, dan up to date,
meskipun terdapat sebagian kecil responden yang menilai aspek relevansi
hanya cukup.
```
c) Pada aspek Economics, menunjukkan hasil “Puas”, namun terdapat
```
catatan bahwa pada pernyataan “Website dapat dengan cepat meng-
update data stok obat”, responden memberikan penilaian yang lebih
rendah dibandingkan aspek efisiensi biaya akses yang dianggap sangat
hemat.
```
d) Pada aspek Control and Security, menunjukkan hasil “Sangat Puas”, di
```
mana pengguna merasa sistem memiliki batasan hak akses yang jelas dan
kerahasiaan data terjamin.
```
e) Pada aspek Efficiency, mendapatkan hasil “Puas” karena website dinilai
```
mudah digunakan, cepat dalam memuat halaman, dan navigasi yang
berjalan dengan baik.
```
f) Pada aspek Service, juga menunjukkan hasil “Puas”, dengan fitur filter
```
pencarian yang tepat, informasi yang akurat, serta pelayanan yang
sesuai dengan kebutuhan pengguna.
96
C. Penjaminan Kualitas Proyek
Tim Web Masters Technology telah melakukan pengujian website
bersama dengan Pihak terkait. Proses penjaminan kualitas ini bertujuan
untuk memastikan bahwa hasil pengembangan sistem absensi pegawai
berbasis web dengan menggunakan QR code memenuhi standar spesifikasi
yang telah ditetapkan. Untuk menjamin kualitas proyek ini, Tim Web
Masters Technology bersama pihak Apotek Segar menerapkan beberapa
langkah penting, yaitu perencanaan kualitas, pengendalian kualitas, dan
jaminan kualitas.
1. Perencanaan Kualitas
Tim Web Masters Technology menerapkan standar yang jelas dan
sesuai dengan standar pemrograman website yang berlaku.
2. Pengendalian Kualitas
Tim Web Masters Technology melakukan pengujian berkala selama
proses pengembangan, memantau dan mengukur hasil kerja sesuai
dengan spesifikasi yang telah disepakati, serta mengidentifikasi dan
mengoreksi ketidaksesuaian yang ditemukan.
3. Penjaminan Kualitas
Tim Web Masters Technology melaksanakan pengujian sistem
bersama mitra untuk memastikan kesesuaian dengan prosedur
yang ditetapkan sekaligus menyediakan pelatihan dan dukungan
kepada mitra untuk meningkatkan keterampilan dan pemahaman
mereka tentang penggunaan sistem pendataan obat berbasis web.
Berdasarkan hasil pengujian, seluruh komponen sistem pendataan obat
telah memenuhi spesifikasi yang telah disepakati dalam kerjasama. Tidak
ditemukan adanya ketidaksesuaian signifikan yang dapat mempengaruhi
kualitas akhir produk. Komponen dan teknologi yang digunakan dalam
97
pengembangan sistem telah melalui uji kualitas dan terbukti memenuhi
standar yang ditetapkan.
D. Keberlanjutan Proyek
Proyek pengembangan Sistem Pendataan Obat untuk Apotek Segar
berbasis website telah dinyatakan selesai dengan seluruh fitur yang
dirancang berhasil diimplementasikan dan diuji secara menyeluruh.
Berdasarkan hasil evaluasi dan masukan dari pihak terkait, sistem ini telah
memenuhi semua kebutuhan fungsional yang telah ditetapkan sejak awal
pengembangan.
Saat ini, belum terdapat rencana untuk penambahan fitur baru
dalam waktu dekat. Fokus utama selanjutnya adalah memastikan seluruh
pengguna, khususnya staf Apotek Segar, mampu mengoperasikan sistem
dengan efektif dan efisien. Untuk itu, akan diselenggarakan sesi pelatihan
penggunaan sistem secara menyeluruh, yang mencakup penjelasan fitur
dasar hingga penggunaan fungsi-fungsi lanjutan. Pelatihan ini bertujuan
agar seluruh pengguna dapat memanfaatkan kemampuan sistem secara
optimal dalam mendukung kegiatan operasional apotek sehari-hari.
98
BAB IV Penutup
A. Kesimpulan
Proyek pengembangan sistem pendataan obat berbasis web untuk Apotek
Segar telah berhasil diselesaikan dengan baik. Sistem ini dibangun untuk
mempermudah proses pencatatan dan pengelolaan data obat, termasuk
kategori, stok, pemasok, serta riwayat pembelian dan penjualan. Dengan
adanya sistem ini, diharapkan kegiatan operasional apotek menjadi lebih
efisien, akurat, dan terorganisir, sehingga mampu mendukung peningkatan
kualitas layanan kepada pelanggan.
Selama proses pengembangan, tim menghadapi beberapa tantangan
teknis seperti perancangan alur data, integrasi fitur, serta penyesuaian
kebutuhan pengguna. Namun, berkat kerja sama tim yang solid dan bimbingan
dosen pembimbing, semua kendala tersebut dapat diatasi dengan baik. Sistem
ini dibangun menggunakan teknologi web yang responsif dan modern agar
dapat diakses dengan mudah melalui berbagai perangkat, serta mendukung
performa yang stabil dan optimal.
Keberhasilan implementasi sistem ini menjadi langkah awal dalam
transformasi digital Apotek Segar. Untuk menjaga fungsionalitas sistem dalam
jangka panjang, diperlukan pemeliharaan rutin, pembaruan fitur secara
berkala, serta pelatihan kepada staf agar dapat mengoperasikan sistem
dengan efektif. Evaluasi sistem secara berkala dan penerapan strategi
keamanan seperti pencadangan data serta pembaruan sistem juga menjadi
aspek penting dalam menjaga keberlanjutan dan keandalan layanan ini.
99
B. Saran
Terdapat beberapa saran untuk memastikan keberlanjutan dan peningkatan
sistem pendataan berbasis web “Pendataan Obat pada Apotek Segar”:
1. Melakukan pembaruan fitur secara berkala, guna memastikan sistem tetap
relevan dengan kebutuhan pengguna serta mampu menyesuaikan diri
dengan perkembangan teknologi dan operasional.
2. Melanjutkan pengembangan dan pemeliharaan sistem secara
berkelanjutan, agar sistem dapat terus ditingkatkan dari segi fungsi,
keamanan, dan performa, sekaligus mempermudah pengelolaan di masa
mendatang.
100
DAFTAR PUSTAKA
[1] A. Zainudin, A. Prakasa Hadi, A. Priyadi, U. Sains dan Teknologi Komputer Jl
Majapahit No, and J. Tengah, “Sistem Informasi Persediaan Obat Berbasis
Web Di Rumah Sakit Bina Kasih ARTICLE INFO,” JURNAL ILMIAH SISTEM
```
INFORMASI (JUISI), vol. 3, no. 3, pp. 30–34, 2024, [Online]. Available:
```
```
http://ejurnal.provisi.ac.id/index.php/JUISI
```
[2] R. Bangun et al., “Rancang Bangun Sistem Informasi Manajemen
Ketersediaan Obat Pada Apotek XYZ Berbasis Web,” 2023.
[3] A. Fatkhurochman and G. Nusa Persada, “IMPLEMENTASI SISTEM
INFORMASI INVENTORY BERBASIS WEB PADA APOTEK SEKAR MELATI
MENGGUNAKAN METODE AGILE,” 2024.
```
[4] K. Rozikin, A. Jamil, and I. S. Suasana, “024) 6723456 2 Program Studi Sistem
```
Komputer,” Universitas STEKOM Jl. Majapahit No, vol. 2, no. 2, p. 6723456,
2022, [Online]. Available: http://journal.politeknik-
pratama.ac.id/index.php/JTIMpage56
101
LAMPIRAN
A. Proposal Proyek
Dapat dilihat pada link berikut:
```
https://drive.google.com/drive/folders/1N7aKBYgdImWMcKrA65Ut5B2mwVTuai
```
AX
102
B. Surat Perintah Kerja Dengan Mitra
103104105
C. Log Book Kelompok Sudah Terisi Minimal 7x
106107
D. Log Book Individu Sudah Terisi Minimal 7x
1. Logbook Lisya Karikawarna Maharani (2200018209)
108
2. Logbook Aliya Sofura Nuzband (2200018210)
109110
3. Logbook Alfah (2200018235)
111112
4. Logbook Nabila Awalia (220001845)
113
5. Logbook Kurnia Meiliyani (2200018242)
114115
E. Foto Dokumentasi Kegiatan Proyek
116
F. Bukti Serah Terima Proyek
117118
G. Bukti Pembayaran
119
H. Tools: Source Code Dan Hosting
Link github source code:
```
https://github.com/altoaliya/WebsitePendataanObatApotek
```
```
Hosting: https://apoteksegar.wuaze.com
```
I. Link Video Profil Produk Luatan Proyek
Link Video:
```
https://drive.google.com/file/d/1nYujTQCcp8Lwn3q20AB1Bo1cfgcFAuAo/vi
```
ew?usp=sharing
120
J. Poster Produk Luaran Proyek
K. Slide Presentasi Proyek
Link presentasi proyek:
```
https://www.canva.com/design/DAGtGn1YIgs/onk2rzuljvVUCgTU8vzf2g/edit
```
?utm_content=DAGtGn1YIgs&utm_campaign=designshare&utm_medium=li
nk2&utm_source=sharebutton