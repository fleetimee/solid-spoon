import { Skeleton } from "@/components/ui/skeleton";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const roomsBreadcrumb = [{ label: "Rooms" }, { label: "Manage Rooms" }];

export default function RoomsLoading() {
  return (
    <>
      <BreadcrumbSetter items={roomsBreadcrumb} />

      <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
        <HeaderSkeleton />
        <StatsCardsSkeleton />
        <FiltersSkeleton />
        <GridSkeleton />
      </div>
    </>
  );
}

// Header Skeleton - Matches RoomsHeader structure
function HeaderSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <Skeleton className="h-10 w-28 rounded-md" />
    </div>
  );
}

// Stats Cards Skeleton - Matches RoomsStatsCards with professional gradient design
function StatsCardsSkeleton() {
  const cardConfigs = [
    "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
    "from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20",
    "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
    "from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array(4)
        .fill(0)
        .map((_, index) => (
          <Card
            key={index}
            className={`group relative overflow-hidden border-0 bg-gradient-to-br ${cardConfigs[index]} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-pulse`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle>
                <Skeleton className="h-4 w-20" />
              </CardTitle>
              <Skeleton className="w-10 h-10 rounded-full" />
            </CardHeader>
            <CardContent className="relative">
              <Skeleton className="h-8 w-16 mb-1" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-3 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}

// Filters Skeleton - Matches RoomsFiltersSection with professional gradient
function FiltersSkeleton() {
  return (
    <Card className="border-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="h-6 w-32" />
        </div>

        {/* Filter controls skeleton */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Grid Skeleton - Matches RoomsGridSection with responsive grid and room cards
function GridSkeleton() {
  return (
    <div className="space-y-8">
      {/* Grid header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-6 w-32 mb-1" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Room cards grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array(9)
          .fill(0)
          .map((_, index) => (
            <RoomCardSkeleton key={index} />
          ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-8" />
          <Skeleton className="h-10 w-8" />
          <Skeleton className="h-10 w-8" />
          <Skeleton className="h-10 w-20" />
        </div>
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  );
}

// Individual Room Card Skeleton - Matches RoomCard with professional styling
function RoomCardSkeleton() {
  return (
    <Card className="overflow-hidden w-full p-0 group hover:scale-[1.02] transition-transform duration-300 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800/50">
      {/* Image skeleton */}
      <div className="relative">
        <Skeleton className="aspect-[16/9] w-full" />
        {/* Status badge skeleton */}
        <div className="absolute top-3 right-3">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Title and location skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>

        {/* Description skeleton */}
        <div className="min-h-[3rem] space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        {/* Capacity skeleton */}
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Facilities skeleton */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
          <div className="flex items-center">
            <Skeleton className="h-6 w-8 rounded-full" />
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-9 flex-1 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      </div>
    </Card>
  );
}
