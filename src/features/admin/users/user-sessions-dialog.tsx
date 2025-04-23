"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ExtendedUser } from "./types/user";
import { Laptop, Clock, Globe, Info, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define the session interface based on the schema
interface UserSession {
  id: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  userId: string;
  impersonatedBy?: string | null;
  current?: boolean;
}

interface UserSessionsDialogProps {
  user: ExtendedUser;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserSessionsDialog({
  user,
  isOpen,
  onOpenChange,
}: UserSessionsDialogProps) {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadSessions();
    }
  }, [isOpen, user.id]);

  const loadSessions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authClient.admin.listUserSessions({
        userId: user.id,
      });

      if (result.error) {
        setError(result.error.message ?? "Unknown error");
        toast.error(
          `Failed to load sessions: ${result.error.message ?? "Unknown error"}`
        );
      } else {
        // Display sessions exactly as returned from the API
        setSessions(
          result.data.sessions.map((s: any) => ({
            ...s,
            impersonatedBy: s.impersonatedBy ?? null,
          }))
        );
      }
    } catch (error) {
      console.error("Error loading user sessions:", error);
      setError("An unexpected error occurred while loading sessions");
      toast.error("Failed to load user sessions");
    } finally {
      setIsLoading(false);
    }
  };

  // Format user agent string to extract browser and OS information
  const formatUserAgent = (userAgent: string | null) => {
    if (!userAgent) return "Unknown";

    // This is a simple extraction - could be enhanced with a proper user-agent parser
    let browser = "Unknown browser";
    let os = "Unknown OS";

    // Extract browser info
    if (userAgent.includes("Chrome")) browser = "Chrome";
    else if (userAgent.includes("Firefox")) browser = "Firefox";
    else if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
      browser = "Safari";
    else if (userAgent.includes("Edge")) browser = "Edge";
    else if (userAgent.includes("MSIE") || userAgent.includes("Trident/"))
      browser = "Internet Explorer";

    // Extract OS info
    if (userAgent.includes("Windows")) os = "Windows";
    else if (userAgent.includes("Mac OS")) os = "macOS";
    else if (userAgent.includes("Linux")) os = "Linux";
    else if (userAgent.includes("Android")) os = "Android";
    else if (userAgent.includes("iPhone") || userAgent.includes("iPad"))
      os = "iOS";

    return `${browser} on ${os}`;
  };

  const isSessionExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Laptop className="mr-2 h-5 w-5" /> Active Sessions
          </DialogTitle>
          <DialogDescription>
            Viewing all sessions for {user.name || user.email}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-1 mb-4 p-2 bg-muted rounded-md">
          <div className="text-sm font-medium">User: {user.name || "N/A"}</div>
          <div className="text-xs text-muted-foreground">{user.email}</div>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center p-4 text-red-500">
            <AlertCircle className="mr-2 h-5 w-5" /> {error}
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No active sessions found for this user.
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device / Location</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center">
                          <Laptop className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="font-medium">
                            {session.userAgent
                              ? formatUserAgent(session.userAgent)
                              : "Unknown device"}
                          </span>
                          {session.impersonatedBy && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge
                                    variant="outline"
                                    className="ml-2 bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
                                  >
                                    <Info className="h-3 w-3 mr-1" />
                                    Impersonated
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  This session was created by an admin using
                                  impersonation
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                        {session.ipAddress && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Globe className="h-3 w-3 mr-1" />
                            {session.ipAddress}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        {format(
                          new Date(session.createdAt),
                          "MMM d, yyyy HH:mm"
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(session.expiresAt), "MMM d, yyyy HH:mm")}
                    </TableCell>
                    <TableCell>
                      {isSessionExpired(session.expiresAt) ? (
                        <Badge
                          variant="outline"
                          className="bg-gray-100 text-gray-800"
                        >
                          Expired
                        </Badge>
                      ) : (
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800 border-green-200"
                        >
                          Active
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
