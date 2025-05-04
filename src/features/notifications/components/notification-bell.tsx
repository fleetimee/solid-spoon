import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getUnreadNotificationCount } from "../api/getUnreadNotificationCount";

export async function NotificationBell() {
  // Fetch the unread notification count
  const count = await getUnreadNotificationCount();

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative"
      aria-label={`Notifications ${count > 0 ? `(${count} unread)` : ""}`}
    >
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {count}
        </Badge>
      )}
    </Button>
  );
}
