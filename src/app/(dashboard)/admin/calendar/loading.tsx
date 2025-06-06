import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";

const calendarBreadcrumb = [
  { label: "Kalender" },
  { label: "Kalender Ruangan" },
];

export default function CalendarLoading() {
  return (
    <>
      <BreadcrumbSetter items={calendarBreadcrumb} />

      <div className="h-full flex flex-col">
        {/* Skeleton Bagian Header */}
        <div className="p-4 md:p-6 lg:p-8 border-b">
          <CalendarHeaderSkeleton />
        </div>

        {/* Bagian Konten Kalender */}
        <div className="flex-1 overflow-hidden">
          <CalendarContentSkeleton />
        </div>
      </div>
    </>
  );
}

// Skeleton Header Kalender Sederhana
function CalendarHeaderSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="h-12 w-12 rounded-lg" />
      <div>
        <Skeleton className="h-8 w-72 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
    </div>
  );
}

// Skeleton Konten Kalender Sederhana
function CalendarContentSkeleton() {
  return (
    <div className="h-full flex flex-col">
      {/* Skeleton Kontrol Kalender */}
      <div className="p-4 border-b">
        <CalendarControlsSkeleton />
      </div>

      {/* Skeleton Tampilan Kalender */}
      <div className="flex-1 p-4 overflow-hidden">
        <CalendarDisplaySkeleton />
      </div>
    </div>
  );
}

// Skeleton Kontrol Kalender Sederhana
function CalendarControlsSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          {/* Baris Kontrol Atas */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            {/* Tombol Toggle Tampilan */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-12" />
              <div className="flex gap-1">
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-9 w-16" />
              </div>
            </div>

            {/* Navigasi Tanggal */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-9 w-48" />
              <Skeleton className="h-9 w-16" />
            </div>
          </div>

          {/* Baris Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Filter Ruangan */}
            <div className="flex items-center gap-2 flex-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-9 flex-1 max-w-xs" />
            </div>

            {/* Filter Status */}
            <div className="flex items-center gap-2 flex-1">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-9 flex-1 max-w-xs" />
            </div>

            {/* Tombol Hapus Filter */}
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton Tampilan Kalender Sederhana
function CalendarDisplaySkeleton() {
  return (
    <div className="h-full flex flex-col border rounded-lg overflow-hidden">
      {/* Header Kalender dengan hari-hari */}
      <CalendarHeaderGridSkeleton />

      {/* Badan Kalender */}
      <div className="flex-1 overflow-hidden">
        <CalendarBodySkeleton />
      </div>
    </div>
  );
}

// Grid Header Kalender Sederhana (Hari dalam seminggu)
function CalendarHeaderGridSkeleton() {
  return (
    <div className="grid grid-cols-7 gap-px bg-border p-1">
      {Array(7)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="bg-background p-2 text-center">
            <Skeleton className="h-4 w-8 mx-auto" />
          </div>
        ))}
    </div>
  );
}

// Badan Kalender Sederhana dengan sel tanggal
function CalendarBodySkeleton() {
  return (
    <div className="flex-1 grid grid-cols-7 gap-px bg-border p-1">
      {Array(35)
        .fill(0)
        .map((_, index) => (
          <CalendarCellSkeleton key={index} />
        ))}
    </div>
  );
}

// Skeleton Sel Kalender Individual Sederhana
function CalendarCellSkeleton() {
  return (
    <div className="bg-background p-2 min-h-[120px] flex flex-col">
      {/* Skeleton nomor tanggal */}
      <div className="flex justify-between items-start mb-2">
        <Skeleton className="h-6 w-6" />
      </div>

      {/* Placeholder acara sederhana */}
      <div className="space-y-1 flex-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
