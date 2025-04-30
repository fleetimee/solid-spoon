"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
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

// Define Zod schema for form validation
const reservationFormSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    start_time: z.string().min(1, "Start time is required"),
    end_time: z.string().min(1, "End time is required"),
    roomId: z.number(), // Add roomId to the schema
  })
  .refine(
    (data) => {
      // Ensure end_time is after start_time if both are provided
      if (data.start_time && data.end_time) {
        return new Date(data.end_time) > new Date(data.start_time);
      }
      return true; // Pass if one or both are missing (handled by required checks)
    },
    {
      message: "End time must be after start time",
      path: ["end_time"], // Attach error to end_time field
    }
  );

// Define the type for form values based on the schema
type ReservationFormValues = z.infer<typeof reservationFormSchema>;

interface NewReservationFormProps {
  roomId: number; // Accept roomId as a prop
}

// Define the ReservationForm component using react-hook-form
export function NewReservationForm({ roomId }: NewReservationFormProps) {
  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      title: "",
      description: "",
      start_time: "",
      end_time: "",
      roomId: roomId, // Set default roomId from props
    },
  });

  async function onSubmit(values: ReservationFormValues) {
    // Handle form submission (e.g., API call)
    console.log("Reservation Submitted:", values);
    // Here you would typically call a mutation or API endpoint
    // Example: createReservationMutation.mutate(values);
    // TODO: Implement actual submission logic (e.g., using a server action)
    toast.success("Reservation submitted (simulation).", {
      description: `Room ID: ${values.roomId}, Title: ${values.title}`,
    });
    // Optionally reset form or redirect
    // form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid items-start gap-4"
      >
        {/* Hidden input for roomId - not strictly necessary if passed in onSubmit */}
        <input type="hidden" {...form.register("roomId")} />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Reservation Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Optional description or notes"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="start_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Time</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="end_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Time</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Submitting..." : "Submit Reservation"}
        </Button>
      </form>
    </Form>
  );
}
