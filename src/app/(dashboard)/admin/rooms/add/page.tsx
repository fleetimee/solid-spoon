import { Metadata } from "next";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { AddRoomHeader } from "@/features/rooms/components/add-room-header";
import { AddRoomFormSections } from "@/features/rooms/components/add-room-form-sections";

export const metadata: Metadata = {
  title: "Tambah Ruangan Baru | Manajemen Ruangan",
  description: "Buat ruangan baru dalam sistem reservasi ruangan",
  openGraph: {
    title: "Tambah Ruangan Baru | Manajemen Ruangan",
    description:
      "Buat dan konfigurasi ruangan baru dengan detail dan fasilitas",
    type: "website",
  },
};

const addRoomBreadcrumb = [
  { label: "Ruangan", href: "#" },
  { label: "Kelola Ruangan", href: "/admin/rooms" },
  { label: "Tambah Ruangan" },
];

export default function AddRoomsPage() {
  return (
    <>
      <BreadcrumbSetter items={addRoomBreadcrumb} />

      <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
        <AddRoomHeader />

        <AddRoomFormSections />
      </div>
    </>
  );
}
