import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { getRoomBySlug } from "@/features/rooms/api/getRooms";
import { AlertCircle, ArrowLeft, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DeleteRoomForm } from "@/features/rooms/components/room-delete-form";

interface DeleteRoomPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(
  props: DeleteRoomPageProps
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

  return {
    title: `Delete ${room.name} | Room Management`,
    description: `Permanently delete the room "${room.name}"`,
  };
}

export default async function DeleteRoomPage(props: DeleteRoomPageProps) {
  const params = await props.params;
  const { slug } = params;
  const room = await getRoomBySlug(slug);

  if (!room) {
    notFound();
  }

  const roomBreadcrumb = [
    { label: "Rooms", href: "#" },
    { label: "Manage Rooms", href: "/admin/rooms" },
    { label: room.name, href: `/admin/rooms/${slug}` },
    { label: "Delete" },
  ];

  return (
    <>
      <BreadcrumbSetter items={roomBreadcrumb} />

      <main className="flex flex-col grow p-4 max-w-3xl mx-auto w-full">
        <div className="flex flex-col gap-6">
          <div>
            <Link
              href={`/admin/rooms/${slug}`}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Back to room details</span>
            </Link>
            <h1 className="text-2xl font-bold">Delete Room</h1>
            <p className="text-muted-foreground mt-1">
              You are about to delete the room &quot;{room.name}&quot;
            </p>
          </div>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning: This action cannot be undone</AlertTitle>
            <AlertDescription>
              Deleting this room will permanently remove it from the system and
              remove its availability from any future bookings. Any historical
              data related to this room may be affected.
            </AlertDescription>
          </Alert>

          <Card className="border-destructive">
            <CardHeader className="border-b border-destructive/20 bg-destructive/5 text-destructive">
              <div className="flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Delete Confirmation</h2>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4">
                To confirm deletion, please type the full name of the room:
                <span className="font-semibold block mt-1 px-3 py-2 bg-muted rounded-md">
                  {room.name}
                </span>
              </p>

              <DeleteRoomForm room={room} />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
