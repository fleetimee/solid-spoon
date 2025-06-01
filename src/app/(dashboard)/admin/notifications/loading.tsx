import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function NotificationsLoading() {
  return (
    <main className="flex flex-col grow p-4 md:p-8 space-y-6">
      {/* Enhanced Header Skeleton with Gradient Animation */}
      <HeaderSkeleton />

      {/* Enhanced Stats Cards Skeleton */}
      <StatsCardsSkeleton />

      {/* Enhanced Filter Tabs Skeleton */}
      <FilterTabsSkeleton />

      {/* Enhanced Notification List Skeleton */}
      <NotificationListSkeleton />

      {/* Enhanced Pagination Skeleton */}
      <PaginationSkeleton />
    </main>
  );
}

// Enhanced Header Skeleton with gradient animation
function HeaderSkeleton() {
  return (
    <div className="flex items-center gap-3 mb-6">
      {/* Icon skeleton with purple gradient */}
      <div className="relative overflow-hidden w-12 h-12 rounded-xl bg-gradient-to-br from-violet-200 to-purple-300 dark:from-violet-800 dark:to-purple-900 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>
      <div className="flex-1">
        {/* Title skeleton with gradient background */}
        <div className="relative overflow-hidden h-8 w-72 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 rounded-lg mb-2">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
        {/* Description skeleton */}
        <div className="relative overflow-hidden h-4 w-96 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950 rounded-md">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

// Enhanced Stats Cards Skeleton
function StatsCardsSkeleton() {
  const cardConfigs = [
    {
      bgGradient:
        "from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20",
      iconBg: "from-violet-400 to-purple-500",
    },
    {
      bgGradient:
        "from-purple-50 to-fuchsia-50 dark:from-purple-950/20 dark:to-fuchsia-950/20",
      iconBg: "from-purple-400 to-fuchsia-500",
    },
    {
      bgGradient:
        "from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20",
      iconBg: "from-indigo-400 to-violet-500",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 mb-6">
      {cardConfigs.map((config, index) => (
        <Card
          key={index}
          className={cn(
            "group relative overflow-hidden border-0 shadow-lg backdrop-blur-sm",
            "bg-gradient-to-br",
            config.bgGradient
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

// Enhanced Filter Tabs Skeleton
function FilterTabsSkeleton() {
  const filterConfigs = [
    { gradient: "from-purple-500 to-violet-500" },
    { gradient: "from-orange-500 to-red-500" },
    { gradient: "from-emerald-500 to-green-500" },
  ];

  return (
    <div className="w-full mb-6">
      <div
        className={cn(
          "grid w-full grid-cols-3 p-1 h-auto rounded-md",
          "bg-gradient-to-r from-purple-50/50 to-violet-50/50",
          "dark:from-purple-950/20 dark:to-violet-950/20",
          "border border-purple-200/30 dark:border-purple-800/20",
          "backdrop-blur-sm"
        )}
      >
        {filterConfigs.map((config, index) => (
          <div
            key={index}
            className="relative overflow-hidden flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-gradient-to-r from-current/10 to-current/5"
          >
            {/* Icon skeleton */}
            <div className="relative overflow-hidden h-4 w-4 bg-gradient-to-r from-current/30 to-current/20 rounded">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
            {/* Label skeleton */}
            <div className="relative overflow-hidden h-4 w-16 bg-gradient-to-r from-current/30 to-current/20 rounded">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Enhanced Notification List Skeleton
function NotificationListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <NotificationItemSkeleton key={i} index={i} />
      ))}
    </div>
  );
}

// Enhanced Notification Item Skeleton with glassmorphism
function NotificationItemSkeleton({ index }: { index: number }) {
  const configs = [
    {
      bgGradient:
        "from-purple-50/80 to-violet-50/80 dark:from-purple-950/20 dark:to-violet-950/20",
      borderColor: "border-purple-200/60 dark:border-purple-800/40",
      iconBg: "from-purple-400 to-violet-500",
      dotColor: "bg-purple-500",
    },
    {
      bgGradient:
        "from-indigo-50/80 to-blue-50/80 dark:from-indigo-950/20 dark:to-blue-950/20",
      borderColor: "border-indigo-200/60 dark:border-indigo-800/40",
      iconBg: "from-indigo-400 to-blue-500",
      dotColor: "bg-indigo-500",
    },
    {
      bgGradient:
        "from-emerald-50/80 to-green-50/80 dark:from-emerald-950/20 dark:to-green-950/20",
      borderColor: "border-emerald-200/60 dark:border-emerald-800/40",
      iconBg: "from-emerald-400 to-green-500",
      dotColor: "bg-emerald-500",
    },
    {
      bgGradient:
        "from-amber-50/80 to-orange-50/80 dark:from-amber-950/20 dark:to-orange-950/20",
      borderColor: "border-amber-200/60 dark:border-amber-800/40",
      iconBg: "from-amber-400 to-orange-500",
      dotColor: "bg-amber-500",
    },
  ];

  const config = configs[index % configs.length];

  return (
    <div
      className={cn(
        "group relative overflow-hidden border bg-gradient-to-br rounded-lg",
        "shadow-lg backdrop-blur-sm",
        config.bgGradient,
        config.borderColor
      )}
    >
      <div className="relative p-6">
        <div className="flex items-start gap-4">
          {/* Icon container skeleton */}
          <div className="flex-shrink-0">
            <div
              className={cn(
                "relative overflow-hidden w-10 h-10 rounded-full shadow-md",
                "bg-gradient-to-br",
                config.iconBg
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>

          {/* Content skeleton */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {/* Status dot skeleton */}
                  <div
                    className={cn(
                      "relative overflow-hidden w-2 h-2 rounded-full",
                      config.dotColor
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                  {/* Title skeleton */}
                  <div className="relative overflow-hidden h-5 w-48 bg-gradient-to-r from-current/30 to-current/20 rounded">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                </div>

                {/* Message skeleton */}
                <div className="space-y-2 mb-3">
                  <div className="relative overflow-hidden h-4 w-full max-w-md bg-gradient-to-r from-current/20 to-current/10 rounded">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                  <div className="relative overflow-hidden h-4 w-3/4 max-w-sm bg-gradient-to-r from-current/20 to-current/10 rounded">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                </div>

                {/* Metadata skeleton */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative overflow-hidden h-3 w-20 bg-gradient-to-r from-current/20 to-current/10 rounded">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                  <div className="relative overflow-hidden h-5 w-16 bg-gradient-to-r from-current/20 to-current/10 rounded-full">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                  <div className="relative overflow-hidden h-5 w-12 bg-gradient-to-r from-current/20 to-current/10 rounded-full">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons skeleton */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative overflow-hidden h-8 w-24 bg-gradient-to-r from-current/20 to-current/10 rounded-md">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
              <div className="relative overflow-hidden h-8 w-16 bg-gradient-to-r from-current/20 to-current/10 rounded-md">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
              <div className="relative overflow-hidden h-8 w-8 bg-gradient-to-r from-current/20 to-current/10 rounded-md">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Pagination Skeleton
function PaginationSkeleton() {
  return (
    <div className="space-y-4">
      {/* Main pagination controls */}
      <div className="flex justify-center items-center space-x-1">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="relative overflow-hidden h-8 w-8 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 rounded-md"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        ))}
      </div>

      {/* Page size selector */}
      <div className="flex items-center justify-center gap-2">
        <div className="relative overflow-hidden h-4 w-24 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 rounded">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="relative overflow-hidden h-7 w-7 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 rounded"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
