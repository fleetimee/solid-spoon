"use client";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/lib/icons";

export default function ActivityPage() {
  return (
    <TabsContent value="activity" className="pt-6">
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="flex items-start space-x-4 py-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Icon name="Calendar" className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Room Booking Confirmed</div>
                    <p className="text-sm text-muted-foreground">
                      Conference Room A booked for{" "}
                      {i === 1 ? "today" : `${i} days ago`}
                    </p>
                  </div>
                  <div className="ml-auto text-xs text-muted-foreground">
                    {i === 1 ? "Just now" : `${i} days ago`}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Usage Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Total Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Favorite Room</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-medium">Conference Room A</div>
                <p className="text-xs text-muted-foreground">14 bookings</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TabsContent>
  );
}
