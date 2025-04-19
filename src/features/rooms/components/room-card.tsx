import Image from "next/image";
import { Users, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Room } from "../types/room";

interface RoomCardProps {
  room: Room;
  className?: string;
}

export function RoomCard({ room, className }: RoomCardProps) {
  const facilities = room.facilities
    ? room.facilities.split(",").map((facility) => facility.trim())
    : [];

  return (
    <Card
      className={`overflow-hidden w-full transition-all duration-200 hover:shadow-md p-0 ${className || ""}`}
    >
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={room.coverImage || "/placeholder.svg"}
          alt={room.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
      </div>

      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-foreground leading-tight line-clamp-1">
            {room.name}
          </h3>
          {room.location && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{room.location}</span>
            </div>
          )}
        </div>

        <div className="min-h-[3rem] flex items-start">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {room.description || "No description available"}
          </p>
        </div>

        {room.capacity > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-4 w-4 flex-shrink-0" />
            <span>Capacity: {room.capacity}</span>
          </div>
        )}

        {facilities.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {facilities.slice(0, 3).map((facility, index) => (
              <Badge key={index}>{facility}</Badge>
            ))}
            {facilities.length > 3 && (
              <Badge variant="outline">+{facilities.length - 3} more</Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
