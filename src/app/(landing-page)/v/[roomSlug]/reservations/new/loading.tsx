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
      {/* Main container matching page.tsx structure and padding */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Skeleton for h1 title */}
        <Skeleton className="h-8 w-64 mb-4" /> {/* Adjusted size and margin */}
        {/* Skeleton for introductory paragraph */}
        <Skeleton className="h-4 w-full max-w-lg mb-6" />{" "}
        {/* Adjusted size and margin */}
        {/* Form container matching page.tsx */}
        <div className="max-w-2xl">
          {/* Form skeleton container matching new-reservation-form.tsx grid */}
          <div className="grid items-start gap-4">
            {/* Title: Label + Input */}
            <div className="space-y-2">
              {" "}
              {/* Mimics FormItem spacing */}
              <Skeleton className="h-4 w-12" /> {/* Label */}
              <Skeleton className="h-9 w-full" />{" "}
              {/* Input (h-9 matches Input height) */}
            </div>
            {/* Description: Label + Textarea */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" /> {/* Label */}
              <Skeleton className="h-20 w-full" /> {/* Textarea (taller) */}
            </div>
            {/* Start Time: Label + Button */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" /> {/* Label */}
              <Skeleton className="h-9 w-full" />{" "}
              {/* Button (h-9 matches Button height) */}
            </div>
            {/* End Time: Label + Button */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" /> {/* Label */}
              <Skeleton className="h-9 w-full" />{" "}
              {/* Button (h-9 matches Button height) */}
            </div>
            {/* Submit Button - Directly in the grid, no label */}
            <Skeleton className="h-9 w-full" />{" "}
            {/* Submit Button (h-9 matches Button height) */}
          </div>
        </div>
      </main>
    </>
  );
}
