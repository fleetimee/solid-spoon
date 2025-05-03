import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { authClient } from "@/lib/auth-client"; // Import authClient - Removed
import { auth } from "@/lib/auth"; // Add server-side auth import
import { headers } from "next/headers"; // Import headers
import { getUserReservations } from "@/features/reservations/api/getUserReservations"; // Import API function
import { formatDateRangeHumanized } from "@/lib/utils/formatDate"; // Import new date range formatter

// Helper function for status color
const getStatusColor = (status: string | null | undefined) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return "bg-green-500";
    case "pending":
      return "bg-yellow-500";
    case "rejected":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

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
        <div className="grid grid-cols-1 gap-4">
          {reservations && reservations.length > 0 ? (
            reservations.map((reservation) => (
              <Card key={reservation.id}>
                {" "}
                {/* Assuming reservation has an id */}
                <CardContent className="p-0">
                  <div className="grid grid-cols-[12px_1fr] sm:grid-cols-[12px_3fr_1fr_1fr_1fr] gap-4 p-4">
                    <div
                      className={`w-2 h-full self-stretch ${getStatusColor(reservation.status)} rounded-full`}
                    ></div>
                    <div>
                      <div className="font-medium">{reservation.roomName}</div>
                      <div className="text-sm text-muted-foreground">
                        {reservation.title}
                      </div>
                    </div>
                    <div className="hidden sm:block text-sm">
                      {/* Use formatDateRangeHumanized */}
                      {formatDateRangeHumanized(
                        reservation.startTime,
                        reservation.endTime
                      )}
                    </div>
                    <div className="hidden sm:block text-sm capitalize">
                      {reservation.status ?? "N/A"}
                    </div>
                    <div className="hidden sm:block text-right">
                      <Button variant="outline" size="sm">
                        View {/* Keep view button for now */}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>You have no bookings yet.</p>
          )}
        </div>
        {/* Removed the "View All Bookings" button */}
      </div>
    </TabsContent>
  );
}
