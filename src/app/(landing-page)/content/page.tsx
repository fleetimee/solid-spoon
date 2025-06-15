import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { ContentHeader } from "@/features/content/components/content-header";
import { ContentRenderer } from "@/features/content/components/content-renderer";
import { contentData } from "@/features/content/data/content-data";
import { productContentData } from "@/features/content/data/product-data";
import {
  ContentType,
  ProductContentType,
} from "@/features/content/types/content";

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

// Define valid product content types mapping
const validProductContentTypes: Record<string, ProductContentType> = {
  tentang: "tentang",
  fitur: "fitur",
  "cara-kerja": "cara-kerja",
  bantuan: "bantuan",
};

// Generate metadata based on content type
export async function generateMetadata({
  searchParams,
}: ContentPageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const contentTypeKey = Object.keys(resolvedSearchParams)[0];

  // Check if it's a legal content type
  const contentType = validContentTypes[contentTypeKey];
  if (contentType) {
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

  // Check if it's a product content type
  const productContentType = validProductContentTypes[contentTypeKey];
  if (productContentType) {
    const data = productContentData[productContentType];
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

  // If neither type is found
  return {
    title: "Halaman Tidak Ditemukan",
    description: "Halaman yang Anda cari tidak tersedia.",
  };
}

export default async function ContentPage({ searchParams }: ContentPageProps) {
  const resolvedSearchParams = await searchParams;

  // Get the first search parameter key as content type
  const contentTypeKey = Object.keys(resolvedSearchParams)[0];

  // Check if it's a legal content type
  const contentType = validContentTypes[contentTypeKey];
  if (contentType) {
    const data = contentData[contentType];
    const breadcrumbTitle = getLegalBreadcrumbTitle(contentType);

    return renderContentPage(data, breadcrumbTitle, contentTypeKey);
  }

  // Check if it's a product content type
  const productContentType = validProductContentTypes[contentTypeKey];
  if (productContentType) {
    const data = productContentData[productContentType];
    const breadcrumbTitle = getProductBreadcrumbTitle(productContentType);

    return renderContentPage(data, breadcrumbTitle, contentTypeKey);
  }

  // If no valid content type is found, return 404
  notFound();
}

// Generate breadcrumb based on legal content type
function getLegalBreadcrumbTitle(type: ContentType): string {
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
}

// Generate breadcrumb based on product content type
function getProductBreadcrumbTitle(type: ProductContentType): string {
  switch (type) {
    case "tentang":
      return "Tentang";
    case "fitur":
      return "Fitur";
    case "cara-kerja":
      return "Cara Kerja";
    case "bantuan":
      return "Bantuan & Dukungan";
    default:
      return "Produk";
  }
}

// Render the content page
function renderContentPage(
  data: any,
  breadcrumbTitle: string,
  contentTypeKey: string
) {
  return (
    <>
      <BreadcrumbSetter
        items={[
          { label: "Beranda", href: "/" },
          {
            label: breadcrumbTitle,
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
