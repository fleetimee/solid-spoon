import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
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
    { label: "Rooms" }, // Assuming no /rooms page for now
    { label: roomSlug }, // Using slug as placeholder for room name
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <BreadcrumbSetter items={breadcrumbItems} />
        {/* Image Carousel Placeholder */}
        <Card className="flex items-center justify-center h-96 bg-muted">
          <CardContent className="text-center">
            <Typography variant="h3" as="h3">
              Image Carousel Placeholder
            </Typography>
            <Typography variant="muted" className="text-muted-foreground">
              (Room: {roomSlug})
            </Typography>
          </CardContent>
        </Card>

        {/* Room Details */}
        <div className="space-y-6">
          <Typography variant="h1" as="h1">
            Room Title Placeholder
          </Typography>
          <Typography variant="default" className="text-muted-foreground">
            Detailed description of the room goes here. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua.
          </Typography>

          <div>
            <Typography variant="h3" as="h3" className="mb-2">
              Key Features
            </Typography>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Feature 1 Placeholder</li>
              <li>Feature 2 Placeholder</li>
              <li>Amenity A Placeholder</li>
              <li>Amenity B Placeholder</li>
            </ul>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <Typography variant="h3" as="h3">
              $XXX / night
            </Typography>
            <Button size="lg">Book Now</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
