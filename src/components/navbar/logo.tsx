import Image from "next/image";

export function Logo() {
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
