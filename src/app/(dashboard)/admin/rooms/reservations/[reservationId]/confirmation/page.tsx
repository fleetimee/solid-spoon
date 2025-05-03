import * as React from "react";
import { notFound } from "next/navigation";
import { getReservationById } from "@/features/reservations/api/getReservationById"; // Assuming this exists and fetches related data
import {
  AcceptConfirmationForm,
  AcceptConfirmationFormSkeleton,
} from "@/features/reservations/components/accept-confirmation-form";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Typography } from "@/components/ui/typography";
import { Suspense } from "react";

interface ConfirmationPageProps {
  params: {
    reservationId: string;
  };
}

// Define the expected structure of the reservation data fetched by getReservationById
// Ensure this matches the actual return type, including nested room and user details
type ReservationWithDetails = {
  id: string;
  title: string;
  description: string | null;
  start_time: Date;
  end_time: Date;
  room: { id: string; name: string; slug: string }; // Added slug for breadcrumbs
  user: { id: string; name: string | null };
  // Add other fields if necessary
};

async function ReservationConfirmationContent({
  reservationId,
}: {
  reservationId: string;
}) {
  // Fetch reservation details. Ensure getReservationById includes room and user details.
  const reservation = (await getReservationById(
    reservationId
  )) as ReservationWithDetails | null;

  if (!reservation) {
    notFound(); // Trigger 404 if reservation doesn't exist
  }

  // Prepare breadcrumbs
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Admin", href: "/admin/dashboard" },
    { label: "Reservations", href: "/admin/rooms/reservations" },
    {
      label: `Confirm: ${reservation.title}`,
      isCurrent: true,
    },
  ];

  return (
    <>
      <BreadcrumbSetter items={breadcrumbs} />
      <div className="space-y-4">
        <Typography variant="h2">Confirm Reservation Acceptance</Typography>
        <Typography color="muted">
          Review the details below and confirm the acceptance of this
          reservation.
        </Typography>
        <AcceptConfirmationForm reservation={reservation} />
      </div>
    </>
  );
}

export default function AdminReservationConfirmationPage({
  params,
}: ConfirmationPageProps) {
  const { reservationId } = params;

  return (
    <Suspense fallback={<ConfirmationPageSkeleton />}>
      <ReservationConfirmationContent reservationId={reservationId} />
    </Suspense>
  );
}

// Skeleton for the entire page while data is loading
function ConfirmationPageSkeleton() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Admin", href: "/admin/dashboard" },
    { label: "Reservations", href: "/admin/rooms/reservations" },
    {
      label: `Confirm Reservation`,
      isCurrent: true,
    },
  ];
  return (
    <>
      <BreadcrumbSetter items={breadcrumbs} />
      <div className="space-y-4">
        <Typography variant="h2">Confirm Reservation Acceptance</Typography>
        <Typography color="muted">
          Review the details below and confirm the acceptance of this
          reservation.
        </Typography>
        <AcceptConfirmationFormSkeleton />
      </div>
    </>
  );
}
