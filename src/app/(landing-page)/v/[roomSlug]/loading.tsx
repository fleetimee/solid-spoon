import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert"; // Import Alert for structure
import { Card } from "@/components/ui/card"; // Added import
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";

export default function LoadingRoomDetail() {
  const breadcrumbItems = [
    { label: <Skeleton className="h-4 w-16" /> }, // Home
    { label: <Skeleton className="h-4 w-20" /> }, // Rooms
    { label: <Skeleton className="h-4 w-32" /> }, // Room Name
  ];

  return (
    // Match main container structure from page.tsx
    <div className="min-h-screen bg-background">
      <BreadcrumbSetter items={breadcrumbItems} />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Product Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Gallery Section Skeleton */}
          <div className="lg:col-span-7 xl:col-span-8">
            {/* Add sticky wrapper */}
            <div className="sticky top-8">
              {/* Use aspect ratio or a more representative height */}
              <Skeleton className="aspect-video w-full rounded-lg" />
              {/* Optionally add smaller skeletons for thumbnails if gallery has them */}
              <div className="mt-2 grid grid-cols-5 gap-2">
                <Skeleton className="aspect-square w-full rounded" />
                <Skeleton className="aspect-square w-full rounded" />
                <Skeleton className="aspect-square w-full rounded" />
                <Skeleton className="aspect-square w-full rounded" />
                <Skeleton className="aspect-square w-full rounded" />
              </div>
            </div>
          </div>

          {/* Product Details Section Skeleton */}
          <div className="lg:col-span-5 xl:col-span-4">
            {/* Add sticky wrapper with correct top offset and spacing */}
            <div className="sticky top-20 space-y-6">
              {/* Title Skeleton (matches h1 size) */}
              <Skeleton className="h-9 w-3/4" />

              {/* Description Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>

              {/* Highlights Skeleton */}
              <div className="space-y-2">
                {/* Highlights Title (matches h3 size) */}
                <Skeleton className="h-6 w-1/2" />
                {/* Highlights List (matches grid layout) */}
                <ul className="grid grid-cols-2 gap-2">
                  <li>
                    <Skeleton className="h-4 w-full" />
                  </li>
                  <li>
                    <Skeleton className="h-4 w-full" />
                  </li>
                  {/* Add more if needed */}
                </ul>
              </div>

              {/* Alert Skeleton (matches Alert structure/padding) */}
              <Skeleton className="h-12 w-full rounded-md" />

              {/* Book Now Button Skeleton (matches Button size) */}
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        </div>

        {/* New Card Skeleton for Lower Sections */}
        <Card className="mt-8">
          {" "}
          {/* Add margin top to separate from upper section */}
          <div className="p-6 md:p-8 space-y-12">
            {" "}
            {/* Mimic inner div padding and spacing */}
            {/* Amenities Skeleton */}
            <div>
              <Skeleton className="h-6 w-1/3 mb-4" /> {/* Title */}
              <div className="flex flex-wrap gap-2">
                {" "}
                {/* Match flex wrap */}
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-12 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
            {/* Location Skeleton */}
            <div>
              <Skeleton className="h-6 w-1/4 mb-4" /> {/* Title */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
            {/* My Reservations Skeleton */}
            <div>
              <Skeleton className="h-6 w-1/3 mb-4" /> {/* Title */}
              <div className="space-y-2">
                {" "}
                {/* Table approx */}
                <Skeleton className="h-4 w-full" /> {/* Header approx */}
                <Skeleton className="h-4 w-full" /> {/* Row 1 */}
                <Skeleton className="h-4 w-3/4" /> {/* Row 2 */}
              </div>
            </div>
            {/* Recent Reservations Skeleton */}
            <div>
              <Skeleton className="h-6 w-1/3 mb-4" /> {/* Title */}
              <div className="space-y-2">
                {" "}
                {/* Table approx */}
                <Skeleton className="h-4 w-full" /> {/* Header approx */}
                <Skeleton className="h-4 w-full" /> {/* Row 1 */}
                <Skeleton className="h-4 w-full" /> {/* Row 2 */}
                <Skeleton className="h-4 w-5/6" /> {/* Row 3 */}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
