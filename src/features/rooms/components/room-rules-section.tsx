"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import {
  Shield,
  Clock,
  Users,
  Phone,
  ChevronDown,
  ChevronRight,
  Ban,
  Calendar,
  UserCheck,
  HeadphonesIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface RoomRulesSectionProps {
  className?: string;
}

export function RoomRulesSection({ className = "" }: RoomRulesSectionProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    general: true, // Start with general rules open
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const rulesSections = [
    {
      id: "general",
      title: "Aturan Umum",
      icon: Shield,
      iconColor: "text-green-600",
      rules: [
        "Dilarang merokok di dalam ruangan",
        "Jaga kebersihan dan kerapihan ruangan",
        "Waktu tenang: 22:00 - 06:00 WIB",
        "Tidak diperbolehkan membawa makanan berbau menyengat",
        "Wajib mematikan AC dan lampu setelah selesai",
      ],
    },
    {
      id: "booking",
      title: "Aturan Reservasi",
      icon: Calendar,
      iconColor: "text-blue-600",
      rules: [
        "Reservasi dapat dibatalkan maksimal 2 jam sebelum waktu booking",
        "Konfirmasi kehadiran maksimal 15 menit setelah waktu mulai",
        "Maksimal 3 reservasi aktif per pengguna",
        "Reservasi otomatis dibatalkan jika terlambat >30 menit",
        "Pembatalan berulang dapat mengakibatkan suspend akun",
      ],
    },
    {
      id: "usage",
      title: "Panduan Penggunaan",
      icon: Users,
      iconColor: "text-purple-600",
      rules: [
        "Kapasitas maksimal sesuai dengan yang tertera",
        "Gunakan peralatan dengan hati-hati dan sesuai fungsi",
        "Laporkan kerusakan atau masalah segera ke admin",
        "Jangan mengubah setting atau konfigurasi peralatan",
        "Pastikan ruangan dalam kondisi bersih saat selesai",
      ],
    },
    {
      id: "contact",
      title: "Kontak & Bantuan",
      icon: HeadphonesIcon,
      iconColor: "text-orange-600",
      rules: [
        "Admin: +62 812-3456-7890 (WhatsApp)",
        "Email: admin@roomreservation.com",
        "Jam operasional: 08:00 - 17:00 WIB",
        "Darurat teknis: ext. 111",
        "Laporan masalah: melalui sistem atau langsung ke admin",
      ],
    },
  ];

  return (
    <Card className={`space-y-4 ${className}`}>
      <CardContent className="space-y-4">
        <Typography
          variant="h2"
          as="h2"
          className="flex items-center font-bold text-lg bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
        >
          <Shield className="h-5 w-5 mr-2 text-primary" />
          Tata Tertib Ruangan
        </Typography>

        <div className="space-y-3">
          {rulesSections.map((section) => {
            const Icon = section.icon;
            const isOpen = openSections[section.id];

            return (
              <Collapsible
                key={section.id}
                open={isOpen}
                onOpenChange={() => toggleSection(section.id)}
              >
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200 border border-muted">
                    <div className="flex items-center space-x-3">
                      <Icon className={cn("h-4 w-4", section.iconColor)} />
                      <Typography
                        variant="small"
                        className="font-medium text-left"
                      >
                        {section.title}
                      </Typography>
                    </div>
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
                    )}
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  <div className="pt-2 pb-1">
                    <div className="bg-muted/20 rounded-lg p-3 border border-muted/50">
                      <ul className="space-y-2">
                        {section.rules.map((rule, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2 text-sm text-muted-foreground"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <span className="leading-relaxed">{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>

        {/* Important Notice */}
        <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
          <div className="flex items-start space-x-2">
            <Ban className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <Typography
                variant="small"
                className="font-medium text-amber-800 dark:text-amber-200"
              >
                Penting!
              </Typography>
              <Typography
                variant="muted"
                className="text-amber-700 dark:text-amber-300 text-xs mt-1"
              >
                Pelanggaran berulang terhadap tata tertib dapat mengakibatkan
                penangguhan hak akses ruangan.
              </Typography>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
