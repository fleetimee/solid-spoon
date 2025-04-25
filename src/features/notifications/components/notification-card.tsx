import { Button } from "@/components/ui/button";
import { Notification } from "../types/notification";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface NotificationCardProps {
  notification: Notification;
}

export function NotificationCard({ notification }: NotificationCardProps) {
  // Format the timestamp to a relative time (e.g., "3 hours ago")
  const formattedTime = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
  });

  return (
    <div className="p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-2">
        <div
          className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
            notification.isRead ? "bg-muted" : "bg-primary"
          }`}
        />
        <div className="flex-1">
          <h3 className="font-medium">{notification.title}</h3>
          <p className="text-muted-foreground text-sm">
            {notification.message}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              {formattedTime}
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
  );
}
