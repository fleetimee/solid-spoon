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
    page?: string; // Page number for pagination
    pageSize?: string; // Items per page
  };
}

const DEFAULT_PAGE_SIZE = 10; // Define default page size here as well

export default async function ReservationsPage({
  searchParams,
}: ReservationsPageProps) {
  // Read filters from searchParams
  const searchFilter = searchParams?.search as string | undefined;
  const roomIdParam = searchParams?.roomId;
  const statusIdParam = searchParams?.statusId;

  // Read sorting parameters from searchParams
  const sortBy = searchParams?.sortBy as string | undefined;
  const sortOrderParam = searchParams?.sortOrder as string | undefined;

  // Read pagination parameters from searchParams
  const pageParam = searchParams?.page;
  const pageSizeParam = searchParams?.pageSize;

  // Validate sortOrder
  const sortOrder =
    sortOrderParam === "asc" || sortOrderParam === "desc"
      ? sortOrderParam
      : undefined;

  // Parse filter IDs
  const roomIdFilter = roomIdParam ? parseInt(roomIdParam, 10) : undefined;
  const statusIdFilter = statusIdParam
    ? parseInt(statusIdParam, 10)
    : undefined;

  // Parse and validate pagination parameters
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const pageSize = pageSizeParam
    ? parseInt(pageSizeParam, 10)
    : DEFAULT_PAGE_SIZE;
  const validatedPage = isNaN(page) || page < 1 ? 1 : page;
  const validatedPageSize =
    isNaN(pageSize) || pageSize < 1 ? DEFAULT_PAGE_SIZE : pageSize;

  // Prepare filters, sorting, and pagination objects
  const filters = {
    search: searchFilter,
    roomId: isNaN(roomIdFilter as number) ? undefined : roomIdFilter,
    statusId: isNaN(statusIdFilter as number) ? undefined : statusIdFilter,
  };
  const sorting: { sortBy?: string; sortOrder?: "asc" | "desc" } = {
    sortBy: sortBy,
    sortOrder: sortOrder,
  };
  const pagination = {
    page: validatedPage,
    pageSize: validatedPageSize,
  };

  // Fetch data concurrently (reservations now depend on pagination)
  const [{ data: reservationsData, totalCount }, rooms, statuses] =
    await Promise.all([
      getAllReservations(filters, sorting, pagination), // Pass pagination
      getActiveRoomsList(),
      getReservationStatuses(),
    ]);

  // Calculate page count
  const pageCount = Math.ceil(totalCount / validatedPageSize);

  return (
    <div className="flex flex-col p-6 md:p-8 gap-8">
      <div className="flex flex-col gap-2">
        <Typography variant="h1">Manage Reservations</Typography>
        <Typography variant="muted">
          View and manage all room reservations. Filter by user, room, or
          status.
        </Typography>
      </div>
      {/* Pass data, pageCount, rooms, and statuses to the data table */}
      <ReservationsDataTable
        columns={columns}
        data={reservationsData} // Pass the actual data array
        pageCount={pageCount} // Pass the calculated page count
        rooms={rooms}
        statuses={statuses}
      />
    </div>
  );
}
