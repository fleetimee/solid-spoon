import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  History,
  ChevronDown,
  DoorOpen,
  List,
  Calendar,
  User,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { RecentReservation } from "@/features/reservations/api/getRecentReservations";

interface RoomReservationsSectionProps {
  roomId: number;
  recentReservations: RecentReservation[];
}

export function RoomReservationsSection({
  roomId,
  recentReservations,
}: RoomReservationsSectionProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Approved":
        return "default";
      case "Pending":
        return "secondary";
      case "Rejected":
      case "Cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800";
      case "Pending":
        return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800";
      case "Rejected":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800";
      case "Cancelled":
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-950/30 dark:text-gray-400 dark:border-gray-800";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-950/30 dark:text-slate-400 dark:border-slate-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return "✓";
      case "Pending":
        return "⏳";
      case "Rejected":
        return "✗";
      case "Cancelled":
        return "⚫";
      default:
        return "•";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Recent Bookings
        </h2>
      </div>

      <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <History className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            Recent Reservations
            <Badge variant="secondary" className="ml-2">
              All Statuses
            </Badge>
          </CardTitle>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Manage Reservations
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="flex items-center gap-2" asChild>
                <Link
                  href={`/admin/rooms/reservations?page=1&roomId=${roomId}`}
                >
                  <DoorOpen className="h-4 w-4" />
                  <span>This Room&apos;s Reservations</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2" asChild>
                <Link href="/admin/rooms/reservations">
                  <List className="h-4 w-4" />
                  <span>All Reservations</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent>
          {recentReservations && recentReservations.length > 0 ? (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-white/50 dark:bg-gray-800/50">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Event Title
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Booked By
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Start Time
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        End Time
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentReservations.map((reservation, index) => (
                    <TableRow
                      key={reservation.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-200 border-gray-100 dark:border-gray-800"
                    >
                      <TableCell className="font-medium">
                        <div className="space-y-1">
                          <div className="font-semibold text-gray-900 dark:text-gray-100">
                            {reservation.title}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={reservation.userImage || undefined}
                              alt={reservation.userName}
                            />
                            <AvatarFallback className="text-xs">
                              {reservation.userName
                                .split(" ")
                                .map((part) => part.charAt(0))
                                .slice(0, 2)
                                .join("")
                                .toUpperCase() || "??"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {reservation.userName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            {format(
                              new Date(reservation.startTime),
                              "MMM d, yyyy"
                            )}
                          </div>
                          <div className="text-muted-foreground">
                            {format(new Date(reservation.startTime), "h:mm a")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            {format(
                              new Date(reservation.endTime),
                              "MMM d, yyyy"
                            )}
                          </div>
                          <div className="text-muted-foreground">
                            {format(new Date(reservation.endTime), "h:mm a")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`font-medium ${getStatusColor(reservation.statusValue)}`}
                        >
                          <span className="mr-1" aria-hidden="true">
                            {getStatusIcon(reservation.statusValue)}
                          </span>
                          {reservation.statusValue}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <History className="w-8 h-8 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    No recent reservations
                  </h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    This room hasn&apos;t been booked recently. Reservations
                    will appear here once users start booking this room.
                  </p>
                </div>
                <Button variant="outline" asChild className="mt-4">
                  <Link href="/admin/rooms/reservations">
                    <Calendar className="w-4 h-4 mr-2" />
                    View All Reservations
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
