import Link from "next/link";
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
import { Button } from "@/components/ui/button";

interface NotificationPaginationProps {
  currentPage: number;
  totalPages: number;
  filter?: NotificationFilter;
  pageSize?: string;
  showJson?: string;
}

export function NotificationPagination({
  currentPage,
  totalPages,
  filter,
  pageSize,
  showJson,
}: NotificationPaginationProps) {
  if (totalPages <= 1) return null;

  const getPaginationUrl = (targetPage: number) => {
    const params = new URLSearchParams();

    if (filter) {
      params.set("filter", filter);
    }

    params.set("page", targetPage.toString());

    if (pageSize) {
      params.set("pageSize", pageSize);
    }

    if (showJson) {
      params.set("showJson", showJson);
    }

    return `/admin/notifications?${params.toString()}`;
  };

  const getPageSizeUrl = (size: number) => {
    const params = new URLSearchParams();
    if (filter) params.set("filter", filter);
    params.set("page", "1"); // Reset to first page when changing page size
    params.set("pageSize", size.toString());
    if (showJson) params.set("showJson", showJson);
    return `/admin/notifications?${params.toString()}`;
  };

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
    <div className="mt-8 flex flex-col items-center gap-2">
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

      {/* Page size selector */}
      <div className="flex items-center gap-2 mt-1">
        <span className="text-sm text-muted-foreground">Items per page:</span>
        <div className="flex gap-1">
          {[3, 5, 10].map((size) => (
            <Button
              key={size}
              variant={
                parseInt(pageSize || "5") === size ? "secondary" : "outline"
              }
              size="sm"
              className="h-7 px-2 text-xs"
              asChild
            >
              <Link href={getPageSizeUrl(size)}>{size}</Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
