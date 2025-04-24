import { NotificationsContainer } from "@/features/notifications/components/notifications-container";
import { NotificationProvider } from "@/features/notifications/context/notification-context";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Notifications | Room Reservation System",
  description: "View and manage system notifications",
};

export default function NotificationsPage() {
  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">
          View and manage system notifications
        </p>
      </div>

      <NotificationProvider>
        <NotificationsContainer />
      </NotificationProvider>
    </div>
  );
}
