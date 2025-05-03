"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDateRangeHumanized } from "@/lib/utils/formatDate";
import { type getUserReservations } from "@/features/reservations/api/getUserReservations"; // Assuming type export

// Define the type for a single reservation based on the expected data structure
// Adjust this based on the actual return type of getUserReservations if needed
type Reservation = Awaited<ReturnType<typeof getUserReservations>>[number];

interface BookingsListProps {
  reservations: Reservation[];
}

// Helper function for status color (can be kept here or imported if shared)
const getStatusColor = (status: string | null | undefined) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return "bg-green-500";
    case "pending":
      return "bg-yellow-500";
    case "rejected":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export function BookingsList({ reservations }: BookingsListProps) {
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  // We need to control the Dialog's open state based on whether a reservation is selected
  const isDialogOpen = !!selectedReservation;
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedReservation(null); // Reset selection when dialog closes
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {reservations && reservations.length > 0 ? (
        reservations.map((reservation) => (
          <Card key={reservation.id}>
            <CardContent className="p-0">
              <div className="grid grid-cols-[12px_1fr] sm:grid-cols-[12px_3fr_1fr_1fr_1fr] gap-4 p-4 items-center">
                <div
                  className={`w-2 h-full self-stretch ${getStatusColor(reservation.status)} rounded-full`}
                ></div>
                <div>
                  <div className="font-medium">{reservation.roomName}</div>
                  <div className="text-sm text-muted-foreground">
                    {reservation.title}
                  </div>
                </div>
                <div className="hidden sm:block text-sm">
                  {formatDateRangeHumanized(
                    reservation.startTime,
                    reservation.endTime
                  )}
                </div>
                <div className="hidden sm:block text-sm capitalize">
                  {reservation.status ?? "N/A"}
                </div>
                <div className="text-right">
                  {/* Wrap Trigger in its own Dialog for context */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedReservation(reservation)}
                      >
                        View
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>You have no bookings yet.</p>
      )}

      {/* Dialog needs to be wrapped in Dialog component and controlled */}
      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          {selectedReservation && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedReservation.roomName}</DialogTitle>
                <DialogDescription>
                  Booking Details for: {selectedReservation.title}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-2 py-4">
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="font-medium">Room:</span>
                  <span className="col-span-2">
                    {selectedReservation.roomName}
                  </span>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="font-medium">Title:</span>
                  <span className="col-span-2">
                    {selectedReservation.title}
                  </span>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="font-medium">Time:</span>
                  <span className="col-span-2">
                    {formatDateRangeHumanized(
                      selectedReservation.startTime,
                      selectedReservation.endTime
                    )}
                  </span>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="font-medium">Status:</span>
                  <span className="col-span-2 capitalize">
                    {selectedReservation.status ?? "N/A"}
                  </span>
                </div>
                {/* Add more details if needed */}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
