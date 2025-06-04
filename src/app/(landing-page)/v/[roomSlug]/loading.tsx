import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHeader,
  TableHead,
} from "@/components/ui/table";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";

export default function LoadingRoomDetail() {
  const breadcrumbItems = [
    { label: <Skeleton className="h-4 w-16" /> }, // Home
    { label: <Skeleton className="h-4 w-20" /> }, // Rooms
    { label: <Skeleton className="h-4 w-32" /> }, // Room Name
  ];

  return (
    <>
      <BreadcrumbSetter items={breadcrumbItems} />
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-violet-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
        {/* Hero Section Skeleton */}
        <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 dark:from-violet-800 dark:via-purple-800 dark:to-pink-800">
          <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>

          <div className="relative max-w-screen-xl mx-auto px-6 py-12">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-sm border border-white/30">
                <Skeleton className="h-4 w-4 rounded bg-white/30" />
                <Skeleton className="h-4 w-32 bg-white/30" />
              </div>

              <div className="space-y-3">
                <Skeleton className="h-12 md:h-16 w-3/4 mx-auto bg-white/20" />
                <Skeleton className="h-6 w-1/2 mx-auto bg-white/20" />
              </div>

              {/* Room Quick Info Skeleton */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded bg-white/30" />
                  <Skeleton className="h-4 w-24 bg-white/30" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded bg-white/30" />
                  <Skeleton className="h-4 w-20 bg-white/30" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded bg-white/30" />
                  <Skeleton className="h-4 w-16 bg-white/30" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-6 py-12">
          {/* Compact Single Column Layout */}
          <div className="space-y-8">
            {/* Modern Image Gallery Skeleton */}
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-white/70 dark:bg-card/70 backdrop-blur-sm border-0">
              <Skeleton className="aspect-[4/3] w-full" />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Booking Section Skeleton */}
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-2xl bg-white/70 dark:bg-card/70 backdrop-blur-sm p-6">
                  <div className="space-y-6">
                    {/* Calendar section skeleton */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-lg bg-violet-200" />
                        <Skeleton className="h-6 w-1/3 bg-violet-200" />
                      </div>
                      <Skeleton className="h-64 w-full rounded-lg" />
                    </div>

                    {/* Time selection skeleton */}
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-1/4" />
                      <div className="grid grid-cols-3 gap-2">
                        <Skeleton className="h-8 w-full rounded" />
                        <Skeleton className="h-8 w-full rounded" />
                        <Skeleton className="h-8 w-full rounded" />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sidebar with Amenities, Location, and Book Now Button */}
              <div className="space-y-6">
                {/* Amenities Card Skeleton */}
                <Card className="border-0 shadow-2xl bg-white/70 dark:bg-card/70 backdrop-blur-sm">
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-lg bg-violet-200" />
                      <Skeleton className="h-6 w-1/2 bg-violet-200" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Skeleton className="h-8 w-full rounded-full" />
                      <Skeleton className="h-8 w-full rounded-full" />
                      <Skeleton className="h-8 w-full rounded-full" />
                      <Skeleton className="h-8 w-full rounded-full" />
                    </div>
                  </div>
                </Card>

                {/* Location Card Skeleton */}
                <Card className="border-0 shadow-2xl bg-white/70 dark:bg-card/70 backdrop-blur-sm">
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-lg bg-violet-200" />
                      <Skeleton className="h-6 w-1/3 bg-violet-200" />
                    </div>
                    <div className="p-4 rounded-xl bg-violet-50/50 dark:bg-violet-950/20">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4 mt-2" />
                    </div>
                  </div>
                </Card>

                {/* Enhanced Book Now Button Skeleton */}
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 backdrop-blur-sm">
                  <div className="p-6 space-y-4">
                    <div className="text-center space-y-2">
                      <Skeleton className="h-6 w-3/4 mx-auto bg-violet-200" />
                      <Skeleton className="h-4 w-1/2 mx-auto bg-violet-200" />
                    </div>
                    <Skeleton className="h-12 w-full rounded-md bg-gradient-to-r from-violet-300 to-purple-300" />
                  </div>
                </Card>

                {/* Room Rules Card Skeleton */}
                <Card className="border-0 shadow-2xl bg-white/70 dark:bg-card/70 backdrop-blur-sm">
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-lg bg-violet-200" />
                      <Skeleton className="h-6 w-2/3 bg-violet-200" />
                    </div>
                    <div className="space-y-3">
                      {/* Rule Section Skeletons */}
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg bg-violet-50/50 dark:bg-violet-950/20 border border-violet-200/50 dark:border-violet-800/50"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Skeleton className="h-4 w-4 rounded bg-violet-300" />
                              <Skeleton className="h-4 w-24 bg-violet-300" />
                            </div>
                            <Skeleton className="h-4 w-4 bg-violet-300" />
                          </div>
                        </div>
                      ))}
                      {/* Important Notice Skeleton */}
                      <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                        <div className="flex items-start space-x-2">
                          <Skeleton className="h-4 w-4 rounded mt-0.5" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-3/4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* User Reservations Section Skeleton */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-lg bg-violet-200" />
                <Skeleton className="h-6 w-1/3 bg-violet-200" />
              </div>
              <div className="rounded-xl border-0 shadow-2xl bg-white/70 dark:bg-card/70 backdrop-blur-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>
                        <Skeleton className="h-4 w-12" />
                      </TableHead>
                      <TableHead>
                        <Skeleton className="h-4 w-20" />
                      </TableHead>
                      <TableHead>
                        <Skeleton className="h-4 w-16" />
                      </TableHead>
                      <TableHead>
                        <Skeleton className="h-4 w-14" />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-28" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-36" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-18 rounded-full" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Recent Reservations Section Skeleton */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-lg bg-violet-200" />
                <Skeleton className="h-6 w-1/3 bg-violet-200" />
              </div>
              <div className="rounded-xl border-0 shadow-2xl bg-white/70 dark:bg-card/70 backdrop-blur-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>
                        <Skeleton className="h-4 w-12" />
                      </TableHead>
                      <TableHead>
                        <Skeleton className="h-4 w-10" />
                      </TableHead>
                      <TableHead>
                        <Skeleton className="h-4 w-20" />
                      </TableHead>
                      <TableHead>
                        <Skeleton className="h-4 w-16" />
                      </TableHead>
                      <TableHead>
                        <Skeleton className="h-4 w-14" />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Skeleton className="h-4 w-28" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-7 w-7 rounded-full" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-28" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-7 w-7 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-36" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-18 rounded-full" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-7 w-7 rounded-full" />
                          <Skeleton className="h-4 w-18" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-28" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-30" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
