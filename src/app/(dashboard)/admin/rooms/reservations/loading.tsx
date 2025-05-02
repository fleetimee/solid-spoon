import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Typography } from "@/components/ui/typography"; // Corrected import

export default function Loading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/4" /> {/* Placeholder for Typography */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" /> {/* Placeholder for CardTitle */}
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" /> {/* Placeholder for table */}
        </CardContent>
      </Card>
    </div>
  );
}
