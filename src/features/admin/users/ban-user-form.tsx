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
import { Loader2, Ban, Clock, AlertCircle } from "lucide-react";
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-destructive">
            <Ban className="mr-2 h-5 w-5" /> Ban User
          </DialogTitle>
          <DialogDescription>
            This will prevent the user from signing in and revoke all their
            existing sessions.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex flex-col gap-1 mb-4 p-2 bg-muted rounded-md">
            <div className="text-sm font-medium">
              User: {user.name || "N/A"}
            </div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="banReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <AlertCircle className="mr-2 h-4 w-4" /> Reason for ban
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide a reason for this ban"
                      className="resize-none"
                      {...field}
                      disabled={isSubmitting}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    If no reason is provided, it will default to "No reason
                    provided"
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="banDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" /> Ban Duration
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select ban duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1d">1 Day</SelectItem>
                        <SelectItem value="7d">7 Days</SelectItem>
                        <SelectItem value="30d">30 Days</SelectItem>
                        <SelectItem value="90d">90 Days</SelectItem>
                        <SelectItem value="permanent">Permanent</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    How long the user should be banned for
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant="destructive"
                disabled={isSubmitting}
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
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
