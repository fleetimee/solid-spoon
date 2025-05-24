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
import { Loader2, ShieldCheck } from "lucide-react";
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ShieldCheck className="mr-2 h-5 w-5" /> Unban User
          </DialogTitle>
          <DialogDescription>
            This will allow the user to sign in and access the system again.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="flex flex-col gap-1 mb-4 p-3 bg-muted rounded-md">
            <div className="text-sm font-medium">
              User: {user.name || "N/A"}
            </div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
            {user.banReason && (
              <div className="text-xs mt-2 p-2 bg-destructive/10 rounded-sm">
                <span className="font-semibold">Ban reason:</span>{" "}
                {user.banReason}
              </div>
            )}
            {user.banExpires && (
              <div className="text-xs mt-1">
                <span className="font-semibold">Ban expires:</span>{" "}
                {new Date(user.banExpires).toLocaleDateString()}
              </div>
            )}
          </div>

          <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md">
            <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-green-800 dark:text-green-400">
              Unbanning this user will immediately restore their access to the
              system. They&apos;ll be able to sign in again using their existing
              credentials.
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="default"
            onClick={handleUnban}
            disabled={isSubmitting}
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
