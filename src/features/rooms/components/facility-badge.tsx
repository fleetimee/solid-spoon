"use client";

import {
  Projector,
  Wifi,
  Music,
  Wind,
  MonitorSmartphone,
  Presentation,
  VideoIcon,
  Mic,
  Coffee,
  CircleOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FacilityBadgeProps {
  name: string;
  className?: string;
}

export function FacilityBadge({ name, className }: FacilityBadgeProps) {
  // Normalize the facility name to handle case and trim
  const normalizedName = name.trim().toLowerCase();

  // Map of facility names to their icons
  const facilityIcons: Record<string, React.ReactNode> = {
    projector: <Projector className="h-3.5 w-3.5 mr-1" />,
    "wi-fi": <Wifi className="h-3.5 w-3.5 mr-1" />,
    wifi: <Wifi className="h-3.5 w-3.5 mr-1" />,
    "sound system": <Music className="h-3.5 w-3.5 mr-1" />,
    "air conditioning": <Wind className="h-3.5 w-3.5 mr-1" />,
    ac: <Wind className="h-3.5 w-3.5 mr-1" />,
    monitor: <MonitorSmartphone className="h-3.5 w-3.5 mr-1" />,
    tv: <MonitorSmartphone className="h-3.5 w-3.5 mr-1" />,
    whiteboard: <Presentation className="h-3.5 w-3.5 mr-1" />,
    "video conferencing": <VideoIcon className="h-3.5 w-3.5 mr-1" />,
    microphone: <Mic className="h-3.5 w-3.5 mr-1" />,
    refreshments: <Coffee className="h-3.5 w-3.5 mr-1" />,
    coffee: <Coffee className="h-3.5 w-3.5 mr-1" />,
  };

  // Find a matching icon or use default
  const icon = Object.entries(facilityIcons).find(([key]) =>
    normalizedName.includes(key)
  )?.[1] || <CircleOff className="h-3.5 w-3.5 mr-1" />;

  return (
    <Badge
      variant="secondary"
      className={cn("px-3 py-1.5 text-sm flex items-center", className)}
    >
      {icon}
      {name}
    </Badge>
  );
}
