import { TabsContent } from "@/components/ui/tabs";
import { DashboardHeader } from "@/features/admin/components/dashboard-header";
import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ActivityLoading() {
  return (
    <TabsContent value="activity" className="pt-6">
      <div className="space-y-8">
        {/* Header Section */}
        <DashboardHeader
          title="Aktivitas"
          description="Pantau semua aktivitas booking dan statistik penggunaan ruangan Anda"
          icon={Activity}
        />

        {/* Recent Activity Section Loading */}
        <div className="relative">
          {/* Gradient background decoration */}
          <div className="absolute -inset-1 bg-gradient-to-r from-slate-500/10 to-blue-500/10 rounded-xl blur-sm" />

          <div className="relative backdrop-blur-md bg-white/60 dark:bg-black/30 border border-white/20 rounded-xl p-6 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500/10 to-blue-500/10 mr-3">
                <Skeleton className="h-6 w-6 bg-slate-300 dark:bg-slate-600" />
              </div>
              <Skeleton className="h-8 w-48 bg-gradient-to-r from-slate-300 to-blue-300 dark:from-slate-600 dark:to-blue-600" />
            </div>

            <div className="space-y-4">
              {/* Recent activity card skeletons */}
              {[...Array(5)].map((_, i) => (
                <Card
                  key={i}
                  className="backdrop-blur-md bg-white/80 dark:bg-black/40 border-white/30 shadow-lg animate-pulse"
                >
                  <CardContent className="flex items-start space-x-4 py-6">
                    {/* Icon skeleton */}
                    <div className="relative">
                      <div className="rounded-full bg-gradient-to-br from-slate-500/10 to-blue-500/10 p-3 backdrop-blur-sm border border-white/20">
                        <Skeleton className="h-6 w-6 bg-slate-300 dark:bg-slate-600" />
                      </div>
                    </div>

                    {/* Content skeleton */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <Skeleton className="h-6 w-48 bg-slate-300 dark:bg-slate-600" />
                        <Skeleton className="h-6 w-20 bg-slate-300 dark:bg-slate-600 rounded-full" />
                      </div>
                      <div className="space-y-2 mb-3">
                        <Skeleton className="h-4 w-full bg-slate-200 dark:bg-slate-700" />
                        <Skeleton className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700" />
                      </div>
                      <Skeleton className="h-3 w-32 bg-slate-200 dark:bg-slate-700" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Usage Statistics & Favorite Rooms Chart Section Loading */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Statistics Cards Loading */}
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 mr-3">
                <Skeleton className="h-6 w-6 bg-emerald-300 dark:bg-emerald-600" />
              </div>
              <Skeleton className="h-8 w-56 bg-gradient-to-r from-emerald-300 to-teal-300 dark:from-emerald-600 dark:to-teal-600" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Stats Card Skeletons */}
              {[...Array(2)].map((_, i) => (
                <Card
                  key={i}
                  className="backdrop-blur-md bg-white/80 dark:bg-black/40 border-white/30 shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-lg" />
                  <CardHeader className="pb-2 relative">
                    <div className="flex items-center">
                      <Skeleton className="w-4 h-4 mr-2 bg-blue-300 dark:bg-blue-600" />
                      <Skeleton className="h-5 w-24 bg-slate-300 dark:bg-slate-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <Skeleton className="h-10 w-16 bg-gradient-to-r from-blue-300 to-indigo-300 dark:from-blue-600 dark:to-indigo-600 mb-2" />
                    <Skeleton className="h-3 w-20 bg-slate-200 dark:bg-slate-700" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Favorite Rooms Chart Loading */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl blur-sm" />

            <div className="relative backdrop-blur-md bg-white/60 dark:bg-black/30 border border-white/20 rounded-xl p-6 shadow-xl">
              <div className="flex items-center mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 mr-3">
                  <Skeleton className="h-6 w-6 bg-purple-300 dark:bg-purple-600" />
                </div>
                <Skeleton className="h-8 w-52 bg-gradient-to-r from-purple-300 to-pink-300 dark:from-purple-600 dark:to-pink-600" />
              </div>

              {/* Chart skeleton */}
              <div className="space-y-4">
                <Skeleton className="h-64 w-full bg-slate-200 dark:bg-slate-700 rounded-lg" />
                <div className="flex justify-center space-x-4">
                  <Skeleton className="h-4 w-16 bg-slate-200 dark:bg-slate-700" />
                  <Skeleton className="h-4 w-20 bg-slate-200 dark:bg-slate-700" />
                  <Skeleton className="h-4 w-18 bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Booking Trend Chart Loading */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl blur-sm" />

          <div className="relative backdrop-blur-md bg-white/60 dark:bg-black/30 border border-white/20 rounded-xl p-6 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 mr-3">
                <Skeleton className="h-6 w-6 bg-green-300 dark:bg-green-600" />
              </div>
              <Skeleton className="h-8 w-56 bg-gradient-to-r from-green-300 to-emerald-300 dark:from-green-600 dark:to-emerald-600" />
            </div>

            {/* Monthly chart skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-80 w-full bg-slate-200 dark:bg-slate-700 rounded-lg" />
              <div className="flex justify-between px-4">
                {[...Array(12)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-3 w-6 bg-slate-200 dark:bg-slate-700"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reservation Status Distribution Chart Loading */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl blur-sm" />

          <div className="relative backdrop-blur-md bg-white/60 dark:bg-black/30 border border-white/20 rounded-xl p-6 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/10 to-red-500/10 mr-3">
                <Skeleton className="h-6 w-6 bg-orange-300 dark:bg-orange-600" />
              </div>
              <Skeleton className="h-8 w-64 bg-gradient-to-r from-orange-300 to-red-300 dark:from-orange-600 dark:to-red-600" />
            </div>

            {/* Pie chart skeleton */}
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1 flex justify-center">
                <Skeleton className="h-64 w-64 bg-slate-200 dark:bg-slate-700 rounded-full" />
              </div>
              <div className="flex-1 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Skeleton className="h-4 w-4 bg-slate-300 dark:bg-slate-600 rounded-full" />
                    <Skeleton className="h-4 w-20 bg-slate-200 dark:bg-slate-700" />
                    <Skeleton className="h-4 w-12 bg-slate-200 dark:bg-slate-700" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  );
}
