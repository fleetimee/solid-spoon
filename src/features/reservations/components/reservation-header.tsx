import { Calendar } from "lucide-react";

export interface ReservationHeaderProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function ReservationHeader({
  title,
  description,
  icon: Icon = Calendar,
}: ReservationHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 shadow-lg">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
