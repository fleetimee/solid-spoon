import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, MapPin, Users } from "lucide-react";
import { Room } from "../types/room";

interface RoomDetailHeaderProps {
  room: Room;
}

export function RoomDetailHeader({ room }: RoomDetailHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6 md:p-8 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-4">
          {/* Room Name */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
              {room.name}
            </h1>

            {/* Location and Capacity Info */}
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="secondary"
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-0"
              >
                <MapPin className="h-3 w-3 mr-1" />
                {room.location || "Location not specified"}
              </Badge>

              <Badge
                variant="secondary"
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-0"
              >
                <Users className="h-3 w-3 mr-1" />
                {room.capacity} people
              </Badge>

              <Badge
                variant={room.isActive ? "default" : "destructive"}
                className="px-3 py-1"
              >
                {room.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          {/* Description */}
          {room.description && (
            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              {room.description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 shrink-0">
          <Button variant="outline" className="flex items-center gap-2" asChild>
            <Link href={`/admin/rooms/${room.slug}/update`}>
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Link>
          </Button>

          <Button
            variant="destructive"
            className="flex items-center gap-2"
            asChild
          >
            <Link href={`/admin/rooms/${room.slug}/delete`}>
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
