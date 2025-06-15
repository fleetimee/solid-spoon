import React from "react";
import { Typography } from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { ContentSection, ContactInfo } from "../types/content";

interface ContentRendererProps {
  sections: ContentSection[];
}

function ContactInfoCard({ contactInfo }: { contactInfo: ContactInfo }) {
  return (
    <Card className="bg-gradient-to-br from-background to-muted/20 border-muted backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <Typography variant="small" className="text-muted-foreground">
                  Email
                </Typography>
                <Typography variant="default" className="font-medium">
                  {contactInfo.email}
                </Typography>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <Typography variant="small" className="text-muted-foreground">
                  Telepon
                </Typography>
                <Typography variant="default" className="font-medium">
                  {contactInfo.phone}
                </Typography>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 mt-1">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <Typography variant="small" className="text-muted-foreground">
                  Alamat
                </Typography>
                <Typography variant="default" className="font-medium">
                  {contactInfo.address}
                </Typography>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <Typography variant="small" className="text-muted-foreground">
                  Jam Operasional
                </Typography>
                <Typography variant="default" className="font-medium">
                  {contactInfo.operatingHours}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function renderSection(
  section: ContentSection,
  index: number
): React.ReactNode {
  switch (section.type) {
    case "heading":
      const level = section.level || 2;
      const headingVariant = `h${level}` as
        | "h1"
        | "h2"
        | "h3"
        | "h4"
        | "h5"
        | "h6";

      return (
        <Typography
          key={index}
          variant={headingVariant}
          className="mt-8 mb-4 first:mt-0"
        >
          {section.content as string}
        </Typography>
      );

    case "paragraph":
      return (
        <Typography
          key={index}
          variant="default"
          className="mb-4 leading-relaxed"
        >
          {section.content as string}
        </Typography>
      );

    case "list":
      const listItems = section.content as string[];
      return (
        <ul key={index} className="mb-6 space-y-2 pl-6">
          {listItems.map((item, itemIndex) => (
            <li key={itemIndex} className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <Typography variant="default" className="flex-1">
                {item}
              </Typography>
            </li>
          ))}
        </ul>
      );

    case "contact-info":
      return (
        <div key={index} className="mb-8">
          <ContactInfoCard contactInfo={section.content as ContactInfo} />
        </div>
      );

    default:
      return null;
  }
}

export function ContentRenderer({ sections }: ContentRendererProps) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <div className="space-y-6">
        {sections.map((section, index) => renderSection(section, index))}
      </div>
    </div>
  );
}
