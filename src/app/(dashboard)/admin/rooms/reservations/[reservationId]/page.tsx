import { notFound } from "next/navigation";
import {
  getReservationById,
  DetailedReservation,
} from "@/features/reservations/api/getReservationById";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { ReservationDetailHeader } from "@/features/reservations/components/reservation-detail-header";
import { ReservationOverviewCard } from "@/features/reservations/components/reservation-overview-card";
import { ReservationScheduleCard } from "@/features/reservations/components/reservation-schedule-card";
import { ReservationDescriptionCard } from "@/features/reservations/components/reservation-description-card";
import { ReservationStatusCard } from "@/features/reservations/components/reservation-status-card";
import { ReservationMetadataCard } from "@/features/reservations/components/reservation-metadata-card";
import { ReservationRejectionCard } from "@/features/reservations/components/reservation-rejection-card";

// Define the props interface
interface ReservationDetailsPageProps {
  params: Promise<{
    reservationId: string;
  }>;
}

export default async function ReservationDetailsPage(
  props: ReservationDetailsPageProps
) {
  const params = await props.params; // Await the params promise
  const { reservationId } = params; // Destructure after awaiting

  const reservation: DetailedReservation | null =
    await getReservationById(reservationId);

  if (!reservation) {
    notFound(); // Trigger 404 page if reservation doesn't exist
  }

  const breadcrumbs = [
    { label: "Beranda", href: "/admin/dashboard" },
    { label: "Ruangan", href: "/admin/rooms" },
    { label: "Reservasi", href: "/admin/rooms/reservations" },
    {
      label: reservation.id, // Use reservation ID for the label
      href: `/admin/rooms/reservations/${reservation.id}`,
    },
  ];

  return (
    <>
      <BreadcrumbSetter items={breadcrumbs} />

      <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
        {/* Header Section */}
        <ReservationDetailHeader reservationId={reservation.id} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Primary Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Reservation Overview Card */}
            <ReservationOverviewCard
              title={reservation.title}
              roomName={reservation.roomName}
              roomSlug={reservation.roomSlug}
              roomId={reservation.roomId}
              userName={reservation.userName}
              userEmail={reservation.userEmail}
              userImage={reservation.userImage}
            />

            {/* Schedule Information Card */}
            <ReservationScheduleCard
              startTime={reservation.startTime}
              endTime={reservation.endTime}
            />

            {/* Description Card - Conditional */}
            {reservation.description && (
              <ReservationDescriptionCard
                description={reservation.description}
              />
            )}

            {/* Rejection Reason Card - Conditional */}
            {reservation.rejectionReason && (
              <ReservationRejectionCard
                rejectionReason={reservation.rejectionReason}
              />
            )}
          </div>

          {/* Right Column - Status & Metadata */}
          <div className="space-y-6">
            {/* Status Card */}
            <ReservationStatusCard status={reservation.status} />

            {/* Metadata Card */}
            <ReservationMetadataCard
              createdAt={reservation.createdAt}
              approverName={reservation.approverName}
              approvedAt={reservation.approvedAt}
              reservationId={reservation.id}
            />
          </div>
        </div>
      </div>
    </>
  );
}
