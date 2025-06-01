import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";

export default function ReservationsLoading() {
  return (
    <div className="flex flex-col p-6 md:p-8 gap-8">
      {/* Add BreadcrumbSetter */}
      <BreadcrumbSetter
        items={[
          { label: "Home", href: "/admin/dashboard" },
          { label: "Rooms", href: "/admin/rooms" },
          { label: "Reservations", href: "/admin/rooms/reservations" },
        ]}
      />

      {/* Enhanced Header Skeleton with Gradient Animation */}
      <ReservationHeaderSkeleton />

      {/* Enhanced Stats Cards Skeleton */}
      <ReservationStatsCardsSkeleton />

      {/* Enhanced Content Section Skeleton */}
      <ReservationContentSkeleton />
    </div>
  );
}

// Enhanced Reservation Header Skeleton with gradient animation
function ReservationHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Icon skeleton with purple gradient */}
        <div className="relative overflow-hidden w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
        <div>
          {/* Title skeleton with gradient background */}
          <div className="relative overflow-hidden h-8 w-80 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 rounded-lg mb-2">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
          {/* Description skeleton */}
          <div className="relative overflow-hidden h-4 w-96 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950 rounded-md">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Reservation Stats Cards Skeleton
function ReservationStatsCardsSkeleton() {
  const cardConfigs = [
    {
      bgGradient:
        "from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20",
      iconBg: "from-violet-400 to-purple-500",
      borderColor: "border-violet-200/60 dark:border-violet-800/40",
    },
    {
      bgGradient:
        "from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
      iconBg: "from-amber-400 to-orange-500",
      borderColor: "border-amber-200/60 dark:border-amber-800/40",
    },
    {
      bgGradient:
        "from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20",
      iconBg: "from-emerald-400 to-green-500",
      borderColor: "border-emerald-200/60 dark:border-emerald-800/40",
    },
    {
      bgGradient:
        "from-rose-50 to-red-50 dark:from-rose-950/20 dark:to-red-950/20",
      iconBg: "from-rose-400 to-red-500",
      borderColor: "border-rose-200/60 dark:border-rose-800/40",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
      {cardConfigs.map((config, index) => (
        <Card
          key={index}
          className={cn(
            "group relative overflow-hidden border shadow-lg backdrop-blur-sm",
            "bg-gradient-to-br",
            config.bgGradient,
            config.borderColor
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            {/* Title skeleton */}
            <div className="relative overflow-hidden h-4 w-32 bg-gradient-to-r from-current/20 to-current/10 rounded">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
            {/* Icon skeleton */}
            <div
              className={cn(
                "relative overflow-hidden w-10 h-10 rounded-full shadow-md",
                "bg-gradient-to-br",
                config.iconBg
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </CardHeader>
          <CardContent>
            {/* Value skeleton */}
            <div className="relative overflow-hidden h-8 w-16 bg-gradient-to-r from-current/30 to-current/20 rounded mb-2">
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

// Enhanced Content Section Skeleton with glassmorphism
function ReservationContentSkeleton() {
  return (
    <div className="space-y-6">
      {/* Section header skeleton */}
      <div className="flex items-center gap-2">
        <div className="relative overflow-hidden w-1 h-6 bg-gradient-to-b from-violet-400 to-purple-500 rounded-full">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
        <div className="relative overflow-hidden h-6 w-48 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 rounded">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>

      {/* Glassmorphism content container */}
      <div className="bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/10 dark:to-purple-950/10 rounded-xl p-6 shadow-lg border-0 backdrop-blur-sm">
        <div className="space-y-6">
          {/* Data table filter skeleton */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="relative overflow-hidden h-10 w-64 bg-gradient-to-r from-current/20 to-current/10 rounded-md">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
              <div className="relative overflow-hidden h-10 w-32 bg-gradient-to-r from-current/20 to-current/10 rounded-md">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
            <div className="relative overflow-hidden h-10 w-24 bg-gradient-to-r from-current/20 to-current/10 rounded-md">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>

          {/* Data table skeleton */}
          <div className="space-y-4">
            {/* Table header */}
            <div className="grid grid-cols-6 gap-4 pb-3 border-b border-violet-200/30 dark:border-violet-800/20">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden h-4 bg-gradient-to-r from-current/20 to-current/10 rounded"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
              ))}
            </div>

            {/* Table rows */}
            {[...Array(5)].map((_, i) => (
              <ReservationTableRowSkeleton key={i} index={i} />
            ))}
          </div>

          {/* Pagination skeleton */}
          <div className="flex justify-center items-center space-x-1 pt-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="relative overflow-hidden h-8 w-8 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 rounded-md"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Table Row Skeleton
function ReservationTableRowSkeleton({ index }: { index: number }) {
  const configs = [
    "from-violet-50/30 to-purple-50/30 dark:from-violet-950/10 dark:to-purple-950/10",
    "from-blue-50/30 to-indigo-50/30 dark:from-blue-950/10 dark:to-indigo-950/10",
    "from-emerald-50/30 to-green-50/30 dark:from-emerald-950/10 dark:to-green-950/10",
    "from-amber-50/30 to-orange-50/30 dark:from-amber-950/10 dark:to-orange-950/10",
  ];

  const config = configs[index % configs.length];

  return (
    <div
      className={cn(
        "grid grid-cols-6 gap-4 py-3 rounded-lg bg-gradient-to-br",
        config
      )}
    >
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="relative overflow-hidden h-4 bg-gradient-to-r from-current/20 to-current/10 rounded px-2"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      ))}
    </div>
  );
}
