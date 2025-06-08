import { Building2, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface RoomsHeaderProps {
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function RoomsHeader({
  title = "Kelola Ruangan",
  description = "Atur dan awasi inventaris ruangan Anda dengan elegan",
  icon: Icon = Building2,
}: RoomsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
          <Icon className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <Button
        asChild
        className="shadow-lg hover:shadow-xl transition-all duration-300 gap-2 self-start sm:self-auto"
      >
        <Link href="/admin/rooms/add">
          <Plus className="h-4 w-4" />
          Tambah Ruangan
        </Link>
      </Button>
    </div>
  );
}
