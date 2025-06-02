import { Typography } from "@/components/ui/typography";
import { MapPin } from "lucide-react";

export interface RoomLocationSectionProps {
  location?: string;
  className?: string;
}

export function RoomLocationSection({
  location,
  className = "",
}: RoomLocationSectionProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <Typography
        variant="h2"
        as="h2"
        className="flex items-center font-bold text-lg bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
      >
        <MapPin className="h-5 w-5 mr-2 text-primary" />
        Location 📍
      </Typography>
      <div className="p-4 rounded-xl bg-gradient-to-br from-muted/50 to-card border shadow-sm">
        <Typography
          variant="default"
          className="text-foreground leading-relaxed text-sm"
        >
          {location || "📍 Location details coming soon - stay tuned!"}
        </Typography>
      </div>
    </div>
  );
}
