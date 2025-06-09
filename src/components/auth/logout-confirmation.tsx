"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoutConfirmationProps {
  children?: React.ReactNode;
  asChild?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function LogoutConfirmation(props: LogoutConfirmationProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut();

      // Show success toast notification in Indonesian
      toast.success("Berhasil keluar", {
        description: "Anda telah berhasil keluar dari akun Anda",
        duration: 3000, // 3 seconds
      });

      // Close dialog and add a small delay to allow toast to be seen before redirect
      props.onOpenChange?.(false);
      setTimeout(() => {
        // Perform a full page reload instead of just refreshing the router cache
        // This ensures all auth state is completely cleared from memory
        window.location.href = "/";
      }, 300);
    } catch (error) {
      console.error("Logout failed:", error);
      // Show error toast in Indonesian
      toast.error("Gagal keluar", {
        description: "Terjadi kesalahan saat keluar. Silakan coba lagi.",
      });
      setIsLoggingOut(false);
    }
  };

  return (
    <AlertDialog open={props.open} onOpenChange={props.onOpenChange}>
      {props.children && (
        <AlertDialogTrigger asChild={props.asChild}>
          {props.children}
        </AlertDialogTrigger>
      )}
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader className="text-center sm:text-center space-y-4">
          {/* Logout Icon with styling */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <LogOut className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>

          <div className="space-y-2">
            <AlertDialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Konfirmasi Keluar
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              Apakah Anda yakin ingin keluar dari akun Anda? Anda perlu masuk
              kembali untuk mengakses sistem.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-col sm:flex-row gap-3 sm:gap-2 pt-4">
          <AlertDialogCancel
            disabled={isLoggingOut}
            className={cn(
              "w-full sm:w-auto order-2 sm:order-1",
              "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800",
              "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            )}
          >
            Batal
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={cn(
              "w-full sm:w-auto order-1 sm:order-2",
              "bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700",
              "focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
              "transition-all duration-200"
            )}
          >
            {isLoggingOut ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Keluar...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Keluar</span>
              </div>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
