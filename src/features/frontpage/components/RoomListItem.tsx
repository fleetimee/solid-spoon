// src/features/frontpage/components/RoomListItem.tsx
import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/lib/icons"; // Correct import
import type { Room } from "@/features/rooms/types/room";

interface RoomListItemProps {
  room: Room;
}

export function RoomListItem({ room }: RoomListItemProps) {
  const firstImage = room.images?.[0] || "/placeholder.svg"; // Correct image URL access

  return (
    <Card className="flex items-center p-4 space-x-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex-shrink-0 w-20 h-16 relative">
        <Image
          src={firstImage}
          alt={room.name}
          layout="fill"
          objectFit="cover"
          className="rounded-md"
        />
      </div>
      <div className="flex-grow">
        <h3 className="text-lg font-semibold">{room.name}</h3>
        <div className="text-sm text-muted-foreground flex items-center space-x-2 mt-1">
          <Icon name="Users" className="w-4 h-4" /> {/* Use Icon component */}
          <span>Capacity: {room.capacity}</span>
        </div>
        <div className="text-sm text-muted-foreground flex items-center space-x-2 mt-1">
          <Icon name="Map" className="w-4 h-4" />{" "}
          {/* Use Icon component (Map as substitute for mapPin) */}
          <span>{room.location}</span>
        </div>
      </div>
      {/* Removed the Badge displaying room.type as it doesn't exist */}
      {/* <div className="flex-shrink-0"> */}
      {/* Add maybe price or a 'View Details' button here if needed */}
      {/* </div> */}
    </Card>
  );
}
