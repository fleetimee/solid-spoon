"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({ width = 560, height = 140, className }: LogoProps) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Link href="/" className="cursor-pointer">
        <Image
          src="/logo-navbar.png"
          alt="Company Logo"
          width={width}
          height={height}
          className={cn("h-32 w-auto", className)}
          priority
        />
      </Link>
    );
  }

  const logoSrc =
    resolvedTheme === "dark" ? "/logo-navbar-white.png" : "/logo-navbar.png";

  return (
    <Link href="/" className="cursor-pointer">
      <Image
        src={logoSrc}
        alt="Company Logo"
        width={width}
        height={height}
        className={cn("h-32 w-auto", className)}
        priority
      />
    </Link>
  );
}
