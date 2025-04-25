import { NotificationFilter } from "../types/notification";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

interface NotificationFiltersProps {
  currentFilter: NotificationFilter;
  pageSize?: string;
  showJson?: string;
}

export function NotificationFilters({
  currentFilter,
  pageSize,
  showJson,
}: NotificationFiltersProps) {
  const getFilterUrl = (filter: NotificationFilter) => {
    const params = new URLSearchParams();
    params.set("filter", filter);
    params.set("page", "1"); // Reset to first page when filter changes

    if (pageSize) {
      params.set("pageSize", pageSize);
    }

    if (showJson) {
      params.set("showJson", showJson);
    }

    return `/admin/notifications?${params.toString()}`;
  };

  return (
    <Tabs defaultValue={currentFilter} className="w-full">
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
  );
}
