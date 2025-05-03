"use client";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/lib/icons";

export default function BookingsPage() {
  return (
    <TabsContent value="bookings" className="pt-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardContent className="p-0">
              <div className="grid grid-cols-[12px_1fr] sm:grid-cols-[12px_3fr_1fr_1fr_1fr] gap-4 p-4">
                <div className="w-2 h-full self-stretch bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Conference Room A</div>
                  <div className="text-sm text-muted-foreground">
                    Team Meeting
                  </div>
                </div>
                <div className="hidden sm:block text-sm">
                  Today, 14:00-15:00
                </div>
                <div className="hidden sm:block text-sm">8 people</div>
                <div className="hidden sm:block text-right">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-0">
              <div className="grid grid-cols-[12px_1fr] sm:grid-cols-[12px_3fr_1fr_1fr_1fr] gap-4 p-4">
                <div className="w-2 h-full self-stretch bg-blue-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Meeting Room B</div>
                  <div className="text-sm text-muted-foreground">
                    Client Presentation
                  </div>
                </div>
                <div className="hidden sm:block text-sm">
                  Tomorrow, 10:00-11:30
                </div>
                <div className="hidden sm:block text-sm">4 people</div>
                <div className="hidden sm:block text-right">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-0">
              <div className="grid grid-cols-[12px_1fr] sm:grid-cols-[12px_3fr_1fr_1fr_1fr] gap-4 p-4">
                <div className="w-2 h-full self-stretch bg-purple-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Quiet Pod 3</div>
                  <div className="text-sm text-muted-foreground">
                    Focus Work
                  </div>
                </div>
                <div className="hidden sm:block text-sm">
                  May 2, 09:00-12:00
                </div>
                <div className="hidden sm:block text-sm">1 person</div>
                <div className="hidden sm:block text-right">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-4 text-center">
          <Button variant="outline">
            View All Bookings
            <Icon name="Calendar" className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </TabsContent>
  );
}
