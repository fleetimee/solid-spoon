import { Skeleton } from "@/components/ui/skeleton";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"; // Added Separator

export default function RoomDetailLoading() {
  const roomBreadcrumb = [
    { label: "Rooms", href: "/admin/rooms" },
    { label: "Loading..." },
  ];

  return (
    <>
      <BreadcrumbSetter items={roomBreadcrumb} />

      {/* Adjusted main container gap to match page.tsx */}
      <main className="flex flex-col grow p-4 max-w-7xl mx-auto w-full gap-8">
        {/* Added Header Skeleton */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div>
              <Skeleton className="h-8 w-48 mb-1" /> {/* Title */}
              <Skeleton className="h-4 w-64" />{" "}
              {/* Subtitle (Location/Capacity) */}
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" /> {/* Edit Button */}
              <Skeleton className="h-10 w-24" /> {/* Delete Button */}
            </div>
          </div>
        </div>

        {/* Added Image Gallery Skeleton */}
        <Skeleton className="w-full h-[400px] rounded-lg" />

        {/* Adjusted Description Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" /> {/* Icon */}
            <Skeleton className="h-5 w-1/4" /> {/* Description Title */}
          </div>
          {/* Adjusted blockquote skeleton */}
          <Skeleton className="h-16 w-full pl-4 py-2 rounded-r-md" />
        </div>

        {/* Adjusted Room Information Section (Single Card) */}
        <div className="grid grid-cols-1 gap-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" /> {/* Card Title */}
            </CardHeader>
            <CardContent className="grid gap-6">
              {/* Info Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full p-3 rounded-lg" /> // Info Item
                ))}
              </div>
              <Skeleton className="h-px w-full" /> {/* Separator */}
              {/* Facilities Section */}
              <div className="space-y-4">
                <Skeleton className="h-5 w-1/4" /> {/* Facilities Title */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-20 rounded-md" /> // Facility Badge
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Adjusted Full-Width Reservations Card */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" /> {/* Card Title */}
          </CardHeader>
          {/* Added pt-6 and Table structure */}
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" /> {/* Table Header */}
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" /> // Table Row
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
