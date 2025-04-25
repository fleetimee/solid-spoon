import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Admin Notifications | Room Reservation System",
  description: "View and manage system notifications",
};

interface NotificationsPageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    isAlreadyRead?: boolean;
  }>;
}

interface NotificationSearchParams {
  page?: number;
  pageSize?: number;
  isAlreadyRead?: boolean;
}

export default async function NotificationsPage(props: NotificationsPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const searchParams = await props.searchParams;
  const parsedSearchParams: NotificationSearchParams = {
    page: searchParams.page ? parseInt(searchParams.page) : undefined,
    pageSize: searchParams.pageSize
      ? parseInt(searchParams.pageSize)
      : undefined,
  };

  const currentLoggedInUser = session?.user.id;

  return (
    <main className="flex flex-col grow p-4 md:p-8">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">
          View and manage system notifications
        </p>
      </div>
    </main>
  );
}
