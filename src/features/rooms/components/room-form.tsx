"use client";

import { useState, useEffect } from "react";
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
import { updateRoomAction } from "../api/updateRoom";
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
  Blinds,
  Volume2,
  Armchair,
  Monitor,
  Lightbulb,
  VolumeX,
} from "lucide-react";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import * as z from "zod";
import {
  useImageUpload,
  type ExistingImageState,
} from "../helpers/image-upload";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Room } from "../types/room";

const formSchema = z.object({
  name: z.string().min(1, "Nama ruangan diperlukan"),
  location: z.string().min(1, "Lokasi diperlukan"),
  capacity: z.coerce
    .number()
    .min(1, "Kapasitas minimal 1 orang")
    .max(1000, "Kapasitas tidak boleh melebihi 1000 orang"),
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
  { value: "Blackout Curtains", label: "Blackout Curtains", icon: Blinds },
  { value: "Soundproofing", label: "Soundproofing", icon: Volume2 },
  { value: "Ergonomic Chairs", label: "Ergonomic Chairs", icon: Armchair },
  { value: "Standing Desks", label: "Standing Desks", icon: Monitor },
  {
    value: "Adjustable Lighting",
    label: "Adjustable Lighting",
    icon: Lightbulb,
  },
  { value: "Acoustic Panels", label: "Acoustic Panels", icon: VolumeX },
  { value: "Smart Lighting", label: "Smart Lighting", icon: Lightbulb },
];

type FormValues = z.infer<typeof formSchema>;

interface RoomFormProps {
  room?: Room;
  mode?: "create" | "update";
}

export function RoomForm({ room, mode = "create" }: RoomFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isUpdateMode = mode === "update";

  // Parse facilities from string to array if present (handling both JSON array and comma-separated values)
  const parseFacilities = (
    facilitiesStr: string | null | undefined
  ): string[] => {
    if (!facilitiesStr) return [];

    try {
      if (facilitiesStr.startsWith("[")) {
        return JSON.parse(facilitiesStr);
      }
      return facilitiesStr
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);
    } catch {
      return facilitiesStr ? [facilitiesStr] : [];
    }
  };

  const initialFacilities = room?.facilities
    ? parseFacilities(room.facilities)
    : [];

  const {
    images,
    existingImages,
    setExistingImages,
    removedImages,
    isUploading,
    handleImagesChange,
    handleRemoveImage,
    handleRemoveExistingImage,
    setCoverImage,
    setExistingCoverImage,
    validateImages,
    prepareImagesForSubmission,
    hasSuccessfulUploads,
  } = useImageUpload();

  // Initialize existing images if we're in update mode
  useEffect(() => {
    if (isUpdateMode && room?.images?.length) {
      const initialImages: ExistingImageState[] = room.images.map((url) => ({
        url,
        isCover: url === room.coverImage,
      }));
      setExistingImages(initialImages);
    }
  }, [isUpdateMode, room?.images, room?.coverImage, setExistingImages]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: room?.name || "",
      location: room?.location || "",
      capacity: room?.capacity || 1,
      description: room?.description || "",
      facilities: initialFacilities,
    },
  });

  const onSubmit = (values: FormValues) => {
    setErrorMessage(null);

    // For update mode, we need at least one image (new or existing)
    let imageValidation;
    if (isUpdateMode) {
      imageValidation = {
        isValid: hasSuccessfulUploads() || existingImages.length > 0,
        error: "Setidaknya satu gambar diperlukan untuk ruangan",
      };
    } else {
      imageValidation = validateImages();
    }

    if (!imageValidation.isValid) {
      setErrorMessage(imageValidation.error || "Validasi gambar gagal");
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

      // Add images for submission (different handling for create vs update)
      prepareImagesForSubmission(formData);

      // For update mode, include existing and removed images
      if (isUpdateMode && room?.id) {
        existingImages.forEach((image, index) => {
          formData.append("existingImageUrls", image.url);
          if (image.isCover) {
            formData.append("existingCover", String(index));
          }
        });

        removedImages.forEach((url) => {
          formData.append("removedImageUrls", url);
        });

        const result = await updateRoomAction(room.id, formData);

        if (result.success) {
          toast.success("Ruangan berhasil diperbarui", {
            description: `${values.name} telah diperbarui.`,
          });

          router.push(`/admin/rooms/${result.room?.slug || ""}`);
          router.refresh();
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
      } else {
        // Handle create mode
        const result = await createRoomAction(formData);

        if (result.success) {
          toast.success("Ruangan berhasil dibuat", {
            description: `${values.name} telah dibuat.`,
          });

          router.push("/admin/rooms");
          router.refresh();
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
                {isUpdateMode
                  ? "Perbarui Detail Ruangan"
                  : "Buat Ruangan Sempurna Anda"}
              </h2>
              <p className="text-muted-foreground mt-1">
                {isUpdateMode
                  ? "Perbarui detail penting tentang ruangan Anda. Nama yang deskriptif dan lokasi yang akurat membantu pengguna menemukan ruangan yang tepat."
                  : "Mulai dengan memberikan detail penting tentang ruangan Anda. Nama yang deskriptif dan lokasi yang akurat membantu pengguna menemukan ruangan yang sesuai dengan kebutuhan mereka."}
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
                        Nama Ruangan
                      </FormLabel>
                      <FormDescription>
                        Pilih nama yang jelas dan mudah diingat untuk
                        identifikasi
                      </FormDescription>
                      <FormControl>
                        <Input
                          placeholder="Ruang Konferensi A"
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
                        Lokasi
                      </FormLabel>
                      <FormDescription>
                        Tentukan gedung, lantai, atau area dimana ruangan berada
                      </FormDescription>
                      <FormControl>
                        <Input
                          placeholder="Lantai 2, Gedung A"
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
                          Kapasitas
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
                              Ini adalah jumlah maksimum orang yang dapat
                              ditampung ruangan dengan nyaman.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <FormDescription>
                        Berapa banyak orang yang dapat ditampung ruangan?
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
                        Fasilitas
                      </FormLabel>
                      <FormDescription>
                        Pilih fasilitas yang tersedia di ruangan ini
                      </FormDescription>
                      <FormControl>
                        <MultiSelect
                          animation={1}
                          options={facilityOptions}
                          onValueChange={field.onChange}
                          value={field.value}
                          placeholder="Pilih fasilitas"
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
                Ceritakan Lebih Lanjut
              </h2>
              <p className="text-muted-foreground mt-1">
                Bantu pengguna memahami apa yang membuat ruangan ini istimewa
                dengan deskripsi yang detail.
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
                      Deskripsi Ruangan
                    </FormLabel>
                    <FormDescription>
                      Berikan detail tentang fitur ruangan, suasana, dan
                      penggunaan yang ideal
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Ruang konferensi yang luas dengan pencahayaan alami, sempurna untuk rapat tim dan presentasi..."
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
                {isUpdateMode ? "Kelola Gambar Ruangan" : "Pamerkan Ruangan"}
              </h2>
              <p className="text-muted-foreground mt-1">
                {isUpdateMode
                  ? "Perbarui atau tambahkan gambar berkualitas tinggi untuk menampilkan fitur terbaik ruangan Anda."
                  : "Sebuah gambar berbicara lebih dari seribu kata. Unggah gambar berkualitas tinggi untuk menampilkan fitur terbaik ruangan Anda."}
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border shadow-sm space-y-6">
              {/* Existing images section (only for update mode) */}
              {isUpdateMode && existingImages.length > 0 && (
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-green-500" />
                      <span>Gambar Saat Ini</span>
                      <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">
                        {existingImages.length}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Pilih gambar sebagai sampul atau hapus gambar yang tidak
                      perlu
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {existingImages.map((img, index) => (
                      <Card
                        key={`existing-${index}`}
                        className={`relative overflow-hidden group ring-offset-background transition-all hover:ring-2 hover:ring-ring hover:ring-offset-2 ${
                          img.isCover ? "ring-2 ring-primary ring-offset-2" : ""
                        }`}
                      >
                        <div className="aspect-[3/2] relative">
                          <Image
                            src={img.url}
                            alt={`Room image ${index + 1}`}
                            fill
                            className="object-cover rounded-md"
                          />
                          {img.isCover && (
                            <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              Sampul
                            </div>
                          )}
                        </div>
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="w-8 h-8 rounded-full"
                            onClick={() => handleRemoveExistingImage(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          {!img.isCover && (
                            <Button
                              type="button"
                              size="icon"
                              variant="secondary"
                              className="w-8 h-8 rounded-full"
                              onClick={() => setExistingCoverImage(index)}
                              title="Jadikan sampul"
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

              <div className="space-y-2">
                <FormLabel
                  htmlFor="images"
                  className="flex items-center gap-2 text-base"
                >
                  <Upload className="h-4 w-4" />
                  {isUpdateMode ? "Tambah Gambar Lagi" : "Gambar Ruangan"}
                  {!isUpdateMode && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </FormLabel>
                <FormDescription>
                  {isUpdateMode
                    ? "Unggah foto tambahan untuk menampilkan ruangan Anda"
                    : "Unggah foto yang jelas dan terang yang menunjukkan berbagai sudut ruangan"}
                </FormDescription>
                <div className="flex items-center gap-2 mt-3">
                  <label
                    htmlFor="images"
                    className={`flex flex-col items-center justify-center w-full h-40
                        border-2 border-dashed rounded-md cursor-pointer 
                        transition-all duration-200 ease-in-out
                        ${isUploading ? "opacity-50 cursor-wait" : ""}
                        ${
                          !isUpdateMode &&
                          !hasSuccessfulUploads() &&
                          !isUploading &&
                          existingImages.length === 0
                            ? "border-destructive/50 hover:border-destructive bg-destructive/5 hover:bg-destructive/10"
                            : "border-primary/20 hover:border-primary/30 bg-primary/5 hover:bg-primary/10"
                        }`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {isUploading ? (
                        <>
                          <Loader2 className="w-10 h-10 text-primary/70 animate-spin" />
                          <p className="mt-3 text-sm font-medium text-muted-foreground">
                            Mengunggah gambar Anda...
                          </p>
                          <p className="text-xs text-muted-foreground/70 mt-1">
                            Ini mungkin memerlukan waktu sebentar
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload
                            className={`w-10 h-10 ${!isUpdateMode && !hasSuccessfulUploads() && existingImages.length === 0 ? "text-destructive/70" : "text-primary/70"}`}
                          />
                          <p
                            className={`mt-3 text-sm font-medium ${!isUpdateMode && !hasSuccessfulUploads() && existingImages.length === 0 ? "text-destructive/70" : "text-muted-foreground"}`}
                          >
                            Klik untuk mengunggah foto
                          </p>
                          <p className="text-xs text-muted-foreground/70 mt-1">
                            PNG, JPG, WEBP hingga 10MB
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
                      <span>Foto Baru yang Diunggah</span>
                      <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">
                        {images.length}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Gambar pertama atau gambar yang dipilih akan digunakan
                      sebagai sampul
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
                              Sampul
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
                              Unggah gagal
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
                              title="Jadikan sampul"
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
                variant={
                  !isUpdateMode &&
                  !hasSuccessfulUploads() &&
                  existingImages.length === 0
                    ? "destructive"
                    : "default"
                }
                className="mt-4"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="font-medium">
                  {!isUpdateMode &&
                  !hasSuccessfulUploads() &&
                  existingImages.length === 0
                    ? "Foto Diperlukan"
                    : "Tips Unggah"}
                </AlertTitle>
                <AlertDescription className="text-sm mt-1">
                  {!isUpdateMode &&
                  !hasSuccessfulUploads() &&
                  existingImages.length === 0
                    ? "Silakan unggah setidaknya satu foto untuk menampilkan ruangan. Ini membantu pengguna membuat keputusan yang tepat."
                    : isUpdateMode
                      ? "Anda dapat menambahkan gambar baru atau menghapus yang sudah ada. Setidaknya satu gambar harus tetap ada untuk ruangan."
                      : "Foto diunggah langsung. Anda dapat mengatur ulang dengan menetapkan gambar sampul yang berbeda. Foto yang jelas dan terang membantu ruangan Anda menonjol!"}
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Kesalahan</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="border-t pt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <p>
                Semua field yang ditandai{" "}
                <span className="text-destructive">*</span> wajib diisi
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  isUpdateMode && room?.slug
                    ? router.push(`/admin/rooms/${room.slug}`)
                    : router.push("/admin/rooms")
                }
                className="min-w-[100px]"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isPending || isUploading}
                className="min-w-[150px]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isUpdateMode ? "Memperbarui..." : "Membuat..."}
                  </>
                ) : isUpdateMode ? (
                  "Perbarui Ruangan"
                ) : (
                  "Buat Ruangan"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </TooltipProvider>
  );
}
