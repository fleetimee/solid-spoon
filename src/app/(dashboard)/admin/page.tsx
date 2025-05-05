import { redirect } from "next/navigation";

export default function AdminRedirect() {
  return redirect("/admin/dashboard");
}
