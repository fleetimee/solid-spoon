import { Card } from "@/components/ui/card";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { RoomImageGallery } from "@/features/rooms/components/room-image-gallery";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import Link from "next/link";

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

      <div className="w-full max-w-screen-xl mx-auto px-6 py-6">
        {/* Compact Single Column Layout */}
        <div className="space-y-6">
          {/* Room Detail Header */}
          <RoomDetailHeader room={room} />

          {/* Compact Image Gallery */}
          <div className="rounded-xl overflow-hidden shadow-md">
            <RoomImageGallery images={displayImages} />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Booking Section */}
            <div className="lg:col-span-2">
              <RoomBookingSection
                approvedReservations={approvedReservations}
                pendingCount={pendingCount}
                reservationLimit={reservationLimit}
                isLoggedIn={!!session?.user?.id}
              />
            </div>

            {/* Amenities, Location, and Book Now Button */}
            <div className="space-y-6">
              <RoomAmenitiesSection facilities={facilities} />
              <RoomLocationSection location={room.location} />

              {/* Enhanced Book Now Button - Positioned below location */}
              <div className="space-y-3">
                <Link
                  href={`/v/${roomSlug}/reservations/new`}
                  passHref
                  className={cn(
                    "block",
                    isLimitReached &&
                      "pointer-events-none cursor-not-allowed opacity-50"
                  )}
                  aria-disabled={isLimitReached}
                >
                  <Button
                    className={cn(
                      "w-full h-12 flex items-center justify-center gap-2 font-semibold text-base",
                      "bg-gradient-to-r from-primary via-primary to-purple-600 hover:from-primary/90 hover:via-primary/90 hover:to-purple-600/90",
                      "shadow-md hover:shadow-lg transition-all duration-300",
                      "transform hover:scale-[1.01] active:scale-[0.99]",
                      "border border-primary/20 hover:border-primary/30",
                      !isLimitReached && "animate-pulse hover:animate-none"
                    )}
                    disabled={isLimitReached}
                  >
                    <CalendarIcon className="h-5 w-5" />
                    {isLimitReached ? "Limit Reached 🚫" : "Book Now ✨"}
                  </Button>
                </Link>
              </div>
            </div>
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
    </div>
  );
}
