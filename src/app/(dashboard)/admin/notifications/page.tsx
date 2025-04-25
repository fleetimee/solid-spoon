import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getNotifications } from "@/features/notifications/api/getNotifications";
import { NotificationFilter } from "@/features/notifications/types/notification";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Code, ChevronLeft, ChevronRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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

interface NotificationSearchParams {
  page?: number;
  pageSize?: number;
  filter?: NotificationFilter;
  showJson?: boolean;
}

export default async function NotificationsPage(props: NotificationsPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const searchParams = await props.searchParams;
  const parsedSearchParams: NotificationSearchParams = {
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    pageSize: searchParams.pageSize ? parseInt(searchParams.pageSize) : 5, // Smaller page size to better demonstrate pagination
    filter: (searchParams.filter as NotificationFilter) || "all",
    showJson: searchParams.showJson === "true",
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
          pageSize: 5,
        },
      };

  const getPaginationUrl = (
    targetPage: number,
    filter?: NotificationFilter
  ) => {
    const params = new URLSearchParams();

    if (filter) {
      params.set("filter", filter);
    } else if (searchParams.filter) {
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

  const getFilterUrl = (filter: NotificationFilter) => {
    const params = new URLSearchParams();
    params.set("filter", filter);
    params.set("page", "1"); // Reset to first page when filter changes

    if (searchParams.pageSize) {
      params.set("pageSize", searchParams.pageSize);
    }

    if (searchParams.showJson) {
      params.set("showJson", searchParams.showJson);
    }

    return `/admin/notifications?${params.toString()}`;
  };

  const getToggleJsonUrl = (show: boolean) => {
    const params = new URLSearchParams();

    if (searchParams.filter) {
      params.set("filter", searchParams.filter);
    }

    if (searchParams.page) {
      params.set("page", searchParams.page);
    }

    if (searchParams.pageSize) {
      params.set("pageSize", searchParams.pageSize);
    }

    params.set("showJson", show.toString());

    return `/admin/notifications?${params.toString()}`;
  };

  const getPaginationItems = () => {
    const { currentPage, totalPages } = notificationsData.pagination;

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <PaginationItem key={page}>
          <PaginationLink
            href={getPaginationUrl(page)}
            isActive={page === currentPage}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      ));
    }

    const items = [];

    // Always show first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink href={getPaginationUrl(1)} isActive={1 === currentPage}>
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Show ellipsis if current page is beyond page 3
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Calculate range around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href={getPaginationUrl(i)}
            isActive={i === currentPage}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if current page is before totalPages - 2
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href={getPaginationUrl(totalPages)}
            isActive={totalPages === currentPage}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
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

  return (
    <>
      <BreadcrumbSetter items={notificationsBreadcrumb} />

      <main className="flex flex-col grow p-4 md:p-8">
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold tracking-tight">
              Notifications
            </h1>
            <div className="flex items-center space-x-2">
              <Label htmlFor="show-json" className="text-sm">
                Show JSON
              </Label>
              <Link
                href={getToggleJsonUrl(!parsedSearchParams.showJson)}
                className="inline-flex"
              >
                <Switch id="show-json" checked={parsedSearchParams.showJson} />
              </Link>
            </div>
          </div>
          <p className="text-muted-foreground">
            View and manage system notifications
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <Tabs
            defaultValue={parsedSearchParams.filter || "all"}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value="all" asChild>
                <Link href={getFilterUrl("all")}>All</Link>
              </TabsTrigger>
              <TabsTrigger value="unread" asChild>
                <Link href={getFilterUrl("unread")}>Unread</Link>
              </TabsTrigger>
              <TabsTrigger value="read" asChild>
                <Link href={getFilterUrl("read")}>Read</Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>

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

        {parsedSearchParams.showJson && (
          <div className="rounded-lg border bg-card p-4 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Code className="h-5 w-5" />
              <h2 className="text-xl font-semibold">
                Raw Notification Data (JSON)
              </h2>
            </div>
            <pre className="bg-muted p-4 rounded overflow-auto max-h-[400px] text-sm">
              {JSON.stringify(notificationsData, null, 2)}
            </pre>
          </div>
        )}

        {notificationsData.notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-muted/50 rounded-full p-6 mb-4">
              <Bell
                className="h-10 w-10 text-muted-foreground"
                strokeWidth={1.5}
              />
            </div>
            <h3 className="text-xl font-medium mb-2">No notifications found</h3>
            <p className="text-muted-foreground max-w-sm">
              {parsedSearchParams.filter === "unread"
                ? "You don't have any unread notifications at the moment."
                : parsedSearchParams.filter === "read"
                  ? "You don't have any read notifications yet."
                  : "You don't have any notifications at the moment."}
            </p>
          </div>
        ) : (
          <>
            {/* Pagination indicator before notifications */}
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <div>
                <span className="font-medium text-foreground">
                  Page {notificationsData.pagination.currentPage}
                </span>{" "}
                of {notificationsData.pagination.totalPages}
              </div>

              <div>
                Showing{" "}
                {(notificationsData.pagination.currentPage - 1) *
                  notificationsData.pagination.pageSize +
                  1}{" "}
                to{" "}
                {Math.min(
                  notificationsData.pagination.currentPage *
                    notificationsData.pagination.pageSize,
                  notificationsData.pagination.totalItems
                )}{" "}
                of {notificationsData.pagination.totalItems} notifications
              </div>
            </div>

            <div className="rounded-lg border bg-card">
              <div className="divide-y">
                {notificationsData.notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${notification.isRead ? "bg-muted" : "bg-primary"}`}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{notification.title}</h3>
                        <p className="text-muted-foreground text-sm">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(notification.created_at).toLocaleString()}
                          </span>
                          {notification.link && (
                            <Button asChild size="sm" variant="ghost">
                              <Link href={notification.link}>View</Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Pagination */}
            {notificationsData.pagination.totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center gap-2">
                <Pagination>
                  <PaginationContent>
                    {notificationsData.pagination.currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious
                          href={getPaginationUrl(
                            notificationsData.pagination.currentPage - 1
                          )}
                        />
                      </PaginationItem>
                    )}

                    {getPaginationItems()}

                    {notificationsData.pagination.currentPage <
                      notificationsData.pagination.totalPages && (
                      <PaginationItem>
                        <PaginationNext
                          href={getPaginationUrl(
                            notificationsData.pagination.currentPage + 1
                          )}
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>

                {/* Page size selector for pagination testing */}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground">
                    Items per page:
                  </span>
                  <div className="flex gap-1">
                    {[3, 5, 10].map((size) => (
                      <Button
                        key={size}
                        variant={
                          parsedSearchParams.pageSize === size
                            ? "secondary"
                            : "outline"
                        }
                        size="sm"
                        className="h-7 px-2 text-xs"
                        asChild
                      >
                        <Link
                          href={(() => {
                            const params = new URLSearchParams();
                            if (searchParams.filter)
                              params.set("filter", searchParams.filter);
                            params.set("page", "1");
                            params.set("pageSize", size.toString());
                            if (searchParams.showJson)
                              params.set("showJson", searchParams.showJson);
                            return `/admin/notifications?${params.toString()}`;
                          })()}
                        >
                          {size}
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
