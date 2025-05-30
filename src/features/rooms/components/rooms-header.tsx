import { Building2, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface RoomsHeaderProps {
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function RoomsHeader({
  title = "Manage Rooms",
  description = "Organize and oversee your room inventory with style",
  icon: Icon = Building2,
}: RoomsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
          <Icon className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>

      <Button
        asChild
        className="shadow-lg hover:shadow-xl transition-all duration-300 gap-2"
      >
        <Link href="/admin/rooms/add">
          <Plus className="h-4 w-4" />
          Add Room
        </Link>
      </Button>
    </div>
  );
}
