import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";
import { getNotifications } from "@/features/notifications/api/getNotifications";
import { NotificationFilter } from "@/features/notifications/types/notification";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";

export const metadata: Metadata = {
  title: "Admin Notifications | Room Reservation System",
  description: "View and manage system notifications",
};

export const fetchCache = "default-cache";

const notificationsBreadcrumb = [
  { label: "Dashboard" },
  { label: "Notifications" },
];

interface NotificationsPageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    filter?: NotificationFilter;
  }>;
}

interface NotificationSearchParams {
  page?: number;
  pageSize?: number;
  filter?: NotificationFilter;
}

export default async function NotificationsPage(props: NotificationsPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const searchParams = await props.searchParams;
  const parsedSearchParams: NotificationSearchParams = {
    page: searchParams.page ? parseInt(searchParams.page) : undefined,
    pageSize: searchParams.pageSize
      ? parseInt(searchParams.pageSize)
      : undefined,
    filter: searchParams.filter as NotificationFilter | undefined,
  };

  const currentLoggedInUser = session?.user.id;

  // Only fetch notifications if user is authenticated
  const notificationsData = currentLoggedInUser
    ? await getNotifications(currentLoggedInUser, parsedSearchParams)
    : {
        notifications: [],
        pagination: {
          totalItems: 0,
          totalPages: 0,
          currentPage: 1,
          pageSize: 10,
        },
      };

  return (
    <>
      <BreadcrumbSetter items={notificationsBreadcrumb} />

      <main className="flex flex-col grow p-4 md:p-8">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Notifications
          </h1>
          <p className="text-muted-foreground">
            View and manage system notifications
          </p>
        </div>

        {/* Display raw notification data as JSON */}
        <div className="rounded-lg border bg-card p-4">
          <h2 className="text-xl font-semibold mb-4">
            Notifications Data (JSON)
          </h2>
          <pre className="bg-muted p-4 rounded overflow-auto max-h-[500px]">
            {JSON.stringify(notificationsData, null, 2)}
          </pre>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Pagination Info</h3>
          <p>Total Items: {notificationsData.pagination.totalItems}</p>
          <p>
            Page: {notificationsData.pagination.currentPage} of{" "}
            {notificationsData.pagination.totalPages}
          </p>
        </div>
      </main>
    </>
  );
}
