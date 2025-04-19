import Image from "next/image";
import {
  Users,
  MapPin,
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
  Lightbulb as LightbulbIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Room } from "../types/room";

// Define facility icon mapping to match the room-form component
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
  "Smart Lighting": LightbulbIcon,
};

interface RoomCardProps {
  room: Room;
  className?: string;
}

export function RoomCard({ room, className }: RoomCardProps) {
  // Parse facilities - handle both string and array formats for backward compatibility
  const facilities = room.facilities
    ? typeof room.facilities === "string"
      ? room.facilities.startsWith("[")
        ? JSON.parse(room.facilities)
        : room.facilities.split(",").map((facility) => facility.trim())
      : []
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
            {facilities.slice(0, 3).map((facility: string, index: number) => {
              const IconComponent: LucideIcon = facilityIcons[facility] || Home;
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
    </Card>
  );
}
