"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function SheetLogo() {
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
          width={500}
          height={500}
          className="h-30 w-auto object-contain"
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
        width={500}
        height={500}
        className="h-30 w-auto object-contain"
        priority
      />
    </Link>
  );
}
