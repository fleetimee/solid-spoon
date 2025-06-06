"use client";

import { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { AlertCircle, Loader2, X, Calendar, Clock } from "lucide-react";
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
import { UserRoomReservation } from "@/features/reservations/api/getUserRoomReservations";
import { cancelReservation } from "@/features/reservations/api/cancelReservation";

interface CancelReservationDialogProps {
  reservation: UserRoomReservation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel?: () => void;
}

// Helper function to determine cancellation type and messaging
function getCancellationInfo(reservation: UserRoomReservation): {
  type: "pending" | "approved_eligible" | "approved_too_late";
  title: string;
  description: string;
  confirmationText: string;
} {
  const now = new Date();
  const reservationStartTime = new Date(reservation.startTime);
  const hoursUntilStart =
    (reservationStartTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (reservation.statusValue === "Pending") {
    return {
      type: "pending",
      title: "Batalkan Reservasi Menunggu",
      description:
        "Anda akan membatalkan reservasi menunggu persetujuan ini. Tindakan ini tidak dapat dibatalkan.",
      confirmationText: "Ketik judul reservasi untuk konfirmasi pembatalan:",
    };
  }

  if (reservation.statusValue === "Approved" && hoursUntilStart > 24) {
    return {
      type: "approved_eligible",
      title: "Batalkan Reservasi Disetujui",
      description: `Anda akan membatalkan reservasi yang telah disetujui ini. Karena masih lebih dari 24 jam (${Math.ceil(hoursUntilStart)} jam), Anda dapat membatalkannya sendiri. Tindakan ini tidak dapat dibatalkan.`,
      confirmationText: "Ketik judul reservasi untuk konfirmasi pembatalan:",
    };
  }

  // This should not happen in normal flow, but included for completeness
  return {
    type: "approved_too_late",
    title: "Tidak Dapat Membatalkan Reservasi",
    description: `Reservasi yang telah disetujui ini tidak dapat dibatalkan karena kurang dari 24 jam sebelum waktu mulai. Silakan hubungi administrator.`,
    confirmationText: "Reservasi ini tidak dapat dibatalkan.",
  };
}

export function CancelReservationDialog({
  reservation,
  open,
  onOpenChange,
  onCancel,
}: CancelReservationDialogProps) {
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

        toast.success("Reservasi berhasil dibatalkan", {
          description: `Reservasi Anda "${reservation.title}" telah dibatalkan.`,
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
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-900 border-2 border-red-200 dark:border-red-800">
        <DialogHeader className="relative">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold bg-gradient-to-r from-red-700 to-rose-700 dark:from-red-300 dark:to-rose-300 bg-clip-text text-transparent">
            <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-rose-500 text-white">
              <X className="h-5 w-5" />
            </div>
            {cancellationInfo.title}
          </DialogTitle>
          <DialogDescription className="text-gray-700 dark:text-gray-300">
            {cancellationInfo.description}
          </DialogDescription>
        </DialogHeader>

        <div className="relative space-y-6">
          {/* Reservation Details */}
          <div
            className={`p-4 rounded-lg border ${
              cancellationInfo.type === "pending"
                ? "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
                : "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800"
            }`}
          >
            <h3
              className={`font-semibold mb-3 ${
                cancellationInfo.type === "pending"
                  ? "text-red-700 dark:text-red-300"
                  : "text-amber-700 dark:text-amber-300"
              }`}
            >
              Detail Reservasi
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div
                  className={`p-1 rounded ${
                    cancellationInfo.type === "pending"
                      ? "bg-red-100 dark:bg-red-900"
                      : "bg-amber-100 dark:bg-amber-900"
                  }`}
                >
                  <Calendar
                    className={`h-3 w-3 ${
                      cancellationInfo.type === "pending"
                        ? "text-red-600 dark:text-red-400"
                        : "text-amber-600 dark:text-amber-400"
                    }`}
                  />
                </div>
                <span
                  className={`font-medium text-sm ${
                    cancellationInfo.type === "pending"
                      ? "text-red-700 dark:text-red-300"
                      : "text-amber-700 dark:text-amber-300"
                  }`}
                >
                  {reservation.title}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <Clock className="h-3 w-3" />
                <span>
                  {format(new Date(reservation.startTime), "PPp")} -{" "}
                  {format(new Date(reservation.endTime), "PPp")}
                </span>
              </div>
              <div
                className={`text-xs font-medium ${
                  cancellationInfo.type === "pending"
                    ? "text-red-600 dark:text-red-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              >
                Status: {reservation.statusValue}
                {cancellationInfo.type === "approved_eligible" && (
                  <span className="block mt-1">
                    ✅ Memenuhi syarat pembatalan mandiri ({">"}24 jam)
                  </span>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Confirmation Input */}
            <div className="space-y-3">
              <div className="space-y-2">
                <label
                  htmlFor="confirmTitle"
                  className="text-sm font-semibold bg-gradient-to-r from-red-700 to-rose-700 dark:from-red-300 dark:to-rose-300 bg-clip-text text-transparent"
                >
                  Konfirmasi Diperlukan
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {cancellationInfo.confirmationText}
                </p>
                <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                  <span className="font-semibold text-red-700 dark:text-red-300">
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
                    bg-white dark:bg-gray-900
                    border-2 border-red-200 dark:border-red-800
                    focus:border-red-400 dark:focus:border-red-500
                    focus:ring-2 focus:ring-red-500/20
                    hover:bg-gray-50 dark:hover:bg-gray-800
                    ${
                      confirmTitle && !isConfirmationValid
                        ? "border-red-500 focus:border-red-600 bg-red-50 dark:bg-red-950"
                        : ""
                    }
                    ${
                      confirmTitle && isConfirmationValid
                        ? "border-green-400 focus:border-green-500 bg-green-50 dark:bg-green-950"
                        : ""
                    }
                  `}
                  disabled={isPending}
                />
                {/* Validation Indicator */}
                {confirmTitle && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isConfirmationValid ? (
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-red-500 to-rose-500 flex items-center justify-center">
                        <X className="w-3 h-3 text-white" />
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
                className="relative overflow-hidden bg-red-50 dark:bg-red-950 border-2 border-red-200 dark:border-red-800"
              >
                <div className="relative flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <AlertDescription className="text-red-700 dark:text-red-300 font-medium">
                    {error}
                  </AlertDescription>
                </div>
              </Alert>
            )}

            {/* Status Message */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
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
        </div>

        <DialogFooter className="relative flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="flex-1 h-11 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:scale-[1.02] transition-all duration-300 font-medium"
          >
            Batal
          </Button>

          <Button
            variant="destructive"
            onClick={handleSubmit}
            className="flex-1 h-11 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 border-0 hover:scale-[1.02] transition-all duration-300 hover:shadow-lg font-medium"
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
                    <X className="h-4 w-4" />
                  </div>
                  <span>Batalkan Reservasi</span>
                </>
              )}
            </div>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
