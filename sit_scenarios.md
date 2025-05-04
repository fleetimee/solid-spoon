# Skenario Pengujian Integrasi Sistem (SIT)

## Skenario Positif

| ID      | Peran    | Fitur               | Deskripsi Kasus Uji                                                   | Hasil yang Diharapkan                                      | Jenis Pengujian |
| ------- | -------- | ------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------- | --------------- |
| SIT-001 | Pengguna | Autentikasi         | Login dengan kredensial valid                                         | Pengguna berhasil masuk dan diarahkan ke dasbor            | Positif         |
| SIT-003 | Pengguna | Pencarian Ruangan   | Mencari ruangan dengan beberapa filter (kapasitas, lokasi, fasilitas) | Sistem menampilkan hasil yang sesuai dengan semua kriteria | Positif         |
| SIT-005 | Pengguna | Pemesanan Ruangan   | Memesan ruangan tersedia dengan slot waktu valid                      | Sistem membuat reservasi dan mengirim untuk persetujuan    | Positif         |
| SIT-007 | Pengguna | Notifikasi          | Melihat notifikasi ketika reservasi disetujui                         | Pengguna menerima dan dapat melihat notifikasi persetujuan | Positif         |
| SIT-008 | Pengguna | Profil              | Memperbarui profil pengguna dengan informasi valid                    | Profil berhasil diperbarui                                 | Positif         |
| SIT-009 | Admin    | Manajemen Pengguna  | Membuat akun pengguna baru dengan detail valid                        | Akun pengguna berhasil dibuat                              | Positif         |
| SIT-011 | Admin    | Manajemen Ruangan   | Menambah ruangan baru dengan detail dan gambar lengkap                | Ruangan dibuat dan muncul dalam daftar ruangan             | Positif         |
| SIT-012 | Admin    | Manajemen Ruangan   | Memperbarui fasilitas dan ketersediaan ruangan                        | Detail ruangan berhasil diperbarui                         | Positif         |
| SIT-013 | Admin    | Manajemen Reservasi | Menyetujui reservasi ruangan yang tertunda                            | Status reservasi diperbarui dan pengguna diberitahu        | Positif         |
| SIT-014 | Admin    | Manajemen Reservasi | Menolak reservasi dengan alasan penolakan                             | Reservasi ditolak dan pengguna menerima notifikasi         | Positif         |
| SIT-015 | Admin    | Dasbor              | Melihat tren dan statistik reservasi                                  | Dasbor menampilkan data analitik yang akurat               | Positif         |
| SIT-017 | Admin    | Pengaturan Sistem   | Memperbarui batas waktu reservasi                                     | Batas waktu baru diterapkan untuk pemesanan mendatang      | Positif         |
| SIT-018 | Pengguna | Notifikasi          | Menandai beberapa notifikasi sebagai telah dibaca                     | Status notifikasi diperbarui dengan benar                  | Positif         |
| SIT-021 | Pengguna | Notifikasi Email    | Menerima email ketika reservasi disetujui                             | Email pemberitahuan persetujuan diterima dengan benar      | Positif         |
| SIT-022 | Pengguna | Notifikasi Email    | Menerima email ketika reservasi ditolak                               | Email pemberitahuan penolakan diterima dengan benar        | Positif         |
| SIT-023 | Pengguna | Lupa Password       | Mengirim permintaan reset password dengan email terdaftar             | Email instruksi reset password diterima                    | Positif         |
| SIT-025 | Pengguna | Reset Password      | Mengatur ulang password dengan token valid                            | Password berhasil diperbarui dan dapat login               | Positif         |

## Skenario Negatif

| ID      | Peran    | Fitur              | Deskripsi Kasus Uji                                             | Hasil yang Diharapkan                                     | Jenis Pengujian |
| ------- | -------- | ------------------ | --------------------------------------------------------------- | --------------------------------------------------------- | --------------- |
| SIT-002 | Pengguna | Autentikasi        | Login dengan kredensial tidak valid                             | Sistem menampilkan pesan kesalahan dan mencegah login     | Negatif         |
| SIT-004 | Pengguna | Pencarian Ruangan  | Mencari dengan rentang kapasitas tidak valid (maks < min)       | Sistem menampilkan pesan validasi kesalahan               | Negatif         |
| SIT-006 | Pengguna | Pemesanan Ruangan  | Mencoba memesan slot waktu yang sudah direservasi               | Sistem mencegah pemesanan dan menampilkan pesan konflik   | Negatif         |
| SIT-010 | Admin    | Manajemen Pengguna | Membuat pengguna dengan email duplikat                          | Sistem menampilkan kesalahan tentang email yang sudah ada | Negatif         |
| SIT-016 | Pengguna | Pemesanan Ruangan  | Memesan ruangan melebihi batas waktu yang diizinkan             | Sistem menampilkan kesalahan tentang melebihi batas waktu | Negatif         |
| SIT-019 | Admin    | Manajemen Ruangan  | Menghapus ruangan dengan reservasi masa depan yang ada          | Sistem mencegah penghapusan dan menampilkan peringatan    | Negatif         |
| SIT-020 | Pengguna | Pemesanan Ruangan  | Mengirim pemesanan dengan field wajib yang kosong               | Sistem menampilkan kesalahan validasi untuk field wajib   | Negatif         |
| SIT-024 | Pengguna | Lupa Password      | Mengirim permintaan reset password dengan email tidak terdaftar | Sistem menampilkan pesan email tidak ditemukan            | Negatif         |
| SIT-026 | Pengguna | Reset Password     | Mengatur ulang password dengan token kadaluarsa                 | Sistem menampilkan pesan token tidak valid                | Negatif         |
