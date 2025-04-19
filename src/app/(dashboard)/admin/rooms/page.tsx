import Link from "next/link";
import { Plus } from "lucide-react";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Button } from "@/components/ui/button";
import { RoomCard } from "@/features/rooms/components/room-card";
import { RoomFilters } from "@/features/rooms/components/room-filters";
import { getRooms, RoomSearchParams } from "@/features/rooms/api/getRooms";

const roomsBreadcrumb = [
  { label: "Rooms", href: "/admin/rooms" },
  { label: "Manage Rooms" },
];

interface RoomsPageProps {
  searchParams: {
    search?: string;
    location?: string;
    minCapacity?: string;
    maxCapacity?: string;
    facilities?: string | string[];
  };
}

export default async function RoomsPage({ searchParams }: RoomsPageProps) {
  // Process search parameters
  const parsedSearchParams: RoomSearchParams = {
    search: searchParams.search,
    location: searchParams.location,
    minCapacity: searchParams.minCapacity
      ? Number(searchParams.minCapacity)
      : undefined,
    maxCapacity: searchParams.maxCapacity
      ? Number(searchParams.maxCapacity)
      : undefined,
    facilities: Array.isArray(searchParams.facilities)
      ? searchParams.facilities
      : searchParams.facilities
        ? [searchParams.facilities]
        : undefined,
  };

  // Fetch rooms with filters
  const rooms = await getRooms(parsedSearchParams);

  return (
    <>
      <BreadcrumbSetter items={roomsBreadcrumb} />

      <main className="flex flex-col grow p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Rooms</h1>
            <p className="text-muted-foreground">Manage and organize rooms</p>
          </div>
          <Button asChild>
            <Link href="/admin/rooms/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Room
            </Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <RoomFilters />
        </div>

        {rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <h2 className="text-xl font-semibold">No rooms found</h2>
            <p className="mb-4 text-muted-foreground">
              {Object.keys(searchParams).length > 0
                ? "Try adjusting your filters to see more results"
                : "Get started by creating your first room"}
            </p>
            {Object.keys(searchParams).length > 0 ? (
              <Button asChild variant="outline">
                <Link href="/admin/rooms">Clear all filters</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/admin/rooms/add">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Room
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <Link href={`/admin/rooms/${room.id}`} key={room.id}>
                <RoomCard room={room} />
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
