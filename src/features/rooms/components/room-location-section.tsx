import { Typography } from "@/components/ui/typography";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
    <div className={`${className}`}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 text-white">
            <MapPin className="h-5 w-5" />
          </div>
          <CardTitle className="text-lg bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Location 📍
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20 border border-violet-200/50 dark:border-violet-800/50">
          <Typography
            variant="default"
            className="text-foreground leading-relaxed text-sm"
          >
            {location || "📍 Location details coming soon - stay tuned!"}
          </Typography>
        </div>
      </CardContent>
    </div>
  );
}
