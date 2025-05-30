import { Card, CardContent } from "@/components/ui/card";
import { RoomFilters } from "@/features/rooms/components/room-filters";
import { Filter } from "lucide-react";

export function RoomsFiltersSection() {
  return (
    <Card className="border-0 bg-gradient-to-r from-background/80 to-muted/20 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <Filter className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-lg font-semibold">🔍 Filter & Search</h2>
        </div>
        <RoomFilters />
      </CardContent>
    </Card>
  );
}
