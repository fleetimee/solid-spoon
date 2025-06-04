"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; // Added
// Removed incorrect DateTimePicker import
import { z } from "zod";
import { useForm } from "react-hook-form";
import { CalendarIcon, Clock, Sparkles, User, FileText } from "lucide-react"; // Added
import { format } from "date-fns"; // Added
import { cn } from "@/lib/utils"; // Added
import { Calendar } from "@/components/ui/calendar"; // Added
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // Added
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner"; // Import toast for feedback
import {
  createReservationAction,
  type CreateReservationFormState,
} from "../api/createReservation";
import { useRouter } from "next/navigation";
import { type ApprovedReservationTime } from "../api/getApprovedRoomReservations";
import { ReservationCalendar } from "@/components/ui/reservation-calendar";

// Define Zod schema for form validation
const reservationFormSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    start_time: z.date({ required_error: "Start time is required." }), // Change to z.date
    end_time: z.date({ required_error: "End time is required." }), // Change to z.date
    roomId: z.number(), // Add roomId to the schema
  })
  .refine(
    (data) => {
      // Ensure end_time is after start_time if both are provided and valid dates
      if (data.start_time && data.end_time) {
        // Direct comparison works for Date objects
        return data.end_time > data.start_time;
      }
      return true; // Pass if one or both are missing (handled by required checks)
    },
    {
      message: "End time must be after start time",
      path: ["end_time"], // Attach error to end_time field
    }
  )
  .refine(
    (data) => {
      // Ensure duration does not exceed 24 hours
      if (data.start_time && data.end_time) {
        const duration = data.end_time.getTime() - data.start_time.getTime();
        const twentyFourHoursInMs = 24 * 60 * 60 * 1000;
        return duration <= twentyFourHoursInMs;
      }
      return true; // Pass if one or both dates are missing
    },
    {
      message: "Reservation duration cannot exceed 24 hours",
      path: ["end_time"], // Attach error to end_time field
    }
  );

// Define the type for form values based on the schema
type ReservationFormValues = z.infer<typeof reservationFormSchema>;

interface NewReservationFormProps {
  roomId: number; // Accept roomId as a prop
  roomSlug: string; // Add roomSlug prop
  approvedReservations: ApprovedReservationTime[]; // Add approved reservations prop
}

