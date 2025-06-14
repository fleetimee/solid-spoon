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
import { Hash, ChevronLeft, ChevronRight } from "lucide-react";

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
            className={cn(
              "w-12 h-12 rounded-2xl font-semibold transition-all duration-300",
              page === currentPage
                ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/30 scale-110"
                : "bg-white/60 dark:bg-gray-800/60 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:scale-105 backdrop-blur-sm"
            )}
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
        <PaginationLink
          href={getPaginationUrl(1)}
          isActive={1 === currentPage}
          className={cn(
            "w-12 h-12 rounded-2xl font-semibold transition-all duration-300",
            1 === currentPage
              ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/30 scale-110"
              : "bg-white/60 dark:bg-gray-800/60 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:scale-105 backdrop-blur-sm"
          )}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Show ellipsis if current page is beyond page 3
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis className="text-purple-400" />
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
            className={cn(
              "w-12 h-12 rounded-2xl font-semibold transition-all duration-300",
              i === currentPage
                ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/30 scale-110"
                : "bg-white/60 dark:bg-gray-800/60 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:scale-105 backdrop-blur-sm"
            )}
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
          <PaginationEllipsis className="text-purple-400" />
        </PaginationItem>
      );
    }

    // Always show last page
    items.push(
      <PaginationItem key={totalPages}>
        <PaginationLink
          href={getPaginationUrl(totalPages)}
          isActive={totalPages === currentPage}
          className={cn(
            "w-12 h-12 rounded-2xl font-semibold transition-all duration-300",
            totalPages === currentPage
              ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/30 scale-110"
              : "bg-white/60 dark:bg-gray-800/60 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:scale-105 backdrop-blur-sm"
          )}
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
    <div className="flex flex-col items-center justify-center mt-12 space-y-8">
      {/* Centered Page Size Controls */}
      <div className="flex items-center justify-center gap-6">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "p-2 rounded-2xl",
              "bg-gradient-to-br from-purple-500/20 to-indigo-500/20",
              "ring-1 ring-purple-500/30 dark:ring-purple-400/30"
            )}
          >
            <Hash className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={isPresetSize ? currentSize : undefined}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger
                className={cn(
                  "h-12 w-20 rounded-2xl font-semibold border-0",
                  "bg-gradient-to-r from-white/80 to-purple-50/60",
                  "dark:from-gray-900/80 dark:to-purple-950/60",
                  "hover:from-purple-100/80 hover:to-indigo-100/60",
                  "dark:hover:from-purple-900/60 dark:hover:to-indigo-900/60",
                  "ring-1 ring-purple-200/50 dark:ring-purple-800/30",
                  "transition-all duration-300 hover:scale-105",
                  "backdrop-blur-sm shadow-lg shadow-purple-100/20 dark:shadow-purple-900/10"
                )}
              >
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent
                className={cn(
                  "bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl",
                  "border border-purple-200/50 dark:border-purple-800/30",
                  "rounded-2xl shadow-2xl shadow-purple-200/30 dark:shadow-purple-900/20"
                )}
              >
                <SelectItem value="10" className="rounded-xl font-medium">
                  10
                </SelectItem>
                <SelectItem value="12" className="rounded-xl font-medium">
                  12
                </SelectItem>
                <SelectItem value="20" className="rounded-xl font-medium">
                  20
                </SelectItem>
                <SelectItem value="50" className="rounded-xl font-medium">
                  50
                </SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="number"
              min="1"
              max="100"
              className={cn(
                "h-12 w-24 rounded-2xl font-semibold border-0 text-center",
                "bg-gradient-to-r from-white/80 to-indigo-50/60",
                "dark:from-gray-900/80 dark:to-indigo-950/60",
                "hover:from-indigo-100/80 hover:to-purple-100/60",
                "dark:hover:from-indigo-900/60 dark:hover:to-purple-900/60",
                "ring-1 ring-indigo-200/50 dark:ring-indigo-800/30",
                "focus:ring-4 focus:ring-purple-500/20",
                "transition-all duration-300 hover:scale-105",
                "backdrop-blur-sm shadow-lg shadow-indigo-100/20 dark:shadow-indigo-900/10"
              )}
              placeholder="Custom"
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

      {/* Centered Pagination Info */}
      <div className="text-center">
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
          📄 Menampilkan{" "}
          <span className="font-bold text-purple-600 dark:text-purple-400">
            {Math.min((currentPage - 1) * pageSize + 1, totalItems)}
          </span>{" "}
          -{" "}
          <span className="font-bold text-purple-600 dark:text-purple-400">
            {Math.min(currentPage * pageSize, totalItems)}
          </span>{" "}
          dari{" "}
          <span className="font-bold text-purple-600 dark:text-purple-400">
            {totalItems}
          </span>{" "}
          booking ✨
        </div>
      </div>

      {/* Centered Pagination Controls */}
      <div className="flex justify-center">
        <Pagination>
          <PaginationContent className="gap-2">
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href={getPaginationUrl(currentPage - 1)}
                  className={cn(
                    "h-12 px-6 rounded-2xl font-semibold",
                    "bg-gradient-to-r from-white/80 to-purple-50/60",
                    "dark:from-gray-900/80 dark:to-purple-950/60",
                    "hover:from-purple-100/80 hover:to-indigo-100/60",
                    "dark:hover:from-purple-900/60 dark:hover:to-indigo-900/60",
                    "ring-1 ring-purple-200/50 dark:ring-purple-800/30",
                    "transition-all duration-300 hover:scale-105",
                    "backdrop-blur-sm shadow-lg shadow-purple-100/20 dark:shadow-purple-900/10",
                    "text-purple-700 dark:text-purple-300"
                  )}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Prev
                </PaginationPrevious>
              </PaginationItem>
            )}

            {getPaginationItems()}

            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext
                  href={getPaginationUrl(currentPage + 1)}
                  className={cn(
                    "h-12 px-6 rounded-2xl font-semibold",
                    "bg-gradient-to-r from-white/80 to-indigo-50/60",
                    "dark:from-gray-900/80 dark:to-indigo-950/60",
                    "hover:from-indigo-100/80 hover:to-purple-100/60",
                    "dark:hover:from-indigo-900/60 dark:hover:to-purple-900/60",
                    "ring-1 ring-indigo-200/50 dark:ring-indigo-800/30",
                    "transition-all duration-300 hover:scale-105",
                    "backdrop-blur-sm shadow-lg shadow-indigo-100/20 dark:shadow-indigo-900/10",
                    "text-indigo-700 dark:text-indigo-300"
                  )}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </PaginationNext>
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
