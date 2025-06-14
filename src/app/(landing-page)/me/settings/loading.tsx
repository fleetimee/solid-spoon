import { TabsContent } from "@/components/ui/tabs";
import { DashboardHeader } from "@/features/admin/components/dashboard-header";
import { Settings } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <TabsContent value="settings" className="pt-6">
      <div className="space-y-6">
        <DashboardHeader
          title="Pengaturan"
          description="Kelola profil, keamanan, dan preferensi akun Anda"
          icon={Settings}
        />

        <div className="flex flex-col gap-6">
          {/* Update Avatar Card Loading */}
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-6 w-6 bg-slate-300 dark:bg-slate-600" />
                <Skeleton className="h-6 w-32 bg-slate-300 dark:bg-slate-600" />
              </div>
              <Skeleton className="h-4 w-64 bg-slate-200 dark:bg-slate-700" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {/* Avatar skeleton */}
                <div className="flex-shrink-0">
                  <Skeleton className="h-20 w-20 bg-slate-300 dark:bg-slate-600 rounded-full" />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16 bg-slate-200 dark:bg-slate-700" />
                    <Skeleton className="h-10 w-full max-w-sm bg-slate-200 dark:bg-slate-700" />
                  </div>
                  <div className="flex gap-3">
                    <Skeleton className="h-9 w-24 bg-slate-300 dark:bg-slate-600" />
                    <Skeleton className="h-9 w-20 bg-slate-200 dark:bg-slate-700" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sessions Card Loading */}
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-6 w-6 bg-slate-300 dark:bg-slate-600" />
                <Skeleton className="h-6 w-24 bg-slate-300 dark:bg-slate-600" />
              </div>
              <Skeleton className="h-4 w-80 bg-slate-200 dark:bg-slate-700" />
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current session skeleton */}
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-green-50 dark:bg-green-950/20">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4 bg-green-300 dark:bg-green-600" />
                      <Skeleton className="h-4 w-20 bg-green-300 dark:bg-green-600" />
                    </div>
                    <Skeleton className="h-4 w-40 bg-slate-200 dark:bg-slate-700" />
                    <Skeleton className="h-3 w-32 bg-slate-200 dark:bg-slate-700" />
                  </div>
                </div>
              </div>

              {/* Other sessions skeletons */}
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-40 bg-slate-200 dark:bg-slate-700" />
                      <Skeleton className="h-3 w-32 bg-slate-200 dark:bg-slate-700" />
                    </div>
                    <Skeleton className="h-8 w-16 bg-red-300 dark:bg-red-600" />
                  </div>
                </div>
              ))}

              <div className="pt-4">
                <Skeleton className="h-9 w-40 bg-slate-300 dark:bg-slate-600" />
              </div>
            </CardContent>
          </Card>

          {/* Change Email Card Loading */}
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-6 w-6 bg-slate-300 dark:bg-slate-600" />
                <Skeleton className="h-6 w-28 bg-slate-300 dark:bg-slate-600" />
              </div>
              <Skeleton className="h-4 w-72 bg-slate-200 dark:bg-slate-700" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20 bg-slate-200 dark:bg-slate-700" />
                  <Skeleton className="h-10 w-full bg-slate-200 dark:bg-slate-700" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-slate-200 dark:bg-slate-700" />
                  <Skeleton className="h-10 w-full bg-slate-200 dark:bg-slate-700" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 bg-slate-200 dark:bg-slate-700" />
                  <Skeleton className="h-10 w-full bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
              <div className="flex justify-end">
                <Skeleton className="h-9 w-32 bg-slate-300 dark:bg-slate-600" />
              </div>
            </CardContent>
          </Card>

          {/* Change Password Card Loading */}
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-6 w-6 bg-slate-300 dark:bg-slate-600" />
                <Skeleton className="h-6 w-32 bg-slate-300 dark:bg-slate-600" />
              </div>
              <Skeleton className="h-4 w-68 bg-slate-200 dark:bg-slate-700" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28 bg-slate-200 dark:bg-slate-700" />
                  <Skeleton className="h-10 w-full bg-slate-200 dark:bg-slate-700" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 bg-slate-200 dark:bg-slate-700" />
                  <Skeleton className="h-10 w-full bg-slate-200 dark:bg-slate-700" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-36 bg-slate-200 dark:bg-slate-700" />
                  <Skeleton className="h-10 w-full bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
              <div className="flex justify-end">
                <Skeleton className="h-9 w-32 bg-slate-300 dark:bg-slate-600" />
              </div>
            </CardContent>
          </Card>

          {/* Delete Account Card Loading */}
          <Card className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-6 w-6 bg-red-300 dark:bg-red-600" />
                <Skeleton className="h-6 w-28 bg-red-300 dark:bg-red-600" />
              </div>
              <Skeleton className="h-4 w-96 bg-red-200 dark:bg-red-700" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-100 dark:bg-red-950/40">
                <div className="flex items-start space-x-3">
                  <Skeleton className="h-5 w-5 bg-red-400 dark:bg-red-500 mt-0.5" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full bg-red-200 dark:bg-red-700" />
                    <Skeleton className="h-4 w-3/4 bg-red-200 dark:bg-red-700" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40 bg-slate-200 dark:bg-slate-700" />
                  <Skeleton className="h-10 w-full bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
              <div className="flex justify-end">
                <Skeleton className="h-9 w-32 bg-red-300 dark:bg-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TabsContent>
  );
}
