import { TabsContent } from "@/components/ui/tabs";
// Removed Card, CardContent, Button imports
import { auth } from "@/lib/auth"; // Add server-side auth import
import { headers } from "next/headers"; // Import headers
import { getUserReservations } from "@/features/reservations/api/getUserReservations"; // Import API function
// Removed formatDateRangeHumanized import (now used in BookingsList)
import { BookingsList } from "@/features/reservations/components/bookings-list"; // Import the new component

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
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
          <p>Please log in to view your bookings.</p>
        </div>
      </TabsContent>
    );
  }

  // Access user ID directly via session.user.id
  const userId = session.user.id; // Updated access
  const reservations = await getUserReservations(userId);

  return (
    <TabsContent value="bookings" className="pt-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
        {/* Replace the old list rendering with the BookingsList component */}
        <BookingsList reservations={reservations} />
      </div>
    </TabsContent>
  );
}
