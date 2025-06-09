import React from "react";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ShimmerSkeleton,
  HeaderIconSkeleton,
  TitleSkeleton,
  DescriptionSkeleton,
  StatsCardIconSkeleton,
  ContentSkeleton,
  SectionDividerSkeleton,
  GlassmorphismContainerSkeleton,
} from "@/components/ui/skeleton-components";

const dashboardBreadcrumb = [{ label: "Admin" }, { label: "Dashboard" }];

export default function AdminDashboardLoading() {
  return (
    <>
      <BreadcrumbSetter items={dashboardBreadcrumb} />

      <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8 min-w-0 overflow-x-hidden">
        <DashboardHeaderSkeleton />
        <EnhancedKPICardsSkeleton />
        <CompletionAnalyticsSkeleton />
        <DashboardAnalyticsSkeleton />
        <DashboardActivitySkeleton />
      </div>
    </>
  );
}

// Dashboard Header Skeleton
function DashboardHeaderSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <HeaderIconSkeleton />
      <div>
        <TitleSkeleton width="w-48" />
        <DescriptionSkeleton width="w-64" />
      </div>
    </div>
  );
}

// Enhanced KPI Cards Skeleton with Bento Grid Layout
function EnhancedKPICardsSkeleton() {
  const kpiCardConfigs = [
    {
      bgGradient:
        "from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
      iconBg: "from-amber-400 to-orange-500",
      type: "pending",
    },
    {
      bgGradient:
        "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
      iconBg: "from-blue-400 to-indigo-500",
      type: "users",
    },
    {
      bgGradient:
        "from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20",
      iconBg: "from-emerald-400 to-green-500",
      type: "rooms",
    },
    {
      bgGradient:
        "from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20",
      iconBg: "from-green-400 to-teal-500",
      type: "completed",
    },
    {
      bgGradient:
        "from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20",
      iconBg: "from-purple-400 to-violet-500",
      type: "completion-rate",
      featured: true,
    },
    {
      bgGradient:
        "from-cyan-50 to-sky-50 dark:from-cyan-950/20 dark:to-sky-950/20",
      iconBg: "from-cyan-400 to-sky-500",
      type: "completed-today",
    },
  ];

  const renderKPICard = (config: any, className?: string) => {
    const isCompletionRate = config.type === "completion-rate";
    const cardSizeClass = isCompletionRate
      ? "min-h-[160px]"
      : config.type === "completed" || config.type === "completed-today"
        ? "min-h-[140px]"
        : "min-h-[120px]";

    return (
      <Card
        key={config.type}
        className={cn(
          "group relative overflow-hidden border-0 shadow-lg backdrop-blur-sm",
          "bg-gradient-to-br transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
          config.bgGradient,
          cardSizeClass,
          className
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-current/5 to-current/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
          <CardTitle>
            <ContentSkeleton
              height={isCompletionRate ? "h-4" : "h-3"}
              width={isCompletionRate ? "w-32" : "w-24"}
              opacity="from-current/30 to-current/20"
            />
          </CardTitle>
          <StatsCardIconSkeleton gradient={config.iconBg} />
        </CardHeader>

        <CardContent className="relative">
          <div className="mb-1">
            <ContentSkeleton
              height={isCompletionRate ? "h-10" : "h-8"}
              width={isCompletionRate ? "w-20" : "w-16"}
              opacity="from-current/40 to-current/30"
            />
          </div>
          <div className="flex items-center gap-2">
            <ContentSkeleton
              height="h-4"
              width="w-4"
              opacity="from-current/20 to-current/10"
            />
            <ContentSkeleton
              height="h-3"
              width="w-28"
              opacity="from-current/20 to-current/10"
            />
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {/* Mobile Layout - Stack all cards vertically */}
      <div className="grid gap-4 grid-cols-1 sm:hidden">
        {kpiCardConfigs.map((config) => renderKPICard(config))}
      </div>

      {/* Tablet Layout - 2 columns with strategic placement */}
      <div className="hidden sm:grid lg:hidden gap-4 grid-cols-2">
        {/* Featured completion rate card */}
        {renderKPICard(
          kpiCardConfigs.find((config) => config.type === "completion-rate")!,
          "col-span-2"
        )}

        {/* Other cards in pairs */}
        {renderKPICard(
          kpiCardConfigs.find((config) => config.type === "completed")!
        )}
        {renderKPICard(
          kpiCardConfigs.find((config) => config.type === "completed-today")!
        )}

        {renderKPICard(
          kpiCardConfigs.find((config) => config.type === "pending")!
        )}
        {renderKPICard(
          kpiCardConfigs.find((config) => config.type === "users")!
        )}

        {renderKPICard(
          kpiCardConfigs.find((config) => config.type === "rooms")!,
          "col-span-2"
        )}
      </div>

      {/* Desktop Bento Grid Layout */}
      <div className="hidden lg:grid gap-4 grid-cols-4 grid-rows-3 auto-rows-fr">
        {/* Completion Rate - Featured card (spans 2x2) */}
        {renderKPICard(
          kpiCardConfigs.find((config) => config.type === "completion-rate")!,
          "col-span-2 row-span-2"
        )}

        {/* Total Completed - Top right */}
        {renderKPICard(
          kpiCardConfigs.find((config) => config.type === "completed")!,
          "col-span-2 row-span-1"
        )}

        {/* Completed Today - Middle right */}
        {renderKPICard(
          kpiCardConfigs.find((config) => config.type === "completed-today")!,
          "col-span-2 row-span-1"
        )}

        {/* Bottom row - Equal sized cards */}
        {renderKPICard(
          kpiCardConfigs.find((config) => config.type === "pending")!,
          "col-span-1 row-span-1"
        )}

        {renderKPICard(
          kpiCardConfigs.find((config) => config.type === "users")!,
          "col-span-1 row-span-1"
        )}

        {renderKPICard(
          kpiCardConfigs.find((config) => config.type === "rooms")!,
          "col-span-2 row-span-1"
        )}
      </div>
    </div>
  );
}

// Completion Analytics Section Skeleton
function CompletionAnalyticsSkeleton() {
  return (
    <div className="space-y-8">
      <SectionDividerSkeleton />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Completion Trends Chart */}
        <Card className="col-span-2 border-0 bg-gradient-to-br from-green-50/30 to-teal-50/30 dark:from-green-950/10 dark:to-teal-950/10 shadow-lg backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShimmerSkeleton className="h-5 w-5 bg-gradient-to-r from-green-400 to-green-500 rounded" />
              <TitleSkeleton width="w-56" />
            </div>
            <DescriptionSkeleton width="w-80" />
          </CardHeader>
          <CardContent>
            {/* Chart skeleton */}
            <div className="h-[200px] relative">
              <ShimmerSkeleton className="w-full h-full bg-gradient-to-br from-green-100/50 to-teal-100/50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg">
                {/* Chart bars skeleton */}
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-t from-green-400 to-green-500 rounded-t-md opacity-60"
                      style={{
                        height: `${Math.random() * 80 + 20}%`,
                        width: "12%",
                      }}
                    />
                  ))}
                </div>
              </ShimmerSkeleton>
            </div>
          </CardContent>
        </Card>

        {/* Completion Summary */}
        <Card className="border-0 bg-gradient-to-br from-green-50/30 to-emerald-50/30 dark:from-green-950/10 dark:to-emerald-950/10 shadow-lg backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShimmerSkeleton className="h-5 w-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded" />
              <TitleSkeleton width="w-40" />
            </div>
            <DescriptionSkeleton width="w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <ContentSkeleton
                    width="w-20"
                    height="h-3"
                    opacity="from-current/20 to-current/10"
                  />
                  <ContentSkeleton
                    width="w-8"
                    height="h-4"
                    opacity="from-green-400/30 to-green-500/30"
                  />
                </div>
              ))}
            </div>

            {/* Average completion time section */}
            <div className="pt-4 border-t space-y-2">
              <div className="flex items-center gap-2">
                <ShimmerSkeleton className="h-4 w-4 bg-gradient-to-r from-blue-400 to-blue-500 rounded" />
                <ContentSkeleton
                  width="w-36"
                  height="h-3"
                  opacity="from-current/20 to-current/10"
                />
              </div>
              <ContentSkeleton
                width="w-20"
                height="h-8"
                opacity="from-blue-400/30 to-blue-500/30"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Dashboard Analytics Section Skeleton
