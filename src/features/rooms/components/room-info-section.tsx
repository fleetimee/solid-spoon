import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  MapPin,
  Calendar,
  User,
  Pencil,
  Building2,
  Star,
  Wifi,
} from "lucide-react";
import { format } from "date-fns";
import { FacilityBadge } from "./facility-badge";
import { Room } from "../types/room";

interface RoomInfoSectionProps {
  room: Room;
}

export function RoomInfoSection({ room }: RoomInfoSectionProps) {
  const facilities =
    typeof room.facilities === "string" && room.facilities.startsWith("[")
      ? JSON.parse(room.facilities)
      : room.facilities
        ? [room.facilities]
        : [];

  const infoCards = [
    {
      title: "Informasi Dasar",
      items: [
        {
          icon: Users,
          label: "Kapasitas",
          value: `${room.capacity} orang`,
        },
        {
          icon: MapPin,
          label: "Lokasi",
          value: room.location || "Lokasi tidak ditentukan",
        },
        {
          icon: Building2,
          label: "Status",
          value: room.isActive ? "Aktif" : "Tidak Aktif",
          badge: true,
          badgeVariant: room.isActive ? "default" : "destructive",
        },
      ],
    },
    {
      title: "Riwayat Ruangan",
      items: [
        {
          icon: User,
          label: "Dibuat oleh",
          value: room.createdByName || "Tidak diketahui",
        },
        {
          icon: Calendar,
          label: "Dibuat",
          value: format(new Date(room.createdAt), "MMM d, yyyy"),
        },
        ...(room.updatedBy
          ? [
              {
                icon: Pencil,
                label: "Diperbarui oleh",
                value: room.updatedByName || "Tidak diketahui",
              },
              {
                icon: Calendar,
                label: "Terakhir diperbarui",
                value: format(new Date(room.updatedAt), "MMM d, yyyy"),
              },
            ]
          : []),
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="w-1 h-6 bg-gradient-to-b from-violet-400 to-purple-500 rounded-full"></div>
        <h2 className="text-xl font-semibold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
          Informasi Ruangan
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {infoCards.map((card, cardIndex) => (
          <Card
            key={cardIndex}
            className="group relative overflow-hidden bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-400/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <CardHeader className="relative">
              <CardTitle className="text-lg bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                {card.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 relative">
              {card.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex items-center gap-4 p-3 rounded-lg bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-200 border border-violet-100/50 dark:border-violet-800/30 hover:border-violet-200 dark:hover:border-violet-700 hover:scale-[1.02] backdrop-blur-sm"
                >
                  <div className="p-2 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 text-white shadow-md group-hover:scale-110 transition-transform duration-200">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-violet-600/70 dark:text-violet-400/70">
                      {item.label}
                    </p>
                    <div className="font-semibold flex items-center gap-2">
                      {item.badge ? (
                        <Badge
                          variant={item.badgeVariant as any}
                          className="text-xs hover:scale-105 transition-transform duration-200"
                        >
                          {item.value}
                        </Badge>
                      ) : (
                        <span className="text-gray-900 dark:text-gray-100">
                          {item.value}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Facilities Section */}
      <Card className="group relative overflow-hidden bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-400/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <CardHeader className="relative">
          <CardTitle className="text-lg bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
            Fasilitas & Amenitas
          </CardTitle>
        </CardHeader>

        <CardContent className="relative">
          {facilities.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {facilities.map((facility: string, index: number) => (
                <div
                  key={index}
                  className="transform hover:scale-105 transition-transform duration-200"
                >
                  <FacilityBadge name={facility} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl text-white">🏗️</span>
                </div>
                <p className="text-violet-700 dark:text-violet-300 font-medium">
                  Tidak ada fasilitas terdaftar
                </p>
                <p className="text-sm text-violet-600/70 dark:text-violet-400/70 max-w-sm mx-auto">
                  Tambahkan fasilitas untuk membantu pengguna memahami amenitas
                  apa yang tersedia di ruangan ini
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
