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
import {
  Loader2,
  ShieldCheck,
  AlertTriangle,
  Settings,
  Crown,
} from "lucide-react";
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
      <DialogContent className="sm:max-w-[525px] border-0 bg-gradient-to-br from-white/95 to-violet-50/90 dark:from-gray-950/95 dark:to-violet-950/50 backdrop-blur-xl shadow-2xl">
        {/* Modern Dialog Header with Gradient Icon */}
        <DialogHeader className="space-y-6 pb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-lg">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Settings className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                Change User Role
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Update the role and permissions for this user.
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
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs font-medium text-muted-foreground">
                  Current Role:
                </span>
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30">
                  {typeof user.role === "string" && user.role === "admin" ? (
                    <Crown className="h-3 w-3 text-violet-600 dark:text-violet-400" />
                  ) : (
                    <ShieldCheck className="h-3 w-3 text-violet-600 dark:text-violet-400" />
                  )}
                  <span className="text-xs font-semibold text-violet-700 dark:text-violet-400">
                    {typeof user.role === "string"
                      ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                      : "Unknown"}
                  </span>
                </div>
              </div>
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
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="flex items-center text-sm font-medium text-foreground">
                        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center mr-2">
                          <ShieldCheck className="h-3 w-3 text-white" />
                        </div>
                        New Role
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger className="border-violet-200/50 dark:border-violet-800/50 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm focus:border-violet-400 focus:ring-violet-400/20 transition-all duration-200">
                            <SelectValue placeholder="Select new role" />
                          </SelectTrigger>
                          <SelectContent className="border-violet-200/50 dark:border-violet-800/50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl">
                            {USER_ROLES.map((role) => (
                              <SelectItem
                                key={role}
                                value={role}
                                className="focus:bg-violet-50 dark:focus:bg-violet-950/50"
                              >
                                <div className="flex items-center gap-2">
                                  {role === "admin" ? (
                                    <Crown className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                  ) : (
                                    <ShieldCheck className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                  )}
                                  {role.charAt(0).toUpperCase() + role.slice(1)}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        This will change the user&apos;s permissions and access
                        level.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("role") === "admin" && (
                  <div className="relative overflow-hidden rounded-xl border border-amber-200/50 dark:border-amber-800/50 bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-950/20 dark:to-orange-950/20 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400/5 to-orange-400/5" />
                    <div className="relative flex items-start gap-3 p-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="h-4 w-4 text-white" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-amber-800 dark:text-amber-400">
                          Warning
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-500">
                          Admin users have full access to all system features
                          including user management and sensitive operations.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
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
            className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-4 w-4" /> Change Role
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
