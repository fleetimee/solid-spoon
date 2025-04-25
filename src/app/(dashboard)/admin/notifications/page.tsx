import { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getNotifications } from "@/features/notifications/api/getNotifications";
import { NotificationFilter } from "@/features/notifications/types/notification";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationFilters } from "@/features/notifications/components/NotificationFilters";
import { NotificationsList } from "@/features/notifications/components/NotificationsList";
import { NotificationPagination } from "@/features/notifications/components/NotificationPagination";
import {
  NotificationJsonToggle,
  NotificationJsonView,
} from "@/features/notifications/components/NotificationJsonToggle";
import Link from "next/link";

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

  // Parse and provide defaults for search parameters
  const parsedFilter = (searchParams.filter as NotificationFilter) || "all";
  const parsedPage = searchParams.page ? parseInt(searchParams.page) : 1;
  const parsedPageSize = searchParams.pageSize
    ? parseInt(searchParams.pageSize)
    : 5;
  const showJson = searchParams.showJson === "true";

  const currentLoggedInUser = session?.user.id;

  // Only fetch notifications if user is authenticated
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

  // Helper function to get page number for quick navigation
  const getQuickNavPageNumbers = () => {
    const { currentPage, totalPages } = notificationsData.pagination;
    const result = [];

    // Previous page in quick nav
    if (currentPage > 1) {
      result.push({
        label: "Previous Page",
        page: currentPage - 1,
        icon: <ChevronLeft className="h-4 w-4" />,
      });
    }

    // Next page in quick nav
    if (currentPage < totalPages) {
      result.push({
        label: "Next Page",
        page: currentPage + 1,
        icon: <ChevronRight className="h-4 w-4" />,
      });
    }

    return result;
  };

  // Generate URL for quick navigation
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
            <NotificationJsonToggle
              showJson={showJson}
              filter={searchParams.filter}
              page={searchParams.page}
              pageSize={searchParams.pageSize}
            />
          </div>
          <p className="text-muted-foreground">
            View and manage system notifications
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <NotificationFilters
            currentFilter={parsedFilter}
            pageSize={searchParams.pageSize}
            showJson={searchParams.showJson}
          />

          {/* Quick pagination navigation */}
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

        {showJson && <NotificationJsonView data={notificationsData} />}

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
