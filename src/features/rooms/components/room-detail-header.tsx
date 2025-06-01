import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, MapPin, Users, DoorOpen } from "lucide-react";
import { Room } from "../types/room";

interface RoomDetailHeaderProps {
  room: Room;
}

export function RoomDetailHeader({ room }: RoomDetailHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/10 dark:to-purple-950/10 rounded-xl p-6 md:p-8 shadow-lg border-0 backdrop-blur-sm group hover:shadow-xl transition-all duration-300">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-400/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4">
            {/* Room Icon and Name */}
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <DoorOpen className="h-6 w-6 text-white" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                  {room.name}
                </h1>

                {/* Location and Capacity Info */}
                <div className="flex flex-wrap items-center gap-3">
                  <Badge
                    variant="secondary"
                    className="px-3 py-1.5 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 text-violet-700 dark:text-violet-300 border-0 hover:scale-105 transition-transform duration-200"
                  >
                    <MapPin className="h-3 w-3 mr-1.5" />
                    {room.location || "Location not specified"}
                  </Badge>

                  <Badge
                    variant="secondary"
                    className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 text-purple-700 dark:text-purple-300 border-0 hover:scale-105 transition-transform duration-200"
                  >
                    <Users className="h-3 w-3 mr-1.5" />
                    {room.capacity} people
                  </Badge>

                  <Badge
                    variant={room.isActive ? "default" : "destructive"}
                    className={`px-3 py-1.5 hover:scale-105 transition-transform duration-200 ${
                      room.isActive
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        : ""
                    }`}
                  >
                    {room.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Description */}
            {room.description && (
              <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-4 backdrop-blur-sm border border-violet-100/50 dark:border-violet-800/30">
                <p className="text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed">
                  {room.description}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 shrink-0">
            <Button
              variant="outline"
              className="group relative overflow-hidden flex items-center gap-2 bg-gradient-to-r from-white/80 to-violet-50/80 dark:from-gray-800/80 dark:to-violet-900/30 border-2 border-violet-200/50 dark:border-violet-700/50 text-violet-700 dark:text-violet-300 hover:border-violet-400 dark:hover:border-violet-500 hover:scale-105 transition-all duration-300 hover:shadow-xl backdrop-blur-sm font-medium"
              asChild
            >
              <Link href={`/admin/rooms/${room.slug}/update`}>
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                  <div className="p-1 rounded-md bg-violet-100 dark:bg-violet-800/50 group-hover:bg-white/20 transition-colors duration-300">
                    <Edit className="h-4 w-4" />
                  </div>
                  <span>Edit Room</span>
                </div>
              </Link>
            </Button>

            <Button
              variant="destructive"
              className="group relative overflow-hidden flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 border-0 hover:scale-105 transition-all duration-300 hover:shadow-xl font-medium"
              asChild
            >
              <Link href={`/admin/rooms/${room.slug}/delete`}>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-2 text-white">
                  <div className="p-1 rounded-md bg-white/20 group-hover:bg-white/30 transition-colors duration-300">
                    <Trash2 className="h-4 w-4" />
                  </div>
                  <span>Delete Room</span>
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
