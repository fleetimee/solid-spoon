import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NotificationsLoading() {
  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-72" />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all" disabled>
              All
            </TabsTrigger>
            <TabsTrigger value="unread" disabled>
              Unread
            </TabsTrigger>
            <TabsTrigger value="read" disabled>
              Read
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>

        <TabsContent value="all" className="pt-4 space-y-4">
          <div>
            <Skeleton className="h-6 w-24 mb-3" />
            <Card>
              <CardContent className="p-0">
                {[...Array(3)].map((_, i) => (
                  <NotificationItemSkeleton key={i} isLast={i === 2} />
                ))}
              </CardContent>
            </Card>
          </div>

          <div>
            <Skeleton className="h-6 w-16 mb-3" />
            <Card>
              <CardContent className="p-0">
                {[...Array(2)].map((_, i) => (
                  <NotificationItemSkeleton key={i} isLast={i === 1} />
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NotificationItemSkeleton({ isLast }: { isLast: boolean }) {
  return (
    <>
      <div className="relative p-4">
        <div className="flex items-start gap-4">
          <Skeleton className="h-4 w-4 mt-0.5" />
          <div className="flex-1">
            <Skeleton className="h-5 w-48 mb-2" />
            <Skeleton className="h-4 w-full max-w-md mb-2" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
      {!isLast && <Separator />}
    </>
  );
}
