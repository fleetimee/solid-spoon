import { Metadata } from "next";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { getRooms, RoomSearchParams } from "@/features/rooms/api/getRooms";
import { getRoomsStats } from "@/features/rooms/api/getRoomsStats";
import { RoomsHeader } from "@/features/rooms/components/rooms-header";
import { RoomsStatsCards } from "@/features/rooms/components/rooms-stats-cards";
import { RoomsFiltersSection } from "@/features/rooms/components/rooms-filters-section";
import { RoomsGridSection } from "@/features/rooms/components/rooms-grid-section";

export const metadata: Metadata = {
  title: "Manajemen Ruangan",
  description:
    "Lihat dan kelola semua ruangan yang tersedia dalam sistem reservasi",
  openGraph: {
    description: "Jelajahi dan kelola semua ruangan dalam sistem reservasi",
  },
};

export const fetchCache = "default-cache";

const roomsBreadcrumb = [{ label: "Ruangan" }, { label: "Kelola Ruangan" }];

interface RoomsPageProps {
  searchParams: Promise<{
    search?: string;
    location?: string;
    minCapacity?: string;
    maxCapacity?: string;
    facilities?: string | string[];
    page?: string;
    pageSize?: string;
  }>;
}

export default async function RoomsPage(props: RoomsPageProps) {
  const searchParams = await props.searchParams;
  const parsedSearchParams: RoomSearchParams = {
    search: searchParams.search,
    location: searchParams.location,
    minCapacity: searchParams.minCapacity
      ? Number(searchParams.minCapacity)
      : undefined,
    maxCapacity: searchParams.maxCapacity
      ? Number(searchParams.maxCapacity)
      : undefined,
    facilities: Array.isArray(searchParams.facilities)
      ? searchParams.facilities
      : searchParams.facilities
        ? [searchParams.facilities]
        : undefined,
    page: searchParams.page ? Number(searchParams.page) : 1,
    pageSize: searchParams.pageSize ? Number(searchParams.pageSize) : 9,
  };

  const hasFilters =
    Object.keys(searchParams).filter(
      (key) => key !== "page" && key !== "pageSize"
    ).length > 0;

  // Fetch data in parallel
  const [{ rooms, pagination }, stats] = await Promise.all([
    getRooms(parsedSearchParams),
    getRoomsStats(),
  ]);

  return (
    <>
      <BreadcrumbSetter items={roomsBreadcrumb} />

      <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
        <RoomsHeader />

        <RoomsStatsCards stats={stats} />

        <RoomsFiltersSection />

        <RoomsGridSection
          rooms={rooms}
          pagination={pagination}
          hasFilters={hasFilters}
          searchParams={searchParams}
        />
      </div>
    </>
  );
}
