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
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ExtendedUser } from "./types/user";
import {
  Laptop,
  Clock,
  Globe,
  Info,
  AlertCircle,
  Loader2,
  Trash2,
  Monitor,
  Activity,
  Zap,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserSession {
  id: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  token: string;
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
  const [revokingSessionId, setRevokingSessionId] = useState<string | null>(
    null
  );
  const [isRevokingAllSessions, setIsRevokingAllSessions] = useState(false);
  const [activeSessions, setActiveSessions] = useState(0);

  useEffect(() => {
    if (isOpen) {
      loadSessions();
    }
  }, [isOpen, user.id]);

  useEffect(() => {
    const activeCount = sessions.filter(
      (session) => !isSessionExpired(session.expiresAt)
    ).length;
    setActiveSessions(activeCount);
  }, [sessions]);

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

  const revokeSession = async (sessionId: string) => {
    setRevokingSessionId(sessionId);

    try {
      const result = await authClient.admin.revokeUserSession({
        sessionToken: sessionId,
      });

      if (result.error) {
        toast.error(
          `Failed to revoke session: ${result.error.message ?? "Unknown error"}`
        );
      } else {
        toast.success("Session revoked successfully");
        setSessions(sessions.filter((session) => session.id !== sessionId));
      }
    } catch (error) {
      console.error("Error revoking session:", error);
      toast.error("An unexpected error occurred while revoking the session");
    } finally {
      setRevokingSessionId(null);
    }
  };

  const revokeAllSessions = async () => {
    setIsRevokingAllSessions(true);

    try {
      const result = await authClient.admin.revokeUserSessions({
        userId: user.id,
      });

      if (result.error) {
        toast.error(
          `Failed to revoke all sessions: ${result.error.message ?? "Unknown error"}`
        );
      } else {
        toast.success("All sessions revoked successfully");
        setSessions(
          sessions.map((session) => ({
            ...session,
            expiresAt: new Date().toISOString(),
          }))
        );
      }
    } catch (error) {
      console.error("Error revoking all sessions:", error);
      toast.error("An unexpected error occurred while revoking all sessions");
    } finally {
      setIsRevokingAllSessions(false);
    }
  };

  const formatUserAgent = (userAgent: string | null) => {
    if (!userAgent) return "Unknown";

    let browser = "Unknown browser";
    let os = "Unknown OS";

    if (userAgent.includes("Chrome")) browser = "Chrome";
    else if (userAgent.includes("Firefox")) browser = "Firefox";
    else if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
      browser = "Safari";
    else if (userAgent.includes("Edge")) browser = "Edge";
    else if (userAgent.includes("MSIE") || userAgent.includes("Trident/"))
      browser = "Internet Explorer";

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
      <DialogContent className="sm:max-w-[900px] border-0 bg-gradient-to-br from-white/95 to-violet-50/90 dark:from-gray-950/95 dark:to-violet-950/50 backdrop-blur-xl shadow-2xl">
        {/* Modern Dialog Header with Gradient Icon */}
        <DialogHeader className="space-y-6 pb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-lg">
                <Monitor className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                <Activity className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="space-y-1 flex-1">
              <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                Active Sessions
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Viewing all sessions for {user.name || user.email}
              </DialogDescription>
            </div>
            {/* Active Sessions Counter */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 border border-violet-200/50 dark:border-violet-800/50">
              <Zap className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              <span className="text-sm font-medium text-violet-700 dark:text-violet-400">
                {activeSessions} Active
              </span>
            </div>
          </div>
        </DialogHeader>

        {/* Glassmorphism User Info Card */}
        <div className="mb-6">
          <div className="relative overflow-hidden rounded-2xl border border-violet-200/50 dark:border-violet-800/50 bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/10 dark:to-purple-950/10 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400/5 to-purple-400/5" />
            <div className="relative p-4 space-y-2">
              <div className="text-sm font-medium text-foreground">
                {user.name || "N/A"}
              </div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
            </div>
          </div>
        </div>

        {activeSessions > 0 && !isLoading && !error && (
          <div className="flex justify-end mb-6">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-200/50 dark:border-red-800/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  disabled={isRevokingAllSessions}
                >
                  {isRevokingAllSessions ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-2" />
                  ) : (
                    <Trash2 className="h-3 w-3 mr-2" />
                  )}
                  Revoke All Sessions
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border-0 bg-gradient-to-br from-white/95 to-red-50/90 dark:from-gray-950/95 dark:to-red-950/50 backdrop-blur-xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-400 dark:to-red-500 bg-clip-text text-transparent">
                    Revoke All Sessions
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground">
                    This action will log out the user from all devices and
                    applications. They will need to sign in again. This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-red-200/50 dark:border-red-800/50 hover:bg-red-50 dark:hover:bg-red-950/50">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={revokeAllSessions}
                  >
                    Revoke All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {/* Glassmorphism Content Container */}
        <div className="relative overflow-hidden rounded-2xl border border-violet-200/50 dark:border-violet-800/50 bg-gradient-to-br from-violet-50/30 to-purple-50/30 dark:from-violet-950/5 dark:to-purple-950/5 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-400/3 to-purple-400/3" />
          <div className="relative">
            {isLoading ? (
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <Skeleton className="h-8 w-full rounded-xl" />
                  <Skeleton className="h-8 w-full rounded-xl" />
                  <Skeleton className="h-8 w-full rounded-xl" />
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center p-8">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-br from-red-50/80 to-red-100/80 dark:from-red-950/20 dark:to-red-900/20 border border-red-200/50 dark:border-red-800/50">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-red-700 dark:text-red-400 font-medium">
                    {error}
                  </span>
                </div>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center">
                  <Monitor className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                </div>
                <p className="text-muted-foreground">
                  No active sessions found for this user.
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[450px]">
                <div className="p-2">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-violet-200/50 dark:border-violet-800/50 hover:bg-violet-50/50 dark:hover:bg-violet-950/20">
                        <TableHead className="text-violet-700 dark:text-violet-400 font-semibold">
                          Device / Location
                        </TableHead>
                        <TableHead className="text-violet-700 dark:text-violet-400 font-semibold">
                          Created
                        </TableHead>
                        <TableHead className="text-violet-700 dark:text-violet-400 font-semibold">
                          Expires
                        </TableHead>
                        <TableHead className="text-violet-700 dark:text-violet-400 font-semibold">
                          Status
                        </TableHead>
                        <TableHead className="text-right text-violet-700 dark:text-violet-400 font-semibold">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sessions.map((session) => (
                        <TableRow
                          key={session.id}
                          className="border-violet-200/30 dark:border-violet-800/30 hover:bg-violet-50/30 dark:hover:bg-violet-950/10 transition-colors"
                        >
                          <TableCell>
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center">
                                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center mr-2">
                                  <Laptop className="h-3 w-3 text-white" />
                                </div>
                                <span className="font-medium text-foreground">
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
                                      <TooltipContent className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-amber-200/50 dark:border-amber-800/50">
                                        This session was created by an admin
                                        using impersonation
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                              {session.ipAddress && (
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center mr-1">
                                    <Globe className="h-2 w-2 text-white" />
                                  </div>
                                  {session.ipAddress}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-4 h-4 rounded bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mr-2">
                                <Clock className="h-2 w-2 text-white" />
                              </div>
                              <span className="text-sm">
                                {format(
                                  new Date(session.createdAt),
                                  "MMM d, yyyy HH:mm"
                                )}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {format(
                              new Date(session.expiresAt),
                              "MMM d, yyyy HH:mm"
                            )}
                          </TableCell>
                          <TableCell>
                            {isSessionExpired(session.expiresAt) ? (
                              <Badge
                                variant="outline"
                                className="bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600"
                              >
                                Expired
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400 dark:border-green-800"
                              >
                                Active
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-red-200/50 dark:border-red-800/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-700 transition-all duration-200"
                                disabled={
                                  isSessionExpired(session.expiresAt) ||
                                  revokingSessionId === session.token
                                }
                                onClick={() => revokeSession(session.token)}
                              >
                                {revokingSessionId === session.token ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  "Revoke"
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
