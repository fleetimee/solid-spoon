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
import {
  CalendarIcon,
  Sparkles,
  Clock,
  MapPin,
  Users,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { Typography } from "@/components/ui/typography";
import {
  Banner,
  BannerClose,
  BannerIcon,
  BannerTitle,
} from "@/components/ui/kibo-ui/banner";

// Import new refactored components
import { RoomDetailHeader } from "@/features/rooms/components/room-detail-header";
import { RoomBookingSection } from "@/features/rooms/components/room-booking-section";
import { RoomAmenitiesSection } from "@/features/rooms/components/room-amenities-section";
import { RoomLocationSection } from "@/features/rooms/components/room-location-section";
import { UserReservationsSection } from "@/features/rooms/components/user-reservations-section";
import { RecentReservationsSection } from "@/features/rooms/components/recent-reservations-section";
import { RoomRulesSection } from "@/features/rooms/components/room-rules-section";
import { RoomBanners } from "@/features/rooms/components/room-banners";

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
    <>
      <BreadcrumbSetter items={breadcrumbItems} />
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-violet-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
        {/* Hero Section with Modern Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 dark:from-violet-800 dark:via-purple-800 dark:to-pink-800">
          <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>

          <div className="relative max-w-screen-xl mx-auto px-6 py-12">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-sm border border-white/30 text-white">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Ruangan Premium</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    {room.name}
                  </span>
                </h1>
                <Typography
                  variant="lead"
                  className="text-white/90 max-w-2xl mx-auto"
                >
                  {room.description ||
                    "Ruangan berkualitas premium dengan fasilitas terbaik untuk kebutuhan Anda"}
                </Typography>
              </div>

              {/* Room Quick Info */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-white/80">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">
                    {room.location || "Lokasi Premium"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">
                    Kapasitas {room.capacity || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Tersedia 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-6 py-12">
          {/* Compact Single Column Layout */}
          <div className="space-y-8">
            {/* Modern Image Gallery */}
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-white/70 dark:bg-card/70 backdrop-blur-sm border-0">
              <RoomImageGallery images={displayImages} />
            </div>

            {/* Room Status Banners */}
            <RoomBanners
              isLimitReached={isLimitReached}
              pendingCount={pendingCount}
            />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Booking Section */}
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-2xl bg-white/70 dark:bg-card/70 backdrop-blur-sm">
                  <RoomBookingSection
                    approvedReservations={approvedReservations}
                    reservationLimit={reservationLimit}
                    isLoggedIn={!!session?.user?.id}
                  />
                </Card>
              </div>

              {/* Sidebar with Amenities, Location, and Book Now Button */}
              <div className="space-y-6">
                {/* Amenities Card */}
                <Card className="border-0 shadow-2xl bg-white/70 dark:bg-card/70 backdrop-blur-sm">
                  <RoomAmenitiesSection facilities={facilities} />
                </Card>

                {/* Location Card */}
                <Card className="border-0 shadow-2xl bg-white/70 dark:bg-card/70 backdrop-blur-sm">
                  <RoomLocationSection location={room.location} />
                </Card>

                {/* Enhanced Book Now Button */}
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 backdrop-blur-sm">
                  <div className="p-6 space-y-4">
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-semibold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                        Siap untuk Memesan?
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Dapatkan ruangan impian Anda sekarang
                      </p>
                    </div>
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
                          "bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-700 hover:via-purple-700 hover:to-pink-700",
                          "shadow-lg hover:shadow-xl transition-all duration-300",
                          "transform hover:scale-[1.02] active:scale-[0.98]",
                          "border-0 text-white",
                          !isLimitReached && "animate-pulse hover:animate-none"
                        )}
                        disabled={isLimitReached}
                      >
                        <CalendarIcon className="h-5 w-5" />
                        {isLimitReached ? "Batas Tercapai" : "Pesan Sekarang"}
                      </Button>
                    </Link>
                  </div>
                </Card>

                {/* Room Rules Card */}
                <Card className="border-0 shadow-2xl bg-white/70 dark:bg-card/70 backdrop-blur-sm">
                  <RoomRulesSection />
                </Card>
              </div>
            </div>

            {/* User Reservations Section (Conditional) */}
            <div className="space-y-6">
              <UserReservationsSection
                reservations={myReservations}
                isVisible={!!session?.user?.id}
              />

              {/* Recent Reservations Section */}
              <RecentReservationsSection reservations={recentReservations} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
