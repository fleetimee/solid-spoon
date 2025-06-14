import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Users, Briefcase, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { teamStats } from "@/features/teams/types/team";

interface TeamStatsProps {
  className?: string;
}

export function TeamStats({ className }: TeamStatsProps) {
  const stats = [
    {
      id: "members",
      title: "Total Anggota",
      value: teamStats.totalMembers,
      icon: Users,
      description: "developer berpengalaman",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-500/10 to-blue-600/10",
      borderColor: "border-blue-200/50 dark:border-blue-800/50",
    },
    {
      id: "active",
      title: "Proyek Aktif",
      value: teamStats.activeProjects,
      icon: Briefcase,
      description: "sedang dalam pengembangan",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "from-emerald-500/10 to-emerald-600/10",
      borderColor: "border-emerald-200/50 dark:border-emerald-800/50",
    },
    {
      id: "completed",
      title: "Proyek Selesai",
      value: teamStats.completedProjects,
      icon: CheckCircle,
      description: "berhasil diselesaikan",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-500/10 to-purple-600/10",
      borderColor: "border-purple-200/50 dark:border-purple-800/50",
    },
    {
      id: "experience",
      title: "Pengalaman",
      value: `${teamStats.yearsExperience}+`,
      icon: Clock,
      description: "tahun di industri",
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-500/10 to-orange-600/10",
      borderColor: "border-orange-200/50 dark:border-orange-800/50",
    },
  ];

  return (
    <div className={cn("mb-6 sm:mb-8", className)}>
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="text-2xl sm:text-3xl">📊</div>
        <div>
          <Typography
            variant="h2"
            className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
          >
            Statistik Tim
          </Typography>
          <Typography className="text-sm sm:text-base text-muted-foreground">
            Pencapaian dan performa tim kami
          </Typography>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;

          return (
            <Card
              key={stat.id}
              className={cn(
                "backdrop-blur-md bg-white/80 dark:bg-black/40 border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group",
                stat.borderColor
              )}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br rounded-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300",
                  stat.bgColor
                )}
              />

              <CardHeader className="pb-2 relative">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={cn(
                      "p-2 sm:p-3 rounded-xl bg-gradient-to-br shadow-lg group-hover:scale-110 transition-transform duration-300",
                      stat.color
                    )}
                  >
                    <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <CardTitle className="text-sm sm:text-base text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors duration-300">
                    {stat.title}
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="relative">
                <div className="space-y-1 sm:space-y-2">
                  <div
                    className={cn(
                      "text-2xl sm:text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                      stat.color
                    )}
                  >
                    {stat.value}
                  </div>
                  <Typography className="text-xs sm:text-sm text-muted-foreground">
                    {stat.description}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Info Section */}
      <div className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 backdrop-blur-sm border border-white/10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-xl sm:text-2xl">🎯</div>
            <div className="text-center sm:text-left">
              <Typography className="text-sm sm:text-base font-semibold text-foreground">
                Komitmen Kualitas
              </Typography>
              <Typography className="text-xs sm:text-sm text-muted-foreground">
                Mengutamakan excellence dalam setiap project
              </Typography>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>Semua anggota aktif</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>Kolaborasi optimal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
