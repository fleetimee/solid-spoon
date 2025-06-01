"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; // Import zodResolver
import * as z from "zod"; // Import zod
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form"; // Import Form provider
import { ReloadIcon } from "@radix-ui/react-icons"; // For loading spinner
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Typography } from "@/components/ui/typography";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import {
  CheckCircle,
  FileText,
  DoorOpen,
  User,
  Clock,
  MessageSquare,
} from "lucide-react";

import {
  acceptReservationAction,
  type AcceptReservationFormState, // Import the state type
} from "../api/acceptReservationAction";

// Define Zod schema for the form
const acceptFormSchema = z.object({
  reservationId: z.string().min(1, "Reservation ID is required"), // Validate the ID is present
});

// Infer the TypeScript type from the schema
type AcceptFormValues = z.infer<typeof acceptFormSchema>;

// Define a type for the reservation data prop
type ReservationDetails = {
  id: string; // Keep this as string, matching the prop
  title: string;
  description: string | null;
  start_time: Date;
  end_time: Date;
  room: { name: string };
  user: { name: string | null; email: string | null; image: string | null };
};

interface AcceptConfirmationFormProps {
  reservation: ReservationDetails;
}

export function AcceptConfirmationForm({
  reservation,
}: AcceptConfirmationFormProps) {
  const router = useRouter();
  // Define the initial state for the action
  const initialState: AcceptReservationFormState = {
    success: false,
    message: "",
  };

  // Initialize react-hook-form with Zod resolver
  const form = useForm<AcceptFormValues>({
    resolver: zodResolver(acceptFormSchema),
    defaultValues: {
      reservationId: reservation.id, // Set default value from prop
    },
  });

  // Define the onSubmit handler using validated values
  async function onSubmit(values: AcceptFormValues) {
    // No need for setIsSubmitting(true); RHF handles this via formState.isSubmitting
    try {
      // Create FormData and append the reservationId
      const formData = new FormData();
      formData.append("reservationId", values.reservationId); // Append validated ID

      // Call the action with the new signature (prevState, formData)
      const result = await acceptReservationAction(initialState, formData);

      // Handle potential validation errors from the action
      if (!result.success && result.errors?.reservationId) {
        // Set form error if validation failed in the action
        form.setError("reservationId", {
          type: "server",
          message: result.errors.reservationId.join(", "),
        });
        toast.error(result.message || "Validation failed.");
        return; // Stop execution if validation failed
      }

      if (result.success) {
        toast.success(result.message || "Reservation accepted successfully!");
        router.push("/admin/rooms/reservations"); // Redirect on success
      } else {
        toast.error(result.message || "Failed to accept reservation.");
        // Optionally reset form state if needed on server error
        // form.reset();
      }
    } catch (error) {
      console.error("Acceptance failed:", error);
      toast.error("An unexpected error occurred during acceptance.");
    }
    // No need for finally block with setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      {/* Ensure hidden input is registered so RHF includes it in 'values' */}
      <input type="hidden" {...form.register("reservationId")} />
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="border-emerald-200/50 shadow-lg shadow-emerald-500/10">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-xl text-emerald-700 dark:text-emerald-300">
                  Confirm Reservation Acceptance
                </CardTitle>
                <Typography variant="small" color="muted" className="mt-1">
                  Review the reservation details and proceed with acceptance
                </Typography>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title Section */}
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <Typography
                  variant="small"
                  color="muted"
                  className="font-medium"
                >
                  Reservation Title
                </Typography>
              </div>
              <Typography
                variant="large"
                className="font-semibold text-emerald-900 dark:text-emerald-100"
              >
                {reservation.title}
              </Typography>
            </div>

            {/* Room and User Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30 rounded-lg border border-slate-200/50 dark:border-slate-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <DoorOpen className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  <Typography
                    variant="small"
                    color="muted"
                    className="font-medium"
                  >
                    Room
                  </Typography>
                </div>
                <Typography className="font-semibold">
                  {reservation.room.name}
                </Typography>
              </div>

              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <Typography
                    variant="small"
                    color="muted"
                    className="font-medium"
                  >
                    Requested by
                  </Typography>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={reservation.user.image || undefined}
                      alt={reservation.user.name || "User"}
                    />
                    <AvatarFallback className="text-lg font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                      {reservation.user.name
                        ? reservation.user.name
                            .split(" ")
                            .map((part) => part.charAt(0))
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()
                        : "??"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <Typography className="font-medium">
                      {reservation.user.name ?? "Unknown User"}
                    </Typography>
                    <Typography
                      variant="small"
                      className="text-muted-foreground"
                    >
                      {reservation.user.email ?? "No email provided"}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Schedule */}
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-lg border border-amber-200/50 dark:border-amber-800/50">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <Typography
                  variant="small"
                  color="muted"
                  className="font-medium"
                >
                  Schedule
                </Typography>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <Typography variant="small" color="muted" className="mb-1">
                    Start Time
                  </Typography>
                  <Typography className="font-semibold">
                    {format(new Date(reservation.start_time), "PPP p")}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" color="muted" className="mb-1">
                    End Time
                  </Typography>
                  <Typography className="font-semibold">
                    {format(new Date(reservation.end_time), "PPP p")}
                  </Typography>
                </div>
              </div>
            </div>

            {/* Description Section */}
            {reservation.description && (
              <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 rounded-lg border border-purple-200/50 dark:border-purple-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <Typography
                    variant="small"
                    color="muted"
                    className="font-medium"
                  >
                    Description
                  </Typography>
                </div>
                <Typography className="leading-relaxed">
                  {reservation.description}
                </Typography>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-500/25"
            >
              {form.formState.isSubmitting ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Confirming...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirm Acceptance
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

// Skeleton loader for the form
export function AcceptConfirmationFormSkeleton() {
  return (
    <Card className="border-emerald-200/50 shadow-lg shadow-emerald-500/10">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
            <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-80" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Title Section Skeleton */}
        <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>

        {/* Room and User Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30 rounded-lg border border-slate-200/50 dark:border-slate-800/50">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
            <div className="space-y-3">
              <Skeleton className="h-4 w-20" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Skeleton */}
        <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-lg border border-amber-200/50 dark:border-amber-800/50">
          <div className="space-y-3">
            <Skeleton className="h-4 w-20" />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
          </div>
        </div>

        {/* Description Skeleton */}
        <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 rounded-lg border border-purple-200/50 dark:border-purple-800/50">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-3 pt-6">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </CardFooter>
    </Card>
  );
}
