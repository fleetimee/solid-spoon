"use client";

import React, { useState } from "react";
import { Room } from "@/features/rooms/types/room";
import { RoomCard } from "@/features/rooms/components/room-card";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { RoomListItem } from "./RoomListItem";

type ViewMode = "grid" | "list";

interface AvailableRoomsSectionProps {
  rooms: Room[];
}

export function AvailableRoomsSection({ rooms }: AvailableRoomsSectionProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  return (
    <section className="bg-muted/40 py-12 sm:py-16 md:py-20">
      <div className="w-full max-w-screen-xl mx-auto px-6">
        {/* Enhanced header section with marketing copy */}
        <div className="flex flex-col items-center text-center mb-12">
          <Typography
            variant="h2"
            className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl mb-4"
          >
            Discover Your Perfect Space
          </Typography>
          <Typography
            variant="muted"
            className="text-lg md:text-xl max-w-3xl mx-auto mb-8"
          >
            Browse our collection of premium rooms designed for productivity,
            collaboration, and innovation.
          </Typography>

          {/* View mode toggles */}
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              aria-label="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              aria-label="List View"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

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
                {rooms.map((room) => (
                  <RoomListItem key={room.id} room={room} />
                ))}
              </div>
            )}
            {/* See More Button */}
            <div className="mt-8 text-center">
              <Button variant="outline">See More</Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
