import { Suspense } from "react";
import { cookies, headers } from "next/headers"; // Import headers
import { auth } from "@/lib/auth"; // Import auth instance
import { getComprehensiveReservations } from "@/features/comprehensive-calendar/api/getComprehensiveReservations";
import { getActiveRoomsList } from "@/features/rooms/api/getRooms"; // Import room list function
import { getReservationStatuses } from "@/features/application/api/getLookupValue"; // Import status fetch function
// Placeholder import - We will create this component next
import { ComprehensiveCalendarView } from "@/features/comprehensive-calendar/components/ComprehensiveCalendarView";
// TODO: Create or verify these utility functions exist in src/lib/utils.ts
import {
  parseDateParam,
  parseArrayParam,
  parseStatusArrayParam,
} from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

// Define a loading component for Suspense fallback
function CalendarLoadingSkeleton() {
  return (
    <div className="p-4 space-y-4">
      <Skeleton className="h-10 w-1/4" /> {/* Placeholder for controls */}
      <Skeleton className="h-[600px] w-full" /> {/* Placeholder for calendar */}
    </div>
  );
}

export default async function ComprehensiveCalendarPage(
  props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) {
  const searchParams = await props.searchParams;
  // 1. Authorization Check using headers()
  // Construct a new Headers object from awaited next/headers
  const requestHeaders = new Headers(await headers());
  const session = await auth.api.getSession({
    headers: requestHeaders, // Pass the constructed Headers object
  });

  // TODO: Adjust role check based on actual session structure if needed (e.g., session.user.role)
  // Adjust check based on TS error hint: session object might be nested { session: { userId: ... } }
  if (!session?.session?.userId /* || session.user?.role !== 'ADMIN' */) {
    console.error("Unauthorized access to comprehensive calendar page.");
    // Consider redirecting or returning an error component for unauthorized users
    // import { redirect } from 'next/navigation';
    // redirect('/auth/login'); // Example redirect
    // For now, allow proceeding but log error. Data fetching might be empty.
  }

  // 2. Parse Search Parameters (Provide defaults or validation)
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  ); // End of day

  // Use utility functions to parse and validate parameters
  const startDate = parseDateParam(searchParams?.startDate, startOfMonth);
  const endDate = parseDateParam(searchParams?.endDate, endOfMonth);
  const roomIds = parseArrayParam(searchParams?.roomIds);
  // Assuming parseStatusArrayParam handles converting strings to the ReservationStatus type
  const statusesParam = searchParams?.statuses as string | string[] | undefined; // Explicitly get the param
  const statuses = parseStatusArrayParam(statusesParam);

  // 3. Fetch Data (This part will be suspended)
  // Convert roomIds from string[] to number[]
  const numericRoomIds = roomIds?.map(Number).filter((id) => !isNaN(id));

  // Fetch statuses
  const statusOptionsPromise = getReservationStatuses();

  // Fetch reservations
  const reservationsPromise = getComprehensiveReservations({
    startDate,
    endDate,
    roomIds: numericRoomIds, // Pass the converted array
    statuses,
  });

  // Fetch rooms
  const roomsPromise = getActiveRoomsList();

  // Await all promises concurrently
  const [fetchedStatusOptions, reservations, rooms] = await Promise.all([
    statusOptionsPromise,
    reservationsPromise,
    roomsPromise,
  ]);

  // Map fetched statuses to the expected LookupOption format
  // Assuming the fetched type is { id: number; value: string; } based on the TS error
  const mappedStatusOptions = fetchedStatusOptions.map((option) => ({
    code: String(option.id), // Convert id (number) to string for code
    value: option.value,
  }));

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* TODO: Add Breadcrumb or Page Title */}
      <h1 className="text-2xl font-bold mb-4">Comprehensive Room Calendar</h1>

      {/* Use Suspense to handle loading state while data is fetched */}
      <Suspense fallback={<CalendarLoadingSkeleton />}>
        {/* Render the client component, passing the promise and initial params */}
        {/* Pass original string roomIds to client component if needed for display/filters */}
        <ComprehensiveCalendarView
          // reservationsPromise={reservationsPromise} // Pass resolved data instead
          initialReservations={reservations} // Pass resolved reservations
          initialStartDate={startDate.toISOString()} // Pass ISO strings for serialization
          initialEndDate={endDate.toISOString()}
          initialRoomIds={roomIds} // Keep original string[] for client state if needed
          initialStatuses={statuses}
          // availableRooms={availableRooms} // Pass resolved data instead
          initialRooms={rooms} // Pass resolved rooms
          statusOptions={mappedStatusOptions} // Pass mapped statuses
        />
      </Suspense>
    </div>
  );
}

// Ensure dynamic rendering if searchParams are used extensively
export const dynamic = "force-dynamic";
