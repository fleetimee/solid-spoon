import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Typography } from "@/components/ui/typography";
import { getRoomBySlug } from "@/features/rooms/api/getRooms"; // Import function to get room data
import { NewReservationForm } from "@/features/reservations/components/new-reservation-form"; // Import the client form component
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface NewReservationPageProps {
  params: Promise<{
    roomSlug: string;
  }>;
}

// Generate metadata dynamically based on the room
export async function generateMetadata(
  props: NewReservationPageProps
): Promise<Metadata> {
  const params = await props.params;
  const room = await getRoomBySlug(params.roomSlug);
  if (!room) {
    return {
      title: "Room Not Found",
    };
  }
  return {
    title: `New Reservation for ${room.name}`,
    description: `Book a reservation for the room: ${room.name}`,
  };
}

export default async function NewReservationPage(
  props: NewReservationPageProps
) {
  const params = await props.params;
  const { roomSlug } = params;

  // Check if there's a session and user
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  // Fetch room data on the server
  const room = await getRoomBySlug(roomSlug);

  // Handle room not found
  if (!room) {
    notFound();
  }

  // Set breadcrumbs dynamically
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Rooms" }, // Consider linking to a rooms overview page
    { label: room.name, href: `/v/${roomSlug}` }, // Link back to the room detail page
    { label: "New Reservation" },
  ];

  return (
    <>
      <BreadcrumbSetter items={breadcrumbItems} />
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Typography variant="h1">Create New Reservation</Typography>
        <Typography variant="default" className="text-muted-foreground mb-6">
          You are booking a reservation for the room:{" "}
          <span className="font-semibold">{room.name}</span>. Fill in the
          details below.
        </Typography>
        <div className="max-w-2xl">
          {/* Render the client component, passing the roomId and roomSlug */}
          <NewReservationForm roomId={room.id} roomSlug={roomSlug} />
        </div>
      </main>
    </>
  );
}
