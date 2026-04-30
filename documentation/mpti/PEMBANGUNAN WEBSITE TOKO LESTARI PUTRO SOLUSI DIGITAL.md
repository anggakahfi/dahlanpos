# LAPORAN PROYEK
Manajemen Proyek Teknologi Informasi
PEMBANGUNAN WEBSITE TOKO LESTARI PUTRO: SOLUSI DIGITAL
UNTUK PENGELOLAAN PENJUAL ALAT TULIS KANTOR
Disusun Oleh:
Fania Nabella 2200018017
Alya Maha Wirahma 2200018030
Daffa Khoirul Maulana 2200018038
Reynaldo Ahnaf Prasetyo N 2200018039
Ika Putri Wulandari 2200018040
PROGRAM STUDI S1 INFORMATIKA
FAKULTAS TEKNOLOGI INDUSTRI
UNIVERSITAS AHMAD DAHLAN
2025
ii
LEMBAR PENGESAHAN
LAPORAN PROYEK
PEMBANGUNAN WEBSITE TOKO LESTARI PUTRO: SOLUSI DIGITAL UNTUK
PENGELOLAAN PENJUAL ALAT TULIS KANTOR
Dipersiapkan dan disusun oleh:
Fania Nabella 2200018017
Alya Maha Wirahma 2200018030
Daffa Khoirul Maulana 2200018038
Reynaldo Ahnaf Prasetyo N 2200018039
Ika Putri Wulandari 2200018040
Susunan Dewan Penguji
```
Pembimbing : Faisal Fajri Rahani, S.Si., M.Cs …………………………………
```
```
Penguji : Fiftin Noviyanto, S.T., M.Cs …………………………………
```
Yogyakarta, .. Februari 2026
Kaprodi S1 Informatika
Universitas Ahmad Dahlan
Dr. Murinto, S.Si., M.Kom
NIPM. 19730710 200409 111 0951298
10/02/2026
iii
KATA PENGANTAR
Puji dan syukur kami panjatkan ke hadirat Allah SWT, yang telah memberikan rahmat dan
karunia-Nya sehingga kami dapat menyelesaikan dokumen proposal layanan pembuatan
website ini. Dokumen ini disusun sebagai wujud komitmen kami dalam memberikan solusi
teknologi informasi yang berkualitas bagi perusahaan, instansi, maupun individu yang
membutuhkan kehadiran platform digital profesional.
Kami berharap dokumen ini dapat menjadi panduan bagi klien untuk memahami layanan
yang kami tawarkan, mulai dari desain hingga pengembangan website yang sesuai dengan
kebutuhan dan tujuan bisnis. Dengan pengalaman kami di bidang teknologi informasi, kami
optimis dapat membantu klien mencapai transformasi digital yang signifikan.
Kami mengucapkan terima kasih kepada semua pihak yang telah memberikan dukungan dan
masukan selama proses penyusunan dokumen ini. Semoga kerja sama yang terjalin dapat
memberikan manfaat yang besar bagi semua pihak yang terlibat.
Yogyakarta, 27 Agustus 2025
Hormat kami Tim Lestari Putro
iv
DAFTAR ISI
LEMBAR PENGESAHAN...................................................................................................................ii
KATA PENGANTAR ......................................................................................................................... iii
DAFTAR ISI ..................................................................................................................................... iv
DAFTAR GAMBAR ........................................................................................................................... v
DAFTAR TABEL .............................................................................................................................. vii
DAFTAR KODE PROGRAM............................................................................................................ viii
DAFTAR LAMPIRAN ....................................................................................................................... ix
BAB I PENDAHULUAN ............................................................................................................. 1
1.1. Latar Belakang ............................................................................................................... 1
1.2. Projek Charter ............................................................................................................... 3
BAB II PERENCANAAN PROYEK ................................................................................................ 9
2.1. Model Proses Waterfall................................................................................................. 9
2.2. Analisis Kelayakan ....................................................................................................... 11
2.3. Work Breakdown Structure ........................................................................................ 14
2.4. Gant Chart ................................................................................................................... 18
2.5. Kebutuhan Sumber Daya............................................................................................. 19
2.6. Rencana Jadwal Pelaksanaan Proyek ......................................................................... 29
2.7. Rencana Nilai Proyek ................................................................................................... 33
BAB III PELAKSANAAN PROYEK ............................................................................................... 36
3.1. Realisasi Jadwal Pelaksanaan ...................................................................................... 36
3.2. Realisasi Hasil Pekerjaan ............................................................................................. 37
BAB IV PENUTUP ................................................................................................................... 114
4.1 Kesimpulan ................................................................................................................ 114
4.2.Saran................................................................................................................................ 114
DAFTAR PUSTAKA....................................................................................................................... 116
LAMPIRAN ................................................................................................................................. 117
v
DAFTAR GAMBAR
Gambar 2. 1 Tahapan Waterfall .................................................................................................. 10
Gambar 2. 2 Diagram WBS .......................................................................................................... 15
Gambar 2. 3 Gant Chart .............................................................................................................. 18
Gambar 2. 4 Network ADM ........................................................................................................ 29
Gambar 3. 1 Proses Pemilihan Dospem Via WhatsApp .............................................................. 39
Gambar 3. 2 Proses Menghubungi Dospem................................................................................ 40
Gambar 3. 3 Pembagian Jobdesk ................................................................................................ 40
Gambar 3. 4 Pembahasan Kelanjutan Proposal .......................................................................... 41
Gambar 3. 5 Bimbingan Via Google Meet 1 ................................................................................ 42
Gambar 3. 6 Bimbingan Via Google Meet 2 ................................................................................ 42
Gambar 3. 7 Rapat Internal ......................................................................................................... 43
Gambar 3. 8 Penyerahan MOU ................................................................................................... 43
Gambar 3. 9 Activity Sebelum Sistem ......................................................................................... 47
Gambar 3. 10 Activity Diagram Setelah Sistem ........................................................................... 49
Gambar 3. 11 Use Case Diagram ................................................................................................. 51
Gambar 3. 12 Use Case Diagram Sistem ..................................................................................... 52
Gambar 3. 13 Pembuatan Activity Diagram ................................................................................ 54
Gambar 3. 14 Login Admin .......................................................................................................... 55
Gambar 3. 15 Dashboard Admin ................................................................................................. 56
Gambar 3. 16 Daftar ATK Admin ................................................................................................. 56
Gambar 3. 17 Tambah Data Admin ............................................................................................. 57
Gambar 3. 18 Hapus Data Admin ................................................................................................ 58
Gambar 3. 19 Hapus Data Admin ................................................................................................ 59
Gambar 3. 20 Login Pelanggan .................................................................................................... 60
Gambar 3. 21 Beranda Pelanggan ............................................................................................... 61
Gambar 3. 22 Katalog Pelanggan ................................................................................................ 62
Gambar 3. 23 Keranjang Pelanggan ............................................................................................ 63
Gambar 3. 24 Pembayaran.......................................................................................................... 64
Gambar 3. 25 Pesanan Pelanggan ............................................................................................... 65
Gambar 3. 26 Rencana Basis Data............................................................................................... 66
Gambar 3. 27 Login Page............................................................................................................. 70
Gambar 3. 28 Pop Up Password Salah ........................................................................................ 70
Gambar 3. 29 Register ................................................................................................................. 71
Gambar 3. 30 Register Berhasil ................................................................................................... 72
Gambar 3. 31 Halaman Dashboard ............................................................................................. 73
Gambar 3. 32 Sidebar .................................................................................................................. 73
Gambar 3. 33 Halaman Katalog................................................................................................... 74
Gambar 3. 34 Halaman Keranjang .............................................................................................. 75
Gambar 3. 35 Detail Barang ........................................................................................................ 75
Gambar 3. 36 Sukses Masuk Keranjang ...................................................................................... 76
Gambar 3. 37 Keranjang Belanja ................................................................................................. 77
Gambar 3. 38 Pembayaran.......................................................................................................... 78
Gambar 3. 39 Riwayat Pesan....................................................................................................... 79
Gambar 3. 40 Tampilan Register ................................................................................................. 81
Gambar 3. 41 Tampilan Login ..................................................................................................... 82
Gambar 3. 42 Tampilan Dashboard ............................................................................................ 84
Gambar 3. 43 Tampilan Katalog .................................................................................................. 85
vi
Gambar 3. 44 Tampilan Keranjang Belanja ................................................................................. 87
Gambar 3. 45 Tampilan Detail Produk ........................................................................................ 88
Gambar 3. 46 Tampilan Check Out ............................................................................................. 89
Gambar 3. 47 Tampilan Pembayaran dan Pengiriman ............................................................... 91
Gambar 3. 48 Tampilan Riwayat Pesan ....................................................................................... 92
Gambar 3. 49 File Program Backend ........................................................................................... 95
Gambar 3. 51 File API .................................................................................................................. 98
Gambar 3. 50 Store Pesanan API Request .................................................................................. 98
Gambar 3. 52 Folder App/Http/Resources ................................................................................. 99
Gambar 3. 53 Database Sistem ................................................................................................. 101
Gambar 3. 54 Proses Deploy 1 .................................................................................................. 104
Gambar 3. 55 Proses Deploy 2 .................................................................................................. 104
Gambar 3. 57 Proses Deploy 3 .................................................................................................. 105
Gambar 3. 56 Proses Deploy 4 .................................................................................................. 105
Gambar 3. 58 Proses Deploy 6 .................................................................................................. 106
Gambar 3. 59 Hasil Tampilan Webstie ...................................................................................... 107
Gambar 3. 60 Hasil Pengujian menggunakan SUS .................................................................... 109
vii
DAFTAR TABEL
Tabel 2. 1 Sumber Daya Manusia ................................................................................................ 19
Tabel 2. 2 Sumber Daya Fisik....................................................................................................... 27
Tabel 2. 3 Cirtical Path Method ................................................................................................... 31
Tabel 2. 4 Rencana Nilai Proyek .................................................................................................. 33
Tabel 3. 1 Realisasi Jadwal Pelaksanaan .................................................................................... 36
Tabel 3. 2 Kebutuhan Fungsional ............................................................................................... 44
Tabel 3. 3 Kebutuhan Non-Fungsional ....................................................................................... 46
Tabel 3. 4 Penjelasan Isi File ....................................................................................................... 95
Tabel 3. 5 File Recourses .......................................................................................................... 100
viii
DAFTAR KODE PROGRAM
Code 3. 1 Register ....................................................................................................................... 80
Code 3. 2 Login ............................................................................................................................ 82
Code 3. 3 Dashboard ................................................................................................................... 83
Code 3. 4 Katalog......................................................................................................................... 85
Code 3. 5 Keranjang Belanja........................................................................................................ 86
Code 3. 6 Detail Produk ............................................................................................................... 88
Code 3. 7 Check Out .................................................................................................................... 89
Code 3. 8 Pembayaran ................................................................................................................ 91
Code 3. 9 Riwayat Pemesanan .................................................................................................... 92
Code 3. 10 Halaman Profil ........................................................................................................... 93
ix
DAFTAR LAMPIRAN
Lampiran 1 MOU ....................................................................................................................... 117
Lampiran 2 Tansaksi Pembayarn Mitra ..................................................................................... 118
1
BAB I
PENDAHULUAN
1.1. Latar Belakang
Transformasi digital telah menjadi kebutuhan mendesak di era modern, termasuk bagi
```
sektor Usaha Mikro, Kecil, dan Menengah (UMKM) yang menjadi tulang punggung ekonomi di
```
banyak negara berkembang seperti Indonesia. Salah satu tantangan utama yang dihadapi
UMKM, khususnya yang bergerak di bidang ritel seperti Toko Lestari Putro, adalah keterbatasan
dalam pengelolaan sistem penjualan, pencatatan stok, dan transaksi yang masih bersifat
manual. Pendekatan konvensional ini tidak hanya memperlambat operasional, tetapi juga
meningkatkan risiko kesalahan pencatatan, keterlambatan pelayanan, hingga menurunnya
kepuasan pelanggan.
Di tengah meningkatnya ekspektasi pelanggan terhadap kemudahan berbelanja, kecepatan
layanan, serta transparansi proses, UMKM dituntut untuk beradaptasi melalui pemanfaatan
teknologi digital. Pengembangan website toko menjadi salah satu solusi strategis yang mampu
menjawab kebutuhan tersebut. Website tidak hanya berfungsi sebagai media transaksi daring,
tetapi juga sebagai alat promosi, pusat manajemen produk, dan alat monitoring data penjualan
secara real-time. Dalam konteks ini, sistem informasi berbasis web yang dibangun untuk Toko
Lestari Putro diarahkan untuk menyelesaikan masalah-masalah operasional serta meningkatkan
daya saing usaha di pasar yang semakin kompetitif.
Dukungan literatur dan penelitian mutakhir semakin menegaskan urgensi digitalisasi di
sektor UMKM. Menurut Bandara dan Oruthotaarachchi, penggunaan sistem enterprise berbasis
cloud secara signifikan meningkatkan efisiensi proses bisnis dalam UMKM ritel, baik dalam aspek
inventarisasi, laporan keuangan, hingga pelayanan pelanggan[1]. Hal ini diperkuat oleh
2
```
Matekaire dan Siriram yang menyoroti peran Internet of Things (IoT) dalam
```
mengoptimalkan sistem pembayaran digital dan manajemen transaksi untuk usaha kecil[2]. Di
sisi lain, Astuty et al. mengemukakan bahwa keberlanjutan bisnis UMKM sangat dipengaruhi
oleh sejauh mana mereka mengadopsi digitalisasi secara bertahap namun konsisten[3].
Secara global, FinTech juga memainkan peran penting dalam membantu UMKM beradaptasi
secara cepat. Studi oleh Desai et al. menunjukkan bahwa adopsi layanan keuangan digital di
sektor ritel berperan dalam mempercepat siklus transaksi serta meningkatkan keamanan
pembayaran pelanggan[4]. Hal ini sejalan dengan tujuan sistem yang sedang dikembangkan
untuk Toko Lestari Putro, yaitu menyediakan fitur checkout berbasis unggah bukti pembayaran
dan validasi admin. Pendekatan ini bukan hanya mempercepat proses transaksi, tetapi juga
menciptakan sistem yang transparan dan terverifikasi secara administratif.
Lebih lanjut, strategi digitalisasi awal menjadi faktor krusial dalam membantu pelaku usaha
kecil menembus pasar yang lebih luas. Penelitian oleh Genç dan Ulaş menunjukkan bahwa
techno-enterprises yang mengadopsi teknologi transformasional sejak awal lebih mampu
menyesuaikan diri dengan tuntutan pasar, terutama dalam hal skalabilitas, integrasi sistem, dan
efisiensi proses[5]. Maka dari itu, pembangunan website toko ini bukan hanya menjawab
permasalahan lokal dari pemilik toko, tetapi juga menjadi investasi strategis menuju
peningkatan profesionalitas dan keberlanjutan jangka panjang.
Melihat urgensi tersebut, proyek ini disusun untuk merancang dan mengimplementasikan
sebuah website yang fungsional dan terintegrasi, dengan fitur-fitur utama seperti katalog
produk, sistem pemesanan daring, manajemen pesanan, serta pelacakan status pengiriman.
Proyek ini juga menempatkan user experience sebagai fokus utama, baik dari sisi pelanggan
3
maupun admin. Dengan pendekatan ini, diharapkan Toko Lestari Putro dapat memperluas
pasarnya secara daring, mengurangi beban kerja manual, dan meningkatkan efisiensi
pengelolaan bisnis secara keseluruhan.
Adopsi teknologi informasi bukan lagi sekadar pilihan, tetapi merupakan elemen inti dalam
memastikan keberlanjutan dan pertumbuhan usaha mikro di tengah persaingan digital yang
semakin intensif. Oleh karena itu, melalui pembangunan sistem informasi berbasis website ini,
Toko Lestari Putro diharapkan dapat menjadi contoh nyata bagaimana transformasi digital dapat
membawa dampak nyata terhadap kualitas layanan dan efisiensi manajemen UMKM.
1.2. Projek Charter
```
Project Charter (Piagam Proyek) adalah dokumen resmi pendek yang menyatakan bahwa
```
sebuah proyek eksis atau dimulai.
A. Tujuan
Tujuan dari proyek Pembangunan Website Toko Lestari Putro adalah sebagai berikut:
1. Mengembangkan sistem informasi berbasis web yang dapat mengelola
aktivitas penjualan alat tulis kantor secara terintegrasi dan efisien.
2. Menyediakan media digital bagi pelanggan untuk melakukan pemesanan,
pembayaran, dan pelacakan transaksi tanpa harus datang langsung ke
toko.
3. Meningkatkan kecepatan dan akurasi pengelolaan data produk, transaksi, serta
laporan penjualan melalui system otomatis.
4
4. Memberikan kemudahan bagi admin dan pemilik toko dalam melakukan
verifikasi pembayaran, manajemen produk, serta pengaturan pengiriman
barang.
5. Mendukung transformasi digital UMKM agar mampu bersaing di era teknologi
informasi dengan sistem yang responsif dan mudah digunakan.
B. Ruang Lingkup
Ruang lingkup pengembangan proyek ini mencakup:
1. Fitur registrasi dan login pengguna agar pelanggan dapat mengakses sistem
secara personal.
2. Katalog produk lengkap dengan harga, deskripsi, dan gambar untuk
memudahkan pelanggan dalam memilih barang.
3. Fungsi keranjang belanja (shopping cart) dan sistem checkout yang
memungkinkan pelanggan memproses pembelian.
4. Mekanisme unggah bukti pembayaran sebagai validasi transaksi.
5. Dashboard admin untuk:
a. Melihat dan memverifikasi bukti pembayaran.
b. Mengelola data produk (tambah, ubah, hapus).
c. Memproses pengiriman barang dan memperbarui status pesanan.
6. Sistem pelacakan pengiriman bagi pelanggan agar dapat memantau status
barang secara real-time.
7. Antarmuka website yang responsif dan mudah digunakan baik di desktop
maupun perangkat mobile.
5
C. Stakeholder
Stakeholder adalah seluruh pihak, baik itu individu, kelompok, maupun lembaga,
yang memiliki kepentingan atau peran dalam sebuah organisasi atau proyek. Mereka
disebut stakeholder karena setiap tindakan, keputusan, atau hasil dari proyek tersebut akan
memberikan dampak langsung maupun tidak langsung kepada mereka. Stakeholder yang
tim kami buat terdapat pada table 1.1.
Tabel 1. 1 Tabel Stakeholder
No Nama Stakeholder Peran Kepentingan/Kebutuhan
1. Pemilik Toko Lestari Putro Klien utama Ingin memiliki website yang menarik,
fungsional, dan mendukung penjualan alat
tulis.
2. Tim Pengembang Website
```
(Tim Proyek)
```
Pelaksana Proyek Bertanggung jawab atas perencanaan,
desain, pengembangan, dan peluncuran
website.
3. Pelanggan Toko Lestari Putro Pengguna akhir Menginginkan kemudahan dalam mencari
informasi dan membeli produk alat tulis
secara online.
4. Admin Toko/ Pegawai Operator
```
sistem(pihak
```
```
internal toko)
```
Memerlukan antarmuka pengelolaan produk
dan pesanan yang sederhana dan
mudah dipahami..
6
No Nama Stakeholder Peran Kepentingan/Kebutuhan
5. Penyedia Hosting dan Domain Pihak pendukung
teknis eksternal
Menyediakan infrastruktur teknis tempat
website diunggah dan dijalankan.
6. Pihak Pembayaran (Payment
```
Gateway)
```
Partner integrasi
sistem pembayaran
Menyediakan layanan transaksi digital agar
pelanggan dapat membayar dengan aman
dan cepat.
Dalam proyek pengembangan website Toko Lestari Putro, terdapat beberapa pihak yang
terlibat secara langsung maupun tidak langsung. Masing-masing stakeholder memiliki peran dan
kepentingan yang berbeda-beda, namun saling mendukung demi keberhasilan sistem yang
dibangun. Berikut adalah uraian lengkap stakeholder proyek ini:
1. Pemilik Toko Lestari Putro
Pemilik toko berperan sebagai klien utama dalam proyek ini. Mereka
merupakan pihak yang memiliki kebutuhan untuk mendigitalisasi proses penjualan alat
tulis agar lebih efisien dan terjangkau oleh pelanggan luas. Pemilik toko menginginkan
sebuah website yang tidak hanya menarik secara tampilan, tetapi juga fungsional dan
mampu mendukung kegiatan bisnis sehari-hari, mulai dari pengelolaan stok hingga
transaksi.
Sebagai stakeholder utama, pemilik toko juga berperan dalam memberikan
masukan dan persetujuan terhadap rancangan sistem yang dikembangkan.
7
2. Tim Pengembang Website (Tim Proyek)
Tim pengembang adalah pihak pelaksana proyek yang bertanggung jawab
penuh atas seluruh tahapan pembangunan sistem. Peran mereka meliputi analisis
kebutuhan sistem, desain antarmuka, pengembangan backend, integrasi fitur, hingga
proses deployment website. Tim ini juga harus mampu menerjemahkan kebutuhan dari
klien menjadi fitur-fitur yang tepat, efisien, dan mudah digunakan. Selain itu, mereka
juga bertugas melakukan komunikasi aktif dengan stakeholder lain untuk memastikan
sistem yang dibangun sesuai harapan.
3. Pelanggan Toko Lestari Putro
Pelanggan atau pengguna akhir merupakan pihak yang akan berinteraksi
langsung dengan sistem dalam melakukan aktivitas pembelian. Kepentingan utama
mereka adalah memperoleh kemudahan dalam menjelajahi produk, melakukan
pemesanan, dan menyelesaikan transaksi secara cepat dan nyaman. Oleh karena itu,
```
pengalaman pengguna (user experience) menjadi aspek penting yang harus
```
diperhatikan dalam pengembangan antarmuka pelanggan.
4. Admin Toko atau Pegawai
Admin merupakan operator internal dari pihak toko yang akan mengelola
sistem harian seperti penambahan produk, konfirmasi pembayaran, pengiriman
pesanan, dan pembaruan status pengiriman. Mereka membutuhkan antarmuka yang
sederhana, informatif, dan mudah dipahami agar dapat menjalankan operasional toko
tanpa memerlukan pelatihan teknis mendalam. Admin juga menjadi perantara antara
pelanggan dan pemilik toko dalam sistem digital ini.
8
5. Penyedia Hosting dan Domain
Stakeholder ini merupakan pihak eksternal yang menyediakan layanan
infrastruktur teknis berupa tempat penyimpanan dan jalannya sistem website secara
online. Tanpa adanya penyedia hosting dan domain, website tidak akan dapat diakses
oleh pelanggan. Oleh karena itu, peran mereka sangat krusial dalam aspek ketersediaan
dan kestabilan sistem secara daring.
6. Pihak Pembayaran (Payment Gateway)
Sistem pembayaran digital yang terintegrasi seperti payment gateway berperan
sebagai partner penting dalam proyek ini. Mereka memungkinkan pelanggan untuk
```
melakukan pembayaran dengan berbagai metode (transfer bank, e-wallet, QRIS, dsb.)
```
secara aman dan real-time. Dengan adanya payment gateway, proses transaksi menjadi
lebih profesional, cepat, dan minim kesalahan, yang tentunya meningkatkan
kepercayaan pelanggan terhadap toko.
9
BAB II
PERENCANAAN PROYEK
2.1. Model Proses Waterfall
Metode Waterfall adalah model pengembangan perangkat lunak klasik dalam kerangka System
```
Development Life Cycle (SDLC) yang bersifat linier dan berurutan. Model ini menggambarkan proses
```
pembangunan sistem seperti aliran air terjun, di mana setiap tahapan harus diselesaikan sepenuhnya
sebelum melanjutkan ke tahap berikutnya. Waterfall cocok diterapkan pada proyek yang memiliki
kebutuhan sistem yang sudah jelas, terdefinisi dengan baik, dan minim perubahan selama proses
pengembangan. Model ini memberikan pendekatan yang sistematis dan terdokumentasi secara
lengkap untuk menghasilkan perangkat lunak yang terstruktur dan mudah dikelola.
Dalam pengerjaan proyek "Pembangunan Website Toko Lestari Putro", metode Waterfall
digunakan sebagai acuan dalam seluruh tahapan SDLC, mulai dari analisis kebutuhan, perancangan,
implementasi, pengujian, hingga pemeliharaan sistem.
10
A. Tahapan Model Waterfall
Berikut adalah gambar 2.1 untuk tahapan mode waterfall.
Gambar 2. 1 Tahapan Waterfall
Model ini terdiri dari beberapa fase yang harus diselesaikan secara berurutan, di mana
masing-masing fase harus diselesaikan sepenuhnya sebelum fase berikutnya dimulai. Berikut
adalah fase-fase dalam model Waterfall:
1. Analisis Kebutuhan (Requirement Analysis)
Pada tahap ini dilakukan pengumpulan kebutuhan sistem dari pengguna. Semua
kebutuhan fungsional dan non-fungsional didokumentasikan secara rinci untuk menjadi dasar
pengembangan sistem.
2. Perancangan Sistem (System Design)
Berdasarkan hasil analisis kebutuhan, dilakukan perancangan sistem yang mencakup
struktur database, arsitektur sistem, serta rancangan antarmuka pengguna. Tahapan ini
bertujuan untuk memberikan gambaran teknis sebelum proses coding dilakukan.
11
3. Implementasi (Implementation / Coding)
Setelah desain selesai, tahap selanjutnya adalah implementasi, yaitu menerjemahkan
desain ke dalam bentuk kode program sesuai dengan bahasa pemrograman yang digunakan.
4. Pengujian (Testing)
Sistem yang telah selesai dibangun akan diuji untuk memastikan semua fungsi berjalan
dengan baik, bebas dari error, dan sesuai dengan kebutuhan awal. Pengujian ini meliputi
pengujian unit, integrasi, dan sistem secara menyeluruh.
5. Penerapan dan Pemeliharaan (Deployment & Maintenance)
Setelah sistem dinyatakan layak, sistem akan diterapkan di lingkungan pengguna.
Selanjutnya dilakukan pemeliharaan sistem untuk memperbaiki bug, meningkatkan performa,
atau menyesuaikan dengan kebutuhan baru di masa mendatang.
2.2. Analisis Kelayakan
Analisis kelayakan adalah proses evaluasi untuk menentukan apakah suatu proyek, ide, atau bisnis
```
layak untuk dijalankan atau tidak. Analisis kelayakan berupa SWOT (Strengths, Weakness,
```
```
Opportunities, Threats) dalam proyek Website Toko Lestari Putro sebagai berikut:
```
1. Strengths (Kekuatan)
a. Website memudahkan proses transaksi dan pengelolaan produk secara digital.
b. ampilan antarmuka yang responsif dan mudah digunakan oleh pelanggan.
c. Biaya pengembangan relatif rendah dan sudah dialokasikan secara terstruktur.
12
d. Dukungan dokumentasi dan panduan pemakaian tersedia untuk kelancaran
penggunaan.
e. Meningkatkan efisiensi operasional toko dibandingkan metode
konvensional.
2. Weaknesses (Kelemahan)
a. Anggaran proyek terbatas, dapat menghambat penambahan fitur di luar perencanaan
awal.
b. Tidak adanya alokasi untuk perangkat keras seperti komputer atau server cadangan.
c. Ketergantungan penuh pada koneksi internet yang stabil.
d. Fitur masih dasar, belum mendukung fitur lanjutan seperti integrasi ekspedisi otomatis
atau chatbot layanan pelanggan.
3. Opportunities (Peluang)
a. Menjangkau pasar lebih luas melalui platform digital.
b. Meningkatkan branding dan profesionalisme toko.
c. Berpotensi dikembangkan menjadi sistem e-commerce lengkap di masa depan.
d. Bisa menjadi model digitalisasi bagi UMKM lain yang serupa.
4. Threats (Ancaman)
a. Persaingan dari toko lain yang sudah memiliki sistem e-commerce lebih matang.
b. Ancaman keamanan data jika tidak dilakukan pemeliharaan dan pengamanan berkala.
13
c. Risiko keterlambatan pengembangan jika tidak sesuai jadwal.
Kemudian terdapat strategi berdasarkan analisis SWOT yaitu:
1. Strategi S-O (Strengths – Opportunities)
a. Menggunakan fitur website seperti katalog digital dan sistem pembayaran online
untuk menarik pelanggan baru dan memperluas pasar.
b. Mengoptimalkan website sebagai media promosi dan branding toko untuk
meningkatkan daya tarik terhadap pelanggan luar daerah.
c. Menyediakan tampilan antarmuka yang ramah pengguna untuk memperkuat citra
toko sebagai bisnis yang profesional dan modern.
2. Strategi S-T (Strengths – Threats)
a. Menjaga keunggulan layanan dengan menekankan kemudahan dan kecepatan
transaksi dibandingkan pesaing yang belum ramah pengguna.
b. Menambahkan fitur keamanan dasar seperti enkripsi transaksi dan autentikasi
pengguna untuk menghadapi ancaman siber.
c. Melakukan update berkala dan backup sistem agar tetap stabil dan mampu bersaing
dengan platform yang lebih kompleks.
3. Strategi W-O (Weaknesses – Opportunities)
a. Mengembangkan sistem backend sederhana namun stabil yang bisa ditingkatkan
secara bertahap seiring pertumbuhan kebutuhan pelanggan.
b. Menggunakan sistem pemesanan otomatis untuk mengurangi
14
c. ketergantungan operasional toko fisik dan memperpanjang jam layanan.
d. Mencari peluang pendanaan atau dukungan dari lembaga digitalisasi UMKM untuk
mengatasi keterbatasan anggaran dan sumber daya.
4. Strategi W-T (Weaknesses – Threats)
a. Mengurangi proses manual dengan mendigitalkan pencatatan penjualan dan
pengelolaan stok guna menekan kesalahan manusia.
b. Menyediakan pelatihan singkat bagi pengelola toko untuk memastikan penggunaan
website berjalan lancar dan aman.
c. Membuat sistem umpan balik pelanggan guna mengetahui tren dan preferensi terbaru
sehingga toko bisa beradaptasi cepat dengan pasar.
2.3. Work Breakdown Structure
```
Work Breakdown Structure (WBS) adalah metode pengorganisasian proyek dengan cara memecah
```
pekerjaan besar menjadi bagian-bagian yang lebih kecil, detail, dan mudah dikelola. Work Breakdown
```
Structure (WBS) menggunakan pendekatan hierarkis untuk menguraikan pekerjaan proyek menjadi
```
bagian-bagian yang lebih kecil dan dapat dikelola. Pendekatan ini memudahkan pengelolaan,
pelacakan, dan penyelesaian setiap bagian pekerjaan dalam proyek pembuatan website Toko Lestari
ATK dapat dilihat pada gambar 2.2.
15
Gambar 2. 2 Diagram WBS
Penjelasan Pendekatan WBS pada Proyek Website Toko Lestari ATK:
1. Analisis Kebutuhan
Tahapan ini bertujuan untuk mengidentifikasi kebutuhan bisnis dan pelanggan, serta fitur-
fitur utama yang harus tersedia di dalam website. Pekerjaan di tahap ini melibatkan
penelitian kebutuhan dan dokumentasi awal.
2. Desain UI/UX
Berfokus pada pembuatan desain antarmuka yang menarik dan pengalaman pengguna
yang ramah. Pekerjaan meliputi pembuatan wireframe, prototipe, hingga penyusunan
navigasi intuitif yang mendukung kenyamanan pelanggan saat menggunakan website.
16
3. Pengembangan Website
```
Tahapan ini mencakup implementasi teknis, baik pada frontend (HTML, CSS, JavaScript)
```
```
maupun backend (integrasi pembayaran, keamanan data, dan pengelolaan produk). Setiap
```
pengembangan dilengkapi dengan dokumentasi teknis untuk mempermudah
pemeliharaan.
4. Pengujian dan Validasi
Melibatkan pengujian website untuk memastikan tidak ada bug atau masalah teknis yang
menghambat fungsi website. Feedback dari pengguna awal juga dijadikan acuan untuk
perbaikan dan penyempurnaan.
5. Peluncuran Website
Setelah pengembangan dan pengujian selesai, website akan diluncurkan secara resmi.
Panduan pengguna dan pemasaran awal akan membantu meningkatkan adopsi pengguna
terhadap platform baru.
6. Analisis Kebutuhan
Tahapan ini bertujuan untuk mengidentifikasi kebutuhan bisnis dan pelanggan, serta fitur-
fitur utama yang harus tersedia di dalam website. Pekerjaan di tahap ini melibatkan
penelitian kebutuhan dan dokumentasi awal.
7. Desain UI/UX
Berfokus pada pembuatan desain antarmuka yang menarik dan pengalaman pengguna
yang ramah. Pekerjaan meliputi pembuatan wireframe, prototype, hingga penyusunan
navigasi intuitif yang mendukung kenyamanan pelanggan saat menggunakan website.
17
8. Pengembangan Website
```
Tahapan ini mencakup implementasi teknis, baik pada frontend (HTML, CSS, JavaScript)
```
```
maupun backend (integrasi pembayaran, keamanan data, dan pengelolaan produk). Setiap
```
pengembangan dilengkapi dengan dokumentasi teknis untuk mempermudah
pemeliharaan.
9. Pengujian dan Validasi
Melibatkan pengujian website untuk memastikan tidak ada bug atau masalah teknis yang
menghambat fungsi website. Feedback dari pengguna awal juga dijadikan acuan untuk
perbaikan dan penyempurnaan.
10. Peluncuran Website
Setelah pengembangan dan pengujian selesai, website akan diluncurkan secara resmi.
Panduan pengguna dan pemasaran awal akan membantu meningkatkan adopsi pengguna
terhadap platform baru.
11. Dokumentasi Proyek
Dokumentasi mencakup laporan pengujian, laporan peluncuran, dan dokumentasi teknis
lainnya. Ini bertujuan memastikan bahwa klien memiliki referensi lengkap untuk mengelola
website ke depannya.
12. Evaluasi dan Penutupan
Tahapan terakhir mencakup evaluasi keseluruhan proyek, baik dari segi keberhasilan
implementasi maupun kepuasan klien. Pekerjaan ditutup dengan menyusun laporan akhir
proyek dan memastikan bahwa semua tujuan telah tercapai.
18
2.4. Gant Chart
Untuk menggambarkan alur dan durasi setiap tahapan dalam pengembangan website
Toko Lestari Putro, digunakan Gant Chart sebagai alat bantu visualisasi jadwal proyek. Diagram ini
sangat berguna dalam menunjukkan keterkaitan antar aktivitas, estimasi waktu pelaksanaan, dan
urutan kronologis kegiatan secara menyeluruh.
Dengan memanfaatkan Gant Chart, tim pengembang dapat mengelola waktu proyek
secara lebih efisien, mengidentifikasi potensi keterlambatan, serta menjaga keselarasan antar
bagian tim.
Gambar 2. 3 Gant Chart
Gant Chart di atas menunjukkan bahwa proyek dimulai pada tanggal 24 Maret 2025
dengan tahap Analisis Kelayakan dan diakhiri dengan tahap Peluncuran Sistem pada awal Juni
2025. Setiap bar horizontal mewakili durasi pelaksanaan suatu aktivitas, dimulai dari perencanaan
awal, desain, implementasi, hingga pengujian dan dokumentasi. Durasi antar kegiatan disusun
secara berurutan dan terhubung dengan jalur kritis, menandakan bahwa keterlambatan dalam
satu aktivitas dapat berdampak langsung pada jadwal keseluruhan. Visualisasi ini mendukung
pengendalian proyek
19
secara sistematis, membantu stakeholder untuk memahami kemajuan proyek dengan cepat dan
akurat.
2.5. Kebutuhan Sumber Daya
1. Sumber Daya Manuasia
```
SDM (Sumber Daya Manusia) adalah individu atau orang-orang yang bekerja dalam
```
suatu organisasi untuk menggerakkan dan menjalankan fungsi organisasi tersebut. Sumber
daya manusia dalam proyek ini terdiri dari individu-individu dengan peran khusus seperti
Project Manager, sistem analis, UI Designer, front end, back end, tester dan sekretaris.
Setiap anggota tim bertanggung jawab atas tahapan tertentu dalam proyek, mulai dari
perencanaan, pengembangan, pengujian, hingga dokumentasi, guna memastikan proyek
berjalan sesuai target waktu dan kualitas. Selebihnya dapat dilihat dari tabel 2.1.
Tabel 2. 1 Sumber Daya Manusia
Jobdesk Nama Keterangan
Project Manager Daffa Khoirul Maulana 1. Menanggung tanggung jawab penuh atas
keseluruhan aktivitas dalam proyek.
2. Mengatur koordinasi dan
mendistribusikan tugas kepada seluruh
anggota tim.
3. Memimpin jalannya rapat serta diskusi
tim secara rutin.
4. Menyusun jadwal dan rencana kerja
proyek secara terstruktur.
20
Jobdesk Nama Keterangan
5. Mengawasi dan memantau
perkembangan kinerja setiap anggota.
6. Menjadi pihak utama yang
bertanggung jawab atas pencapaian
tujuan proyek.
7. Melakukan evaluasi terhadap setiap
tahapan pelaksanaan proyek.
8. Berperan dalam menyelesaikan kendala
serta menetapkan keputusan penting
untuk kelancaran projek
Sistem Analis Alya Maha Wirahma 1. Melakukan pengumpulan informasi terkait
kebutuhan sistem.
2. Menganalisis kebutuhan untuk mendukung
proses perencanaan sistem.
3. Menyusun spesifikasi kebutuhan
fungsional dan non-fungsional sistem.
4. Merancang diagram use case untuk
menggambarkan interaksi pengguna
dengan sistem.
21
Jobdesk Nama Keterangan
5. Membuat diagram basis data sebagai dasar
perancangan struktur data.
6. Merancang diagram aktivitas (activity
```
diagram) untuk memvisualisasikan alur
```
proses.
7. Menyusun diagram proses bisnis
sebelum dan sesudah penerapan sistem.
UI Designer Fania Nabella 1. Merancang dan mengembangkan tampilan
antarmuka awal untuk website.
2. Membuat mockup sebagai rancangan awal
desain.
3. Menyusun desain antarmuka pengguna
```
(UI) secara menyeluruh.
```
4. Mengembangkan prototipe interaktif dari
website yang akan dibangun.
5. Merancang elemen visual yang estetis dan
menarik secara visual.
22
Jobdesk Nama Keterangan
6. Memastikan bahwa desain yang dibuat
bersifat responsif dan adaptif di berbagai
perangkat.
Front End Ika Putri Wulandari 1. Mengimplementasikan template dan
framework sesuai kesepakatan tim dengan
```
pendekatan model-presenter-view (MPV)
```
untuk struktur kode yang modular.
2. Membangun antarmuka pengguna untuk
website Toko ATK Lestari mencakup
halaman beranda, katalog produk, detail
produk, keranjang, checkout, login,
register, profil, dan riwayat pesanan.
Desain dibuat responsif dan sesuai
kebutuhan pengguna
3. Menyesuaikan tampilan antarmuka
dengan desain UI yang telah ditetapkan
agar konsisten dan mudah digunakan.
4. Menjamin seluruh halaman bersifat
responsif dan dapat diakses dengan baik di
```
berbagai perangkat (mobile, tablet, dan
```
```
desktop)
```
23
Jobdesk Nama Keterangan
Back End Reynaldo Ahnaf 1. Berperan aktif dalam penyusunan analisis
kebutuhan sistem.
2. Menerapkan hasil analisis yang telah
disepakati ke dalam implementasi
program.
3. Menulis kode program berdasarkan
analisis sistem dan rancangan UI/UX.
4. Melakukan debugging dan memperbaiki
bug atau error pada website.
5. Mengembangkan fitur dashboard admin,
termasuk tampilan CRUD, login, logout,
dan lupa kata sandi.
Tester Fania Nabella 1. Menyusun Google Form untuk
pengumpulan data dari responden.
2. Mengonversi hasil isian Google Form
kedalam format Excel untuk keperluan
analisis.
24
Jobdesk Nama Keterangan
3. Melaksanakan pengujian sistem
menggunakan metode User Experience
```
Questionnaire (UEQ).
```
4. Melakukan perhitungan terhadap hasil
pengujian yang diperoleh.
5. Menganalisis data hasil pengujian untuk
menilai kualitas pengalaman pengguna.
Sekretaris Daffa Khoirul Maulana 1. Mencatat hasil rapat tim secara sistematis
dan menyeluruh.
2. Menyusun notulen rapat dan
mendistribusikannya kepada seluruh
anggota tim.
3. Menyimpan dan mengarsipkan seluruh
dokumen penting proyek secara rapi dan
terorganisir.
4. Membantu Project Manager dalam
menyusun jadwal kegiatan dan pengingat
rapat.
25
Jobdesk Nama Keterangan
5. Menyusun laporan dokumentasi proyek
selama proses berlangsung hingga selesai.
6. Memastikan semua informasi tertulis
terdokumentasi dengan baik untuk
kebutuhan evaluasi.
Setiap anggota tim memiliki tanggung jawab spesifik yang telah ditentukan sejak awal,
guna memastikan efektivitas kerja dan pencapaian tujuan proyek. Penentuan tugas dilakukan
berdasarkan minat, latar belakang keahlian, serta kemampuan interpersonal yang dimiliki oleh
masing-masing anggota. Hal ini bertujuan untuk meningkatkan efisiensi pelaksanaan tugas dan
menciptakan kolaborasi yang harmonis dalam tim.
Uniknya, dalam penyusunan struktur organisasi ini, tim juga mempertimbangkan
karakteristik personal atau sifat unik masing-masing individu. Pendekatan ini digunakan untuk
memperkuat kerja sama tim, meminimalkan konflik, serta memaksimalkan potensi individu
sesuai dengan peran yang dijalankan. Karakteristik ini tidak hanya menjadi pelengkap dalam
profil anggota, tetapi juga mendukung keberhasilan komunikasi, pengambilan keputusan,
serta penyelesaian masalah selama proses proyek berlangsung.
Sementara itu, mitra eksternal yang juga merupakan pemilik usaha, berperan sebagai
sponsor proyek. Beliau turut berkontribusi dalam memberikan validasi atas rancangan dan
pengembangan fitur sistem serta mendukung secara finansial pelaksanaan proyek.
26
Keterlibatan mitra menjadi elemen penting dalam menjaga orientasi proyek tetap relevan
dengan kebutuhan pengguna nyata.
Dengan susunan dan pembagian yang terstruktur ini, sumber daya manusia dalam
proyek telah dikelola secara optimal dan menjadi pondasi utama dalam mendukung
kelancaran implementasi proyek dari awal hingga akhir.
2. Sumber Daya Fisik
Untuk mendukung kelancaran pelaksanaan proyek pengembangan website penjualan
alat tulis, tim memanfaatkan berbagai sumber daya fisik yang dirancang untuk menunjang
setiap tahapan, mulai dari perancangan hingga implementasi sistem.
Perangkat utama yang digunakan adalah Laptop/PC dengan spesifikasi minimal
prosesor Intel i3, RAM 8GB, dan SSD 256GB. Spesifikasi ini dipilih agar dapat menjalankan
berbagai tools pengembangan secara lancar, baik untuk pengolahan desain antarmuka
maupun pemrograman sisi frontend dan backend. Setiap anggota tim menggunakan perangkat
ini sebagai alat utama dalam proses produksi sistem.
Selain perangkat keras, ketersediaan koneksi internet dengan kecepatan minimal 20
Mbps menjadi faktor penting yang tidak dapat diabaikan. Koneksi internet digunakan dalam
berbagai aktivitas, mulai dari kolaborasi tim secara daring, pencarian referensi
pengembangan, sinkronisasi kode melalui platform version control, hingga proses deployment
ke server hosting.
Dalam tahap implementasi dan peluncuran sistem, digunakan layanan hosting dan
domain, dengan jenis shared hosting yang disediakan oleh penyedia seperti Qwords atau
Niagahoster. Hosting ini berfungsi sebagai tempat penyimpanan file website, sedangkan
27
domain berperan sebagai alamat akses online agar sistem dapat dijangkau oleh pengguna
secara publik.
Untuk mendukung pengembangan aplikasi, tim menggunakan editor kode seperti
Visual Studio Code dan Sublime Text, yang memungkinkan efisiensi penulisan dan pengelolaan
```
struktur kode program. Sedangkan dalam tahap perancangan antarmuka pengguna (UI/UX),
```
digunakan tools desain seperti Figma dan Adobe XD untuk membuat wireframe dan prototipe
interaktif yang dapat divalidasi sebelum implementasi teknis.
Sebagai alat kolaborasi tim dalam pengelolaan versi kode, digunakan repository
version control berupa Git yang terintegrasi dengan layanan GitHub atau GitLab. Platform ini
memungkinkan anggota tim melakukan penyimpanan kode secara terpusat, melacak riwayat
perubahan, dan mencegah konflik antar pengembang dalam proses revisi dan penggabungan
modul.
Tabel 2. 2 Sumber Daya Fisik
No Nama Sumber Daya Spesifikasi atau Keterangan Kebutuhan Pengguna
1 PC/Laptop Minimal Intel i3, RAM 8GB, SSD 256GB Digunakan seluruh tim
untuk coding & desain
2 Internet Kecepatan minimal 20 Mbps Koneksi untuk
kolaborasi &
deployment
3 Tools Desain Figma Pembuatan UI/UX dan
prototype
28
No Nama Sumber Daya Spesifikasi atau Keterangan Kebutuhan Pengguna
4 Bahasa Pemrograman PHP, HTML, CSS, JavaScript Untuk pengembangan
sisi frontend dan
backend
```
5 Hosting dan Domain Shared Hosting (Qwords /
```
```
Niagahoster), domain .com
```
Menyimpan file
website dan akses
online
6 Editor Kode Visual Studio Code Pengembangan
frontend & backend
7 Server Lokal XAMPP Menjalankan aplikasi
secara lokal sebelum
online
8 Repository Version
Control
Git + GitHub / GitLab Kolaborasi kode dan
versioning proyek
9 Browser Google Chrome Pengujian dan
debugging tampilan
website
Dengan kombinasi sumber daya fisik yang memadai dan terintegrasi, proyek dapat
dijalankan secara efisien dan sistematis, serta menjamin kualitas hasil kerja yang sesuai dengan
tujuan awal pengembangan sistem informasi penjualan ini.
29
2.6. Rencana Jadwal Pelaksanaan Proyek
Berikut adalah jadwal rencanan yang ditentukan.
A. Diagram Netword (ADM)
```
Diagram Network ADM (Arrow Diagramming Method) adalah teknik penjadwalan proyek
```
```
yang menggunakan anak panah untuk merepresentasikan aktivitas dan lingkaran (node) untuk
```
merepresentasikan urutan kejadian.
Gambar 2. 4 Network ADM
1. Analisis kelayakan (A)
Menilai kelayakan proyek secara teknis dan ekonomis, termasuk kebutuhan bisnis dan
```
target pasar. Durasi: 9 hari (21 Maret – 29 Maret 2025).
```
2. Analisis risiko (B)
Mengidentifikasi risiko proyek, seperti keamanan data pelanggan dan gangguan
```
operasional, serta menyusun mitigasinya. Durasi: 5 hari (30 Maret – 3 April 2025).
```
3. Rencana desain website (C)
Membuat wireframe, prototipe UI/UX, dan elemen visual untuk tampilan katalog produk,
```
fitur pencarian, dan keranjang belanja. Durasi: 14 hari (4 April – 17 April 2025).
```
30
4. Rencana pengujian (D)
Menyusun dokumen teknis dan non-teknis, termasuk spesifikasi fitur seperti kategori
```
produk, metode pembayaran, dan pengelolaan stok. Durasi: 7 hari (18 April – 24 April 2025).
```
5. Pengembangan protoype website (E)
Pengembangan fitur dasar, meliputi halaman katalog produk, fitur pencarian, dan
```
registrasi pengguna. Durasi: 14 hari (25 April – 8 Mei 2025).
```
6. Integritas sistem dan fitur (F)
Implementasi dan pengujian sistem pembayaran online, mendukung metode seperti
```
transfer bank dan dompet digital. Durasi: 12 hari (9 Mei – 20 Mei 2025).
```
7. Pengujian sistem dan perbaikan (G)
Menguji semua fitur website, termasuk transaksi, pencarian, dan pengelolaan stok, serta
```
memperbaiki bug. Durasi: 7 hari (21 Mei – 27 Mei 2025).
```
8. Optimasi peforma dan dokumentasi (H)
Meningkatkan performa website dan memastikan tampilannya responsif di berbagai
```
perangkat seperti laptop dan ponsel. Durasi: 7 hari (28 Mei – 3 Juni 2025).
```
9. Peluncuran wesbite (I)
Meluncurkan website Toko Lestari Putro ke publik, siap digunakan untuk transaksi online.
```
Durasi: 1 hari (4 Juni 2025).
```
31
B. Cirtical Path Method
```
Dalam manajemen proyek, Critical Path Method (CPM) digunakan untuk mengidentifikasi
```
```
jalur terpanjang dari rangkaian aktivitas yang tidak memiliki waktu luang (float = 0). Setiap aktivitas
```
di jalur ini harus selesai tepat waktu agar tidak menyebabkan keterlambatan keseluruhan proyek.
Dengan kata lain, jalur kritis adalah jalur yang menentukan durasi minimum untuk menyelesaikan
seluruh proyek.
Tabel 2. 3 Cirtical Path Method
No Kegiatan Kode Durasi
```
(hari)
```
Kegiatan
Pendahulu
ES
```
(Earliest
```
```
Start)
```
EF
```
(Earliest
```
```
Finish)
```
```
LS (Latest
```
```
Start)
```
LF
```
(Latest
```
```
Finish)
```
Float Kritis?
1. Analisis
Kelayakan
A 9 - 0 0 0 0 0 Ya
2. Analisis Risiko B 5 A 9 19 9 19 0 Ya
3. Rancangan
Desain
C 14 B 19 33 19 33 0 Ya
4. Rancangan
Pengujian
D 7 C 33 40 33 40 0 Ya
5. Pengembanga
n Website
E 14 D 40 54 40 54 0 Ya
6. Integrasi
Sistem dan
Fitur
F 12 E 54 66 54 66 0 Ya
32
No Kegiatan Kode Durasi
```
(hari)
```
Kegiatan
Pendahulu
ES
```
(Earliest
```
```
Start)
```
EF
```
(Earliest
```
```
Finish)
```
```
LS (Latest
```
```
Start)
```
LF
```
(Latest
```
```
Finish)
```
Float Kritis?
7. Pengujian
sistem dan
perbaikan
G 7 F 66 73 66 73 0 Ya
8. Optimasi
dan
Dokument
asi
H 7 G 73 100 73 100 0 Ya
9. Peluncura
n sistem
I 1 H 100 101 100 101 0 Ya
Tabel critical path pada proyek pembangunan website Toko Lestari Putro menampilkan
```
rincian aktivitas dari awal hingga akhir, lengkap dengan durasi (hari), ketergantungan antar
```
```
aktivitas, waktu mulai/selesai paling awal (ES/EF), waktu mulai/selesai paling lambat (LS/LF), float,
```
serta status apakah aktivitas tersebut kritis atau tidak.
33
2.7. Rencana Nilai Proyek
Estimasi biaya proyek dilakukan untuk mengetahui seberapa besar sumber daya finansial yang
dibutuhkan untuk menyelesaikan proyek. Biaya tersebut meliputi honor tenaga pengembang,
pembelian domain dan hosting, perangkat keras, serta dokumentasi. Selain itu, disiapkan juga biaya
cadangan sebesar 10% sebagai antisipasi apabila terjadi pengeluaran tak terduga.
Tabel 2. 4 Rencana Nilai Proyek
WBS Team 1 2 3 4 5 6 7 8 9 10 11 12 Total
Project Manager 16.6
66
16.
666
16.6
66
16.6
66
16.6
66
16.6
66
16.
666
16.6
66
16.6
66
16.6
66
16.6
66
16.6
66
200.0
00
Laptop/Komputer 150.
000
0 0 0 0 0 0 0 0 0 0 0 150.0
00
Hosting & Domain 0 0 0 0 0 0 0 0 0 0 0 300.
000
300.0
00
QA Tester 0 0 0 0 0 0 0 0 0 0 0 100.
000
100.0
00
Dokumentasi
Pengguna
12.5
00
12.
500
12.5
00
12.5
00
12.5
00
12.5
00
12.
500
12.5
00
12.5
00
12.5
00
12.5
00
12.5
00
150.0
00
```
Cadangan (10%) 100.0
```
00
34
WBS Team 1 2 3 4 5 6 7 8 9 10 11 12 Total
Total Project Cost Estimate 1.000
.000
Tabel di atas merupakan estimasi biaya pengembangan website penjualan alat tulis yang disusun
berdasarkan harga pasar tahun 2025. Estimasi ini dibuat untuk periode proyek selama 12 bulan dengan
pembagian per komponen pekerjaan sebagai berikut:
1. Project Manager
Biaya yang dialokasikan untuk manajemen proyek adalah sebesar Rp16.666 per bulan,
yang mencerminkan standar tarif freelance part-time di Indonesia. Total selama setahun
mencapai Rp200.000.
2. Laptop/Komputer
Pengadaan perangkat keras berupa laptop dilakukan satu kali di bulan pertama dengan
estimasi sewa sebesar Rp150.000. Perangkat ini digunakan untuk pengembangan, desain
dan operasional proyek secara keseluruhan.
3. Hosting dan Domain
Hosting dan domain website ditujukan untuk keperluan penyimpanan file dan akses
website secara daring. Menghasilkan total biaya tahunan Rp300.000.
35
4. QA Tester (Quality Assurance)
Pengujian sistem dilakukan secara profesional di awal proyek untuk memastikan kualitas
dan fungsionalitas. Biaya pengujian ditetapkan sebesar Rp100.000 dan dibayarkan di bulan
terakhir.
5. DokumentasiPengguna
Pembuatan panduan pengguna dan dokumentasi sistem dilakukan secara rutin setiap
bulan, dengan anggaran Rp50.000/bulan. Total biaya dokumentasi mencapai Rp150.000
per tahun.
6. Cadangan (10%)
Dana cadangan sebesar Rp100.000 dialokasikan sebagai antisipasi terhadap biaya tak
terduga selama proyek berlangsung. Angka ini diambil dari 10% subtotal seluruh
komponen lainnya.
7. Total Estimasi Proyek
Total biaya keseluruhan proyek selama satu tahun adalah Rp1.000.000, yang sudah
mencakup biaya pengembangan, pengujian, dokumentasi, dan komponen cadangan.
36
BAB III
PELAKSANAAN PROYEK
3.1. Realisasi Jadwal Pelaksanaan
```
Sebagai bentuk realisasi dari Gantt Chart dan Work Breakdown Structure (WBS), berikut ini
```
merupakan tabel yang menunjukkan waktu perencanaan dan realisasi masing-masing tahapan
kegiatan proyek. Tabel 3.1 ini menunjukkan bahwa sebagian besar kegiatan selesai sesuai dengan
jadwal, bahkan beberapa selesai lebih cepat.
Tabel 3. 1 Realisasi Jadwal Pelaksanaan
No Tahapan Waktu Perencanaan Realisasi
1 Analisis Kelayakan 21 - 29 Maret 2025 Sesuai Jadwal
2 Anlisisis Risiko 30 Maret – 3 April 2025 Sesuai Jadwal
3 Rancangan Desain 4 – 17 April 2025 Selesai 1 hari lebih cepat
4 Rancangan Pengujian 18 – 24 April 2025 Sesuai Jadwal
5 Pengembangan Prototipe 25 April – 8 Mei 2025 Sesuai Jadwal
6 Integrasi Sistem 9 – 20 Mei 2025 Selesai tepat Waktu
7 Pengujian Dan Perbaikan 21 – 27 Mei 2025 Dilakukan Berkelanjutan
8 Optimasi Dan Dokumentasi 28 Mei – 3 Juni 2025 Selesai tepat waktu
9 Peluncuran Webiste 4 Juni 2025 Dilakukan sesuai rencana
37
Berdasarkan tabel tersebut, kegiatan seperti Analisis Kelayakan, Analisis Risiko, Rancangan
Pengujian, Pengembangan Prototipe, dan Peluncuran Website berhasil diselesaikan tepat waktu.
Rancangan Desain bahkan selesai satu hari lebih cepat dari jadwal. Sedangkan pada tahap Pengujian
dan Perbaikan, kegiatan dilakukan secara berkelanjutan agar setiap bug atau kekurangan dapat segera
ditangani sebelum peluncuran.
Konsistensi antara rencana dan realisasi ini menunjukkan bahwa manajemen waktu dalam proyek
sudah berjalan optimal dengan koordinasi tim yang baik.
3.2. Realisasi Hasil Pekerjaan
A. Realisasi Project Manager: Daffa Khoirul Maulana
Peran Project Manager dalam proyek pengembangan website Toko Lestari Putro sangat
krusial karena menjadi pengendali utama dalam keseluruhan siklus hidup proyek, mulai dari tahap
perencanaan hingga evaluasi. Sebagai pemimpin proyek, Project Manager memastikan bahwa
setiap proses berjalan sesuai jadwal, tujuan tercapai, dan komunikasi antar anggota tim berjalan
efektif.
Langkah awal yang dilakukan adalah menyusun jadwal dan rencana kerja proyek secara
terstruktur. Hal ini mencakup identifikasi tahapan kerja, estimasi waktu penyelesaian, serta
pembagian tanggung jawab berdasarkan bidang keahlian masing-masing anggota tim. Rencana
kerja kemudian dibahas dan disepakati bersama dalam rapat tim, sehingga semua pihak
memahami tugas dan timeline yang harus dipenuhi.
Setelah rencana kerja ditetapkan, Project Manager mengatur koordinasi dan
pendistribusian tugas kepada seluruh anggota tim, termasuk sistem analis, UI designer, front-end,
back-end, dan tester. Proses ini dilakukan dengan memperhatikan beban kerja yang adil dan
38
memastikan setiap anggota memiliki pemahaman yang jelas terhadap tugasnya. Komunikasi
dilakukan secara rutin melalui rapat mingguan atau diskusi harian menggunakan platform digital
seperti WhatsApp dan Google Meet untuk memastikan semua progres proyek berjalan
sebagaimana mestinya.
Project Manager juga memimpin jalannya rapat, baik untuk evaluasi progres, pemecahan
masalah teknis, maupun pengambilan keputusan penting. Contohnya, saat tim UI Designer
mengajukan beberapa versi desain mockup, Project Manager berperan aktif dalam memfasilitasi
diskusi antar anggota dan stakeholder guna menentukan desain yang paling sesuai dengan
identitas toko dan kebutuhan pengguna.
Selain itu, Project Manager secara aktif memantau dan mengevaluasi kinerja tiap anggota.
Jika ditemukan hambatan, seperti keterlambatan pengerjaan atau perbedaan pemahaman tugas,
maka Project Manager segera mengarahkan dan memberikan solusi agar proyek tetap berada di
jalur yang benar. Misalnya, ketika tim backend mengalami kendala dalam integrasi login pengguna,
Project Manager segera menjadwalkan diskusi bersama antara back-end dan frontend untuk
menyelaraskan sistem otentikasi yang digunakan.
Dalam menghadapi dinamika proyek, Project Manager juga berperan sebagai pengambil
keputusan strategis. Ketika terjadi konflik atau perubahan mendadak dalam spesifikasi proyek,
seperti penyesuaian fitur checkout yang harus disesuaikan dengan masukan pengguna, Project
Manager mengambil keputusan yang seimbang antara kebutuhan pengguna, kemampuan teknis
tim, dan keterbatasan waktu.
Terakhir, Project Manager bertanggung jawab penuh terhadap hasil akhir proyek. Setelah
seluruh proses selesai, Project Manager menyusun evaluasi proyek dan mendokumentasikan
39
pelajaran penting yang diperoleh untuk perbaikan di proyek berikutnya. Evaluasi mencakup
pencapaian target, kualitas hasil kerja, serta efektivitas kolaborasi tim secara keseluruhan.
1. Proses pencarian dosen pembimbing mrlalui grup WhatsApp
Gambar di bawah merupakan pembahasan dosen pembimbing MPTI melaluiWhatsapp
Grup yang dilaksanakan pada tanggal 14 Maret 2025. Hasil yangdidapatkan adalah memutuskan
dosen Pak Faisal Fajri untuk menjadi dosen pembimbing. Setelah mempertimbangkan beberapa
dosen untuk menjadi dosen Pembimbing, gambar di bawah merupakan bukti proses pencarian
dosen pembimbing melalui grup whatsapp yang ditunjukkan pada gambar 3.1.1
Gambar 3. 1 Proses Pemilihan Dospem Via WhatsApp
40
2. Proses menghubingi dosen pembimbing
Gambar di bawah adalah menghubungi pak Faisal apakah berkenan bergabung pada grup
whatsapp MPTI pada tanggal 14 Maret 2024 yang dapat dilihat pada gambar 3.2.
Gambar 3. 2 Proses Menghubungi Dospem
3. Pembagian Jobdesk
Gambar 3.3 di bawah merupakan pembahasan mengenai pembagian jobdesk untuk para anggota
Gambar 3. 3 Pembagian Jobdesk
41
4. Pembahasan kinerja
Gambar di bawah merupakan hasil pembahasan rapat pertama bersama mitra mengenai
pengajuan proposal MPT. Hasil rapat meliputi rancangan pengujian tahapan pelaksanaan alokasi
alat penjelasan dibagian biaya.
Gambar 3. 4 Pembahasan Kelanjutan Proposal
5. Bimbingan dengan Dospem
Gambar dibawah merupakan rancangan bimbingan melalui google meet untuk
pembahasan dan mempersiapkan apa saja yang perlu disiapkan ketika membuat web Lestari.
42
Gambar 3. 5 Bimbingan Via Google Meet 1
Gambar 3. 6 Bimbingan Via Google Meet 2
6. Rapat Internal
Gambar dibawah adalah rapat terakhir mengenai MOU yang akan diserahkan mitra pada
tanggal 30 Agustus 2025 di Rumah Daffa.
43
Gambar 3. 7 Rapat Internal
7. Penerimaan MOU
Gambar dibawah ini memberikan MOU dan hasil web sudah 90% kepada mitra LESTARI PUTRO
Gambar 3. 8 Penyerahan MOU
44
B. Realisasi Sistem Analisis: Alya Maha Wirahma
1. Membuat Perancangan Sistem
Perancangan sistem ini bertujuan untuk memberikan pemahamansecara menyeluruh
kepada pengguna mengenai sistem yang akan dikembangkan. Perancangan sistem ini
```
dilakukan menggunakan Unified Modelling Language (UML) yang meliputi tahapan
```
analisis, pembuatan use case diagram, activity diagram, serta class diagram. Berikut
rancangan sistem pada sistem penjualan ATK berbasis website:
```
a) Kebutuhan Fungsional:
```
Kebutuhan fungsional merupakan spesifikasi yang mendefinisikan layanan atau fungsi
utama yang wajib disediakan oleh sistem untuk mencapai tujuan pengguna. Kebutuhan ini
berorientasi pada aspek apa yang harus dilakukan oleh sistem serta umumnya dapat
diamati secara langsung melalui interaksi pengguna dengan sistem, disebutkan kebutuhan
fungsional yang tertuang pada tabel 3.2.
Tabel 3. 2 Kebutuhan Fungsional
NO Kebutuhan Fungsional
1. Sistem dapat menampilkan informasi mengenai peralatan alat tulis dan informasi mencakup
gambar produk dan detail dari produk tersebut, seperti nama produk, harga produk,
deskripsi produk, stok dan kategori produk.
2. Pengguna dapat melihat isi catalog secara lengkap produk produk yang dapat dibeli dan
produk yang sudah habis.
3. Sistem dapat menampilkan informasi mengenai fitur pengiriman pada pembayaran produk
dan informasinya mencakup nama penerima, nomor telepon penerima, alamat lengkap
pengiriman, catatan untuk penjual, serta untuk rincian pesanan terdapat ongkos kirim.
45
NO Kebutuhan Fungsional
4. Sistem dapat menampilkan informasi fitur sorting dari harga terendah atau dari harga
tertinggi dan sorting produk melalui abjad
5. Sistem dapat menampilkan informasi fitur promo produk dan informasinya mencakup
katalog produk produk dengan gambar produk, harga promo, detail produk seperti deskripsi
produk dan stok.
6. Sistem dapat menampilkan informasi fitur riwayat pesanan dan informasinya mencakup
tampilan semua produk yang pernah dipesan, produk dengan status belum bayar, produk
dengan status diproses, produk dengan status dikirim, produk dengan status selesai, dan
produk dengan status dibatalkan.
7. Pelanggan dapat melakukan login atau jika belum memiliki akun dapat melakukan registrasi.
8. Pelanggan dapat mengajukan pertanyaan ke penjual melalui whatsapp
9. Admin whatsapp akan membantu pelanggan jika ada kesulitan atau ada pertanyaan
10. Admin memiliki akses ke sistem dengan login dan logout
46
NO Kebutuhan Fungsional
11. Admin dapat menambahkan, mengedit, atau menghapus detail produk seperti gambar,
harga, nama produk, deskripsi produk, dan stok produk.
12. Sistem admin dapat menampilkan fitur ringkasan pemesanan dan total pemasukkan, status
pesanan baru, diproses, dikirim, selesai, dan dibatalkan.
```
b) Kebutuhan Non-Fungsional
```
Kebutuhan non-fungsional merupakan persyaratan yang mendeskripsikan atribut kualitas,
kendala, serta standar yang harus dipenuhi oleh sistem dalam mendukung kebutuhan
fungsional. Kebutuhan ini mencakup aspek kinerja, keandalan, keamanan, kemudahan
penggunaan, serta skalabilitas sistem, disebutkan kebutuhan non-fungsional yang tertuang
pada tabel 3.3.
Tabel 3. 3 Kebutuhan Non-Fungsional
NO Parameter Deskripsi
1. Keamanan Sistem harus mengenkripsi data sensitive seperti kata sandi.
2. Ketersediaan Sistem harus tersedia secara online 24 jam dan 7 hari seminggu.
3. Kinerja Sistem harus responsive dan memberikan waktu respon yang
cepat untuk semua operasi.
4. Skalabilitas Sistem harus dirancang agar mudah ditambahkan fitur baru tanpa
mengganggu layanan yang ada.
5. Portability Sistem dibangun sebagai aplikasi web.
6. Usability Pengguna harus dapat menyelesaikan pemesanan dalam beberapa
Langkah yang sederhana.
47
2. Membuat Proses Bisnis
```
a) Proses bisnis sebelum ada sistem
```
Sistem penjualan ATK berbasis website adalah platform yang terintegrasi secara digital
untuk mengelola data produk alat tulis kantor, paket penjualan, serta layanan pengiriman
kepada pelanggan. Berikut merupakan proses bisnis penjualan ATK secara manual yang
ditunjukkan pada gambar 3.9.
Gambar 3. 9 Activity Sebelum Sistem
Berdasarkan gambar activity diagram diatas, proses bisnis pembelian di Toko ATK
secara manual diawali ketika pelanggan mendatangi lokasi toko dan disambut oleh penjual.
Selanjutnya, pelanggan melihat produk yang tersedia dan menanyakan harga atau
ketersediaan stok kepada penjual. Setelah mendapatkan informasi, pelanggan memutuskan
48
apakah akan melakukan pembelian atau tidak. Jika pelanggan memutuskan untuk membeli,
penjual akan menuliskan nota secara manual sebagai bukti transaksi. Pelanggan kemudian
melakukan pembayaran secara tunai atau melalui transfer, yang kemudian dikonfirmasi oleh
penjual.
Setelah pembayaran selesai, pelanggan dapat membawa pulang produk yang dibeli,
sedangkan penjual mencatat transaksi tersebut ke dalam buku besar sebagai arsip penjualan.
Dengan demikian, proses pembelian dinyatakan selesai.
```
b) Proses bisnis setelah ada sistem
```
Melihat permasalahan pada proses bisnis sebelumnya, pelanggan harus datang
langsung ke toko untuk melihat ketersediaan produk ATK yang diinginkan serta melakukan
pembelian secara manual. Namun, setelah dibangunnya sistem penjualan ATK berbasis
website, pelanggan dapat melihat daftar produk dan ketersediaan stok secara langsung
melalui website tanpa perlu datang ke lokasi. Selain itu, pelanggan dapat memilih produk yang
diinginkan, melakukan pemesanan, serta menyelesaikan pembayaran secara online melalui
sistem. Pelanggan juga dapat memilih opsi pengiriman sehingga produk yang dibeli dapat
langsung dikirimkan ke alamat tujuan. Dengan adanya sistem ini, proses transaksi menjadi
lebih praktis, efisien, dan dapat dilakukan kapan saja. Berikut merupakan proses bisnis
penjualan ATK setelah dibangunnya sistem yang ditunjukkan pada gambar 3.10.
49
Gambar 3. 10 Activity Diagram Setelah Sistem
Berikut adalah spesifikasi alur proses sistem dari website penjualan ATK berbasis web
berdasarkan gambar di atas:
1. Admin
• Admin dapat mengakses website toko dengan melakukan login menggunakan
email dan password.
• Setelah berhasil login, admin dapat mengelola semua data pada sistem, yang
```
meliputi: menambah data produk ATK, mengedit atau memperbarui data produk
```
50
yang sudah ada, menghapus data produk yang sudah tidak tersedia, dan melihat
data produk yang tersimpan di database.
2. User
• Pelanggan dapat mengunjungi website toko dan melakukan
login menggunakan email serta password.
• Pelanggan dapat melihat berbagai layanan dan fitur yang
tersedia di website.
• Pelanggan dapat melihat informasi katalog produk dan
detail produk yang tersedia.
• Jika pelanggan ingin membeli produk, mereka dapat
memasukkan produk ke dalam keranjang belanja.
• Pelanggan dapat melanjutkan proses pembayaran setelah
produk masuk ke dalam keranjang.
• Pelanggan diminta untuk mengisi formulir pengiriman
sebagai informasi alamat tujuan.
• Setelah itu, pelanggan dapat melakukan pembayaran
sesuai metode yang tersedia.
• Transaksi akan dikonfirmasi oleh sistem dan proses
pembelian selesai.
51
```
c) Membuat Use Case Diagram
```
Gambar di bawah membuat use case dapat dilihat pada gambar 3.11.
Gambar 3. 11 Use Case Diagram
Use case diagram pada gambar di atas menunjukkan interaksi antara Admin dan
```
Pelanggan (User) dengan sistem penjualan ATK berbasis website.
```
Admin dapat melakukan login, kemudian mengelola data pada sistem, seperti
menambah, memperbarui, dan menghapus produk, mengelola data pengguna, serta
memproses pesanan yang masuk.
Pelanggan juga melakukan login untuk dapat menggunakan fitur sistem. Pelanggan
dapat melihat katalog dan detail produk, memilih produk dan memasukkannya ke keranjang,
melakukan checkout, mengisi data pengiriman, serta menyelesaikan pembayaran.
Diagram ini memberikan gambaran fungsi utama yang dapat diakses oleh masing-
masing aktor sesuai dengan perannya dalam sistem. Berikut merupakan gambar use case
diagram.
52
Gambar 3. 12 Use Case Diagram Sistem
Berikut adalah penjelasan mengenaik gambar 3.12.
```
a) Aktor
```
• Admin: Bertugas mengelola data pada sistem.
• Pelanggan: Pengguna yang melakukan pembelian produk ATK melalui website.
```
b) Use Case
```
• Login: Baik admin maupun pelanggan harus login ke sistem dengan memasukkan
username dan password.
• Lihat Katalog: Pelanggan dapat melihat daftar produk yang tersedia.
• Pilih Barang: Pelanggan dapat memilih produk yang diinginkan dari katalog.
• Detail Alamat: Pelanggan mengisi atau memperbarui alamat pengiriman untuk
produk yang dibeli.
53
• Pembayaran: Pelanggan menyelesaikan pembayaran melalui metode yang
tersedia pada sistem.
• Kelola Database: Admin dapat mengelola database yang mencakup dua bagian:
• Data ATK: Admin dapat menambah, mengedit, dan menghapus data produk ATK.
• Data Pengguna: Admin dapat mengelola data pelanggan yang terdaftar di sistem.
```
c) Hubungan (Relationship)
```
• Use case Login memiliki relasi include ke Username dan Password, karena kedua
data tersebut dibutuhkan untuk proses login.
• Use case Kelola Database memiliki relasi include ke Data ATK dan Data Pengguna,
karena keduanya merupakan bagian dari proses pengelolaan database oleh
admin.
Diagram ini memperlihatkan bahwa pelanggan lebih berfokus pada proses pembelian,
mulai dari login, memilih produk, hingga pembayaran, sementara admin berfokus pada
pengelolaan data sistem agar transaksi pelanggan dapat berjalan dengan baik.
```
d) Pembuatan Activity Diagram
```
Gambar di bawah merupakan pembuatan Activity Diagram pada tanggal 14 April 2025.
Pembuatan Activity Diagram secara keseluruhan dan secara detail per bagian, yaitu pada
bagian Home, Katalog, Keranjang, dan Pembayaran, dapat dilihat pada gambar 3.13.
54
Gambar 3. 13 Pembuatan Activity Diagram
1. Activity Diagram Admin
a. Login
Gambar di bawah merupakan pembuatan Activity Diagram Login pada tanggal 14 April
2025. Activity Diagram ini menjelaskan proses login pada sistem penjualan ATK berbasis
web. Pelanggan terlebih dahulu mengakses halaman web, kemudian sistem akan
menampilkan halaman login. Pelanggan memasukkan email dan password untuk
melakukan autentikasi. Jika data yang dimasukkan benar, sistem akan menampilkan
halaman dashboard sebagai tanda bahwa login berhasil.
55
Gambar 3. 14 Login Admin
b. Dashboard
Activity diagram ini menggambarkan alur ketika admin mengakses halaman dashboard
sistem. Proses dimulai dari admin yang mengakses halaman web, kemudian sistem
secara otomatis menampilkan halaman beranda. Pada halaman ini, sistem menyajikan
ringkasan pesanan dan total pemesanan, termasuk status pesanan yang baru masuk,
sedang diproses, telah dikirim, selesai, maupun yang dibatalkan. Diagram ini
menunjukkan interaksi sederhana namun penting sebagai titik awal pengelolaan
informasi dalam sistem.
56
Gambar 3. 15 Dashboard Admin
c. Daftar ATK
Diagram ini menjelaskan proses admin dalam melihat dan memfilter data ATK.
Aktivitas dimulai dari admin yang membuka halaman daftar ATK. Selanjutnya, sistem
akan menampilkan seluruh data ATK yang tersedia. Admin kemudian dapat
memanfaatkan fitur filter untuk menyaring data berdasarkan kriteria tertentu, dan
sistem akan menampilkan hasil data yang sesuai dengan filter tersebut. Diagram ini
merepresentasikan fungsionalitas pencarian dan penyaringan data yang mendukung
efisiensi pengelolaan inventaris.
Gambar 3. 16 Daftar ATK Admin
57
d. Tambah Data
Diagram di bawah ini menggambarkan proses "Tambah Data" untuk produk ATK oleh
admin dalam sistem. Proses dimulai ketika admin mengklik tombol "New ATK" di
halaman manajemen produk, lalu mengisi data sesuai form yang disediakan. Setelah itu,
admin menekan tombol "Submit" untuk mengirim data ke sistem. Sistem kemudian
memproses penyimpanan data ke dalam database. Jika proses penyimpanan berhasil,
```
sistem menampilkan notifikasi berhasil; jika gagal, sistem menampilkan notifikasi error.
```
Setelah pemberitahuan, sistem mengarahkan kembali ke halaman daftar ATK.
Gambar 3. 17 Tambah Data Admin
58
e. Hapus Data
Diagram aktivitas di bawah menggambarkan alur proses penghapusan data Alat
```
Tulis Kantor (ATK) oleh admin pada sistem. Proses dimulai ketika admin membuka
```
halaman daftar ATK, kemudian sistem secara otomatis menampilkan seluruh data ATK
yang tersedia. Selanjutnya, admin menekan tombol "Hapus" pada salah satu item ATK
yang ingin dihapus. Sistem kemudian menampilkan dialog konfirmasi untuk memastikan
tindakan penghapusan tersebut. Jika admin menyetujui konfirmasi, maka sistem akan
menghapus data ATK dari basis data.
Setelah proses penghapusan berhasil, sistem memperbarui daftar ATK dan
menampilkan pesan sukses sebagai umpan balik kepada admin. Diagram ini
menunjukkan adanya interaksi dua arah antara admin sebagai aktor pengguna dan
sistem dalam mengelola data ATK secara efisien dan aman.
Gambar 3. 18 Hapus Data Admin
59
f. Edit Data
Diagram aktivitas di bawah menggambarkan alur proses "Edit ATK" antara aktor
```
admin dan sistem pada sistem penjualan alat tulis kantor (ATK). Proses dimulai ketika
```
admin membuka halaman daftar ATK, kemudian sistem menampilkan seluruh data ATK
yang tersedia. Setelah itu, admin memilih tombol edit pada salah satu item ATK, yang
kemudian memicu sistem untuk menampilkan formulir edit. Admin lalu memperbarui data
yang diinginkan melalui formulir tersebut. Data yang telah diperbarui kemudian dikirim ke
sistem untuk disimpan ke dalam basis data. Setelah data berhasil diperbarui, sistem akan
menampilkan daftar ATK yang telah diperbarui, dan di sisi admin, ditampilkan pesan
keberhasilan sebagai umpan balik bahwa proses edit telah berhasil diselesaikan. Diagram
ini menunjukkan interaksi terstruktur dan alur informasi yang jelas antara admin dan
sistem dalam proses pembaruan data produk ATK.
Gambar 3. 19 Hapus Data Admin
60
2. Activity Diaram Pelanggan
```
a) Login
```
Activity diagram ini menggambarkan proses login pelanggan ke dalam sistem.
Pelanggan mengakses halaman web, kemudian sistem menampilkan halaman login.
Selanjutnya, pelanggan memasukkan email dan password. Sistem akan memverifikasi
data yang dimasukkan. Jika informasi valid, maka sistem menampilkan halaman
dashboard. Jika tidak valid, pelanggan akan diminta mengisi ulang informasi yang benar.
Proses ini memastikan hanya pengguna terautentikasi yang dapat mengakses sistem.
2. Beranda
Diagram aktivitas pada halaman Home menggambarkan alur interaksi antara
aktor Pelanggan dan Sistem saat pengguna mengakses halaman beranda situs web.
Gambar 3. 20 Login Pelanggan
61
Proses diawali ketika pelanggan membuka halaman web, yang kemudian direspons oleh
sistem dengan menampilkan halaman beranda. Selanjutnya, ketika pelanggan memilih
menu "Home" pada navigasi, sistem akan menampilkan informasi utama yang mencakup
```
promosi, produk alat tulis kantor (ATK) populer, gambar produk, nama dan harga produk,
```
kategori produk, detail produk, serta tombol untuk menambahkan produk ke keranjang.
Diagram ini menjelaskan bagaimana sistem merespons tindakan pengguna secara
langsung dengan menyediakan konten informatif dan interaktif.
3. Katalog
Diagram aktivitas ini menunjukkan alur pelanggan dalam mengakses katalog
produk. Setelah pelanggan membuka halaman web, sistem menampilkan halaman
beranda. Kemudian, pelanggan memilih menu katalog pada navigasi. Sistem akan
merespons dengan menampilkan informasi produk secara lengkap, termasuk gambar,
nama, harga, kategori, detail produk, dan tombol keranjang. Proses ini bertujuan untuk
memberikan pengalaman belanja yang informatif dan interaktif bagi pelanggan.
Gambar 3. 21 Beranda Pelanggan
62
Gambar 3. 22 Katalog Pelanggan
```
d) Keranjang
```
Diagram aktivitas Keranjang menggambarkan alur proses interaksi antara
pelanggan dan sistem dalam mengelola isi keranjang belanja. Proses dimulai ketika
pelanggan mengakses halaman web dan sistem menampilkan halaman beranda.
Selanjutnya, pelanggan memilih menu keranjang, lalu sistem mengambil dan
menampilkan data isi keranjang dari basis data. Pelanggan kemudian memiliki opsi untuk
mengubah jumlah produk atau menghapus produk dari keranjang. Jika pelanggan
memilih untuk mengubah jumlah produk, maka sistem akan memperbarui data produk.
Jika produk dihapus, sistem akan menghapus produk tersebut dari basis data. Setelah itu,
pelanggan dapat melanjutkan dengan mengklik tombol checkout untuk diarahkan ke
halaman checkout. Diagram ini menunjukkan mekanisme dinamis pengelolaan isi
keranjang belanja sebelum melakukan proses pembayaran.
63
Gambar 3. 23 Keranjang Pelanggan
```
e) Pembayaran
```
Diagram aktivitas Pembayaran menjelaskan alur kerja dari sisi pelanggan dan
sistem selama proses transaksi pembelian. Aktivitas diawali saat pelanggan mengakses
halaman web, dilanjutkan dengan memilih menu keranjang dan menyelesaikan proses
pengelolaan produk di keranjang.
Setelah itu, pelanggan mengklik tombol untuk melanjutkan ke pembayaran.
Sistem kemudian menampilkan formulir informasi pengiriman yang mencakup nama dan
nomor telepon penerima, alamat lengkap, catatan untuk penjual, serta rincian pesanan
seperti total belanja dan ongkos kirim. Langkah terakhir adalah pelanggan menekan
tombol "pesan" untuk menyelesaikan transaksi. Diagram ini menggambarkan proses
konfirmasi akhir yang diperlukan dalam penyelesaian pembelian secara sistematis dan
informatif.
64
Gambar 3. 24 Pembayaran
```
f) Pesanan
```
Diagram aktivitas ini menggambarkan alur pelanggan dalam melihat status
pesanan pada sistem. Pelanggan memulai dengan mengakses halaman web, lalu sistem
menampilkan halaman beranda. Selanjutnya, pelanggan memilih menu "Pesanan" pada
navigasi. Sistem kemudian menampilkan informasi terkait seluruh riwayat pesanan
pelanggan, termasuk status produk yang belum dibayar, sedang diproses, dalam
pengiriman, selesai, maupun dibatalkan. Proses ini bertujuan untuk memberikan
transparansi dan kemudahan bagi pelanggan dalam memantau perkembangan pesanan
mereka secara real-time.
65
Gambar 3. 25 Pesanan Pelanggan
```
g) Pembuatan Rancangan Basis Data
```
Rancangan basis data ini digunakan dalam sistem pemesanan produk alat tulis
```
kantor (ATK) berbasis web. Terdapat beberapa tabel utama yang saling terhubung, yaitu
```
users, atk, kategori_atk, keranjang_items, pesanan, dan item_pesanan.
Tabel users menyimpan data pengguna dan terhubung ke tabel pesanan serta
keranjang_items. Tabel atk berisi data produk ATK dan dikategorikan melalui relasi
dengan tabel kategori_atk. Data produk yang dimasukkan ke keranjang disimpan pada
tabel keranjang_items, sedangkan data pemesanan dicatat dalam tabel pesanan, dan
rincian tiap produk yang dipesan tersimpan di tabel item_pesanan.
Selain itu, terdapat tabel roles dan role_user untuk pengaturan hak akses
pengguna. Tabel-tabel pendukung lainnya seperti sessions, cache, cache_locks, dan
migrations digunakan untuk kebutuhan teknis seperti autentikasi, penyimpanan cache,
66
dan migrasi basis data. Rancangan ini dirancang untuk menunjang proses pemesanan
produk secara terstruktur dan efisien.
Gambar 3. 26 Rencana Basis Data
67
C. Realisasi UI Desainer: Fania Nabella
Peran UI Designer dalam proyek pengembangan website Toko Lestari Putro sangat
vital karena menjadi jembatan antara kebutuhan fungsional sistem dengan kenyamanan dan
kepuasan pengguna. Desain antarmuka yang baik tidak hanya sekadar enak dipandang, tetapi
juga harus memudahkan pengguna dalam menavigasi fitur-fitur utama situs, melakukan
transaksi, dan memperoleh informasi dengan cepat dan efisien. Oleh karena itu, tahap
perancangan UI dilakukan secara bertahap dan terstruktur untuk menghasilkan desain visual
```
yang optimal dan berorientasi pada pengalaman pengguna (user experience).
```
Langkah awal yang dilakukan adalah merancang dan mengembangkan tampilan
```
antarmuka awal (initial layout) dari website. Proses ini dimulai dengan memahami kebutuhan
```
pengguna dan alur sistem yang telah disepakati dalam fase perencanaan. UI designer
berkolaborasi dengan tim pengembang dan stakeholder untuk menentukan elemen-elemen
apa saja yang perlu ditampilkan di halaman utama, seperti menu navigasi, katalog produk,
form checkout, dan halaman admin. Referensi visual dari toko online sejenis juga digunakan
sebagai bahan pembanding agar desain tetap relevan dengan tren terkini dan sesuai
ekspektasi pengguna.
Setelah itu, dilakukan pembuatan mockup sebagai representasi visual awal dari
tampilan halaman-halaman utama pada website. Mockup ini disusun menggunakan tools
desain seperti Figma atau Adobe XD dan berfungsi sebagai draf non-fungsional dari layout
halaman yang mencakup posisi tombol, gambar, teks, ikon, dan elemen lainnya. Dengan
adanya mockup, tim dan stakeholder dapat berdiskusi dan memberikan masukan terhadap
struktur halaman sebelum masuk ke tahap implementasi teknis.
68
```
Selanjutnya, UI designer menyusun desain antarmuka pengguna (UI) secara
```
menyeluruh dengan memperhatikan konsistensi warna, tipografi, ukuran elemen, dan hirarki
visual antar halaman. Hal ini dilakukan untuk memastikan bahwa seluruh komponen desain
selaras secara estetika dan mendukung kenyamanan pengguna saat mengakses sistem.
Penataan desain juga mempertimbangkan prinsip usability, seperti keterbacaan teks, jarak
```
antar elemen, dan visibilitas tombol aksi (call to action) agar pengguna dapat menggunakan
```
sistem secara intuitif.
Proses dilanjutkan dengan pengembangan prototipe interaktif dari website yang
memungkinkan stakeholder untuk mencoba simulasi sistem secara langsung. Prototipe ini
dibuat menggunakan fitur interaktif pada platform desain untuk mensimulasikan klik tombol,
transisi antar halaman, dan navigasi menu. Melalui prototipe ini, dilakukan pengujian awal
terhadap user flow agar bisa diketahui apakah pengguna dapat menyelesaikan tugas-tugas
penting seperti melihat produk, menambahkan barang ke keranjang, dan melakukan checkout
dengan lancar.
Tidak hanya fokus pada fungsi, UI designer juga berperan dalam merancang elemen
visual yang estetis dan menarik secara visual. Hal ini mencakup pemilihan palet warna yang
sesuai dengan identitas toko, ikonografi yang mudah dikenali, dan penggunaan gambar produk
berkualitas tinggi. Desain yang menarik dapat meningkatkan kepercayaan pengguna terhadap
profesionalitas website dan mendorong terjadinya transaksi.
Terakhir, tim UI memastikan bahwa seluruh desain yang dihasilkan bersifat responsif
dan adaptif, artinya desain mampu menyesuaikan diri secara otomatis ketika diakses melalui
berbagai jenis perangkat, baik itu laptop, tablet, maupun smartphone. Dengan pendekatan
desain responsif ini, pengguna dari berbagai platform tetap dapat menikmati pengalaman
yang konsisten dan nyaman tanpa hambatan teknis atau tampilan yang rusak.
69
Secara keseluruhan, peran UI Designer tidak hanya berhenti pada estetika, tetapi juga
mencakup fungsi, kenyamanan, dan keberhasilan interaksi pengguna dengan sistem. Tahapan
perancangan antarmuka yang dilakukan dengan baik berkontribusi langsung terhadap kualitas
akhir website serta kepuasan pengguna dalam jangka panjang. Berikut adalah hasil UI Designer
yang dibuat:
1. Login
Halaman login dirancang sebagai gerbang awal bagi pengguna untuk masuk ke dalam
sistem. Fokus utama pada halaman ini adalah kesederhanaan dan kejelasan input data, seperti
email dan password. UI designer mempertimbangkan pengalaman pengguna dengan
menempatkan elemen-elemen penting seperti logo toko, kolom input, tombol login, dan
tautan ke halaman register dalam satu tampilan yang bersih dan terpusat.
70
Gambar 3. 27 Login Page
Jika user atau pengguna salah memasukkan email dan passwordnya maka akan
mendapatkan peringatan seperti pada gambar dibawah ini.
Tampilan halaman login memudahkan pengguna dalam memahami langkah-langkah
masuk ke akun mereka. Kontras warna antara latar belakang dan teks membuat input mudah
```
dibaca. Tombol aksi (CTA) didesain dengan warna mencolok untuk meningkatkan keterlihatan
```
dan meningkatkan kemungkinan interaksi.
Gambar 3. 28 Pop Up Password Salah
71
2. Register
Halaman register dibuat untuk memfasilitasi pengguna baru dalam membuat akun.
Elemen yang dimunculkan meliputi form nama lengkap, alamat email, password, serta
konfirmasi password. UI designer menyesuaikan layout form agar rapi dan tidak
membingungkan bagi pengguna baru.
Jika pengguna berhasil membuat akun, maka muncul pemberitahuan register
beerhasil seperti gambar dibawah.
Gambar 3. 29 Register
72
Formulir registrasi tampil bersih dan sistematis. Setiap kolom diberi label yang jelas
untuk menghindari kesalahan input. Desain tombol register dibuat selaras dengan halaman
login agar konsisten secara visual. Terdapat juga link kembali ke halaman login untuk
kemudahan navigasi.
3. Dashboard
Dashboard merupakan pusat kontrol pengguna setelah berhasil login. UI dirancang
agar pengguna langsung disambut dengan informasi penting dan ringkasan akun. Tujuannya
adalah memberikan kemudahan orientasi dan akses cepat ke fitur utama seperti katalog
produk, keranjang, pesanan, profil, dan logout pada sidebarnya.
Gambar 3. 30 Register Berhasil
73
Gambar 3. 31 Halaman Dashboard
Tampilan ini jika ada pada handphone akan muncul jika pengguna menekan tombol
bottom lalu menampilan sidebar yang berisi beberapa pilihan seperti dibawah ini.
Tampilan dashboard menampilkan menu navigasi yang jelas dan konsisten di bagian
atas atau samping halaman. Visualisasi informasi difokuskan pada kejelasan dan keterbacaan,
dengan ikon dan warna yang membantu pengguna memahami fungsinya tanpa perlu membaca
teks secara detail.
Gambar 3. 32 Sidebar
74
4. Katalog
Halaman katalog merupakan salah satu komponen utama dalam website Toko Lestari
Putro, karena menjadi tempat di mana seluruh produk alat tulis kantor ditampilkan dan
ditawarkan kepada pengguna. Desain halaman ini harus mampu menyajikan informasi yang
cukup untuk membantu pengguna membuat keputusan pembelian dengan cepat, sekaligus
menyediakan akses untuk melihat detail lebih lanjut bagi pengguna yang ingin menelusuri
informasi produk secara lengkap.
Gambar 3. 33 Halaman Katalog
Jika pengguna ingin langsung membelinya maka otomatis akan masuk kedalam
keranjang untuk memastikan pesanan pelanggan sudah sesuai atau belum. Fitur ini sangat
berguna untuk pelanggan yang sudah sering berbelanja dan tidak perlu membaca deskripsi
panjang.
75
Gambar 3. 34 Halaman Keranjang
Di sisi lain, bagi pengguna yang ingin mengetahui informasi lebih lengkap sebelum
membeli, tersedia opsi " Detail" atau cukup dengan mengklik. Saat ini dilakukan, pengguna
diarahkan ke halaman produk spesifik yang menampilkan yang ada pada gambar dibawah
Gambar 3. 35 Detail Barang
76
Pengguna melakukan klik pada tombol “tambah ke keranjang” maka pengguna
mendapatkan pemberitahuan berhasil masuk ke keranjang. Fitur ini memudahkan pengguna
untuk meyakinkan apakah tadi pengguna berhasil klik atau tidak.
Gambar 3. 36 Sukses Masuk Keranjang
Desain ini memberikan fleksibilitas bagi berbagai tipe pengguna: baik yang ingin
belanja cepat, maupun yang ingin memastikan spesifikasi produk secara menyeluruh.
5. Keranjang
Halaman keranjang dirancang untuk menampilkan produk-produk yang telah dipilih
oleh pengguna. Di dalamnya terdapat informasi jumlah barang, total harga, dan opsi untuk
menghapus atau melanjutkan ke pembayaran.
77
Gambar 3. 37 Keranjang Belanja
Desain halaman keranjang memberikan ringkasan belanja yang jelas. Pengguna dapat
melihat subtotal dan melakukan update jumlah barang secara langsung. Tombol “lanjutkan
ke pembayaran” ditampilkan secara mencolok dan mudah dijangkau pada berbagai ukuran
layar.
6. Info payment
Setelah proses checkout, pengguna diarahkan ke halaman informasi pembayaran. Di
halaman ini, UI designer menambahkan detail nomor rekening tujuan, nominal yang harus
dibayar, serta form untuk mengunggah bukti transfer.
78
Gambar 3. 38 Pembayaran
Halaman ini memberikan instruksi yang jelas mengenai langkah pembayaran. Form
unggah bukti dilengkapi dengan label yang membantu pengguna memahami batas ukuran file
atau format gambar. Desain dibuat sederhana agar pengguna tidak kebingungan dalam
menyelesaikan proses pembayaran.
7. Riwayat pesan
Halaman ini memungkinkan pengguna melihat status dan riwayat transaksi mereka,
termasuk pesanan yang sedang dikirim maupun yang telah selesai. Fitur ini penting untuk
membangun transparansi dan kepercayaan pengguna terhadap layanan toko.
79
Gambar 3. 39 Riwayat Pesan
Tampilan riwayat pesanan menyajikan daftar pesanan dengan status yang
```
berbedabeda: menunggu pembayaran, diproses, dikirim, atau selesai. Warna dan ikon
```
digunakan untuk membedakan status dengan cepat. Desain ini memudahkan pengguna untuk
melakukan pelacakan tanpa harus menghubungi admin secara manual.
80
D. Realisasi Frontend: Ika Putri Wulandari
Gambar di bawah merupakan proses pembuatan halaman registrasi pengguna
menggunakan React. Formulir pendaftaran memungkinkan pengguna memasukkan nama,
email, password, serta konfirmasi password, dan menyetujui syarat & ketentuan sebelum
membuat akun. Sistem juga memvalidasi kecocokan password dan menampilkan pesan kesalahan
jika input tidak sesuai. Setelah berhasil, sistem akan menampilkan modal konfirmasi bahwa akun
telah dibuat dan mengarahkan pengguna ke halaman login. Tampilan dan kode program halaman
register dapat dilihat pada gambar 3.40 dan code 3.1
Code 3. 1 Register
81
Gambar 3. 40 Tampilan Register
Gambar di bawah merupakan proses pembuatan halaman login user yang
dikembangkan menggunakan React. Halaman ini memungkinkan pengguna memasukkan
email dan password untuk masuk ke sistem. Jika login berhasil, pengguna akan diarahkan ke
halaman dashboard. Selain itu, terdapat fitur tambahan seperti login dengan Google dan
navigasi ke halaman registrasi atau lupa password. Tampilan antarmuka login 3.41 serta
potongan kode dapat dilihat pada gambar 3.2.
82
Code 3. 2 Login
```
Gambar di bawah merupakan proses pembuatan halaman dashboard (home) untuk
```
pengguna. Halaman ini menampilkan informasi utama seputar toko Lestari ATK, seperti
promosi, testimoni, serta daftar produk populer yang diambil langsung dari API. Data produk
```
dikonsumsi dari backend menggunakan fetchAtkList() dan ditampilkan secara dinamis ke
```
Gambar 3. 41 Tampilan Login
83
dalam komponen antarmuka. Selain itu, terdapat tombol navigasi ke halaman katalog dan
promo. Tampilan antarmuka gambar 3.42 dan potongan kode 3.3 dashboard berikut.
Code 3. 3 Dashboard
84
Gambar di bawah merupakan proses pembuatan halaman katalog produk ATK yang
menampilkan daftar produk secara dinamis berdasarkan filter yang dipilih pengguna. Data
```
produk dan kategori diambil dari backend menggunakan method fetchAtkList() dan
```
```
fetchKategoriList(), serta ditampilkan dalam jumlah per halaman (pagination). Fitur tambahan
```
seperti pencarian, filter kategori, sortir berdasarkan harga atau nama, serta tombol "Tambah
ke Keranjang" juga telah diintegrasikan. Tampilan katalog pada gambar 3.43 serta potongan
kode program 3.4 dapat dilihat berikut.
Gambar 3. 42 Tampilan Dashboard
85
Code 3. 4 Katalog
Gambar 3. 43 Tampilan Katalog
86
Gambar di bawah merupakan proses pembuatan halaman keranjang yang
menampilkan daftar produk yang telah ditambahkan oleh pengguna. Sistem mengambil data
keranjang dari endpoint /keranjang dan memungkinkan
pengguna untuk menambah jumlah, mengurangi, atau menghapus item dari
keranjang secara langsung. Proses update dilakukan secara dinamis dan ditandai dengan
indikator loading per item. Selain itu, keranjang juga menghitung subtotal, total item, serta
total harga secara otomatis. Tampilan gambar 3.44 serta kode program 3.5 keranjang dapat
dilihat pada berikut.
Code 3. 5 Keranjang Belanja
87
Gambar 3. 44 Tampilan Keranjang Belanja
Gambar di bawah merupakan proses pembuatan halaman detail produk ATK. Halaman
ini menampilkan informasi lengkap satu produk berdasarkan slug, termasuk nama, deskripsi,
gambar, harga, status ketersediaan, dan jumlah yang dapat ditambahkan ke keranjang. Selain
itu, juga ditampilkan produk terkait dari kategori yang sama, dengan pengecualian produk
yang sedang dibuka. Fitur tombol “Tambah ke Keranjang” terintegrasi langsung dengan
backend dan memberikan umpan balik ke pengguna. Tampilan gambar 3.45 dan potongan
kode 3.6 halaman detail dapat dilihat sebagai berikut.
88
Code 3. 6 Detail Produk
Gambar di bawah merupakan proses pembuatan halaman checkout yang
memungkinkan pengguna mengisi data penerima, alamat pengiriman, nomor telepon, serta
memilih metode pembayaran. Data pengguna dan keranjang diambil dari endpoint /profile dan
/keranjang. Sistem juga menghitung subtotal, ongkir, dan total pembayaran secara otomatis.
Gambar 3. 45 Tampilan Detail Produk
89
Setelah formulir divalidasi, pengguna dapat menyelesaikan pesanan yang kemudian dikirim ke
endpoint /pesanan, dan sistem secara otomatis akan mengosongkan isi keranjang. Tampilan
gambar 3.46 serta potongan kode 3.7 checkout dapat dilihat pada berikut.
Gambar di bawah merupakan proses pembuatan halaman pembayaran yang
menampilkan detail pesanan dan memungkinkan pengguna mengunggah bukti pembayaran.
Code 3. 7 Check Out
Gambar 3. 46 Tampilan Check Out
90
```
Data pesanan diambil dari endpoint /pesanan/{id} dan ditampilkan secara lengkap, termasuk
```
metode pembayaran, status pesanan, jumlah item, total biaya, dan informasi rekening tujuan
transfer. Jika metode pembayaran menggunakan transfer bank dan status masih "pending",
maka fitur upload bukti akan aktif. Hasil unggahan dikirim ke endpoint
```
/pesanan/{id}/payment-proof. Tampilan serta potongan kode halaman
```
pembayaran dapat dilihat berikut.
91
Code 3. 8 Pembayaran
Gambar di bawah menunjukkan pembuatan halaman riwayat pesanan yang
menampilkan daftar seluruh pesanan pengguna. Sistem mengambil data dari endpoint
/pesanan, termasuk informasi status pesanan, total harga, metode pembayaran, dan jumlah
item. Data ditampilkan dalam bentuk tabel atau kartu, dilengkapi badge warna status dan
pagination. Pengguna juga bisa melihat detail setiap pesanan dengan memuat data dari
```
/pesanan/{id}. Tampilan dan potongan kode pesanan dapat dilihat berikut.
```
Gambar 3. 47 Tampilan Pembayaran dan Pengiriman
92
Code 3. 9 Riwayat Pemesanan
Gambar 3. 48 Tampilan Riwayat Pesan
93
Gambar di bawah merupakan proses pembuatan halaman profil pengguna, yang
menampilkan informasi akun seperti nama, email, nomor telepon, serta tanggal pembuatan
akun. Data profil diambil dari endpoint /profile dan ditampilkan dalam mode baca atau edit.
Pengguna dapat mengubah data dan menyimpannya kembali ke backend menggunakan
```
method updateProfile(). Fitur logout juga disediakan, yang menghapus token autentikasi dari
```
penyimpanan lokal. Tampilan dan potongan kode halaman profil dapat dilihat.
Code 3. 10 Halaman Profil
94
E. Realisasi Backend: Reynaldo Ahnaf
Gambar di bawah merupakan proses pembuatan dan implementasi API registrasi
pengguna menggunakan Laravel. Endpoint ini bertugas menerima data dari formulir frontend
seperti nama, email, dan password, lalu memvalidasinya sebelum menyimpan ke dalam basis data.
Sistem akan melakukan beberapa langkah penting:
1. Validasi Data
Laravel melakukan validasi terhadap field name, email, password, dan
confirmation_password. Password wajib memiliki minimal 8 karakter dan harus cocok dengan
konfirmasi password.
2. Enkripsi Password
Sebelum disimpan, password pengguna akan di-hash menggunakan algoritma bcrypt,
```
sehingga tidak tersimpan dalam bentuk teks biasa (plain text).
```
3. Penyimpanan Data
Setelah validasi berhasil, Laravel menyimpan data pengguna ke dalam tabel users pada
database lestari-atk2.
4. Response JSON
Backend memberikan response dalam bentuk JSON sebagai konfirmasi hasil registrasi. Jika
berhasil, akan mengembalikan pesan User registered successfully. Jika gagal, akan
```
menampilkan detail kesalahan (error validation).
```
95
Diatas merupakan file program backend pada laravel yang berfungsi sebagai file konfigurasi
utama dari berbagai aspek aplikasi, berikut merupakan penjelasan di setiap aspek file:
Tabel 3. 4 Penjelasan Isi File
Nama File Fungsi Utama
app.php Konfigurasi inti aplikasi: nama app, time zone,
locale, dan provider Laravel
Gambar 3. 49 File Program Backend
96
Nama File Fungsi Utama
```
auth.php Konfigurasi sistem autentifikasi(login, guard, provider
```
```
user)
```
```
cache.php Mengatur penyimpanan cache(file, database, redis,
```
```
dan lain lain)
```
cloudinary.php Konfigurasi penyimpanan gambar berbasis cloud
```
cors.php Mengatur cross-origin resource sharing(akses dari
```
```
domain luar)
```
```
database.php Konfigurasi koneksi database(MySQL, SQL Lite,
```
```
PostgreSQL)
```
filesystems.php Pengaturan file sistem: lokal, publik, amazon s3
jwt.php Konfigurasi JSON web token
logging.php Menentukan channel dan format log eror atau
aktivitas sistem
mail.php Konfigurasi pengiriman email via SMTP dan lain
sebagainya
```
queque.ph Mengatur job queue(proses latar belakang seperti
```
```
kirim email dan notifikasi)
```
service.php Konfigurasi API eksternal seperti login google
97
Nama File Fungsi Utama
```
session.php Mengatur session laravel(waktu aktif login)
```
Gambar di bawah menunjukkan struktur file pada folder app/Http/Controllers/Api yang
merupakan tempat diletakkannya seluruh controller khusus untuk API pada sisi backend proyek sistem
penjualan ATK Lestari. Setiap file controller memiliki peran tersendiri dalam menangani permintaan
```
(request) dari frontend ke server:
```
```
a) AuthController.php menangani proses autentikasi pengguna seperti login dan registrasi.
```
```
b) AtkController.php mengelola data produk alat tulis kantor (ATK) seperti melihat katalog
```
dan detail produk.
```
c) KeranjangController.php mengatur logika penambahan, penghapusan, dan pengelolaan isi
```
keranjana belanja pengguna.
```
d) PesananApiController.php bertanggung jawab atas proses pemesanan dan riwayat
```
transaksi.
```
e) PaymentProofController.php digunakan untuk mengelola upload bukti pembayaran oleh
```
pengguna.
```
f) UserProfileController.php memberikan fitur bagi pengguna untuk melihat dan
```
memperbarui informasi profil mereka.
Struktur ini mengikuti prinsip arsitektur RESTful API yang memisahkan tanggung jawab
berdasarkan sumber daya yang dikelola. Hal ini memudahkan proses debugging, pengembangan, dan
dokumentasi API backend secara modular dan terstruktur.
98
Gambar 3. 51 File API
Gambar di atas menunjukkan file StorePesananApiRequest.php yang digunakan sebagai form
request pada Laravel. File ini memuat aturan validasi input saat pengguna melakukan pemesanan
melalui API. Dengan memisahkan proses validasi dari controller, sistem menjadi lebih modular dan
mudah dirawat. File ini menjamin bahwa data pesanan yang masuk telah sesuai format dan ketentuan
yang telah ditetapkan sebelum disimpan ke dalam database.
Gambar 3. 50 Store Pesanan API Request
99
1. Fungsi StorePesananApiRequest.php
Secara umum, file ini:
```
a) Melakukan validasi otomatis atas data yang dikirim dari frontend saat proses
```
pemesanan.
```
b) Membantu menjaga integritas data dan menghindari input kosong, salah format,
```
atau tidak sesuai tipe.
```
c) Meningkatkan keamanan aplikasi dengan memisahkan logika validasi dari
```
controller.
Gambar 3. 52 Folder App/Http/Resources
Gambar di atas menampilkan isi folder app/Http/Resources pada proyek Laravel. Folder ini berisi
Resource Classes yang digunakan untuk mengatur bagaimana data dari model ditampilkan dalam
bentuk JSON, terutama untuk API.
100
2. Fungsi folder resource di Laravel
Laravel Resource digunakan untuk:
```
a) Mengubah output dari model (seperti User, Pesanan, dll) menjadi format JSON
```
yang rapi, aman, dan konsisten.
```
b) Memfilter atau menyesuaikan data sebelum dikirim ke frontend atau client API.
```
```
Memisahkan logika presentasi dari logika bisnis (clean code).
```
3. Penjelasan masing-masing file resource
Tabel 3. 5 File Recourses
AtkResource.php : Mengatur tampilan JSON dari data produk ATK, seperti
nama, harga, deskripsi, stok, gambar.
```
KategoriResource.php : Mengatur tampilan data kategori produk (misalnya: Pensil,
```
```
Buku, Kertas) yang ditampilkan ke client.
```
KeranjangItemResource.p
hp
Menyusun tampilan item keranjang belanja yang sedang
dimiliki oleh user.
PesananResource.php Menyusun respons data pesanan, seperti daftar item, total
harga, alamat, status pengiriman.
101
UserResource.php Mengatur format respons user, seperti ID, nama, email, role
```
(admin/pelanggan).
```
Gambar 3. 53 Database Sistem
Database lestari-atk2 menyimpan seluruh data penting dari aplikasi penjualan alat tulis kantor
secara online. Database ini terdiri dari beberapa tabel utama dan pendukung. Berikut penjelasan dari
masing-masing tabel:
```
a) ATK
```
Berisi daftar produk alat tulis kantor yang dijual. Kolom dalam tabel ini biasanya mencakup:
• Nama produk
• Deskripsi
• Harga
• Stok
• Gambar produk
```
b) Kategori_atk
```
102
Menyimpan data kategori produk, misalnya: "Buku", "Pulpen", "Kertas", dll. Digunakan
untuk mengelompokkan produk agar lebih mudah dicari oleh pengguna.
```
c) Item_pesan
```
Berisi detail produk yang dibeli dalam suatu transaksi. Ini adalah relasi antara pesanan dan
produk atk. Misalnya, satu pesanan bisa memiliki beberapa item pesanan dengan jumlah
berbeda.
```
d) Keranjang_items
```
Menyimpan data sementara mengenai produk yang dimasukkan pengguna ke dalam
keranjang belanja sebelum melakukan checkout.
```
e) Pesanan
```
Tabel utama untuk menyimpan informasi pemesanan oleh pengguna. Data di sini
```
mencakup:
```
• Nama pelanggan
• Alamat
• Total harga
• Tanggal pemesanan
```
• Status pemesanan (diproses, dikirim, selesai, dll.)
```
```
f) Users
```
Berisi data pengguna atau pelanggan yang memiliki akun, seperti:
• Nama
• Email
```
• Password (terenkripsi)
```
• Alamat
103
```
g) Roles dan role_users
```
Digunakan untuk sistem manajemen hak akses.
• roles: menyimpan jenis peran seperti "admin" atau "pelanggan".
• role_user: relasi antara user dan role-nya.
```
h) Migration
```
Bagian dari Laravel, berfungsi untuk mencatat versi skema tabel yang telah dibuat atau
diubah melalui fitur migrasi database.
```
i) Session
```
Digunakan Laravel untuk menyimpan data sesi pengguna, seperti informasi login yang
sedang aktif.
```
j) Cache, cache_locks
```
Tabel ini digunakan oleh sistem Laravel untuk keperluan penyimpanan sementara
```
(caching), agar aplikasi dapat berjalan lebih cepat.
```
5. Proses Deploy
Proses deploy backend aplikasi Penjualan ATK Lestari dilakukan menggunakan layanan
cloud deployment Railway.app. Platform ini dipilih karena kemudahan integrasinya dengan
GitHub dan dukungan penuh terhadap proyek berbasis Laravel dan PHP.
Tahapan deploy backend dimulai dengan mengunggah seluruh source code backend ke
repository GitHub dengan nama https://lestariputro-frontend-production.up.railway.app.
104
Setelah itu, Railway digunakan untuk menghubungkan repository tersebut melalui menu "New
Project" → GitHub Repo", lalu memilih repositori backend yang tersedia.
• Buka https://railway.app dan login menggunakan akun GitHub.
• Klik Create Project lalu pilih GitHub Repo sebagai metode deploy.
• Railway akan menampilkan opsi Add New Service → pilih GitHub Repo
Gambar 3. 54 Proses Deploy 1
Gambar 3. 55 Proses Deploy 2
105
• klik kanan di project untuk Add New Service, lalu tekan yang pilihan Github Repo lalu
klik Configure Github App dengan catatan : kenapa nama repository/project nya
"sweet-youthfulness" ? dikarenakan project dengan nama yang sama sudah tersedia.
Gambar 3. 57 Proses Deploy 3
Gambar 3. 56 Proses Deploy 4
106
Gambar 3. 58 Proses Deploy 6
```
a) Penjelasan Gambar 3.58
```
● Pilih, only select repositories
● setelah memilih repo yang akan di deploy klik Deploy
● setelah terdeploy, ke menu settings dan klik generate
domain, untuk mendapatkan public domain.
● setelah klik generate domain akan tersedia domain/ link
publik untuk bisa diakses serta portnya.
```
b) Pilih Branch dan Konfigurasi:
```
● Pilih branch main dari repo frontend.
● Railway akan mulai proses setup dan auto deployment.
```
c) Pengaturan Build dan Networking
```
• Railway secara otomatis mengatur:
o Build command: npm install && npm run build
```
o Output directory: dist (atau build tergantung framework)
```
• Domain public akan dibuat secara otomatis seperti: https://sweet-
youthfulness.up.railway.app.
Hasil Hosting : https://lestariputro-frontend-production.up.railway.app
Hasil Tampilan:
107
Gambar 3. 59 Hasil Tampilan Webstie
108
F. Realisasi Teaster: Fania Nabella
Pengujian dilakukan dengan menyebarkan kuesioner kepada responden melalui Google Form.
Kuesioner tersebut terdiri dari 12 pernyataan yang merepresentasikan aspek kemudahan penggunaan
```
(usability) berdasarkan pengalaman pengguna saat mengakses dan menggunakan sistem. Respon
```
diberikan dalam skala Likert 1–5, di mana 1 berarti sangat tidak setuju dan 5 berarti sangat setuju
```
(semakin tinggi nilai, semakin baik pengalaman
```
```
pengguna). Data dikumpulkan dari sejumlah responden yang telah mencoba website yang sudah
```
dihosting dengan gratis di tautan berikut:
```
https://lestariputro-frontend-production.up.railway.app.
```
109
Gambar 3. 60 Hasil Pengujian menggunakan SUS
Berdasarkan hasil rata-rata dari seluruh jawaban yang diperoleh, nilai usability website mencapai
skor rata-rata 3.87 dari 5, yang mengindikasikan bahwa sistem secara umum mudah digunakan dan
memberikan pengalaman yang baik kepada pengguna.
```
Beberapa komponen mendapat skor tinggi, seperti kemudahan akses login/register (4.60), desain
```
```
tampilan yang menarik (4.52), dan kecepatan navigasi antar halaman (4.40). Sementara itu, skor yang
```
lebih rendah terlihat pada aspek tombol “Beli” dan akses dari perangkat mobile, dengan nilai sekitar
2.3 hingga 2.6, yang menunjukkan perlunya perbaikan di sisi tampilan responsif dan user flow
transaksi.
110
- Rekomendasi
Berdasarkan analisis ini, beberapa saran pengembangan sistem di antaranya:
• Perjelas tombol aksi utama seperti "Beli" dan "Checkout"
• Optimalkan tampilan di perangkat mobile agar tidak ada elemen yang sulit diklik
• Tambahkan notifikasi transaksional atau konfirmasi visual yang lebih jelas
• Lakukan uji lanjut dengan pendekatan skala UEQ atau SUS untuk validasi lanjutan
G. Realisasi Sekertaris: Daffa Khoirul Maulana
1. Analisis Kebutuhan dan Kelayakan
• Dokumen analisis kelayakan teknis, operasional, ekonomi, dan waktu.
• Pemetaan kebutuhan klien dan pelanggan.
2. Desain UI/UX
• Wireframe dan prototype yang dikembangkan melalui Figma.
• Desain responsif dan ramah pengguna untuk halaman utama, katalog, checkout, dan
halaman admin.
3. Pengembangan Website
• Frontend dibangun menggunakan HTML, CSS, dan JavaScript.
111
• Backend dikembangkan untuk fitur produk, transaksi, dan manajemen pesanan.
• Sistemlogin admin dan pengguna berhasil diimplementasikan.
4. Integrasi Sistem
• Integrasi dengan metode pembayaran digital berhasil diuji secara lokal.
• Fitur filter produk, pencarian, dan checkout dinyatakan berjalan baik.
5. Pengujian
• Uji fungsional, uji kompatibilitas perangkat, dan debugging selesai dilakukan.
• Bug minor diperbaiki sebelum peluncuran.
6. Peluncuran dan Dokumentasi
• Website resmi diluncurkan pada 4 Juni 2025 dengan domain publik.
• Panduan penggunaan diserahkan kepada mitra, disertai dokumentasi teknis.
7. Penjaminan Kualitas Proyek
Penjaminan kualitas dilakukan melalui:
```
• Uji Coba Pengguna (User Acceptance Test) Melibatkan pemilik toko (Bu Atik) dan
```
beberapa pelanggan sebagai pengguna awal. Feedback mencakup kemudahan
navigasi dan responsivitas tampilan di perangkat mobile.
112
```
• Validasi Mitra (Stakeholder Validation) Fitur yang dikembangkan telah divalidasi
```
```
oleh mitra utama proyek (Atik Purwandari). Mitra menyatakan sistem sesuai
```
harapan dan memudahkan proses operasional took.
• Dokumentasi Teknis dan User Manual Disediakan untuk menjamin kelangsungan
penggunaan dan pemeliharaan website secara mandiri oleh pihak mitra.
8. Keberlanjutan Proyek
Agar proyek dapat terus memberikan manfaat jangka panjang, dilakukan beberapa upaya
```
keberlanjutan:
```
```
a) Pemeliharaan Sistem
```
• Pemilik toko diberikan pelatihan singkat untuk mengelola konten website
```
(produk, stok, transaksi).
```
• Disepakati adanya monitoring berkala selama 3 bulan pasca peluncuran oleh
tim proyek.
```
b) Potensi Pengembangan Lanjutan
```
• Rencana pengembangan fitur loyalty program dan sistem laporan penjualan
otomatis.
• Menyediakan layanan pemeliharaan berbayar jika diperlukan di masa
mendatang.
```
c) Dokumentasi Lengkap
```
• Semua source code disimpan diGitHub.
113
• Hosting dan domain dikelola atas nama pemilik toko, memastikan
keberlangsungan akses.
114
BAB IV
PENUTUP
4.1 Kesimpulan
Proyek pembangunan website Toko Lestari Putro telah berhasil dilaksanakan sesuai dengan
rencana yang telah disusun dalam proposal awal. Proyek ini bertujuan untuk memberikan solusi
digital dalam pengelolaan penjualan alat tulis kantor, dengan menghadirkan platform ecommerce
yang responsif, mudah digunakan, dan mendukung operasional toko secara efisien.
Seluruh tahapan proyek, mulai dari analisis kebutuhan, desain UI/UX, pengembangan sistem,
hingga pengujian dan peluncuran, telah diselesaikan dengan baik sesuai jadwal. Hasil akhir berupa
```
website aktif yang telah divalidasi oleh stakeholder utama (pemilik toko) membuktikan bahwa proyek
```
ini layak secara teknis, operasional, dan ekonomis.
Dengan adanya sistem digital ini, toko Lestari Putro kini memiliki sarana promosi dan
transaksi yang lebih luas, memudahkan pelanggan dalam berbelanja, serta membantu pihak toko
dalam mengelola produk dan pesanan secara terintegrasi.
4.2.Saran
```
1) Pemeliharaan Berkala
```
```
Pemilik toko disarankan untuk melakukan pemeliharaan berkala, baik dari sisi konten (produk,
```
```
harga, deskripsi) maupun teknis (update keamanan, backup data), agar sistem tetap optimal
```
digunakan.
```
2) Pengembangan Lanjutan
```
115
Fitur lanjutan seperti laporan penjualan otomatis, notifikasi pesanan, dan integrasi dengan media
sosial dapat dikembangkan pada tahap berikutnya untuk meningkatkan fungsionalitas dan
engagement pengguna.
```
3) Pelatihan Admin
```
Disarankan untuk mengadakan pelatihan lanjutan bagi pegawai toko dalam menggunakan sistem,
khususnya untuk pengelolaan pesanan, agar operasional berjalan lebih efisien.
```
4) Evaluasi Pengguna
```
Pengumpulan umpan balik dari pelanggan secara rutin penting untuk mengetahui kelebihan dan
kekurangan sistem, yang nantinya dapat dijadikan dasar dalam peningkatan kualitas layanan.
116
DAFTAR PUSTAKA
H. Bandara and C. R. Oruthotaarachchi, “Impact of Cloud-Based Enterprise Systems on Enhancing
Business Model Performance in Retail SMEs,” in 2025 5th International Conference on
```
Advanced Research in Computing (ICARC),
```
IEEE, 2025, pp. 1–6.
K. Matekaire and R. Siriram, “An overview of factors influencing the adoption of IoT payment systems
in South Africa’s small and medium-sized retail enterprises,” Sep. 01, 2025, Elsevier B.V. doi:
10.1016/j.joitmc.2025.100566.
E. Astuty, I. D. Sudirman, and R. Aryanto, “The Trigger Chain of Digitalization and Sustainability,” in
2024 3rd International Conference on Creative Communication and Innovative Technology
```
(ICCIT), IEEE, 2024, pp. 1–6.
```
K. Desai, N. Ramachandran, and M. S, “The Rise of FinTech in India’s Financial Ecosystem,” in Trends
and Challenges of Electronic Finance: Perspectives from Emerging Markets, Springer, 2025,
pp. 217–234.
C. Genç and D. Ulaş, “A Qualitative Research on the Market Entry Strategies of Techno-Enterprises’
Using Digital Transformation Technologies,” in The
International Symposium for Production Research, Springer, 2024, pp. 239– 258.
117
LAMPIRAN
1. MOU
Lampiran 1 MOU
118
2. Pembayaran dari Mitra
Lampiran 2 Tansaksi Pembayarn Mitra