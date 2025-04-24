"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NotificationsList } from "./notifications-list";
import { useNotifications } from "../context/notification-context";

export function NotificationsContainer() {
  const {
    unreadCount,
    filter,
    setFilter,
    markAllAsRead,
    clearAllNotifications,
  } = useNotifications();

  const handleFilterChange = (value: string) => {
    setFilter(value as "all" | "read" | "unread");
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleClearAll = async () => {
    await clearAllNotifications();
  };

  return (
    <div className="space-y-6 w-full">
      <Tabs
        value={filter}
        onValueChange={handleFilterChange}
        className="w-full"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <TabsList>
            <TabsTrigger value="all">
              All
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark all as read
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive"
              onClick={handleClearAll}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="pt-6">
          <NotificationsList filter="all" />
        </TabsContent>

        <TabsContent value="unread" className="pt-6">
          <NotificationsList filter="unread" />
        </TabsContent>

        <TabsContent value="read" className="pt-6">
          <NotificationsList filter="read" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
