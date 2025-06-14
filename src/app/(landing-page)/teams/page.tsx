import { Metadata } from "next";
import { Users } from "lucide-react";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Typography } from "@/components/ui/typography";
import { TeamHeader } from "@/features/teams/components/team-header";
import { TeamMemberCard } from "@/features/teams/components/team-member-card";
import { TeamStats } from "@/features/teams/components/team-stats";
import { teamMembers } from "@/features/teams/types/team";

export const metadata: Metadata = {
  title: "Tim Kami - Capstone Room Reservation",
  description:
    "Kenali tim pengembang di balik sistem reservasi ruangan modern ini. Tim berpengalaman yang terdiri dari developer, designer, dan project manager.",
  keywords: [
    "tim pengembang",
    "team capstone",
    "pengembang aplikasi",
    "tim developer",
    "proyek capstone",
    "room reservation team",
    "developer Indonesia",
  ],
  openGraph: {
    title: "Tim Kami - Capstone Room Reservation",
    description:
      "Kenali tim pengembang di balik sistem reservasi ruangan modern ini. Tim berpengalaman yang terdiri dari developer, designer, dan project manager.",
    type: "website",
    locale: "id_ID",
    url: "/teams",
    siteName: "Capstone Room Reservation",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const teamsBreadcrumb = [
  { label: "Beranda", href: "/" },
  { label: "Tim Kami" },
];

export default function TeamsPage() {
  return (
    <>
      <BreadcrumbSetter items={teamsBreadcrumb} />
      <main className="flex flex-col gap-8 p-4 md:p-6 lg:p-8 min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30">
        <div className="max-w-screen-xl mx-auto w-full px-3 sm:px-6">
          {/* Enhanced Header with Glass Morphism */}
          <div className="relative mb-6 sm:mb-8 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-white/20 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl sm:rounded-3xl"></div>
            <div className="relative flex flex-col gap-2 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-purple-600 shadow-lg">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div className="text-xl sm:text-2xl">🧑‍💻</div>
              </div>
              <Typography
                variant="h1"
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight"
              >
                Kenali Tim Kami
              </Typography>
              <Typography className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                Tim pengembang berpengalaman di balik sistem reservasi ruangan
                modern ini. Kami berkomitmen menghadirkan solusi terbaik untuk
                kebutuhan manajemen ruangan Anda.
              </Typography>
            </div>
          </div>

          {/* Team Header Section */}
          <TeamHeader />

          {/* Team Stats Section */}
          <TeamStats />

          {/* Team Members Grid */}
          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-2xl sm:text-3xl">👥</div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Anggota Tim
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Para profesional yang berkontribusi dalam proyek ini
                </p>
              </div>
            </div>

            {/* Enhanced grid with animations and modern layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={member.id}
                  className="group hover:scale-[1.02] transition-all duration-500 ease-out hover:z-10"
                  style={{
                    animationDelay: `${index * 150}ms`,
                  }}
                >
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <TeamMemberCard
                      member={member}
                      className="h-full transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technology Stack Section */}
          <div className="mt-12 sm:mt-16 space-y-6 sm:space-y-8">
            <div className="relative p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 dark:from-emerald-500/20 dark:via-blue-500/20 dark:to-purple-500/20 backdrop-blur-sm border border-white/20 dark:border-white/30 shadow-xl dark:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-purple-500/5 dark:from-emerald-500/10 dark:via-blue-500/10 dark:to-purple-500/10 rounded-2xl sm:rounded-3xl"></div>
              <div className="relative">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="text-2xl sm:text-3xl">⚡</div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent">
                      Teknologi yang Digunakan
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Teknologi modern yang kami gunakan untuk membangun
                      aplikasi ini
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    {
                      name: "Next.js",
                      icon: "⚛️",
                      color:
                        "from-black to-gray-800 dark:from-gray-200 dark:to-white",
                    },
                    {
                      name: "TypeScript",
                      icon: "📘",
                      color:
                        "from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-300",
                    },
                    {
                      name: "Tailwind CSS",
                      icon: "🎨",
                      color:
                        "from-cyan-500 to-blue-500 dark:from-cyan-400 dark:to-blue-400",
                    },
                    {
                      name: "PostgreSQL",
                      icon: "🐘",
                      color:
                        "from-blue-700 to-blue-900 dark:from-blue-400 dark:to-blue-300",
                    },
                    {
                      name: "Better Auth",
                      icon: "🔐",
                      color:
                        "from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400",
                    },
                    {
                      name: "Minio",
                      icon: "🗂️",
                      color:
                        "from-red-500 to-red-700 dark:from-red-400 dark:to-red-300",
                    },
                    {
                      name: "Resend",
                      icon: "📧",
                      color:
                        "from-purple-500 to-purple-700 dark:from-purple-400 dark:to-purple-300",
                    },
                    {
                      name: "Vercel",
                      icon: "▲",
                      color:
                        "from-black to-gray-700 dark:from-gray-200 dark:to-white",
                    },
                  ].map((tech, index) => (
                    <div
                      key={tech.name}
                      className="group p-3 sm:p-4 rounded-xl bg-gradient-to-br from-background/80 to-muted/30 dark:from-background/90 dark:to-muted/40 backdrop-blur-sm border border-white/10 dark:border-white/20 shadow-lg hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:scale-105"
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="text-2xl sm:text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                          {tech.icon}
                        </div>
                        <div
                          className={`text-sm sm:text-base font-semibold bg-gradient-to-r ${tech.color} bg-clip-text text-transparent`}
                        >
                          {tech.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="mt-12 sm:mt-16 text-center">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-muted/50 to-muted/30 dark:from-muted/70 dark:to-muted/50 backdrop-blur-sm border border-white/10 dark:border-white/20">
              <div className="text-base sm:text-lg">🚀</div>
              <span className="text-xs sm:text-sm text-muted-foreground">
                <span className="font-semibold text-primary">
                  Capstone Project
                </span>
                <span className="hidden sm:inline">
                  {" "}
                  - Dikembangkan dengan penuh dedikasi oleh tim kami
                </span>
                <span className="sm:hidden"> - Tim Developer Indonesia</span>
              </span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
