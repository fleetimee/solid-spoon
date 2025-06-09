import { ReactNode } from "react";

export interface ReservationContentSectionProps {
  children: ReactNode;
  title?: string;
}

export function ReservationContentSection({
  children,
  title = "Manajemen Reservasi",
}: ReservationContentSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="w-1 h-6 bg-gradient-to-b from-violet-400 to-purple-500 rounded-full"></div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      <div className="bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/10 dark:to-purple-950/10 rounded-xl p-6 shadow-lg border-0 backdrop-blur-sm">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
