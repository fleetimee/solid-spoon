/**
 * Helper functions for handling image uploads in the room management system
 */

import { useState } from "react";

/**
 * Type definition for image state management
 */
export type ImageState = {
  file: File;
  preview: string;
  isCover: boolean;
  status: "pending" | "uploading" | "success" | "error";
  uploadUrl?: string;
  errorMessage?: string;
};

/**
 * Type for image validation result
 */
export interface ImageValidationResult {
  isValid: boolean;
  error: string | null;
}

/**
 * Hook for managing image uploads
 * @returns Image upload state and handler functions
 */
export function useImageUpload() {
  const [images, setImages] = useState<ImageState[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Uploads a single file to MinIO via server proxy
   * @param file File to upload
   * @returns Promise resolving to the uploaded file URL
   */
  const uploadFileToMinIO = async (file: File): Promise<string> => {
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("file", file);

      // Upload through our server proxy endpoint
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || "Failed to upload file");
      }

      const { fileUrl } = await response.json();
      return fileUrl;
    } catch (error) {
      console.error("Upload error:", error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Unknown upload error");
    }
  };

  /**
   * Handles file input change event and processes uploads
   * @param e Change event from file input
   */
  const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setIsUploading(true);

      try {
        // Create pending images
        const pendingImages = newFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          isCover: images.length === 0, // First image is cover by default
          status: "pending" as const,
        }));

        // Add pending images to state
        setImages((prev) => [...prev, ...pendingImages]);

        // Upload each image and update its state
        for (let i = 0; i < newFiles.length; i++) {
          const file = newFiles[i];
          const index = images.length + i;

          // Update status to uploading
          setImages((prev) => {
            const updated = [...prev];
            updated[index] = {
              ...updated[index],
              status: "uploading",
            };
            return updated;
          });

          try {
            // Upload the file and get the URL
            const uploadUrl = await uploadFileToMinIO(file);

            // Update state with success
            setImages((prev) => {
              const updated = [...prev];
              updated[index] = {
                ...updated[index],
                status: "success",
                uploadUrl,
              };
              return updated;
            });
          } catch (error) {
            // Update state with error
            setImages((prev) => {
              const updated = [...prev];
              updated[index] = {
                ...updated[index],
                status: "error",
                errorMessage:
                  error instanceof Error ? error.message : "Upload failed",
              };
              return updated;
            });
          }
        }
      } finally {
        setIsUploading(false);
      }
    }
  };

  /**
   * Removes an image from the state
   * @param index Index of image to remove
   */
  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      // If removing the cover image, set the first remaining image as cover
      if (prev[index].isCover && prev.length > 1) {
        const newImages = [...prev];
        newImages.splice(index, 1);

        // Find the first non-cover image or the first image if none has cover status
        const newCoverIndex = newImages.findIndex((img) => !img.isCover) || 0;
        newImages[newCoverIndex].isCover = true;

        return newImages;
      }

      return prev.filter((_, i) => i !== index);
    });
  };

  /**
   * Sets an image as the cover image
   * @param index Index of image to set as cover
   */
  const setCoverImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isCover: i === index,
      }))
    );
  };

  /**
   * Validates images before form submission
   * @returns Object with validation result and error message
   */
  const validateImages = (): ImageValidationResult => {
    // Check if there are any successful uploads
    const successfulUploads = images.filter((img) => img.status === "success");

    if (successfulUploads.length === 0) {
      return {
        isValid: false,
        error: "At least one image must be uploaded for the room",
      };
    }

    const hasErrorImages = images.some((img) => img.status === "error");
    const hasUploadingImages = images.some(
      (img) => img.status === "uploading" || img.status === "pending"
    );

    if (hasErrorImages) {
      return {
        isValid: false,
        error: "Please remove or re-upload failed images before submitting",
      };
    }

    if (hasUploadingImages) {
      return {
        isValid: false,
        error: "Please wait for all images to finish uploading",
      };
    }

    return { isValid: true, error: null };
  };

  /**
   * Returns whether any successful uploads exist
   */
  const hasSuccessfulUploads = (): boolean => {
    return images.some((img) => img.status === "success");
  };

  /**
   * Prepares image data for form submission
   * @param formData FormData object to append image data to
   */
  const prepareImagesForSubmission = (formData: FormData) => {
    // Append image URLs instead of files
    images.forEach((img, index) => {
      if (img.status === "success" && img.uploadUrl) {
        formData.append("imageUrls", img.uploadUrl);
        if (img.isCover) {
          formData.append(`cover_${index}`, "true");
        }
      }
    });
  };

  return {
    images,
    isUploading,
    handleImagesChange,
    handleRemoveImage,
    setCoverImage,
    validateImages,
    hasSuccessfulUploads,
    prepareImagesForSubmission,
  };
}
