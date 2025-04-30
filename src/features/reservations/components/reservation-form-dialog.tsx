"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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

// Define Zod schema for form validation
const reservationFormSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    start_time: z.string().min(1, "Start time is required"),
    end_time: z.string().min(1, "End time is required"),
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

// Define the ReservationForm component using react-hook-form
function ReservationForm() {
  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      title: "",
      description: "",
      start_time: "",
      end_time: "",
    },
  });

  function onSubmit(values: ReservationFormValues) {
    // Handle form submission (e.g., API call)
    console.log("Reservation Submitted:", values);
    // Here you would typically call a mutation or API endpoint
    // Example: createReservationMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid items-start gap-4"
      >
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
        {/* Submit button is now part of the form */}
        <Button type="submit">Submit Reservation</Button>
      </form>
    </Form>
  );
}

// Define props for the main dialog/drawer component
interface ReservationFormDialogProps {
  roomId: number | string; // Room ID is required
  userId?: string; // User ID is optional
  // Allow passing custom trigger element if needed, defaults to Button
  trigger?: React.ReactNode;
}

// Define the main exported component
export function ReservationFormDialog({
  roomId,
  userId,
  trigger,
}: ReservationFormDialogProps) {
  const [open, setOpen] = React.useState(false);
  // Use the mobile hook to determine screen size
  const isMobile = useIsMobile();

  const title = "Book Room Reservation";
  const description = "Fill in the details below to book your reservation.";

  // Default trigger button if none is provided
  const triggerButton = trigger ?? <Button variant="outline">Book Now</Button>;

  // Render Dialog for desktop view (when not mobile)
  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {/* Render the form inside the dialog */}
          <ReservationForm />
          {/* Footer is removed as submit is inside the form */}
        </DialogContent>
      </Dialog>
    );
  }

  // Render Drawer for mobile view
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        {/* Add padding for the form in the drawer view */}
        <div className="px-4">
          <ReservationForm />
        </div>
        <DrawerFooter className="pt-2">
          {/* Submit button moved inside ReservationForm */}
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
