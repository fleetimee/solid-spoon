import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import {
  ShimmerSkeleton,
  GlassmorphismContainerSkeleton,
  ContentSkeleton,
  ButtonSkeleton,
} from "@/components/ui/skeleton-components";

// Breadcrumb placeholder for delete room
const deleteRoomBreadcrumb = [
  { label: "Rooms", href: "#" },
  { label: "Manage Rooms", href: "#" },
  { label: "Room", href: "#" },
  { label: "Delete" },
];

// Header skeleton with destructive theme
function DeleteRoomHeaderSkeleton() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-red-50/50 to-rose-50/50 dark:from-red-950/10 dark:to-rose-950/10 rounded-xl p-6 md:p-8 shadow-lg border-0 backdrop-blur-sm">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-400/5 to-rose-500/5"></div>

      <div className="relative">
        <div className="flex flex-col gap-6">
          {/* Back Button Skeleton */}
          <div className="flex items-center gap-2 w-fit">
            <ShimmerSkeleton className="w-7 h-7 rounded-lg bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900" />
            <ContentSkeleton
              width="w-32"
              height="h-4"
              opacity="from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900"
            />
          </div>

          {/* Header Content Skeleton */}
          <div className="flex items-center gap-4">
            {/* Icon Skeleton with destructive gradient */}
            <ShimmerSkeleton className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 shadow-lg" />

            <div className="space-y-2">
              {/* Title Skeleton */}
              <ContentSkeleton
                width="w-48"
                height="h-8"
                opacity="from-red-100 to-rose-100 dark:from-red-900 dark:to-rose-900"
              />
              {/* Description Skeleton */}
              <ContentSkeleton
                width="w-80"
                height="h-4"
                opacity="from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Content section skeleton with glassmorphism
function DeleteContentSectionSkeleton() {
  return (
    <div className="space-y-6">
      {/* Section Divider Skeleton */}
      <div className="flex items-center gap-2">
        <ShimmerSkeleton className="w-1 h-6 bg-gradient-to-b from-red-500 to-rose-500 rounded-full" />
        <ContentSkeleton
          width="w-48"
          height="h-6"
          opacity="from-red-100 to-rose-100 dark:from-red-900 dark:to-rose-900"
        />
      </div>

      {/* Glassmorphism Container with destructive theme */}
      <div className="bg-gradient-to-br from-red-50/50 to-rose-50/50 dark:from-red-950/10 dark:to-rose-950/10 rounded-xl p-6 shadow-lg border-0 backdrop-blur-sm">
        <DeleteCardSkeleton />
      </div>
    </div>
  );
}

// Delete confirmation card skeleton
function DeleteCardSkeleton() {
  return (
    <Card className="relative overflow-hidden border-2 border-red-200/50 dark:border-red-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-500/5"></div>

      {/* Card Header Skeleton */}
      <CardHeader className="relative border-b border-red-200/30 dark:border-red-800/30 bg-gradient-to-r from-red-50/80 to-rose-50/80 dark:from-red-950/30 dark:to-rose-950/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {/* Header Icon Skeleton */}
          <ShimmerSkeleton className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 shadow-lg" />
          {/* Header Title Skeleton */}
          <ContentSkeleton
            width="w-40"
            height="h-6"
            opacity="from-red-100 to-rose-100 dark:from-red-900 dark:to-rose-900"
          />
        </div>
      </CardHeader>

      {/* Card Content Skeleton */}
      <CardContent className="relative pt-6 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
        <div className="space-y-6">
          {/* Description Text Skeleton */}
          <div className="space-y-3">
            <ContentSkeleton
              width="w-full"
              height="h-4"
              opacity="from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-950"
            />
            <ContentSkeleton
              width="w-3/4"
              height="h-4"
              opacity="from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-950"
            />
          </div>

          {/* Room Name Display Skeleton */}
          <div className="p-4 bg-gradient-to-r from-red-50/80 to-rose-50/80 dark:from-red-950/30 dark:to-rose-950/30 rounded-lg border border-red-200/50 dark:border-red-800/50 backdrop-blur-sm">
            <ContentSkeleton
              width="w-32"
              height="h-5"
              opacity="from-red-200 to-rose-200 dark:from-red-800 dark:to-rose-800"
            />
          </div>

          {/* Form Skeleton */}
          <DeleteFormSkeleton />
        </div>
      </CardContent>
    </Card>
  );
}

// Delete form skeleton
function DeleteFormSkeleton() {
  return (
    <div className="space-y-4">
      {/* Input Field Skeleton */}
      <div className="space-y-2">
        <ContentSkeleton
          width="w-24"
          height="h-4"
          opacity="from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-950"
        />
        <ShimmerSkeleton className="w-full h-10 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-md border border-gray-200 dark:border-gray-700" />
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex gap-3 pt-2">
        {/* Cancel Button Skeleton */}
        <ButtonSkeleton variant="secondary" size="default" />

        {/* Delete Button Skeleton with destructive styling */}
        <ShimmerSkeleton className="h-10 px-6 bg-gradient-to-r from-red-500 to-rose-500 rounded-md shadow-md flex-1" />
      </div>
    </div>
  );
}

/**
 * Loading component for the delete room page
 * Matches the beautified structure with destructive theme variations
 * Next.js automatically wraps this in a Suspense boundary and shows it
 * while the main page is loading server-side data
 */
export default function DeleteRoomLoading() {
  return (
    <>
      <BreadcrumbSetter items={deleteRoomBreadcrumb} />

      <main className="flex flex-col grow p-4 md:p-8 space-y-8">
        {/* Enhanced Delete Room Header Skeleton */}
        <DeleteRoomHeaderSkeleton />

        {/* Content Section Skeleton */}
        <DeleteContentSectionSkeleton />
      </main>
    </>
  );
}
