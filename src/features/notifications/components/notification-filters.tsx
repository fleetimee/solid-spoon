"use client";

import { NotificationFilter } from "../types/notification";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Bell, BellRing, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationFiltersProps {
  currentFilter: NotificationFilter;
  pageSize?: string | undefined;
  showJson?: string | undefined;
}

export function NotificationFilters({
  currentFilter,
}: NotificationFiltersProps) {
  const searchParams = useSearchParams();
  const clientFilter = searchParams.get("filter") as NotificationFilter | null;

  // Determine the active filter: prioritize client-side URL param, fallback to server prop
  const activeFilter = clientFilter ?? currentFilter;

  const getFilterUrl = (filter: NotificationFilter) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("filter", filter);
    params.set("page", "1"); // Reset to first page when filter changes

    return `/admin/notifications?${params.toString()}`;
  };

  const getFilterConfig = (filter: NotificationFilter) => {
    switch (filter) {
      case "all":
        return {
          icon: Bell,
          label: "All Notifications",
          gradient: "from-purple-500 to-violet-500",
          hoverBg: "hover:bg-purple-50 dark:hover:bg-purple-950/20",
          activeBg:
            "data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-500",
        };
      case "unread":
        return {
          icon: BellRing,
          label: "Unread",
          gradient: "from-orange-500 to-red-500",
          hoverBg: "hover:bg-orange-50 dark:hover:bg-orange-950/20",
          activeBg:
            "data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500",
        };
      case "read":
        return {
          icon: Check,
          label: "Read",
          gradient: "from-emerald-500 to-green-500",
          hoverBg: "hover:bg-emerald-50 dark:hover:bg-emerald-950/20",
          activeBg:
            "data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-500",
        };
    }
  };

  return (
    <div className="w-full">
      <Tabs defaultValue={activeFilter} className="w-full">
        <TabsList
          className={cn(
            "grid w-full grid-cols-3 p-1 h-auto",
            "bg-gradient-to-r from-purple-50/50 to-violet-50/50",
            "dark:from-purple-950/20 dark:to-violet-950/20",
            "border border-purple-200/30 dark:border-purple-800/20",
            "backdrop-blur-sm"
          )}
        >
          {(["all", "unread", "read"] as const).map((filter) => {
            const config = getFilterConfig(filter);
            const Icon = config.icon;

            return (
              <TabsTrigger
                key={filter}
                value={filter}
                asChild
                className={cn(
                  "relative flex items-center gap-2 px-4 py-3 rounded-md",
                  "transition-all duration-300 ease-in-out",
                  "data-[state=active]:text-white data-[state=active]:shadow-lg",
                  "data-[state=active]:scale-105",
                  config.hoverBg,
                  config.activeBg
                )}
              >
                <Link
                  href={getFilterUrl(filter)}
                  className="flex items-center gap-2 font-medium"
                >
                  <Icon className="h-4 w-4" />
                  <span>{config.label}</span>

                  {/* Glassmorphism effect on active state */}
                  <div
                    className={cn(
                      "absolute inset-0 rounded-md opacity-0",
                      "data-[state=active]:opacity-20",
                      "bg-white/10 backdrop-blur-sm",
                      "transition-opacity duration-300"
                    )}
                  />
                </Link>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
}
