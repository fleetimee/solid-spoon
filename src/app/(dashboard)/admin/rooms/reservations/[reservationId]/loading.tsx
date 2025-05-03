import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReservationDetailsLoading() {
  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4 md:p-6">
      {/* BreadcrumbSetter placeholder omitted for loading state */}
      <div className="w-full max-w-3xl">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <Skeleton className="h-6 w-48 mb-2" /> {/* Title Placeholder */}
              <Skeleton className="h-4 w-64" /> {/* Description Placeholder */}
            </div>
            <Skeleton className="h-9 w-20" /> {/* Back Button Placeholder */}
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
              {/* Title Placeholder */}
              <div className="md:col-span-2 space-y-1">
                <Skeleton className="h-4 w-16" /> {/* Label */}
                <Skeleton className="h-5 w-3/4" /> {/* Value */}
              </div>
              {/* Room Placeholder */}
              <div className="space-y-1">
                <Skeleton className="h-4 w-12" /> {/* Label */}
                <Skeleton className="h-5 w-1/2" /> {/* Value */}
              </div>
              {/* User Placeholder */}
              <div className="space-y-1">
                <Skeleton className="h-4 w-20" /> {/* Label */}
                <Skeleton className="h-5 w-2/3" /> {/* Value */}
              </div>
              {/* Start Time Placeholder */}
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" /> {/* Label */}
                <Skeleton className="h-5 w-1/2" /> {/* Value */}
              </div>
              {/* End Time Placeholder */}
              <div className="space-y-1">
                <Skeleton className="h-4 w-20" /> {/* Label */}
                <Skeleton className="h-5 w-1/2" /> {/* Value */}
              </div>
              {/* Status Placeholder */}
              <div className="space-y-1">
                <Skeleton className="h-4 w-16" /> {/* Label */}
                <Skeleton className="h-6 w-24" /> {/* Badge Placeholder */}
              </div>
              {/* Description Placeholder */}
              <div className="md:col-span-2 space-y-1">
                <Skeleton className="h-4 w-24" /> {/* Label */}
                <Skeleton className="h-16 w-full" /> {/* Value Placeholder */}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
