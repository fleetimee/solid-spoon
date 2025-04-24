"use client";

import { RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NotificationsList } from "./notifications-list";
import { useNotifications } from "../context/notification-context";
import { useState } from "react";

export function NotificationsContainer() {
  const {
    unreadCount,
    filter,
    setFilter,
    markAllAsRead,
    clearAllNotifications,
    refreshNotifications,
    isLoading,
  } = useNotifications();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleFilterChange = (value: string) => {
    setFilter(value as "all" | "read" | "unread");
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleClearAll = async () => {
    await clearAllNotifications();
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshNotifications();
    setIsRefreshing(false);
  };

  return (
    <div className="w-full">
      <div className="pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 mb-6">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading || isRefreshing}
              className="h-9 px-3"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0 || isLoading}
              className="h-9 px-3 whitespace-nowrap"
            >
              Mark all read
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-red-800 dark:hover:bg-red-950"
              onClick={handleClearAll}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        <Tabs
          value={filter}
          onValueChange={handleFilterChange}
          className="w-full"
        >
          <div className="border-b border-border">
            <TabsList className="h-12 bg-transparent p-0">
              <TabsTrigger
                value="all"
                className="relative h-12 rounded-none border-b-2 border-transparent px-4 pb-3 pt-3 font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="unread"
                className="relative h-12 rounded-none border-b-2 border-transparent px-4 pb-3 pt-3 font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground"
              >
                Unread
                {unreadCount > 0 && (
                  <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-medium leading-none text-primary-foreground">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="read"
                className="relative h-12 rounded-none border-b-2 border-transparent px-4 pb-3 pt-3 font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground"
              >
                Read
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="p-0 mt-0">
            <NotificationsList filter="all" />
          </TabsContent>

          <TabsContent value="unread" className="p-0 mt-0">
            <NotificationsList filter="unread" />
          </TabsContent>

          <TabsContent value="read" className="p-0 mt-0">
            <NotificationsList filter="read" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
