import { authViewPaths } from "@daveyplate/better-auth-ui/server";
import { AuthView } from "./view";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export function generateStaticParams() {
  return Object.values(authViewPaths).map((pathname) => ({ pathname }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pathname: string }>;
}): Promise<Metadata> {
  const { pathname } = await params;

  // Define metadata for different auth actions
  const authMetadata = {
    "sign-in": {
      title: "Masuk - Capstone Room Reservation",
      description:
        "Masuk ke akun Anda untuk mengakses sistem reservasi ruangan dan mengelola booking Anda.",
    },
    "forgot-password": {
      title: "Lupa Kata Sandi - Capstone Room Reservation",
      description:
        "Reset kata sandi akun Anda untuk kembali mengakses sistem reservasi ruangan.",
    },
    "reset-password": {
      title: "Reset Kata Sandi - Capstone Room Reservation",
      description:
        "Buat kata sandi baru untuk akun Anda di sistem reservasi ruangan.",
    },
    "verify-email": {
      title: "Verifikasi Email - Capstone Room Reservation",
      description:
        "Verifikasi alamat email Anda untuk mengaktifkan akun di sistem reservasi ruangan.",
    },
  };

  const defaultMeta = {
    title: "Autentikasi - Capstone Room Reservation",
    description: "Proses autentikasi untuk mengakses sistem reservasi ruangan.",
  };

  const currentMeta =
    authMetadata[pathname as keyof typeof authMetadata] || defaultMeta;

  return {
    title: currentMeta.title,
    description: currentMeta.description,
    keywords: [
      "login",
      "masuk",
      "autentikasi",
      "akun",
      "reservasi ruangan",
      "capstone",
      "Indonesia",
    ],
    openGraph: {
      title: currentMeta.title,
      description: currentMeta.description,
      type: "website",
      locale: "id_ID",
      url: `/auth/${pathname}`,
      siteName: "Capstone Room Reservation",
      images: [
        {
          url: "/auth-og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Capstone Room Reservation - Sistem Autentikasi",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: currentMeta.title,
      description: currentMeta.description,
      images: ["/auth-og-image.jpg"],
    },
    robots: {
      index: false, // Auth pages should not be indexed
      follow: false,
    },
    alternates: {
      canonical: `/auth/${pathname}`,
    },
  };
}

export default async function AuthPage({
  params,
}: {
  params: Promise<{ pathname: string }>;
}) {
  const { pathname } = await params;

  // Redirect sign-up attempts to home page since registration is disabled
  if (pathname === "sign-up") {
    redirect("/");
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }

  return <AuthView pathname={pathname} />;
}
