import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Typography } from "@/components/ui/typography";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getRoomBySlug } from "@/features/rooms/api/getRooms"; // Import function to get room data
import { NewReservationForm } from "@/features/reservations/components/new-reservation-form"; // Import the client form component
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getPendingReservationCount } from "@/features/reservations/api/getPendingReservationCount";
import { getReservationLimit } from "@/features/application/api/getReservationLimit";
import { getApprovedRoomReservations } from "@/features/reservations/api/getApprovedRoomReservations";
import { CalendarPlus, Sparkles, Clock, MapPin } from "lucide-react";

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

  // ADDED: Check reservation limit and fetch approved reservations
  const userId = session.user.id; // Assuming session.user.id exists based on prior check
  const roomId = room.id;
  const [pendingCount, reservationLimit, approvedReservations] =
    await Promise.all([
      getPendingReservationCount(userId, roomId),
      getReservationLimit(),
      getApprovedRoomReservations(roomId),
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
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-violet-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
        {/* Hero Section with Modern Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 dark:from-violet-800 dark:via-purple-800 dark:to-pink-800">
          <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>

          <main className="relative max-w-screen-xl mx-auto px-6 py-12">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-sm border border-white/30 text-white">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Pesan Ruangan Sempurna Anda
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  Reservasi
                  <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    {" "}
                    {room.name}
                  </span>
                </h1>
                <Typography
                  variant="lead"
                  className="text-white/90 max-w-2xl mx-auto"
                >
                  Anda hanya beberapa klik lagi dari mendapatkan ruangan ideal
                  Anda. Mari kita wujudkan! ✨
                </Typography>
              </div>

              {/* Room Quick Info */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-white/80">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">
                    {room.location || "Lokasi Premium"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Tersedia 24/7</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <CalendarPlus className="h-4 w-4" />
                  <span className="text-sm">Pemesanan Instan</span>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Form Section */}
        <main className="max-w-screen-xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Card */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-2xl bg-white/70 dark:bg-card/70 backdrop-blur-sm">
                <CardHeader className="space-y-1 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 text-white">
                      <CalendarPlus className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                        Detail Reservasi
                      </CardTitle>
                      <CardDescription className="text-base">
                        Isi formulir di bawah untuk memesan ruangan Anda
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <NewReservationForm
                    roomId={room.id}
                    roomSlug={roomSlug}
                    approvedReservations={approvedReservations}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Info Sidebar */}
            <div className="space-y-6">
              {/* Room Info Card */}
              <Card className="border-0 shadow-lg bg-white/70 dark:bg-card/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-violet-600 dark:text-violet-400">
                    {room.name}
                  </CardTitle>
                  <CardDescription>
                    Anda sedang memesan ruangan yang luar biasa ini
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {room.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {room.description}
                    </p>
                  )}

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                        {room.capacity || "N/A"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Kapasitas
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        24/7
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Tersedia
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tips Card */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-orange-600 dark:text-orange-400 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Tips Pro
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-muted-foreground">
                      Pesan lebih awal untuk ketersediaan terbaik
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-muted-foreground">
                      Tambahkan judul yang jelas untuk membantu mengidentifikasi
                      pemesanan Anda
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-muted-foreground">
                      Periksa email Anda untuk detail konfirmasi
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
