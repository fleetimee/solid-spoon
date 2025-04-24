import { Metadata } from "next";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { RoomForm } from "@/features/rooms/components/room-form";

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

      <main className="flex flex-col grow p-4 md:p-8">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Add Room</h1>
          <p className="text-muted-foreground">
            Fill in the details below to add a new room.
          </p>
        </div>

        <RoomForm />
      </main>
    </>
  );
}
