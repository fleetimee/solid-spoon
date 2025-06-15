import { Typography } from "@/components/ui/typography";
import { Calendar } from "lucide-react";

interface ContentHeaderProps {
  title: string;
  description: string;
  lastUpdated: string;
}

export function ContentHeader({
  title,
  description,
  lastUpdated,
}: ContentHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Typography
          variant="h1"
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
        >
          {title}
        </Typography>
        <Typography variant="large" className="text-muted-foreground max-w-3xl">
          {description}
        </Typography>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="h-4 w-4" />
        <span>Terakhir diperbarui: {lastUpdated}</span>
      </div>
    </div>
  );
}
