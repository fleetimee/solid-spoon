"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Form } from "@/components/ui/form";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AlertCircle } from "lucide-react";
import { Room } from "../types/room";
import { useRoomForm } from "../hooks/use-room-form";
import { BasicInfoSection } from "./form-sections/basic-info-section";
import { DescriptionSection } from "./form-sections/description-section";
import { ImagesSection } from "./form-sections/images-section";
import { FormActionsSection } from "./form-sections/form-actions-section";

interface AddRoomFormSectionsProps {
  room?: Room;
  mode?: "create" | "update";
}

export function AddRoomFormSections({
  room,
  mode = "create",
}: AddRoomFormSectionsProps) {
  const {
    form,
    onSubmit,
    isPending,
    isUploading,
    errorMessage,
    isUpdateMode,
    images,
    existingImages,
    handleImagesChange,
    handleRemoveImage,
    handleRemoveExistingImage,
    setCoverImage,
    setExistingCoverImage,
    hasSuccessfulUploads,
    router,
  } = useRoomForm({ room, mode });

  const handleCancel = () => {
    if (isUpdateMode && room?.slug) {
      router.push(`/admin/rooms/${room.slug}`);
    } else {
      router.push("/admin/rooms");
    }
  };

  return (
    <TooltipProvider>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <BasicInfoSection form={form} isUpdateMode={isUpdateMode} />

          <DescriptionSection form={form} />

          <ImagesSection
            isUpdateMode={isUpdateMode}
            isUploading={isUploading}
            images={images}
            existingImages={existingImages}
            handleImagesChange={handleImagesChange}
            handleRemoveImage={handleRemoveImage}
            handleRemoveExistingImage={handleRemoveExistingImage}
            setCoverImage={setCoverImage}
            setExistingCoverImage={setExistingCoverImage}
            hasSuccessfulUploads={hasSuccessfulUploads}
          />

          {/* Error message */}
          {errorMessage && (
            <Alert variant="destructive" className="border-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Kesalahan</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <FormActionsSection
            isPending={isPending}
            isUploading={isUploading}
            isUpdateMode={isUpdateMode}
            room={room}
            onCancel={handleCancel}
          />
        </form>
      </Form>
    </TooltipProvider>
  );
}
