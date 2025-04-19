"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Room } from "../types/room";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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
  const router = useRouter();
  const handleTitleClick = () => {
    // Use slug instead of id for navigation
    router.push(`/admin/rooms/${room.slug || room.id}`);
  };

  // Parse facilities - handle both string and array formats for backward compatibility
  const facilities = room.facilities
    ? typeof room.facilities === "string"
      ? room.facilities.startsWith("[")
        ? JSON.parse(room.facilities)
        : room.facilities.split(",").map((facility) => facility.trim())
      : []
    : [];

  // Create a facility badge with icon
  const FacilityBadge = ({ facility }: { facility: string }) => {
    const IconComponent = facilityIcons[facility] || Home;
    return (
      <Badge variant="secondary" className="flex items-center gap-1 py-1">
        <IconComponent className="h-3 w-3" />
        <span>{facility}</span>
      </Badge>
    );
  };

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
            <button
              onClick={handleTitleClick}
              className="text-left w-full hover:underline focus:outline-none cursor-pointer"
            >
              {room.name}
            </button>
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
            {facilities.slice(0, 5).map((facility: string, index: number) => (
              <FacilityBadge key={index} facility={facility} />
            ))}

            {/* If there are more than 3 facilities, show a popover with the rest */}
            {facilities.length > 5 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-secondary flex items-center gap-1"
                  >
                    +{facilities.length - 3} more
                    <ChevronDown className="h-3 w-3 ml-0.5" />
                  </Badge>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-72 p-3"
                  sideOffset={5}
                >
                  <div className="font-medium mb-2 text-sm">All Facilities</div>
                  <ScrollArea
                    className={cn(
                      "pr-3",
                      facilities.length > 8 ? "max-h-[280px]" : "max-h-full"
                    )}
                  >
                    <div className="flex flex-wrap gap-2">
                      {facilities.map((facility: string, index: number) => (
                        <FacilityBadge key={index} facility={facility} />
                      ))}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
