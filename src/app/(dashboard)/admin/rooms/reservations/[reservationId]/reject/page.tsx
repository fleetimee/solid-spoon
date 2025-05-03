import { Typography } from "@/components/ui/typography";

export default function RejectReservationPage() {
  return (
    <div className="flex flex-col grow p-4 md:p-8">
      <Typography variant="h2">Reject Reservation</Typography>
      <Typography color="muted">This reservation has been rejected.</Typography>
    </div>
  );
}
