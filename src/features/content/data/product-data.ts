import { ContentData, ProductContentType } from "../types/content";

export const productContentData: Record<ProductContentType, ContentData> = {
  tentang: {
    title: "Tentang CapstoneD - Sistem Reservasi Ruangan",
    description:
      "Pelajari lebih lanjut tentang CapstoneD, solusi modern untuk manajemen reservasi ruangan yang efisien dan mudah digunakan.",
    lastUpdated: "15 Juni 2025",
    content: [
      {
        type: "heading",
        level: 2,
        content: "Apa itu CapstoneD?",
      },
      {
        type: "paragraph",
        content:
          "CapstoneD adalah platform reservasi ruangan yang dirancang khusus untuk memudahkan proses pemesanan dan manajemen ruangan di berbagai organisasi. Dengan antarmuka yang intuitif dan fitur-fitur canggih, kami membantu Anda mengelola ruang kerja dengan lebih efisien.",
      },
      {
        type: "heading",
        level: 2,
        content: "Visi Kami",
      },
      {
        type: "paragraph",
        content:
          "Menjadi solusi terdepan dalam digitalisasi manajemen ruangan di Indonesia, mendukung transformasi digital organisasi menuju workplace yang lebih smart dan efisien.",
      },
      {
        type: "heading",
        level: 2,
        content: "Misi Kami",
      },
      {
        type: "list",
        content: [
          "Menyediakan platform reservasi ruangan yang mudah digunakan dan dapat diandalkan",
          "Meningkatkan efisiensi penggunaan ruang kerja melalui teknologi modern",
          "Memberikan pengalaman pengguna terbaik dalam manajemen fasilitas",
          "Mendukung produktivitas organisasi dengan solusi yang inovatif",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "Mengapa Memilih CapstoneD?",
      },
      {
        type: "list",
        content: [
          "Interface yang user-friendly dan mudah dipahami",
          "Sistem notifikasi real-time untuk update reservasi",
          "Integrasi calendar yang seamless",
          "Dashboard analytics untuk monitoring penggunaan ruangan",
          "Support 24/7 dari tim ahli kami",
          "Keamanan data tingkat enterprise",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "Teknologi yang Kami Gunakan",
      },
      {
        type: "paragraph",
        content:
          "CapstoneD dibangun dengan teknologi modern dan terkini, menggunakan Next.js untuk frontend yang responsif, PostgreSQL untuk database yang reliable, dan cloud infrastructure yang scalable untuk memastikan performa optimal.",
      },
      {
        type: "heading",
        level: 2,
        content: "Tim Kami",
      },
      {
        type: "paragraph",
        content:
          "Tim CapstoneD terdiri dari para profesional berpengalaman di bidang teknologi, UX/UI design, dan manajemen fasilitas. Kami berkomitmen untuk terus berinovasi dan memberikan solusi terbaik bagi kebutuhan reservasi ruangan Anda.",
      },
    ],
  },

  fitur: {
    title: "Fitur-Fitur CapstoneD",
    description:
      "Jelajahi berbagai fitur canggih CapstoneD yang dirancang untuk memudahkan proses reservasi dan manajemen ruangan Anda.",
    lastUpdated: "15 Juni 2025",
    content: [
      {
        type: "heading",
        level: 2,
        content: "Fitur Utama",
      },
      {
        type: "heading",
        level: 3,
        content: "🏢 Manajemen Ruangan Komprehensif",
      },
      {
        type: "list",
        content: [
          "Database ruangan lengkap dengan foto dan spesifikasi detail",
          "Kategorisasi ruangan berdasarkan kapasitas dan fasilitas",
          "Status real-time ketersediaan ruangan",
          "Informasi fasilitas dan amenitas setiap ruangan",
        ],
      },
      {
        type: "heading",
        level: 3,
        content: "📅 Sistem Reservasi Intelligent",
      },
      {
        type: "list",
        content: [
          "Booking ruangan dengan tampilan kalender interaktif",
          "Pencarian ruangan berdasarkan kriteria spesifik",
          "Sistem konfirmasi otomatis dan manual",
          "Recurring booking untuk meeting reguler",
          "Conflict detection untuk mencegah double booking",
        ],
      },
      {
        type: "heading",
        level: 3,
        content: "🔔 Notifikasi & Reminder",
      },
      {
        type: "list",
        content: [
          "Notifikasi email otomatis untuk konfirmasi booking",
          "Reminder meeting via email dan in-app notification",
          "Alert perubahan status reservasi",
          "Notifikasi pembatalan dan rescheduling",
        ],
      },
      {
        type: "heading",
        level: 3,
        content: "📊 Dashboard & Analytics",
      },
      {
        type: "list",
        content: [
          "Dashboard admin dengan overview penggunaan ruangan",
          "Laporan analytics usage patterns",
          "Statistik booking rate dan occupancy",
          "Export data reservasi dalam berbagai format",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "Fitur untuk Pengguna",
      },
      {
        type: "list",
        content: [
          "Profile management dengan riwayat booking",
          "Quick booking untuk reservasi cepat",
          "Mobile-responsive design untuk akses di mana saja",
          "Integration dengan Google Calendar dan Outlook",
          "Favorite rooms untuk akses mudah",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "Fitur untuk Administrator",
      },
      {
        type: "list",
        content: [
          "User management dan role-based access control",
          "Room configuration dan maintenance scheduling",
          "Approval workflow untuk booking tertentu",
          "Bulk operations untuk manajemen efisien",
          "Audit trail untuk tracking semua aktivitas",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "Keamanan & Compliance",
      },
      {
        type: "list",
        content: [
          "SSL encryption untuk semua data transmission",
          "Two-factor authentication (2FA)",
          "Regular security updates dan patches",
          "GDPR compliance untuk data protection",
          "Backup otomatis dan disaster recovery",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "Integrasi & API",
      },
      {
        type: "list",
        content: [
          "REST API untuk integrasi dengan sistem existing",
          "Webhook support untuk real-time updates",
          "SSO integration dengan Active Directory",
          "Third-party calendar synchronization",
          "Payment gateway integration",
        ],
      },
    ],
  },

  "cara-kerja": {
    title: "Cara Kerja CapstoneD",
    description:
      "Panduan lengkap tentang cara menggunakan sistem reservasi ruangan CapstoneD, dari registrasi hingga manajemen booking.",
    lastUpdated: "15 Juni 2025",
    content: [
      {
        type: "heading",
        level: 2,
        content: "Langkah 1: Registrasi & Setup Akun",
      },
      {
        type: "list",
        content: [
          "Daftar akun baru dengan email dan informasi dasar",
          "Verifikasi email untuk aktivasi akun",
          "Lengkapi profil dengan informasi organisasi",
          "Setup preferensi notifikasi dan timezone",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "Langkah 2: Eksplorasi Ruangan",
      },
      {
        type: "list",
        content: [
          "Browse katalog ruangan yang tersedia",
          "Gunakan filter untuk mencari ruangan sesuai kebutuhan",
          "Lihat foto, fasilitas, dan spesifikasi ruangan",
          "Check availability pada tanggal yang diinginkan",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "Langkah 3: Membuat Reservasi",
      },
      {
        type: "list",
        content: [
          "Pilih ruangan dan tanggal yang diinginkan",
          "Tentukan waktu mulai dan selesai meeting",
          "Isi detail reservasi seperti agenda dan peserta",
          "Review dan submit booking request",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "Langkah 4: Konfirmasi & Pembayaran",
      },
      {
        type: "list",
        content: [
          "Tunggu konfirmasi dari admin (jika diperlukan)",
          "Terima notifikasi status reservasi via email",
          "Lakukan pembayaran jika ada biaya sewa",
          "Download booking confirmation sebagai bukti",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "Langkah 5: Manajemen Reservasi",
      },
      {
        type: "list",
        content: [
          "Monitor status reservasi di dashboard",
          "Edit atau cancel reservasi jika diperlukan",
          "Invite peserta meeting dengan link sharing",
          "Set reminder untuk meeting yang akan datang",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "Tips & Best Practices",
      },
      {
        type: "list",
        content: [
          "Book ruangan minimal 2 jam sebelum waktu penggunaan",
          "Selalu konfirmasi kehadiran 30 menit sebelum meeting",
          "Cancel reservasi yang tidak terpakai untuk membantu pengguna lain",
          "Gunakan recurring booking untuk meeting rutin",
          "Manfaatkan mobile app untuk booking on-the-go",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "Troubleshooting Umum",
      },
      {
        type: "list",
        content: [
          "Jika tidak bisa login, gunakan fitur reset password",
          "Untuk masalah booking, cek email spam folder",
          "Jika ruangan tidak tersedia, coba alternatif waktu atau ruangan",
          "Gunakan live chat support untuk bantuan real-time",
        ],
      },
    ],
  },

  bantuan: {
    title: "Bantuan & Dukungan",
    description:
      "Pusat bantuan CapstoneD dengan FAQ, panduan pengguna, dan informasi support untuk membantu Anda menggunakan sistem dengan optimal.",
    lastUpdated: "15 Juni 2025",
    content: [
      {
        type: "heading",
        level: 2,
        content: "Frequently Asked Questions (FAQ)",
      },
      {
        type: "heading",
        level: 3,
        content: "Pertanyaan Umum",
      },
      {
        type: "paragraph",
        content: "**Q: Apakah CapstoneD gratis untuk digunakan?**",
      },
      {
        type: "paragraph",
        content:
          "A: CapstoneD menyediakan paket gratis dengan fitur dasar, serta paket premium dengan fitur lengkap. Hubungi tim sales untuk informasi pricing.",
      },
      {
        type: "paragraph",
        content: "**Q: Berapa lama sebelumnya saya bisa membuat reservasi?**",
      },
      {
        type: "paragraph",
        content:
          "A: Anda dapat membuat reservasi hingga 3 bulan ke depan, dan minimal 2 jam sebelum waktu penggunaan.",
      },
      {
        type: "paragraph",
        content: "**Q: Bisakah saya membatalkan atau mengubah reservasi?**",
      },
      {
        type: "paragraph",
        content:
          "A: Ya, Anda dapat membatalkan atau mengubah reservasi hingga 1 jam sebelum waktu mulai tanpa penalty.",
      },
      {
        type: "heading",
        level: 3,
        content: "Masalah Teknis",
      },
      {
        type: "paragraph",
        content: "**Q: Mengapa saya tidak menerima email konfirmasi?**",
      },
      {
        type: "paragraph",
        content:
          "A: Periksa folder spam/junk email Anda. Jika masih tidak ada, hubungi support untuk verifikasi email address.",
      },
      {
        type: "paragraph",
        content:
          "**Q: Aplikasi tidak bisa diakses, apa yang harus dilakukan?**",
      },
      {
        type: "paragraph",
        content:
          "A: Coba refresh browser atau clear cache. Jika masalah berlanjut, cek status server di halaman status kami.",
      },
      {
        type: "heading",
        level: 2,
        content: "Panduan Pengguna",
      },
      {
        type: "list",
        content: [
          "📖 User Manual: Panduan lengkap penggunaan CapstoneD",
          "🎥 Video Tutorial: Tutorial step-by-step dalam format video",
          "📱 Mobile App Guide: Cara menggunakan aplikasi mobile",
          "🔧 Admin Guide: Panduan untuk administrator sistem",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "Cara Menghubungi Support",
      },
      {
        type: "heading",
        level: 3,
        content: "Live Chat",
      },
      {
        type: "paragraph",
        content:
          "Gunakan widget live chat di pojok kanan bawah untuk bantuan real-time. Tersedia 24/7 dengan response time rata-rata 2 menit.",
      },
      {
        type: "heading",
        level: 3,
        content: "Email Support",
      },
      {
        type: "paragraph",
        content:
          "Kirim email ke support@capstoned.com dengan detail masalah Anda. Tim akan merespons dalam 24 jam pada hari kerja.",
      },
      {
        type: "heading",
        level: 3,
        content: "Phone Support",
      },
      {
        type: "paragraph",
        content:
          "Hubungi hotline kami di +62 21 1234 5678 (Senin-Jumat, 09:00-18:00 WIB) untuk bantuan langsung dari tim technical support.",
      },
      {
        type: "heading",
        level: 2,
        content: "Knowledge Base",
      },
      {
        type: "list",
        content: [
          "Artikel troubleshooting untuk masalah umum",
          "Best practices untuk penggunaan optimal",
          "Update dan changelog fitur terbaru",
          "Integration guides untuk sistem third-party",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "Training & Onboarding",
      },
      {
        type: "paragraph",
        content:
          "Kami menyediakan sesi training online gratis untuk tim Anda. Sesi mencakup:",
      },
      {
        type: "list",
        content: [
          "Introduction to CapstoneD (30 menit)",
          "Advanced Features Workshop (60 menit)",
          "Admin Training Session (90 menit)",
          "Custom training sesuai kebutuhan organisasi",
        ],
      },
      {
        type: "heading",
        level: 2,
        content: "Feedback & Suggestions",
      },
      {
        type: "paragraph",
        content:
          "Kami sangat menghargai feedback Anda untuk terus meningkatkan layanan. Kirim saran atau masukan melalui:",
      },
      {
        type: "list",
        content: [
          "Form feedback di dalam aplikasi",
          "Email ke feedback@capstoned.com",
          "Survey kepuasan pengguna (dikirim berkala)",
          "User community forum untuk diskusi dengan pengguna lain",
        ],
      },
    ],
  },
};
