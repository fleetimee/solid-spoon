import { Card } from "@/components/ui/card";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { RoomImageGallery } from "@/features/rooms/components/room-image-gallery";
import React from "react";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getRoomBySlug } from "@/features/rooms/api/getRooms";
import { auth } from "@/lib/auth";
import { getPendingReservationCount } from "@/features/reservations/api/getPendingReservationCount";
import {
  getRecentReservations,
  RecentReservation,
} from "@/features/reservations/api/getRecentReservations";
import {
  getUserRoomReservations,
  UserRoomReservation,
} from "@/features/reservations/api/getUserRoomReservations";
import {
  getApprovedRoomReservations,
  ApprovedReservationTime,
} from "@/features/reservations/api/getApprovedRoomReservations";
import { getReservationLimit } from "@/features/application/api/getReservationLimit";

// Import new refactored components
import { RoomDetailHeader } from "@/features/rooms/components/room-detail-header";
import { RoomBookingSection } from "@/features/rooms/components/room-booking-section";
import { RoomAmenitiesSection } from "@/features/rooms/components/room-amenities-section";
import { RoomLocationSection } from "@/features/rooms/components/room-location-section";
import { UserReservationsSection } from "@/features/rooms/components/user-reservations-section";
import { RecentReservationsSection } from "@/features/rooms/components/recent-reservations-section";

interface RoomDetailPageProps {
  params: Promise<{
    // Updated params type
    roomSlug: string;
  }>;
}

export default async function RoomDetailPage(props: RoomDetailPageProps) {
  const params = await props.params;
  // Destructure params directly
  const { roomSlug } = params;

  // Fetch room data, user session, and reservation limit concurrently
  const [room, session, reservationLimit] = await Promise.all([
    getRoomBySlug(roomSlug),
    auth.api.getSession({ headers: await headers() }), // Fetch user session correctly
    getReservationLimit(), // Fetch reservation limit
  ]);

  // Handle room not found
  if (!room) {
    notFound();
  }

  // Fetch recent reservations only if room exists
  const recentReservations: RecentReservation[] = room.id
    ? await getRecentReservations(room.id) // Use default limit
    : [];

  // Fetch pending reservation count if user is logged in
  let pendingCount = 0;
  if (session?.user?.id && room.id) {
    pendingCount = await getPendingReservationCount(session.user.id, room.id);
  }

  // Fetch user's reservations for this room if logged in
  let myReservations: UserRoomReservation[] = [];
  if (session?.user?.id && room?.id) {
    myReservations = await getUserRoomReservations(session.user.id, room.id);
  }

  // Fetch approved reservations for the calendar
  let approvedReservations: ApprovedReservationTime[] = [];
  if (room?.id) {
    approvedReservations = await getApprovedRoomReservations(room.id);
  }

  // Parse facilities (similar to admin page)
  const facilities =
    typeof room.facilities === "string" && room.facilities.startsWith("[")
      ? JSON.parse(room.facilities)
      : room.facilities
        ? [room.facilities]
        : [];

  // Update breadcrumbs with fetched room name
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Rooms", href: "/rooms" }, // Link to the general rooms page
    { label: room.name }, // Use fetched room name
  ];

  // Determine images to display
  const displayImages =
    room.images && room.images.length > 0
      ? room.images
      : room.coverImage
        ? [room.coverImage]
        : ["/placeholder.svg"]; // Use room images or cover, fallback to placeholder

  // Calculate if the reservation limit is reached
  const isLimitReached =
    !!session?.user?.id && pendingCount >= reservationLimit;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <BreadcrumbSetter items={breadcrumbItems} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Reservation Limit Alert */}
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Gallery Section */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500">
              {/* Use fetched images */}
              <RoomImageGallery images={displayImages} />
            </div>
          </div>

          {/* Product Details Section */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="space-y-8 sticky top-8">
              {/* Room Detail Header */}
              <RoomDetailHeader room={room} />

              {/* Room Booking Section */}
              <RoomBookingSection
                roomSlug={roomSlug}
                approvedReservations={approvedReservations}
                pendingCount={pendingCount}
                isLimitReached={isLimitReached}
                reservationLimit={reservationLimit}
                isLoggedIn={!!session?.user?.id}
              />
            </div>
          </div>
        </div>
        {/* Additional Information Sections */}
        <div className="space-y-8">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-card via-card to-accent/5 overflow-hidden">
            <div className="relative">
              {/* Modern pattern background */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 20%, hsl(var(--primary)) 0%, transparent 50%), radial-gradient(circle at 80% 80%, hsl(var(--accent)) 0%, transparent 50%)`,
                }}
              />
              <div className="relative p-6 md:p-8 space-y-12">
                {/* Amenities and Location Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Amenities Section */}
                  <RoomAmenitiesSection facilities={facilities} />

                  {/* Location Section */}
                  <RoomLocationSection location={room.location} />
                </div>

                {/* User Reservations Section (Conditional) */}
                <UserReservationsSection
                  reservations={myReservations}
                  isVisible={!!session?.user?.id}
                />

                {/* Recent Reservations Section */}
                <RecentReservationsSection reservations={recentReservations} />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
