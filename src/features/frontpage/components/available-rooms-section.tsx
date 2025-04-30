"use client";

import React, { useState } from "react"; // Removed useEffect
// Removed getRooms import
import { Room } from "@/features/rooms/types/room";
import { RoomCard } from "@/features/rooms/components/room-card";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react"; // Import icons directly
// Removed Skeleton import
import { Typography } from "@/components/ui/typography"; // Correct import
import { RoomListItem } from "./RoomListItem"; // Import the new list item component

type ViewMode = "grid" | "list";

interface AvailableRoomsSectionProps {
  rooms: Room[]; // Add rooms prop
}

export function AvailableRoomsSection({ rooms }: AvailableRoomsSectionProps) {
  // Destructure rooms prop
  // Removed useState for rooms, isLoading, error
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Removed useEffect for data fetching
  // Removed renderSkeletons function

  return (
    <section className="container mx-auto py-12 md:py-16 lg:py-20">
      <div className="mb-8 flex items-center justify-between">
        <Typography variant="h2">Available Rooms</Typography>{" "}
        {/* Use Typography component */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
            aria-label="Grid View"
          >
            <LayoutGrid className="h-4 w-4" /> {/* Use imported icon */}
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
            aria-label="List View"
            // Removed disabled attribute
          >
            <List className="h-4 w-4" /> {/* Use imported icon */}
          </Button>
        </div>
      </div>

      {/* Removed isLoading block */}

      {/* Removed error block */}

      {/* Simplified conditional rendering based on rooms prop */}
      {rooms.length === 0 && (
        <p className="text-center text-muted-foreground">
          No rooms available at the moment.
        </p>
      )}

      {rooms.length > 0 && (
        <>
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
          {viewMode === "list" && (
            <div className="space-y-4">
              {/* Render RoomListItem for each room */}
              {rooms.map((room) => (
                <RoomListItem key={room.id} room={room} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
