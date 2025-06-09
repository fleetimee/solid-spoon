import { Typography } from "@/components/ui/typography";
import {
  ListChecks,
  Users,
  Clock,
  Star,
  Edit,
  Trash2,
  DoorOpen,
} from "lucide-react";
import { Room } from "../types/room";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface RoomDetailHeaderProps {
  room: Room;
  className?: string;
}

export function RoomDetailHeader({
  room,
  className = "",
}: RoomDetailHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/10 dark:to-purple-950/10 rounded-xl p-6 md:p-8 shadow-lg border-0 backdrop-blur-sm group hover:shadow-xl transition-all duration-300">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-400/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <DoorOpen className="h-6 w-6 text-white" />
              </div>
              <div className="space-y-2">
                <Typography
                  variant="h1"
                  as="h1"
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent"
                >
                  {room.name}
                </Typography>

                {/* Quick Stats */}
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-violet-100/50 dark:bg-violet-900/30 border border-violet-200/50 dark:border-violet-700/50">
                    <Users className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                    <span className="font-medium">{room.capacity} orang</span>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100/50 dark:bg-green-900/30 border border-green-200/50 dark:border-green-700/50">
                    <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="font-medium">Tersedia 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 shrink-0">
            <Button
              asChild
              variant="outline"
              size="default"
              className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950 border-violet-200 dark:border-violet-700 hover:from-violet-100 hover:to-purple-100 dark:hover:from-violet-900 dark:hover:to-purple-900 transition-all duration-200"
            >
              <Link href={`/admin/rooms/${room.slug}/update`}>
                <Edit className="h-4 w-4 mr-2" />
                Perbarui
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="default"
              className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950 border-red-200 dark:border-red-700 hover:from-red-100 hover:to-rose-100 dark:hover:from-red-900 dark:hover:to-rose-900 text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200 transition-all duration-200"
            >
              <Link href={`/admin/rooms/${room.slug}/delete`}>
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6 mt-6">
        {/* Description Card */}
        <div className="bg-gradient-to-br from-slate-50/50 to-gray-50/50 dark:from-slate-900/30 dark:to-gray-900/30 rounded-lg border border-slate-200/60 dark:border-slate-700/60 p-4 md:p-6 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
          <div className="space-y-3">
            <Typography
              variant="h4"
              as="h4"
              className="flex items-center font-semibold text-sm text-slate-700 dark:text-slate-300"
            >
              <DoorOpen className="h-4 w-4 mr-2 text-slate-500 dark:text-slate-400" />
              Deskripsi Ruangan
            </Typography>
            <Typography
              variant="default"
              className="text-muted-foreground leading-relaxed text-sm md:text-base px-1 py-2"
            >
              {room.description || "Tidak ada deskripsi tersedia."}
            </Typography>
          </div>
        </div>

        <div className="space-y-3">
          <Typography
            variant="h3"
            as="h3"
            className="flex items-center font-semibold text-base"
          >
            <ListChecks className="h-4 w-4 mr-2 text-primary" />
            Sorotan Singkat
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">
                Kapasitas {room.capacity} Orang
              </span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/5 border border-green-500/20">
              <Clock className="h-4 w-4 text-green-500" />
              <span className="text-xs font-medium">Tersedia 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
