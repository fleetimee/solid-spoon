import { BreadcrumbSetter } from "@/components/breadcrumb-setter";

export default function AddRoomsPage() {
  const roomsBreadcrumb = [
    { label: "Rooms" },
    { label: "Manage Rooms", href: "/admin/rooms" },
    { label: "Add Room" },
  ];
  return (
    <>
      <BreadcrumbSetter items={roomsBreadcrumb} />

      <main className="flex flex-col grow p-4">
        <h1 className="text-2xl font-bold">Add Room</h1>
        <p>Fill in the details below to add a new room.</p>
      </main>
    </>
  );
}
