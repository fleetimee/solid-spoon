"use client";

import { useState } from "react";
import {
  Info,
  Book,
  Clock,
  AlertTriangle,
  Phone,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ReservationRulesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnderstood?: () => void;
}

export function ReservationRulesDialog({
  open,
  onOpenChange,
  onUnderstood,
}: ReservationRulesDialogProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleUnderstood = () => {
    setIsClosing(true);
    onOpenChange(false);
    onUnderstood?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-900 border-2 border-blue-200 dark:border-blue-800">
        <DialogHeader className="relative">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
              <Book className="h-5 w-5" />
            </div>
            Kebijakan Pemesanan Ruangan
          </DialogTitle>
          <DialogDescription className="text-gray-700 dark:text-gray-300">
            Silakan baca kebijakan berikut sebelum melakukan pemesanan ruangan
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Section 1: Proses Persetujuan */}
          <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold mb-3 text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <div className="p-1 rounded bg-blue-100 dark:bg-blue-900">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              1. Proses Persetujuan
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                <span>
                  Semua reservasi memerlukan persetujuan dari administrator
                  sebelum dikonfirmasi
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                <span>
                  Status reservasi Anda akan berubah dari &quot;Menunggu&quot;
                  menjadi &quot;Disetujui&quot; setelah diverifikasi
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                <span>
                  Anda akan menerima notifikasi email ketika status reservasi
                  berubah
                </span>
              </li>
            </ul>
          </div>

          {/* Section 2: Kebijakan Pembatalan */}
          <div className="p-4 rounded-lg border bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
            <h3 className="font-semibold mb-3 text-amber-700 dark:text-amber-300 flex items-center gap-2">
              <div className="p-1 rounded bg-amber-100 dark:bg-amber-900">
                <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              2. Kebijakan Pembatalan
            </h3>
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <div>
                <h4 className="font-medium text-amber-700 dark:text-amber-300 mb-1">
                  Reservasi Menunggu Persetujuan:
                </h4>
                <ul className="space-y-1 ml-4">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0"></div>
                    <span>Dapat dibatalkan kapan saja tanpa batasan waktu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0"></div>
                    <span>Pembatalan dilakukan langsung oleh pengguna</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-amber-700 dark:text-amber-300 mb-1">
                  Reservasi yang Sudah Disetujui:
                </h4>
                <ul className="space-y-1 ml-4">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0"></div>
                    <span>
                      Dapat dibatalkan sendiri jika lebih dari 24 jam sebelum
                      waktu mulai
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0"></div>
                    <span>
                      Kurang dari 24 jam: harus menghubungi administrator
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: Aturan 24 Jam */}
          <div className="p-4 rounded-lg border bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
            <h3 className="font-semibold mb-3 text-red-700 dark:text-red-300 flex items-center gap-2">
              <div className="p-1 rounded bg-red-100 dark:bg-red-900">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              3. Aturan 24 Jam
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0"></div>
                <span>
                  <strong>Penting:</strong> Reservasi yang telah disetujui hanya
                  dapat dibatalkan sendiri jika masih tersisa lebih dari 24 jam
                  sebelum waktu mulai
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0"></div>
                <span>
                  Aturan ini diberlakukan untuk memberikan waktu yang cukup bagi
                  pengguna lain untuk memesan ruangan tersebut
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0"></div>
                <span>
                  Untuk pembatalan mendadak (kurang dari 24 jam), silakan
                  hubungi administrator dengan alasan yang jelas
                </span>
              </li>
            </ul>
          </div>

          {/* Section 4: Kontak Admin */}
          <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <h3 className="font-semibold mb-3 text-green-700 dark:text-green-300 flex items-center gap-2">
              <div className="p-1 rounded bg-green-100 dark:bg-green-900">
                <Phone className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              4. Kontak Administrator
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                <span>
                  Untuk pembatalan mendadak atau perubahan urgent, hubungi
                  administrator melalui sistem notifikasi atau email
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                <span>
                  Administrator akan mempertimbangkan permintaan berdasarkan
                  urgensi dan alasan yang diberikan
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                <span>
                  Usahakan memberikan notifikasi secepatnya untuk pembatalan
                  mendadak
                </span>
              </li>
            </ul>
          </div>

          {/* Section 5: Ketentuan Umum */}
          <div className="p-4 rounded-lg border bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
            <h3 className="font-semibold mb-3 text-purple-700 dark:text-purple-300 flex items-center gap-2">
              <div className="p-1 rounded bg-purple-100 dark:bg-purple-900">
                <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              5. Ketentuan Umum
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
                <span>
                  Setiap pengguna bertanggung jawab atas reservasi yang mereka
                  buat
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
                <span>
                  Pembatalan berulang tanpa alasan yang jelas dapat mempengaruhi
                  prioritas persetujuan reservasi di masa depan
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
                <span>
                  Pastikan untuk menggunakan ruangan sesuai dengan waktu yang
                  telah dipesan
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
                <span>
                  Dengan melakukan pemesanan, Anda menyetujui semua ketentuan
                  dan kebijakan yang berlaku
                </span>
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter className="relative">
          <Button
            onClick={handleUnderstood}
            className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0 hover:scale-[1.02] transition-all duration-300 hover:shadow-lg font-medium"
            disabled={isClosing}
          >
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-white/30">
                <Book className="h-4 w-4" />
              </div>
              <span>Saya Mengerti</span>
            </div>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
