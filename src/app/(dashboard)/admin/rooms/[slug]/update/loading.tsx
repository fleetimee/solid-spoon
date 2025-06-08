import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import {
  ShimmerSkeleton,
  GlassmorphismContainerSkeleton,
  ContentSkeleton,
  ButtonSkeleton,
} from "@/components/ui/skeleton-components";

// Breadcrumb placeholder for update room
const updateRoomBreadcrumb = [
  { label: "Ruangan", href: "#" },
  { label: "Kelola Ruangan", href: "#" },
  { label: "Ruangan", href: "#" },
  { label: "Perbarui" },
];

// Header skeleton with update theme
function UpdateRoomHeaderSkeleton() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/10 dark:to-purple-950/10 rounded-xl p-6 md:p-8 shadow-lg border-0 backdrop-blur-sm">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-400/5 to-purple-500/5"></div>

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
            {/* Icon Skeleton with update gradient */}
            <ShimmerSkeleton className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg" />

            <div className="space-y-2">
              {/* Title Skeleton */}
              <ContentSkeleton
                width="w-56"
                height="h-8"
                opacity="from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900"
              />
              {/* Description Skeleton */}
              <ContentSkeleton
                width="w-96"
                height="h-4"
                opacity="from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Form sections skeleton
function UpdateFormSectionsSkeleton() {
  return (
    <div className="space-y-8">
      {/* Basic Information Section */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20 border-0 shadow-lg backdrop-blur-sm">
        <CardHeader className="relative">
          <div className="flex items-center gap-3">
            <ShimmerSkeleton className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500" />
            <ContentSkeleton
              width="w-40"
              height="h-6"
              opacity="from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6 relative">
          {/* Form fields skeleton */}
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="space-y-2">
                <ContentSkeleton
                  width="w-24"
                  height="h-4"
                  opacity="from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-950"
                />
                <ShimmerSkeleton className="w-full h-10 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-md border border-gray-200 dark:border-gray-700" />
              </div>
            ))}
        </CardContent>
      </Card>

      {/* Image Upload Section */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20 border-0 shadow-lg backdrop-blur-sm">
        <CardHeader className="relative">
          <div className="flex items-center gap-3">
            <ShimmerSkeleton className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500" />
            <ContentSkeleton
              width="w-32"
              height="h-6"
              opacity="from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900"
            />
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="border-2 border-dashed border-violet-200 dark:border-violet-700 rounded-lg p-8">
            <ShimmerSkeleton className="w-full h-40 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 rounded-lg" />
          </div>
        </CardContent>
      </Card>

      {/* Facilities Section */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20 border-0 shadow-lg backdrop-blur-sm">
        <CardHeader className="relative">
          <div className="flex items-center gap-3">
            <ShimmerSkeleton className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500" />
            <ContentSkeleton
              width="w-36"
              height="h-6"
              opacity="from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900"
            />
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array(8)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-3 rounded-lg bg-white/70 dark:bg-gray-800/70 border border-violet-100/50 dark:border-violet-800/30"
                >
                  <ShimmerSkeleton className="w-4 h-4 rounded bg-violet-200 dark:bg-violet-700" />
                  <ContentSkeleton
                    width="w-20"
                    height="h-4"
                    opacity="from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-950"
                  />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end pt-4">
        <ButtonSkeleton variant="secondary" size="default" />
        <ShimmerSkeleton className="h-10 px-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-md shadow-md" />
      </div>
    </div>
  );
}

/**
 * Loading component for the update room page
 * Matches the form structure with violet/purple theme variations
 * Next.js automatically wraps this in a Suspense boundary and shows it
 * while the main page is loading server-side data
 */
export default function UpdateRoomLoading() {
  return (
    <>
      <BreadcrumbSetter items={updateRoomBreadcrumb} />

      <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
        {/* Enhanced Update Room Header Skeleton */}
        <UpdateRoomHeaderSkeleton />

        {/* Form Sections Skeleton */}
        <UpdateFormSectionsSkeleton />
      </div>
    </>
  );
}
