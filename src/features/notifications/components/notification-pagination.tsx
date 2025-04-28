"use client";

import Link from "next/link";
import { useState } from "react"; // Added useState
import { useRouter, useSearchParams } from "next/navigation";
import { NotificationFilter } from "../types/notification";
import { Input } from "@/components/ui/input"; // Added Input
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
  const [customSizeInput, setCustomSizeInput] = useState(""); // Added state for custom input

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

  const currentSize = searchParams.get("pageSize") || pageSize || "5";
  const isPresetSize = ["3", "5", "10"].includes(currentSize);

  return (
    <div className="mt-8 flex items-center justify-between">
      {/* Page size selector with custom input */}
      <div className="flex items-center gap-2 min-w-[280px]">
        <span className="text-sm text-muted-foreground">Per page:</span>
        <Select
          value={isPresetSize ? currentSize : undefined} // Use value, show preset only if active
          onValueChange={(value) => {
            const params = new URLSearchParams(searchParams);
            params.set("page", "1");
            params.set("pageSize", value);
            router.push(`/admin/notifications?${params.toString()}`);
            setCustomSizeInput(""); // Clear custom input state
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder="Size" /> {/* Changed placeholder */}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="number"
          min="1"
          max="50" // Added a max limit
          className="h-8 w-[80px]"
          placeholder="Custom"
          value={customSizeInput}
          onChange={(e) => setCustomSizeInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const customSize = parseInt(customSizeInput);
              if (isNaN(customSize) || customSize <= 0 || customSize > 50) {
                // Added max check
                // Handle invalid input
                setCustomSizeInput("");
                return;
              }

              const params = new URLSearchParams(searchParams);
              params.set("page", "1");
              params.set("pageSize", customSize.toString());
              router.push(`/admin/notifications?${params.toString()}`);
            }
          }}
        />
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
