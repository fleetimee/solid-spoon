"use client";

import { Separator } from "@/components/ui/separator";
import {
  DribbbleIcon,
  GithubIcon,
  TwitchIcon,
  TwitterIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const footerSections = [
  {
    title: "Product",
    links: [
      {
        title: "Overview",
        href: "#",
      },
      {
        title: "Features",
        href: "#",
      },
      {
        title: "Solutions",
        href: "#",
      },
      {
        title: "Tutorials",
        href: "#",
      },
      {
        title: "Pricing",
        href: "#",
      },
      {
        title: "Releases",
        href: "#",
      },
    ],
  },
  {
    title: "Company",
    links: [
      {
        title: "About us",
        href: "#",
      },
      {
        title: "Careers",
        href: "#",
      },
      {
        title: "Press",
        href: "#",
      },
      {
        title: "News",
        href: "#",
      },
      {
        title: "Media kit",
        href: "#",
      },
      {
        title: "Contact",
        href: "#",
      },
    ],
  },
  {
    title: "Resources",
    links: [
      {
        title: "Blog",
        href: "#",
      },
      {
        title: "Newsletter",
        href: "#",
      },
      {
        title: "Events",
        href: "#",
      },
      {
        title: "Help centre",
        href: "#",
      },
      {
        title: "Tutorials",
        href: "#",
      },
      {
        title: "Support",
        href: "#",
      },
    ],
  },
  {
    title: "Social",
    links: [
      {
        title: "Twitter",
        href: "#",
      },
      {
        title: "LinkedIn",
        href: "#",
      },
      {
        title: "Facebook",
        href: "#",
      },
      {
        title: "GitHub",
        href: "#",
      },
      {
        title: "AngelList",
        href: "#",
      },
      {
        title: "Dribbble",
        href: "#",
      },
    ],
  },
  {
    title: "Legal",
    links: [
      {
        title: "Terms",
        href: "#",
      },
      {
        title: "Privacy",
        href: "#",
      },
      {
        title: "Cookies",
        href: "#",
      },
      {
        title: "Licenses",
        href: "#",
      },
      {
        title: "Settings",
        href: "#",
      },
      {
        title: "Contact",
        href: "#",
      },
    ],
  },
];

function FooterLogo() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Image
        src="/logo-navbar.png"
        alt="Company Logo"
        width={560}
        height={140}
        className="h-32 w-auto"
        priority
      />
    );
  }

  const logoSrc =
    resolvedTheme === "dark" ? "/logo-navbar-white.png" : "/logo-navbar.png";

  return (
    <Image
      src={logoSrc}
      alt="Company Logo"
      width={560}
      height={140}
      className="h-32 w-auto"
      priority
    />
  );
}

export function Footer() {
  return (
    <footer className="mt-12 xs:mt-20 dark bg-background border-t">
      <div className="max-w-screen-xl mx-auto py-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-x-8 gap-y-10 px-6">
        <div className="col-span-full xl:col-span-2">
          {/* Logo */}
          <FooterLogo />

          <p className="text-muted-foreground">
            Simplifying room reservations for modern workplaces.
          </p>
        </div>

        {footerSections.map(({ title, links }) => (
          <div key={title} className="xl:justify-self-end">
            <h6 className="font-semibold text-foreground">{title}</h6>
            <ul className="mt-6 space-y-4">
              {links.map(({ title, href }) => (
                <li key={title}>
                  <Link
                    href={href}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Separator />
      <div className="max-w-screen-xl mx-auto py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6">
        {/* Copyright */}
        <span className="text-muted-foreground text-center xs:text-start">
          &copy; {new Date().getFullYear()}{" "}
          <Link href="https://shadcnui-blocks.com" target="_blank">
            Shadcn UI Blocks
          </Link>
          . All rights reserved.
        </span>

        <div className="flex items-center gap-5 text-muted-foreground">
          <Link href="#" target="_blank">
            <TwitterIcon className="h-5 w-5" />
          </Link>
          <Link href="#" target="_blank">
            <DribbbleIcon className="h-5 w-5" />
          </Link>
          <Link href="#" target="_blank">
            <TwitchIcon className="h-5 w-5" />
          </Link>
          <Link href="#" target="_blank">
            <GithubIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
