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
  roomSlug: string;
  approvedReservations: ApprovedReservationTime[];
  pendingCount: number;
  isLimitReached: boolean;
  reservationLimit: number;
  isLoggedIn: boolean;
  className?: string;
}

export function RoomBookingSection({
  roomSlug,
  approvedReservations,
  pendingCount,
  isLimitReached,
  reservationLimit,
  isLoggedIn,
  className = "",
}: RoomBookingSectionProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Calendar Section */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-card to-muted/20 border shadow-sm">
        <Typography
          variant="h3"
          as="h3"
          className="flex items-center font-semibold text-lg mb-4"
        >
          <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
          Availability Calendar 📅
        </Typography>
        <RoomAvailabilityCalendar approvedReservations={approvedReservations} />
      </div>

      {/* Current Bookings */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/5 to-card border shadow-sm">
        <Typography
          variant="h3"
          as="h3"
          className="flex items-center font-semibold text-lg mb-4"
        >
          <Clock className="h-5 w-5 mr-2 text-primary" />
          Current Bookings 📋
        </Typography>
        {approvedReservations.length > 0 ? (
          <div className="space-y-2">
            {approvedReservations.map((res) => (
              <div
                key={`${res.startTime}-${res.endTime}`}
                className="p-3 rounded-lg bg-muted/50 border border-border/50 text-sm"
              >
                <div className="font-medium">
                  {format(new Date(res.startTime), "PPp")} -{" "}
                  {format(new Date(res.endTime), "PPp")}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20 text-center">
            <Typography
              variant="default"
              className="text-green-700 dark:text-green-400 font-medium"
            >
              🎉 No current bookings - Available now!
            </Typography>
          </div>
        )}
      </div>

      {/* Pending Reservations Alert */}
      {pendingCount > 0 && (
        <Alert
          variant="default"
          className="border-l-4 border-l-blue-500 bg-blue-500/5 backdrop-blur-sm animate-in slide-in-from-left-2 duration-300"
        >
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            💫 You have {pendingCount} pending reservation(s) for this room.
          </AlertDescription>
        </Alert>
      )}

      {/* Reservation Limit Alert */}
      {isLoggedIn && isLimitReached && (
        <Alert
          variant="destructive"
          className="border-l-4 border-l-destructive bg-destructive/5 backdrop-blur-sm animate-in slide-in-from-top-2 duration-300"
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Reservation Limit Reached ⚠️</AlertTitle>
          <AlertDescription>
            You have reached the maximum limit of {reservationLimit} pending
            reservations for this room. You cannot create new reservations until
            existing ones are processed.
          </AlertDescription>
        </Alert>
      )}

      {/* Enhanced Book Now Button */}
      <Link
        href={`/v/${roomSlug}/reservations/new`}
        passHref
        className={cn(
          "block",
          isLimitReached && "pointer-events-none cursor-not-allowed opacity-50"
        )}
        aria-disabled={isLimitReached}
      >
        <Button
          className={cn(
            "w-full h-14 flex items-center justify-center gap-3 font-semibold text-lg",
            "bg-gradient-to-r from-primary via-primary to-purple-600 hover:from-primary/90 hover:via-primary/90 hover:to-purple-600/90",
            "shadow-lg hover:shadow-xl transition-all duration-300",
            "transform hover:scale-[1.02] active:scale-[0.98]",
            "border border-primary/20 hover:border-primary/30",
            !isLimitReached && "animate-pulse hover:animate-none"
          )}
          disabled={isLimitReached}
        >
          <CalendarIcon className="h-6 w-6" />
          {isLimitReached ? "Limit Reached 🚫" : "Book Now ✨"}
        </Button>
      </Link>
    </div>
  );
}
