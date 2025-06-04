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
    <div className={`p-6 space-y-6 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 text-white">
          <Sparkles className="h-5 w-5" />
        </div>
        <Typography
          variant="h2"
          as="h2"
          className="font-bold text-xl bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent"
        >
          Fasilitas Ruangan
        </Typography>
      </div>
      <div>
        {facilities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          <div className="p-4 rounded-lg bg-violet-50/50 dark:bg-violet-950/20 border border-dashed border-violet-300/50 dark:border-violet-700/50 text-center">
            <p className="text-muted-foreground text-sm">
              Belum ada fasilitas khusus yang tercantum.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
