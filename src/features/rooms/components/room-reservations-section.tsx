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
  Play,
  Square,
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
        <div className="w-1 h-6 bg-gradient-to-b from-violet-400 to-purple-500 rounded-full"></div>
        <h2 className="text-xl font-semibold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
          Recent Bookings
        </h2>
      </div>

      <Card className="group relative overflow-hidden bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-400/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <div className="p-2 rounded-lg bg-gradient-to-br from-violet-400 to-purple-500 text-white shadow-md">
              <History className="w-5 h-5" />
            </div>
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
              Recent Reservations
            </span>
            <Badge
              variant="secondary"
              className="ml-2 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 text-violet-700 dark:text-violet-300 border-0"
            >
              All Statuses
            </Badge>
          </CardTitle>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 border-violet-200 dark:border-violet-700 hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-500 hover:text-white hover:border-transparent transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm"
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

        <CardContent className="relative">
          {recentReservations && recentReservations.length > 0 ? (
            <div className="rounded-lg border border-violet-200/50 dark:border-violet-700/30 overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-violet-50/80 to-purple-50/80 dark:from-violet-950/50 dark:to-purple-950/50 border-violet-200/50 dark:border-violet-700/50">
                    <TableHead className="font-semibold text-violet-700 dark:text-violet-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Event Title
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-violet-700 dark:text-violet-300">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Booked By
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-violet-700 dark:text-violet-300">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-4 h-4 rounded bg-gradient-to-br from-green-400 to-emerald-500 text-white">
                          <Play className="h-2.5 w-2.5" />
                        </div>
                        Start Time
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-violet-700 dark:text-violet-300">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-4 h-4 rounded bg-gradient-to-br from-red-400 to-rose-500 text-white">
                          <Square className="h-2.5 w-2.5" />
                        </div>
                        End Time
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-violet-700 dark:text-violet-300">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentReservations.map((reservation, index) => (
                    <TableRow
                      key={reservation.id}
                      className="hover:bg-violet-50/50 dark:hover:bg-violet-950/20 transition-colors duration-200 border-violet-100/50 dark:border-violet-800/30"
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
              <div className="space-y-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <History className="w-10 h-10 text-white" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                    No recent reservations
                  </h3>
                  <p className="text-violet-600/70 dark:text-violet-400/70 max-w-sm mx-auto">
                    This room hasn&apos;t been booked recently. Reservations
                    will appear here once users start booking this room.
                  </p>
                </div>
                <Button
                  variant="outline"
                  asChild
                  className="mt-4 bg-white/50 dark:bg-gray-800/50 border-violet-200 dark:border-violet-700 hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-500 hover:text-white hover:border-transparent transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm"
                >
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
