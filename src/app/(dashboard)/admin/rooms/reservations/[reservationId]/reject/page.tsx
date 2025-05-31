import * as React from "react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  getReservationById,
  DetailedReservation, // Use the detailed type from the API
} from "@/features/reservations/api/getReservationById";
import {
  RejectConfirmationForm,
  RejectConfirmationFormSkeleton, // Import rejection form and skeleton
} from "@/features/reservations/components/reject-confirmation-form"; // Import rejection form
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Typography } from "@/components/ui/typography";
import { DashboardHeader } from "@/features/admin/components/dashboard-header";
import { XCircle } from "lucide-react";

interface RejectionPageProps {
  params: Promise<{
    reservationId: string;
  }>;
}

// Define the expected structure for the form prop (same as accept/reject form)
type ReservationDetailsForForm = {
  id: string;
  title: string;
  description: string | null;
  start_time: Date;
  end_time: Date;
  room: { name: string };
  user: { name: string | null };
};

async function ReservationRejectionContent({
  reservationId,
}: {
  reservationId: string;
}) {
  // Fetch reservation details
  const detailedReservation = await getReservationById(reservationId);

  if (!detailedReservation) {
    notFound(); // Trigger 404 if reservation doesn't exist
  }

  // Map the flat structure from DetailedReservation to the nested structure needed by the form
  // This mapping logic remains the same as the accept page
  const reservationForForm: ReservationDetailsForForm = {
    id: detailedReservation.id,
    title: detailedReservation.title ?? "Untitled Reservation",
    description: detailedReservation.description,
    start_time: detailedReservation.startTime,
    end_time: detailedReservation.endTime,
    room: {
      name: detailedReservation.roomName,
    },
    user: {
      name: detailedReservation.userName,
    },
  };

  // Prepare breadcrumbs for rejection page
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Admin", href: "/admin/dashboard" }, // Assuming admin dashboard exists
    { label: "Reservations", href: "/admin/rooms/reservations" },
    {
      label: `Reject: ${reservationForForm.title}`, // Update label
      isCurrent: true,
    },
  ];

  return (
    <>
      <BreadcrumbSetter items={breadcrumbs} />
      <div className="space-y-6">
        <DashboardHeader
          title="Confirm Reservation Rejection"
          description="Review the details below and provide a reason for rejecting this reservation."
          icon={XCircle}
        />
        {/* Pass the correctly structured reservation object to the rejection form */}
        <RejectConfirmationForm reservation={reservationForForm} />
      </div>
    </>
  );
}

export default async function AdminReservationRejectionPage(
  props: RejectionPageProps
) {
  const params = await props.params;
  const { reservationId } = params;

  return (
    <main className="flex flex-col grow p-4 md:p-8">
      <Suspense fallback={<RejectionPageSkeleton />}>
        {" "}
        {/* Use rejection skeleton */}
        <ReservationRejectionContent reservationId={reservationId} />
      </Suspense>
    </main>
  );
}

// Skeleton for the rejection page while data is loading
function RejectionPageSkeleton() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Admin", href: "/admin/dashboard" },
    { label: "Reservations", href: "/admin/rooms/reservations" },
    {
      label: `Reject Reservation`, // Update label
      isCurrent: true,
    },
  ];
  return (
    <>
      <BreadcrumbSetter items={breadcrumbs} />
      <div className="space-y-6">
        <DashboardHeader
          title="Confirm Reservation Rejection"
          description="Review the details below and provide a reason for rejecting this reservation."
          icon={XCircle}
        />
        <RejectConfirmationFormSkeleton /> {/* Use rejection skeleton */}
      </div>
    </>
  );
}
