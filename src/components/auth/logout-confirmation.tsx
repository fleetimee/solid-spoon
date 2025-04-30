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

interface LogoutConfirmationProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export function LogoutConfirmation(props: LogoutConfirmationProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut();

      // Show success toast notification
      toast.success("Logged out successfully", {
        description: "You have been successfully logged out of your account",
        duration: 3000, // 3 seconds
      });

      // Add a small delay to allow toast to be seen before redirect
      setTimeout(() => {
        // Perform a full page reload instead of just refreshing the router cache
        // This ensures all auth state is completely cleared from memory
        window.location.href = "/";
      }, 300);
    } catch (error) {
      console.error("Logout failed:", error);
      // Show error toast
      toast.error("Logout failed", {
        description: "There was an error logging you out. Please try again.",
      });
      setIsLoggingOut(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild={props.asChild}>
        {props.children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to log out?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoggingOut}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut ? "Logging out..." : "Log Out"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
