"use client";

import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NotificationBellProps {
  initialCount: number;
}

export function NotificationBell({ initialCount }: NotificationBellProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      className="relative"
      aria-label={`Notifications ${initialCount > 0 ? `(${initialCount} unread)` : ""}`}
    >
      <Bell className="h-5 w-5" />
      {initialCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {initialCount}
        </Badge>
      )}
    </Button>
  );
}
