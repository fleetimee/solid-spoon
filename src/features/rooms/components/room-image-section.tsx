import Image from "next/image";
import { RoomImageGallery } from "./room-image-gallery";
import { Room } from "../types/room";

interface RoomImageSectionProps {
  room: Room;
}

export function RoomImageSection({ room }: RoomImageSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-1 h-6 bg-gradient-to-b from-violet-400 to-purple-500 rounded-full"></div>
        <h2 className="text-xl font-semibold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
          Gallery
        </h2>
      </div>

      <div className="relative overflow-hidden rounded-xl shadow-lg border-0 bg-gradient-to-br from-violet-50/20 to-purple-50/20 dark:from-violet-950/20 dark:to-purple-950/20 p-2 backdrop-blur-sm">
        {room.images && room.images.length > 0 ? (
          <div className="rounded-lg overflow-hidden">
            <RoomImageGallery images={room.images} />
          </div>
        ) : room.coverImage ? (
          <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden group">
            <Image
              src={room.coverImage}
              alt={room.name}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-110"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-violet-900/20 via-transparent to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ) : (
          <div className="w-full h-[400px] md:h-[500px] bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/30 dark:to-purple-950/30 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-violet-200/50 dark:border-violet-700/50 backdrop-blur-sm">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl text-white">📷</span>
              </div>
              <p className="text-violet-700 dark:text-violet-300 text-lg font-medium">
                No images available
              </p>
              <p className="text-sm text-violet-600/70 dark:text-violet-400/70 max-w-sm">
                Add some photos to showcase this room&apos;s features and
                amenities
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
