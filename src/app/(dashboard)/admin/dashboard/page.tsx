import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Card } from "@/components/ui/card";
import { Users, Calendar, Building2, ActivitySquare } from "lucide-react";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Typography } from "@/components/ui/typography";

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

// Define the breadcrumbs for this page
const adminBreadcrumbs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Admin Panel" },
];

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <>
      {/* Client component that updates breadcrumbs */}
      <BreadcrumbSetter items={adminBreadcrumbs} />

      <div className="flex flex-col p-6 md:p-8 gap-8">
        <div className="flex flex-col gap-2">
          <Typography variant="h1">Admin Dashboard</Typography>
          <Typography variant="muted">
            Welcome back {session?.user.name}. Here&apos;s what&apos;s happening
            today.
          </Typography>
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
                <Typography
                  as="h3"
                  variant="h3"
                  className="text-xl font-semibold"
                >
                  {stat.value}
                </Typography>
                <Typography variant="muted">{stat.title}</Typography>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <Typography as="h2" variant="h2" className="mb-4">
              Recent Bookings
            </Typography>
            <Typography variant="muted">Coming soon...</Typography>
          </Card>
          <Card className="p-6">
            <Typography as="h2" variant="h2" className="mb-4">
              Room Status
            </Typography>
            <Typography variant="muted">Coming soon...</Typography>
          </Card>
        </div>
      </div>
    </>
  );
}
