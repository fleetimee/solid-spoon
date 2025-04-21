import {UserForm} from "@/features/users/components/user-form";
import {Metadata} from "next";
import {headers} from "next/headers";
import {auth} from "@/lib/auth";

export const metadata: Metadata = {
    title: "User Management | Capstone Room Reservation",
    description: "View and manage users in the reservation system",
    openGraph: {
        title: "User Management System",
        description: "Browse and manage all users in the reservation system",
        type: "website",
    },
};

export default async function AddUserPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session?.user.role !== "admin") {
        return (
            <div className="p-6">
                <h1 className="text-xl font-semibold">Access Denied</h1>
                <p>You do not have permission to manage users.</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Add New User</h1>
            </div>

            <UserForm/>
        </div>
    );
}