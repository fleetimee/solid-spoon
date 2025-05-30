import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Home,
  MapPin,
  Users,
  LayoutGrid,
  HelpCircle,
  Building2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../../schemas/room-form-schema";
import { facilityOptions } from "../../utils/facility-options";

interface BasicInfoSectionProps {
  form: UseFormReturn<FormValues>;
  isUpdateMode: boolean;
}

export function BasicInfoSection({
  form,
  isUpdateMode,
}: BasicInfoSectionProps) {
  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-card via-card to-muted/20">
      <CardHeader className="space-y-3 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-md">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              🏢 Basic Information
            </CardTitle>
            <CardDescription className="text-base">
              {isUpdateMode
                ? "Update the essential details about your room"
                : "Let's start with the fundamentals of your space"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="flex items-center gap-2 text-base font-semibold">
                    <Home className="h-4 w-4 text-primary" />
                    Room Name
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormDescription className="text-sm text-muted-foreground">
                    Choose a clear, memorable name for easy identification
                  </FormDescription>
                  <FormControl>
                    <Input
                      placeholder="e.g., Innovation Hub, Meeting Room Alpha"
                      {...field}
                      className="h-12 text-base border-2 focus:border-primary/50 transition-colors"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="flex items-center gap-2 text-base font-semibold">
                    <MapPin className="h-4 w-4 text-primary" />
                    Location
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormDescription className="text-sm text-muted-foreground">
                    Specify the building, floor, or area where the room is
                    located
                  </FormDescription>
                  <FormControl>
                    <Input
                      placeholder="e.g., Floor 2, Building A, West Wing"
                      {...field}
                      className="h-12 text-base border-2 focus:border-primary/50 transition-colors"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <div className="flex items-center justify-between">
                    <FormLabel className="flex items-center gap-2 text-base font-semibold">
                      <Users className="h-4 w-4 text-primary" />
                      Capacity
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          className="h-6 w-6"
                        >
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          This is the maximum number of people the room can
                          accommodate comfortably.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <FormDescription className="text-sm text-muted-foreground">
                    How many people can the room accommodate comfortably?
                  </FormDescription>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="1000"
                      placeholder="e.g., 12"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.valueAsNumber);
                      }}
                      className="h-12 text-base border-2 focus:border-primary/50 transition-colors"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="facilities"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="flex items-center gap-2 text-base font-semibold">
                    <LayoutGrid className="h-4 w-4 text-primary" />
                    Facilities & Amenities
                  </FormLabel>
                  <FormDescription className="text-sm text-muted-foreground">
                    Select amenities available in this room
                  </FormDescription>
                  <FormControl>
                    <MultiSelect
                      animation={1}
                      options={facilityOptions}
                      onValueChange={field.onChange}
                      value={field.value}
                      placeholder="Select facilities..."
                      className="min-h-12 border-2 focus:border-primary/50"
                      maxCount={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
