"use client";

import { useState } from "react";
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
  // Local state to manage banner visibility
  const [showLimitBanner, setShowLimitBanner] = useState(true);
  const [showPendingBanner, setShowPendingBanner] = useState(true);

  return (
    <>
      {/* Reservation Limit Banner */}
      {isLimitReached && showLimitBanner && (
        <Banner
          visible={isLimitReached && showLimitBanner}
          onClose={() => setShowLimitBanner(false)}
          className="bg-red-600 text-white border-0 shadow-lg"
        >
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <BannerIcon
              icon={AlertTriangle}
              className="bg-white/20 border-white/30 mt-0.5 sm:mt-0"
            />
            <div className="flex-1 min-w-0">
              <BannerTitle className="font-semibold text-white text-sm sm:text-base">
                Batas Reservasi Tercapai
              </BannerTitle>
              <p className="text-xs sm:text-sm text-white/90 mt-0.5 sm:mt-1 leading-tight">
                Anda telah mencapai batas maksimum reservasi untuk ruangan ini
              </p>
            </div>
          </div>
          <BannerClose />
        </Banner>
      )}

      {/* Pending Reservations Banner */}
      {pendingCount > 0 && showPendingBanner && (
        <Banner
          visible={pendingCount > 0 && showPendingBanner}
          onClose={() => setShowPendingBanner(false)}
          className="bg-blue-600 text-white border-0 shadow-lg"
        >
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <BannerIcon
              icon={Info}
              className="bg-white/20 border-white/30 mt-0.5 sm:mt-0"
            />
            <div className="flex-1 min-w-0">
              <BannerTitle className="font-semibold text-white text-sm sm:text-base">
                Reservasi Tertunda
              </BannerTitle>
              <p className="text-xs sm:text-sm text-white/90 mt-0.5 sm:mt-1 leading-tight">
                💫 Anda memiliki {pendingCount} reservasi tertunda untuk ruangan
                ini
              </p>
            </div>
          </div>
          <BannerClose />
        </Banner>
      )}
    </>
  );
}
