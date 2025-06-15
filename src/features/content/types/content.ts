export interface ContentData {
  title: string;
  description: string;
  content: ContentSection[];
  lastUpdated: string;
}

export interface ContentSection {
  type: "heading" | "paragraph" | "list" | "contact-info";
  content: string | string[] | ContactInfo;
  level?: number; // for headings (h1, h2, h3, etc.)
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  operatingHours: string;
}

export type ContentType =
  | "syarat-dan-ketentuan"
  | "kebijakan-privasi"
  | "kebijakan-cookie"
  | "keamanan"
  | "hubungi-kami";

export interface ContentPageProps {
  contentType: ContentType;
  data: ContentData;
}
