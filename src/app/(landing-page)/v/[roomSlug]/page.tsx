import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { RoomImageGallery } from "@/features/rooms/components/room-image-gallery";
// Removed Tabs import
import React from "react";
import { notFound } from "next/navigation"; // Import notFound
import { getRoomBySlug } from "@/features/rooms/api/getRooms"; // Import data fetching function
import { FacilityBadge } from "@/features/rooms/components/facility-badge"; // Import FacilityBadge
// Removed formatCurrency import as price field doesn't exist
import Link from "next/link"; // Import Link for navigation

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

  // Fetch room data
  const room = await getRoomBySlug(roomSlug);

  // Handle room not found
  if (!room) {
    notFound();
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
    { label: "Rooms" }, // Consider adding a link to a general rooms page if it exists
    { label: room.name }, // Use fetched room name
  ];

  // Determine images to display
  const displayImages =
    room.images && room.images.length > 0
      ? room.images
      : room.coverImage
        ? [room.coverImage]
        : ["/placeholder.svg"]; // Use room images or cover, fallback to placeholder

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbSetter items={breadcrumbItems} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  <Typography variant="h3" as="h3" className="font-medium">
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
              {/* Replace ReservationFormDialog with a Link to the new page */}
              <Link href={`/v/${roomSlug}/reservations/new`} passHref>
                <Button className="w-full">Book Now</Button>
              </Link>
              <Card className="p-4 bg-muted/50">
                <Typography variant="h4" as="h4" className="font-medium mb-2">
                  Booking Protection
                </Typography>
                <Typography variant="small" className="text-muted-foreground">
                  Free cancellation up to 24 hours before check-in{" "}
                  {/* Keep or make dynamic */}
                </Typography>
              </Card>
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        {/* Apply grid layout here to place Amenities and Location side-by-side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Amenities Section */}
          <div className="space-y-4">
            <Typography variant="h3" as="h3" className="font-medium">
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
            {/* Keep or remove placeholder list */}
            {/* <ul className="space-y-2 text-muted-foreground">
                  <li>• Feature 1 Placeholder</li>
                  <li>• Feature 2 Placeholder</li>
                  <li>• Amenity A Placeholder</li>
                  <li>• Amenity B Placeholder</li>
                </ul> */}
          </div>

          {/* Location Section */}
          <div className="space-y-4">
            <Typography variant="h3" as="h3" className="font-medium mb-4">
              Location Information {/* Use fetched location */}
            </Typography>
            <Typography variant="default" className="text-muted-foreground">
              {room.location || "Location details not available."}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
