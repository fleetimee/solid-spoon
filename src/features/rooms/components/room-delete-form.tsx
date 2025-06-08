"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertCircle, Loader2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { deleteRoomAction } from "../api/deleteRoom";
import { Room } from "../types/room";

interface DeleteRoomFormProps {
  room: Room;
}

export function DeleteRoomForm({ room }: DeleteRoomFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmName, setConfirmName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isConfirmationValid, setIsConfirmationValid] = useState(false);

  useEffect(() => {
    setIsConfirmationValid(confirmName === room.name);
  }, [confirmName, room.name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (confirmName !== room.name) {
      setError("Konfirmasi nama ruangan tidak cocok");
      return;
    }

    const formData = new FormData();
    formData.append("roomName", room.name);
    formData.append("confirmName", confirmName);

    startTransition(async () => {
      const result = await deleteRoomAction(room.id, formData);

      if (result.success) {
        toast.success("Ruangan berhasil dihapus", {
          description: `${room.name} telah dihapus dari sistem.`,
        });
        router.push("/admin/rooms");
        router.refresh();
      } else {
        setError(result.error || result.message);
        toast.error("Gagal menghapus ruangan", {
          description: result.message,
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Enhanced Input Section */}
        <div className="space-y-3">
          <label
            htmlFor="confirmName"
            className="text-sm font-semibold bg-gradient-to-r from-red-700 to-rose-700 dark:from-red-300 dark:to-rose-300 bg-clip-text text-transparent"
          >
            Konfirmasi Diperlukan
          </label>
          <div className="relative">
            <Input
              id="confirmName"
              name="confirmName"
              type="text"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              placeholder="Ketik nama ruangan di sini"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              className={`
                h-12 px-4 text-base transition-all duration-300 backdrop-blur-sm
                bg-white/50 dark:bg-gray-900/50
                border-2 border-red-200/50 dark:border-red-800/50
                focus:border-red-400 dark:focus:border-red-500
                focus:ring-2 focus:ring-red-500/20
                hover:bg-white/70 dark:hover:bg-gray-900/70
                ${
                  confirmName && !isConfirmationValid
                    ? "border-red-500 focus:border-red-600 bg-red-50/50 dark:bg-red-950/20"
                    : ""
                }
                ${
                  confirmName && isConfirmationValid
                    ? "border-green-400 focus:border-green-500 bg-green-50/50 dark:bg-green-950/20"
                    : ""
                }
              `}
              disabled={isPending}
            />
            {/* Validation Indicator */}
            {confirmName && (
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

        {/* Enhanced Error Alert */}
        {error && (
          <Alert
            variant="destructive"
            className="relative overflow-hidden bg-gradient-to-br from-red-50/80 to-rose-50/80 dark:from-red-950/20 dark:to-rose-950/20 border-2 border-red-200/50 dark:border-red-800/50 backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-500/5"></div>
            <div className="relative flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-red-100/50 dark:bg-red-900/30 backdrop-blur-sm">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <AlertDescription className="text-red-700 dark:text-red-300 font-medium">
                {error}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Enhanced Action Buttons */}
        <div className="flex gap-4 items-center pt-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.back()}
            disabled={isPending}
            className="group relative overflow-hidden flex-1 h-12 bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 border-2 border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:scale-[1.02] transition-all duration-300 hover:shadow-lg backdrop-blur-sm font-medium"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative group-hover:text-white transition-colors duration-300">
              Batal
            </span>
          </Button>

          <Button
            variant="destructive"
            type="submit"
            className="group relative overflow-hidden flex-1 h-12 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 border-0 hover:scale-[1.02] transition-all duration-300 hover:shadow-xl font-medium"
            disabled={!isConfirmationValid || isPending}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-2 text-white">
              {isPending ? (
                <>
                  <div className="p-1 rounded-md bg-white/20">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                  <span>Menghapus...</span>
                </>
              ) : (
                <>
                  <div className="p-1 rounded-md bg-white/20 group-hover:bg-white/30 transition-colors duration-300">
                    <Trash2 className="h-4 w-4" />
                  </div>
                  <span>Hapus Ruangan</span>
                </>
              )}
            </div>
          </Button>
        </div>

        {/* Enhanced Status Message */}
        <div className="bg-gradient-to-r from-gray-50/80 to-slate-50/80 dark:from-gray-900/50 dark:to-slate-900/50 rounded-lg p-4 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {!isConfirmationValid && confirmName.length > 0 ? (
              <span className="text-red-600 dark:text-red-400 font-medium">
                ⚠️ Teks yang Anda masukkan tidak cocok dengan nama ruangan.
              </span>
            ) : (
              <span>
                ℹ️ Anda harus mengetik nama ruangan yang tepat untuk
                mengkonfirmasi penghapusan.
              </span>
            )}
          </p>
        </div>
      </div>
    </form>
  );
}
