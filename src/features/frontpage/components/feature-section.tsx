import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Search,
  CalendarCheck2,
  MousePointer,
  Bell,
  CheckCircle,
  Info,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Pencarian Super Cepat ⚡",
    description:
      "Temukan ruang idaman dalam hitungan detik! Filter canggih kami bikin kamu bisa nyari berdasarkan lokasi, tanggal, harga, dan fasilitas dengan mudah banget.",
  },
  {
    icon: CalendarCheck2,
    title: "Update Real-Time",
    description:
      "No more nebak-nebakan! Lihat ketersediaan ruang up-to-date dan book dengan percaya diri. Tanggal yang kamu pilih dijamin aman.",
  },
  {
    icon: MousePointer,
    title: "Booking Kilat & Simpel",
    description:
      "Reserve ruang cuma butuh beberapa klik doang. Proses booking yang streamlined bikin kamu hemat waktu dan langsung confirmed!",
  },
  {
    icon: Bell,
    title: "Notifikasi Instan 📲",
    description:
      "Selalu update dengan info terbaru! Dapat konfirmasi booking langsung dan reminder tepat waktu di device kamu.",
  },
  {
    icon: CheckCircle,
    title: "Aman & Terpercaya",
    description:
      "Book dengan tenang! Platform kami pakai sistem pembayaran yang secure dan data reservasi kamu dijamin protected.",
  },
  {
    icon: Info,
    title: "Info Ruang Lengkap",
    description:
      "Buat keputusan yang tepat! Lihat foto HD, cek fasilitas, kapasitas, dan detail layout setiap ruang sebelum booking.",
  },
];

// Simple SVG patterns to cycle through
const svgPatterns = [
  <svg
    key="pattern1"
    viewBox="0 0 100 50"
    className="w-full h-32 text-primary"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="10"
      y="10"
      width="30"
      height="30"
      fill="currentColor"
      opacity="0.3"
      rx="3"
    />
    <rect
      x="50"
      y="10"
      width="40"
      height="15"
      fill="currentColor"
      opacity="0.6"
      rx="3"
    />
    <rect
      x="50"
      y="30"
      width="40"
      height="10"
      fill="currentColor"
      opacity="0.1"
      rx="3"
    />
  </svg>,
  <svg
    key="pattern2"
    viewBox="0 0 100 50"
    className="w-full h-32 text-secondary"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="25" cy="25" r="15" fill="currentColor" opacity="0.4" />
    <line
      x1="50"
      y1="10"
      x2="90"
      y2="40"
      stroke="currentColor"
      strokeWidth="2"
      opacity="0.7"
    />
    <line
      x1="50"
      y1="40"
      x2="90"
      y2="10"
      stroke="currentColor"
      strokeWidth="2"
      opacity="0.2"
    />
  </svg>,
  <svg
    key="pattern3"
    viewBox="0 0 100 50"
    className="w-full h-32 text-accent-foreground"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M 10 10 L 50 40 L 90 10 Z" fill="currentColor" opacity="0.5" />
    <rect
      x="30"
      y="25"
      width="40"
      height="15"
      fill="currentColor"
      opacity="0.2"
      rx="5"
    />
  </svg>,
  <svg
    key="pattern4"
    viewBox="0 0 100 50"
    className="w-full h-32 text-muted-foreground"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="15"
      y="15"
      width="20"
      height="20"
      fill="currentColor"
      opacity="0.6"
      transform="rotate(15 25 25)"
    />
    <rect
      x="60"
      y="10"
      width="25"
      height="30"
      fill="currentColor"
      opacity="0.3"
      rx="4"
    />
  </svg>,
];

export function Features() {
  return (
    <div
      id="features"
      className="max-w-screen-xl mx-auto w-full py-12 xs:py-20 px-6"
    >
      <h2 className="text-3xl xs:text-4xl md:text-5xl md:leading-[3.5rem] font-bold tracking-tight sm:max-w-xl sm:text-center sm:mx-auto">
        Semua yang Kamu Butuhkan untuk Booking dengan Confidence 💪
      </h2>
      <div className="mt-8 xs:mt-14 w-full mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
        {features.map((feature, index) => (
          <Card
            key={feature.title}
            className="flex flex-col border rounded-xl overflow-hidden shadow-none"
          >
            <CardHeader>
              <feature.icon />
              <h4 className="!mt-3 text-xl font-bold tracking-tight">
                {feature.title}
              </h4>
              <p className="mt-1 text-muted-foreground text-sm xs:text-[17px]">
                {feature.description}
              </p>
            </CardHeader>
            <CardContent className="mt-auto p-6">
              {/* Insert inline SVG, cycling through patterns */}
              {svgPatterns[index % svgPatterns.length]}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
