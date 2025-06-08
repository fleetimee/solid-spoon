import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Metadata } from "next";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { getRoomBySlug } from "@/features/rooms/api/getRooms";
import { AddRoomHeader } from "@/features/rooms/components/add-room-header";
import { AddRoomFormSections } from "@/features/rooms/components/add-room-form-sections";
import { Skeleton } from "@/components/ui/skeleton";

interface UpdateRoomPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(
  props: UpdateRoomPageProps
): Promise<Metadata> {
  // Resolve params
  const params = await props.params;
  const { slug } = params;

  // Fetch room data
  const room = await getRoomBySlug(slug);

  // If room not found, return basic metadata
  if (!room) {
    return {
      title: "Ruangan Tidak Ditemukan",
      description: "Ruangan yang diminta tidak dapat ditemukan",
    };
  }

  return {
    title: `Perbarui ${room.name} | Kelola Ruangan`,
    description: `Edit detail dan konfigurasi untuk ruangan "${room.name}"`,
    openGraph: {
      title: `Perbarui ${room.name}`,
      description: `Edit detail dan konfigurasi untuk ruangan "${room.name}"`,
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
    { label: "Ruangan", href: "#" },
    { label: "Kelola Ruangan", href: "/admin/rooms" },
    { label: room.name, href: `/admin/rooms/${slug}` },
    { label: "Perbarui" },
  ];

  return (
    <>
      <BreadcrumbSetter items={roomBreadcrumb} />

      <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
        <AddRoomHeader
          title={`✏️ Update ${room.name}`}
          description="Make changes to your room details and enhance the experience"
        />

        <Suspense fallback={<Skeleton className="h-10 w-full" />}>
          <AddRoomFormSections room={room} mode="update" />
        </Suspense>
      </div>
    </>
  );
}