function DashboardAnalyticsSkeleton() {
  return (
    <GlassmorphismContainerSkeleton>
      <div className="space-y-6">
        <SectionDividerSkeleton />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Trend Chart */}
          <Card className="col-span-1 lg:col-span-2 border-0 bg-gradient-to-br from-blue-50/20 to-indigo-50/20 dark:from-blue-950/10 dark:to-indigo-950/10">
            <CardHeader>
              <TitleSkeleton width="w-48" />
              <DescriptionSkeleton width="w-64" />
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ShimmerSkeleton className="w-full h-full bg-gradient-to-br from-blue-100/30 to-indigo-100/30 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg" />
              </div>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card className="border-0 bg-gradient-to-br from-purple-50/20 to-pink-50/20 dark:from-purple-950/10 dark:to-pink-950/10">
            <CardHeader>
              <TitleSkeleton width="w-40" />
              <DescriptionSkeleton width="w-48" />
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ShimmerSkeleton className="w-full h-full bg-gradient-to-br from-purple-100/30 to-pink-100/30 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Most Active Rooms */}
          <Card className="border-0 bg-gradient-to-br from-emerald-50/20 to-green-50/20 dark:from-emerald-950/10 dark:to-green-950/10">
            <CardHeader>
              <TitleSkeleton width="w-44" />
              <DescriptionSkeleton width="w-52" />
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ShimmerSkeleton className="w-full h-full bg-gradient-to-br from-emerald-100/30 to-green-100/30 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg" />
              </div>
            </CardContent>
          </Card>

          {/* Room Utilization */}
          <Card className="border-0 bg-gradient-to-br from-amber-50/20 to-orange-50/20 dark:from-amber-950/10 dark:to-orange-950/10">
            <CardHeader>
              <TitleSkeleton width="w-36" />
              <DescriptionSkeleton width="w-44" />
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ShimmerSkeleton className="w-full h-full bg-gradient-to-br from-amber-100/30 to-orange-100/30 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </GlassmorphismContainerSkeleton>
  );
}

