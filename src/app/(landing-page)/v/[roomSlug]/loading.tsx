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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <BreadcrumbSetter items={breadcrumbItems} />

      <div className="w-full max-w-screen-xl mx-auto px-6 py-6">
        {/* Compact Single Column Layout */}
        <div className="space-y-6">
          {/* Room Detail Header Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4" /> {/* Room name */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>

          {/* E-commerce Style Image Gallery Skeleton */}
          <div className="space-y-4">
            {/* Main product image - larger and more prominent */}
            <div className="relative rounded-xl overflow-hidden shadow-lg bg-muted/20">
              <Skeleton className="aspect-[4/3] w-full" />
            </div>

            {/* Thumbnail row - e-commerce style */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              <div className="flex gap-3 min-w-full">
                <Skeleton className="aspect-square w-20 h-20 rounded-lg border-2 border-primary/20 flex-shrink-0" />
                <Skeleton className="aspect-square w-20 h-20 rounded-lg border border-muted-foreground/20 flex-shrink-0" />
                <Skeleton className="aspect-square w-20 h-20 rounded-lg border border-muted-foreground/20 flex-shrink-0" />
                <Skeleton className="aspect-square w-20 h-20 rounded-lg border border-muted-foreground/20 flex-shrink-0" />
                <Skeleton className="aspect-square w-20 h-20 rounded-lg border border-muted-foreground/20 flex-shrink-0" />
                <Skeleton className="aspect-square w-20 h-20 rounded-lg border border-muted-foreground/20 flex-shrink-0" />
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Booking Section Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              {/* Calendar section skeleton */}
              <Card className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-1/3" /> {/* Title */}
                  <Skeleton className="h-64 w-full rounded-lg" />{" "}
                  {/* Calendar */}
                </div>
              </Card>

              {/* Time selection skeleton */}
              <Card className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-1/4" />{" "}
                  {/* Time selection title */}
                  <div className="grid grid-cols-3 gap-2">
                    <Skeleton className="h-8 w-full rounded" />
                    <Skeleton className="h-8 w-full rounded" />
                    <Skeleton className="h-8 w-full rounded" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Amenities, Location, and Book Now Button */}
            <div className="space-y-6">
              {/* Amenities Section Skeleton */}
              <Card className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-1/2" /> {/* Title */}
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-12 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                </div>
              </Card>

              {/* Location Section Skeleton */}
              <Card className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-1/3" /> {/* Title */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </Card>

              {/* Book Now Button Skeleton */}
              <div className="space-y-3">
                <Skeleton className="h-12 w-full rounded-md" />
              </div>

              {/* Room Rules Section Skeleton */}
              <Card className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-2/3" /> {/* Title */}
                  <div className="space-y-3">
                    {/* Rule Section 1 */}
                    <div className="p-3 rounded-lg bg-muted/30 border border-muted">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-4 w-4 rounded" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-4 w-4" />
                      </div>
                    </div>
                    {/* Rule Section 2 */}
                    <div className="p-3 rounded-lg bg-muted/30 border border-muted">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-4 w-4 rounded" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-4 w-4" />
                      </div>
                    </div>
                    {/* Rule Section 3 */}
                    <div className="p-3 rounded-lg bg-muted/30 border border-muted">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-4 w-4 rounded" />
                          <Skeleton className="h-4 w-28" />
                        </div>
                        <Skeleton className="h-4 w-4" />
                      </div>
                    </div>
                    {/* Rule Section 4 */}
                    <div className="p-3 rounded-lg bg-muted/30 border border-muted">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-4 w-4 rounded" />
                          <Skeleton className="h-4 w-36" />
                        </div>
                        <Skeleton className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
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
              </Card>
            </div>
          </div>

          {/* User Reservations Section Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3" /> {/* Title */}
            <div className="rounded-xl border bg-card/50 backdrop-blur-sm shadow-md overflow-hidden">
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
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3" /> {/* Title */}
            <div className="rounded-xl border bg-card/50 backdrop-blur-sm shadow-md overflow-hidden">
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
  );
}
