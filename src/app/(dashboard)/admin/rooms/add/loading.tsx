import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { Star, FileText, Image as ImageIcon, AlertCircle } from "lucide-react";

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

        <div className="space-y-10">
          {/* Section 1: Create Your Perfect Space */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
                <Star className="h-5 w-5" />
                <Skeleton className="h-6 w-48" />
              </h2>
              <div className="mt-1">
                <Skeleton className="h-4 w-full max-w-xl" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card rounded-lg p-6 border shadow-sm">
              <div className="space-y-5">
                {/* Room Name Field */}
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full mt-2" />
                </div>

                {/* Location Field */}
                <div className="space-y-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full mt-2" />
                </div>
              </div>

              <div className="space-y-5">
                {/* Capacity Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-28" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full mt-2" />
                </div>

                {/* Facilities Field */}
                <div className="space-y-2">
                  <Skeleton className="h-6 w-28" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full mt-2" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Tell Us More */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
                <FileText className="h-5 w-5" />
                <Skeleton className="h-6 w-32" />
              </h2>
              <div className="mt-1">
                <Skeleton className="h-4 w-full max-w-xl" />
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border shadow-sm">
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-32 w-full mt-2" />
              </div>
            </div>
          </div>

          {/* Section 3: Show It Off */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
                <ImageIcon className="h-5 w-5" />
                <Skeleton className="h-6 w-28" />
              </h2>
              <div className="mt-1">
                <Skeleton className="h-4 w-full max-w-xl" />
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border shadow-sm space-y-6">
              {/* Image Upload Area */}
              <div className="space-y-2">
                <Skeleton className="h-6 w-36" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-40 w-full rounded-md mt-3 border-2 border-dashed border-primary/20" />
              </div>

              {/* Alert */}
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <div className="ml-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-full mt-1" />
                </div>
              </Alert>
            </div>
          </div>

          {/* Form Footer */}
          <div className="border-t pt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <Skeleton className="h-5 w-64" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-36" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
