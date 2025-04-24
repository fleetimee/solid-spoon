import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Typography } from "@/components/ui/typography";

const addRoomBreadcrumb = [
  { label: "Rooms", href: "#" },
  { label: "Manage Rooms", href: "/admin/rooms" },
  { label: "Add Room" },
];

export default function AddRoomLoading() {
  return (
    <>
      <BreadcrumbSetter items={addRoomBreadcrumb} />

      <main className="flex flex-col grow p-4 md:p-8">
        <div className="flex flex-col gap-2 mb-6">
          <Typography variant="h1">Add Room</Typography>
          <Typography variant="muted">
            Fill in the details below to add a new room.
          </Typography>
        </div>

        <Card className="p-6">
          <div className="space-y-6">
            {/* Room Name Field */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Room Description Field */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-32 w-full" />
            </div>

            {/* Location & Capacity Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* Facilities Section */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>

            {/* Form Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </Card>
      </main>
    </>
  );
}
