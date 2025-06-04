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
    <div className={`p-6 space-y-6 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 text-white">
          <MapPin className="h-5 w-5" />
        </div>
        <Typography
          variant="h2"
          as="h2"
          className="font-bold text-xl bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent"
        >
          Lokasi 📍
        </Typography>
      </div>
      <div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20 border border-violet-200/50 dark:border-violet-800/50">
          <Typography
            variant="default"
            className="text-foreground leading-relaxed text-sm"
          >
            {location || "📍 Detail lokasi akan segera hadir - nantikan!"}
          </Typography>
        </div>
      </div>
    </div>
  );
}
