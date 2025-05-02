import { Badge } from "@/components/ui/badge"; // Import Badge
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Import cn
import { CalendarIcon } from "@radix-ui/react-icons";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Import Table components
import { Typography } from "@/components/ui/typography";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { RoomImageGallery } from "@/features/rooms/components/room-image-gallery";
// Import AlertTitle and AlertTriangle
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Info,
  AlertTriangle,
  ListChecks,
  Sparkles,
  MapPin,
  History,
  UserCheck, // Import UserCheck icon
} from "lucide-react"; // Import AlertTriangle and section icons
// Removed Tabs import
import React from "react";
import { format } from "date-fns"; // Import date formatting
import { notFound } from "next/navigation"; // Import notFound
import { headers } from "next/headers"; // Import headers for session
import { getRoomBySlug } from "@/features/rooms/api/getRooms"; // Import data fetching function
import { FacilityBadge } from "@/features/rooms/components/facility-badge"; // Import FacilityBadge
// Removed formatCurrency import as price field doesn't exist
import Link from "next/link"; // Import Link for navigation
import { auth } from "@/lib/auth"; // Import auth config
import { getPendingReservationCount } from "@/features/reservations/api/getPendingReservationCount"; // Import count function

// Removed Separator import as it's no longer needed for the table
import {
  getRecentReservations,
  RecentReservation,
} from "@/features/reservations/api/getRecentReservations"; // Import recent reservations
import {
  getUserRoomReservations,
  UserRoomReservation,
} from "@/features/reservations/api/getUserRoomReservations"; // Import user reservations

// Import approved reservations function and type
import {
  getApprovedRoomReservations,
  ApprovedReservationTime,
} from "@/features/reservations/api/getApprovedRoomReservations";
// Import the calendar component
import { RoomAvailabilityCalendar } from "@/features/rooms/components/room-availability-calendar";

