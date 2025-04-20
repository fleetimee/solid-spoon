import { NextRequest, NextResponse } from "next/server";
import {
  uploadFileToS3,
  extractKeyFromUrl,
  deleteFileFromS3,
} from "@/helpers/upload";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import sharp from "sharp";

const COMPRESSION_QUALITY = 80;
const MAX_FILE_SIZE = 2 * 1024 * 1024;

async function compressImage(buffer: Buffer): Promise<Buffer> {
  return await sharp(buffer).webp({ quality: COMPRESSION_QUALITY }).toBuffer();
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid file type. Only images allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 2MB limit." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const originalBuffer = Buffer.from(bytes);

    const uploadBuffer = await compressImage(originalBuffer);

    const originalFileName = file.name.split(".")[0];
    const newFileName = `${originalFileName}.webp`;

    const webpMimeType = "image/webp";

    const fileUrl = await uploadFileToS3(
      uploadBuffer,
      newFileName,
      webpMimeType
    );

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
