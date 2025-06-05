import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

const roomsBreadcrumb = [{ label: "Beranda", href: "/" }, { label: "Ruangan" }];

export default function RoomsLoading() {
  return (
    <>
      <BreadcrumbSetter items={roomsBreadcrumb} />

      <main className="flex flex-col grow p-3 sm:p-4 md:p-8 min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30">
        <div className="max-w-screen-xl mx-auto w-full px-3 sm:px-6">
          {/* Enhanced Header Skeleton with Glass Morphism */}
          <div className="relative mb-6 sm:mb-8 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-white/20 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl sm:rounded-3xl"></div>
            <div className="relative flex flex-col gap-2 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <Skeleton className="h-8 w-8 sm:h-11 sm:w-11 md:h-14 md:w-14 rounded-xl sm:rounded-2xl" />
                <Skeleton className="h-6 w-8 sm:h-8 sm:w-10 rounded" />
              </div>
              <Skeleton className="h-8 sm:h-9 md:h-12 lg:h-14 w-full max-w-lg rounded" />
              <Skeleton className="h-4 sm:h-5 md:h-6 w-full max-w-2xl rounded" />
              <Skeleton className="h-4 sm:h-5 md:h-6 w-3/4 max-w-xl rounded" />
            </div>
          </div>

          {/* Enhanced Search Section Skeleton */}
          <div className="mb-6 sm:mb-8 p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-background/80 to-muted/20 backdrop-blur-sm border border-white/10 shadow-lg">
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <Skeleton className="h-10 sm:h-12 flex-1 rounded-lg" />
                <Skeleton className="h-10 sm:h-12 w-full sm:w-[120px] md:w-[140px] rounded-lg" />
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Skeleton className="h-8 sm:h-9 w-20 sm:w-24 rounded-lg" />
                <Skeleton className="h-8 sm:h-9 w-16 sm:w-20 rounded-lg" />
                <Skeleton className="h-8 sm:h-9 w-24 sm:w-28 rounded-lg" />
                <Skeleton className="h-8 sm:h-9 w-18 sm:w-22 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Results Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3">
              <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded" />
              <div className="space-y-1">
                <Skeleton className="h-6 sm:h-7 w-40 sm:w-48 rounded" />
                <Skeleton className="h-4 sm:h-5 w-32 sm:w-40 rounded" />
              </div>
            </div>
            <Skeleton className="h-6 sm:h-8 w-24 sm:w-32 rounded-full self-start sm:self-center" />
          </div>

          {/* Enhanced Room Grid Skeleton with Mobile-First Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
            {Array(6)
              .fill(0)
              .map((_, index) => {
                // Enhanced Bento layout with improved responsive patterns
                let spanClasses = "sm:col-span-1 md:col-span-2";
                const patternIndex = index % 6;

                if (patternIndex === 0) {
                  spanClasses = "sm:col-span-2 md:col-span-4 md:row-span-2";
                } else if (patternIndex === 1 || patternIndex === 2) {
                  spanClasses = "sm:col-span-1 md:col-span-2";
                } else if (patternIndex === 3 || patternIndex === 4) {
                  spanClasses = "sm:col-span-1 md:col-span-3";
                } else if (patternIndex === 5) {
                  spanClasses = "sm:col-span-2 md:col-span-6";
                }

                return (
                  <div key={index} className={cn(spanClasses)}>
                    <RoomCardSkeleton />
                  </div>
                );
              })}
          </div>

          {/* Pagination Skeleton */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-9 rounded" />
              <Skeleton className="h-9 w-9 rounded" />
              <Skeleton className="h-9 w-9 rounded" />
              <Skeleton className="h-9 w-9 rounded" />
              <Skeleton className="h-9 w-9 rounded" />
            </div>
          </div>

          {/* Pagination Info Skeleton */}
          <div className="mt-6 sm:mt-8 text-center">
            <Skeleton className="h-8 sm:h-10 w-48 sm:w-64 mx-auto rounded-full" />
          </div>
        </div>
      </main>
    </>
  );
}

function RoomCardSkeleton() {
  return (
    <Card className="overflow-hidden w-full h-full p-0 bg-gradient-to-br from-background/50 to-muted/30 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Image skeleton with gradient shimmer */}
      <div className="relative">
        <Skeleton className="aspect-[16/9] w-full bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent rounded-t-lg"></div>
      </div>

      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 flex flex-col h-full">
        {/* Title and location skeleton */}
        <div className="space-y-1 sm:space-y-2">
          <Skeleton className="h-5 sm:h-6 w-3/4 bg-gradient-to-r from-muted/60 to-muted/40 rounded" />
          <Skeleton className="h-3 sm:h-4 w-1/2 bg-gradient-to-r from-muted/50 to-muted/30 rounded" />
        </div>

        {/* Description skeleton */}
        <div className="min-h-[2.5rem] sm:min-h-[3rem] grow space-y-1 sm:space-y-2">
          <Skeleton className="h-3 sm:h-4 w-full bg-gradient-to-r from-muted/50 to-muted/30 rounded" />
          <Skeleton className="h-3 sm:h-4 w-4/5 bg-gradient-to-r from-muted/40 to-muted/20 rounded" />
          <Skeleton className="h-3 sm:h-4 w-2/3 bg-gradient-to-r from-muted/30 to-muted/10 rounded" />
        </div>

        {/* Capacity and price skeleton */}
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-3 sm:h-4 w-1/3 bg-gradient-to-r from-muted/50 to-muted/30 rounded" />
          <Skeleton className="h-4 sm:h-5 w-16 sm:w-20 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded" />
        </div>

        {/* Facilities skeleton */}
        <div className="flex flex-wrap gap-1 sm:gap-2 pt-1 sm:pt-2">
          <Skeleton className="h-6 sm:h-7 w-16 sm:w-20 rounded-full bg-gradient-to-r from-muted/40 to-muted/20" />
          <Skeleton className="h-6 sm:h-7 w-20 sm:w-24 rounded-full bg-gradient-to-r from-muted/40 to-muted/20" />
          <Skeleton className="h-6 sm:h-7 w-12 sm:w-16 rounded-full bg-gradient-to-r from-muted/40 to-muted/20" />
        </div>

        {/* Action button skeleton */}
        <div className="pt-2 sm:pt-3 mt-auto">
          <Skeleton className="h-8 sm:h-9 w-full bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-lg" />
        </div>
      </div>
    </Card>
  );
}
