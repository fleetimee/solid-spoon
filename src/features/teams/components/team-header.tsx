import { Typography } from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TeamHeaderProps {
  className?: string;
}

export function TeamHeader({ className }: TeamHeaderProps) {
  return (
    <div className={cn("mb-6 sm:mb-8", className)}>
      <Card className="backdrop-blur-md bg-white/60 dark:bg-black/30 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500">
        <CardContent className="p-4 sm:p-6 md:p-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="text-2xl sm:text-3xl">🎯</div>
            <div>
              <Typography
                variant="h2"
                className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
              >
                Tentang Tim Kami
              </Typography>
              <Typography className="text-sm sm:text-base text-muted-foreground">
                Kolaborasi solid untuk hasil yang luar biasa
              </Typography>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <Typography className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
              Kami adalah tim pengembang yang berpengalaman dan berdedikasi
              tinggi, berkomitmen untuk menghadirkan solusi teknologi terdepan
              dalam sistem reservasi ruangan. Dengan latar belakang yang beragam
              dan keahlian yang saling melengkapi, kami bekerja sama untuk
              menciptakan aplikasi yang tidak hanya fungsional, tetapi juga
              memberikan pengalaman pengguna yang luar biasa.
            </Typography>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/50 hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300"
              >
                💼 Professional Team
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/50 hover:from-emerald-500/20 hover:to-teal-500/20 transition-all duration-300"
              >
                🚀 Innovation Focused
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-orange-500/10 to-red-500/10 text-orange-700 dark:text-orange-300 border-orange-200/50 dark:border-orange-800/50 hover:from-orange-500/20 hover:to-red-500/20 transition-all duration-300"
              >
                🎯 Result Oriented
              </Badge>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 dark:text-purple-300 border-purple-200/50 dark:border-purple-800/50 hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300"
              >
                🤝 Collaborative
              </Badge>
            </div>

            <div className="pt-2 sm:pt-4">
              <Typography className="text-xs sm:text-sm text-muted-foreground italic">
                &ldquo;Bersama-sama kami membangun masa depan yang lebih baik
                melalui teknologi.&rdquo;
              </Typography>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
