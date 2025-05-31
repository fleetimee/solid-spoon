import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({ width = 560, height = 140, className }: LogoProps) {
  return (
    <Image
      src="/logo-navbar.png"
      alt="Company Logo"
      width={width}
      height={height}
      className={cn("h-32 w-auto", className)}
      priority
    />
  );
}
