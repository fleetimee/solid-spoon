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
      className={`space-y-6 p-6 rounded-2xl bg-gradient-to-br from-card via-card to-accent/5 border shadow-lg ${className}`}
    >
      <div className="space-y-3">
        <Typography
          variant="h1"
          as="h1"
          className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
        >
          {room.name} ✨
        </Typography>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{room.capacity} people</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Available now</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>Premium</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Typography
          variant="default"
          className="text-muted-foreground leading-relaxed"
        >
          {room.description || "No description available."}
        </Typography>

        <div className="space-y-3">
          <Typography
            variant="h3"
            as="h3"
            className="flex items-center font-semibold text-lg"
          >
            <ListChecks className="h-5 w-5 mr-2 text-primary" />
            Quick Highlights
          </Typography>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {room.capacity} Person Capacity
              </span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/5 border border-green-500/20">
              <Clock className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Available 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
