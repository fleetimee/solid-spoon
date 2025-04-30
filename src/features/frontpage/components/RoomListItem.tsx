"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  MapPin,
  ArrowRight,
  Home,
  Projector,
  MonitorSmartphone,
  Wifi,
  Music2,
  Coffee,
  Airplay,
  PanelTop,
  FileText,
  LucideIcon,
  Thermometer,
  Sun,
  Currency,
  Volume2,
  Armchair,
  Table2Icon,
  Lightbulb,
  PanelLeftClose,
} from "lucide-react";
import type { Room } from "@/features/rooms/types/room";

// Define facility icon mapping (matching the room-card component)
const facilityIcons: Record<string, LucideIcon> = {
  Projector: Projector,
  Whiteboard: PanelTop,
  "Video Conferencing": MonitorSmartphone,
  "Wi-Fi": Wifi,
  "Sound System": Music2,
  Refreshments: Coffee,
  "Screen Sharing": Airplay,
  Teleconferencing: MonitorSmartphone,
  Flipchart: FileText,
  "Air Conditioning": Thermometer,
  Heating: Thermometer,
  "Natural Light": Sun,
  "Blackout Curtains": Currency,
  Soundproofing: Volume2,
  "Ergonomic Chairs": Armchair,
  "Standing Desks": Table2Icon,
  "Adjustable Lighting": Lightbulb,
  "Acoustic Panels": PanelLeftClose,
  "Smart Lighting": Lightbulb,
};

interface RoomListItemProps {
  room: Room;
}

export function RoomListItem({ room }: RoomListItemProps) {
  const router = useRouter();
  const image = room.coverImage || room.images?.[0] || "/placeholder.svg";

  // Parse facilities - handle both string and array formats
  const facilities = room.facilities
    ? typeof room.facilities === "string"
      ? room.facilities.startsWith("[")
        ? JSON.parse(room.facilities)
        : room.facilities.split(",").map((facility) => facility.trim())
      : []
    : [];

  const handleViewDetails = () => {
    router.push(`/rooms/${room.slug || room.id}`);
  };

  return (
    <Card className="overflow-hidden transition-shadow duration-200 hover:shadow-lg">
      <div className="flex flex-col md:flex-row">
        {/* Modified image container with custom rounded corners */}
        <div className="relative md:w-1/3 lg:w-1/4 flex-shrink-0 overflow-hidden">
          <div className="w-full h-56 md:h-full relative">
            <Image
              src={image}
              alt={room.name}
              fill
              className="object-cover md:rounded-tr-lg md:rounded-br-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              priority={false}
            />
          </div>
        </div>

        <div className="flex flex-col justify-between p-5 w-full md:w-2/3 lg:w-3/4">
          <div className="space-y-3">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {room.name}
              </h3>

              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>{room.location}</span>
              </div>

              {room.capacity > 0 && (
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Capacity: {room.capacity}</span>
                </div>
              )}
            </div>

            {room.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {room.description}
              </p>
            )}

            {facilities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {facilities
                  .slice(0, 3)
                  .map((facility: string, index: number) => {
                    const IconComponent = facilityIcons[facility] || Home;
                    return (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1 py-1"
                      >
                        <IconComponent className="h-3 w-3" />
                        <span>{facility}</span>
                      </Badge>
                    );
                  })}

                {facilities.length > 3 && (
                  <Badge variant="outline">+{facilities.length - 3} more</Badge>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end mt-4">
            <Button
              onClick={handleViewDetails}
              variant="outline"
              size="sm"
              className="group"
            >
              View Details
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
