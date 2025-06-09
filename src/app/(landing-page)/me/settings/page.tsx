"use client";
import { TabsContent } from "@/components/ui/tabs";
import {
  ChangeEmailCard,
  ChangePasswordCard,
  DeleteAccountCard,
  SessionsCard,
  UpdateAvatarCard,
} from "@daveyplate/better-auth-ui";
import { DashboardHeader } from "@/features/admin/components/dashboard-header";
import { Settings } from "lucide-react";
// Note: Metadata is handled by the parent layout at /me/layout.tsx
// since this is a client component

export default function SettingsPage() {
  return (
    <TabsContent value="settings" className="pt-6">
      <div className="space-y-6">
        <DashboardHeader
          title="Pengaturan"
          description="Kelola profil, keamanan, dan preferensi akun Anda"
          icon={Settings}
        />
        <div className="flex flex-col gap-6">
          <UpdateAvatarCard />
          <SessionsCard />
          <ChangeEmailCard />
          <ChangePasswordCard />
          <DeleteAccountCard />
        </div>
      </div>
    </TabsContent>
  );
}
