import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { Metadata, ResolvingMetadata } from "next";
import { ArrowLeft } from "lucide-react";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { getRoomBySlug } from "@/features/rooms/api/getRooms";
import { RoomForm } from "@/features/rooms/components/room-form";
import { Skeleton } from "@/components/ui/skeleton";

interface UpdateRoomPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(
  props: UpdateRoomPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Resolve params
  const params = await props.params;
  const { slug } = params;

  // Fetch room data
  const room = await getRoomBySlug(slug);

  // If room not found, return basic metadata
  if (!room) {
    return {
      title: "Room Not Found",
      description: "The requested room could not be found",
    };
  }

  return {
    title: `Update ${room.name} | Room Management`,
    description: `Edit details and configuration for room "${room.name}"`,
    openGraph: {
      title: `Update ${room.name}`,
      description: `Edit details and configuration for room "${room.name}"`,
      images: room.coverImage ? [room.coverImage] : [],
    },
  };
}

export default async function UpdateRoomPage(props: UpdateRoomPageProps) {
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
    { label: "Update" },
  ];

  return (
    <>
      <BreadcrumbSetter items={roomBreadcrumb} />

      <main className="flex flex-col grow p-4 md:p-6">
        <div className="mb-6">
          <Link
            href={`/admin/rooms/${slug}`}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Back to room details</span>
          </Link>
          <h1 className="text-2xl font-bold">Update Room</h1>
          <p className="text-muted-foreground">
            Make changes to the room details and click Update Room when done.
          </p>
        </div>

        <Suspense fallback={<Skeleton className="h-10 w-full" />}>
          <RoomForm room={room} mode="update" />
        </Suspense>
      </main>
    </>
  );
}
