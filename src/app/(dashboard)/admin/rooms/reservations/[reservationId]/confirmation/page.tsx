import * as React from "react";
import { notFound } from "next/navigation";
import {
  getReservationById,
  DetailedReservation, // Import the actual return type
} from "@/features/reservations/api/getReservationById";
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
  room: { id: number; name: string; slug: string }; // Match DetailedReservation types (roomId is number)
  user: { id: string; name: string | null; email: string | null }; // Match DetailedReservation types
  status: string; // Add other fields passed to AcceptConfirmationForm if needed
  statusId: number;
  approverName: string | null;
  approvedAt: Date | null;
  rejectionReason: string | null;
  createdAt: Date;
};

async function ReservationConfirmationContent({
  reservationId,
}: {
  reservationId: string;
}) {
  // Fetch reservation details using the actual function and type
  const detailedReservation = await getReservationById(reservationId);

  if (!detailedReservation) {
    notFound(); // Trigger 404 if reservation doesn't exist
  }

  // Map the flat structure from DetailedReservation to the nested ReservationWithDetails
  const reservation: ReservationWithDetails = {
    id: detailedReservation.id,
    title: detailedReservation.title ?? "Untitled Reservation", // Provide default if null
    description: detailedReservation.description,
    start_time: detailedReservation.startTime,
    end_time: detailedReservation.endTime,
    room: {
      id: detailedReservation.roomId,
      name: detailedReservation.roomName,
      slug: detailedReservation.roomSlug,
    },
    user: {
      id: detailedReservation.userId ?? "unknown-user", // Provide default if null
      name: detailedReservation.userName,
      email: detailedReservation.userEmail,
    },
    status: detailedReservation.status,
    statusId: detailedReservation.statusId,
    approverName: detailedReservation.approverName,
    approvedAt: detailedReservation.approvedAt,
    rejectionReason: detailedReservation.rejectionReason,
    createdAt: detailedReservation.createdAt,
  };

  // Prepare breadcrumbs using the mapped data
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
        {/* Pass the correctly structured reservation object */}
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
