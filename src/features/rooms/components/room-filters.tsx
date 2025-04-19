"use client";

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

// Common facilities for dropdown selection
const COMMON_FACILITIES = [
  "Projector",
  "Whiteboard",
  "TV",
  "Video Conference",
  "Air Conditioning",
  "Catering",
  "WiFi",
  "Wheelchair Access",
];

export function RoomFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL search params
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

  // Track active filters for display
  const [activeFilters, setActiveFilters] = useState(0);

  // Create a debounced search update
  const debouncedUpdateUrl = useCallback(
    (params: Record<string, string | string[] | null>) => {
      const url = new URL(window.location.href);

      // Update search params
      Object.entries(params).forEach(([key, value]) => {
        if (
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          url.searchParams.delete(key);
        } else if (Array.isArray(value)) {
          url.searchParams.delete(key); // Clear existing values
          value.forEach((v) => url.searchParams.append(key, v));
        } else {
          url.searchParams.set(key, value);
        }
      });

      router.push(url.pathname + url.search);
    },
    [router]
  );

  // Handle search input with debounce
  const handleSearch = (value: string) => {
    setSearch(value);
    const timeout = setTimeout(() => {
      debouncedUpdateUrl({ search: value || null });
    }, 500);
    return () => clearTimeout(timeout);
  };

  // Apply filters from modal
  const applyFilters = () => {
    setIsApplying(true);
    debouncedUpdateUrl({
      location: location || null,
      minCapacity: minCapacity || null,
      maxCapacity: maxCapacity || null,
      facilities: selectedFacilities.length > 0 ? selectedFacilities : null,
    });

    // Simulate a slight delay to show loading state
    setTimeout(() => setIsApplying(false), 300);
  };

  // Reset all filters
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

  // Calculate active filters count
  useEffect(() => {
    let count = 0;
    if (location) count++;
    if (minCapacity) count++;
    if (maxCapacity) count++;
    if (selectedFacilities.length) count++;
    setActiveFilters(count);
  }, [location, minCapacity, maxCapacity, selectedFacilities]);

  // Toggle a facility in the selected list
  const toggleFacility = (facility: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility)
        ? prev.filter((f) => f !== facility)
        : [...prev, facility]
    );
  };

  // Remove a single filter
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

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or description..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 w-full"
          />
          {search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full"
              onClick={() => handleSearch("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {activeFilters > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 px-1.5 min-w-5 rounded-full"
                >
                  {activeFilters}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md p-0 overflow-y-auto flex flex-col">
            <SheetHeader className="p-6 pb-2">
              <SheetTitle className="flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Room Filters
              </SheetTitle>
              <SheetDescription>
                Find the perfect room by refining your search
              </SheetDescription>
            </SheetHeader>

            <Separator />

            <div className="px-6 py-5 space-y-8 flex-1 overflow-y-auto">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Location</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Filter rooms by building, floor, or area to find spaces in
                  your preferred location
                </p>
                <Input
                  placeholder="Enter a location..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Capacity Range</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Specify the room size you need by setting minimum and maximum
                  capacity
                </p>
                <div className="flex gap-3 items-center">
                  <div className="flex-1 space-y-1">
                    <span className="text-xs text-muted-foreground">
                      Minimum
                    </span>
                    <Input
                      type="number"
                      placeholder="Min"
                      value={minCapacity}
                      onChange={(e) => setMinCapacity(e.target.value)}
                    />
                  </div>
                  <span className="text-muted-foreground mt-6">-</span>
                  <div className="flex-1 space-y-1">
                    <span className="text-xs text-muted-foreground">
                      Maximum
                    </span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={maxCapacity}
                      onChange={(e) => setMaxCapacity(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Grid className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Facilities</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Choose the amenities and equipment your meeting requires
                </p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      <span className="flex items-center">
                        <Settings className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>
                          {selectedFacilities.length
                            ? `${selectedFacilities.length} selected`
                            : "Select facilities"}
                        </span>
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-[320px] max-h-[300px] overflow-y-auto"
                  >
                    <DropdownMenuLabel>Available Facilities</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {COMMON_FACILITIES.map((facility) => (
                      <DropdownMenuCheckboxItem
                        key={facility}
                        checked={selectedFacilities.includes(facility)}
                        onCheckedChange={() => toggleFacility(facility)}
                        className="capitalize"
                      >
                        {facility}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="mt-auto px-6 py-3 border-t">
              <div className="text-xs text-muted-foreground mb-2">
                {activeFilters === 0 ? (
                  <span>No active filters</span>
                ) : (
                  <span>
                    Active filters: <strong>{activeFilters}</strong>
                  </span>
                )}
              </div>
            </div>

            <SheetFooter className="px-6 pb-6 pt-2">
              <div className="flex w-full gap-3">
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="flex-1"
                >
                  Reset All
                </Button>
                <SheetClose asChild>
                  <Button
                    onClick={applyFilters}
                    className="flex-1"
                    disabled={isApplying}
                  >
                    {isApplying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Applying...
                      </>
                    ) : (
                      "Apply Filters"
                    )}
                  </Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {activeFilters > 0 && (
        <div className="flex flex-wrap gap-2">
          {location && (
            <Badge variant="secondary" className="flex gap-1 items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {location}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 rounded-full"
                onClick={() => removeFilter("location")}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}

          {minCapacity && (
            <Badge variant="secondary" className="flex gap-1 items-center">
              <Users className="h-3 w-3 mr-1" />
              Min: {minCapacity}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 rounded-full"
                onClick={() => removeFilter("minCapacity")}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}

          {maxCapacity && (
            <Badge variant="secondary" className="flex gap-1 items-center">
              <Users className="h-3 w-3 mr-1" />
              Max: {maxCapacity}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 rounded-full"
                onClick={() => removeFilter("maxCapacity")}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}

          {selectedFacilities.map((facility) => (
            <Badge
              key={facility}
              variant="secondary"
              className="flex gap-1 items-center"
            >
              <Grid className="h-3 w-3 mr-1" />
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
          ))}

          {activeFilters > 1 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs font-medium"
              onClick={resetFilters}
            >
              <X className="h-3 w-3 mr-1" />
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
