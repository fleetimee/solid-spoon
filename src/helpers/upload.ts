import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { nanoid } from "nanoid";

const rootFolder = "uploads";
const subFolder = "images";

const s3Client = new S3Client({
  region: process.env.MINIO_REGION || "us-east-1",
  endpoint: process.env.MINIO_ENDPOINT || "https://minio.fleetime.my.id",
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.MINIO_SECRET_KEY!,
  },
  forcePathStyle: true,
});

/**
 * Uploads a file to MinIO with a unique filename.
 *
 * @param file - The file to be uploaded as a Buffer.
 * @param fileName - The original file name (to retain the file extension).
 * @param contentType - The MIME type of the file.
 * @returns The public URL of the uploaded file.
 */
export async function uploadFileToS3(
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const fileExtension = fileName.substring(fileName.lastIndexOf("."));

  const uniqueFileName = `${nanoid()}${fileExtension}`;

  const filePath = `${rootFolder}/${subFolder}/${uniqueFileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.MINIO_BUCKET_NAME,
    Key: filePath,
    Body: file,
    ContentType: contentType,
  });

  await s3Client.send(command);

  return `${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET_NAME}/${filePath}`;
}

/**
 * Extracts the S3 object key from the given URL.
 *
 * @param url - The full URL of the S3 object.
 * @returns The exact object key used in the S3 bucket.
 */
export function extractKeyFromUrl(url: string): string {
  const bucketUrl = `${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET_NAME}/`;

  if (url.startsWith(bucketUrl)) {
    return url.replace(bucketUrl, "");
  }

  console.warn("URL does not match bucket pattern:", url);
  return url;
}

/**
 * Deletes a file from MinIO.
 *
 * @param key - The key of the file to be deleted.
 */
export async function deleteFileFromS3(key: string): Promise<void> {
  console.log("Deleting MinIO file with key:", key);

  const command = new DeleteObjectCommand({
    Bucket: process.env.MINIO_BUCKET_NAME,
    Key: key,
  });

  try {
    await s3Client.send(command);
    console.log("File deleted successfully:", key);
  } catch (error) {
    console.error("Failed to delete file from MinIO:", error);
    throw error;
  }
}

/**
 * Generates a signed URL for uploading a file to MinIO.
 *
 * @param fileName - The name to save the file as in MinIO.
 * @param contentType - The MIME type of the file.
 * @param expiresIn - (Optional) The number of seconds before the URL expires. Defaults to 3600 (1 hour).
 * @returns A signed URL that can be used for uploading the file.
 */
export async function getSignedUploadUrl(
  fileName: string,
  contentType: string,
  expiresIn: number = 3600
): Promise<string> {
  const fileExtension = fileName.substring(fileName.lastIndexOf("."));

  const uniqueFileName = `${nanoid()}${fileExtension}`;

  const filePath = `${rootFolder}/${subFolder}/${uniqueFileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.MINIO_BUCKET_NAME,
    Key: filePath,
    ContentType: contentType,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
  return signedUrl;
}

export async function getUnsignedUploadUrl(fileName: string): Promise<string> {
  const fileExtension = fileName.substring(fileName.lastIndexOf("."));

  const uniqueFileName = `${nanoid()}${fileExtension}`;

  const filePath = `${rootFolder}/${subFolder}/${uniqueFileName}`;

  return `${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET_NAME}/${filePath}`;
}
