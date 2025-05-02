import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { getNotifications } from "@/features/notifications/api/getNotifications";
import { NotificationFilter } from "@/features/notifications/types/notification";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Button } from "@/components/ui/button";
import { NotificationFilters } from "@/features/notifications/components/notification-filters";
import { NotificationsList } from "@/features/notifications/components/notifications-list";
import { NotificationPagination } from "@/features/notifications/components/notification-pagination";
import {
  NotificationJsonToggle,
  NotificationJsonView,
} from "@/features/notifications/components/notification-json-toggle";
import { ClearNotificationsButton } from "@/features/notifications/components/clear-notifications-button";
import { MarkAllAsReadButton } from "@/features/notifications/components/mark-all-as-read-button";

export const metadata: Metadata = {
  title: "Notifications | Room Reservation System",
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
    showJson?: string;
  }>;
}

export default async function NotificationsPage(props: NotificationsPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const searchParams = await props.searchParams;

  const parsedFilter = (searchParams.filter as NotificationFilter) || "all";
  const parsedPage = searchParams.page ? parseInt(searchParams.page) : 1;
  const parsedPageSize = searchParams.pageSize
    ? parseInt(searchParams.pageSize)
    : 5;
  const showJson = searchParams.showJson === "true";
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === "true";

  const currentLoggedInUser = session?.user.id;

  const notificationsData = currentLoggedInUser
    ? await getNotifications(currentLoggedInUser, {
        filter: parsedFilter,
        page: parsedPage,
        pageSize: parsedPageSize,
      })
    : {
        notifications: [],
        pagination: {
          totalItems: 0,
          totalPages: 0,
          currentPage: 1,
          pageSize: 5,
        },
      };

  let readNotificationCount = 0;
  if (currentLoggedInUser) {
    try {
      const countResult = await db.query(
        "SELECT COUNT(*) as total FROM notification WHERE recipient_id = $1 AND is_read = true",
        ["admin"]
      );
      readNotificationCount = parseInt(countResult.rows[0]?.total || "0", 10);
    } catch (error) {
      console.error("Failed to fetch read notification count:", error);
    }
  }
  const hasReadNotifications = readNotificationCount > 0;

  let unreadNotificationCount = 0;
  if (currentLoggedInUser) {
    try {
      const countResult = await db.query(
        "SELECT COUNT(*) as total FROM notification WHERE recipient_id = $1 AND is_read = false",
        ["admin"]
      );
      unreadNotificationCount = parseInt(countResult.rows[0]?.total || "0", 10);
    } catch (error) {
      console.error("Failed to fetch unread notification count:", error);
    }
  }
  const hasUnreadNotifications = unreadNotificationCount > 0;

  const getQuickNavPageNumbers = () => {
    const { currentPage, totalPages } = notificationsData.pagination;
    const result = [];

    if (currentPage > 1) {
      result.push({
        label: "Previous Page",
        page: currentPage - 1,
        icon: <ChevronLeft className="h-4 w-4" />,
      });
    }

    if (currentPage < totalPages) {
      result.push({
        label: "Next Page",
        page: currentPage + 1,
        icon: <ChevronRight className="h-4 w-4" />,
      });
    }

    return result;
  };

  const getPaginationUrl = (targetPage: number) => {
    const params = new URLSearchParams();

    if (searchParams.filter) {
      params.set("filter", searchParams.filter);
    }

    params.set("page", targetPage.toString());

    if (searchParams.pageSize) {
      params.set("pageSize", searchParams.pageSize);
    }

    if (searchParams.showJson) {
      params.set("showJson", searchParams.showJson);
    }

    return `/admin/notifications?${params.toString()}`;
  };

  return (
    <>
      <BreadcrumbSetter items={notificationsBreadcrumb} />

      <main className="flex flex-col grow p-4 md:p-8">
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold tracking-tight">
              Notifications
            </h1>
            {isDevMode && (
              <NotificationJsonToggle
                showJson={showJson}
                filter={searchParams.filter}
                page={searchParams.page}
                pageSize={searchParams.pageSize}
              />
            )}
          </div>
          <p className="text-muted-foreground">
            View and manage system notifications
          </p>
        </div>

        <div className="flex justify-between items-center gap-4 mb-6">
          <NotificationFilters
            currentFilter={parsedFilter}
            pageSize={searchParams.pageSize}
            showJson={searchParams.showJson}
          />

          <div className="flex items-center gap-2">
            {currentLoggedInUser && (
              <MarkAllAsReadButton
                userId={currentLoggedInUser}
                hasUnreadNotifications={hasUnreadNotifications}
              />
            )}

            {currentLoggedInUser && (
              <ClearNotificationsButton
                userId={currentLoggedInUser}
                hasReadNotifications={hasReadNotifications}
              />
            )}

            <div className="hidden md:flex space-x-2">
              {getQuickNavPageNumbers().map((nav) => (
                <Button
                  key={nav.label}
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-8 px-2"
                >
                  <Link href={getPaginationUrl(nav.page)}>
                    {nav.icon}
                    <span className="ml-1 sr-only">{nav.label}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {isDevMode && showJson && (
          <NotificationJsonView data={notificationsData} />
        )}

        <NotificationsList
          notifications={notificationsData.notifications}
          filter={parsedFilter}
          totalItems={notificationsData.pagination.totalItems}
          currentPage={notificationsData.pagination.currentPage}
          pageSize={notificationsData.pagination.pageSize}
        />

        <NotificationPagination
          currentPage={notificationsData.pagination.currentPage}
          totalPages={notificationsData.pagination.totalPages}
          filter={parsedFilter}
          pageSize={searchParams.pageSize}
          showJson={searchParams.showJson}
        />
      </main>
    </>
  );
}
