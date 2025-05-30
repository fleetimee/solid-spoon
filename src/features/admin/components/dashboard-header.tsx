import { Sparkles } from "lucide-react";

export interface DashboardHeaderProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function DashboardHeader({
  title,
  description,
  icon: Icon = Sparkles,
}: DashboardHeaderProps) {
  return (
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
  );
}
