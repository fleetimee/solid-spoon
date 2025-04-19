import { Skeleton } from "@/components/ui/skeleton";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";

const roomsBreadcrumb = [{ label: "Rooms" }, { label: "Manage Rooms" }];

export default function RoomsLoading() {
  return (
    <>
      <BreadcrumbSetter items={roomsBreadcrumb} />

      <main className="flex flex-col grow p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Manage Rooms</h1>
            <p className="text-muted-foreground">Manage and organize rooms</p>
          </div>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Add Room
          </Button>
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

        {/* Room Grid Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <RoomCardSkeleton key={index} />
            ))}
        </div>
      </main>
    </>
  );
}

function RoomCardSkeleton() {
  return (
    <Card className="overflow-hidden w-full p-0">
      {/* Image skeleton */}
      <Skeleton className="aspect-[16/9] w-full" />

      <div className="p-4 space-y-3">
        {/* Title skeleton */}
        <div className="space-y-1">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        {/* Description skeleton */}
        <div className="min-h-[3rem]">
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
