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
 * Deletes a file from the MinIO storage using the API endpoint
 *
 * @param fileUrl - The URL of the file to delete
 * @returns A promise that resolves to the response data
 */
export async function deleteFile(
  fileUrl: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const response = await fetch("/api/upload", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileUrl }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to delete file");
    }

    return data;
  } catch (error) {
    console.error("Error deleting file:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
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
      const formData = new FormData();
      formData.append("file", file);

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
        const pendingImages = newFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          isCover: images.length === 0,
          status: "pending" as const,
        }));

        setImages((prev) => [...prev, ...pendingImages]);

        for (let i = 0; i < newFiles.length; i++) {
          const file = newFiles[i];
          const index = images.length + i;

          setImages((prev) => {
            const updated = [...prev];
            updated[index] = {
              ...updated[index],
              status: "uploading",
            };
            return updated;
          });

          try {
            const uploadUrl = await uploadFileToMinIO(file);

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
      if (prev[index].isCover && prev.length > 1) {
        const newImages = [...prev];
        newImages.splice(index, 1);

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
