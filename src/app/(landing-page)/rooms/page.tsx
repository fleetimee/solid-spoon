import Link from "next/link";
import { Metadata } from "next";
import { Search, Info, RefreshCw, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Button } from "@/components/ui/button";
import { RoomCard } from "@/features/rooms/components/room-card";
import { RoomFilters } from "@/features/rooms/components/room-filters";
import { getRooms, RoomSearchParams } from "@/features/rooms/api/getRooms";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Typography } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Ruangan Tersedia",
  description:
    "Jelajahi dan temukan ruangan yang sesuai dengan kebutuhan Anda.",
  openGraph: {
    description:
      "Jelajahi dan temukan ruangan yang sesuai dengan kebutuhan Anda.",
  },
};

export const fetchCache = "default-cache";

const roomsBreadcrumb = [{ label: "Beranda", href: "/" }, { label: "Ruangan" }];

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

  const { rooms, pagination } = await getRooms(parsedSearchParams);

  const getPaginationUrl = (targetPage: number) => {
    const params = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== "page" && value) {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.set(key, value);
        }
      }
    });

    params.set("page", targetPage.toString());

    return `/rooms?${params.toString()}`;
  };

  const getPaginationItems = () => {
    const { currentPage, totalPages } = pagination;

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <PaginationItem key={page}>
          <PaginationLink
            href={getPaginationUrl(page)}
            isActive={page === currentPage}
            preserveScroll={true}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      ));
    }

    const items = [];

    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          href={getPaginationUrl(1)}
          isActive={1 === currentPage}
          preserveScroll={true}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href={getPaginationUrl(i)}
            isActive={i === currentPage}
            preserveScroll={true}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href={getPaginationUrl(totalPages)}
            isActive={totalPages === currentPage}
            preserveScroll={true}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <>
      <BreadcrumbSetter items={roomsBreadcrumb} />
      <main className="flex flex-col grow p-3 sm:p-4 md:p-8 min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30">
        <div className="max-w-screen-xl mx-auto w-full px-3 sm:px-6">
          {/* Enhanced Header with Glass Morphism */}
          <div className="relative mb-6 sm:mb-8 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-white/20 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl sm:rounded-3xl"></div>
            <div className="relative flex flex-col gap-2 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-purple-600 shadow-lg">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div className="text-xl sm:text-2xl">🏢</div>
              </div>
              <Typography
                variant="h1"
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight"
              >
                Temukan Ruangan Ideal Anda
              </Typography>
              <Typography className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                Jelajahi ruangan-ruangan berkualitas yang sesuai dengan
                kebutuhan Anda. Mulai dari ruang pertemuan hingga ruang
                presentasi.
              </Typography>
            </div>
          </div>

          {/* Enhanced Search Section */}
          <div className="mb-6 sm:mb-8 p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-background/80 to-muted/20 backdrop-blur-sm border border-white/10 shadow-lg">
            <RoomFilters />
          </div>

          {rooms.length === 0 ? (
            <Card className="border-dashed border-2 border-primary/20 bg-gradient-to-br from-background/50 to-muted/30 w-full max-w-3xl mx-auto backdrop-blur-sm shadow-2xl">
              <CardHeader className="flex flex-col items-center justify-center pb-0 pt-8 sm:pt-12 px-4 sm:px-6">
                <div className="flex flex-col items-center justify-center mb-6 sm:mb-8">
                  {hasFilters ? (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                      <div className="relative bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-950/50 dark:to-pink-950/50 rounded-full p-6 sm:p-8 mb-4 sm:mb-6 shadow-xl">
                        <Search
                          className="h-12 w-12 sm:h-16 sm:w-16 text-orange-500 dark:text-orange-400"
                          strokeWidth={1.5}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                      <div className="relative bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950/50 dark:to-purple-950/50 rounded-full p-6 sm:p-8 mb-4 sm:mb-6 shadow-xl">
                        <Building2
                          className="h-12 w-12 sm:h-16 sm:w-16 text-blue-500 dark:text-blue-400"
                          strokeWidth={1.5}
                        />
                      </div>
                    </div>
                  )}
                  <Typography
                    variant="h2"
                    className="text-lg sm:text-xl md:text-2xl font-bold text-center mt-3 sm:mt-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent leading-tight"
                  >
                    {hasFilters
                      ? "🔍 Tidak ada ruangan yang sesuai dengan pencarian"
                      : "🏢 Belum ada ruangan yang tersedia"}
                  </Typography>
                </div>
              </CardHeader>

              <CardContent className="text-center space-y-4 sm:space-y-6 pb-6 sm:pb-8 px-4 sm:px-8">
                {hasFilters ? (
                  <div className="space-y-4 sm:space-y-6">
                    <Typography className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base md:text-lg leading-relaxed">
                      Pencarian Anda tidak menghasilkan ruangan yang sesuai.
                      Silakan coba dengan kriteria yang lebih luas.
                    </Typography>

                    <div className="flex flex-col gap-3 items-center">
                      <div className="bg-gradient-to-r from-background/90 to-muted/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 inline-flex gap-2 sm:gap-3 text-xs sm:text-sm border border-white/10 shadow-lg max-w-sm sm:max-w-none">
                        <div className="text-xl sm:text-2xl">💡</div>
                        <span className="text-muted-foreground leading-relaxed">
                          Saran: Gunakan kata kunci yang lebih umum atau kurangi
                          filter pencarian
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    <Typography className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base md:text-lg leading-relaxed">
                      Kami sedang menyiapkan ruangan-ruangan baru. Silakan
                      kembali lagi untuk melihat pilihan ruangan yang tersedia.
                    </Typography>
                    <div className="text-3xl sm:text-4xl">🔄</div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-center pb-8 sm:pb-12 pt-0 px-4 sm:px-6">
                {hasFilters ? (
                  <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
                    <Button
                      asChild
                      variant="outline"
                      className="gap-2 rounded-lg sm:rounded-xl border-2 hover:bg-primary/10 transition-all duration-300 hover:scale-105 text-sm sm:text-base h-9 sm:h-10"
                    >
                      <Link href="/rooms">
                        <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">
                          Hapus semua filter
                        </span>
                        <span className="sm:hidden">Reset Filter</span>
                      </Link>
                    </Button>
                  </div>
                ) : null}
              </CardFooter>
            </Card>
          ) : (
            <>
              {/* Enhanced grid with animations and modern layout */}
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-6 sm:mb-8">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="text-2xl sm:text-3xl">🎯</div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Ruangan Tersedia
                      </h2>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        Ditemukan {rooms.length} ruangan yang sesuai dengan
                        kriteria Anda
                      </p>
                    </div>
                  </div>
                  <div className="flex sm:hidden items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20 self-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-medium">
                      {pagination.totalItems} total
                    </span>
                  </div>
                  <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-medium">
                      {pagination.totalItems} total
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
                  {rooms.map((room, index) => {
                    // Enhanced Bento layout with improved patterns
                    let spanClasses = "sm:col-span-1 md:col-span-2";
                    const patternIndex = index % 6;

                    if (patternIndex === 0) {
                      spanClasses = "sm:col-span-2 md:col-span-4 md:row-span-2";
                    } else if (patternIndex === 1 || patternIndex === 2) {
                      spanClasses = "sm:col-span-1 md:col-span-2";
                    } else if (patternIndex === 3 || patternIndex === 4) {
                      spanClasses = "sm:col-span-1 md:col-span-3";
                    } else if (patternIndex === 5) {
                      spanClasses = "sm:col-span-2 md:col-span-6";
                    }

                    return (
                      <div
                        key={room.id}
                        className={cn(
                          spanClasses,
                          "group hover:scale-[1.02] transition-all duration-500 ease-out hover:z-10"
                        )}
                        style={{
                          animationDelay: `${index * 100}ms`,
                        }}
                      >
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                          <RoomCard
                            room={room}
                            link={`/v/${room.slug}`}
                            className="h-full transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {pagination.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination>
                    <PaginationContent>
                      {pagination.currentPage > 1 && (
                        <PaginationItem>
                          <PaginationPrevious
                            href={getPaginationUrl(pagination.currentPage - 1)}
                            preserveScroll={true}
                          />
                        </PaginationItem>
                      )}

                      {getPaginationItems()}

                      {pagination.currentPage < pagination.totalPages && (
                        <PaginationItem>
                          <PaginationNext
                            href={getPaginationUrl(pagination.currentPage + 1)}
                            preserveScroll={true}
                          />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}

              {/* Enhanced pagination info */}
              <div className="mt-6 sm:mt-8 text-center">
                {pagination.totalItems > 0 && (
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-muted/50 to-muted/30 backdrop-blur-sm border border-white/10">
                    <div className="text-base sm:text-lg">📊</div>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      <span className="hidden sm:inline">Menampilkan </span>
                      <span className="font-semibold text-primary">
                        {(pagination.currentPage - 1) * pagination.pageSize + 1}
                      </span>
                      <span className="hidden sm:inline"> hingga </span>
                      <span className="sm:hidden">-</span>
                      <span className="font-semibold text-primary">
                        {Math.min(
                          pagination.currentPage * pagination.pageSize,
                          pagination.totalItems
                        )}
                      </span>
                      <span className="hidden sm:inline"> dari </span>
                      <span className="sm:hidden">/</span>
                      <span className="font-semibold text-primary">
                        {pagination.totalItems}
                      </span>
                      <span className="hidden sm:inline"> ruangan</span>
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
