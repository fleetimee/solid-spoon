import { ContentData, ContentType } from "../types/content";

export const contentData: Record<ContentType, ContentData> = {
  "syarat-dan-ketentuan": {
    title: "Syarat dan Ketentuan Layanan",
    description:
      "Syarat dan ketentuan penggunaan sistem reservasi ruangan CapstoneD.",
    lastUpdated: "15 Juni 2025",
    content: [
      {
        type: "heading",
        level: 2,
        content: "1. Penerimaan Syarat",
      },
      {
        type: "paragraph",
        content:
          "Dengan mengakses dan menggunakan sistem reservasi ruangan CapstoneD, Anda menyetujui untuk terikat oleh syarat dan ketentuan yang tercantum dalam dokumen ini. Jika Anda tidak menyetujui syarat-syarat ini, mohon untuk tidak menggunakan layanan kami.",
      },
      {
        type: "heading",
        level: 2,
        content: "2. Definisi Layanan",
      },
      {
        type: "paragraph",
        content:
          "CapstoneD adalah platform digital yang menyediakan layanan reservasi ruangan untuk keperluan rapat, acara, dan kegiatan lainnya. Layanan ini meliputi pencarian ruangan, pemesanan, pembayaran, dan manajemen reservasi.",
      },
      {
        type: "heading",
        level: 2,
        content: "3. Pendaftaran dan Akun Pengguna",
      },
      {
        type: "list",
        content: [
          "Pengguna harus mendaftar dengan informasi yang akurat dan lengkap",
          "Setiap pengguna bertanggung jawab untuk menjaga kerahasiaan akun dan kata sandi",
          "Pengguna harus segera melaporkan jika terjadi penggunaan tidak sah pada akun mereka",
          "CapstoneD berhak menangguhkan atau menghapus akun yang melanggar ketentuan",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "4. Aturan Reservasi",
      },
      {
        type: "list",
        content: [
          "Reservasi harus dilakukan minimal 2 jam sebelum waktu penggunaan",
          "Pembatalan reservasi gratis dapat dilakukan hingga 1 jam sebelum waktu mulai",
          "Keterlambatan lebih dari 15 menit dapat mengakibatkan pembatalan otomatis",
          "Pengguna bertanggung jawab atas kondisi ruangan selama masa penggunaan",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "5. Pembayaran dan Pengembalian Dana",
      },
      {
        type: "paragraph",
        content:
          "Pembayaran harus dilakukan sesuai dengan tarif yang tercantum. Pengembalian dana untuk pembatalan akan diproses sesuai dengan kebijakan pembatalan yang berlaku. CapstoneD tidak bertanggung jawab atas biaya tambahan yang timbul dari pihak ketiga.",
      },
      {
        type: "heading",
        level: 2,
        content: "6. Tanggung Jawab Pengguna",
      },
      {
        type: "list",
        content: [
          "Menggunakan ruangan sesuai dengan tujuan yang dinyatakan saat reservasi",
          "Menjaga kebersihan dan kondisi ruangan",
          "Mematuhi kapasitas maksimum ruangan",
          "Tidak melakukan kegiatan yang melanggar hukum atau mengganggu pengguna lain",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "7. Batasan Tanggung Jawab CapstoneD",
      },
      {
        type: "paragraph",
        content:
          "CapstoneD tidak bertanggung jawab atas kerugian langsung maupun tidak langsung yang timbul dari penggunaan layanan, termasuk namun tidak terbatas pada kehilangan data, kerusakan perangkat, atau gangguan bisnis.",
      },
      {
        type: "heading",
        level: 2,
        content: "8. Perubahan Syarat dan Ketentuan",
      },
      {
        type: "paragraph",
        content:
          "CapstoneD berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diberitahukan kepada pengguna melalui platform atau email. Penggunaan layanan setelah perubahan dianggap sebagai persetujuan atas syarat yang baru.",
      },
    ],
  },

  "kebijakan-privasi": {
    title: "Kebijakan Privasi",
    description: "Kebijakan privasi dan perlindungan data pengguna CapstoneD.",
    lastUpdated: "15 Juni 2025",
    content: [
      {
        type: "heading",
        level: 2,
        content: "1. Informasi yang Kami Kumpulkan",
      },
      {
        type: "paragraph",
        content:
          "Kami mengumpulkan informasi yang Anda berikan secara langsung, informasi yang dikumpulkan secara otomatis saat Anda menggunakan layanan, dan informasi dari pihak ketiga yang sah.",
      },
      {
        type: "heading",
        level: 3,
        content: "Informasi Personal",
      },
      {
        type: "list",
        content: [
          "Nama lengkap dan informasi kontak",
          "Alamat email dan nomor telepon",
          "Informasi pembayaran (dienkripsi)",
          "Preferensi ruangan dan riwayat reservasi",
        ],
      },
      {
        type: "heading",
        level: 3,
        content: "Informasi Teknis",
      },
      {
        type: "list",
        content: [
          "Alamat IP dan informasi perangkat",
          "Data log aktivitas pengguna",
          "Cookie dan teknologi pelacakan serupa",
          "Informasi lokasi (jika diizinkan)",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "2. Penggunaan Informasi",
      },
      {
        type: "paragraph",
        content:
          "Informasi yang dikumpulkan digunakan untuk menyediakan, memelihara, dan meningkatkan layanan kami, memproses transaksi, berkomunikasi dengan pengguna, dan memastikan keamanan platform.",
      },
      {
        type: "heading",
        level: 2,
        content: "3. Berbagi Informasi",
      },
      {
        type: "paragraph",
        content:
          "Kami tidak menjual, menyewakan, atau membagikan informasi personal kepada pihak ketiga tanpa persetujuan Anda, kecuali dalam situasi tertentu seperti kepatuhan hukum, perlindungan keamanan, atau dengan penyedia layanan tepercaya.",
      },
      {
        type: "heading",
        level: 2,
        content: "4. Keamanan Data",
      },
      {
        type: "list",
        content: [
          "Enkripsi data sensitif menggunakan standar industri",
          "Autentikasi multi-faktor untuk akses admin",
          "Pemantauan keamanan 24/7",
          "Backup data reguler dan pemulihan bencana",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "5. Hak Pengguna",
      },
      {
        type: "list",
        content: [
          "Mengakses dan memperbarui informasi personal",
          "Menghapus akun dan data terkait",
          "Membatasi pemrosesan data tertentu",
          "Memperoleh salinan data dalam format yang dapat dibaca",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "6. Retensi Data",
      },
      {
        type: "paragraph",
        content:
          "Data personal akan disimpan selama diperlukan untuk menyediakan layanan atau sesuai dengan persyaratan hukum. Data yang tidak lagi diperlukan akan dihapus secara aman.",
      },
    ],
  },

  "kebijakan-cookie": {
    title: "Kebijakan Cookie",
    description:
      "Informasi tentang penggunaan cookie dan teknologi pelacakan di CapstoneD.",
    lastUpdated: "15 Juni 2025",
    content: [
      {
        type: "heading",
        level: 2,
        content: "1. Apa itu Cookie?",
      },
      {
        type: "paragraph",
        content:
          "Cookie adalah file teks kecil yang disimpan di perangkat Anda saat mengunjungi website. Cookie membantu website mengingat preferensi Anda dan memberikan pengalaman yang lebih personal.",
      },
      {
        type: "heading",
        level: 2,
        content: "2. Jenis Cookie yang Kami Gunakan",
      },
      {
        type: "heading",
        level: 3,
        content: "Cookie Penting",
      },
      {
        type: "paragraph",
        content:
          "Cookie yang diperlukan untuk fungsi dasar website, termasuk autentikasi pengguna, keamanan, dan navegasi.",
      },
      {
        type: "heading",
        level: 3,
        content: "Cookie Fungsional",
      },
      {
        type: "paragraph",
        content:
          "Cookie yang mengingat pilihan Anda seperti bahasa, tema, dan preferensi tampilan untuk meningkatkan pengalaman pengguna.",
      },
      {
        type: "heading",
        level: 3,
        content: "Cookie Analitik",
      },
      {
        type: "paragraph",
        content:
          "Cookie yang membantu kami memahami bagaimana pengguna berinteraksi dengan website untuk meningkatkan layanan.",
      },
      {
        type: "heading",
        level: 2,
        content: "3. Cookie Pihak Ketiga",
      },
      {
        type: "list",
        content: [
          "Google Analytics untuk analisis penggunaan website",
          "Payment gateway untuk pemrosesan pembayaran",
          "Social media plugins untuk berbagi konten",
          "Live chat untuk dukungan pelanggan",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "4. Mengelola Cookie",
      },
      {
        type: "paragraph",
        content:
          "Anda dapat mengontrol penggunaan cookie melalui pengaturan browser atau panel preferensi cookie di website kami. Namun, menonaktifkan cookie tertentu dapat mempengaruhi fungsi website.",
      },
      {
        type: "heading",
        level: 2,
        content: "5. Local Storage dan Session Storage",
      },
      {
        type: "paragraph",
        content:
          "Selain cookie, kami juga menggunakan local storage dan session storage untuk menyimpan data sementara yang diperlukan untuk fungsi aplikasi.",
      },
    ],
  },

  keamanan: {
    title: "Keamanan",
    description:
      "Informasi tentang langkah-langkah keamanan dan perlindungan data di CapstoneD.",
    lastUpdated: "15 Juni 2025",
    content: [
      {
        type: "heading",
        level: 2,
        content: "1. Komitmen Keamanan",
      },
      {
        type: "paragraph",
        content:
          "CapstoneD berkomitmen untuk melindungi data dan privasi pengguna melalui implementasi standar keamanan terbaik di industri. Keamanan adalah prioritas utama dalam setiap aspek layanan kami.",
      },
      {
        type: "heading",
        level: 2,
        content: "2. Enkripsi Data",
      },
      {
        type: "list",
        content: [
          "SSL/TLS encryption untuk semua transmisi data",
          "Enkripsi AES-256 untuk data sensitif",
          "Hashing bcrypt untuk password pengguna",
          "Enkripsi end-to-end untuk komunikasi penting",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "3. Autentikasi dan Otorisasi",
      },
      {
        type: "list",
        content: [
          "Sistem autentikasi multi-faktor (MFA)",
          "Token-based authentication dengan expiry",
          "Role-based access control (RBAC)",
          "Session management yang aman",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "4. Monitoring dan Deteksi",
      },
      {
        type: "list",
        content: [
          "Pemantauan keamanan real-time 24/7",
          "Sistem deteksi intrusi otomatis",
          "Log audit komprehensif",
          "Alert system untuk aktivitas mencurigakan",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "5. Backup dan Pemulihan",
      },
      {
        type: "list",
        content: [
          "Backup data otomatis harian",
          "Replikasi data geografis",
          "Disaster recovery plan yang teruji",
          "RTO (Recovery Time Objective) kurang dari 4 jam",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "6. Kepatuhan dan Standar",
      },
      {
        type: "list",
        content: [
          "Mematuhi standar ISO 27001",
          "Regulasi perlindungan data personal",
          "PCI DSS untuk pemrosesan pembayaran",
          "Audit keamanan berkala oleh pihak ketiga",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "7. Melaporkan Kerentanan",
      },
      {
        type: "paragraph",
        content:
          "Jika Anda menemukan kerentanan keamanan, mohon laporkan kepada tim keamanan kami melalui email security@capstoned.com. Kami akan merespons dalam 24 jam dan memberikan kredit untuk pelaporan yang bertanggung jawab.",
      },
      {
        type: "heading",
        level: 2,
        content: "8. Tips Keamanan untuk Pengguna",
      },
      {
        type: "list",
        content: [
          "Gunakan password yang kuat dan unik",
          "Aktifkan autentikasi dua faktor",
          "Jangan bagikan informasi login Anda",
          "Logout dari akun setelah selesai menggunakan",
          "Perbarui informasi kontak untuk notifikasi keamanan",
        ],
      },
    ],
  },

  "hubungi-kami": {
    title: "Hubungi Kami",
    description: "Informasi kontak dan cara menghubungi tim CapstoneD.",
    lastUpdated: "15 Juni 2025",
    content: [
      {
        type: "heading",
        level: 2,
        content: "Informasi Kontak",
      },
      {
        type: "contact-info",
        content: {
          email: "support@capstoned.com",
          phone: "+62 21 1234 5678",
          address: "Jl. Teknologi No. 123, Jakarta Selatan 12345, Indonesia",
          operatingHours: "Senin - Jumat: 09:00 - 18:00 WIB",
        },
      },
      {
        type: "heading",
        level: 2,
        content: "Tim Dukungan",
      },
      {
        type: "paragraph",
        content:
          "Tim dukungan pelanggan kami siap membantu Anda dengan pertanyaan, masalah teknis, atau feedback tentang layanan CapstoneD. Kami berkomitmen untuk memberikan respons yang cepat dan solusi yang efektif.",
      },
      {
        type: "heading",
        level: 2,
        content: "Jenis Dukungan",
      },
      {
        type: "list",
        content: [
          "Bantuan teknis dan troubleshooting",
          "Panduan penggunaan platform",
          "Masalah pembayaran dan billing",
          "Feedback dan saran perbaikan",
          "Laporan bug atau kerentanan keamanan",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "Waktu Respons",
      },
      {
        type: "list",
        content: [
          "Email: Maksimal 24 jam pada hari kerja",
          "Telepon: Langsung selama jam operasional",
          "Masalah kritis: Respons dalam 2 jam",
          "Live chat: Tersedia 24/7 untuk pertanyaan umum",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "Media Sosial",
      },
      {
        type: "paragraph",
        content:
          "Ikuti kami di media sosial untuk mendapatkan update terbaru, tips penggunaan, dan informasi penting lainnya:",
      },
      {
        type: "list",
        content: [
          "Twitter: @CapstoneD_ID",
          "LinkedIn: CapstoneD Indonesia",
          "Instagram: @capstoned.id",
          "Facebook: CapstoneD Room Reservation",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "Kantor Pusat",
      },
      {
        type: "paragraph",
        content:
          "Kunjungi kantor pusat kami untuk pertemuan langsung atau konsultasi bisnis. Mohon buat janji terlebih dahulu melalui email atau telepon.",
      },
    ],
  },
};
