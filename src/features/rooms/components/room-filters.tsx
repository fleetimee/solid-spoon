"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Search,
  X,
  Filter,
  MapPin,
  Users,
  Grid,
  Loader2,
  Settings,
  ChevronRight,
  Projector,
  MonitorSmartphone,
  Wifi,
  Music2,
  Coffee,
  Airplay,
  PanelTop,
  FileText,
  LucideIcon,
  Thermometer,
  Sun,
  Currency,
  Volume2,
  Armchair,
  Table2Icon,
  Lightbulb,
  PanelLeftClose,
  Lightbulb as LightbulbIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const facilityIcons: Record<string, LucideIcon> = {
  Projector: Projector,
  Whiteboard: PanelTop,
  "Video Conferencing": MonitorSmartphone,
  "Wi-Fi": Wifi,
  "Sound System": Music2,
  Refreshments: Coffee,
  "Screen Sharing": Airplay,
  Teleconferencing: MonitorSmartphone,
  Flipchart: FileText,
  "Air Conditioning": Thermometer,
  Heating: Thermometer,
  "Natural Light": Sun,
  "Blackout Curtains": Currency,
  Soundproofing: Volume2,
  "Ergonomic Chairs": Armchair,
  "Standing Desks": Table2Icon,
  "Adjustable Lighting": Lightbulb,
  "Acoustic Panels": PanelLeftClose,
  "Smart Lighting": LightbulbIcon,
};

const COMMON_FACILITIES = [
  "Projector",
  "Whiteboard",
  "Video Conferencing",
  "Wi-Fi",
  "Sound System",
  "Refreshments",
  "Screen Sharing",
  "Teleconferencing",
  "Flipchart",
  "Air Conditioning",
  "Heating",
  "Natural Light",
  "Blackout Curtains",
  "Soundproofing",
  "Ergonomic Chairs",
  "Standing Desks",
  "Adjustable Lighting",
  "Acoustic Panels",
  "Smart Lighting",
];

