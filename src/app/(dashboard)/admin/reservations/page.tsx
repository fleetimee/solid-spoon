import { Typography } from "@/components/ui/typography";
import { getReservationStatuses } from "@/features/application/api/getLookupValue"; // Import status fetcher
import {
  getAllReservations,
  ReservationWithDetails,
} from "@/features/reservations/api/getAllReservations";
import { columns } from "@/features/reservations/components/reservations-columns";
import { ReservationsDataTable } from "@/features/reservations/components/reservations-data-table";
import { getActiveRoomsList } from "@/features/rooms/api/getRooms"; // Import room fetcher

interface ReservationsPageProps {
  searchParams?: {
    search?: string; // Generic search filter
    roomId?: string; // Room ID from search params (string)
    statusId?: string; // Status ID from search params (string)
  };
}

export default async function ReservationsPage({
  searchParams,
}: ReservationsPageProps) {
  // Read filters from searchParams
  const searchFilter = searchParams?.search as string | undefined; // Read generic search filter
  const roomIdParam = searchParams?.roomId;
  const statusIdParam = searchParams?.statusId;

  // Parse IDs, default to undefined if invalid or missing
  const roomIdFilter = roomIdParam ? parseInt(roomIdParam, 10) : undefined;
  const statusIdFilter = statusIdParam
    ? parseInt(statusIdParam, 10)
    : undefined;

  // Fetch data concurrently
  const [reservations, rooms, statuses] = await Promise.all([
    getAllReservations({
      search: searchFilter, // Pass generic search filter
      roomId: isNaN(roomIdFilter as number) ? undefined : roomIdFilter, // Pass parsed ID or undefined
      statusId: isNaN(statusIdFilter as number) ? undefined : statusIdFilter, // Pass parsed ID or undefined
    }),
    getActiveRoomsList(),
    getReservationStatuses(),
  ]);

  return (
    <div className="flex flex-col p-6 md:p-8 gap-8">
      <div className="flex flex-col gap-2">
        <Typography variant="h1">Manage Reservations</Typography>
        <Typography variant="muted">
          View and manage all room reservations. Filter by user, room, or
          status.
        </Typography>
      </div>
      {/* Pass rooms and statuses to the data table */}
      <ReservationsDataTable
        columns={columns}
        data={reservations}
        rooms={rooms}
        statuses={statuses}
      />
    </div>
  );
}
