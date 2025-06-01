import { cn } from "@/lib/utils";

// Reusable shimmer skeleton components for consistent loading states

interface ShimmerSkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

// Base shimmer skeleton wrapper
export function ShimmerSkeleton({ className, children }: ShimmerSkeletonProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      {children}
    </div>
  );
}

// Header icon skeleton with purple gradient
export function HeaderIconSkeleton() {
  return (
    <ShimmerSkeleton className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 shadow-lg" />
  );
}

// Title skeleton with gradient background
export function TitleSkeleton({ width = "w-48" }: { width?: string }) {
  return (
    <ShimmerSkeleton
      className={cn(
        "h-8 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 rounded-lg mb-2",
        width
      )}
    />
  );
}

// Description skeleton
export function DescriptionSkeleton({ width = "w-64" }: { width?: string }) {
  return (
    <ShimmerSkeleton
      className={cn(
        "h-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950 rounded-md",
        width
      )}
    />
  );
}

// Stats card icon skeleton with custom gradient
export function StatsCardIconSkeleton({ gradient }: { gradient: string }) {
  return (
    <ShimmerSkeleton
      className={cn(
        "w-10 h-10 rounded-full shadow-md bg-gradient-to-br",
        gradient
      )}
    />
  );
}

// Generic content skeleton
export function ContentSkeleton({
  height = "h-4",
  width = "w-full",
  opacity = "from-current/20 to-current/10",
}: {
  height?: string;
  width?: string;
  opacity?: string;
}) {
  return (
    <ShimmerSkeleton
      className={cn("bg-gradient-to-r rounded", height, width, opacity)}
    />
  );
}

// Button skeleton
export function ButtonSkeleton({
  variant = "primary",
  size = "default",
}: {
  variant?: "primary" | "secondary";
  size?: "default" | "sm" | "lg";
}) {
  const sizeClasses = {
    sm: "h-8 px-3",
    default: "h-10 px-4",
    lg: "h-12 px-6",
  };

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900",
    secondary: "bg-gradient-to-r from-current/20 to-current/10",
  };

  return (
    <ShimmerSkeleton
      className={cn("rounded-md", sizeClasses[size], variantClasses[variant])}
    />
  );
}

// Badge skeleton with color
export function BadgeSkeleton({
  gradient = "from-emerald-400 to-green-500",
  size = "default",
}: {
  gradient?: string;
  size?: "sm" | "default";
}) {
  const sizeClasses = {
    sm: "h-5 w-12",
    default: "h-6 w-16",
  };

  return (
    <ShimmerSkeleton
      className={cn(
        "rounded-full bg-gradient-to-r",
        sizeClasses[size],
        gradient
      )}
    />
  );
}

// Glassmorphism container skeleton
export function GlassmorphismContainerSkeleton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/10 dark:to-purple-950/10",
        "rounded-xl p-6 shadow-lg border-0 backdrop-blur-sm",
        "border border-violet-200/30 dark:border-violet-800/20",
        className
      )}
    >
      {children}
    </div>
  );
}

// Section divider skeleton
export function SectionDividerSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <ShimmerSkeleton className="w-1 h-6 bg-gradient-to-b from-violet-400 to-purple-500 rounded-full" />
      <ContentSkeleton
        width="w-48"
        height="h-6"
        opacity="from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900"
      />
    </div>
  );
}

// Pagination skeleton
export function PaginationSkeleton() {
  return (
    <div className="flex justify-center items-center space-x-1">
      {[...Array(6)].map((_, i) => (
        <ButtonSkeleton key={i} size="sm" variant="primary" />
      ))}
    </div>
  );
}

// Table row skeleton
export function TableRowSkeleton({
  columns = 6,
  index = 0,
}: {
  columns?: number;
  index?: number;
}) {
  const configs = [
    "from-violet-50/30 to-purple-50/30 dark:from-violet-950/10 dark:to-purple-950/10",
    "from-blue-50/30 to-indigo-50/30 dark:from-blue-950/10 dark:to-indigo-950/10",
    "from-emerald-50/30 to-green-50/30 dark:from-emerald-950/10 dark:to-green-950/10",
    "from-amber-50/30 to-orange-50/30 dark:from-amber-950/10 dark:to-orange-950/10",
  ];

  const config = configs[index % configs.length];

  return (
    <div
      className={cn(
        "grid gap-4 py-3 rounded-lg bg-gradient-to-br",
        config,
        `grid-cols-${columns}`
      )}
    >
      {[...Array(columns)].map((_, i) => (
        <ContentSkeleton key={i} height="h-4" width="w-full" />
      ))}
    </div>
  );
}
