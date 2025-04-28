import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
// Separator is no longer needed for the item skeleton
// import { Separator } from "@/components/ui/separator";

export default function NotificationsLoading() {
  return (
    <main className="flex flex-col grow p-4 md:p-8 space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-8" />
        </div>
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Filter Tabs Skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="hidden md:flex space-x-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>

      {/* Pagination Indicator Skeleton (Above List) */}
      <div className="flex items-center justify-between text-sm mb-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Notification List Skeleton */}
      <Card>
        <CardContent className="p-0 divide-y">
          {" "}
          {/* Added divide-y */}
          {[...Array(5)].map((_, i) => (
            <NotificationItemSkeleton key={i} />
          ))}
        </CardContent>
      </Card>

      {/* Main Pagination Skeleton */}
      <div className="flex justify-center items-center space-x-1 mt-6">
        <Skeleton className="h-8 w-8" /> {/* Previous */}
        <Skeleton className="h-8 w-8" /> {/* Page 1 */}
        <Skeleton className="h-8 w-8" /> {/* Page 2 */}
        <Skeleton className="h-4 w-4" /> {/* Ellipsis */}
        <Skeleton className="h-8 w-8" /> {/* Last Page */}
        <Skeleton className="h-8 w-8" /> {/* Next */}
      </div>

      {/* Page Size Selector Skeleton */}
      <div className="flex items-center justify-center gap-2 mt-2">
        <Skeleton className="h-4 w-24" /> {/* "Items per page:" text */}
        <div className="flex gap-1">
          <Skeleton className="h-7 w-7" /> {/* Size Button */}
          <Skeleton className="h-7 w-7" /> {/* Size Button */}
          <Skeleton className="h-7 w-7" /> {/* Size Button */}
        </div>
      </div>
    </main>
  );
}

// Skeleton for a single notification item
function NotificationItemSkeleton() {
  return (
    <div className="relative p-4">
      <div className="flex items-start gap-4">
        <Skeleton className="h-2 w-2 mt-1.5" /> {/* Adjusted dot size */}
        <div className="flex-1">
          <Skeleton className="h-5 w-48 mb-2" /> {/* Title */}
          <Skeleton className="h-4 w-full max-w-md mb-2" /> {/* Message */}
          {/* Bottom row for timestamp and optional button */}
          <div className="flex items-center justify-between mt-2">
            <Skeleton className="h-3 w-24" /> {/* Timestamp */}
            <Skeleton className="h-6 w-12" /> {/* Optional 'View' Button */}
          </div>
        </div>
        {/* Removed the separate action skeleton from the original */}
      </div>
    </div>
  );
}
