import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { RoomImageGallery } from "@/features/rooms/components/room-image-gallery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

interface RoomDetailPageProps {
  params: {
    roomSlug: string;
  };
}

export default function RoomDetailPage({ params }: RoomDetailPageProps) {
  const { roomSlug } = params;
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Rooms" },
    { label: roomSlug },
  ];

  // Placeholder images array - this would come from your data
  const placeholderImages = ["/placeholder.svg"];

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbSetter items={breadcrumbItems} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Gallery Section */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="sticky top-8">
              <RoomImageGallery images={placeholderImages} />
            </div>
          </div>

          {/* Product Details Section */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-8 space-y-6">
              <div className="space-y-4">
                <Typography variant="h1" as="h1" className="text-3xl font-bold">
                  Room Title Placeholder
                </Typography>
                <Typography
                  variant="h2"
                  as="p"
                  className="text-2xl font-bold text-primary"
                >
                  $XXX / night
                </Typography>
              </div>

              <div className="space-y-4">
                <Typography variant="default" className="text-muted-foreground">
                  Detailed description of the room goes here. Lorem ipsum dolor
                  sit amet, consectetur adipiscing elit.
                </Typography>

                <div className="space-y-2">
                  <Typography variant="h3" as="h3" className="font-medium">
                    Quick Highlights
                  </Typography>
                  <ul className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <li>• 2 Guests</li>
                    <li>• 1 Bedroom</li>
                    <li>• 1 Bathroom</li>
                    <li>• Free WiFi</li>
                  </ul>
                </div>
              </div>

              <Button size="lg" className="w-full">
                Book Now
              </Button>

              <Card className="p-4 bg-muted/50">
                <Typography variant="h4" as="h4" className="font-medium mb-2">
                  Booking Protection
                </Typography>
                <Typography variant="small" className="text-muted-foreground">
                  Free cancellation up to 24 hours before check-in
                </Typography>
              </Card>
            </div>
          </div>
        </div>

        {/* Additional Information Tabs */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="details">Details & Amenities</TabsTrigger>
            <TabsTrigger value="rules">House Rules</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Typography variant="h3" as="h3" className="font-medium">
                  Room Amenities
                </Typography>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Feature 1 Placeholder</li>
                  <li>• Feature 2 Placeholder</li>
                  <li>• Amenity A Placeholder</li>
                  <li>• Amenity B Placeholder</li>
                </ul>
              </div>
              <div className="space-y-4">
                <Typography variant="h3" as="h3" className="font-medium">
                  Services
                </Typography>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Daily Housekeeping</li>
                  <li>• 24/7 Front Desk</li>
                  <li>• Room Service</li>
                  <li>• Laundry Service</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rules" className="space-y-4 mt-6">
            <Typography variant="h3" as="h3" className="font-medium mb-4">
              House Rules
            </Typography>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Check-in: 2:00 PM - 12:00 AM</li>
              <li>• Checkout: 11:00 AM</li>
              <li>• No smoking</li>
              <li>• No pets</li>
            </ul>
          </TabsContent>

          <TabsContent value="location" className="space-y-4 mt-6">
            <Typography variant="h3" as="h3" className="font-medium mb-4">
              Location Information
            </Typography>
            <div className="aspect-[16/9] bg-muted rounded-lg"></div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
