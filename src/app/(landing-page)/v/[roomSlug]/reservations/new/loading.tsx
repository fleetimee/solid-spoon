import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";

export default function Loading() {
  const breadcrumbItems = [
    { label: <Skeleton className="h-4 w-16" /> }, // Home
    { label: <Skeleton className="h-4 w-20" /> }, // Rooms
    { label: <Skeleton className="h-4 w-32" /> }, // Room Name
    { label: <Skeleton className="h-4 w-40" /> }, // New Reservation
  ];

  return (
    <>
      <BreadcrumbSetter items={breadcrumbItems} />
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-violet-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
        {/* Hero Section Skeleton - matching new reservation page */}
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

              {/* Title skeleton - "Reservasi [Room Name]" */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <Skeleton className="h-10 md:h-12 w-48 mx-auto bg-white/30" />{" "}
                  {/* "Reservasi" */}
                  <Skeleton className="h-10 md:h-12 w-64 mx-auto bg-gradient-to-r from-yellow-300/30 to-orange-300/30" />{" "}
                  {/* Room name */}
                </div>
                <Skeleton className="h-5 w-full max-w-2xl mx-auto bg-white/20" />
                <Skeleton className="h-5 w-3/4 max-w-xl mx-auto bg-white/20" />
              </div>

              {/* Room Quick Info skeleton */}
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

        {/* Form Section Skeleton - matching new reservation page structure */}
        <main className="max-w-screen-xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Card Skeleton - lg:col-span-2 */}
            <div className="lg:col-span-2">
              <div className="border-0 shadow-2xl bg-white/70 dark:bg-card/70 backdrop-blur-sm rounded-lg">
                {/* Card Header */}
                <div className="p-6 pb-6 space-y-1">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500">
                      <Skeleton className="h-5 w-5 bg-white/30" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-40" />{" "}
                      {/* "Detail Reservasi" */}
                      <Skeleton className="h-4 w-64" /> {/* Description */}
                    </div>
                  </div>
                </div>

                {/* Form Content */}
                <div className="p-6 pt-0 space-y-6">
                  {/* Title Field */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" /> {/* Label */}
                    <Skeleton className="h-10 w-full" /> {/* Input */}
                  </div>

                  {/* Description Field */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" /> {/* Label */}
                    <Skeleton className="h-24 w-full" /> {/* Textarea */}
                  </div>

                  {/* Date & Time Fields */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" /> {/* Start Time Label */}
                      <Skeleton className="h-10 w-full" />{" "}
                      {/* DateTime Picker */}
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" /> {/* End Time Label */}
                      <Skeleton className="h-10 w-full" />{" "}
                      {/* DateTime Picker */}
                    </div>
                  </div>

                  {/* Calendar Section */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" /> {/* Calendar Label */}
                    <div className="border rounded-lg p-4">
                      {/* Calendar Header */}
                      <div className="flex items-center justify-between mb-4">
                        <Skeleton className="h-6 w-32" />
                        <div className="flex gap-2">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </div>

                      {/* Calendar Grid */}
                      <div className="grid grid-cols-7 gap-2 mb-2">
                        {Array.from({ length: 7 }).map((_, i) => (
                          <Skeleton key={i} className="h-8 w-8 mx-auto" />
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: 35 }).map((_, i) => (
                          <Skeleton key={i} className="h-8 w-8 mx-auto" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="space-y-6">
              {/* Room Info Card */}
              <div className="border-0 shadow-lg bg-white/70 dark:bg-card/70 backdrop-blur-sm rounded-lg">
                <div className="p-6 border-b">
                  <Skeleton className="h-6 w-32 mb-2" /> {/* Room name */}
                  <Skeleton className="h-4 w-48" /> {/* Description */}
                </div>
                <div className="p-6 space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />

                  {/* Quick Stats */}
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
                    <Skeleton className="h-6 w-20" /> {/* "Tips Pro" */}
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
      </div>
    </>
  );
}
