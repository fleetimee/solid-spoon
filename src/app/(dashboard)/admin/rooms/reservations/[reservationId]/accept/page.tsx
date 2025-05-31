import * as React from "react";
import { notFound, redirect } from "next/navigation";
import {
  getReservationById,
  DetailedReservation,
} from "@/features/reservations/api/getReservationById";
import {
  AcceptConfirmationForm,
  AcceptConfirmationFormSkeleton,
} from "@/features/reservations/components/accept-confirmation-form";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Typography } from "@/components/ui/typography";
import { Suspense } from "react";
import { DashboardHeader } from "@/features/admin/components/dashboard-header";
import { CheckCircle } from "lucide-react";

interface ConfirmationPageProps {
  params: Promise<{
    reservationId: string;
  }>;
}

type ReservationWithDetails = {
  id: string;
  title: string;
  description: string | null;
  start_time: Date;
  end_time: Date;
  room: { id: number; name: string; slug: string };
  user: { id: string; name: string | null; email: string | null };
  status: string;
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
  const detailedReservation = await getReservationById(reservationId);

  if (!detailedReservation) {
    notFound();
  }

  console.log("Detailed Reservation:", detailedReservation);

  if (detailedReservation.statusId == 3) {
    redirect("/admin/rooms/reservations");
  }

  const reservation: ReservationWithDetails = {
    id: detailedReservation.id,
    title: detailedReservation.title ?? "Untitled Reservation",
    description: detailedReservation.description,
    start_time: detailedReservation.startTime,
    end_time: detailedReservation.endTime,
    room: {
      id: detailedReservation.roomId,
      name: detailedReservation.roomName,
      slug: detailedReservation.roomSlug,
    },
    user: {
      id: detailedReservation.userId ?? "unknown-user",
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

      {/* Enhanced Header Section with Green Theme */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-2xl" />
        <div className="relative p-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/25">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Accept Reservation
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                Review the details below and confirm the acceptance of this
                reservation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <AcceptConfirmationForm reservation={reservation} />
    </>
  );
}

export default async function AdminReservationConfirmationPage(
  props: ConfirmationPageProps
) {
  const params = await props.params;
  const { reservationId } = params;

  return (
    <main className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
      <Suspense fallback={<ConfirmationPageSkeleton />}>
        <ReservationConfirmationContent reservationId={reservationId} />
      </Suspense>
    </main>
  );
}

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

      {/* Enhanced Header Section Skeleton */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-2xl" />
        <div className="relative p-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/25">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Accept Reservation
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                Review the details below and confirm the acceptance of this
                reservation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <AcceptConfirmationFormSkeleton />
    </>
  );
}
