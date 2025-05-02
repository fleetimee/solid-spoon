import { Typography } from "@/components/ui/typography";
import {
  getAllReservations,
  ReservationWithDetails, // Import the type
} from "@/features/reservations/api/getAllReservations"; // Import the function
import { columns } from "@/features/reservations/components/reservations-columns";
import { ReservationsDataTable } from "@/features/reservations/components/reservations-data-table";

// Component is now async
export default async function ReservationsPage() {
  // Fetch real data
  const reservations: ReservationWithDetails[] = await getAllReservations();

  return (
    <div className="flex flex-col p-6 md:p-8 gap-8">
      <div className="flex flex-col gap-2">
        <Typography variant="h1">Manage Reservations</Typography>
        <Typography variant="muted">
          View and manage all room reservations. Sorted by Room Name, then Start
          Time.
        </Typography>
      </div>
      <ReservationsDataTable columns={columns} data={reservations} />
    </div>
  );
}
