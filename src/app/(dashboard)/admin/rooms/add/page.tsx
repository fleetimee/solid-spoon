import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Card } from "@/components/ui/card";
import { RoomForm } from "@/features/rooms/components/room-form";

export default function AddRoomsPage() {
  const roomsBreadcrumb = [
    { label: "Rooms" },
    { label: "Manage Rooms", href: "/admin/rooms" },
    { label: "Add Room" },
  ];
  return (
    <>
      <BreadcrumbSetter items={roomsBreadcrumb} />

      <main className="flex flex-col grow p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-2">Add Room</h1>
        <p className="text-muted-foreground mb-6">
          Fill in the details below to add a new room.
        </p>

        <Card className="p-4 md:p-6">
          <RoomForm />
        </Card>
      </main>
    </>
  );
}
