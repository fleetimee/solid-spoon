import { Metadata } from "next";
import {
  AlertCircle,
  Bell,
  Check,
  Info,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Admin Notifications | Room Reservation System",
  description: "View and manage system notifications",
};

// This would typically come from an API endpoint
async function getNotifications() {
  // Simulated API response delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    unread: [
      {
        id: "n1",
        title: "New room booking request",
        message: "John Doe has requested to book Room 101 for tomorrow",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        type: "booking",
        priority: "high",
      },
      {
        id: "n2",
        title: "System update scheduled",
        message: "System maintenance scheduled for tonight at 2 AM",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        type: "system",
        priority: "medium",
      },
      {
        id: "n3",
        title: "New user registered",
        message: "Jane Smith has created a new account",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        type: "user",
        priority: "low",
      },
    ],
    read: [
      {
        id: "n4",
        title: "Room maintenance completed",
        message: "Scheduled maintenance for Conference Room A is now complete",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        type: "maintenance",
        priority: "medium",
      },
      {
        id: "n5",
        title: "Booking canceled",
        message: "Mike Johnson canceled their booking for Room 203",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        type: "booking",
        priority: "low",
      },
    ],
  };
}

export default async function NotificationsPage() {
  const { unread, read } = await getNotifications();
  const totalUnread = unread.length;

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">
          View and manage system notifications
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">
              All
              {totalUnread > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {totalUnread}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Mark all as read
            </Button>
            <Button variant="outline" size="sm" className="text-destructive">
              <Trash2 className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="pt-4 space-y-4">
          {unread.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Unread</h2>
              <Card>
                <CardContent className="p-0">
                  {unread.map((notification, index) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      isLast={index === unread.length - 1}
                    />
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {read.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Read</h2>
              <Card>
                <CardContent className="p-0">
                  {read.map((notification, index) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      isLast={index === read.length - 1}
                    />
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="unread" className="pt-4">
          {unread.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                {unread.map((notification, index) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    isLast={index === unread.length - 1}
                  />
                ))}
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <Bell className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">
                No unread notifications
              </h3>
              <p className="text-muted-foreground">
                You're all caught up! Check back later for new notifications.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="read" className="pt-4">
          {read.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                {read.map((notification, index) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    isLast={index === read.length - 1}
                  />
                ))}
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <Bell className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">
                No read notifications
              </h3>
              <p className="text-muted-foreground">
                You haven't read any notifications yet.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// This component needs to be a client component if interactive functionality is needed
function NotificationItem({
  notification,
  isLast,
}: {
  notification: any;
  isLast: boolean;
}) {
  const { title, message, timestamp, type, priority } = notification;

  const typeConfig: Record<string, { icon: React.ReactNode; color: string }> = {
    booking: {
      icon: <Bell className="h-4 w-4" />,
      color: "text-blue-500",
    },
    system: {
      icon: <AlertCircle className="h-4 w-4" />,
      color: "text-orange-500",
    },
    user: {
      icon: <Info className="h-4 w-4" />,
      color: "text-sky-500",
    },
    maintenance: {
      icon: <Check className="h-4 w-4" />,
      color: "text-green-500",
    },
  };

  const priorityClassMap: Record<string, string> = {
    high: "bg-red-500",
    medium: "bg-yellow-500",
    low: "bg-green-500",
  };

  const config = typeConfig[type] || typeConfig.system;

  return (
    <>
      <div className="relative p-4 hover:bg-muted/50">
        <div className="absolute top-4 right-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mark as read</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-start gap-4 pr-8">
          <div className={`mt-0.5 ${config.color}`}>{config.icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{title}</span>
              <div
                className={`w-2 h-2 rounded-full ${priorityClassMap[priority]}`}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-1">{message}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {format(timestamp, "MMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>
      </div>
      {!isLast && <Separator />}
    </>
  );
}
