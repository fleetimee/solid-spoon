"use client";
import { TabsContent } from "@/components/ui/tabs";
import {
  ChangeEmailCard,
  ChangePasswordCard,
  DeleteAccountCard,
  SessionsCard,
  UpdateAvatarCard,
} from "@daveyplate/better-auth-ui";

export default function SettingsPage() {
  return (
    <TabsContent value="settings" className="pt-6">
      <div className="flex flex-col gap-6">
        <UpdateAvatarCard />
        <SessionsCard />
        <ChangeEmailCard />
        <ChangePasswordCard />
        <DeleteAccountCard />
      </div>
    </TabsContent>
  );
}
