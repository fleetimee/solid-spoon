import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import {
  getRecentReservations,
  RecentReservation,
} from "@/features/reservations/api/getRecentReservations";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";
import { Metadata, ResolvingMetadata } from "next";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { getRoomBySlug } from "@/features/rooms/api/getRooms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  MapPin,
  Calendar,
  User,
  Pencil,
  Trash2,
  Edit,
  Building,
  Quote, // Added Quote icon
} from "lucide-react";
import { FacilityBadge } from "@/features/rooms/components/facility-badge";
import { RoomImageGallery } from "@/features/rooms/components/room-image-gallery";
import { Button } from "@/components/ui/button";

interface RoomDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(
  props: RoomDetailPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const { slug } = params;

  const room = await getRoomBySlug(slug);

  if (!room) {
    return {
      title: "Room Not Found",
      description: "The requested room could not be found",
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: room.name,
    description:
      room.description ||
      `Details for ${room.name} with capacity of ${room.capacity} people`,
    openGraph: {
      description: room.description || `View details for ${room.name}`,
      images: room.coverImage
        ? [room.coverImage, ...previousImages]
        : previousImages,
    },
  };
}

export default async function RoomDetailPage(props: RoomDetailPageProps) {
  const params = await props.params;
  const { slug } = params;
  const room = await getRoomBySlug(slug);

  if (!room) {
    notFound();
  }

  const recentReservations: RecentReservation[] = await getRecentReservations(
    room.id,
    10
  );
  const facilities =
    typeof room.facilities === "string" && room.facilities.startsWith("[")
      ? JSON.parse(room.facilities)
      : room.facilities
        ? [room.facilities]
        : [];

  const roomBreadcrumb = [
    { label: "Rooms", href: "#" },
    { label: "Manage Rooms", href: "/admin/rooms" },
    { label: room.name },
  ];

  return (
    <>
      <BreadcrumbSetter items={roomBreadcrumb} />

      <main className="flex flex-col grow p-4 max-w-7xl mx-auto w-full gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{room.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{room.location || "Location not specified"}</span>
                <span className="mx-2">•</span>
                <Users className="h-4 w-4" />
                <span>Capacity: {room.capacity}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                asChild
              >
                <Link href={`/admin/rooms/${slug}/update`}>
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Link>
              </Button>
              <Button
                variant="destructive"
                className="flex items-center gap-2"
                asChild
              >
                <Link href={`/admin/rooms/${slug}/delete`}>
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full">
          {room.images && room.images.length > 0 ? (
            <RoomImageGallery images={room.images} />
          ) : room.coverImage ? (
            <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
              <Image
                src={room.coverImage}
                alt={room.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
          ) : (
            <div className="w-full h-[400px] bg-muted flex items-center justify-center rounded-lg">
              <p className="text-muted-foreground">No images available</p>
            </div>
          )}
        </div>

        {/* Description Section */}
        {/* Description Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Quote className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Description</h3>
          </div>
          <blockquote className="border-l-4 border-primary pl-4 py-2 italic text-muted-foreground bg-muted/50 rounded-r-md">
            {room.description || "No description available"}
          </blockquote>
        </div>

        {/* Room Information Card */}
        <div className="grid grid-cols-1 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Room Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              {/* Main Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Capacity
                    </p>
                    <p className="font-semibold">{room.capacity} people</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Created by
                    </p>
                    <p className="font-semibold truncate">
                      {room.createdByName || "Unknown"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Created
                    </p>
                    <p className="font-semibold">
                      {format(new Date(room.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>

                {room.updatedBy && (
                  <>
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <Pencil className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Updated by
                        </p>
                        <p className="font-semibold truncate">
                          {room.updatedByName || "Unknown"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Last updated
                        </p>
                        <p className="font-semibold">
                          {format(new Date(room.updatedAt), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-current" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Status
                    </p>
                    <Badge variant={room.isActive ? "default" : "destructive"}>
                      {room.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Facilities Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Facilities
                </h3>
                {facilities.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {facilities.map((facility: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <FacilityBadge name={facility} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground rounded-md bg-muted/50 px-4 py-3">
                    No facilities listed
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reservations Card - Full Width */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Recent Reservations (Last 10)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Booked By</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
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
                    <TableCell colSpan={5} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <History className="w-8 h-8 opacity-50" />
                        <p>No recent reservations for this room</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
