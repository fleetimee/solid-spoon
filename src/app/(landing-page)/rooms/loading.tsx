import { cn } from "@/lib/utils"; // Added import
import { Skeleton } from "@/components/ui/skeleton";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

const roomsBreadcrumb = [{ label: "Home", href: "/" }, { label: "Rooms" }];

export default function RoomsLoading() {
  return (
    <>
      <BreadcrumbSetter items={roomsBreadcrumb} />

      <main className="flex flex-col grow p-4 md:p-8">
        <div className="flex flex-col gap-2 mb-6">
          <Typography variant="h1">Available Rooms</Typography>
          <Typography variant="muted">
            Browse and find the perfect room for your needs
          </Typography>
        </div>

        <div className="mb-6">
          {/* Filter Skeleton */}
          <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-[110px]" />
            </div>
          </div>
        </div>

        {/* Room Grid Skeleton - Updated for Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6">
          {" "}
          {/* Updated grid classes */}
          {Array(6)
            .fill(0)
            .map((_, index) => {
              // Apply conditional spanning classes for Bento layout
              let spanClasses = "md:col-span-2"; // Default span
              const patternIndex = index % 6; // Get position within the 6-item pattern

              if (patternIndex === 0) {
                spanClasses = "md:col-span-4 md:row-span-2"; // Large item
              } else if (patternIndex === 1 || patternIndex === 2) {
                spanClasses = "md:col-span-2"; // Small items next to large
              } else if (patternIndex === 3 || patternIndex === 4) {
                spanClasses = "md:col-span-3"; // Medium items below
              } else if (patternIndex === 5) {
                spanClasses = "md:col-span-6"; // Full width item
              }

              return (
                <div key={index} className={cn(spanClasses)}>
                  {" "}
                  {/* Wrapped skeleton and applied classes */}
                  <RoomCardSkeleton />
                </div>
              );
            })}
        </div>
      </main>
    </>
  );
}

function RoomCardSkeleton() {
  return (
    <Card className="overflow-hidden w-full h-full p-0">
      {" "}
      {/* Added h-full */}
      {/* Image skeleton */}
      <Skeleton className="aspect-[16/9] w-full" />
      <div className="p-4 space-y-3 flex flex-col">
        {" "}
        {/* Added flex flex-col */}
        {/* Title skeleton */}
        <div className="space-y-1">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        {/* Description skeleton */}
        <div className="min-h-[3rem] grow">
          {" "}
          {/* Added grow */}
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        {/* Capacity skeleton */}
        <Skeleton className="h-4 w-1/3" />
        {/* Facilities skeleton */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>
      </div>
    </Card>
  );
}
