import { UserReservation } from "@/features/reservations/api/getUserReservations";

/**
 * Determines if a reservation can be cancelled based on its status and timing
 */
export function canCancelReservation(reservation: UserReservation): {
  canCancel: boolean;
  reason:
    | "pending"
    | "approved_eligible"
    | "approved_too_late"
    | "other_status";
  message?: string;
} {
  const now = new Date();
  const reservationStartTime = new Date(reservation.startTime);
  const hoursUntilStart =
    (reservationStartTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  const status = reservation.status?.toLowerCase();

  // PENDING reservations can always be cancelled
  if (status === "pending") {
    return {
      canCancel: true,
      reason: "pending",
      message: "Reservasi menunggu persetujuan dapat dibatalkan kapan saja",
    };
  }

  // APPROVED reservations can be cancelled if more than 24 hours away
  if (status === "approved") {
    if (hoursUntilStart > 24) {
      return {
        canCancel: true,
        reason: "approved_eligible",
        message: `Dapat dibatalkan (${Math.ceil(hoursUntilStart)} jam tersisa)`,
      };
    } else {
      return {
        canCancel: false,
        reason: "approved_too_late",
        message: `Tidak dapat dibatalkan (kurang dari 24 jam)`,
      };
    }
  }

  // Other statuses (COMPLETED, REJECTED, CANCELLED) cannot be cancelled
  return {
    canCancel: false,
    reason: "other_status",
    message: "Status reservasi tidak memungkinkan pembatalan",
  };
}

/**
 * Gets the appropriate cancel button text based on reservation status
 */
export function getCancelButtonText(reservation: UserReservation): string {
  const status = reservation.status?.toLowerCase();

  if (status === "pending") {
    return "Batalkan";
  }

  if (status === "approved") {
    return "Batalkan";
  }

  return "Tidak Dapat Dibatalkan";
}

/**
 * Gets time remaining until reservation starts
 */
export function getTimeUntilReservation(reservation: UserReservation): {
  hours: number;
  days: number;
  isInPast: boolean;
} {
  const now = new Date();
  const reservationStartTime = new Date(reservation.startTime);
  const msUntilStart = reservationStartTime.getTime() - now.getTime();

  if (msUntilStart <= 0) {
    return { hours: 0, days: 0, isInPast: true };
  }

  const hours = msUntilStart / (1000 * 60 * 60);
  const days = hours / 24;

  return {
    hours: Math.floor(hours),
    days: Math.floor(days),
    isInPast: false,
  };
}
