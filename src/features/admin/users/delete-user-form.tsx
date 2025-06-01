"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Trash2, AlertTriangle, Skull, Mail } from "lucide-react";
import { ExtendedUser } from "./types/user";

const deleteUserSchema = z.object({
  confirmEmail: z.string().min(1, "Please confirm the user's email"),
});

type DeleteUserFormValues = z.infer<typeof deleteUserSchema>;

interface DeleteUserFormProps {
  user: ExtendedUser;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUserDeleted: () => void;
}

export function DeleteUserForm({
  user,
  isOpen,
  onOpenChange,
  onUserDeleted,
}: DeleteUserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DeleteUserFormValues>({
    resolver: zodResolver(deleteUserSchema),
    defaultValues: {
      confirmEmail: "",
    },
  });

  const handleSubmit = async (values: DeleteUserFormValues) => {
    // Validate email confirmation
    if (values.confirmEmail !== user.email) {
      form.setError("confirmEmail", {
        message: "Email does not match",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await authClient.admin.removeUser({
        userId: user.id,
      });

      if (result.error) {
        toast.error(
          `Failed to delete user: ${result.error.message || "Unknown error"}`
        );
      } else {
        toast.success("User permanently deleted");
        onOpenChange(false);
        onUserDeleted();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("An unexpected error occurred while deleting the user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[575px] border-0 bg-gradient-to-br from-white/95 to-red-50/90 dark:from-gray-950/95 dark:to-red-950/50 backdrop-blur-xl shadow-2xl">
        {/* Modern Dialog Header with Gradient Icon */}
        <DialogHeader className="space-y-6 pb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg">
                <Trash2 className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                <Skull className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-red-600 to-red-700 dark:from-red-400 dark:to-red-500 bg-clip-text text-transparent">
                Permanently Delete User
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                This action will permanently delete the user and all associated
                data. This cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Warning Alert with Glassmorphism */}
        <div className="relative overflow-hidden rounded-2xl border border-red-200/50 dark:border-red-800/50 bg-gradient-to-br from-red-50/80 to-red-100/80 dark:from-red-950/20 dark:to-red-900/20 backdrop-blur-sm mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-red-400/5 to-red-500/5" />
          <div className="relative flex items-start gap-4 p-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-red-800 dark:text-red-400">
                Warning: This is a destructive action
              </p>
              <p className="text-sm text-red-700 dark:text-red-500">
                Deleting the user will remove all their data permanently,
                including authentication records, profile information, and
                associated content.
              </p>
            </div>
          </div>
        </div>

        {/* Glassmorphism User Info Card */}
        <div className="mb-6">
          <div className="relative overflow-hidden rounded-2xl border border-red-200/50 dark:border-red-800/50 bg-gradient-to-br from-red-50/50 to-red-100/50 dark:from-red-950/10 dark:to-red-900/10 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-red-400/5 to-red-500/5" />
            <div className="relative p-4 space-y-2">
              <div className="text-sm font-medium text-red-800 dark:text-red-400">
                User Information:
              </div>
              <div className="text-sm text-foreground">
                {user.name || "No name"}
              </div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
              {user.role && (
                <div className="text-xs text-muted-foreground capitalize">
                  Role: {user.role}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Glassmorphism Form Container */}
        <div className="relative overflow-hidden rounded-2xl border border-red-200/50 dark:border-red-800/50 bg-gradient-to-br from-red-50/30 to-red-100/30 dark:from-red-950/5 dark:to-red-900/5 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-red-400/3 to-red-500/3" />
          <div className="relative p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="confirmEmail"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground flex items-center gap-2">
                              <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                                <Mail className="h-3 w-3 text-white" />
                              </div>
                              Type{" "}
                              <span className="font-mono bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded text-red-700 dark:text-red-400">
                                {user.email}
                              </span>{" "}
                              to confirm deletion
                            </label>
                          </div>
                          <Input
                            {...field}
                            disabled={isSubmitting}
                            placeholder={user.email}
                            className="border-red-200/50 dark:border-red-800/50 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm focus:border-red-400 focus:ring-red-400/20 transition-all duration-200"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </div>

        {/* Modern Action Buttons */}
        <DialogFooter className="flex gap-3 pt-6">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              className="border-red-200/50 dark:border-red-800/50 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all duration-200"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={form.handleSubmit(handleSubmit)}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" /> Delete Permanently
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
