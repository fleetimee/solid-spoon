import { Skeleton } from "@/components/ui/skeleton";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Users, MapPin, Calendar, User, Pencil } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export default function RoomDetailLoading() {
  const roomBreadcrumb = [
    { label: "Rooms", href: "/admin/rooms" },
    { label: "Loading..." },
  ];

  return (
    <>
      <BreadcrumbSetter items={roomBreadcrumb} />

      <main className="flex flex-col grow p-4 max-w-7xl mx-auto w-full gap-8">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-2/3 max-w-md" />
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <Skeleton className="h-5 w-40" />
            <span className="mx-2">•</span>
            <Users className="h-4 w-4" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>

        <div className="w-full">
          <Skeleton className="w-full h-[400px] rounded-lg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <Skeleton className="h-7 w-40 mb-3" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>

                <Separator />

                <div>
                  <Skeleton className="h-7 w-40 mb-3" />
                  <div className="flex flex-wrap gap-2">
                    {Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <Skeleton
                          key={index}
                          className="h-8 w-24 rounded-full"
                        />
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Skeleton className="h-7 w-52 mb-4" />
              <Table>
                <TableBody>
                  <TableRow className="border-0 hover:bg-transparent">
                    <TableCell className="pl-0 py-2 w-1/3">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Capacity</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      : <Skeleton className="h-4 w-20 inline-block" />
                    </TableCell>
                  </TableRow>

                  <TableRow className="border-0 hover:bg-transparent">
                    <TableCell className="pl-0 py-2 w-1/3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Created by</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 truncate">
                      : <Skeleton className="h-4 w-28 inline-block" />
                    </TableCell>
                  </TableRow>

                  <TableRow className="border-0 hover:bg-transparent">
                    <TableCell className="pl-0 py-2 w-1/3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Created</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      : <Skeleton className="h-4 w-24 inline-block" />
                    </TableCell>
                  </TableRow>

                  <TableRow className="border-0 hover:bg-transparent">
                    <TableCell className="pl-0 py-2 w-1/3">
                      <div className="flex items-center gap-2">
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Updated by</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 truncate">
                      : <Skeleton className="h-4 w-28 inline-block" />
                    </TableCell>
                  </TableRow>

                  <TableRow className="border-0 hover:bg-transparent">
                    <TableCell className="pl-0 py-2 w-1/3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Last updated</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      : <Skeleton className="h-4 w-24 inline-block" />
                    </TableCell>
                  </TableRow>

                  <TableRow className="border-0 hover:bg-transparent">
                    <TableCell className="pl-0 py-2 w-1/3">
                      <span className="font-medium">Status</span>
                    </TableCell>
                    <TableCell className="py-2">
                      :{" "}
                      <Skeleton className="h-5 w-16 rounded-full inline-block" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
