import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableSkeleton } from "@/features/admin/users/users-table";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";

const usersBreadcrumb = [{ label: "Users" }, { label: "Manage Users" }];

/**
 * Loading component for the users page
 * Next.js automatically wraps this in a Suspense boundary and shows it
 * while the main page is loading server-side data
 */
export default function UsersPageLoading() {
  return (
    <>
      <BreadcrumbSetter items={usersBreadcrumb} />

      <main className="flex flex-col grow p-4 md:p-8 space-y-8">
        {/* Modern Header Skeleton */}
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>

        {/* User Statistics Cards Skeleton */}
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card
              key={index}
              className="border-0 bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/10 dark:to-purple-950/10 shadow-lg"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="w-10 h-10 rounded-full" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-8 w-16" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* User Management Content Skeleton */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Skeleton className="w-1 h-6 rounded-full" />
            <Skeleton className="h-6 w-40" />
          </div>

          <div className="bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/10 dark:to-purple-950/10 rounded-xl p-6 shadow-lg border-0 backdrop-blur-sm">
            <div className="space-y-6">
              <div className="flex items-center justify-end">
                {/* Create user button placeholder */}
                <Skeleton className="h-10 w-[130px] rounded-md" />
              </div>

              <DataTableSkeleton />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
