import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";

// Skeleton for Modern Hero Section (matching new reservation page)
const ModernHeroSkeleton = () => (
  <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 dark:from-violet-800 dark:via-purple-800 dark:to-pink-800">
    <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>

    <main className="relative max-w-screen-xl mx-auto px-6 py-12">
      <div className="text-center space-y-6">
        {/* Badge skeleton */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-sm border border-white/30">
          <Skeleton className="h-4 w-4 bg-white/30" />
          <Skeleton className="h-4 w-40 bg-white/30" />
        </div>

        {/* Title and description skeleton */}
        <div className="space-y-3">
          <div className="space-y-2">
            <Skeleton className="h-10 md:h-12 w-3/4 max-w-lg mx-auto bg-white/30" />
            <Skeleton className="h-10 md:h-12 w-1/2 max-w-xs mx-auto bg-white/30" />
          </div>
          <Skeleton className="h-5 w-full max-w-2xl mx-auto bg-white/20" />
          <Skeleton className="h-5 w-3/4 max-w-xl mx-auto bg-white/20" />
        </div>

        {/* Quick info skeleton */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 bg-white/30" />
              <Skeleton className="h-4 w-20 bg-white/30" />
            </div>
          ))}
        </div>
      </div>
    </main>
  </div>
);

// Skeleton for Modern Form Section (matching new reservation page)
const ModernFormSkeleton = () => (
  <main className="max-w-screen-xl mx-auto px-6 py-12">
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Form Card Skeleton */}
      <div className="lg:col-span-2">
        <div className="border-0 shadow-2xl bg-white/70 dark:bg-card/70 backdrop-blur-sm rounded-lg">
          {/* Card Header */}
          <div className="p-6 pb-6 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500">
                <Skeleton className="h-5 w-5 bg-white/30" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            {/* Form fields skeleton */}
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}

            {/* Calendar skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <div className="border rounded-lg p-4">
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-8" />
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-8" />
                  ))}
                </div>
              </div>
            </div>

            {/* Submit button */}
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>

      {/* Sidebar Skeleton */}
      <div className="space-y-6">
        {/* Room Info Card */}
        <div className="border-0 shadow-lg bg-white/70 dark:bg-card/70 backdrop-blur-sm rounded-lg">
          <div className="p-6 border-b">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="p-6 space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />

            {/* Stats skeleton */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center space-y-2">
                <Skeleton className="h-8 w-12 mx-auto" />
                <Skeleton className="h-3 w-16 mx-auto" />
              </div>
              <div className="text-center space-y-2">
                <Skeleton className="h-8 w-12 mx-auto" />
                <Skeleton className="h-3 w-16 mx-auto" />
              </div>
            </div>
          </div>
        </div>

        {/* Tips Card */}
        <div className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 backdrop-blur-sm rounded-lg">
          <div className="p-6 border-b">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
          <div className="p-6 space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-start gap-3">
                <Skeleton className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </main>
);

// Legacy skeletons for other pages (keeping backward compatibility)
const LegacyHeroSkeleton = () => (
  <div className="min-h-[calc(100vh-4rem)] w-full flex items-center justify-center overflow-hidden border-b border-accent">
    <div className="max-w-screen-xl w-full flex flex-col lg:flex-row mx-auto items-center justify-between gap-y-14 gap-x-10 px-6 py-12 lg:py-0">
      <div className="max-w-xl w-full">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="mt-6 h-10 w-full max-w-[20ch] sm:h-12 lg:h-14" />
        <Skeleton className="mt-6 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-10/12" />
        <Skeleton className="mt-2 h-4 w-11/12" />
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
          <Skeleton className="h-12 w-full sm:w-36 rounded-full" />
          <Skeleton className="h-12 w-full sm:w-40 rounded-full" />
        </div>
      </div>
      <div className="relative lg:max-w-lg xl:max-w-xl w-full aspect-square">
        <Skeleton className="h-full w-full rounded-xl" />
      </div>
    </div>
  </div>
);

const FeaturesSkeleton = () => (
  <div className="max-w-screen-xl mx-auto w-full py-12 xs:py-20 px-6">
    <Skeleton className="h-10 w-3/4 sm:w-1/2 md:h-12 mx-auto" />
    <div className="mt-8 xs:mt-14 w-full mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col border rounded-xl overflow-hidden p-6 space-y-4"
        >
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-10/12" />
          <Skeleton className="h-32 w-full mt-auto" />
        </div>
      ))}
    </div>
  </div>
);

const AvailableRoomsSkeleton = () => (
  <section className="py-12 sm:py-16 md:py-20">
    <div className="w-full max-w-screen-xl mx-auto px-6">
      <div className="flex flex-col items-center text-center mb-12">
        <Skeleton className="h-10 w-3/4 sm:w-1/2 md:h-12 mb-4" />
        <Skeleton className="h-5 w-full max-w-2xl mb-2" />
        <Skeleton className="h-5 w-10/12 max-w-xl mb-8" />
        <div className="hidden sm:flex items-center gap-2 mt-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-10 w-full mt-2" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Skeleton className="h-10 w-32 mx-auto" />
      </div>
    </div>
  </section>
);

// Main Loading Component - detects if it's a reservation page
export default function Loading() {
  const breadcrumbItems = [{ label: <Skeleton className="h-4 w-16" /> }];

  // Check if this is likely a reservation page based on URL patterns
  // Since we can't access router in loading component, we'll show the modern version
  // which works for both reservation pages and can gracefully handle other pages
  const isReservationPage = true; // Default to modern layout

  return (
    <>
      <BreadcrumbSetter items={breadcrumbItems} />
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-violet-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
        {isReservationPage ? (
          <>
            <ModernHeroSkeleton />
            <ModernFormSkeleton />
          </>
        ) : (
          <>
            <LegacyHeroSkeleton />
            <FeaturesSkeleton />
            <AvailableRoomsSkeleton />
          </>
        )}
      </div>
    </>
  );
}
