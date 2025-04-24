import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableSkeleton } from "@/features/admin/users/users-table";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Typography } from "@/components/ui/typography";

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

      <main className="flex flex-col grow p-4 md:p-8">
        <div className="flex flex-col gap-2 mb-6">
          <Typography variant="h1">User Management</Typography>
          <Typography variant="muted">
            Manage users and their permissions here.
          </Typography>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-end">
            {/* Create user button placeholder */}
            <Skeleton className="h-10 w-[130px] rounded-md" />
          </div>

          <Card>
            <CardContent className="p-0 sm:p-6">
              <DataTableSkeleton />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
