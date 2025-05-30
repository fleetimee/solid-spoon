import { Skeleton } from "@/components/ui/skeleton";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RoomDetailLoading() {
  const roomBreadcrumb = [
    { label: "Rooms", href: "/admin/rooms" },
    { label: "Loading..." },
  ];

  return (
    <>
      <BreadcrumbSetter items={roomBreadcrumb} />

      <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
        <RoomDetailHeaderSkeleton />

        <RoomDetailStatsSkeleton />

        <RoomImageSectionSkeleton />

        <RoomInfoSectionSkeleton />

        <RoomReservationsSectionSkeleton />
      </div>
    </>
  );
}

// Room Detail Header Skeleton
function RoomDetailHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20 rounded-md" />
          <Skeleton className="h-10 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}

// Room Detail Stats Skeleton - Matches RoomDetailStats with professional gradient cards
function RoomDetailStatsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-40" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 shadow-lg animate-pulse"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <CardTitle>
                  <Skeleton className="h-4 w-24" />
                </CardTitle>
                <Skeleton className="w-10 h-10 rounded-full" />
              </CardHeader>
              <CardContent className="relative">
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Additional insights skeleton */}
      <div className="flex flex-wrap gap-2 pt-2">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

// Room Image Section Skeleton
function RoomImageSectionSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="rounded-lg overflow-hidden shadow-lg">
        <Skeleton className="w-full h-[400px]" />
      </div>
    </div>
  );
}

// Room Info Section Skeleton - Matches RoomInfoSection with professional card design
function RoomInfoSectionSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-40" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array(2)
          .fill(0)
          .map((_, cardIndex) => (
            <Card
              key={cardIndex}
              className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-5 w-32" />
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {Array(3)
                  .fill(0)
                  .map((_, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center gap-4 p-3 rounded-lg bg-white/70 dark:bg-gray-800/70 border border-gray-100 dark:border-gray-700"
                    >
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Facilities Section Skeleton */}
      <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-40" />
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-3">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <Skeleton key={index} className="h-8 w-20 rounded-full" />
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Room Reservations Section Skeleton - Matches RoomReservationsSection design
function RoomReservationsSectionSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-32" />
      </div>

      <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-6 w-12 rounded-full ml-2" />
          </div>
          <Skeleton className="h-9 w-40 rounded-md" />
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-white/50 dark:bg-gray-800/50">
            {/* Table Header Skeleton */}
            <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
              <div className="grid grid-cols-5 gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>

            {/* Table Rows Skeleton */}
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="p-4">
                    <div className="grid grid-cols-5 gap-4 items-center">
                      <Skeleton className="h-4 w-32" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
