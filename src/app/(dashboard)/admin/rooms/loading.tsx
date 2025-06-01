import { Skeleton } from "@/components/ui/skeleton";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

// Enhanced Header Skeleton with gradient animation
function HeaderSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Icon skeleton with purple gradient */}
        <div className="relative overflow-hidden w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
        <div>
          {/* Title skeleton with gradient background */}
          <div className="relative overflow-hidden h-8 w-48 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 rounded-lg mb-2">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
          {/* Description skeleton */}
          <div className="relative overflow-hidden h-4 w-64 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950 rounded-md">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>
      </div>
      {/* Add Room button skeleton */}
      <div className="relative overflow-hidden h-10 w-28 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 rounded-md">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      </div>
    </div>
  );
}

// Enhanced Stats Cards Skeleton with shimmer effects
function StatsCardsSkeleton() {
  const cardConfigs = [
    {
      bgGradient:
        "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
      iconBg: "from-blue-400 to-indigo-500",
      borderColor: "border-blue-200/60 dark:border-blue-800/40",
    },
    {
      bgGradient:
        "from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20",
      iconBg: "from-emerald-400 to-green-500",
      borderColor: "border-emerald-200/60 dark:border-emerald-800/40",
    },
    {
      bgGradient:
        "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
      iconBg: "from-purple-400 to-pink-500",
      borderColor: "border-purple-200/60 dark:border-purple-800/40",
    },
    {
      bgGradient:
        "from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
      iconBg: "from-amber-400 to-orange-500",
      borderColor: "border-amber-200/60 dark:border-amber-800/40",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cardConfigs.map((config, index) => (
        <Card
          key={index}
          className={`group relative overflow-hidden border shadow-lg backdrop-blur-sm bg-gradient-to-br ${config.bgGradient} ${config.borderColor}`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle>
              {/* Title skeleton with shimmer */}
              <div className="relative overflow-hidden h-4 w-20 bg-gradient-to-r from-current/20 to-current/10 rounded">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </CardTitle>
            {/* Icon skeleton with gradient */}
            <div
              className={`relative overflow-hidden w-10 h-10 rounded-full shadow-md bg-gradient-to-br ${config.iconBg}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            {/* Value skeleton */}
            <div className="relative overflow-hidden h-8 w-16 bg-gradient-to-r from-current/30 to-current/20 rounded mb-1">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
            {/* Description skeleton */}
            <div className="flex items-center gap-2">
              <div className="relative overflow-hidden h-4 w-4 bg-gradient-to-r from-current/20 to-current/10 rounded">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
              <div className="relative overflow-hidden h-3 w-24 bg-gradient-to-r from-current/20 to-current/10 rounded">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Enhanced Filters Skeleton with glassmorphism and shimmer
function FiltersSkeleton() {
  return (
    <Card className="border-0 bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/10 dark:to-purple-950/10 border-violet-200/30 dark:border-violet-800/20 shadow-lg backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          {/* Filter icon skeleton */}
          <div className="relative overflow-hidden w-8 h-8 rounded-lg bg-gradient-to-br from-violet-400 to-purple-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
          {/* Filter title skeleton */}
          <div className="relative overflow-hidden h-6 w-32 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 rounded">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* Filter controls skeleton */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              {/* Search input skeleton */}
              <div className="relative overflow-hidden h-10 w-full bg-gradient-to-r from-current/20 to-current/10 rounded-md">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
            {/* Filter button skeleton */}
            <div className="relative overflow-hidden h-10 w-24 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 rounded-md">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Enhanced Grid Skeleton with shimmer effects
function GridSkeleton() {
  return (
    <div className="space-y-8">
      {/* Grid header */}
      <div className="flex items-center justify-between">
        <div>
          {/* Section title skeleton */}
          <div className="relative overflow-hidden h-6 w-32 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 rounded mb-1">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
          {/* Section description skeleton */}
          <div className="relative overflow-hidden h-4 w-48 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950 rounded">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>
        {/* Count badge skeleton */}
        <div className="relative overflow-hidden h-6 w-20 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 rounded-full">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>

      {/* Room cards grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array(9)
          .fill(0)
          .map((_, index) => (
            <RoomCardSkeleton key={index} />
          ))}
      </div>

      {/* Enhanced Pagination skeleton */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          {/* Previous button */}
          <div className="relative overflow-hidden h-10 w-20 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 rounded-md">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
          {/* Page numbers */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="relative overflow-hidden h-10 w-8 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 rounded-md"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          ))}
          {/* Next button */}
          <div className="relative overflow-hidden h-10 w-20 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 rounded-md">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>
        {/* Page info skeleton */}
        <div className="relative overflow-hidden h-4 w-48 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950 rounded">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

// Enhanced Room Card Skeleton with glassmorphism and shimmer
function RoomCardSkeleton() {
  return (
    <Card className="overflow-hidden w-full p-0 group hover:scale-[1.02] transition-transform duration-300 border border-violet-200/30 dark:border-violet-800/20 shadow-lg hover:shadow-xl bg-gradient-to-br from-violet-50/30 to-purple-50/30 dark:from-violet-950/10 dark:to-purple-950/10 backdrop-blur-sm">
      {/* Image skeleton */}
      <div className="relative">
        <div className="relative overflow-hidden aspect-[16/9] w-full bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
        {/* Status badge skeleton */}
        <div className="absolute top-3 right-3">
          <div className="relative overflow-hidden h-6 w-16 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Title and location skeleton */}
        <div className="space-y-2">
          <div className="relative overflow-hidden h-6 w-3/4 bg-gradient-to-r from-current/30 to-current/20 rounded">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
          <div className="flex items-center gap-1">
            <div className="relative overflow-hidden h-4 w-4 bg-gradient-to-r from-current/20 to-current/10 rounded">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
            <div className="relative overflow-hidden h-4 w-1/2 bg-gradient-to-r from-current/20 to-current/10 rounded">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Description skeleton */}
        <div className="min-h-[3rem] space-y-2">
          <div className="relative overflow-hidden h-4 w-full bg-gradient-to-r from-current/20 to-current/10 rounded">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
          <div className="relative overflow-hidden h-4 w-4/5 bg-gradient-to-r from-current/20 to-current/10 rounded">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* Capacity skeleton */}
        <div className="flex items-center gap-1">
          <div className="relative overflow-hidden h-4 w-4 bg-gradient-to-r from-current/20 to-current/10 rounded">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
          <div className="relative overflow-hidden h-4 w-16 bg-gradient-to-r from-current/20 to-current/10 rounded">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* Facilities skeleton */}
        <div className="flex flex-wrap gap-2 pt-2">
          <div className="relative overflow-hidden h-6 w-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
          <div className="relative overflow-hidden h-6 w-20 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
          <div className="relative overflow-hidden h-6 w-14 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
          <div className="relative overflow-hidden h-6 w-8 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className="flex gap-2 pt-2">
          <div className="relative overflow-hidden h-9 flex-1 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 rounded-md">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
          <div className="relative overflow-hidden h-9 w-20 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 rounded-md">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>
      </div>
    </Card>
  );
}
