import * as React from "react";
import {
  BookOpen,
  Bot,
  Calendar,
  Command,
  Frame,
  Home,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  Users,
  DoorOpen,
  LayoutDashboard,
  type LucideIcon,
  Users2,
  Bell,
  ArrowBigLeftDash,
  Activity,
  Clock,
  CheckCircle2,
  X,
  XCircle,
  Info,
  BarChart3,
  Star,
  TrendingUp,
  User,
  Award,
  CheckCircle,
  MapPin,
  Shield,
  // Room facility icons
  Projector,
  PanelTop,
  MonitorSmartphone,
  Wifi,
  Music2,
  Coffee,
  Airplay,
  FileText,
  Thermometer,
  Sun,
  Blinds,
  Volume2,
  Armchair,
  Monitor,
  Lightbulb,
  VolumeX,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Bot,
  Calendar,
  Command,
  Frame,
  Home,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  Users,
  DoorOpen,
  LayoutDashboard,
  Users2,
  Bell,
  ArrowBigLeftDash,
  Activity,
  Clock,
  CheckCircle2,
  X,
  XCircle,
  Info,
  BarChart3,
  Star,
  TrendingUp,
  User,
  Award,
  CheckCircle,
  MapPin,
  Shield,
  // Room facility icons
  Projector,
  PanelTop,
  MonitorSmartphone,
  Wifi,
  Music2,
  Coffee,
  Airplay,
  FileText,
  Thermometer,
  Sun,
  Blinds,
  Volume2,
  Armchair,
  Monitor,
  Lightbulb,
  VolumeX,
};

export function getIconByName(name: string): LucideIcon {
  const IconComponent = iconMap[name];
  if (!IconComponent) {
    return Command;
  }
  return IconComponent;
}

export type IconName = keyof typeof iconMap;

export function Icon({
  name,
  className,
  ...props
}: { name: IconName } & React.ComponentPropsWithoutRef<LucideIcon>) {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in icon map`);
    return null;
  }

  return <IconComponent className={className} {...props} />;
}
