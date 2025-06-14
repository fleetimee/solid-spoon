import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Card } from "@/components/ui/card";

const teamsBreadcrumb = [
  { label: "Beranda", href: "/" },
  { label: "Tim Kami" },
];

export default function TeamsLoading() {
  return (
    <>
      <BreadcrumbSetter items={teamsBreadcrumb} />

      <main className="flex flex-col gap-8 p-4 md:p-6 lg:p-8 min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30">
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

          {/* Team Header Skeleton */}
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-background/80 to-muted/20 backdrop-blur-sm border border-white/10 shadow-lg">
            <div className="flex items-center gap-2 sm:gap-3 mb-4">
              <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded" />
              <div className="space-y-1">
                <Skeleton className="h-6 sm:h-7 w-32 sm:w-40 rounded" />
                <Skeleton className="h-4 sm:h-5 w-48 sm:w-56 rounded" />
              </div>
            </div>
            <Skeleton className="h-16 sm:h-20 w-full rounded" />
          </div>

          {/* Team Stats Skeleton */}
          <div className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <Card
                  key={index}
                  className="p-4 sm:p-6 bg-gradient-to-br from-background/50 to-muted/30 backdrop-blur-sm border border-white/10 shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded" />
                    <div className="space-y-1">
                      <Skeleton className="h-5 w-20 sm:w-24 rounded" />
                      <Skeleton className="h-4 w-16 sm:w-20 rounded" />
                    </div>
                  </div>
                  <Skeleton className="h-8 sm:h-10 w-16 sm:w-20 rounded" />
                </Card>
              ))}
          </div>

          {/* Team Members Header Skeleton */}
          <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded" />
            <div className="space-y-1">
              <Skeleton className="h-6 sm:h-7 w-32 sm:w-40 rounded" />
              <Skeleton className="h-4 sm:h-5 w-48 sm:w-56 rounded" />
            </div>
          </div>

          {/* Team Members Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <TeamMemberCardSkeleton key={index} />
              ))}
          </div>

          {/* Technology Stack Section Skeleton */}
          <div className="space-y-6 sm:space-y-8">
            <div className="relative p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/20 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-purple-500/5 rounded-2xl sm:rounded-3xl"></div>
              <div className="relative">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded" />
                  <div className="space-y-1">
                    <Skeleton className="h-6 sm:h-7 w-40 sm:w-48 rounded" />
                    <Skeleton className="h-4 sm:h-5 w-64 sm:w-80 rounded" />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  {Array(8)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={index}
                        className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-background/80 to-muted/30 backdrop-blur-sm border border-white/10 shadow-lg"
                      >
                        <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded mb-2" />
                        <Skeleton className="h-4 sm:h-5 w-16 sm:w-20 rounded" />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action Skeleton */}
          <div className="mt-12 sm:mt-16 text-center">
            <Skeleton className="h-8 sm:h-10 w-64 sm:w-80 mx-auto rounded-full" />
          </div>
        </div>
      </main>
    </>
  );
}

function TeamMemberCardSkeleton() {
  return (
    <Card className="overflow-hidden w-full h-full p-0 bg-gradient-to-br from-background/50 to-muted/30 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Avatar and header skeleton */}
      <div className="p-4 sm:p-6 text-center">
        <div className="relative mb-4">
          <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8">
            <Skeleton className="w-full h-full rounded-full" />
          </div>
        </div>

        {/* Name and role skeleton */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-6 sm:h-7 w-32 sm:w-40 mx-auto rounded" />
          <Skeleton className="h-4 sm:h-5 w-24 sm:w-32 mx-auto rounded" />
        </div>

        {/* Description skeleton */}
        <div className="space-y-2 mb-6">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-4/5 mx-auto rounded" />
          <Skeleton className="h-4 w-3/4 mx-auto rounded" />
        </div>

        {/* Skills skeleton */}
        <div className="flex flex-wrap gap-1 sm:gap-2 justify-center mb-6">
          <Skeleton className="h-6 w-16 sm:w-20 rounded-full" />
          <Skeleton className="h-6 w-20 sm:w-24 rounded-full" />
          <Skeleton className="h-6 w-14 sm:w-18 rounded-full" />
        </div>

        {/* Social links skeleton */}
        <div className="flex justify-center gap-3">
          <Skeleton className="h-8 w-8 sm:h-9 sm:w-9 rounded-full" />
          <Skeleton className="h-8 w-8 sm:h-9 sm:w-9 rounded-full" />
          <Skeleton className="h-8 w-8 sm:h-9 sm:w-9 rounded-full" />
        </div>
      </div>
    </Card>
  );
}
