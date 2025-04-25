import { NotificationsContainer } from "@/features/notifications/components/notifications-container";
import { NotificationProvider } from "@/features/notifications/context/notification-context";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Admin Notifications | Room Reservation System",
  description: "View and manage system notifications",
};

export default async function NotificationsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <main className="flex flex-col grow p-4 md:p-8">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">
          View and manage system notifications
        </p>
      </div>

      <div className="w-full">
        <NotificationProvider>
          <NotificationsContainer />
        </NotificationProvider>
      </div>
    </main>
  );
}
