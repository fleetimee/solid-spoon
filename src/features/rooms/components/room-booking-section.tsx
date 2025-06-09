import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { RoomAvailabilityCalendar } from "./room-availability-calendar";
import { RoomReservationWithStatus } from "@/features/reservations/api/getAllRoomReservations";

export interface RoomBookingSectionProps {
  reservations: RoomReservationWithStatus[];
  reservationLimit: number;
  isLoggedIn: boolean;
  className?: string;
}

export function RoomBookingSection({
  reservations = [],
  reservationLimit,
  isLoggedIn,
  className = "",
}: RoomBookingSectionProps) {
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
        <RoomAvailabilityCalendar reservations={reservations} />
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
        {reservations.filter((res) => res.status === "Approved").length > 0 ? (
          <div className="space-y-2">
            {reservations
              .filter((res) => res.status === "Approved")
              .map((res) => (
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
    </div>
  );
}
