import { Typography } from "@/components/ui/typography";
import { ListChecks, Users, Clock, Star } from "lucide-react";
import { Room } from "../types/room";

export interface RoomDetailHeaderProps {
  room: Room;
  className?: string;
}

export function RoomDetailHeader({
  room,
  className = "",
}: RoomDetailHeaderProps) {
  return (
    <div
      className={`space-y-4 p-4 md:p-6 rounded-xl bg-gradient-to-br from-card via-card to-accent/5 border shadow-md ${className}`}
    >
      <div className="space-y-2">
        <Typography
          variant="h1"
          as="h1"
          className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
        >
          {room.name}
        </Typography>

        {/* Quick Stats */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{room.capacity} people</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Typography
          variant="default"
          className="text-muted-foreground leading-relaxed text-sm"
        >
          {room.description || "No description available."}
        </Typography>

        <div className="space-y-2">
          <Typography
            variant="h3"
            as="h3"
            className="flex items-center font-semibold text-base"
          >
            <ListChecks className="h-4 w-4 mr-2 text-primary" />
            Quick Highlights
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">
                {room.capacity} Person Capacity
              </span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/5 border border-green-500/20">
              <Clock className="h-4 w-4 text-green-500" />
              <span className="text-xs font-medium">Available 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