export function RoomFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [minCapacity, setMinCapacity] = useState(
    searchParams.get("minCapacity") || ""
  );
  const [maxCapacity, setMaxCapacity] = useState(
    searchParams.get("maxCapacity") || ""
  );
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(
    searchParams.getAll("facilities") || []
  );
  const [isApplying, setIsApplying] = useState(false);

  const [activeFilters, setActiveFilters] = useState(0);

  const debouncedUpdateUrl = useCallback(
    (params: Record<string, string | string[] | null>) => {
      const url = new URL(window.location.href);

      const currentPageSize = url.searchParams.get("pageSize");

      if (
        Object.values(params).every(
          (value) =>
            value === null ||
            (Array.isArray(value) && value.length === 0) ||
            value === ""
        )
      ) {
        url.searchParams.delete("page");
      }

      Object.entries(params).forEach(([key, value]) => {
        if (
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          url.searchParams.delete(key);
        } else if (Array.isArray(value)) {
          url.searchParams.delete(key);
          value.forEach((v) => url.searchParams.append(key, v));
        } else {
          url.searchParams.set(key, value);
        }
      });

      if (
        Object.keys(params).some((key) => key !== "page" && key !== "pageSize")
      ) {
        url.searchParams.set("page", "1");
      }

      if (currentPageSize && !params.hasOwnProperty("pageSize")) {
        url.searchParams.set("pageSize", currentPageSize);
      }

      router.push(url.pathname + url.search);
    },
    [router]
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    const timeout = setTimeout(() => {
      debouncedUpdateUrl({ search: value || null });
    }, 500);
    return () => clearTimeout(timeout);
  };

  const applyFilters = () => {
    setIsApplying(true);
    debouncedUpdateUrl({
      location: location || null,
      minCapacity: minCapacity || null,
      maxCapacity: maxCapacity || null,
      facilities: selectedFacilities.length > 0 ? selectedFacilities : null,
    });

    setTimeout(() => setIsApplying(false), 300);
  };

  const resetFilters = () => {
    setSearch("");
    setLocation("");
    setMinCapacity("");
    setMaxCapacity("");
    setSelectedFacilities([]);
    debouncedUpdateUrl({
      search: null,
      location: null,
      minCapacity: null,
      maxCapacity: null,
      facilities: null,
    });
  };

  useEffect(() => {
    let count = 0;
    if (location) count++;
    if (minCapacity) count++;
    if (maxCapacity) count++;
    if (selectedFacilities.length) count++;
    setActiveFilters(count);
  }, [location, minCapacity, maxCapacity, selectedFacilities]);

  const toggleFacility = (facility: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility)
        ? prev.filter((f) => f !== facility)
        : [...prev, facility]
    );
  };

  const removeFilter = (type: string, value?: string) => {
    switch (type) {
      case "location":
        setLocation("");
        debouncedUpdateUrl({ location: null });
        break;
      case "minCapacity":
        setMinCapacity("");
        debouncedUpdateUrl({ minCapacity: null });
        break;
      case "maxCapacity":
        setMaxCapacity("");
        debouncedUpdateUrl({ maxCapacity: null });
        break;
      case "facility":
        if (value) {
          const newFacilities = selectedFacilities.filter((f) => f !== value);
          setSelectedFacilities(newFacilities);
          debouncedUpdateUrl({
            facilities: newFacilities.length ? newFacilities : null,
          });
        }
        break;
      default:
        break;
    }
  };

  const FacilityBadge = ({ facility }: { facility: string }) => {
    const IconComponent = facilityIcons[facility] || Grid;
    return (
      <Badge variant="secondary" className="flex gap-1 items-center">
        <IconComponent className="h-3 w-3 mr-1" />
        {facility}
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 ml-1 rounded-full"
          onClick={() => removeFilter("facility", facility)}
        >
          <X className="h-2 w-2" />
        </Button>
      </Badge>
    );
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="relative flex-1 group">
          <div className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 transition-all duration-300 group-focus-within:text-primary group-focus-within:scale-110">
            <Search className="h-full w-full text-muted-foreground group-focus-within:text-primary" />
          </div>
          <Input
            placeholder="🔍 Cari ruangan... contoh: 'ruang rapat'"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 sm:pl-12 pr-10 sm:pr-12 h-11 sm:h-12 text-sm sm:text-base rounded-xl sm:rounded-2xl border-2 border-muted/40 focus:border-primary/50 transition-all duration-300 bg-gradient-to-r from-background to-muted/20 backdrop-blur-sm hover:shadow-lg focus:shadow-xl"
          />
          {search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 sm:right-3 top-1/2 h-5 w-5 sm:h-6 sm:w-6 -translate-y-1/2 rounded-full hover:bg-primary/10 transition-all duration-300 hover:scale-110"
              onClick={() => handleSearch("")}
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          )}
          {!search && (
            <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60">
              <div className="text-base sm:text-lg">🔍</div>
            </div>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="relative h-11 sm:h-12 px-4 sm:px-6 rounded-xl sm:rounded-2xl border-2 border-muted/40 hover:border-primary/50 bg-gradient-to-r from-background to-muted/10 backdrop-blur-sm transition-all duration-300 hover:shadow-lg group min-w-0 flex-shrink-0"
            >
              <Filter className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 group-hover:rotate-12" />
              <span className="font-medium text-sm sm:text-base">Filter</span>
              {activeFilters > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 sm:ml-3 px-1.5 sm:px-2 py-0.5 min-w-5 sm:min-w-6 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white border-0 animate-pulse text-xs sm:text-sm"
                >
                  {activeFilters}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md p-0 overflow-y-auto flex flex-col">
            <SheetHeader className="p-6 pb-4 border-b">
              <SheetTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-lg">
                  <Filter className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent font-bold">
                  Filter Pencarian
                </span>
              </SheetTitle>
              <SheetDescription className="text-base text-muted-foreground mt-2">
                Sesuaikan pencarian untuk menemukan ruangan yang tepat sesuai
                kebutuhan Anda.
              </SheetDescription>
            </SheetHeader>

            <div className="px-6 py-6 space-y-8 flex-1 overflow-y-auto">
              <div className="space-y-4 p-4 rounded-2xl bg-muted/50 border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-950/50">
                    <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold">📍 Lokasi</h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Cari berdasarkan gedung, lantai, atau area untuk menemukan
                  ruangan di lokasi yang Anda inginkan.
                </p>
                <Input
                  placeholder="Contoh: 'Gedung A' atau 'Lantai 2'"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-11 rounded-xl border-2 border-muted/40 focus:border-primary/50 transition-all duration-300"
                />
              </div>

              <div className="space-y-4 p-4 rounded-2xl bg-muted/50 border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-950/50 dark:to-emerald-950/50">
                    <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold">👥 Kapasitas</h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Tentukan jumlah orang yang akan menggunakan ruangan untuk
                  menemukan ukuran yang sesuai.
                </p>
                <div className="flex gap-4 items-end">
                  <div className="flex-1 space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Minimum
                    </label>
                    <Input
                      type="number"
                      placeholder="2"
                      value={minCapacity}
                      onChange={(e) => setMinCapacity(e.target.value)}
                      className="h-11 rounded-xl border-2 border-muted/40 focus:border-primary/50 transition-all duration-300"
                    />
                  </div>
                  <div className="text-2xl text-muted-foreground mb-3">-</div>
                  <div className="flex-1 space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Maksimum
                    </label>
                    <Input
                      type="number"
                      placeholder="20"
                      value={maxCapacity}
                      onChange={(e) => setMaxCapacity(e.target.value)}
                      className="h-11 rounded-xl border-2 border-muted/40 focus:border-primary/50 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-4 rounded-2xl bg-muted/50 border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-950/50 dark:to-indigo-950/50">
                    <Grid className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold">🛠️ Fasilitas</h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Pilih fasilitas dan teknologi yang Anda butuhkan untuk
                  mendukung aktivitas di ruangan.
                </p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between h-12 rounded-xl border-2 border-muted/40 hover:border-primary/50 bg-gradient-to-r from-background to-muted/10 transition-all duration-300 hover:shadow-lg"
                    >
                      <span className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">
                          {selectedFacilities.length
                            ? `${selectedFacilities.length} fasilitas terpilih`
                            : "Pilih fasilitas yang dibutuhkan"}
                        </span>
                      </span>
                      <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform duration-200" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-[340px] max-h-[350px] overflow-y-auto rounded-xl border-2 backdrop-blur-sm bg-background/95"
                  >
                    <DropdownMenuLabel className="text-base font-semibold text-primary">
                      🛠️ Fasilitas Tersedia
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {COMMON_FACILITIES.map((facility) => (
                      <DropdownMenuCheckboxItem
                        key={facility}
                        checked={selectedFacilities.includes(facility)}
                        onCheckedChange={() => toggleFacility(facility)}
                        className="py-3 text-sm hover:bg-primary/10 rounded-lg mx-1 transition-all duration-200"
                      >
                        <div className="flex items-center gap-2">
                          {facilityIcons[facility] && (
                            <div className="text-primary">
                              {React.createElement(facilityIcons[facility], {
                                className: "h-4 w-4",
                              })}
                            </div>
                          )}
                          <span>{facility}</span>
                        </div>
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="mt-auto px-6 py-4 border-t bg-muted/30">
              <div className="text-sm text-center mb-3">
                {activeFilters === 0 ? (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <div className="text-lg">🎯</div>
                    <span>
                      Siap untuk mencari! Belum ada filter yang diterapkan
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <div className="text-lg">✨</div>
                    <span className="text-primary font-medium">
                      {activeFilters} filter aktif
                    </span>
                  </div>
                )}
              </div>
            </div>

            <SheetFooter className="px-6 pb-6 pt-3 bg-muted/30">
              <div className="flex w-full gap-4">
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="flex-1 h-12 rounded-xl border-2 hover:bg-muted/50 transition-all duration-300 hover:scale-105"
                >
                  🔄 Hapus Semua
                </Button>
                <SheetClose asChild>
                  <Button
                    onClick={applyFilters}
                    className="flex-1 h-12 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                    disabled={isApplying}
                  >
                    {isApplying ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Menerapkan filter...
                      </>
                    ) : (
                      <>🚀 Terapkan Filter</>
                    )}
                  </Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {activeFilters > 0 && (
        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 backdrop-blur-sm border border-primary/10">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <div className="text-base sm:text-lg">🏷️</div>
            <span className="text-xs sm:text-sm font-medium text-primary">
              Filter Aktif
            </span>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {location && (
              <Badge className="flex gap-1 sm:gap-2 items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-950/50 text-blue-700 dark:text-blue-300 border-0 hover:shadow-lg transition-all duration-300 text-xs sm:text-sm">
                <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span className="truncate max-w-[120px] sm:max-w-none">
                  {location}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 sm:h-5 sm:w-5 ml-0.5 sm:ml-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-200 hover:scale-110"
                  onClick={() => removeFilter("location")}
                >
                  <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </Button>
              </Badge>
            )}

            {minCapacity && (
              <Badge className="flex gap-1 sm:gap-2 items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-950/50 dark:to-emerald-950/50 text-green-700 dark:text-green-300 border-0 hover:shadow-lg transition-all duration-300 text-xs sm:text-sm">
                <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span>Min: {minCapacity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 sm:h-5 sm:w-5 ml-0.5 sm:ml-1 rounded-full hover:bg-green-200 dark:hover:bg-green-800 transition-all duration-200 hover:scale-110"
                  onClick={() => removeFilter("minCapacity")}
                >
                  <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </Button>
              </Badge>
            )}

            {maxCapacity && (
              <Badge className="flex gap-1 sm:gap-2 items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-950/50 dark:to-emerald-950/50 text-green-700 dark:text-green-300 border-0 hover:shadow-lg transition-all duration-300 text-xs sm:text-sm">
                <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span>Maks: {maxCapacity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 sm:h-5 sm:w-5 ml-0.5 sm:ml-1 rounded-full hover:bg-green-200 dark:hover:bg-green-800 transition-all duration-200 hover:scale-110"
                  onClick={() => removeFilter("maxCapacity")}
                >
                  <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </Button>
              </Badge>
            )}

            {selectedFacilities.map((facility) => (
              <Badge
                key={facility}
                className="flex gap-1 sm:gap-2 items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-950/50 dark:to-indigo-950/50 text-purple-700 dark:text-purple-300 border-0 hover:shadow-lg transition-all duration-300 text-xs sm:text-sm"
              >
                {facilityIcons[facility] &&
                  React.createElement(facilityIcons[facility], {
                    className: "h-2.5 w-2.5 sm:h-3 sm:w-3",
                  })}
                <span className="truncate max-w-[80px] sm:max-w-none">
                  {facility}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 sm:h-5 sm:w-5 ml-0.5 sm:ml-1 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 transition-all duration-200 hover:scale-110"
                  onClick={() => removeFilter("facility", facility)}
                >
                  <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </Button>
              </Badge>
            ))}

            {activeFilters > 1 && (
              <Button
                variant="ghost"
                className="px-3 sm:px-4 py-1.5 sm:py-2 h-8 sm:h-10 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-all duration-300 hover:scale-105"
                onClick={resetFilters}
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">🧹 Hapus semua filter</span>
                <span className="sm:hidden">🧹 Reset</span>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
