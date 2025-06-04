import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { CalendarIcon, AlertTriangle, Info, Clock } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { RoomAvailabilityCalendar } from "./room-availability-calendar";
import { ApprovedReservationTime } from "@/features/reservations/api/getApprovedRoomReservations";

export interface RoomBookingSectionProps {
  approvedReservations: ApprovedReservationTime[];
  pendingCount: number;
  reservationLimit: number;
  isLoggedIn: boolean;
  className?: string;
}

export function RoomBookingSection({
  approvedReservations,
  pendingCount,
  reservationLimit,
  isLoggedIn,
  className = "",
}: RoomBookingSectionProps) {
  const isLimitReached = !!isLoggedIn && pendingCount >= reservationLimit;
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Calendar Section */}
      <div className="p-4 md:p-5">
        <Typography
          variant="h3"
          as="h3"
          className="flex items-center font-semibold text-base mb-3"
        >
          <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
          Kalender Ketersediaan 📅
        </Typography>
        <RoomAvailabilityCalendar approvedReservations={approvedReservations} />
      </div>

      {/* Current Bookings */}
      <div className="p-4 md:p-5">
        <Typography
          variant="h3"
          as="h3"
          className="flex items-center font-semibold text-base mb-3"
        >
          <Clock className="h-4 w-4 mr-2 text-primary" />
          Pemesanan Saat Ini 📋
        </Typography>
        {approvedReservations.length > 0 ? (
          <div className="space-y-2">
            {approvedReservations.map((res) => (
              <div
                key={`${res.startTime}-${res.endTime}`}
                className="p-2 rounded-lg bg-muted/50 border border-border/50 text-xs"
              >
                <div className="font-medium">
                  {format(new Date(res.startTime), "PPp")} -{" "}
                  {format(new Date(res.endTime), "PPp")}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20 text-center">
            <Typography
              variant="default"
              className="text-green-700 dark:text-green-400 font-medium text-sm"
            >
              Tidak ada pemesanan saat ini
            </Typography>
          </div>
        )}
      </div>

      {/* Pending Reservations Alert */}
      {pendingCount > 0 && (
        <Alert
          variant="default"
          className="border-l-4 border-l-blue-500 bg-blue-500/5 backdrop-blur-sm animate-in slide-in-from-left-2 duration-300 py-2"
        >
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-700 dark:text-blue-300 text-sm">
            💫 Anda memiliki {pendingCount} reservasi tertunda untuk ruangan
            ini.
          </AlertDescription>
        </Alert>
      )}

      {/* Reservation Limit Alert */}
      {isLoggedIn && isLimitReached && (
        <Alert
          variant="destructive"
          className="border-l-4 border-l-destructive bg-destructive/5 backdrop-blur-sm animate-in slide-in-from-top-2 duration-300 py-2"
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-sm">
            Batas Reservasi Tercapai ⚠️
          </AlertTitle>
          <AlertDescription className="text-sm">
            Anda telah mencapai batas maksimum {reservationLimit} reservasi
            tertunda untuk ruangan ini. Anda tidak dapat membuat reservasi baru
            sampai reservasi yang ada diproses.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
