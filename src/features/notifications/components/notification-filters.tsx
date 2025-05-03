"use client";

import { NotificationFilter } from "../types/notification";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useSearchParams } from "next/navigation"; // Added import

interface NotificationFiltersProps {
  currentFilter: NotificationFilter; // This is the server-rendered filter
  // pageSize and showJson are implicitly handled by reading from searchParams now
}

export function NotificationFilters({
  currentFilter,
}: // No need to pass pageSize or showJson as props anymore if always read from URL
NotificationFiltersProps) {
  const searchParams = useSearchParams(); // Use the hook
  const clientFilter = searchParams.get("filter") as NotificationFilter | null; // Read the filter param client-side

  // Determine the active filter: prioritize client-side URL param, fallback to server prop
  // This ensures the tab reflects the URL upon hydration
  const activeFilter = clientFilter ?? currentFilter;

  const getFilterUrl = (filter: NotificationFilter) => {
    // Create params from current searchParams to preserve others (like pageSize, showJson)
    const params = new URLSearchParams(searchParams.toString());
    params.set("filter", filter);
    params.set("page", "1"); // Reset to first page when filter changes

    return `/admin/notifications?${params.toString()}`;
  };

  // Use the determined activeFilter for defaultValue or value.
  // defaultValue works well here as it sets the initial state based on the URL/prop
  // and allows internal state management by the Tabs component afterwards.
  return (
    <Tabs defaultValue={activeFilter} className="w-full">
      <TabsList>
        <TabsTrigger value="all" asChild>
          {/* Links now preserve other existing search params */}
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
