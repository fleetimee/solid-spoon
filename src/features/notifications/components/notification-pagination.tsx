"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NotificationFilter } from "../types/notification";
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
import { ChevronLeft, ChevronRight, Hash } from "lucide-react";

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
    <div
      className={cn(
        "mt-8 p-4 rounded-lg border",
        "bg-gradient-to-r from-purple-50/30 to-violet-50/30",
        "dark:from-purple-950/10 dark:to-violet-950/10",
        "border-purple-200/20 dark:border-purple-800/20",
        "backdrop-blur-sm"
      )}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Page size selector with modern styling */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-foreground">
              Items per page:
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={isPresetSize ? currentSize : undefined}
              onValueChange={(value) => {
                const params = new URLSearchParams(searchParams);
                params.set("page", "1");
                params.set("pageSize", value);
                router.push(`/admin/notifications?${params.toString()}`);
                setCustomSizeInput("");
              }}
            >
              <SelectTrigger
                className={cn(
                  "h-9 w-16 border-purple-200/40 dark:border-purple-800/30",
                  "bg-white/60 dark:bg-gray-950/60",
                  "hover:bg-purple-50 dark:hover:bg-purple-950/30",
                  "transition-colors duration-200"
                )}
              >
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm">
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="number"
              min="1"
              max="50"
              className={cn(
                "h-9 w-20 border-purple-200/40 dark:border-purple-800/30",
                "bg-white/60 dark:bg-gray-950/60",
                "hover:bg-purple-50 dark:hover:bg-purple-950/30",
                "focus:ring-purple-500/20 focus:border-purple-400",
                "transition-colors duration-200"
              )}
              placeholder="Custom"
              value={customSizeInput}
              onChange={(e) => setCustomSizeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const customSize = parseInt(customSizeInput);
                  if (isNaN(customSize) || customSize <= 0 || customSize > 50) {
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
        </div>

        {/* Enhanced pagination */}
        <Pagination>
          <PaginationContent className="gap-1">
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href={getPaginationUrl(currentPage - 1)}
                  className={cn(
                    "hover:bg-purple-100 dark:hover:bg-purple-900/30",
                    "hover:text-purple-700 dark:hover:text-purple-300",
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
                    "hover:bg-purple-100 dark:hover:bg-purple-900/30",
                    "hover:text-purple-700 dark:hover:text-purple-300",
                    "transition-all duration-200 hover:scale-105"
                  )}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
