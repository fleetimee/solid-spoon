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
import { Calendar, Filter, X, RotateCcw, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReservationFilter } from "../api/getUserReservations";

interface BookingsFilterProps {
  filter: ReservationFilter;
  totalItems: number;
  currentPage: number;
}

const filterLabels: Record<ReservationFilter, string> = {
  all: "🌟 Semua",
  approved: "✅ Disetujui",
  pending: "⏳ Menunggu",
  rejected: "❌ Ditolak",
  cancelled: "🚫 Dibatalkan",
  completed: "🎉 Selesai",
};

const filterColors: Record<ReservationFilter, string> = {
  all: "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-slate-300 dark:from-slate-800/50 dark:to-slate-700/50 dark:text-slate-300 dark:border-slate-600/50 shadow-sm hover:shadow-md",
  approved:
    "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-300 dark:from-emerald-900/30 dark:to-green-900/30 dark:text-emerald-400 dark:border-emerald-700/50 shadow-sm hover:shadow-md",
  pending:
    "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border-amber-300 dark:from-amber-900/30 dark:to-yellow-900/30 dark:text-amber-400 dark:border-amber-700/50 shadow-sm hover:shadow-md",
  rejected:
    "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border-red-300 dark:from-red-900/30 dark:to-rose-900/30 dark:text-red-400 dark:border-red-700/50 shadow-sm hover:shadow-md",
  cancelled:
    "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-300 dark:from-gray-800/50 dark:to-slate-800/50 dark:text-gray-300 dark:border-gray-600/50 shadow-sm hover:shadow-md",
  completed:
    "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-300 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-400 dark:border-blue-700/50 shadow-sm hover:shadow-md",
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
        "border-0 shadow-xl shadow-purple-100/20 dark:shadow-purple-900/10",
        "bg-gradient-to-br from-white/80 via-purple-50/30 to-indigo-50/40",
        "dark:from-gray-900/80 dark:via-purple-950/30 dark:to-indigo-950/40",
        "backdrop-blur-xl backdrop-saturate-150",
        "ring-1 ring-white/20 dark:ring-white/10",
        "relative overflow-hidden",
        "transition-all duration-300 hover:shadow-2xl hover:shadow-purple-200/30 dark:hover:shadow-purple-900/20",
        "hover:scale-[1.01] group"
      )}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 pointer-events-none" />

      <CardContent className="p-6 relative z-10">
        <div className="flex flex-col space-y-6">
          {/* Header section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-2.5 rounded-2xl",
                    "bg-gradient-to-br from-purple-500/20 to-indigo-500/20",
                    "ring-1 ring-purple-500/30 dark:ring-purple-400/30",
                    "group-hover:from-purple-500/30 group-hover:to-indigo-500/30",
                    "transition-all duration-300 group-hover:scale-110"
                  )}
                >
                  <Search className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  🔍 Filter Booking
                </h3>
              </div>
              {isFiltered && (
                <Badge
                  className={cn(
                    "ml-3 font-semibold text-sm px-4 py-2 rounded-full",
                    "transition-all duration-300 hover:scale-105",
                    "backdrop-blur-sm border-0",
                    filterColors[filter]
                  )}
                >
                  {currentFilterLabel}
                </Badge>
              )}
            </div>

            {/* Results summary */}
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  {totalItems}
                </span>{" "}
                hasil ditemukan ✨
              </div>
              {isFiltered && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className={cn(
                    "h-9 px-4 rounded-full font-medium",
                    "bg-gradient-to-r from-gray-100/50 to-gray-200/50",
                    "dark:from-gray-800/50 dark:to-gray-700/50",
                    "hover:from-purple-100/50 hover:to-indigo-100/50",
                    "dark:hover:from-purple-900/30 dark:hover:to-indigo-900/30",
                    "transition-all duration-300 hover:scale-105",
                    "text-gray-700 hover:text-purple-700 dark:text-gray-300 dark:hover:text-purple-300",
                    "backdrop-blur-sm border border-white/20 dark:border-white/10"
                  )}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Filter controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-1.5 rounded-xl",
                    "bg-gradient-to-br from-indigo-500/20 to-purple-500/20",
                    "ring-1 ring-indigo-500/30 dark:ring-indigo-400/30"
                  )}
                >
                  <Filter className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  📊 Status
                </span>
              </div>
              <Select value={filter} onValueChange={handleFilterChange}>
                <SelectTrigger
                  className={cn(
                    "h-11 w-44 rounded-2xl font-medium",
                    "bg-white/60 dark:bg-gray-900/60",
                    "border border-purple-200/50 dark:border-purple-800/30",
                    "hover:bg-white/80 dark:hover:bg-gray-900/80",
                    "hover:border-purple-300/60 dark:hover:border-purple-700/40",
                    "focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400",
                    "transition-all duration-300 hover:scale-105",
                    "backdrop-blur-sm shadow-lg shadow-purple-100/20 dark:shadow-purple-900/10"
                  )}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  className={cn(
                    "bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl",
                    "border border-purple-200/50 dark:border-purple-800/30",
                    "rounded-2xl shadow-2xl shadow-purple-200/30 dark:shadow-purple-900/20"
                  )}
                >
                  <SelectItem value="all" className="rounded-xl font-medium">
                    🌟 Semua
                  </SelectItem>
                  <SelectItem
                    value="approved"
                    className="rounded-xl font-medium"
                  >
                    ✅ Disetujui
                  </SelectItem>
                  <SelectItem
                    value="pending"
                    className="rounded-xl font-medium"
                  >
                    ⏳ Menunggu
                  </SelectItem>
                  <SelectItem
                    value="rejected"
                    className="rounded-xl font-medium"
                  >
                    ❌ Ditolak
                  </SelectItem>
                  <SelectItem
                    value="cancelled"
                    className="rounded-xl font-medium"
                  >
                    🚫 Dibatalkan
                  </SelectItem>
                  <SelectItem
                    value="completed"
                    className="rounded-xl font-medium"
                  >
                    🎉 Selesai
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active filter indicator */}
          {isFiltered && (
            <div
              className={cn(
                "flex items-center gap-3 pt-4",
                "border-t border-gradient-to-r from-purple-200/30 via-indigo-200/30 to-purple-200/30",
                "dark:from-purple-800/20 dark:via-indigo-800/20 dark:to-purple-800/20"
              )}
            >
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                ✨ Filter aktif:
              </span>
              <Badge
                className={cn(
                  "font-semibold text-sm px-4 py-2 rounded-full",
                  "flex items-center gap-2 backdrop-blur-sm border-0",
                  "transition-all duration-300 hover:scale-105",
                  filterColors[filter]
                )}
              >
                {currentFilterLabel}
                <button
                  onClick={handleClearFilters}
                  className={cn(
                    "ml-1 p-1 rounded-full",
                    "hover:bg-black/10 dark:hover:bg-white/10",
                    "transition-all duration-200 hover:scale-110"
                  )}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
