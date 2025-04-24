import Link from "next/link";
import { Metadata } from "next";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const metadata: Metadata = {
  title: "Room Management",
  description: "View and manage all available rooms in the reservation system",
  openGraph: {
    description: "Browse and manage all rooms in the reservation system",
  },
};

export const fetchCache = "default-cache";

const roomsBreadcrumb = [{ label: "Rooms" }, { label: "Manage Rooms" }];

interface RoomsPageProps {
  searchParams: Promise<{
    search?: string;
    location?: string;
    minCapacity?: string;
    maxCapacity?: string;
    facilities?: string | string[];
    page?: string;
    pageSize?: string;
  }>;
}

export default async function RoomsPage(props: RoomsPageProps) {
  const searchParams = await props.searchParams;
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
    page: searchParams.page ? Number(searchParams.page) : 1,
    pageSize: searchParams.pageSize ? Number(searchParams.pageSize) : 9,
  };

  const hasFilters =
    Object.keys(searchParams).filter(
      (key) => key !== "page" && key !== "pageSize"
    ).length > 0;

  const { rooms, pagination } = await getRooms(parsedSearchParams);

  const getPaginationUrl = (targetPage: number) => {
    const params = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== "page" && value) {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.set(key, value);
        }
      }
    });

    params.set("page", targetPage.toString());

    return `/admin/rooms?${params.toString()}`;
  };

  // Function to generate pagination items
  const getPaginationItems = () => {
    const { currentPage, totalPages } = pagination;

    // For small number of pages, show all page links
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <PaginationItem key={page}>
          <PaginationLink
            href={getPaginationUrl(page)}
            isActive={page === currentPage}
            preserveScroll={true}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      ));
    }

    // For many pages, show a condensed pagination with ellipses
    const items = [];

    // Always show first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          href={getPaginationUrl(1)}
          isActive={1 === currentPage}
          preserveScroll={true}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href={getPaginationUrl(i)}
            isActive={i === currentPage}
            preserveScroll={true}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href={getPaginationUrl(totalPages)}
            isActive={totalPages === currentPage}
            preserveScroll={true}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <>
      <BreadcrumbSetter items={roomsBreadcrumb} />

      <main className="flex flex-col grow p-4 md:p-8">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">
            Manage Rooms
          </h1>
          <p className="text-muted-foreground">Manage and organize rooms</p>
          <div className="flex justify-end">
            <Button asChild>
              <Link href="/admin/rooms/add">
                <Plus className="mr-2 h-4 w-4" />
                Add Room
              </Link>
            </Button>
          </div>
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
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <RoomCard room={room} key={room.id} />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    {pagination.currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious
                          href={getPaginationUrl(pagination.currentPage - 1)}
                          preserveScroll={true}
                        />
                      </PaginationItem>
                    )}

                    {getPaginationItems()}

                    {pagination.currentPage < pagination.totalPages && (
                      <PaginationItem>
                        <PaginationNext
                          href={getPaginationUrl(pagination.currentPage + 1)}
                          preserveScroll={true}
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}

            <div className="mt-4 text-center text-sm text-muted-foreground">
              {pagination.totalItems > 0 && (
                <>
                  Showing{" "}
                  {(pagination.currentPage - 1) * pagination.pageSize + 1} to{" "}
                  {Math.min(
                    pagination.currentPage * pagination.pageSize,
                    pagination.totalItems
                  )}{" "}
                  of {pagination.totalItems} rooms
                </>
              )}
            </div>
          </>
        )}
      </main>
    </>
  );
}
