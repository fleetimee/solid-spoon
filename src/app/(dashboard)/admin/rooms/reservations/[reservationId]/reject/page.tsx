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
  user: { name: string | null; email: string | null; image: string | null };
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
      email: detailedReservation.userEmail,
      image: detailedReservation.userImage,
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

      {/* Enhanced Header Section with Red Theme */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 rounded-2xl" />
        <div className="relative p-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/25">
              <XCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                Reject Reservation
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                Review the details below and provide a reason for rejecting this
                reservation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <RejectConfirmationForm reservation={reservationForForm} />
    </>
  );
}

export default async function AdminReservationRejectionPage(
  props: RejectionPageProps
) {
  const params = await props.params;
  const { reservationId } = params;

  return (
    <main className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
      <Suspense fallback={<RejectionPageSkeleton />}>
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

      {/* Enhanced Header Section Skeleton */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 rounded-2xl" />
        <div className="relative p-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/25">
              <XCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                Reject Reservation
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                Review the details below and provide a reason for rejecting this
                reservation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <RejectConfirmationFormSkeleton />
    </>
  );
}
