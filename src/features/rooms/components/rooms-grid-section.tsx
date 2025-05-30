import Link from "next/link";
import { Plus, Search, Info, RefreshCw, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoomCard } from "@/features/rooms/components/room-card";
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
import { Room } from "@/features/rooms/types/room";

export interface RoomsGridSectionProps {
  rooms: Room[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
  hasFilters: boolean;
  searchParams: Record<string, any>;
}

export function RoomsGridSection({
  rooms,
  pagination,
  hasFilters,
  searchParams,
}: RoomsGridSectionProps) {
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

  if (rooms.length === 0) {
    return (
      <Card className="border-dashed bg-gradient-to-br from-muted/20 to-muted/50 w-full max-w-3xl mx-auto shadow-lg">
        <CardHeader className="flex flex-col items-center justify-center pb-0 pt-8">
          <div className="flex flex-col items-center justify-center mb-6">
            {hasFilters ? (
              <div className="bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-950/50 dark:to-amber-950/50 rounded-full p-6 mb-4 shadow-inner">
                <Search
                  className="h-12 w-12 text-orange-600 dark:text-orange-400"
                  strokeWidth={1.25}
                />
              </div>
            ) : (
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-full p-6 mb-4 shadow-inner">
                <Building2
                  className="h-12 w-12 text-blue-600 dark:text-blue-400"
                  strokeWidth={1.25}
                />
              </div>
            )}
            <h2 className="text-xl font-semibold text-center mt-2">
              {hasFilters
                ? "🔍 No matching rooms found"
                : "🏢 No rooms available"}
            </h2>
          </div>
        </CardHeader>

        <CardContent className="text-center space-y-2 pb-6 px-8">
          {hasFilters ? (
            <div className="space-y-4">
              <p className="text-muted-foreground max-w-md mx-auto">
                Your current filter settings didn&apos;t return any results. Try
                adjusting your filters or clearing them to see all rooms.
              </p>

              <div className="flex flex-col gap-2 items-center mt-2">
                <div className="bg-background/80 rounded-lg p-3 inline-flex gap-2 text-sm text-muted-foreground shadow-sm">
                  <Info className="h-4 w-4 flex-shrink-0 text-blue-500" />
                  <span>💡 Tip: Try broadening your search criteria</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground max-w-md mx-auto">
              There are no rooms set up yet. Get started by adding your first
              room to begin managing your space inventory.
            </p>
          )}
        </CardContent>

        <CardFooter className="flex justify-center pb-8 pt-0">
          {hasFilters ? (
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                asChild
                variant="outline"
                className="gap-2 shadow-sm hover:shadow-md transition-shadow"
              >
                <Link href="/admin/rooms">
                  <RefreshCw className="h-4 w-4" />
                  Clear all filters
                </Link>
              </Button>
              <Button
                asChild
                className="gap-2 shadow-md hover:shadow-lg transition-shadow"
              >
                <Link href="/admin/rooms/add">
                  <Plus className="h-4 w-4" />
                  Add new room
                </Link>
              </Button>
            </div>
          ) : (
            <Button
              asChild
              className="gap-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <Link href="/admin/rooms/add">
                <Plus className="h-4 w-4" />✨ Add your first room
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">🏢 Room Gallery</h2>
          <p className="text-sm text-muted-foreground">
            Browse and manage your room inventory
          </p>
        </div>
        <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
          {pagination.totalItems} room{pagination.totalItems !== 1 ? "s" : ""}{" "}
          total
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="group hover:scale-[1.02] transition-transform duration-300"
          >
            <RoomCard room={room} link={`/admin/rooms/${room.slug}`} />
          </div>
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex flex-col items-center gap-4">
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

          <div className="text-center text-sm text-muted-foreground">
            {pagination.totalItems > 0 && (
              <>
                Showing{" "}
                <span className="font-medium text-foreground">
                  {(pagination.currentPage - 1) * pagination.pageSize + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-foreground">
                  {Math.min(
                    pagination.currentPage * pagination.pageSize,
                    pagination.totalItems
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {pagination.totalItems}
                </span>{" "}
                rooms
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
