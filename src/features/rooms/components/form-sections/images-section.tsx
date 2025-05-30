import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  X,
  Loader2,
  Upload,
  AlertCircle,
  Star,
  Camera,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import { type ExistingImageState } from "../../helpers/image-upload";

interface ImagesSectionProps {
  isUpdateMode: boolean;
  isUploading: boolean;
  images: any[];
  existingImages: ExistingImageState[];
  handleImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  handleRemoveExistingImage: (index: number) => void;
  setCoverImage: (index: number) => void;
  setExistingCoverImage: (index: number) => void;
  hasSuccessfulUploads: () => boolean;
}

export function ImagesSection({
  isUpdateMode,
  isUploading,
  images,
  existingImages,
  handleImagesChange,
  handleRemoveImage,
  handleRemoveExistingImage,
  setCoverImage,
  setExistingCoverImage,
  hasSuccessfulUploads,
}: ImagesSectionProps) {
  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-card via-card to-muted/20">
      <CardHeader className="space-y-3 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-md flex-shrink-0">
            <Camera className="h-5 w-5 text-white flex-shrink-0" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              🖼️ {isUpdateMode ? "Manage Images" : "Visual Showcase"}
            </CardTitle>
            <CardDescription className="text-base">
              {isUpdateMode
                ? "Update or add new high-quality images to showcase your room&apos;s best features"
                : "A picture is worth a thousand words. Upload high-quality images to showcase your room&apos;s best features"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Existing images section (only for update mode) */}
        {isUpdateMode && existingImages.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium">Current Images</span>
                <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                  {existingImages.length}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Select an image as cover or remove unnecessary images
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
                        Cover
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

        {/* Upload Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4 text-violet-500" />
            <span className="text-base font-semibold">
              {isUpdateMode ? "Add More Images" : "Room Images"}
              {!isUpdateMode && (
                <span className="text-destructive ml-1">*</span>
              )}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {isUpdateMode
              ? "Upload additional photos to showcase your room"
              : "Upload clear, well-lit photos showing different angles of the room"}
          </p>

          <div className="flex items-center gap-2">
            <label
              htmlFor="images"
              className={`flex flex-col items-center justify-center w-full h-48
                  border-2 border-dashed rounded-xl cursor-pointer 
                  transition-all duration-200 ease-in-out
                  ${isUploading ? "opacity-50 cursor-wait" : ""}
                  ${
                    !isUpdateMode &&
                    !hasSuccessfulUploads() &&
                    !isUploading &&
                    existingImages.length === 0
                      ? "border-destructive/50 hover:border-destructive bg-destructive/5 hover:bg-destructive/10"
                      : "border-violet-500/30 hover:border-violet-500/50 bg-violet-50/50 hover:bg-violet-50/80 dark:bg-violet-950/20 dark:hover:bg-violet-950/30"
                  }`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {isUploading ? (
                  <>
                    <Loader2 className="w-12 h-12 text-violet-500 animate-spin" />
                    <p className="mt-3 text-base font-medium text-muted-foreground">
                      Uploading your images...
                    </p>
                    <p className="text-sm text-muted-foreground/70 mt-1">
                      This might take a moment
                    </p>
                  </>
                ) : (
                  <>
                    <Upload
                      className={`w-12 h-12 ${!isUpdateMode && !hasSuccessfulUploads() && existingImages.length === 0 ? "text-destructive/70" : "text-violet-500"}`}
                    />
                    <p
                      className={`mt-3 text-base font-medium ${!isUpdateMode && !hasSuccessfulUploads() && existingImages.length === 0 ? "text-destructive/70" : "text-muted-foreground"}`}
                    >
                      Click to upload photos
                    </p>
                    <p className="text-sm text-muted-foreground/70 mt-1">
                      PNG, JPG, WEBP up to 10MB each
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

        {/* New uploaded images grid */}
        {images.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium">New Uploaded Photos</span>
                <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                  {images.length}
                </span>
              </div>
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

        {/* Upload tips alert */}
        <Alert
          variant={
            !isUpdateMode &&
            !hasSuccessfulUploads() &&
            existingImages.length === 0
              ? "destructive"
              : "default"
          }
          className="border-2"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-medium">
            {!isUpdateMode &&
            !hasSuccessfulUploads() &&
            existingImages.length === 0
              ? "Photos Required"
              : "Upload Tips"}
          </AlertTitle>
          <AlertDescription className="text-sm mt-1">
            {!isUpdateMode &&
            !hasSuccessfulUploads() &&
            existingImages.length === 0
              ? "Please upload at least one photo to showcase the room. This helps users make informed decisions."
              : isUpdateMode
                ? "You can add new images or remove existing ones. At least one image must remain for the room."
                : "Photos are uploaded immediately. You can rearrange them by setting a different cover image. Clear, bright photos help your room stand out!"}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
