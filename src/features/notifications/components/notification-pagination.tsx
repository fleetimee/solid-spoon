"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { NotificationFilter } from "../types/notification";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Added Select imports

interface NotificationPaginationProps {
  currentPage: number;
  totalPages: number;
  filter?: NotificationFilter; // Kept for potential future use or clarity, though URL construction uses searchParams
  pageSize?: string; // Kept for Select defaultValue
  showJson?: string; // Kept for potential future use or clarity
}

export function NotificationPagination({
  currentPage,
  totalPages,
  // filter, // No longer directly used for URL construction here
  pageSize,
  // showJson, // No longer directly used for URL construction here
}: NotificationPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read filter and showJson from searchParams if needed elsewhere,
  // otherwise they can be removed from props if only used for URL building.
  const filter = searchParams.get("filter") as NotificationFilter | null;
  const showJson = searchParams.get("showJson");

  if (totalPages <= 1) return null;

  const getPaginationUrl = (targetPage: number) => {
    const params = new URLSearchParams(searchParams); // Use current params as base

    params.set("page", targetPage.toString());

    // pageSize, filter, showJson are already in searchParams if set

    return `/admin/notifications?${params.toString()}`;
  };

  // Removed getPageSizeUrl function

  const getPaginationItems = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <PaginationItem key={page}>
          <PaginationLink
            href={getPaginationUrl(page)}
            isActive={page === currentPage}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      ));
    }

    const items = [];

    // Always show first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink href={getPaginationUrl(1)} isActive={1 === currentPage}>
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Show ellipsis if current page is beyond page 3
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Calculate range around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href={getPaginationUrl(i)}
            isActive={i === currentPage}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if current page is before totalPages - 2
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page
    items.push(
      <PaginationItem key={totalPages}>
        <PaginationLink
          href={getPaginationUrl(totalPages)}
          isActive={totalPages === currentPage}
        >
          {totalPages}
        </PaginationLink>
      </PaginationItem>
    );

    return items;
  };

  return (
    <div className="mt-8 flex items-center justify-between">
      {" "}
      {/* Changed layout */}
      {/* Page size selector using Select */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Per page:</span>
        <Select
          // Read pageSize from searchParams for consistency, fallback to prop or default
          defaultValue={searchParams.get("pageSize") || pageSize || "5"}
          onValueChange={(value) => {
            const params = new URLSearchParams(searchParams); // Use current params
            params.set("page", "1"); // Reset page
            params.set("pageSize", value);

            // filter and showJson are already carried over by new URLSearchParams(searchParams)

            router.push(`/admin/notifications?${params.toString()}`);
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Pagination>
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious href={getPaginationUrl(currentPage - 1)} />
            </PaginationItem>
          )}

          {getPaginationItems()}

          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext href={getPaginationUrl(currentPage + 1)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
      {/* Removed old page size selector buttons */}
    </div>
  );
}
