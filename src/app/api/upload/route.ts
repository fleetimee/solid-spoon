import { NextRequest, NextResponse } from "next/server";
import {
  uploadFileToS3,
  extractKeyFromUrl,
  deleteFileFromS3,
} from "@/helpers/upload";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import sharp from "sharp";

// Image compression options
const COMPRESSION_QUALITY = 80; // 0-100, higher means better quality but larger file size

/**
 * Compresses an image using Sharp based on its format
 */
async function compressImage(buffer: Buffer, format: string): Promise<Buffer> {
  const sharpInstance = sharp(buffer);

  switch (format.toLowerCase()) {
    case "image/png":
      return await sharpInstance
        .png({ quality: COMPRESSION_QUALITY, compressionLevel: 9 })
        .toBuffer();

    case "image/jpeg":
    case "image/jpg":
      return await sharpInstance
        .jpeg({ quality: COMPRESSION_QUALITY })
        .toBuffer();

    case "image/webp":
      return await sharpInstance
        .webp({ quality: COMPRESSION_QUALITY })
        .toBuffer();

    default:
      // For unsupported formats, return original buffer
      return buffer;
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const originalBuffer = Buffer.from(bytes);

    // Check if the file is an image that should be compressed
    const imageFormats = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

    let uploadBuffer: Buffer;
    if (imageFormats.includes(file.type)) {
      // Compress the image
      uploadBuffer = await compressImage(originalBuffer, file.type);
    } else {
      uploadBuffer = originalBuffer;
    }

    const fileUrl = await uploadFileToS3(uploadBuffer, file.name, file.type);

    return NextResponse.json({ fileUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileUrl } = await request.json();

    if (!fileUrl) {
      return NextResponse.json(
        { error: "No file URL provided" },
        { status: 400 }
      );
    }

    const fileKey = extractKeyFromUrl(fileUrl);

    await deleteFileFromS3(fileKey);

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
