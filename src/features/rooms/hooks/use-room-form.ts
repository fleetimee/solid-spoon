import { useState, useEffect } from "react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRoomAction } from "../api/createRoom";
import { updateRoomAction } from "../api/updateRoom";
import {
  useImageUpload,
  type ExistingImageState,
} from "../helpers/image-upload";
import { formSchema, type FormValues } from "../schemas/room-form-schema";
import {
  parseFacilities,
  prepareFormDataForSubmission,
} from "../utils/room-form-utils";
import { Room } from "../types/room";

interface UseRoomFormProps {
  room?: Room;
  mode?: "create" | "update";
}

export function useRoomForm({ room, mode = "create" }: UseRoomFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isUpdateMode = mode === "update";

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
        error: "At least one image is required for the room",
      };
    } else {
      imageValidation = validateImages();
    }

    if (!imageValidation.isValid) {
      setErrorMessage(imageValidation.error || "Image validation failed");
      return;
    }

    startTransition(async () => {
      const formData = prepareFormDataForSubmission(values);

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
          toast.success("Room updated successfully", {
            description: `${values.name} has been updated.`,
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
          toast.success("Room created successfully", {
            description: `${values.name} has been created.`,
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

  return {
    form,
    onSubmit,
    isPending,
    isUploading,
    errorMessage,
    isUpdateMode,
    // Image handling
    images,
    existingImages,
    handleImagesChange,
    handleRemoveImage,
    handleRemoveExistingImage,
    setCoverImage,
    setExistingCoverImage,
    hasSuccessfulUploads,
    // Navigation
    router,
    room,
  };
}
