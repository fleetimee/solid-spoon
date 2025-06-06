"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ReservationRulesDialog } from "./reservation-rules-dialog";

interface ReservationWarningHandlerProps {
  showWarning: boolean;
}

export function ReservationWarningHandler({
  showWarning,
}: ReservationWarningHandlerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Show dialog when warning parameter is present
  useEffect(() => {
    if (showWarning) {
      setIsDialogOpen(true);
    }
  }, [showWarning]);

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);

    // If dialog is being closed, remove the warning parameter from URL
    if (!open && showWarning) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.delete("warning");

      // Create new URL without the warning parameter
      const search = current.toString();
      const query = search ? `?${search}` : "";

      // Replace the URL without the warning parameter
      router.replace(`${window.location.pathname}${query}`, { scroll: false });
    }
  };

  const handleUnderstood = () => {
    // Optional: Add any additional logic when user understands the rules
    // For now, just close the dialog (which will remove the URL parameter)
  };

  return (
    <ReservationRulesDialog
      open={isDialogOpen}
      onOpenChange={handleDialogClose}
      onUnderstood={handleUnderstood}
    />
  );
}
