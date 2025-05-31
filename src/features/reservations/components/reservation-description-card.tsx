import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { FileText } from "lucide-react";

export interface ReservationDescriptionCardProps {
  description: string;
  className?: string;
}

export function ReservationDescriptionCard({
  description,
  className,
}: ReservationDescriptionCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </div>
          <div>
            <CardTitle className="text-xl">Description</CardTitle>
            <CardDescription>Additional details and notes</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
          <Typography className="whitespace-pre-wrap leading-relaxed text-gray-900 dark:text-gray-100">
            {description}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}
