"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
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
} from "@/components/ui/select";
import { Hash } from "lucide-react";

interface BookingsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export function BookingsPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
}: BookingsPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [customSizeInput, setCustomSizeInput] = useState("");

  if (totalPages <= 1) return null;

  const getPaginationUrl = (targetPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", targetPage.toString());
    return `/me/bookings?${params.toString()}`;
  };

  const handlePageSizeChange = (newPageSize: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("pageSize", newPageSize);
    router.push(`/me/bookings?${params.toString()}`);
    setCustomSizeInput("");
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

  const currentSize = pageSize.toString();
  const isPresetSize = ["10", "12", "20", "50"].includes(currentSize);

  return (
    <div
      className={cn(
        "mt-8 p-4 rounded-lg border",
        "bg-gradient-to-r from-blue-50/30 to-indigo-50/30",
        "dark:from-blue-950/10 dark:to-indigo-950/10",
        "border-blue-200/20 dark:border-blue-800/20",
        "backdrop-blur-sm"
      )}
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Page Size Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-foreground">
                Per halaman:
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={isPresetSize ? currentSize : undefined}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger
                  className={cn(
                    "h-9 w-16 border-blue-200/40 dark:border-blue-800/30",
                    "bg-white/60 dark:bg-gray-950/60",
                    "hover:bg-blue-50 dark:hover:bg-blue-950/30",
                    "transition-colors duration-200"
                  )}
                >
                  <SelectValue placeholder="Ukuran" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="number"
                min="1"
                max="100"
                className={cn(
                  "h-9 w-20 border-blue-200/40 dark:border-blue-800/30",
                  "bg-white/60 dark:bg-gray-950/60",
                  "hover:bg-blue-50 dark:hover:bg-blue-950/30",
                  "focus:ring-blue-500/20 focus:border-blue-400",
                  "transition-colors duration-200"
                )}
                placeholder="Kustom"
                value={customSizeInput}
                onChange={(e) => setCustomSizeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const customSize = parseInt(customSizeInput);
                    if (
                      isNaN(customSize) ||
                      customSize <= 0 ||
                      customSize > 100
                    ) {
                      setCustomSizeInput("");
                      return;
                    }
                    handlePageSizeChange(customSize.toString());
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Pagination Info and Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Pagination Info */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Menampilkan{" "}
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {Math.min((currentPage - 1) * pageSize + 1, totalItems)}
            </span>{" "}
            -{" "}
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {Math.min(currentPage * pageSize, totalItems)}
            </span>{" "}
            dari{" "}
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {totalItems}
            </span>{" "}
            booking
          </div>

          {/* Pagination Controls */}
          <Pagination>
            <PaginationContent className="gap-1">
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    href={getPaginationUrl(currentPage - 1)}
                    className={cn(
                      "hover:bg-blue-100 dark:hover:bg-blue-900/30",
                      "hover:text-blue-700 dark:hover:text-blue-300",
                      "transition-all duration-200 hover:scale-105"
                    )}
                  />
                </PaginationItem>
              )}

              {getPaginationItems()}

              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext
                    href={getPaginationUrl(currentPage + 1)}
                    className={cn(
                      "hover:bg-blue-100 dark:hover:bg-blue-900/30",
                      "hover:text-blue-700 dark:hover:text-blue-300",
                      "transition-all duration-200 hover:scale-105"
                    )}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
