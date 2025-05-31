import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Typography } from "@/components/ui/typography";
import { getRoomBySlug } from "@/features/rooms/api/getRooms"; // Import function to get room data
import { NewReservationForm } from "@/features/reservations/components/new-reservation-form"; // Import the client form component
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getPendingReservationCount } from "@/features/reservations/api/getPendingReservationCount";
import { getReservationLimit } from "@/features/application/api/getReservationLimit";
import { DashboardHeader } from "@/features/admin/components/dashboard-header";
import { CalendarPlus } from "lucide-react";

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

  // ADDED: Check reservation limit
  const userId = session.user.id; // Assuming session.user.id exists based on prior check
  const roomId = room.id;
  const [pendingCount, reservationLimit] = await Promise.all([
    getPendingReservationCount(userId, roomId),
    getReservationLimit(),
  ]);

  if (pendingCount >= reservationLimit) {
    redirect("/");
  }

  // Set breadcrumbs dynamically
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Rooms", href: "/rooms" }, // Link to the rooms overview page
    { label: room.name, href: `/v/${roomSlug}` }, // Link back to the room detail page
    { label: "New Reservation" },
  ];

  return (
    <>
      <BreadcrumbSetter items={breadcrumbItems} />
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <DashboardHeader
            title="Create New Reservation"
            description={`You are booking a reservation for the room: ${room.name}. Fill in the details below.`}
            icon={CalendarPlus}
          />
        </div>
        <div className="max-w-2xl">
          {/* Render the client component, passing the roomId and roomSlug */}
          <NewReservationForm roomId={room.id} roomSlug={roomSlug} />
        </div>
      </main>
    </>
  );
}
