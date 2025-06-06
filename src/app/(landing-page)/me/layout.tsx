"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageZoom } from "@/components/ui/kibo-ui/image-zoom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";

export default function MeLayout({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const segment = useSelectedLayoutSegment();
  const activeTab = segment ?? "activity";
  const breadcrumbItems = [
    { label: "Beranda", href: "/" },
    { label: "Profil Saya" },
  ];

  // Enhanced loading state with modern animations
  if (isPending) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 pb-16 pt-8 space-y-8">
        {/* Modern animated loading skeleton */}
        <div className="relative mb-20">
          <Skeleton className="h-48 w-full rounded-xl bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 animate-pulse" />
          <div className="absolute -bottom-12 left-6 flex items-center space-x-4">
            <Skeleton className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 animate-pulse" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32 bg-gradient-to-r from-slate-200 to-slate-300 animate-pulse" />
              <Skeleton className="h-4 w-24 bg-gradient-to-r from-slate-200 to-slate-300 animate-pulse" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-64 w-full col-span-1 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse" />
          <Skeleton className="h-96 w-full col-span-1 md:col-span-3 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <>
      <BreadcrumbSetter items={breadcrumbItems} />

      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-br from-slate-100/30 to-blue-100/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gradient-to-tr from-gray-100/30 to-violet-100/30 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-screen-xl mx-auto px-6 pb-16 pt-8 relative">
        {/* Enhanced Header with Glass Morphism */}
        <div className="relative mb-20 group">
          {/* Main gradient background with professional colors */}
          <div className="w-full h-56 bg-gradient-to-br from-slate-600 via-blue-600 to-violet-600 rounded-2xl shadow-2xl relative overflow-hidden">
            {/* Subtle floating orbs for visual appeal */}
            <div className="absolute top-4 right-8 w-16 h-16 bg-white/8 rounded-full blur-sm animate-pulse" />
            <div className="absolute bottom-6 right-20 w-8 h-8 bg-white/15 rounded-full animate-bounce delay-300" />
            <div className="absolute top-12 left-20 w-4 h-4 bg-blue-200/20 rounded-full animate-ping delay-700" />

            {/* Glass morphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,_white_1px,_transparent_1px)] bg-[length:20px_20px] animate-pulse" />
            </div>
          </div>

          {/* Enhanced Profile Section */}
          <div className="absolute -bottom-16 left-6 flex items-end space-x-6">
            {/* Glass morphism avatar container */}
            <div className="relative group/avatar">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-400 to-blue-400 rounded-full blur-lg opacity-40 group-hover/avatar:opacity-60 transition-opacity duration-300" />

              {/* Conditional rendering based on whether user has an image */}
              {session?.user?.image ? (
                <ImageZoom
                  className="relative rounded-full"
                  backdropClassName="backdrop-blur-xl"
                >
                  <img
                    src={session.user.image}
                    alt={session?.user?.name ?? "Avatar Pengguna"}
                    className="relative border-4 border-white/50 backdrop-blur-sm shadow-2xl group-hover/avatar:scale-105 transition-transform duration-300 cursor-zoom-in rounded-full object-cover"
                    style={{
                      width: "112px",
                      height: "112px",
                      minWidth: "112px",
                      minHeight: "112px",
                    }}
                  />
                </ImageZoom>
              ) : (
                <Avatar className="relative h-28 w-28 border-4 border-white/50 backdrop-blur-sm shadow-2xl group-hover/avatar:scale-105 transition-transform duration-300">
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-slate-500 to-blue-500 text-white">
                    {session?.user?.name?.charAt(0) ?? "U"}
                  </AvatarFallback>
                </Avatar>
              )}

              {/* Online status indicator */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-3 border-white rounded-full shadow-lg animate-pulse" />
            </div>

            {/* Enhanced name section with glass morphism */}
            <div className="pb-4 hidden sm:block">
              <div className="backdrop-blur-md bg-white/10 border border-white/20 px-6 py-3 rounded-xl shadow-xl hover:bg-white/20 transition-all duration-300">
                <h1 className="text-3xl font-bold text-white drop-shadow-lg tracking-tight">
                  {session?.user?.name ?? "Nama Pengguna"}
                </h1>
                <p className="text-sm text-white/90 drop-shadow-md font-medium mt-1">
                  {session?.user?.email ?? "Tidak ada email"}
                </p>
                {/* Floating badge */}
                <div className="mt-2">
                  <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <Icon name="Star" className="w-3 h-3 mr-1" />
                    Anggota Aktif
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile name section */}
        <div className="sm:hidden mb-8 mt-16 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-600 to-blue-600 bg-clip-text text-transparent">
            {session?.user?.name ?? "Nama Pengguna"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {session?.user?.email ?? "Tidak ada email"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Enhanced Side Profile Card */}
          <div className="col-span-1">
            <Card className="backdrop-blur-md bg-white/80 dark:bg-black/40 border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] group">
              {/* Gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-500/15 to-blue-500/15 rounded-lg blur-sm group-hover:blur-none transition-all duration-300" />

              <CardContent className="pt-6 relative z-10">
                <div className="space-y-6">
                  {/* Contact Info */}
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center">
                      <Icon name="User" className="mr-2 h-4 w-4" />
                      Informasi Kontak
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm p-2 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
                        <Icon
                          name="User"
                          className="mr-3 h-4 w-4 text-slate-500"
                        />
                        <span>Anggota Aktif</span>
                      </div>
                      <div className="flex items-center text-sm p-2 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
                        <Icon
                          name="Shield"
                          className="mr-3 h-4 w-4 text-blue-500"
                        />
                        <span>Akun Terverifikasi</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                  {/* Status & Achievements */}
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center">
                      <Icon name="Award" className="mr-2 h-4 w-4" />
                      Status & Pencapaian
                    </h3>
                    <div className="space-y-2">
                      <Badge className="w-full justify-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 py-2">
                        <Icon name="CheckCircle" className="w-4 h-4 mr-2" />
                        Anggota Terverifikasi
                      </Badge>
                      <Badge className="w-full justify-center bg-gradient-to-r from-slate-500 to-blue-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 py-2">
                        <Icon name="Star" className="w-4 h-4 mr-2" />
                        Pengguna Aktif
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Main Content Area */}
          <div className="col-span-1 md:col-span-3">
            <Tabs value={activeTab} className="w-full">
              {/* Modern Tab Navigation */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-500/8 to-blue-500/8 rounded-xl blur-sm" />
                <TabsList className="relative w-full justify-start h-auto p-1 bg-white/60 dark:bg-black/40 backdrop-blur-md border border-white/20 rounded-xl shadow-xl">
                  <TabsTrigger
                    asChild
                    value="activity"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg py-3 px-6 transition-all duration-300 hover:scale-105 font-medium"
                  >
                    <Link href="/me/activity" className="flex items-center">
                      <Icon name="LayoutDashboard" className="h-4 w-4 mr-2" />
                      Aktivitas
                    </Link>
                  </TabsTrigger>
                  <TabsTrigger
                    asChild
                    value="bookings"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg py-3 px-6 transition-all duration-300 hover:scale-105 font-medium"
                  >
                    <Link href="/me/bookings" className="flex items-center">
                      <Icon name="Calendar" className="h-4 w-4 mr-2" />
                      Booking
                    </Link>
                  </TabsTrigger>
                  <TabsTrigger
                    asChild
                    value="settings"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg py-3 px-6 transition-all duration-300 hover:scale-105 font-medium"
                  >
                    <Link href="/me/settings" className="flex items-center">
                      <Icon name="Settings2" className="h-4 w-4 mr-2" />
                      Pengaturan
                    </Link>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Content with glass morphism background */}
              <TabsContent value={activeTab} className="mt-0">
                <div className="backdrop-blur-md bg-white/50 dark:bg-black/20 border border-white/20 rounded-xl shadow-xl p-6 min-h-[400px]">
                  {children}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
