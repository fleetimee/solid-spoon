import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil Saya - Capstone Room Reservation",
  description:
    "Kelola profil dan akun Anda di sistem reservasi ruangan. Akses pengaturan, aktivitas, dan riwayat booking.",
  keywords: [
    "profil pengguna",
    "akun saya",
    "dashboard pengguna",
    "pengaturan",
    "aktivitas",
    "booking",
    "capstone",
    "Indonesia",
  ],
  openGraph: {
    title: "Profil Saya - Capstone Room Reservation",
    description:
      "Kelola profil dan akun Anda di sistem reservasi ruangan. Akses pengaturan, aktivitas, dan riwayat booking.",
    type: "website",
    locale: "id_ID",
    url: "/me",
    siteName: "Capstone Room Reservation",
  },
  robots: {
    index: false, // User profile pages should not be indexed
    follow: false,
  },
};

export default function UserProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
