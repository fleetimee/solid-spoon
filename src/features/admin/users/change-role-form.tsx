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
import { Loader2, ShieldCheck, AlertTriangle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExtendedUser } from "./types/user";

const USER_ROLES = ["admin", "user"] as const;

const changeRoleSchema = z.object({
  role: z.enum(USER_ROLES as unknown as [string, ...string[]], {
    required_error: "Please select a role",
  }),
});

type ChangeRoleFormValues = z.infer<typeof changeRoleSchema>;

interface ChangeRoleFormProps {
  user: ExtendedUser;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRoleChanged: () => void;
}

export function ChangeRoleForm({
  user,
  isOpen,
  onOpenChange,
  onRoleChanged,
}: ChangeRoleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ChangeRoleFormValues>({
    resolver: zodResolver(changeRoleSchema),
    defaultValues: {
      role: (user.role as (typeof USER_ROLES)[number]) || "user",
    },
  });

  const onSubmit = async (values: ChangeRoleFormValues) => {
    setIsSubmitting(true);
    try {
      const role = values.role as (typeof USER_ROLES)[number];
      const result = await authClient.admin.setRole({
        userId: user.id,
        role,
      });

      if (result.error) {
        console.error("Error changing user role:", result.error);
        toast.error(`Failed to change role: ${result.error.message}`);
      } else {
        toast.success(
          `User "${user.name || user.email}" role changed to ${values.role}.`
        );
        form.reset({ role: values.role });
        onRoleChanged();
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Caught error changing user role:", error);
      toast.error("An unexpected error occurred while changing the user role.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ShieldCheck className="mr-2 h-5 w-5" /> Change User Role
          </DialogTitle>
          <DialogDescription>
            Update the role and permissions for this user.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex flex-col gap-1 mb-4 p-2 bg-muted rounded-md">
            <div className="text-sm font-medium">
              User: {user.name || "N/A"}
            </div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
            <div className="text-xs font-semibold mt-1">
              Current Role:{" "}
              <span className="text-primary">
                {typeof user.role === "string"
                  ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                  : "Unknown"}
              </span>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <ShieldCheck className="mr-2 h-4 w-4" /> New Role
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select new role" />
                      </SelectTrigger>
                      <SelectContent>
                        {USER_ROLES.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    This will change the user's permissions and access level.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("role") === "admin" && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800 dark:text-amber-400">
                  <p className="font-medium mb-1">Warning</p>
                  <p>
                    Admin users have full access to all system features
                    including user management and sensitive operations.
                  </p>
                </div>
              </div>
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" variant="default" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Updating...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 h-4 w-4" /> Change Role
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
