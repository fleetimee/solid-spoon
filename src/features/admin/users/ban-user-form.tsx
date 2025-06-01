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
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Ban, Clock, AlertCircle, Shield } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExtendedUser } from "./types/user";

const banUserSchema = z.object({
  banReason: z.string().optional(),
  banDuration: z.enum(["1d", "7d", "30d", "90d", "permanent"], {
    required_error: "Please select a ban duration",
  }),
});

type BanUserFormValues = z.infer<typeof banUserSchema>;

interface BanUserFormProps {
  user: ExtendedUser;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUserBanned: () => void;
}

export function BanUserForm({
  user,
  isOpen,
  onOpenChange,
  onUserBanned,
}: BanUserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BanUserFormValues>({
    resolver: zodResolver(banUserSchema),
    defaultValues: {
      banReason: "",
      banDuration: "7d",
    },
  });

  const onSubmit = async (values: BanUserFormValues) => {
    setIsSubmitting(true);
    try {
      // Calculate expiry time in seconds based on selected duration
      let banExpiresIn: number | undefined;

      switch (values.banDuration) {
        case "1d":
          banExpiresIn = 60 * 60 * 24; // 1 day in seconds
          break;
        case "7d":
          banExpiresIn = 60 * 60 * 24 * 7; // 7 days in seconds
          break;
        case "30d":
          banExpiresIn = 60 * 60 * 24 * 30; // 30 days in seconds
          break;
        case "90d":
          banExpiresIn = 60 * 60 * 24 * 90; // 90 days in seconds
          break;
        case "permanent":
          banExpiresIn = undefined; // No expiry
          break;
      }

      const result = await authClient.admin.banUser({
        userId: user.id,
        banReason: values.banReason || undefined,
        banExpiresIn,
      });

      if (result.error) {
        console.error("Error banning user:", result.error);
        toast.error(`Failed to ban user: ${result.error.message}`);
      } else {
        toast.success(`User "${user.name || user.email}" has been banned.`);
        form.reset();
        onUserBanned();
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Caught error banning user:", error);
      toast.error("An unexpected error occurred while banning the user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] border-0 bg-gradient-to-br from-white/95 to-violet-50/90 dark:from-gray-950/95 dark:to-violet-950/50 backdrop-blur-xl shadow-2xl">
        {/* Modern Dialog Header with Gradient Icon */}
        <DialogHeader className="space-y-6 pb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg">
                <Ban className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
                <Shield className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-red-600 to-red-700 dark:from-red-400 dark:to-red-500 bg-clip-text text-transparent">
                Ban User
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                This will prevent the user from signing in and revoke all their
                existing sessions.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Glassmorphism User Info Card */}
        <div className="mb-6">
          <div className="relative overflow-hidden rounded-2xl border border-violet-200/50 dark:border-violet-800/50 bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/10 dark:to-purple-950/10 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400/5 to-purple-400/5" />
            <div className="relative p-4 space-y-2">
              <div className="text-sm font-medium text-foreground">
                User: {user.name || "N/A"}
              </div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
            </div>
          </div>
        </div>

        {/* Glassmorphism Form Container */}
        <div className="relative overflow-hidden rounded-2xl border border-violet-200/50 dark:border-violet-800/50 bg-gradient-to-br from-violet-50/30 to-purple-50/30 dark:from-violet-950/5 dark:to-purple-950/5 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-400/3 to-purple-400/3" />
          <div className="relative p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="banReason"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="flex items-center text-sm font-medium text-foreground">
                        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center mr-2">
                          <AlertCircle className="h-3 w-3 text-white" />
                        </div>
                        Reason for ban
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please provide a reason for this ban"
                          className="resize-none min-h-[100px] border-violet-200/50 dark:border-violet-800/50 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm focus:border-violet-400 focus:ring-violet-400/20 transition-all duration-200"
                          {...field}
                          disabled={isSubmitting}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        If no reason is provided, it will default to &quot;No
                        reason provided&quot;
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="banDuration"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="flex items-center text-sm font-medium text-foreground">
                        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center mr-2">
                          <Clock className="h-3 w-3 text-white" />
                        </div>
                        Ban Duration
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger className="border-violet-200/50 dark:border-violet-800/50 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm focus:border-violet-400 focus:ring-violet-400/20 transition-all duration-200">
                            <SelectValue placeholder="Select ban duration" />
                          </SelectTrigger>
                          <SelectContent className="border-violet-200/50 dark:border-violet-800/50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl">
                            <SelectItem
                              value="1d"
                              className="focus:bg-violet-50 dark:focus:bg-violet-950/50"
                            >
                              1 Day
                            </SelectItem>
                            <SelectItem
                              value="7d"
                              className="focus:bg-violet-50 dark:focus:bg-violet-950/50"
                            >
                              7 Days
                            </SelectItem>
                            <SelectItem
                              value="30d"
                              className="focus:bg-violet-50 dark:focus:bg-violet-950/50"
                            >
                              30 Days
                            </SelectItem>
                            <SelectItem
                              value="90d"
                              className="focus:bg-violet-50 dark:focus:bg-violet-950/50"
                            >
                              90 Days
                            </SelectItem>
                            <SelectItem
                              value="permanent"
                              className="focus:bg-violet-50 dark:focus:bg-violet-950/50"
                            >
                              Permanent
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        How long the user should be banned for
                      </FormDescription>
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
              className="border-violet-200/50 dark:border-violet-800/50 hover:bg-violet-50 dark:hover:bg-violet-950/50 transition-all duration-200"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Banning...
              </>
            ) : (
              <>
                <Ban className="mr-2 h-4 w-4" /> Ban User
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
