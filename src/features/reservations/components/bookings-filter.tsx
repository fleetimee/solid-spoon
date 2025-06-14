"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Filter, X, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReservationFilter } from "../api/getUserReservations";

interface BookingsFilterProps {
  filter: ReservationFilter;
  totalItems: number;
  currentPage: number;
}

const filterLabels: Record<ReservationFilter, string> = {
  all: "Semua",
  approved: "Disetujui",
  pending: "Menunggu",
  rejected: "Ditolak",
  cancelled: "Dibatalkan",
  completed: "Selesai",
};

const filterColors: Record<ReservationFilter, string> = {
  all: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600",
  approved:
    "bg-green-100 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800",
  pending:
    "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
  rejected:
    "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800",
  cancelled:
    "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600",
  completed:
    "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800",
};

export function BookingsFilter({
  filter,
  totalItems,
  currentPage,
}: BookingsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (newFilter: ReservationFilter) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1"); // Reset to first page when filter changes
    params.set("filter", newFilter);
    router.push(`/me/bookings?${params.toString()}`);
  };

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("filter", "all");
    router.push(`/me/bookings?${params.toString()}`);
  };

  const isFiltered = filter !== "all";
  const currentFilterLabel = filterLabels[filter];

  return (
    <Card
      className={cn(
        "border-0 shadow-sm",
        "bg-gradient-to-r from-blue-50/50 to-indigo-50/50",
        "dark:from-blue-950/20 dark:to-indigo-950/20",
        "backdrop-blur-sm"
      )}
    >
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          {/* Header section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Filter className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Filter Booking
                </h3>
              </div>
              {isFiltered && (
                <Badge
                  variant="secondary"
                  className={cn(
                    "ml-2 font-medium text-xs px-2 py-1",
                    filterColors[filter]
                  )}
                >
                  {currentFilterLabel}
                </Badge>
              )}
            </div>

            {/* Results summary */}
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {totalItems}
                </span>{" "}
                booking ditemukan
              </div>
              {isFiltered && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="h-8 px-2 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Filter controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-foreground">
                  Status:
                </span>
              </div>
              <Select value={filter} onValueChange={handleFilterChange}>
                <SelectTrigger
                  className={cn(
                    "h-9 w-36 border-blue-200/40 dark:border-blue-800/30",
                    "bg-white/60 dark:bg-gray-950/60",
                    "hover:bg-blue-50 dark:hover:bg-blue-950/30",
                    "transition-colors duration-200",
                    "focus:ring-blue-500/20 focus:border-blue-400"
                  )}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm">
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="approved">Disetujui</SelectItem>
                  <SelectItem value="pending">Menunggu</SelectItem>
                  <SelectItem value="rejected">Ditolak</SelectItem>
                  <SelectItem value="cancelled">Dibatalkan</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Future filter placeholder - for extensibility */}
            <div className="hidden">
              {/* Space reserved for future filters like date range, search, etc. */}
            </div>
          </div>

          {/* Active filter indicator */}
          {isFiltered && (
            <div className="flex items-center gap-2 pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Filter aktif:
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "font-medium text-xs px-2 py-1 flex items-center gap-1",
                  filterColors[filter]
                )}
              >
                {currentFilterLabel}
                <button
                  onClick={handleClearFilters}
                  className="ml-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-sm p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
