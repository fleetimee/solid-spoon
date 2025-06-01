"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Loader2, ShieldCheck, CheckCircle, Heart } from "lucide-react";
import { ExtendedUser } from "./types/user";

interface UnbanUserFormProps {
  user: ExtendedUser;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUnbanned: () => void;
}

export function UnbanUserForm({
  user,
  isOpen,
  onOpenChange,
  onUserUnbanned,
}: UnbanUserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUnban = async () => {
    setIsSubmitting(true);
    try {
      const result = await authClient.admin.unbanUser({
        userId: user.id,
      });

      if (result.error) {
        console.error("Error unbanning user:", result.error);
        toast.error(`Failed to unban user: ${result.error.message}`);
      } else {
        toast.success(`User "${user.name || user.email}" has been unbanned.`);
        onUserUnbanned();
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Caught error unbanning user:", error);
      toast.error("An unexpected error occurred while unbanning the user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] border-0 bg-gradient-to-br from-white/95 to-green-50/90 dark:from-gray-950/95 dark:to-green-950/50 backdrop-blur-xl shadow-2xl">
        {/* Modern Dialog Header with Gradient Icon */}
        <DialogHeader className="space-y-6 pb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                <Heart className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Unban User
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                This will allow the user to sign in and access the system again.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Glassmorphism User Info Card */}
        <div className="mb-6">
          <div className="relative overflow-hidden rounded-2xl border border-green-200/50 dark:border-green-800/50 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/10 dark:to-emerald-950/10 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-emerald-400/5" />
            <div className="relative p-4 space-y-3">
              <div className="text-sm font-medium text-foreground">
                User: {user.name || "N/A"}
              </div>
              <div className="text-xs text-muted-foreground">{user.email}</div>

              {user.banReason && (
                <div className="relative overflow-hidden rounded-lg border border-red-200/50 dark:border-red-800/50 bg-gradient-to-br from-red-50/80 to-red-100/80 dark:from-red-950/20 dark:to-red-900/20 backdrop-blur-sm p-3 mt-3">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400/5 to-red-500/5" />
                  <div className="relative text-xs">
                    <span className="font-semibold text-red-700 dark:text-red-400">
                      Ban reason:
                    </span>{" "}
                    <span className="text-red-600 dark:text-red-500">
                      {user.banReason}
                    </span>
                  </div>
                </div>
              )}

              {user.banExpires && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-semibold">Ban expires:</span>{" "}
                  {new Date(user.banExpires).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Success Info Alert */}
        <div className="relative overflow-hidden rounded-2xl border border-green-200/50 dark:border-green-800/50 bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-950/20 dark:to-emerald-950/20 backdrop-blur-sm mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-emerald-400/5" />
          <div className="relative flex items-start gap-4 p-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-green-800 dark:text-green-400">
                Restore Access
              </p>
              <p className="text-sm text-green-700 dark:text-green-500">
                Unbanning this user will immediately restore their access to the
                system. They&apos;ll be able to sign in again using their
                existing credentials.
              </p>
            </div>
          </div>
        </div>

        {/* Modern Action Buttons */}
        <DialogFooter className="flex gap-3 pt-6">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              className="border-green-200/50 dark:border-green-800/50 hover:bg-green-50 dark:hover:bg-green-950/50 transition-all duration-200"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleUnban}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Unbanning...
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-4 w-4" /> Unban User
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
