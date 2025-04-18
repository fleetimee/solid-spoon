import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const metadata = {
  title: "Admin Dashboard",
  description: "Administration panel for managing the application",
};

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log("Session:", session);
  return (
    <main className="flex flex-col p-8">
      <h1 className="text-3xl font-semibold mb-4">Admin Dashboard</h1>
      <p className="text-gray-600">
        Welcome to the administration area. Use the menu on the left to manage
        users, settings, and more.
      </p>
      {/* Add your admin widgets or subcomponents here */}
    </main>
  );
}
