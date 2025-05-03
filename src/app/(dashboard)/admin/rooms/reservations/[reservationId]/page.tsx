import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getReservationById,
  DetailedReservation,
} from "@/features/reservations/api/getReservationById";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge, badgeVariants } from "@/components/ui/badge"; // Import badgeVariants
import type { VariantProps } from "class-variance-authority"; // Import VariantProps
import { ArrowLeft } from "lucide-react"; // Icon for back button
import { BreadcrumbSetter } from "@/components/breadcrumb-setter"; // Added import

interface ReservationDetailsPageProps {
  params: {
    reservationId: string;
  };
}

// Helper function to format dates (can be moved to a utils file later)
const formatDate = (date: Date | string | null): string => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

// Helper to get badge variant based on status (customize as needed)
const getStatusVariant = (
  status: string
): VariantProps<typeof badgeVariants>["variant"] => {
  // Use VariantProps
  // Use BadgeProps['variant'] for type safety
  switch (status?.toUpperCase()) {
    case "APPROVED":
      return "default"; // Reverted to default as 'success' is not defined
    case "PENDING":
      return "secondary"; // Reverted to secondary as 'warning' is not defined
    case "REJECTED":
    case "CANCELLED":
      return "destructive";
    default:
      return "outline";
  }
};

export default async function ReservationDetailsPage({
  params,
}: ReservationDetailsPageProps) {
  const { reservationId } = params;

  const reservation: DetailedReservation | null =
    await getReservationById(reservationId);

  if (!reservation) {
    notFound(); // Trigger 404 page if reservation doesn't exist
  }

  const breadcrumbs = [
    { label: "Home", href: "/admin/dashboard" },
    { label: "Rooms", href: "/admin/rooms" },
    { label: "Reservations", href: "/admin/rooms/reservations" },
    {
      label: reservation.id, // Use reservation ID for the label
      href: `/admin/rooms/reservations/${reservation.id}`,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4 md:p-6">
      {" "}
      {/* Centering classes */}
      <BreadcrumbSetter items={breadcrumbs} />{" "}
      {/* Corrected prop name back to 'items' */}
      <div className="w-full max-w-3xl">
        {" "}
        {/* Container for the card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Reservation Details</CardTitle>
              <CardDescription>
                Viewing details for reservation ID: {reservation.id}
              </CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/rooms/reservations">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Reservations
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            {" "}
            {/* Added padding top */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
              {/* Use grid for label-value pairs */}

              {/* Title */}
              <div className="md:col-span-2">
                {" "}
                {/* Title spans both columns */}
                <Typography variant="small" className="text-muted-foreground">
                  Title
                </Typography>
                <Typography>{reservation.title || "N/A"}</Typography>
              </div>

              {/* Room */}
              <div>
                <Typography variant="small" className="text-muted-foreground">
                  Room
                </Typography>
                <Typography>
                  <Link
                    href={`/admin/rooms/${reservation.roomSlug}`}
                    className="text-blue-600 hover:underline"
                  >
                    {reservation.roomName} (ID: {reservation.roomId})
                  </Link>
                </Typography>
              </div>

              {/* Reserved By */}
              <div>
                <Typography variant="small" className="text-muted-foreground">
                  Reserved By
                </Typography>
                <Typography>
                  {reservation.userName || "N/A"} (
                  {reservation.userEmail || "N/A"})
                </Typography>
              </div>

              {/* Start Time */}
              <div>
                <Typography variant="small" className="text-muted-foreground">
                  Start Time
                </Typography>
                <Typography>{formatDate(reservation.startTime)}</Typography>
              </div>

              {/* End Time */}
              <div>
                <Typography variant="small" className="text-muted-foreground">
                  End Time
                </Typography>
                <Typography>{formatDate(reservation.endTime)}</Typography>
              </div>

              {/* Status */}
              <div>
                <Typography variant="small" className="text-muted-foreground">
                  Status
                </Typography>
                <div>
                  {" "}
                  {/* Wrap badge for proper alignment */}
                  <Badge variant={getStatusVariant(reservation.status)}>
                    {reservation.status || "Unknown"}
                  </Badge>
                </div>
              </div>

              {/* Created At */}
              <div>
                <Typography variant="small" className="text-muted-foreground">
                  Created At
                </Typography>
                <Typography>{formatDate(reservation.createdAt)}</Typography>
              </div>

              {/* Approver */}
              {reservation.approverName && ( // Conditionally render Approver details
                <div>
                  <Typography variant="small" className="text-muted-foreground">
                    Approver
                  </Typography>
                  <Typography>{reservation.approverName}</Typography>
                </div>
              )}

              {/* Approved At */}
              {reservation.approvedAt && ( // Conditionally render Approved At
                <div>
                  <Typography variant="small" className="text-muted-foreground">
                    Approved At
                  </Typography>
                  <Typography>{formatDate(reservation.approvedAt)}</Typography>
                </div>
              )}

              {/* Description */}
              {reservation.description && (
                <div className="md:col-span-2">
                  <Typography variant="small" className="text-muted-foreground">
                    Description
                  </Typography>
                  <Typography className="whitespace-pre-wrap">
                    {" "}
                    {/* Preserve whitespace */}
                    {reservation.description}
                  </Typography>
                </div>
              )}

              {/* Rejection Reason */}
              {reservation.rejectionReason && (
                <div className="md:col-span-2">
                  <Typography variant="small" className="text-muted-foreground">
                    Rejection Reason
                  </Typography>
                  <Typography className="whitespace-pre-wrap text-destructive">
                    {" "}
                    {/* Style as destructive */}
                    {reservation.rejectionReason}
                  </Typography>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>{" "}
      {/* Close card container */}
    </div>
  );
}

// Removed the DetailItem helper component as it's no longer needed
