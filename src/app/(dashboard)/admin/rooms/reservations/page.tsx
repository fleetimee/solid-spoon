import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { getReservationStatuses } from "@/features/application/api/getLookupValue";
import {
  getAllReservations,
  ReservationWithDetails,
} from "@/features/reservations/api/getAllReservations";
import { getReservationStats } from "@/features/reservations/api/getReservationStats";
import { columns } from "@/features/reservations/components/reservations-columns";
import { ReservationsDataTable } from "@/features/reservations/components/reservations-data-table";
import { ReservationHeader } from "@/features/reservations/components/reservation-header";
import { ReservationStatsCards } from "@/features/reservations/components/reservation-stats-cards";
import { ReservationContentSection } from "@/features/reservations/components/reservation-content-section";
import { getActiveRoomsList } from "@/features/rooms/api/getRooms";
import { Calendar } from "lucide-react";

interface ReservationsPageProps {
  searchParams?: Promise<{
    search?: string; // Generic search filter
    roomId?: string; // Room ID from search params (string)
    statusId?: string; // Status ID from search params (string)
    sortBy?: string; // Column to sort by
    sortOrder?: string; // Sort direction ('asc' or 'desc')
    page?: string; // Page number for pagination
    pageSize?: string; // Items per page
  }>;
}

const DEFAULT_PAGE_SIZE = 10; // Define default page size here as well

export default async function ReservationsPage(props: ReservationsPageProps) {
  const searchParams = await props.searchParams;
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
  const [
    { data: reservationsData, totalCount },
    rooms,
    statuses,
    reservationStats,
  ] = await Promise.all([
    getAllReservations(filters, sorting, pagination), // Pass pagination
    getActiveRoomsList(),
    getReservationStatuses(),
    getReservationStats(), // Fetch reservation statistics
  ]);

  // Calculate page count
  const pageCount = Math.ceil(totalCount / validatedPageSize);

  return (
    <div className="flex flex-col p-6 md:p-8 gap-8">
      {/* Add BreadcrumbSetter here */}
      <BreadcrumbSetter
        items={[
          { label: "Home", href: "/admin/dashboard" },
          { label: "Rooms", href: "/admin/rooms" },
          { label: "Reservations", href: "/admin/rooms/reservations" },
        ]}
      />

      {/* Modern Header Section */}
      <div className="flex items-center justify-between">
        <ReservationHeader
          title="Manage Reservations"
          description="View and manage all room reservations with modern analytics"
          icon={Calendar}
        />
      </div>

      {/* Stats Cards Section */}
      <ReservationStatsCards
        stats={{
          totalReservations: reservationStats.totalReservations,
          pendingCount: reservationStats.pendingCount,
          approvedCount: reservationStats.approvedCount,
          rejectedCount: reservationStats.rejectedCount,
        }}
      />

      {/* Content Section with Glassmorphism */}
      <ReservationContentSection title="Reservation Data">
        {/* Pass data, pageCount, rooms, and statuses to the data table */}
        <ReservationsDataTable
          columns={columns}
          data={reservationsData} // Pass the actual data array
          pageCount={pageCount} // Pass the calculated page count
          rooms={rooms}
          statuses={statuses}
        />
      </ReservationContentSection>
    </div>
  );
}
