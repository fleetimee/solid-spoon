import React from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Corrected import path
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";

// Skeleton for Hero Section
const HeroSkeleton = () => (
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

// Skeleton for Features Section
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

// Skeleton for Available Rooms Section
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

// Skeleton for FAQ Section
const FaqSkeleton = () => (
  <div className="w-full max-w-screen-xl mx-auto py-8 xs:py-16 px-6">
    <Skeleton className="h-10 w-3/4 md:w-1/2 md:mx-auto md:h-12" />
    <Skeleton className="mt-1.5 h-5 w-full md:w-3/4 md:mx-auto max-w-lg" />
    <div className="mt-8 space-y-4 md:columns-2 md:gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton
          key={index}
          className="h-16 w-full rounded-xl !mt-0 !mb-4 break-inside-avoid"
        />
      ))}
    </div>
  </div>
);

// Skeleton for Testimonial Section
const TestimonialSkeleton = () => (
  <div className="w-full max-w-screen-xl mx-auto py-6 xs:py-12 px-6">
    <Skeleton className="mb-8 xs:mb-14 h-10 md:h-12 w-1/2 sm:w-1/3 mx-auto" />
    <div className="container w-full mx-auto">
      <div className="mb-8 bg-accent rounded-xl py-8 px-6 sm:py-6">
        <div className="flex items-center justify-between gap-20">
          <Skeleton className="hidden lg:block relative shrink-0 aspect-[3/4] max-w-[18rem] w-full rounded-xl" />
          <div className="flex flex-col justify-center w-full space-y-6">
            <div className="flex items-center justify-end gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-5 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-11/12" />
            <Skeleton className="h-6 w-10/12" />
            <div className="flex mt-6 items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mt-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-3.5 w-3.5 rounded-full" />
        ))}
      </div>
    </div>
  </div>
);

// Main Loading Component
export default function Loading() {
  const breadcrumbItems = [
    { label: <Skeleton className="h-4 w-16" /> }, // Represents "Home"
  ];

  return (
    <>
      <BreadcrumbSetter items={breadcrumbItems} />
      <HeroSkeleton />
      <FeaturesSkeleton />
      <AvailableRoomsSkeleton />
      <FaqSkeleton />
      <TestimonialSkeleton />
      {/* Footer skeleton could be added if needed */}
    </>
  );
}
