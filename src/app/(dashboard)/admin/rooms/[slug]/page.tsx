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
      title: "Ruangan Tidak Ditemukan",
      description: "Ruangan yang diminta tidak dapat ditemukan",
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: room.name,
    description:
      room.description ||
      `Detail untuk ${room.name} dengan kapasitas ${room.capacity} orang`,
    openGraph: {
      description: room.description || `Lihat detail untuk ${room.name}`,
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
    { label: "Ruangan", href: "#" },
    { label: "Kelola Ruangan", href: "/admin/rooms" },
    { label: room.name },
  ];

  return (
    <>
      <BreadcrumbSetter items={roomBreadcrumb} />

      <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
        <RoomDetailHeader room={room} />

        <div className="bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/10 dark:to-purple-950/10 rounded-xl p-6 shadow-lg border-0 backdrop-blur-sm">
          <div className="space-y-8">
            <RoomDetailStats stats={roomStats} />

            <RoomImageSection room={room} />

            <RoomInfoSection room={room} />

            <RoomReservationsSection
              roomId={room.id}
              recentReservations={recentReservations}
            />
          </div>
        </div>
      </div>
    </>
  );
}
