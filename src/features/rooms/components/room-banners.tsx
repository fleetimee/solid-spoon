"use client";

import { Info, AlertTriangle } from "lucide-react";
import {
  Banner,
  BannerClose,
  BannerIcon,
  BannerTitle,
} from "@/components/ui/kibo-ui/banner";

interface RoomBannersProps {
  isLimitReached: boolean;
  pendingCount: number;
}

export function RoomBanners({
  isLimitReached,
  pendingCount,
}: RoomBannersProps) {
  return (
    <>
      {/* Reservation Limit Banner */}
      {isLimitReached && (
        <Banner
          visible={isLimitReached}
          className="bg-red-600 text-white border-0 shadow-lg"
        >
          <div className="flex items-center gap-3 flex-1">
            <BannerIcon
              icon={AlertTriangle}
              className="bg-white/20 border-white/30"
            />
            <div className="flex-1">
              <BannerTitle className="font-semibold text-white">
                Batas Reservasi Tercapai
              </BannerTitle>
              <p className="text-sm text-white/90 mt-1">
                Anda telah mencapai batas maksimum reservasi untuk ruangan ini
              </p>
            </div>
          </div>
          <BannerClose className="text-white hover:bg-white/20" />
        </Banner>
      )}

      {/* Pending Reservations Banner */}
      {pendingCount > 0 && (
        <Banner
          visible={pendingCount > 0}
          className="bg-blue-600 text-white border-0 shadow-lg"
        >
          <div className="flex items-center gap-3 flex-1">
            <BannerIcon icon={Info} className="bg-white/20 border-white/30" />
            <div className="flex-1">
              <BannerTitle className="font-semibold text-white">
                Reservasi Tertunda
              </BannerTitle>
              <p className="text-sm text-white/90 mt-1">
                💫 Anda memiliki {pendingCount} reservasi tertunda untuk ruangan
                ini
              </p>
            </div>
          </div>
          <BannerClose className="text-white hover:bg-white/20" />
        </Banner>
      )}
    </>
  );
}
