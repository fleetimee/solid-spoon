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
    sortBy?: string; // Column to sort by
    sortOrder?: string; // Sort direction ('asc' or 'desc')
  };
}

export default async function ReservationsPage({
  searchParams,
}: ReservationsPageProps) {
  // Read filters from searchParams
  const searchFilter = searchParams?.search as string | undefined; // Read generic search filter
  const roomIdParam = searchParams?.roomId;
  const statusIdParam = searchParams?.statusId;

  // Read sorting parameters from searchParams
  const sortBy = searchParams?.sortBy as string | undefined;
  const sortOrderParam = searchParams?.sortOrder as string | undefined;

  // Validate sortOrder
  const sortOrder =
    sortOrderParam === "asc" || sortOrderParam === "desc"
      ? sortOrderParam
      : undefined; // Default to undefined if invalid

  // Parse filter IDs, default to undefined if invalid or missing
  const roomIdFilter = roomIdParam ? parseInt(roomIdParam, 10) : undefined;
  const statusIdFilter = statusIdParam
    ? parseInt(statusIdParam, 10)
    : undefined;

  // Prepare filters and sorting objects
  const filters = {
    search: searchFilter,
    roomId: isNaN(roomIdFilter as number) ? undefined : roomIdFilter,
    statusId: isNaN(statusIdFilter as number) ? undefined : statusIdFilter,
  };
  // Explicitly type the sorting object to match the expected function signature
  const sorting: { sortBy?: string; sortOrder?: "asc" | "desc" } = {
    sortBy: sortBy,
    sortOrder: sortOrder,
  };

  // Fetch data concurrently
  const [reservations, rooms, statuses] = await Promise.all([
    getAllReservations(filters, sorting), // Pass filters and sorting
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
