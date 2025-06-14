import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Typography } from "@/components/ui/typography";
import { Github, Linkedin, Twitter, Mail, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { TeamMember } from "@/features/teams/types/team";
import Link from "next/link";

interface TeamMemberCardProps {
  member: TeamMember;
  className?: string;
}

export function TeamMemberCard({ member, className }: TeamMemberCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
    });
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "github":
        return Github;
      case "linkedin":
        return Linkedin;
      case "twitter":
        return Twitter;
      case "email":
        return Mail;
      default:
        return Mail;
    }
  };

  return (
    <Card
      className={cn(
        "overflow-hidden w-full h-full p-0 bg-gradient-to-br from-background/50 to-muted/30 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group",
        className
      )}
    >
      <CardContent className="p-4 sm:p-6 text-center h-full flex flex-col">
        {/* Avatar Section */}
        <div className="relative mb-4 sm:mb-6">
          <div className="relative inline-block">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 mx-auto border-4 border-white/20 shadow-lg group-hover:border-primary/30 transition-all duration-300">
              <AvatarImage
                src={member.avatar}
                alt={member.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-purple-500/20 text-primary font-semibold text-lg sm:text-xl">
                {getInitials(member.name)}
              </AvatarFallback>
            </Avatar>

            {/* Status indicator */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8">
              <div
                className={cn(
                  "w-full h-full rounded-full border-2 border-white shadow-lg",
                  member.status === "active"
                    ? "bg-green-500 animate-pulse"
                    : "bg-gray-400"
                )}
              />
            </div>
          </div>
        </div>

        {/* Name and Role */}
        <div className="mb-4 sm:mb-6">
          <Typography
            variant="h3"
            className="text-lg sm:text-xl font-bold text-foreground mb-1 sm:mb-2 group-hover:text-primary transition-colors duration-300"
          >
            {member.name}
          </Typography>
          <Typography className="text-sm sm:text-base text-primary font-medium bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            {member.role}
          </Typography>
        </div>

        {/* Description */}
        <div className="mb-4 sm:mb-6 flex-grow">
          <Typography className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-4">
            {member.description}
          </Typography>
        </div>

        {/* Skills */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
            {member.skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="text-xs bg-gradient-to-r from-muted/80 to-muted/60 hover:from-primary/10 hover:to-purple-500/10 transition-all duration-300 border-0"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Join Date */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Bergabung {formatJoinDate(member.joinDate)}</span>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-2 sm:gap-3 mt-auto">
          {Object.entries(member.social).map(([platform, url]) => {
            if (!url) return null;

            const IconComponent = getSocialIcon(platform);
            const isEmail = platform === "email";
            const href = isEmail ? `mailto:${url}` : url;

            return (
              <Button
                key={platform}
                variant="outline"
                size="sm"
                className="p-2 h-8 w-8 sm:h-9 sm:w-9 rounded-full border-white/20 bg-white/10 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 hover:scale-110"
                asChild
              >
                <Link
                  href={href}
                  target={isEmail ? undefined : "_blank"}
                  rel={isEmail ? undefined : "noopener noreferrer"}
                  aria-label={`${member.name} ${platform}`}
                >
                  <IconComponent className="w-3 h-3 sm:w-4 sm:h-4" />
                </Link>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
