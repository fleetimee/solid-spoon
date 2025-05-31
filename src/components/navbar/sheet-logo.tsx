import Image from "next/image";

export function SheetLogo() {
  return (
    <Image
      src="/logo-navbar.png"
      alt="Company Logo"
      width={500}
      height={500}
      className="h-30 w-auto object-contain"
      priority
    />
  );
}