// Import getReservationLimit
import { getReservationLimit } from "@/features/application/api/getReservationLimit";

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
    ? await getRecentReservations(room.id)
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
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {session?.user?.id && pendingCount >= reservationLimit && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Reservation Limit Reached</AlertTitle>
            <AlertDescription>
              You have reached the maximum limit of {reservationLimit} pending
              reservations for this room. You cannot create new reservations
              until existing ones are processed.
            </AlertDescription>
          </Alert>
        )}
      </div>
      <BreadcrumbSetter items={breadcrumbItems} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Reservation Limit Alert */}
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Gallery Section */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="sticky top-8">
              {/* Use fetched images */}
              <RoomImageGallery images={displayImages} />
            </div>
          </div>

          {/* Product Details Section */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-20 space-y-6">
              {" "}
              {/* Adjusted top value for sticky navbar */}
              <div className="space-y-4">
                <Typography variant="h1" as="h1" className="text-3xl font-bold">
                  {/* Use fetched room name */}
                  {room.name}
                </Typography>
                {/* Removed price display as 'price' field doesn't exist on Room type */}
              </div>
              <div className="space-y-4">
                <Typography variant="default" className="text-muted-foreground">
                  {/* Use fetched room description */}
                  {room.description || "No description available."}
                </Typography>

                <div className="space-y-2">
                  <Typography
                    variant="h3"
                    as="h3"
                    className="flex items-center font-medium"
                  >
                    <ListChecks className="h-5 w-5 mr-2" />
                    Quick Highlights
                  </Typography>
                  <ul className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    {/* Use fetched capacity */}
                    <li>• {room.capacity} Room Capacity</li>
                    {/* Add other relevant highlights if available in room data */}
                    {/* Example: <li>• 1 Bedroom</li> */}
                    {/* Example: <li>• 1 Bathroom</li> */}
                    {/* Example: <li>• Free WiFi</li> */}
                  </ul>
                </div>
              </div>
              {/* Add RoomAvailabilityCalendar component */}
              <RoomAvailabilityCalendar
                approvedReservations={approvedReservations}
              />
              {/* Approved Reservations List */}
              <div className="mt-6 space-y-4">
                <Typography
                  variant="h3"
                  as="h3"
                  className="flex items-center font-medium"
                >
                  <ListChecks className="h-5 w-5 mr-2" />
                  Current Bookings
                </Typography>
                {approvedReservations.length > 0 ? (
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                    {approvedReservations.map((res) => (
                      <li key={`${res.startTime}-${res.endTime}`}>
                        {format(new Date(res.startTime), "PPp")} -{" "}
                        {format(new Date(res.endTime), "PPp")}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Typography
                    variant="default"
                    className="text-muted-foreground"
                  >
                    No current bookings for this period.
                  </Typography>
                )}
              </div>
              {/* Replace ReservationFormDialog with a Link to the new page */}
              {/* Book Now button moved below */}
              {/* Display pending reservation count */}
              {pendingCount > 0 && (
                <Alert variant="default">
                  <Info className="h-4 w-4" />
                  {/* Optional: <AlertTitle>Heads up!</AlertTitle> */}
                  <AlertDescription>
                    You have {pendingCount} pending reservation(s) for this
                    room.
                  </AlertDescription>
                </Alert>
              )}
              {/* Book Now Button */}
              <Link
                href={`/v/${roomSlug}/reservations/new`}
                passHref
                className={cn(
                  isLimitReached &&
                    "pointer-events-none cursor-not-allowed opacity-50"
                )} // Apply conditional styles
                aria-disabled={isLimitReached} // Add aria-disabled
              >
                <Button
                  className="w-full flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  disabled={isLimitReached} // Disable button if limit is reached
                >
                  <CalendarIcon className="h-5 w-5" />
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Additional Information Sections Wrapped in Card */}
        <Card>
          <div
            className="p-4 md:p-6 space-y-12"
            style={{
              backgroundColor: "hsl(var(--card))",
              backgroundImage: `linear-gradient(45deg, hsl(var(--border)) 25%, transparent 25%), linear-gradient(-45deg, hsl(var(--border)) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, hsl(var(--border)) 75%), linear-gradient(-45deg, transparent 75%, hsl(var(--border)) 75%)`,
              backgroundSize: "10px 10px",
            }}
          >
            {/* Amenities and Location Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Amenities Section */}
              <div className="space-y-4">
                <Typography
                  variant="h3"
                  as="h3"
                  className="flex items-center font-medium"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Room Amenities
                </Typography>
                {/* Use fetched facilities */}
                {facilities.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {facilities.map((facility: string, index: number) => (
                      <FacilityBadge key={index} name={facility} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No specific amenities listed.
                  </p>
                )}
              </div>

              {/* Location Section */}
              <div className="space-y-4">
                <Typography
                  variant="h3"
                  as="h3"
                  className="flex items-center font-medium mb-4"
                >
                  <MapPin className="h-5 w-5 mr-2" />
                  Location Information {/* Use fetched location */}
                </Typography>
                <Typography variant="default" className="text-muted-foreground">
                  {room.location || "Location details not available."}
                </Typography>
              </div>
            </div>

            {/* My Reservations Section (Conditional) */}
            {session?.user?.id && (
              <div className="md:col-span-2 space-y-4">
                <Typography
                  variant="h3"
                  as="h3"
                  className="flex items-center font-medium"
                >
                  <UserCheck className="h-5 w-5 mr-2" />
                  My Reservations
                </Typography>
                <Table>
                  <TableBody>
                    {myReservations && myReservations.length > 0 ? (
                      myReservations.map((reservation) => (
                        <TableRow key={reservation.id}>
                          <TableCell className="font-medium">
                            {reservation.title}
                          </TableCell>
                          <TableCell>
                            {format(new Date(reservation.startTime), "PPp")}
                          </TableCell>
                          <TableCell>
                            {format(new Date(reservation.endTime), "PPp")}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                reservation.statusValue === "Approved"
                                  ? "default"
                                  : reservation.statusValue === "Pending"
                                    ? "secondary"
                                    : reservation.statusValue === "Rejected"
                                      ? "destructive"
                                      : "default"
                              }
                            >
                              {reservation.statusValue}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4} // Title, Start, End, Status
                          className="h-24 text-center text-muted-foreground"
                        >
                          You have no active reservations for this room.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Recent Reservations Section */}
            <div className="md:col-span-2 space-y-4">
              <Typography
                variant="h3"
                as="h3"
                className="flex items-center font-medium" // Use same styling as other titles
              >
                <History className="h-5 w-5 mr-2" />
                Recent Reservations
              </Typography>
              <Table>
                <TableBody>
                  {recentReservations && recentReservations.length > 0 ? (
                    recentReservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell className="font-medium">
                          {reservation.title}
                        </TableCell>
                        <TableCell>{reservation.userName}</TableCell>
                        <TableCell>
                          {format(new Date(reservation.startTime), "PPp")}
                        </TableCell>
                        <TableCell>
                          {format(new Date(reservation.endTime), "PPp")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              reservation.statusValue === "Approved"
                                ? "default" // Use default for Approved
                                : reservation.statusValue === "Pending"
                                  ? "secondary" // Use secondary for Pending
                                  : reservation.statusValue === "Rejected"
                                    ? "destructive" // Use destructive for Rejected
                                    : "default" // Fallback
                            }
                          >
                            {reservation.statusValue}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5} // Keep colspan as 5 (Title, Booked By, Start, End, Status)
                        className="h-24 text-center text-muted-foreground"
                      >
                        No recent reservations for this room.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>{" "}
          {/* Close striped background div */}
        </Card>{" "}
        {/* Close Card */}
      </div>
    </div>
  );
}
