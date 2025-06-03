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
    <div className={`space-y-3 ${className}`}>
      <Typography
        variant="h2"
        as="h2"
        className="flex items-center font-bold text-lg bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
      >
        <Sparkles className="h-5 w-5 mr-2 text-primary" />
        Room Amenities
      </Typography>
      {facilities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
        <div className="p-3 rounded-lg bg-muted/50 border border-dashed border-muted-foreground/50 text-center">
          <p className="text-muted-foreground text-sm">
            No specific amenities listed yet.
          </p>
        </div>
      )}
    </div>
  );
}
