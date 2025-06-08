import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { getRoomBySlug } from "@/features/rooms/api/getRooms";
import { AlertCircle, ArrowLeft, Trash2, DoorOpen } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DeleteRoomForm } from "@/features/rooms/components/room-delete-form";

interface DeleteRoomPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(
  props: DeleteRoomPageProps
): Promise<Metadata> {
  const params = await props.params;
  const { slug } = params;

  const room = await getRoomBySlug(slug);

  if (!room) {
    return {
      title: "Ruangan Tidak Ditemukan",
      description: "Ruangan yang diminta tidak dapat ditemukan",
    };
  }

  return {
    title: `Hapus ${room.name} | Kelola Ruangan`,
    description: `Hapus permanen ruangan "${room.name}"`,
  };
}

export default async function DeleteRoomPage(props: DeleteRoomPageProps) {
  const params = await props.params;
  const { slug } = params;
  const room = await getRoomBySlug(slug);

  if (!room) {
    notFound();
  }

  const roomBreadcrumb = [
    { label: "Ruangan", href: "#" },
    { label: "Kelola Ruangan", href: "/admin/rooms" },
    { label: room.name, href: `/admin/rooms/${slug}` },
    { label: "Hapus" },
  ];

  return (
    <>
      <BreadcrumbSetter items={roomBreadcrumb} />

      <main className="flex flex-col grow p-4 md:p-8 space-y-8">
        {/* Enhanced Delete Room Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-red-50/50 to-rose-50/50 dark:from-red-950/10 dark:to-rose-950/10 rounded-xl p-6 md:p-8 shadow-lg border-0 backdrop-blur-sm group hover:shadow-xl transition-all duration-300">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-400/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="relative">
            <div className="flex flex-col gap-6">
              {/* Back Button */}
              <Link
                href={`/admin/rooms/${slug}`}
                className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 w-fit"
              >
                <div className="p-1.5 rounded-lg bg-white/50 dark:bg-gray-800/50 group-hover:bg-gradient-to-r group-hover:from-violet-500 group-hover:to-purple-500 transition-all duration-300 backdrop-blur-sm">
                  <ArrowLeft className="h-3 w-3 group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  Back to room details
                </span>
              </Link>

              {/* Header Content */}
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <DoorOpen className="h-6 w-6 text-white" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent">
                    Delete Room
                  </h1>
                  <p className="text-muted-foreground">
                    You are about to permanently delete the room &quot;
                    <span className="font-semibold bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent">
                      {room.name}
                    </span>
                    &quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Glassmorphism Content Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-red-500 to-rose-500 rounded-full"></div>
            <h2 className="text-xl font-semibold">Deletion Confirmation</h2>
          </div>

          <div className="bg-gradient-to-br from-red-50/50 to-rose-50/50 dark:from-red-950/10 dark:to-rose-950/10 rounded-xl p-6 shadow-lg border-0 backdrop-blur-sm">
            {/* Modern Delete Confirmation Card */}
            <Card className="relative overflow-hidden border-2 border-red-200/50 dark:border-red-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-500/5"></div>

              <CardHeader className="relative border-b border-red-200/30 dark:border-red-800/30 bg-gradient-to-r from-red-50/80 to-rose-50/80 dark:from-red-950/30 dark:to-rose-950/30 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 shadow-lg">
                    <Trash2 className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-red-700 to-rose-700 dark:from-red-300 dark:to-rose-300 bg-clip-text text-transparent">
                    Delete Confirmation
                  </h2>
                </div>
              </CardHeader>

              <CardContent className="relative pt-6 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
                <div className="mb-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    To confirm deletion, please type the full name of the room:
                  </p>
                  <div className="p-4 bg-gradient-to-r from-red-50/80 to-rose-50/80 dark:from-red-950/30 dark:to-rose-950/30 rounded-lg border border-red-200/50 dark:border-red-800/50 backdrop-blur-sm">
                    <span className="font-semibold text-red-700 dark:text-red-300 text-lg">
                      {room.name}
                    </span>
                  </div>
                </div>

                <DeleteRoomForm room={room} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
