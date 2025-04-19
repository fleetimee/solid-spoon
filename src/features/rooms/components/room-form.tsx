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
} from "@/components/ui/form";
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
} from "lucide-react";
import Image from "next/image";
import { Alert, AlertDescription } from "@/components/ui/alert";
import * as z from "zod";
import { useImageUpload } from "../helpers/image-upload";

// Define validation schema for new room
const formSchema = z.object({
  name: z.string().min(1, "Room name is required"),
  location: z.string().min(1, "Location is required"),
  capacity: z.coerce
    .number()
    .min(1, "Capacity must be at least 1")
    .max(1000, "Capacity cannot exceed 1000"),
  description: z.string().optional(),
  facilities: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface RoomFormProps {
  initialValues?: Partial<FormValues>;
}

export function RoomForm({ initialValues }: RoomFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Use the image upload hook
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
      facilities: initialValues?.facilities || "",
    },
  });

  const onSubmit = (values: FormValues) => {
    setErrorMessage(null); // Reset error message on new submission

    // Validate images
    const imageValidation = validateImages();
    if (!imageValidation.isValid) {
      setErrorMessage(imageValidation.error || "Image validation failed");
      return;
    }

    startTransition(async () => {
      // Prepare form data for submission
      const formData = new FormData();

      // Add form values to formData
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // Add image data to formData
      prepareImagesForSubmission(formData);

      // Submit the form data
      const result = await createRoomAction(formData);

      if (result.success) {
        toast("Room created successfully!", {});

        // Redirect to rooms list after successful submission
        router.push("/admin/rooms");
      } else {
        setErrorMessage(result.message);

        // Set form errors if applicable
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Room Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Conference Room A" {...field} />
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
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Floor 2, Building A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Capacity
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="10"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.valueAsNumber);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A description of the room..."
                      rows={4}
                      {...field}
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
                  <FormLabel className="flex items-center gap-2">
                    <LayoutGrid className="h-4 w-4" />
                    Facilities
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Projector, Whiteboard, Video conferencing..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <FormLabel htmlFor="images" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Room Images <span className="text-destructive ml-1">*</span>
              </FormLabel>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="images"
                  className={`flex flex-col items-center justify-center w-full h-32 
                          border-2 border-dashed rounded-md cursor-pointer 
                          border-gray-300 hover:border-gray-400 transition-colors
                          ${isUploading ? "opacity-50 cursor-wait" : ""}
                          ${!hasSuccessfulUploads() && !isUploading ? "border-destructive/50 hover:border-destructive" : ""}`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {isUploading ? (
                      <>
                        <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
                        <p className="mt-2 text-sm text-gray-500">
                          Uploading...
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload
                          className={`w-8 h-8 ${!hasSuccessfulUploads() ? "text-destructive/70" : "text-gray-500"}`}
                        />
                        <p
                          className={`mt-2 text-sm ${!hasSuccessfulUploads() ? "text-destructive/70" : "text-gray-500"}`}
                        >
                          Click to upload images
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

            {/* Image previews */}
            {images.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  First image or selected image will be used as cover
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {images.map((img, index) => (
                    <Card
                      key={index}
                      className={`relative overflow-hidden group ${
                        img.status === "error" ? "border-red-500" : ""
                      }`}
                    >
                      <div className="aspect-square relative">
                        <Image
                          src={img.preview}
                          alt={`Room image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        {img.isCover && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white p-1 rounded-md">
                            <Check className="w-4 h-4" />
                          </div>
                        )}

                        {/* Upload status indicator */}
                        <div
                          className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center
                            ${img.status === "uploading" ? "visible" : "invisible"}`}
                        >
                          <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>

                        {img.status === "error" && (
                          <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white p-1 text-xs">
                            Upload failed
                          </div>
                        )}
                      </div>
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="w-8 h-8"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        {!img.isCover && img.status === "success" && (
                          <Button
                            type="button"
                            size="icon"
                            variant="secondary"
                            className="w-8 h-8"
                            onClick={() => setCoverImage(index)}
                            title="Set as cover"
                          >
                            <ImageIcon className="w-4 h-4" />
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
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {!hasSuccessfulUploads() ? <strong>Required: </strong> : null}
                Add at least one image to showcase the room. Images will be
                uploaded immediately. The first successful upload will
                automatically be set as the cover image.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-4">
          <Button type="submit" disabled={isPending || isUploading}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Room
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/rooms")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
