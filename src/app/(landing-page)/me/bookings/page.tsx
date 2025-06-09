import { TabsContent } from "@/components/ui/tabs";
// Removed Card, CardContent, Button imports
import { auth } from "@/lib/auth"; // Add server-side auth import
import { headers } from "next/headers"; // Import headers
import { getUserReservations } from "@/features/reservations/api/getUserReservations"; // Import API function
// Removed formatDateRangeHumanized import (now used in BookingsList)
import { BookingsList } from "@/features/reservations/components/bookings-list"; // Import the new component
import { DashboardHeader } from "@/features/admin/components/dashboard-header";
import { BookOpen } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking Saya - Capstone Room Reservation",
  description:
    "Lihat dan kelola semua reservasi ruangan dan riwayat booking Anda. Pantau status booking dan jadwal reservasi terbaru.",
  keywords: [
    "booking saya",
    "reservasi saya",
    "riwayat booking",
    "jadwal reservasi",
    "kelola booking",
    "status reservasi",
    "capstone",
    "Indonesia",
  ],
  openGraph: {
    title: "Booking Saya - Capstone Room Reservation",
    description:
      "Lihat dan kelola semua reservasi ruangan dan riwayat booking Anda. Pantau status booking dan jadwal reservasi terbaru.",
    type: "website",
    locale: "id_ID",
    url: "/me/bookings",
    siteName: "Capstone Room Reservation",
  },
  robots: {
    index: false, // User profile pages should not be indexed
    follow: false,
  },
};

// Removed getStatusColor helper function

export default async function BookingsPage() {
  // Replace client-side session fetching with server-side
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Handle case where user is not logged in
  // Access user directly via session.user
  if (!session?.user?.id) {
    // Updated check
    return (
      <TabsContent value="bookings" className="pt-6">
        <div className="space-y-6">
          <DashboardHeader
            title="Booking Saya"
            description="Silakan masuk untuk melihat booking Anda."
            icon={BookOpen}
          />
        </div>
      </TabsContent>
    );
  }

  // Access user ID directly via session.user.id
  const userId = session.user.id; // Updated access
  const reservations = await getUserReservations(userId);

  return (
    <TabsContent value="bookings" className="pt-6">
      <div className="space-y-6">
        <DashboardHeader
          title="Booking Saya"
          description="Lihat dan kelola semua reservasi ruangan dan riwayat booking Anda."
          icon={BookOpen}
        />
        {/* Replace the old list rendering with the BookingsList component */}
        <BookingsList reservations={reservations} />
      </div>
    </TabsContent>
  );
}
