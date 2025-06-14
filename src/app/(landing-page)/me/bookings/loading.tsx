import { TabsContent } from "@/components/ui/tabs";
import { DashboardHeader } from "@/features/admin/components/dashboard-header";
import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BookingsLoading() {
  return (
    <TabsContent value="bookings" className="pt-6">
      <div className="space-y-6">
        <DashboardHeader
          title="Booking Saya"
          description="Lihat dan kelola semua reservasi ruangan dan riwayat booking Anda."
          icon={BookOpen}
        />

        {/* Loading skeletons */}
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <Card
              key={i}
              className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <CardContent className="p-6">
                <div className="grid grid-cols-[4px_1fr_auto] sm:grid-cols-[4px_2fr_1.2fr_1fr_auto] gap-4 sm:gap-6 items-center">
                  <Skeleton className="w-1 h-16 bg-gray-300 dark:bg-gray-600" />
                  <div className="space-y-2 min-w-0">
                    <Skeleton className="h-5 w-32 bg-gray-300 dark:bg-gray-600" />
                    <Skeleton className="h-4 w-48 bg-gray-200 dark:bg-gray-700" />
                    <div className="sm:hidden">
                      <div className="p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-1">
                        <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-gray-700" />
                        <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700" />
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:block min-w-0">
                    <div className="space-y-2">
                      <div className="p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-2">
                        <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-gray-700" />
                        <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700" />
                      </div>
                      <Skeleton className="h-4 w-20 bg-gray-200 dark:bg-gray-700" />
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <Skeleton className="h-6 w-16 bg-gray-300 dark:bg-gray-600" />
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Skeleton className="h-8 w-16 bg-gray-300 dark:bg-gray-600" />
                    <div className="sm:hidden">
                      <Skeleton className="h-5 w-14 bg-gray-300 dark:bg-gray-600" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination loading skeleton */}
        <div className="mt-8 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-16 bg-gray-300 dark:bg-gray-600" />
                <Skeleton className="h-9 w-32 bg-gray-300 dark:bg-gray-600" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-20 bg-gray-300 dark:bg-gray-600" />
                <Skeleton className="h-9 w-16 bg-gray-300 dark:bg-gray-600" />
                <Skeleton className="h-9 w-20 bg-gray-300 dark:bg-gray-600" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-40 bg-gray-300 dark:bg-gray-600" />
              <div className="flex items-center gap-1">
                <Skeleton className="h-9 w-20 bg-gray-300 dark:bg-gray-600" />
                <Skeleton className="h-9 w-9 bg-gray-300 dark:bg-gray-600" />
                <Skeleton className="h-9 w-9 bg-gray-300 dark:bg-gray-600" />
                <Skeleton className="h-9 w-9 bg-gray-300 dark:bg-gray-600" />
                <Skeleton className="h-9 w-20 bg-gray-300 dark:bg-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  );
}
