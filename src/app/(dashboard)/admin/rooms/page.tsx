import { BreadcrumbSetter } from "@/components/breadcrumb-setter";

const roomsBreadcrumb = [
  { label: "Rooms", href: "/admin/rooms" },
  { label: "Manage Rooms" },
];

export default function RoomsPage() {
  return (
    <>
      <BreadcrumbSetter items={roomsBreadcrumb} />

      <main className="flex flex-col grow p-4">
        <h1 className="text-2xl font-bold">Rooms</h1>
        <p>Manage rooms here.</p>
      </main>
    </>
  );
}
