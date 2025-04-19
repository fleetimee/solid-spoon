import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { getRoomBySlug } from "@/features/rooms/api/getRooms";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users, MapPin, Calendar, User, Pencil } from "lucide-react";
import { FacilityBadge } from "@/features/rooms/components/facility-badge";
import { RoomImageGallery } from "@/features/rooms/components/room-image-gallery";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface RoomDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function RoomDetailPage({ params }: RoomDetailPageProps) {
  const { slug } = params;
  const room = await getRoomBySlug(slug);

  if (!room) {
    notFound();
  }

  // Parse facilities from JSON string if needed
  const facilities =
    typeof room.facilities === "string" && room.facilities.startsWith("[")
      ? JSON.parse(room.facilities)
      : room.facilities
        ? [room.facilities]
        : [];

  const roomBreadcrumb = [
    { label: "Rooms", href: "/admin/rooms" },
    { label: room.name },
  ];

  return (
    <>
      <BreadcrumbSetter items={roomBreadcrumb} />

      <main className="flex flex-col grow p-4 max-w-7xl mx-auto w-full gap-8">
        {/* Room Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">{room.name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{room.location || "Location not specified"}</span>
            <span className="mx-2">•</span>
            <Users className="h-4 w-4" />
            <span>Capacity: {room.capacity}</span>
          </div>
        </div>

        {/* Image Gallery */}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Room Details */}
          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Description</h2>
                  <p className="text-muted-foreground">
                    {room.description || "No description available"}
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold mb-3">Facilities</h2>
                  {facilities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {facilities.map((facility: string, index: number) => (
                        <FacilityBadge key={index} name={facility} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No facilities listed
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Room Metadata with Invisible Table */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Room Information</h2>
              <Table>
                <TableBody>
                  {/* Capacity */}
                  <TableRow className="border-0 hover:bg-transparent">
                    <TableCell className="pl-0 py-2 w-1/3">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Capacity</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      : {room.capacity} people
                    </TableCell>
                  </TableRow>

                  {/* Created by */}
                  <TableRow className="border-0 hover:bg-transparent">
                    <TableCell className="pl-0 py-2 w-1/3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Created by</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 truncate">
                      : {room.createdByName || "Unknown"}
                    </TableCell>
                  </TableRow>

                  {/* Created at */}
                  <TableRow className="border-0 hover:bg-transparent">
                    <TableCell className="pl-0 py-2 w-1/3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Created</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      : {format(new Date(room.createdAt), "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>

                  {/* Updated by (conditional) */}
                  {room.updatedBy && (
                    <>
                      <TableRow className="border-0 hover:bg-transparent">
                        <TableCell className="pl-0 py-2 w-1/3">
                          <div className="flex items-center gap-2">
                            <Pencil className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">Updated by</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-2 truncate">
                          : {room.updatedByName || "Unknown"}
                        </TableCell>
                      </TableRow>

                      <TableRow className="border-0 hover:bg-transparent">
                        <TableCell className="pl-0 py-2 w-1/3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">Last updated</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-2">
                          : {format(new Date(room.updatedAt), "MMM d, yyyy")}
                        </TableCell>
                      </TableRow>
                    </>
                  )}

                  {/* Status */}
                  <TableRow className="border-0 hover:bg-transparent">
                    <TableCell className="pl-0 py-2 w-1/3">
                      <span className="font-medium">Status</span>
                    </TableCell>
                    <TableCell className="py-2">
                      :{" "}
                      <Badge
                        variant={room.isActive ? "default" : "destructive"}
                      >
                        {room.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
