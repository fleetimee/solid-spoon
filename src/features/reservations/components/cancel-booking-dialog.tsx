"use client";

import { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { AlertCircle, Loader2, X, Calendar, Clock, Ban } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserReservation } from "@/features/reservations/api/getUserReservations";
import { cancelReservation } from "@/features/reservations/api/cancelReservation";

interface CancelBookingDialogProps {
  reservation: UserReservation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel?: () => void;
}

// Helper function to determine cancellation type and messaging
function getCancellationInfo(reservation: UserReservation): {
  type: "pending" | "approved_eligible" | "approved_too_late";
  title: string;
  description: string;
  confirmationText: string;
  canCancel: boolean;
} {
  const now = new Date();
  const reservationStartTime = new Date(reservation.startTime);
  const hoursUntilStart =
    (reservationStartTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (reservation.status?.toLowerCase() === "pending") {
    return {
      type: "pending",
      title: "🚫 Batalkan Reservasi Menunggu",
      description:
        "Anda akan membatalkan reservasi yang sedang menunggu persetujuan ini. Tindakan ini tidak dapat dibatalkan dan reservasi akan dihapus dari sistem.",
      confirmationText: "Ketik judul reservasi untuk konfirmasi pembatalan:",
      canCancel: true,
    };
  }

  if (
    reservation.status?.toLowerCase() === "approved" &&
    hoursUntilStart > 24
  ) {
    return {
      type: "approved_eligible",
      title: "⚠️ Batalkan Reservasi Disetujui",
      description: `Anda akan membatalkan reservasi yang telah disetujui ini. Karena masih lebih dari 24 jam (${Math.ceil(hoursUntilStart)} jam), Anda dapat membatalkannya sendiri. Tindakan ini tidak dapat dibatalkan.`,
      confirmationText: "Ketik judul reservasi untuk konfirmasi pembatalan:",
      canCancel: true,
    };
  }

  // This should not happen in normal flow, but included for completeness
  return {
    type: "approved_too_late",
    title: "❌ Tidak Dapat Membatalkan Reservasi",
    description: `Reservasi yang telah disetujui ini tidak dapat dibatalkan karena kurang dari 24 jam sebelum waktu mulai. Silakan hubungi administrator untuk bantuan lebih lanjut.`,
    confirmationText: "Reservasi ini tidak dapat dibatalkan secara mandiri.",
    canCancel: false,
  };
}

export function CancelBookingDialog({
  reservation,
  open,
  onOpenChange,
  onCancel,
}: CancelBookingDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [confirmTitle, setConfirmTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isConfirmationValid, setIsConfirmationValid] = useState(false);

  useEffect(() => {
    if (reservation) {
      setIsConfirmationValid(confirmTitle === reservation.title);
    }
  }, [confirmTitle, reservation]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setConfirmTitle("");
      setError(null);
      setIsConfirmationValid(false);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!reservation) {
      setError("Tidak ada reservasi yang dipilih");
      return;
    }

    if (confirmTitle !== reservation.title) {
      setError("Konfirmasi judul reservasi tidak cocok");
      return;
    }

    startTransition(async () => {
      try {
        const result = await cancelReservation(reservation.id.toString());

        if (!result.success) {
          setError(result.error || "Gagal membatalkan reservasi");
          toast.error("Gagal membatalkan reservasi", {
            description: result.error || "Terjadi kesalahan yang tidak terduga",
          });
          return;
        }

        toast.success("🎉 Reservasi berhasil dibatalkan", {
          description: `Reservasi "${reservation.title}" di ${reservation.roomName} telah dibatalkan.`,
        });

        onOpenChange(false);
        onCancel?.();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Gagal membatalkan reservasi";
        setError(errorMessage);
        toast.error("Gagal membatalkan reservasi", {
          description: errorMessage,
        });
      }
    });
  };

  if (!reservation) {
    return null;
  }

  const cancellationInfo = getCancellationInfo(reservation);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-2 border-red-200/50 dark:border-red-800/50 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-rose-50/30 to-orange-50/50 dark:from-red-950/20 dark:via-rose-950/10 dark:to-orange-950/20 rounded-lg pointer-events-none" />

        <div className="relative">
          <DialogHeader className="pb-6">
            <DialogTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 text-white shadow-lg">
                <Ban className="h-5 w-5" />
              </div>
              <span className="bg-gradient-to-r from-red-700 to-rose-700 dark:from-red-300 dark:to-rose-300 bg-clip-text text-transparent">
                {cancellationInfo.title}
              </span>
            </DialogTitle>
            <DialogDescription className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
              {cancellationInfo.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Reservation Details */}
            <div
              className={`p-4 rounded-xl border-2 backdrop-blur-sm ${
                cancellationInfo.type === "pending"
                  ? "bg-red-50/80 dark:bg-red-950/40 border-red-200/60 dark:border-red-800/60"
                  : cancellationInfo.canCancel
                    ? "bg-amber-50/80 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-800/60"
                    : "bg-gray-50/80 dark:bg-gray-950/40 border-gray-200/60 dark:border-gray-800/60"
              }`}
            >
              <h3
                className={`font-bold mb-3 text-base ${
                  cancellationInfo.type === "pending"
                    ? "text-red-700 dark:text-red-300"
                    : cancellationInfo.canCancel
                      ? "text-amber-700 dark:text-amber-300"
                      : "text-gray-700 dark:text-gray-300"
                }`}
              >
                📋 Detail Reservasi
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      cancellationInfo.type === "pending"
                        ? "bg-red-100 dark:bg-red-900/50"
                        : cancellationInfo.canCancel
                          ? "bg-amber-100 dark:bg-amber-900/50"
                          : "bg-gray-100 dark:bg-gray-900/50"
                    }`}
                  >
                    <Calendar
                      className={`h-4 w-4 ${
                        cancellationInfo.type === "pending"
                          ? "text-red-600 dark:text-red-400"
                          : cancellationInfo.canCancel
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-gray-600 dark:text-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {reservation.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {reservation.roomName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>
                    {format(new Date(reservation.startTime), "PPp")} -{" "}
                    {format(new Date(reservation.endTime), "PPp")}
                  </span>
                </div>
                <div
                  className={`text-sm font-semibold ${
                    cancellationInfo.type === "pending"
                      ? "text-red-600 dark:text-red-400"
                      : cancellationInfo.canCancel
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Status: {reservation.status}
                  {cancellationInfo.type === "approved_eligible" && (
                    <span className="block mt-1 text-green-600 dark:text-green-400">
                      ✅ Memenuhi syarat pembatalan mandiri ({">"}24 jam)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {cancellationInfo.canCancel && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Confirmation Input */}
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label
                      htmlFor="confirmTitle"
                      className="text-sm font-bold bg-gradient-to-r from-red-700 to-rose-700 dark:from-red-300 dark:to-rose-300 bg-clip-text text-transparent"
                    >
                      🔒 Konfirmasi Diperlukan
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {cancellationInfo.confirmationText}
                    </p>
                    <div className="p-3 bg-red-50/80 dark:bg-red-950/40 rounded-lg border-2 border-red-200/60 dark:border-red-800/60 backdrop-blur-sm">
                      <span className="font-bold text-red-700 dark:text-red-300">
                        {reservation.title}
                      </span>
                    </div>
                  </div>

                  <div className="relative">
                    <Input
                      id="confirmTitle"
                      name="confirmTitle"
                      type="text"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                      placeholder="Ketik judul reservasi di sini"
                      value={confirmTitle}
                      onChange={(e) => setConfirmTitle(e.target.value)}
                      className={`
                        h-12 px-4 text-base transition-all duration-300
                        bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm
                        border-2 border-red-200/60 dark:border-red-800/60
                        focus:border-red-400 dark:focus:border-red-500
                        focus:ring-2 focus:ring-red-500/20
                        hover:bg-white dark:hover:bg-gray-800
                        ${
                          confirmTitle && !isConfirmationValid
                            ? "border-red-500 focus:border-red-600 bg-red-50/90 dark:bg-red-950/40"
                            : ""
                        }
                        ${
                          confirmTitle && isConfirmationValid
                            ? "border-green-400 focus:border-green-500 bg-green-50/90 dark:bg-green-950/40"
                            : ""
                        }
                      `}
                      disabled={isPending}
                    />
                    {/* Validation Indicator */}
                    {confirmTitle && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {isConfirmationValid ? (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                            <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-rose-500 flex items-center justify-center shadow-lg">
                            <X className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Error Alert */}
                {error && (
                  <Alert
                    variant="destructive"
                    className="bg-red-50/80 dark:bg-red-950/40 border-2 border-red-200/60 dark:border-red-800/60 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/50">
                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <AlertDescription className="text-red-700 dark:text-red-300 font-medium">
                        {error}
                      </AlertDescription>
                    </div>
                  </Alert>
                )}

                {/* Status Message */}
                <div className="bg-gray-50/80 dark:bg-gray-900/40 rounded-lg p-3 border-2 border-gray-200/60 dark:border-gray-700/60 backdrop-blur-sm">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {!isConfirmationValid && confirmTitle.length > 0 ? (
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        ⚠️ Teks yang Anda masukkan tidak sesuai dengan judul
                        reservasi.
                      </span>
                    ) : (
                      <span>
                        ℹ️ Anda harus mengetik judul reservasi yang tepat untuk
                        konfirmasi pembatalan.
                      </span>
                    )}
                  </p>
                </div>
              </form>
            )}
          </div>

          <DialogFooter className="flex gap-3 pt-6">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="flex-1 h-11 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-gray-200/60 dark:border-gray-700/60 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:scale-[1.02] transition-all duration-300 font-medium"
            >
              Tutup
            </Button>

            {cancellationInfo.canCancel && (
              <Button
                variant="destructive"
                onClick={handleSubmit}
                className="flex-1 h-11 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 border-0 hover:scale-[1.02] transition-all duration-300 hover:shadow-xl font-medium"
                disabled={!isConfirmationValid || isPending}
              >
                <div className="flex items-center gap-2 text-white">
                  {isPending ? (
                    <>
                      <div className="p-1 rounded-md bg-white/30">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                      <span>Membatalkan...</span>
                    </>
                  ) : (
                    <>
                      <div className="p-1 rounded-md bg-white/30">
                        <Ban className="h-4 w-4" />
                      </div>
                      <span>Batalkan Reservasi</span>
                    </>
                  )}
                </div>
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
