import { Skeleton } from "@/components/ui/skeleton";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RoomDetailLoading() {
  const roomBreadcrumb = [
    { label: "Ruangan", href: "/admin/rooms" },
    { label: "Memuat..." },
  ];

  return (
    <>
      <BreadcrumbSetter items={roomBreadcrumb} />

      <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
        <RoomDetailHeaderSkeleton />

        <div className="bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/10 dark:to-purple-950/10 rounded-xl p-6 shadow-lg border-0 backdrop-blur-sm">
          <div className="space-y-8">
            <RoomDetailStatsSkeleton />

            <RoomImageSectionSkeleton />

            <RoomInfoSectionSkeleton />

            <RoomReservationsSectionSkeleton />
          </div>
        </div>
      </div>
    </>
  );
}

// Room Detail Header Skeleton
function RoomDetailHeaderSkeleton() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/10 dark:to-purple-950/10 rounded-xl p-6 md:p-8 shadow-lg border-0 backdrop-blur-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-200 to-purple-200 dark:from-violet-800 dark:to-purple-800" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-32 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-4 backdrop-blur-sm">
            <Skeleton className="h-4 w-full max-w-2xl mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        <div className="flex gap-3 shrink-0">
          <Skeleton className="h-10 w-28 rounded-md bg-gradient-to-r from-violet-200 to-purple-200 dark:from-violet-700 dark:to-purple-700" />
          <Skeleton className="h-10 w-32 rounded-md bg-gradient-to-r from-red-200 to-rose-200 dark:from-red-700 dark:to-rose-700" />
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
        <div className="w-1 h-6 bg-gradient-to-b from-violet-400 to-purple-500 rounded-full"></div>
        <Skeleton className="h-6 w-40" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-0 bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20 shadow-lg animate-pulse backdrop-blur-sm"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <CardTitle>
                  <Skeleton className="h-4 w-24" />
                </CardTitle>
                <Skeleton className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-200 to-purple-200 dark:from-violet-800 dark:to-purple-800" />
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
        <div className="w-1 h-6 bg-gradient-to-b from-violet-400 to-purple-500 rounded-full"></div>
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="relative overflow-hidden rounded-xl shadow-lg border-0 bg-gradient-to-br from-violet-50/20 to-purple-50/20 dark:from-violet-950/20 dark:to-purple-950/20 p-2 backdrop-blur-sm">
        <Skeleton className="w-full h-[400px] rounded-lg" />
      </div>
    </div>
  );
}

// Room Info Section Skeleton - Matches RoomInfoSection with professional card design
function RoomInfoSectionSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="w-1 h-6 bg-gradient-to-b from-violet-400 to-purple-500 rounded-full"></div>
        <Skeleton className="h-6 w-40" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array(2)
          .fill(0)
          .map((_, cardIndex) => (
            <Card
              key={cardIndex}
              className="relative overflow-hidden bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20 border-0 shadow-lg backdrop-blur-sm"
            >
              <CardHeader className="relative">
                <CardTitle>
                  <Skeleton className="h-5 w-32" />
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 relative">
                {Array(3)
                  .fill(0)
                  .map((_, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center gap-4 p-3 rounded-lg bg-white/70 dark:bg-gray-800/70 border border-violet-100/50 dark:border-violet-800/30 backdrop-blur-sm"
                    >
                      <Skeleton className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-200 to-purple-200 dark:from-violet-800 dark:to-purple-800" />
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
      <Card className="relative overflow-hidden bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20 border-0 shadow-lg backdrop-blur-sm">
        <CardHeader className="relative">
          <CardTitle>
            <Skeleton className="h-5 w-40" />
          </CardTitle>
        </CardHeader>

        <CardContent className="relative">
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
        <div className="w-1 h-6 bg-gradient-to-b from-violet-400 to-purple-500 rounded-full"></div>
        <Skeleton className="h-6 w-32" />
      </div>

      <Card className="relative overflow-hidden bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20 border-0 shadow-lg backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative">
          <div className="flex items-center gap-2">
            <Skeleton className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-200 to-purple-200 dark:from-violet-800 dark:to-purple-800" />
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-6 w-12 rounded-full ml-2" />
          </div>
          <Skeleton className="h-9 w-40 rounded-md" />
        </CardHeader>

        <CardContent className="relative">
          <div className="rounded-lg border border-violet-200/50 dark:border-violet-700/30 overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
            {/* Table Header Skeleton */}
            <div className="bg-gradient-to-r from-violet-50/80 to-purple-50/80 dark:from-violet-950/50 dark:to-purple-950/50 border-b border-violet-200/50 dark:border-violet-700/50 p-4">
              <div className="grid grid-cols-5 gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>

            {/* Table Rows Skeleton */}
            <div className="divide-y divide-violet-100/50 dark:divide-violet-800/30">
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
