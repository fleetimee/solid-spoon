import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { getRoomBySlug } from "@/features/rooms/api/getRooms";
import { getRoomDetailStats } from "@/features/rooms/api/getRoomDetailStats";
import {
  getRecentReservations,
  RecentReservation,
} from "@/features/reservations/api/getRecentReservations";
import { RoomDetailHeader } from "@/features/rooms/components/room-detail-header";
import { RoomDetailStats } from "@/features/rooms/components/room-detail-stats";
import { RoomImageSection } from "@/features/rooms/components/room-image-section";
import { RoomInfoSection } from "@/features/rooms/components/room-info-section";
import { RoomReservationsSection } from "@/features/rooms/components/room-reservations-section";

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

  // Fetch data in parallel for better performance
  const [roomStats, recentReservations] = await Promise.all([
    getRoomDetailStats(room.id),
    getRecentReservations(room.id, 10),
  ]);

  const roomBreadcrumb = [
    { label: "Rooms", href: "#" },
    { label: "Manage Rooms", href: "/admin/rooms" },
    { label: room.name },
  ];

  return (
    <>
      <BreadcrumbSetter items={roomBreadcrumb} />

      <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
        <RoomDetailHeader room={room} />

        <RoomDetailStats stats={roomStats} />

        <RoomImageSection room={room} />

        <RoomInfoSection room={room} />

        <RoomReservationsSection
          roomId={room.id}
          recentReservations={recentReservations}
        />
      </div>
    </>
  );
}
