import { Typography } from "@/components/ui/typography";
import { Sparkles } from "lucide-react";
import { FacilityBadge } from "./facility-badge";

export interface RoomAmenitiesSectionProps {
  facilities: string[];
  className?: string;
}

export function RoomAmenitiesSection({
  facilities,
  className = "",
}: RoomAmenitiesSectionProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <Typography
        variant="h2"
        as="h2"
        className="flex items-center font-bold text-2xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
      >
        <Sparkles className="h-6 w-6 mr-3 text-primary" />
        Room Amenities ✨
      </Typography>
      {facilities.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {facilities.map((facility: string, index: number) => (
            <div
              key={index}
              className="transform hover:scale-105 transition-all duration-200"
            >
              <FacilityBadge name={facility} />
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-muted/50 border border-dashed border-muted-foreground/50 text-center">
          <p className="text-muted-foreground">
            🔧 No specific amenities listed yet.
          </p>
        </div>
      )}
    </div>
  );
}
