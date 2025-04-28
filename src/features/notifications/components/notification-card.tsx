import { Button, buttonVariants } from "@/components/ui/button"; // Added buttonVariants
import { Notification } from "../types/notification";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink } from "lucide-react"; // Import the icon
import { Check } from "lucide-react"; // Added Check icon
import { cn } from "@/lib/utils"; // Added cn

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
            {/* Container for buttons */}
            <div className="flex items-center gap-2">
              {!notification.isRead && (
                <Button variant="secondary" size="sm">
                  <span className="flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Mark as Read
                  </span>
                </Button>
              )}
              {notification.link && (
                <Link
                  href={notification.link}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" })
                    // Removed explicit flex classes here
                  )}
                >
                  <span className="flex items-center gap-1">
                    {" "}
                    {/* Added flex here */}
                    View
                    <ExternalLink className="h-3 w-3" />
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
