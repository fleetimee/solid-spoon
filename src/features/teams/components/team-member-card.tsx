import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Typography } from "@/components/ui/typography";
import { ImageZoom } from "@/components/ui/kibo-ui/image-zoom";
import {
  Mail,
  Calendar,
  Terminal,
  Code,
  Palette,
  Paintbrush,
  Book,
  FileText,
  Users,
  Calendar as CalendarIcon,
} from "lucide-react";
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

  // Role-based styling configuration
  const getRoleConfig = (name: string, role: string) => {
    if (name === "Novian Andika" || role.includes("Lead Developer")) {
      return {
        gradientBg: "from-blue-500/20 via-cyan-500/10 to-blue-600/20",
        borderColor: "border-blue-500/30",
        hoverBorderColor: "group-hover:border-cyan-400/50",
        iconColor: "text-blue-400",
        roleGradient: "from-blue-400 to-cyan-500",
        badgeGradient:
          "from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20",
        avatarGradient: "from-blue-400/30 to-cyan-500/30",
        buttonHover: "hover:bg-blue-500/20 hover:border-blue-400/40",
        icon: Terminal,
        pattern:
          "bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.1),transparent_50%)] relative before:absolute before:inset-0 before:bg-[linear-gradient(45deg,transparent_30%,rgba(14,165,233,0.05)_50%,transparent_70%)] before:bg-[size:20px_20px]",
      };
    }

    if (name === "Fadil Biyan Eka Satria" || role.includes("UI/UX Designer")) {
      return {
        gradientBg: "from-purple-500/20 via-pink-500/10 to-purple-600/20",
        borderColor: "border-purple-500/30",
        hoverBorderColor: "group-hover:border-pink-400/50",
        iconColor: "text-purple-400",
        roleGradient: "from-purple-400 to-pink-500",
        badgeGradient:
          "from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20",
        avatarGradient: "from-purple-400/30 to-pink-500/30",
        buttonHover: "hover:bg-purple-500/20 hover:border-purple-400/40",
        icon: Palette,
        pattern:
          "bg-[radial-gradient(circle_at_30%_80%,rgba(147,51,234,0.1),transparent_50%)] relative before:absolute before:inset-0 before:bg-[conic-gradient(from_45deg,transparent,rgba(168,85,247,0.05),transparent)] before:bg-[size:30px_30px]",
      };
    }

    if (name === "Indriyana" || role.includes("Documentation Specialist")) {
      return {
        gradientBg: "from-green-500/20 via-emerald-500/10 to-green-600/20",
        borderColor: "border-green-500/30",
        hoverBorderColor: "group-hover:border-emerald-400/50",
        iconColor: "text-green-400",
        roleGradient: "from-green-400 to-emerald-500",
        badgeGradient:
          "from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20",
        avatarGradient: "from-green-400/30 to-emerald-500/30",
        buttonHover: "hover:bg-green-500/20 hover:border-green-400/40",
        icon: Book,
        pattern:
          "bg-[linear-gradient(135deg,rgba(34,197,94,0.05)_0%,transparent_25%,rgba(16,185,129,0.05)_50%,transparent_75%)] relative before:absolute before:inset-0 before:bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,rgba(34,197,94,0.03)_10px,rgba(34,197,94,0.03)_11px)]",
      };
    }

    if (name === "Putri Nurul Adha" || role.includes("Project Coordinator")) {
      return {
        gradientBg: "from-orange-500/20 via-amber-500/10 to-orange-600/20",
        borderColor: "border-orange-500/30",
        hoverBorderColor: "group-hover:border-amber-400/50",
        iconColor: "text-orange-400",
        roleGradient: "from-orange-400 to-amber-500",
        badgeGradient:
          "from-orange-500/10 to-amber-500/10 hover:from-orange-500/20 hover:to-amber-500/20",
        avatarGradient: "from-orange-400/30 to-amber-500/30",
        buttonHover: "hover:bg-orange-500/20 hover:border-orange-400/40",
        icon: Users,
        pattern:
          "bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.1),transparent_50%)] relative before:absolute before:inset-0 before:bg-[linear-gradient(60deg,transparent_40%,rgba(245,158,11,0.05)_50%,transparent_60%)] before:bg-[size:25px_25px]",
      };
    }

    // Default fallback
    return {
      gradientBg: "from-background/50 to-muted/30",
      borderColor: "border-white/10",
      hoverBorderColor: "group-hover:border-primary/30",
      iconColor: "text-primary",
      roleGradient: "from-primary to-purple-600",
      badgeGradient:
        "from-muted/80 to-muted/60 hover:from-primary/10 hover:to-purple-500/10",
      avatarGradient: "from-primary/20 to-purple-500/20",
      buttonHover: "hover:bg-primary/10 hover:border-primary/30",
      icon: Calendar,
      pattern: "",
    };
  };

  const roleConfig = getRoleConfig(member.name, member.role);
  const RoleIcon = roleConfig.icon;

  return (
    <Card
      className={cn(
        "overflow-hidden w-full h-full p-0 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group relative",
        `bg-gradient-to-br ${roleConfig.gradientBg}`,
        `border ${roleConfig.borderColor} ${roleConfig.hoverBorderColor}`,
        roleConfig.pattern,
        className
      )}
    >
      <CardContent className="p-4 sm:p-6 text-center h-full flex flex-col">
        {/* Avatar Section */}
        <div className="relative mb-4 sm:mb-6">
          <div className="relative inline-block">
            {/* Role Icon Background */}
            <div
              className={cn(
                "absolute -top-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center z-10 shadow-lg transition-all duration-300",
                `bg-gradient-to-br ${roleConfig.gradientBg}`,
                `border-2 ${roleConfig.borderColor}`
              )}
            >
              <RoleIcon
                className={cn("w-4 h-4 sm:w-5 sm:h-5", roleConfig.iconColor)}
              />
            </div>

            {member.image ? (
              <ImageZoom
                className={cn(
                  "relative rounded-full overflow-hidden border-4 shadow-lg transition-all duration-300",
                  `${roleConfig.borderColor} ${roleConfig.hoverBorderColor}`
                )}
              >
                <img
                  src={member.image}
                  alt={`${member.name} - ${member.role}`}
                  className="h-28 w-28 sm:h-32 sm:w-32 object-cover object-center cursor-zoom-in rounded-full"
                />
              </ImageZoom>
            ) : (
              <Avatar
                className={cn(
                  "w-28 h-28 sm:w-32 sm:h-32 mx-auto border-4 shadow-lg transition-all duration-300",
                  `${roleConfig.borderColor} ${roleConfig.hoverBorderColor}`
                )}
              >
                <AvatarImage
                  src={member.avatar}
                  alt={member.name}
                  className="object-cover object-center"
                />
                <AvatarFallback
                  className={cn(
                    "font-semibold text-xl sm:text-2xl",
                    `bg-gradient-to-br ${roleConfig.avatarGradient}`,
                    roleConfig.iconColor
                  )}
                >
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>

        {/* Name and Role */}
        <div className="mb-4 sm:mb-6">
          <Typography
            variant="h3"
            className={cn(
              "text-lg sm:text-xl font-bold text-foreground mb-1 sm:mb-2 transition-colors duration-300",
              `group-hover:${roleConfig.iconColor.replace("text-", "text-")}`
            )}
          >
            {member.name}
          </Typography>
          <Typography className="text-xs sm:text-sm text-muted-foreground font-mono mb-1 sm:mb-2">
            NIM: {member.nim}
          </Typography>
          <Typography
            className={cn(
              "text-sm sm:text-base font-medium bg-clip-text text-transparent",
              `bg-gradient-to-r ${roleConfig.roleGradient}`
            )}
          >
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
                className={cn(
                  "text-xs transition-all duration-300 border-0",
                  `bg-gradient-to-r ${roleConfig.badgeGradient}`
                )}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Join Date */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
            <CalendarIcon
              className={cn(
                "w-3 h-3 sm:w-4 sm:h-4",
                roleConfig.iconColor,
                "opacity-70"
              )}
            />
            <span>Bergabung Sejak {formatJoinDate(member.joinDate)}</span>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-2 sm:gap-3 mt-auto">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "p-2 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/10 transition-all duration-300 hover:scale-110",
              `${roleConfig.borderColor} ${roleConfig.buttonHover}`
            )}
            asChild
          >
            <Link
              href={`mailto:${member.social.email}`}
              aria-label={`${member.name} email`}
            >
              <Mail
                className={cn("w-3 h-3 sm:w-4 sm:h-4", roleConfig.iconColor)}
              />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
