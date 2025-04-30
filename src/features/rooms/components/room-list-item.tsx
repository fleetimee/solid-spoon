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
    router.push(`/v/${room.slug || room.id}`);
  };

  return (
    <Card className="overflow-hidden transition-shadow duration-200 hover:shadow-lg">
      <div className="flex flex-col md:flex-row">
        {/* Modified image container with custom rounded corners */}
        <div className="relative md:w-1/3 lg:w-1/4 flex-shrink-0 overflow-hidden">
          {/* Mobile: Reduced height */}
          <div className="w-full h-48 md:h-full relative">
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

        {/* Content Area: Adjusted padding and layout for mobile */}
        <div className="flex flex-1 flex-col justify-between p-3 md:p-5 w-full md:w-2/3 lg:w-3/4">
          {/* Top section: Info + Facilities */}
          <div>
            {/* Room Name */}
            <h3 className="text-base font-semibold text-foreground mb-1 md:text-xl md:mb-2">
              {room.name}
            </h3>

            {/* Location & Capacity Row */}
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs text-muted-foreground mb-2 md:text-sm md:mb-3">
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1 flex-shrink-0 md:h-4 md:w-4 md:mr-1.5" />
                <span>{room.location}</span>
              </div>
              {room.capacity > 0 && (
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1 flex-shrink-0 md:h-4 md:w-4 md:mr-1.5" />
                  <span>{room.capacity} pax</span>
                </div>
              )}
            </div>

            {/* Description (Optional) */}
            {room.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2 md:text-sm md:mb-3">
                {room.description}
              </p>
            )}

            {/* Facilities Row - Responsive */}
            {facilities.length > 0 && (
              <div className="flex flex-wrap items-center gap-1 mb-3 md:gap-1.5 md:pt-1 md:mb-0">
                {/* Mobile View (Max 2) */}
                <div className="flex flex-wrap items-center gap-1 md:hidden">
                  {facilities
                    .slice(0, 2)
                    .map((facility: string, index: number) => {
                      const IconComponent = facilityIcons[facility] || Home;
                      return (
                        <Badge
                          key={`mob-${index}`}
                          variant="secondary"
                          className="flex items-center gap-1 px-1.5 py-0.5 text-xs"
                          title={facility}
                        >
                          <IconComponent className="h-3 w-3" />
                          <span className="hidden sm:inline">{facility}</span>
                        </Badge>
                      );
                    })}
                  {facilities.length > 2 && (
                    <Badge variant="outline" className="px-1.5 py-0.5 text-xs">
                      +{facilities.length - 2} more
                    </Badge>
                  )}
                </div>
                {/* Desktop View (Max 3) */}
                <div className="hidden flex-wrap items-center gap-1.5 md:flex">
                  {facilities
                    .slice(0, 3)
                    .map((facility: string, index: number) => {
                      const IconComponent = facilityIcons[facility] || Home;
                      return (
                        <Badge
                          key={`desk-${index}`}
                          variant="secondary"
                          className="flex items-center gap-1 px-2 py-1 text-sm"
                          title={facility}
                        >
                          <IconComponent className="h-3.5 w-3.5" />
                          <span>{facility}</span>
                        </Badge>
                      );
                    })}
                  {facilities.length > 3 && (
                    <Badge variant="outline" className="px-2 py-0.5 text-sm">
                      +{facilities.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom section: Button */}
          <div className="flex justify-end mt-auto pt-2">
            {" "}
            {/* mt-auto pushes to bottom, pt-2 adds space */}
            <Button
              onClick={handleViewDetails}
              variant="outline"
              size="sm" // Use 'sm' size, but custom classes make it visually smaller on mobile
              className="group text-xs h-8 px-3 md:text-sm md:h-9 md:px-4 md:py-2" // Adjust size classes for responsiveness
            >
              Details
              <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5 md:h-4 md:w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
