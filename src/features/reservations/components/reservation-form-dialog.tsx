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
  DialogFooter,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Define props for the form component, extending standard form attributes
interface ReservationFormProps extends React.HTMLAttributes<HTMLFormElement> {}

// Define the ReservationForm component
function ReservationForm({ className, ...props }: ReservationFormProps) {
  return (
    // Assign an ID to the form so footer buttons can submit it
    <form
      id="reservation-form-in-dialog"
      className={cn("grid items-start gap-4", className)}
      {...props}
    >
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input type="text" id="title" placeholder="Reservation Title" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Optional description or notes"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="start_time">Start Time</Label>
        <Input type="datetime-local" id="start_time" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="end_time">End Time</Label>
        <Input type="datetime-local" id="end_time" />
      </div>
    </form>
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
          <DialogFooter>
            {/* Submit button linked to the form via its ID */}
            <Button type="submit" form="reservation-form-in-dialog">
              Submit Reservation
            </Button>
          </DialogFooter>
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
          {/* Submit button linked to the form via its ID */}
          <Button type="submit" form="reservation-form-in-dialog">
            Submit Reservation
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
