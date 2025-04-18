import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Card } from "@/components/ui/card";
import { Users, Calendar, Building2, ActivitySquare } from "lucide-react";

export const metadata = {
  title: "Admin Dashboard",
  description: "Administration panel for managing the application",
};

const statsCards = [
  {
    title: "Total Users",
    value: "1,234",
    icon: Users,
    trend: "+12%",
  },
  {
    title: "Active Bookings",
    value: "156",
    icon: Calendar,
    trend: "+5%",
  },
  {
    title: "Available Rooms",
    value: "42",
    icon: Building2,
    trend: "0%",
  },
  {
    title: "Monthly Activity",
    value: "2.1k",
    icon: ActivitySquare,
    trend: "+18%",
  },
];

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <main className="flex flex-col p-6 md:p-8 gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back {session?.user.name}. Here&apos;s what&apos;s happening
          today.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <stat.icon className="h-5 w-5 text-muted-foreground" />
              <span
                className={`text-sm ${
                  stat.trend.startsWith("+")
                    ? "text-green-500"
                    : stat.trend === "0%"
                      ? "text-muted-foreground"
                      : "text-red-500"
                }`}
              >
                {stat.trend}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-semibold">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
          <p className="text-muted-foreground">Coming soon...</p>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Room Status</h2>
          <p className="text-muted-foreground">Coming soon...</p>
        </Card>
      </div>
    </main>
  );
}
