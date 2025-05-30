import { Metadata } from "next";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { AddRoomHeader } from "@/features/rooms/components/add-room-header";
import { AddRoomFormSections } from "@/features/rooms/components/add-room-form-sections";

export const metadata: Metadata = {
  title: "Add New Room | Room Management",
  description: "Create a new room in the room reservation system",
  openGraph: {
    title: "Add New Room | Room Management",
    description: "Create and configure a new room with details and facilities",
    type: "website",
  },
};

const addRoomBreadcrumb = [
  { label: "Rooms", href: "#" },
  { label: "Manage Rooms", href: "/admin/rooms" },
  { label: "Add Room" },
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
