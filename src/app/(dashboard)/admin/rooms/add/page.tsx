import { Suspense } from "react";
import { Metadata } from "next";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { RoomForm } from "@/features/rooms/components/room-form";
import { Skeleton } from "@/components/ui/skeleton";

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

      <main className="flex flex-col grow p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-2">Add Room</h1>
        <p className="text-muted-foreground mb-6">
          Fill in the details below to add a new room.
        </p>

        <Suspense fallback={<Skeleton className="h-10 w-full" />}>
          <RoomForm />
        </Suspense>
      </main>
    </>
  );
}
