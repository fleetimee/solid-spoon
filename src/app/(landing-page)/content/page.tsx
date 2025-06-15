import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { ContentHeader } from "@/features/content/components/content-header";
import { ContentRenderer } from "@/features/content/components/content-renderer";
import { contentData } from "@/features/content/data/content-data";
import { ContentType } from "@/features/content/types/content";

interface ContentPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Define valid content types mapping
const validContentTypes: Record<string, ContentType> = {
  "syarat-dan-ketentuan": "syarat-dan-ketentuan",
  "kebijakan-privasi": "kebijakan-privasi",
  "kebijakan-cookie": "kebijakan-cookie",
  keamanan: "keamanan",
  "hubungi-kami": "hubungi-kami",
};

// Generate metadata based on content type
export async function generateMetadata({
  searchParams,
}: ContentPageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const contentTypeKey = Object.keys(resolvedSearchParams)[0];
  const contentType = validContentTypes[contentTypeKey];

  if (!contentType) {
    return {
      title: "Halaman Tidak Ditemukan",
      description: "Halaman yang Anda cari tidak tersedia.",
    };
  }

  const data = contentData[contentType];

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description,
    },
  };
}

export default async function ContentPage({ searchParams }: ContentPageProps) {
  const resolvedSearchParams = await searchParams;

  // Get the first search parameter key as content type
  const contentTypeKey = Object.keys(resolvedSearchParams)[0];
  const contentType = validContentTypes[contentTypeKey];

  // If no valid content type is found, return 404
  if (!contentType) {
    notFound();
  }

  const data = contentData[contentType];

  // Generate breadcrumb based on content type
  const getBreadcrumbTitle = (type: ContentType): string => {
    switch (type) {
      case "syarat-dan-ketentuan":
        return "Syarat Layanan";
      case "kebijakan-privasi":
        return "Kebijakan Privasi";
      case "kebijakan-cookie":
        return "Kebijakan Cookie";
      case "keamanan":
        return "Keamanan";
      case "hubungi-kami":
        return "Hubungi Kami";
      default:
        return "Konten";
    }
  };

  return (
    <>
      <BreadcrumbSetter
        items={[
          { label: "Beranda", href: "/" },
          {
            label: getBreadcrumbTitle(contentType),
            href: `/content?${contentTypeKey}`,
          },
        ]}
      />

      <main className="flex flex-col grow p-3 sm:p-4 md:p-8 min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30">
        <div className="max-w-screen-xl mx-auto w-full px-3 sm:px-6">
          {/* Header Section */}
          <div className="mb-12">
            <ContentHeader
              title={data.title}
              description={data.description}
              lastUpdated={data.lastUpdated}
            />
          </div>

          {/* Content Section */}
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-white/20 shadow-xl">
            <CardContent className="p-8 lg:p-12">
              <ContentRenderer sections={data.content} />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
