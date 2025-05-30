import { PlusCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface AddRoomHeaderProps {
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function AddRoomHeader({
  title = "🏢 Add New Room",
  description = "Create a space that inspires productivity and collaboration",
  icon: Icon = PlusCircle,
}: AddRoomHeaderProps) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 shadow-xl ring-1 ring-primary/20">
          <Icon className="h-7 w-7 text-primary-foreground" />
        </div>
        <div className="space-y-1 min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg font-medium">
            {description}
          </p>
        </div>
      </div>

      <Button
        asChild
        variant="outline"
        className="shadow-lg hover:shadow-xl transition-all duration-300 gap-2 hover:bg-muted/50 self-start sm:self-auto"
      >
        <Link href="/admin/rooms">
          <ArrowLeft className="h-4 w-4" />
          Back to Rooms
        </Link>
      </Button>
    </div>
  );
}
