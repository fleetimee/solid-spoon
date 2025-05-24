import Link from "next/link";
import { Metadata } from "next";
import { Search, Info, RefreshCw, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { Typography } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Available Rooms",
  description: "Browse and find the perfect room for your needs.",
  openGraph: {
    description: "Browse and find the perfect room for your needs.",
  },
};

export const fetchCache = "default-cache";

const roomsBreadcrumb = [{ label: "Home", href: "/" }, { label: "Rooms" }];

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

    return `/rooms?${params.toString()}`;
  };

  const getPaginationItems = () => {
    const { currentPage, totalPages } = pagination;

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

    const items = [];

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

    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

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

    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

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
          <Typography
            variant="h1"
            className="text-3xl font-semibold tracking-tight"
          >
            Available Rooms
          </Typography>
          <Typography className="text-muted-foreground">
            Browse and find the perfect room for your needs.
          </Typography>
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
                <Typography
                  variant="h2"
                  className="text-xl font-semibold text-center mt-2"
                >
                  {hasFilters
                    ? "No matching rooms found"
                    : "No rooms available"}
                </Typography>
              </div>
            </CardHeader>

            <CardContent className="text-center space-y-2 pb-6 px-8">
              {hasFilters ? (
                <div className="space-y-4">
                  <Typography className="text-muted-foreground max-w-md mx-auto">
                    Your current filter settings didn&apos;t return any results.
                    Try adjusting your filters or clearing them to see all
                    rooms.
                  </Typography>

                  <div className="flex flex-col gap-2 items-center mt-2">
                    <div className="bg-background/80 rounded-lg p-3 inline-flex gap-2 text-sm text-muted-foreground">
                      <Info className="h-4 w-4 flex-shrink-0" />
                      <span>Tip: Try broadening your search criteria</span>
                    </div>
                  </div>
                </div>
              ) : (
                // Updated text for no rooms available
                <Typography className="text-muted-foreground max-w-md mx-auto">
                  No rooms are currently available. Please check back later!
                </Typography>
              )}
            </CardContent>

            <CardFooter className="flex justify-center pb-8 pt-0">
              {hasFilters ? (
                <div className="flex flex-wrap gap-3 justify-center">
                  {/* Updated Clear Filters link */}
                  <Button asChild variant="outline" className="gap-2">
                    <Link href="/rooms">
                      <RefreshCw className="h-4 w-4" />
                      Clear all filters
                    </Link>
                  </Button>
                  {/* Removed Add Room button */}
                </div>
              ) : // Removed Add Room button for empty state
              null}
            </CardFooter>
          </Card>
        ) : (
          <>
            {/* Updated grid for Bento layout */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6">
              {rooms.map((room, index) => {
                // Define span classes based on index for a repeating Bento pattern
                let spanClasses = "md:col-span-2"; // Default span
                const patternIndex = index % 6; // Get position within the 6-item pattern

                if (patternIndex === 0) {
                  spanClasses = "md:col-span-4 md:row-span-2"; // Large item
                } else if (patternIndex === 1 || patternIndex === 2) {
                  spanClasses = "md:col-span-2"; // Small items next to large
                } else if (patternIndex === 3 || patternIndex === 4) {
                  spanClasses = "md:col-span-3"; // Medium items below
                } else if (patternIndex === 5) {
                  spanClasses = "md:col-span-6"; // Full width item
                }

                return (
                  <div key={room.id} className={cn(spanClasses)}>
                    <RoomCard
                      room={room}
                      // Updated link to public detail page
                      link={`/v/${room.slug}`}
                      className="h-full" // Ensure card fills the grid area
                    />
                  </div>
                );
              })}
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
