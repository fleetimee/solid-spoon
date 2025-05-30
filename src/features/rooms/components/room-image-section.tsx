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
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Gallery
        </h2>
      </div>

      <div className="relative overflow-hidden rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        {room.images && room.images.length > 0 ? (
          <RoomImageGallery images={room.images} />
        ) : room.coverImage ? (
          <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden group">
            <Image
              src={room.coverImage}
              alt={room.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
        ) : (
          <div className="w-full h-[400px] md:h-[500px] bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="text-center space-y-3">
              <div className="text-4xl md:text-6xl opacity-30 text-gray-400">
                📷
              </div>
              <p className="text-muted-foreground text-lg">
                No images available
              </p>
              <p className="text-sm text-muted-foreground max-w-sm">
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
