"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import { ReloadIcon } from "@radix-ui/react-icons";
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
  rejectReservationAction,
  type RejectReservationFormState, // Import the rejection state type
} from "../api/rejectReservationAction"; // Import the rejection action

// Define Zod schema for the rejection form
const rejectFormSchema = z.object({
  reservationId: z.string().min(1, "Reservation ID is required"),
  rejectionReason: z.string().min(1, "Rejection reason is required."), // Add rejection reason
});

// Infer the TypeScript type from the schema
type RejectFormValues = z.infer<typeof rejectFormSchema>;

// Define a type for the reservation data prop (same as accept form)
type ReservationDetails = {
  id: string;
  title: string;
  description: string | null;
  start_time: Date;
  end_time: Date;
  room: { name: string };
  user: { name: string | null };
};

interface RejectConfirmationFormProps {
  reservation: ReservationDetails;
}

export function RejectConfirmationForm({
  reservation,
}: RejectConfirmationFormProps) {
  const router = useRouter();
  // Define the initial state for the rejection action
  const initialState: RejectReservationFormState = {
    success: false,
    message: "",
  };

  // Initialize react-hook-form with Zod resolver
  const form = useForm<RejectFormValues>({
    resolver: zodResolver(rejectFormSchema),
    defaultValues: {
      reservationId: reservation.id,
      rejectionReason: "", // Initialize reason as empty
    },
  });

  // Define the onSubmit handler using validated values
  async function onSubmit(values: RejectFormValues) {
    try {
      const formData = new FormData();
      formData.append("reservationId", values.reservationId);
      formData.append("rejectionReason", values.rejectionReason); // Append rejection reason

      // Call the rejection action
      const result = await rejectReservationAction(initialState, formData);

      // Handle potential validation errors from the action
      if (!result.success) {
        if (result.errors?.reservationId) {
          form.setError("reservationId", {
            type: "server",
            message: result.errors.reservationId.join(", "),
          });
        }
        if (result.errors?.rejectionReason) {
          form.setError("rejectionReason", {
            type: "server",
            message: result.errors.rejectionReason.join(", "),
          });
        }
        toast.error(result.message || "Validation failed.");
        return; // Stop execution if validation failed
      }

      if (result.success) {
        toast.success(result.message || "Reservation rejected successfully!");
        router.push("/admin/rooms/reservations"); // Redirect on success
      } else {
        toast.error(result.message || "Failed to reject reservation.");
      }
    } catch (error) {
      console.error("Rejection failed:", error);
      toast.error("An unexpected error occurred during rejection.");
    }
  }

  return (
    <Form {...form}>
      <input type="hidden" {...form.register("reservationId")} />
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Confirm Reservation Rejection</CardTitle>{" "}
            {/* Updated Title */}
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Reservation Details (same as accept form) */}
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

            {/* Rejection Reason Textarea */}
            <FormField
              control={form.control}
              name="rejectionReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rejection Reason</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a reason for rejecting this reservation..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              variant="destructive"
              disabled={form.formState.isSubmitting}
            >
              {" "}
              {/* Destructive variant */}
              {form.formState.isSubmitting ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Confirming...
                </>
              ) : (
                "Confirm Rejection" // Updated Button Text
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

// Skeleton loader for the rejection form
export function RejectConfirmationFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Skeleton for details */}
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
        {/* Skeleton for textarea */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-20 w-full" /> {/* Skeleton for textarea */}
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-36" /> {/* Skeleton for button */}
      </CardFooter>
    </Card>
  );
}
