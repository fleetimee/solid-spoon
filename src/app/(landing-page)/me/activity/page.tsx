import {
  getActivityFeedData,
  type RecentActivity,
} from "@/features/activity/api/getActivityFeedData";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/lib/icons";
import { formatDateToJakarta } from "@/lib/utils/formatDate"; // Correct function and path
import { auth } from "@/lib/auth"; // Import the configured auth object
import { redirect } from "next/navigation";
import { headers } from "next/headers"; // Import headers function

export default async function ActivityPage() {
  // Get session using the correct method provided
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/auth/login");
  }
  const userId = session.user.id;

  const activityFeedData = await getActivityFeedData(userId);
  const recentActivities = activityFeedData.recentActivity;

  return (
    <TabsContent value="activity" className="pt-6">
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity: RecentActivity) => (
                <Card key={activity.reservation_id}>
                  <CardContent className="flex items-start space-x-4 py-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Icon name="Calendar" className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {activity.reservation_title}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {/* Use formatDateToJakarta */}
                        Booked '{activity.room_name}' from{" "}
                        {formatDateToJakarta(activity.start_time)} to{" "}
                        {formatDateToJakarta(activity.end_time)} (
                        {activity.status})
                      </p>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">
                      {/* Use formatDateToJakarta - TODO: Implement relative time formatting if needed */}
                      {formatDateToJakarta(activity.created_at)}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground">No recent activity.</p>
            )}
          </div>
        </div>
        {/* Usage Statistics section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Usage Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Total Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {activityFeedData.totalBookings}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Favorite Room</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-medium">
                  {activityFeedData.favoriteRooms[0]?.room_name ?? "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {activityFeedData.favoriteRooms[0]?.booking_count ?? 0}{" "}
                  bookings
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TabsContent>
  );
}