// Dashboard Activity Section Skeleton
function DashboardActivitySkeleton() {
  return (
    <GlassmorphismContainerSkeleton>
      <div className="space-y-6">
        <SectionDividerSkeleton />

        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <ActivityItemSkeleton key={i} index={i} />
          ))}
        </div>
      </div>
    </GlassmorphismContainerSkeleton>
  );
}

// Activity Item Skeleton
function ActivityItemSkeleton({ index }: { index: number }) {
  const configs = [
    {
      bgGradient:
        "from-violet-50/60 to-purple-50/60 dark:from-violet-950/20 dark:to-purple-950/20",
      iconBg: "from-violet-400 to-purple-500",
    },
    {
      bgGradient:
        "from-blue-50/60 to-indigo-50/60 dark:from-blue-950/20 dark:to-indigo-950/20",
      iconBg: "from-blue-400 to-indigo-500",
    },
    {
      bgGradient:
        "from-emerald-50/60 to-green-50/60 dark:from-emerald-950/20 dark:to-green-950/20",
      iconBg: "from-emerald-400 to-green-500",
    },
    {
      bgGradient:
        "from-amber-50/60 to-orange-50/60 dark:from-amber-950/20 dark:to-orange-950/20",
      iconBg: "from-amber-400 to-orange-500",
    },
  ];

  const config = configs[index % configs.length];

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-lg bg-gradient-to-br border-0 shadow-sm",
        config.bgGradient
      )}
    >
      <StatsCardIconSkeleton gradient={config.iconBg} />

      <div className="flex-1 space-y-2">
        <ContentSkeleton
          width="w-48"
          height="h-4"
          opacity="from-current/30 to-current/20"
        />
        <ContentSkeleton
          width="w-64"
          height="h-3"
          opacity="from-current/20 to-current/10"
        />
      </div>

      <div className="text-right space-y-1">
        <ContentSkeleton
          width="w-16"
          height="h-3"
          opacity="from-current/20 to-current/10"
        />
        <ContentSkeleton
          width="w-12"
          height="h-5"
          opacity="from-current/20 to-current/10"
        />
      </div>
    </div>
  );
}
