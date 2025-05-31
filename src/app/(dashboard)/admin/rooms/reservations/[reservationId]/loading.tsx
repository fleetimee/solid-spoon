import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  DoorOpen,
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock3,
  UserCheck,
  Plus,
  Eye,
  Info,
} from "lucide-react";

export default function ReservationDetailsLoading() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <Skeleton className="h-9 w-64 mb-2" /> {/* Title */}
              <Skeleton className="h-6 w-80" /> {/* Description */}
            </div>
          </div>
        </div>
        <Button variant="outline" size="default" className="shadow-sm" disabled>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reservations
        </Button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Primary Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Reservation Overview Card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">
                    Reservation Overview
                  </CardTitle>
                  <CardDescription>
                    Primary reservation details and information
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-6 w-3/4" />
              </div>

              {/* Room Information */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <DoorOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-1/2 mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>

              {/* User Information */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg border border-purple-200/50 dark:border-purple-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-6 w-2/3 mb-1" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </CardContent>
          </Card>

          {/* Schedule Information Card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">Schedule & Timeline</CardTitle>
                  <CardDescription>
                    Reservation timing and duration details
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Time */}
                <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200/50 dark:border-green-800/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-5 w-full" />
                </div>

                {/* End Time */}
                <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200/50 dark:border-red-800/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <Skeleton className="h-4 w-14" />
                  </div>
                  <Skeleton className="h-5 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description Card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">Description</CardTitle>
                  <CardDescription>
                    Additional details and notes
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-4/5 mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Status & Metadata */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Current Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900 dark:to-slate-900 rounded-lg border">
                <AlertCircle className="h-4 w-4 text-gray-600" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Metadata</CardTitle>
              <CardDescription>
                System information and timestamps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Created At */}
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>

              {/* Approver Information */}
              <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <Skeleton className="h-3 w-20 mb-1" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>

              {/* Approved At */}
              <div className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                <div>
                  <Skeleton className="h-3 w-18 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>

              {/* Reservation ID */}
              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
                <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5" />
                <div>
                  <Skeleton className="h-3 w-24 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
