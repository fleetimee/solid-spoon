import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AddRoomLoading() {
  const roomsBreadcrumb = [
    { label: "Rooms" },
    { label: "Manage Rooms", href: "/admin/rooms" },
    { label: "Add Room" },
  ];

  return (
    <>
      <BreadcrumbSetter items={roomsBreadcrumb} />

      <main className="flex flex-col grow p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-2">Add Room</h1>
        <p className="text-muted-foreground mb-6">
          Fill in the details below to add a new room.
        </p>

        <Card className="p-4 md:p-6">
          <div className="space-y-6">
            {/* Form skeleton */}
            <div className="space-y-4">
              {/* Room name field */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Room description field */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-32 w-full" />
              </div>

              {/* Location field */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Capacity field */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Facilities field */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-28" />
                <div className="flex flex-wrap gap-2 mt-2">
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-32 rounded-full" />
                  <Skeleton className="h-8 w-28 rounded-full" />
                  <Skeleton className="h-8 w-20 rounded-full" />
                </div>
              </div>

              {/* Image upload area */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-40 w-full rounded-md" />
              </div>

              {/* Submit button */}
              <div className="pt-6 flex justify-end">
                <Skeleton className="h-10 w-36" />
              </div>
            </div>
          </div>
        </Card>
      </main>
    </>
  );
}
