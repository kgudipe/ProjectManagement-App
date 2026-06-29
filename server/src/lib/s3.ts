import { randomUUID } from "node:crypto";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { HttpError } from "./httpError.js";

const region = process.env.AWS_REGION ?? "us-east-1";
const bucket = process.env.S3_BUCKET_NAME;

// Credentials are resolved from the default AWS provider chain (EC2/ECS instance
// role in production, env vars or ~/.aws/credentials locally).
const s3 = new S3Client({ region });

const requireBucket = (): string => {
  if (!bucket) {
    throw new HttpError(503, "Attachment storage is not configured (S3_BUCKET_NAME missing)");
  }
  return bucket;
};

export const publicUrlFor = (key: string): string =>
  `https://${requireBucket()}.s3.${region}.amazonaws.com/${key}`;

/**
 * Creates a unique object key and a short-lived presigned PUT URL the browser can
 * upload to directly, plus the eventual public URL to persist on the attachment.
 */
export const createUploadUrl = async (params: {
  taskId: number;
  fileName: string;
  contentType: string;
}): Promise<{ uploadUrl: string; key: string; fileUrl: string }> => {
  const safeName = params.fileName.replace(/[^\w.\-]/g, "_");
  const key = `tasks/${params.taskId}/${randomUUID()}-${safeName}`;

  const command = new PutObjectCommand({
    Bucket: requireBucket(),
    Key: key,
    ContentType: params.contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
  return { uploadUrl, key, fileUrl: publicUrlFor(key) };
};

/** Best-effort delete of an object given its public URL. */
export const deleteObjectByUrl = async (fileUrl: string): Promise<void> => {
  if (!bucket) return;
  const prefix = `https://${bucket}.s3.${region}.amazonaws.com/`;
  if (!fileUrl.startsWith(prefix)) return;
  const key = fileUrl.slice(prefix.length);
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
};
