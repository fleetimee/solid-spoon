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
import { format } from "date-fns";

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
  user: { name: string | null };
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
        <Card>
          <CardHeader>
            <CardTitle>Confirm Reservation Acceptance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Typography variant="small" color="muted">
                Title
              </Typography>
              <Typography variant="large" className="font-semibold">
                {reservation.title}
              </Typography>
            </div>
            <div className="space-y-1">
              <Typography variant="small" color="muted">
                Room
              </Typography>
              <Typography>{reservation.room.name}</Typography>
            </div>
            <div className="space-y-1">
              <Typography variant="small" color="muted">
                User
              </Typography>
              <Typography>{reservation.user.name ?? "N/A"}</Typography>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <Typography variant="small" color="muted">
                  Start Time
                </Typography>
                <Typography>
                  {format(new Date(reservation.start_time), "PPP p")}
                </Typography>
              </div>
              <div className="space-y-1">
                <Typography variant="small" color="muted">
                  End Time
                </Typography>
                <Typography>
                  {format(new Date(reservation.end_time), "PPP p")}
                </Typography>
              </div>
            </div>
            {reservation.description && (
              <div className="space-y-1">
                <Typography variant="small" color="muted">
                  Description
                </Typography>
                <Typography>{reservation.description}</Typography>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {/* Use formState.isSubmitting for disabled state */}
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Confirming...
                </>
              ) : (
                "Confirm Acceptance"
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
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-5 w-1/3" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-5 w-1/3" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-5 w-2/3" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-5 w-full" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-36" />
      </CardFooter>
    </Card>
  );
}
