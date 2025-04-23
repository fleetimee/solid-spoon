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
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-destructive">
            <Trash2 className="mr-2 h-5 w-5" /> Permanently Delete User
          </DialogTitle>
          <DialogDescription className="text-destructive/70">
            This action will permanently delete the user and all associated
            data. This cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-md">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-semibold">
              Warning: This is a destructive action
            </p>
            <p>
              Deleting the user will remove all their data permanently,
              including authentication records, profile information, and
              associated content.
            </p>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 pt-2"
          >
            <div className="space-y-2">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-sm">User Information:</span>
                <span className="text-sm">{user.name || "No name"}</span>
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
                {user.role && (
                  <span className="text-xs text-muted-foreground capitalize">
                    Role: {user.role}
                  </span>
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="confirmEmail"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Type <span className="font-mono">{user.email}</span> to
                        confirm deletion
                      </label>
                      <Input
                        {...field}
                        disabled={isSubmitting}
                        placeholder={user.email}
                        className="w-full"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Permanently
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
