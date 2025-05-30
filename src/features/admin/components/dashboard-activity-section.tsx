import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Users2,
  Bell,
  Sparkles,
  Activity,
  ListChecks,
} from "lucide-react";
import Link from "next/link";

export interface ActivityFeedItem {
  id: string;
  message: string;
  timestamp: Date;
}

export interface DashboardActivitySectionProps {
  activityFeedData: ActivityFeedItem[];
}

function ActivityLoadingSkeleton() {
  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-gray-500">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex justify-between items-center py-2 px-3 rounded-lg bg-white/50 dark:bg-gray-800/50"
          >
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function RecentActivityCard({
  activityFeedData,
}: {
  activityFeedData: ActivityFeedItem[];
}) {
  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-gray-500 shadow-md">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-slate-800 dark:text-slate-200">
              Recent Activity
            </CardTitle>
            <CardDescription>Latest events in the system</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {activityFeedData.length > 0 ? (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {activityFeedData.map((activity, index) => (
              <div
                key={activity.id}
                className={`flex justify-between items-start p-3 rounded-lg hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors duration-200 ${
                  index % 2 === 0
                    ? "bg-white/50 dark:bg-gray-800/50"
                    : "bg-gray-50/50 dark:bg-gray-700/50"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                    {activity.message}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {activity.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground font-medium">
              No recent activity
            </p>
            <p className="text-xs text-muted-foreground/70">
              System events will appear here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function QuickActionsCard() {
  const quickActions = [
    {
      href: "/admin/rooms/reservations",
      icon: ListChecks,
      title: "Manage Pending",
      description: "Review reservations",
      gradient:
        "from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 dark:from-amber-950/20 dark:to-orange-950/20",
      iconGradient: "from-amber-400 to-orange-500",
      borderColor: "border-amber-200 dark:border-amber-800",
      titleColor: "text-amber-800 dark:text-amber-200",
      descriptionColor: "text-amber-600 dark:text-amber-400",
    },
    {
      href: "/admin/rooms/add",
      icon: Plus,
      title: "Add New Room",
      description: "Create room listing",
      gradient:
        "from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 dark:from-emerald-950/20 dark:to-green-950/20",
      iconGradient: "from-emerald-400 to-green-500",
      borderColor: "border-emerald-200 dark:border-emerald-800",
      titleColor: "text-emerald-800 dark:text-emerald-200",
      descriptionColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      href: "/admin/users",
      icon: Users2,
      title: "View All Users",
      description: "Manage user accounts",
      gradient:
        "from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20",
      iconGradient: "from-blue-400 to-indigo-500",
      borderColor: "border-blue-200 dark:border-blue-800",
      titleColor: "text-blue-800 dark:text-blue-200",
      descriptionColor: "text-blue-600 dark:text-blue-400",
    },
    {
      href: "/admin/notifications",
      icon: Bell,
      title: "View Notifications",
      description: "Check system alerts",
      gradient:
        "from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 dark:from-violet-950/20 dark:to-purple-950/20",
      iconGradient: "from-violet-400 to-purple-500",
      borderColor: "border-violet-200 dark:border-violet-800",
      titleColor: "text-violet-800 dark:text-violet-200",
      descriptionColor: "text-violet-600 dark:text-violet-400",
    },
  ];

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 shadow-md">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-purple-800 dark:text-purple-200">
              Quick Actions
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.href}
              asChild
              variant="outline"
              className={`w-full justify-start h-12 text-left ${action.borderColor} bg-gradient-to-r ${action.gradient} transition-all duration-200 hover:scale-[1.02] hover:shadow-md`}
            >
              <Link href={action.href} className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br ${action.iconGradient}`}
                >
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="text-left">
                  <div className={`font-medium ${action.titleColor}`}>
                    {action.title}
                  </div>
                  <div className={`text-xs ${action.descriptionColor}`}>
                    {action.description}
                  </div>
                </div>
              </Link>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function DashboardActivitySection({
  activityFeedData,
}: DashboardActivitySectionProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
        <h2 className="text-xl font-semibold">Activity & Quick Actions</h2>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <div className="min-w-0">
          <Suspense fallback={<ActivityLoadingSkeleton />}>
            <RecentActivityCard activityFeedData={activityFeedData} />
          </Suspense>
        </div>

        <div className="min-w-0">
          <QuickActionsCard />
        </div>
      </div>
    </div>
  );
}
