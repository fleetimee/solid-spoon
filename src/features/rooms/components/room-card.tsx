"use client";
import React from "react";
import Link from "next/link"; // Added import
import Image from "next/image";
// Removed useRouter import as it's no longer needed for card navigation
// import { useRouter } from "next/navigation";
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
  link?: string; // Added optional link prop
}

export function RoomCard({ room, className, link }: RoomCardProps) {
  // Removed useRouter and handleTitleClick as navigation is handled by Link
  // const router = useRouter();
  // const handleTitleClick = () => {
  //   // Use slug instead of id for navigation
  //   router.push(`/admin/rooms/${room.slug || room.id}`);
  // };

  // Parse facilities - handle both string and array formats for backward compatibility
  const facilities = room.facilities
    ? typeof room.facilities === "string"
      ? room.facilities.startsWith("[")
        ? JSON.parse(room.facilities)
        : room.facilities.split(",").map((facility) => facility.trim())
      : [] // Assuming if it's not a string, it might be an array already or empty
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

  const CardContent = (
    <Card
      className={cn(
        "overflow-hidden w-full transition-all duration-500 p-0 rounded-3xl border-2",
        link
          ? "hover:shadow-2xl hover:shadow-primary/20 hover:scale-[1.02] hover:border-primary/30"
          : "",
        "bg-gradient-to-br from-background to-muted/20 backdrop-blur-sm",
        className
      )}
    >
      <div className="relative aspect-[16/9] w-full group">
        <Image
          src={room.coverImage || "/placeholder.svg"}
          alt={room.name}
          fill
          className="object-cover rounded-t-3xl transition-all duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-t-3xl" />

        {/* Floating capacity indicator */}
        {room.capacity > 0 && (
          <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-sm shadow-lg border border-white/20">
            <Users className="h-3 w-3 text-primary" />
            <span className="text-xs font-semibold text-foreground">
              {room.capacity}
            </span>
          </div>
        )}
      </div>

      <div className="p-6 space-y-4">
        <div className="space-y-2">
          {link ? (
            <Link href={link} className="block group">
              <h3 className="text-xl font-bold text-foreground leading-tight line-clamp-1 group-hover:text-primary transition-colors duration-300">
                {room.name}
              </h3>
            </Link>
          ) : (
            <h3 className="text-xl font-bold text-foreground leading-tight line-clamp-1">
              {room.name}
            </h3>
          )}
          {room.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="p-1 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-950/50">
                <MapPin className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="truncate">{room.location}</span>
            </div>
          )}
        </div>

        <div className="min-h-[3rem] flex items-start">
          <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">
            {room.description ||
              "Ruangan berkualitas yang siap mendukung aktivitas Anda."}
          </p>
        </div>

        {facilities.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium text-muted-foreground">
                🛠️ Fasilitas
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {facilities.slice(0, 3).map((facility: string, index: number) => (
                <Badge
                  key={index}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary/10 to-purple-600/10 text-primary border-primary/20 hover:from-primary/20 hover:to-purple-600/20 transition-all duration-300"
                >
                  {facilityIcons[facility] &&
                    React.createElement(facilityIcons[facility], {
                      className: "h-3 w-3",
                    })}
                  <span className="text-xs font-medium">{facility}</span>
                </Badge>
              ))}

              {facilities.length > 3 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Badge className="cursor-pointer hover:bg-primary/20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 text-muted-foreground border-muted/40 hover:border-primary/30 transition-all duration-300 hover:scale-105">
                      <span className="text-xs font-medium">
                        +{facilities.length - 3} more
                      </span>
                      <ChevronDown className="h-3 w-3" />
                    </Badge>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="w-80 p-4 rounded-2xl border-2 backdrop-blur-sm bg-background/95"
                    sideOffset={8}
                  >
                    <div className="font-semibold mb-3 text-base text-primary flex items-center gap-2">
                      <div className="text-lg">🛠️</div>
                      Semua Fasilitas
                    </div>
                    <ScrollArea
                      className={cn(
                        "pr-3",
                        facilities.length > 8 ? "max-h-[300px]" : "max-h-full"
                      )}
                    >
                      <div className="flex flex-wrap gap-2">
                        {facilities.map((facility: string, index: number) => (
                          <Badge
                            key={index}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary/10 to-purple-600/10 text-primary border-primary/20"
                          >
                            {facilityIcons[facility] &&
                              React.createElement(facilityIcons[facility], {
                                className: "h-3 w-3",
                              })}
                            <span className="text-xs font-medium">
                              {facility}
                            </span>
                          </Badge>
                        ))}
                      </div>
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );

  return CardContent;
}