// Define the ReservationForm component using react-hook-form
export function NewReservationForm({
  roomId,
  roomSlug,
  approvedReservations,
}: NewReservationFormProps) {
  // Define hours and minutes arrays for time selection
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // 0, 5, ..., 55

  const router = useRouter(); // Add router hook

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      title: "",
      description: "",
      start_time: undefined, // Change default to undefined for DateTimePicker
      end_time: undefined, // Change default to undefined for DateTimePicker
      roomId: roomId, // Set default roomId from props
    },
  });

  // Define initial state for the server action
  const initialState: CreateReservationFormState = {
    success: false,
    message: "",
    fieldErrors: undefined,
    reservationId: undefined,
  };

  // Watch the start_time field to disable dates in the end_time calendar
  const startTime = form.watch("start_time");

  async function onSubmit(values: ReservationFormValues) {
    const formData = new FormData();
    formData.append("title", values.title);
    if (values.description) {
      formData.append("description", values.description);
    }
    // Convert dates to ISO strings for the server action
    formData.append("start_time", values.start_time.toISOString());
    formData.append("end_time", values.end_time.toISOString());
    formData.append("roomId", values.roomId.toString()); // Ensure roomId is a string

    try {
      // Note: We don't need useFormState here as we manually handle the action call
      // Pass the initial state as the first argument
      const result: CreateReservationFormState = await createReservationAction(
        initialState, // Pass the defined initial state
        formData
      );

      if (result.success) {
        toast.success(result.message);
        form.reset(); // Reset form on success
        // Redirect after successful submission to the specific room page
        router.push(`/v/${roomSlug}`);
      } else {
        toast.error(result.message);
        // Set field-specific errors
        if (result.fieldErrors) {
          for (const field in result.fieldErrors) {
            if (
              Object.prototype.hasOwnProperty.call(result.fieldErrors, field)
            ) {
              const messages =
                result.fieldErrors[field as keyof typeof result.fieldErrors];
              // Ensure the field exists in ReservationFormValues before setting error
              if (
                messages &&
                messages.length > 0 &&
                field in form.getValues()
              ) {
                form.setError(field as keyof ReservationFormValues, {
                  type: "server",
                  message: messages.join(", "), // Join multiple messages if any
                });
              } else if (messages && messages.length > 0) {
                // Handle general errors not tied to a specific field if needed
                console.warn(
                  `Server returned error for unknown field: ${field}`
                );
              }
            }
          }
        }
      }
    } catch (error) {
      // Catch unexpected errors during the action call
      console.error("Failed to create reservation:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Hidden input for roomId - not strictly necessary if passed in onSubmit */}
        <input type="hidden" {...form.register("roomId")} />

        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-semibold text-foreground flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-violet-100 dark:bg-violet-900/30">
                  <User className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                </div>
                Reservation Title
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="What's this booking for? (e.g., Team Meeting, Study Session)"
                    className="h-12 text-base border-2 focus:border-violet-500 transition-all duration-200 pl-4 bg-white/50 dark:bg-background/50 backdrop-blur-sm"
                    {...field}
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-semibold text-foreground flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30">
                  <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                Description
                <span className="text-sm text-muted-foreground font-normal">
                  (Optional)
                </span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any special notes, requirements, or details about your booking..."
                  className="min-h-24 text-base border-2 focus:border-blue-500 transition-all duration-200 resize-none bg-white/50 dark:bg-background/50 backdrop-blur-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date and Time Selection Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30">
              <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              When do you need the space?
            </h3>
          </div>

          {/* Date Selection with Availability Calendar */}
          <div className="space-y-4">
            <div>
              <h4 className="text-base font-medium text-foreground mb-2">
                📅 Choose Your Date
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Select an available date to see when the room is free. Reserved
                dates are highlighted in red.
              </p>
              <ReservationCalendar
                approvedReservations={approvedReservations}
                selectedDate={startTime}
                onSelectDate={(date) => {
                  // CRITICAL SAFEGUARD: Check if the date is reserved
                  const isDateReserved = approvedReservations.some(
                    (reservation) => {
                      const reservationStart = new Date(reservation.startTime);
                      const reservationEnd = new Date(reservation.endTime);
                      const selectedDate = new Date(date);

                      // Reset all times to compare dates only
                      reservationStart.setHours(0, 0, 0, 0);
                      reservationEnd.setHours(0, 0, 0, 0);
                      selectedDate.setHours(0, 0, 0, 0);

                      return (
                        selectedDate >= reservationStart &&
                        selectedDate <= reservationEnd
                      );
                    }
                  );

                  if (isDateReserved) {
                    console.warn(
                      "Attempted to select reserved date - blocking action:",
                      date
                    );
                    return; // Completely prevent form update for reserved dates
                  }

                  // Only set the date component, let user choose time manually
                  const newDate = new Date(date);
                  newDate.setHours(9, 0, 0, 0); // Set to 9 AM as default but user must confirm
                  form.setValue("start_time", newDate);

                  // Clear end time so user has to set it after choosing start time
                  form.resetField("end_time");
                }}
                disabled={(date) => {
                  // Disable past dates
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  if (date < today) {
                    return true;
                  }

                  // Disable reserved dates
                  const isDateReserved = approvedReservations.some(
                    (reservation) => {
                      const reservationStart = new Date(reservation.startTime);
                      const reservationEnd = new Date(reservation.endTime);
                      const checkDate = new Date(date);

                      // Reset all times to compare dates only
                      reservationStart.setHours(0, 0, 0, 0);
                      reservationEnd.setHours(0, 0, 0, 0);
                      checkDate.setHours(0, 0, 0, 0);

                      return (
                        checkDate >= reservationStart &&
                        checkDate <= reservationEnd
                      );
                    }
                  );

                  return isDateReserved;
                }}
                className="w-full"
              />
            </div>

            {/* Time Selection */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Start Time */}
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => {
                  const selectedDate = field.value;
                  const hasDateSelected =
                    selectedDate && selectedDate instanceof Date;

                  return (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-medium text-foreground">
                        🚀 Start Time
                      </FormLabel>

                      {!hasDateSelected ? (
                        <div className="w-full h-12 flex items-center justify-center border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/20">
                          <p className="text-sm text-muted-foreground">
                            First select a date from the calendar above
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {/* Selected Date Display */}
                          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <CalendarIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <span className="text-sm font-medium text-green-700 dark:text-green-300">
                              {format(selectedDate, "EEEE, MMMM d, yyyy")}
                            </span>
                          </div>

                          {/* Time Selection */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">
                                Hour
                              </label>
                              <select
                                value={selectedDate.getHours()}
                                onChange={(e) => {
                                  const newDate = new Date(selectedDate);
                                  newDate.setHours(parseInt(e.target.value));
                                  field.onChange(newDate);
                                }}
                                className="w-full h-10 px-3 border border-border rounded-md bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                              >
                                {hours.map((hour) => (
                                  <option key={hour} value={hour}>
                                    {hour.toString().padStart(2, "0")}:00
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">
                                Minutes
                              </label>
                              <select
                                value={selectedDate.getMinutes()}
                                onChange={(e) => {
                                  const newDate = new Date(selectedDate);
                                  newDate.setMinutes(parseInt(e.target.value));
                                  field.onChange(newDate);
                                }}
                                className="w-full h-10 px-3 border border-border rounded-md bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                              >
                                {minutes.map((minute) => (
                                  <option key={minute} value={minute}>
                                    {minute.toString().padStart(2, "0")}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      )}

                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* End Time */}
              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base font-medium text-foreground">
                      🏁 End Time
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full h-12 text-left font-normal text-base border-2 hover:border-red-500 transition-all duration-200 bg-white/50 dark:bg-background/50 backdrop-blur-sm",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                                <span>{format(field.value, "PPP HH:mm")}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 opacity-50" />
                                <span>Pick your end date & time</span>
                              </div>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="sm:flex">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(selectedDate) => {
                              const currentHours =
                                field.value?.getHours() ?? 10;
                              const currentMinutes =
                                field.value?.getMinutes() ?? 0;
                              const newDate = selectedDate
                                ? new Date(selectedDate)
                                : undefined;
                              if (newDate) {
                                newDate.setHours(currentHours, currentMinutes);
                              }
                              field.onChange(newDate);
                            }}
                            disabled={(date) => {
                              if (!startTime) return false;

                              const maxEndTime = new Date(
                                startTime.getTime() + 24 * 60 * 60 * 1000
                              );
                              const startOfDay = new Date(startTime);
                              startOfDay.setHours(0, 0, 0, 0);

                              if (date < startOfDay) return true;

                              const maxEndOfDay = new Date(maxEndTime);
                              maxEndOfDay.setHours(0, 0, 0, 0);

                              if (date > maxEndOfDay) return true;

                              return false;
                            }}
                            initialFocus
                          />
                          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                            <ScrollArea className="w-64 sm:w-auto">
                              <div className="flex sm:flex-col p-2">
                                {hours.map((hour) => (
                                  <Button
                                    key={`end_hour_${hour}`}
                                    size="icon"
                                    variant={
                                      field.value &&
                                      field.value.getHours() === hour
                                        ? "default"
                                        : "ghost"
                                    }
                                    className="sm:w-full shrink-0 aspect-square hover:scale-105 transition-transform"
                                    onClick={() => {
                                      const currentDate =
                                        field.value || new Date();
                                      const newDate = new Date(currentDate);
                                      newDate.setHours(hour);
                                      field.onChange(newDate);
                                    }}
                                  >
                                    {hour}
                                  </Button>
                                ))}
                              </div>
                              <ScrollBar
                                orientation="horizontal"
                                className="sm:hidden"
                              />
                            </ScrollArea>
                            <ScrollArea className="w-64 sm:w-auto">
                              <div className="flex sm:flex-col p-2">
                                {minutes.map((minute) => (
                                  <Button
                                    key={`end_minute_${minute}`}
                                    size="icon"
                                    variant={
                                      field.value &&
                                      field.value.getMinutes() === minute
                                        ? "default"
                                        : "ghost"
                                    }
                                    className="sm:w-full shrink-0 aspect-square hover:scale-105 transition-transform"
                                    onClick={() => {
                                      const currentDate =
                                        field.value || new Date();
                                      const newDate = new Date(currentDate);
                                      newDate.setMinutes(minute);
                                      field.onChange(newDate);
                                    }}
                                  >
                                    {minute.toString().padStart(2, "0")}
                                  </Button>
                                ))}
                              </div>
                              <ScrollBar
                                orientation="horizontal"
                                className="sm:hidden"
                              />
                            </ScrollArea>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
          >
            {form.formState.isSubmitting ? (
              <>
                <ReloadIcon className="h-5 w-5 animate-spin mr-2" />
                Creating your reservation...
              </>
            ) : (
              <>
                <CheckIcon className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Book This Space ✨
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            By clicking submit, you agree to our booking terms and policies
          </p>
        </div>
      </form>
    </Form>
  );
}
