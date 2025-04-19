import Link from "next/link";
import { Plus, Search, Info, RefreshCw, Building2 } from "lucide-react";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Button } from "@/components/ui/button";
import { RoomCard } from "@/features/rooms/components/room-card";
import { RoomFilters } from "@/features/rooms/components/room-filters";
import { getRooms, RoomSearchParams } from "@/features/rooms/api/getRooms";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const roomsBreadcrumb = [{ label: "Rooms" }, { label: "Manage Rooms" }];

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

  const hasFilters = Object.keys(searchParams).length > 0;

  const rooms = await getRooms(parsedSearchParams);

  return (
    <>
      <BreadcrumbSetter items={roomsBreadcrumb} />

      <main className="flex flex-col grow p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Manage Rooms</h1>
            <p className="text-muted-foreground">Manage and organize rooms</p>
          </div>
          <Button asChild>
            <Link href="/admin/rooms/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Room
            </Link>
          </Button>
        </div>

        <div className="mb-6">
          <RoomFilters />
        </div>

        {rooms.length === 0 ? (
          <Card className="border-dashed bg-muted/50 w-full max-w-3xl mx-auto">
            <CardHeader className="flex flex-col items-center justify-center pb-0 pt-8">
              <div className="flex flex-col items-center justify-center mb-6">
                {hasFilters ? (
                  <div className="bg-muted rounded-full p-6 mb-4">
                    <Search
                      className="h-12 w-12 text-muted-foreground"
                      strokeWidth={1.25}
                    />
                  </div>
                ) : (
                  <div className="bg-muted rounded-full p-6 mb-4">
                    <Building2
                      className="h-12 w-12 text-muted-foreground"
                      strokeWidth={1.25}
                    />
                  </div>
                )}
                <h2 className="text-xl font-semibold text-center mt-2">
                  {hasFilters
                    ? "No matching rooms found"
                    : "No rooms available"}
                </h2>
              </div>
            </CardHeader>

            <CardContent className="text-center space-y-2 pb-6 px-8">
              {hasFilters ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Your current filter settings didn&apos;t return any results.
                    Try adjusting your filters or clearing them to see all
                    rooms.
                  </p>

                  <div className="flex flex-col gap-2 items-center mt-2">
                    <div className="bg-background/80 rounded-lg p-3 inline-flex gap-2 text-sm text-muted-foreground">
                      <Info className="h-4 w-4 flex-shrink-0" />
                      <span>Tip: Try broadening your search criteria</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground max-w-md mx-auto">
                  There are no rooms set up yet. Get started by adding your
                  first room.
                </p>
              )}
            </CardContent>

            <CardFooter className="flex justify-center pb-8 pt-0">
              {hasFilters ? (
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button asChild variant="outline" className="gap-2">
                    <Link href="/admin/rooms">
                      <RefreshCw className="h-4 w-4" />
                      Clear all filters
                    </Link>
                  </Button>
                  <Button asChild className="gap-2">
                    <Link href="/admin/rooms/add">
                      <Plus className="h-4 w-4" />
                      Add new room
                    </Link>
                  </Button>
                </div>
              ) : (
                <Button asChild className="gap-2">
                  <Link href="/admin/rooms/add">
                    <Plus className="h-4 w-4" />
                    Add your first room
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <RoomCard room={room} key={room.id} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
