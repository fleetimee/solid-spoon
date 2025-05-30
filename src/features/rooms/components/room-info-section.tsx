import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  MapPin,
  Calendar,
  User,
  Pencil,
  Building2,
  Star,
  Wifi,
} from "lucide-react";
import { format } from "date-fns";
import { FacilityBadge } from "./facility-badge";
import { Room } from "../types/room";

interface RoomInfoSectionProps {
  room: Room;
}

export function RoomInfoSection({ room }: RoomInfoSectionProps) {
  const facilities =
    typeof room.facilities === "string" && room.facilities.startsWith("[")
      ? JSON.parse(room.facilities)
      : room.facilities
        ? [room.facilities]
        : [];

  const infoCards = [
    {
      title: "Basic Information",
      items: [
        {
          icon: Users,
          label: "Capacity",
          value: `${room.capacity} people`,
        },
        {
          icon: MapPin,
          label: "Location",
          value: room.location || "Location not specified",
        },
        {
          icon: Building2,
          label: "Status",
          value: room.isActive ? "Active" : "Inactive",
          badge: true,
          badgeVariant: room.isActive ? "default" : "destructive",
        },
      ],
    },
    {
      title: "Room History",
      items: [
        {
          icon: User,
          label: "Created by",
          value: room.createdByName || "Unknown",
        },
        {
          icon: Calendar,
          label: "Created",
          value: format(new Date(room.createdAt), "MMM d, yyyy"),
        },
        ...(room.updatedBy
          ? [
              {
                icon: Pencil,
                label: "Updated by",
                value: room.updatedByName || "Unknown",
              },
              {
                icon: Calendar,
                label: "Last updated",
                value: format(new Date(room.updatedAt), "MMM d, yyyy"),
              },
            ]
          : []),
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Room Information
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {infoCards.map((card, cardIndex) => (
          <Card
            key={cardIndex}
            className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                {card.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {card.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex items-center gap-4 p-3 rounded-lg bg-white/70 dark:bg-gray-800/70 hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200 border border-gray-100 dark:border-gray-700"
                >
                  <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {item.label}
                    </p>
                    <div className="font-semibold flex items-center gap-2">
                      {item.badge ? (
                        <Badge
                          variant={item.badgeVariant as any}
                          className="text-xs"
                        >
                          {item.value}
                        </Badge>
                      ) : (
                        <span className="text-gray-900 dark:text-gray-100">
                          {item.value}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Facilities Section */}
      <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
            Facilities & Amenities
          </CardTitle>
        </CardHeader>

        <CardContent>
          {facilities.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {facilities.map((facility: string, index: number) => (
                <div
                  key={index}
                  className="transform hover:scale-105 transition-transform duration-200"
                >
                  <FacilityBadge name={facility} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="space-y-3">
                <div className="text-4xl opacity-30 text-gray-400">🏗️</div>
                <p className="text-muted-foreground">No facilities listed</p>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Add facilities to help users understand what amenities are
                  available in this room
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
