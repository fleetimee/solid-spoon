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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Typography } from "@/components/ui/typography";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import {
  XCircle,
  FileText,
  DoorOpen,
  User,
  Clock,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";

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
  user: { name: string | null; email: string | null; image: string | null };
};

interface RejectConfirmationFormProps {
  reservation: ReservationDetails;
}

export function RejectConfirmationForm({
  reservation,
}: RejectConfirmationFormProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = React.useState(false);

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

  // Define the actual rejection handler using validated values
  async function handleRejectReservation(values: RejectFormValues) {
    setIsProcessing(true);
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
    } finally {
      setIsProcessing(false);
    }
  }

  // Handle form submission with confirmation dialog
  function onSubmit(values: RejectFormValues) {
    // This will be triggered by the confirmation dialog
    // The actual submission is handled by handleRejectReservation
  }

  return (
    <Form {...form}>
      <input type="hidden" {...form.register("reservationId")} />
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="border-red-200/50 shadow-lg shadow-red-500/10">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <CardTitle className="text-xl text-red-700 dark:text-red-300">
                  Confirm Reservation Rejection
                </CardTitle>
                <Typography variant="muted" className="mt-1">
                  Review the reservation details and provide a rejection reason
                </Typography>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title Section */}
            <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 rounded-lg border border-red-200/50 dark:border-red-800/50">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-red-600 dark:text-red-400" />
                <Typography variant="small" className="font-medium">
                  Reservation Title
                </Typography>
              </div>
              <Typography
                variant="large"
                className="font-semibold text-red-900 dark:text-red-100"
              >
                {reservation.title}
              </Typography>
            </div>

            {/* Room and User Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30 rounded-lg border border-slate-200/50 dark:border-slate-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <DoorOpen className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  <Typography variant="small" className="font-medium">
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
                  <Typography variant="small" className="font-medium">
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
                <Typography variant="small" className="font-medium">
                  Schedule
                </Typography>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <Typography variant="muted" className="mb-1">
                    Start Time
                  </Typography>
                  <Typography className="font-semibold">
                    {format(new Date(reservation.start_time), "PPP p")}
                  </Typography>
                </div>
                <div>
                  <Typography variant="muted" className="mb-1">
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
                  <Typography variant="small" className="font-medium">
                    Description
                  </Typography>
                </div>
                <Typography className="leading-relaxed">
                  {reservation.description}
                </Typography>
              </div>
            )}

            {/* Rejection Reason Section */}
            <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 rounded-lg border border-red-200/50 dark:border-red-800/50">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <Typography variant="small" className="font-medium">
                  Rejection Reason *
                </Typography>
              </div>
              <FormField
                control={form.control}
                name="rejectionReason"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Please provide a clear reason for rejecting this reservation..."
                        className="min-h-[100px] border-red-200 dark:border-red-800 focus:border-red-400 dark:focus:border-red-600"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={
                    form.formState.isSubmitting ||
                    !form.formState.isValid ||
                    isProcessing
                  }
                  className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-lg shadow-red-500/25"
                >
                  {form.formState.isSubmitting || isProcessing ? (
                    <>
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-2 h-4 w-4" />
                      Confirm Rejection
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Reject Reservation?
                  </AlertDialogTitle>
                  <AlertDialogDescription asChild>
                    <div>
                      <p>
                        You are about to reject the reservation &ldquo;
                        {reservation.title}&rdquo; for {reservation.room.name}.
                      </p>
                      <p className="mt-4">This action will:</p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Permanently reject the reservation request</li>
                        <li>
                          Notify the user that their reservation has been denied
                        </li>
                        <li>Send them the rejection reason you provided</li>
                      </ul>
                      <p className="mt-4">
                        <strong>This action cannot be undone.</strong> Are you
                        sure you want to proceed?
                      </p>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleRejectReservation(form.getValues())}
                    disabled={isProcessing}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        Rejecting...
                      </>
                    ) : (
                      "Yes, Reject Reservation"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

// Skeleton loader for the rejection form
export function RejectConfirmationFormSkeleton() {
  return (
    <Card className="border-red-200/50 shadow-lg shadow-red-500/10">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-80" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Title Section Skeleton */}
        <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 rounded-lg border border-red-200/50 dark:border-red-800/50">
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

        {/* Rejection Reason Skeleton */}
        <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 rounded-lg border border-red-200/50 dark:border-red-800/50">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 w-full" />
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
