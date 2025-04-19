"use client";

import { useState } from "react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multi-select";
import { createRoomAction } from "../api/createRoom";
import {
  X,
  Check,
  Loader2,
  Upload,
  Image as ImageIcon,
  AlertCircle,
  Home,
  MapPin,
  Users,
  FileText,
  LayoutGrid,
  HelpCircle,
  Star,
  Projector,
  MonitorSmartphone,
  Wifi,
  Music2,
  Coffee,
  Airplay,
  PanelTop,
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
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import * as z from "zod";
import { useImageUpload } from "../helpers/image-upload";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const formSchema = z.object({
  name: z.string().min(1, "Room name is required"),
  location: z.string().min(1, "Location is required"),
  capacity: z.coerce
    .number()
    .min(1, "Capacity must be at least 1")
    .max(1000, "Capacity cannot exceed 1000"),
  description: z.string().optional(),
  facilities: z.array(z.string()).optional(),
});

const facilityOptions = [
  { value: "Projector", label: "Projector", icon: Projector },
  { value: "Whiteboard", label: "Whiteboard", icon: PanelTop },
  {
    value: "Video Conferencing",
    label: "Video Conferencing",
    icon: MonitorSmartphone,
  },
  { value: "Wi-Fi", label: "Wi-Fi", icon: Wifi },
  { value: "Sound System", label: "Sound System", icon: Music2 },
  { value: "Refreshments", label: "Refreshments", icon: Coffee },
  { value: "Screen Sharing", label: "Screen Sharing", icon: Airplay },
  {
    value: "Teleconferencing",
    label: "Teleconferencing",
    icon: MonitorSmartphone,
  },
  { value: "Flipchart", label: "Flipchart", icon: FileText },
  { value: "Air Conditioning", label: "Air Conditioning", icon: Thermometer },
  { value: "Heating", label: "Heating", icon: Thermometer },
  { value: "Natural Light", label: "Natural Light", icon: Sun },
  { value: "Blackout Curtains", label: "Blackout Curtains", icon: Currency },
  { value: "Soundproofing", label: "Soundproofing", icon: Volume2 },
  { value: "Ergonomic Chairs", label: "Ergonomic Chairs", icon: Armchair },
  { value: "Standing Desks", label: "Standing Desks", icon: Table2Icon },
  {
    value: "Adjustable Lighting",
    label: "Adjustable Lighting",
    icon: Lightbulb,
  },
  { value: "Acoustic Panels", label: "Acoustic Panels", icon: PanelLeftClose },
  { value: "Smart Lighting", label: "Smart Lighting", icon: LightbulbIcon },
];

type FormValues = z.infer<typeof formSchema>;

interface RoomFormProps {
  initialValues?: Partial<FormValues>;
}

export function RoomForm({ initialValues }: RoomFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(
    initialValues?.facilities ?? []
  );

  const {
    images,
    isUploading,
    handleImagesChange,
    handleRemoveImage,
    setCoverImage,
    validateImages,
    prepareImagesForSubmission,
    hasSuccessfulUploads,
  } = useImageUpload();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues?.name || "",
      location: initialValues?.location || "",
      capacity: initialValues?.capacity || 1,
      description: initialValues?.description || "",
      facilities: initialValues?.facilities || [],
    },
  });

  const onSubmit = (values: FormValues) => {
    setErrorMessage(null);

    const imageValidation = validateImages();
    if (!imageValidation.isValid) {
      setErrorMessage(imageValidation.error || "Image validation failed");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("location", values.location);
      formData.append("capacity", String(values.capacity));

      if (values.description) {
        formData.append("description", values.description);
      }

      if (values.facilities && values.facilities.length > 0) {
        formData.append("facilities", JSON.stringify(values.facilities));
      } else {
        formData.append("facilities", "");
      }

      prepareImagesForSubmission(formData);

      const result = await createRoomAction(formData);

      if (result.success) {
        toast("Room created successfully!", {});

        router.push("/admin/rooms");
      } else {
        setErrorMessage(result.message);

        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, errors]) => {
            if (field in form.formState.errors && errors.length > 0) {
              form.setError(field as keyof FormValues, {
                type: "manual",
                message: errors[0],
              });
            }
          });
        }
      }
    });
  };

  return (
    <TooltipProvider>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
                <Star className="h-5 w-5" />
                Create Your Perfect Space
              </h2>
              <p className="text-muted-foreground mt-1">
                Start by providing the essential details about your room. A
                descriptive name and accurate location help users find the right
                space for their needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card rounded-lg p-6 border shadow-sm">
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-base">
                        <Home className="h-4 w-4" />
                        Room Name
                      </FormLabel>
                      <FormDescription>
                        Choose a clear, memorable name for easy identification
                      </FormDescription>
                      <FormControl>
                        <Input
                          placeholder="Conference Room A"
                          {...field}
                          className="mt-2"
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
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-base">
                        <MapPin className="h-4 w-4" />
                        Location
                      </FormLabel>
                      <FormDescription>
                        Specify the building, floor, or area where the room is
                        located
                      </FormDescription>
                      <FormControl>
                        <Input
                          placeholder="Floor 2, Building A"
                          {...field}
                          className="mt-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="flex items-center gap-2 text-base">
                          <Users className="h-4 w-4" />
                          Capacity
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
                      <FormDescription>
                        How many people can the room accommodate?
                      </FormDescription>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="10"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.valueAsNumber);
                          }}
                          className="mt-2"
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
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-base">
                        <LayoutGrid className="h-4 w-4" />
                        Facilities
                      </FormLabel>
                      <FormDescription>
                        Select amenities available in this room
                      </FormDescription>
                      <FormControl>
                        <MultiSelect
                          animation={1}
                          options={facilityOptions}
                          onValueChange={(values) => {
                            setSelectedFacilities(values);
                            field.onChange(values);
                          }}
                          value={selectedFacilities}
                          placeholder="Select facilities"
                          className="min-h-10"
                          maxCount={5}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
                <FileText className="h-5 w-5" />
                Tell Us More
              </h2>
              <p className="text-muted-foreground mt-1">
                Help users understand what makes this room special with a
                detailed description.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border shadow-sm">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-base">
                      <FileText className="h-4 w-4" />
                      Room Description
                    </FormLabel>
                    <FormDescription>
                      Provide details about the room&apos;s features,
                      atmosphere, and ideal uses
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="A spacious conference room with natural lighting, perfect for team meetings and presentations..."
                        rows={4}
                        {...field}
                        className="mt-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
                <ImageIcon className="h-5 w-5" />
                Show It Off
              </h2>
              <p className="text-muted-foreground mt-1">
                A picture is worth a thousand words. Upload high-quality images
                to showcase your room&apos;s best features.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border shadow-sm space-y-6">
              <div className="space-y-2">
                <FormLabel
                  htmlFor="images"
                  className="flex items-center gap-2 text-base"
                >
                  <Upload className="h-4 w-4" />
                  Room Images <span className="text-destructive ml-1">*</span>
                </FormLabel>
                <FormDescription>
                  Upload clear, well-lit photos showing different angles of the
                  room
                </FormDescription>
                <div className="flex items-center gap-2 mt-3">
                  <label
                    htmlFor="images"
                    className={`flex flex-col items-center justify-center w-full h-40
                        border-2 border-dashed rounded-md cursor-pointer 
                        transition-all duration-200 ease-in-out
                        ${isUploading ? "opacity-50 cursor-wait" : ""}
                        ${
                          !hasSuccessfulUploads() && !isUploading
                            ? "border-destructive/50 hover:border-destructive bg-destructive/5 hover:bg-destructive/10"
                            : "border-primary/20 hover:border-primary/30 bg-primary/5 hover:bg-primary/10"
                        }`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {isUploading ? (
                        <>
                          <Loader2 className="w-10 h-10 text-primary/70 animate-spin" />
                          <p className="mt-3 text-sm font-medium text-muted-foreground">
                            Uploading your images...
                          </p>
                          <p className="text-xs text-muted-foreground/70 mt-1">
                            This might take a moment
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload
                            className={`w-10 h-10 ${!hasSuccessfulUploads() ? "text-destructive/70" : "text-primary/70"}`}
                          />
                          <p
                            className={`mt-3 text-sm font-medium ${!hasSuccessfulUploads() ? "text-destructive/70" : "text-muted-foreground"}`}
                          >
                            Click to upload photos
                          </p>
                          <p className="text-xs text-muted-foreground/70 mt-1">
                            PNG, JPG, WEBP up to 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </label>
                  <Input
                    id="images"
                    name="images"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImagesChange}
                    disabled={isUploading}
                  />
                </div>
              </div>

              {images.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-green-500" />
                      <span>Uploaded Photos</span>
                      <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">
                        {images.length}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      First image or selected image will be used as cover
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((img, index) => (
                      <Card
                        key={index}
                        className={`relative overflow-hidden group ring-offset-background transition-all hover:ring-2 hover:ring-ring hover:ring-offset-2 ${
                          img.status === "error"
                            ? "border-red-500"
                            : img.isCover
                              ? "ring-2 ring-primary ring-offset-2"
                              : ""
                        }`}
                      >
                        <div className="aspect-[3/2] relative">
                          <Image
                            src={img.preview}
                            alt={`Room image ${index + 1}`}
                            fill
                            className="object-cover rounded-md"
                          />
                          {img.isCover && (
                            <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              Cover
                            </div>
                          )}

                          <div
                            className={`absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center
                              ${img.status === "uploading" ? "visible" : "invisible"}`}
                          >
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                          </div>

                          {img.status === "error" && (
                            <div className="absolute bottom-0 inset-x-0 bg-destructive text-destructive-foreground p-2 text-xs text-center font-medium">
                              Upload failed
                            </div>
                          )}
                        </div>
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="w-8 h-8 rounded-full"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          {!img.isCover && img.status === "success" && (
                            <Button
                              type="button"
                              size="icon"
                              variant="secondary"
                              className="w-8 h-8 rounded-full"
                              onClick={() => setCoverImage(index)}
                              title="Set as cover"
                            >
                              <Star className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <Alert
                variant={!hasSuccessfulUploads() ? "destructive" : "default"}
                className="mt-4"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="font-medium">
                  {!hasSuccessfulUploads() ? "Photos Required" : "Upload Tips"}
                </AlertTitle>
                <AlertDescription className="text-sm mt-1">
                  {!hasSuccessfulUploads()
                    ? "Please upload at least one photo to showcase the room. This helps users make informed decisions."
                    : "Photos are uploaded immediately. You can rearrange them by setting a different cover image. Clear, bright photos help your room stand out!"}
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="border-t pt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <p>
                All fields marked with{" "}
                <span className="text-destructive">*</span> are required
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/rooms")}
                className="min-w-[100px]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || isUploading}
                className="min-w-[150px]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Room"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </TooltipProvider>
  );
}
