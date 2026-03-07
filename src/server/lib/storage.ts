import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY!,
  },
});

const BUCKET = process.env.CLOUDFLARE_R2_BUCKET!;

const ALLOWED_TYPES: Record<string, string[]> = {
  image: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  video: ["video/mp4", "video/webm", "video/quicktime"],
  document: ["application/pdf"],
};

const MAX_SIZES: Record<string, number> = {
  image: 10 * 1024 * 1024, // 10MB
  video: 100 * 1024 * 1024, // 100MB
  document: 5 * 1024 * 1024, // 5MB
};

export type UploadCategory = "avatar" | "post" | "tournament" | "creator" | "chat" | "verification";

function getKeyPrefix(category: UploadCategory, userId: string): string {
  const date = new Date().toISOString().slice(0, 7); // YYYY-MM
  return `${category}/${date}/${userId}`;
}

export async function generatePresignedUploadUrl(params: {
  userId: string;
  category: UploadCategory;
  fileName: string;
  contentType: string;
  fileSize: number;
}): Promise<{ uploadUrl: string; fileKey: string; publicUrl: string }> {
  const { userId, category, fileName, contentType, fileSize } = params;

  // Validate content type
  const fileCategory = Object.entries(ALLOWED_TYPES).find(([, types]) => types.includes(contentType));
  if (!fileCategory) {
    throw new Error(`Tipo de arquivo não permitido: ${contentType}`);
  }

  // Validate size
  const maxSize = MAX_SIZES[fileCategory[0]]!;
  if (fileSize > maxSize) {
    throw new Error(`Arquivo muito grande. Máximo: ${(maxSize / 1024 / 1024).toFixed(0)}MB`);
  }

  // Generate unique key
  const ext = fileName.split(".").pop() || "bin";
  const uniqueId = crypto.randomUUID().slice(0, 8);
  const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_").slice(0, 50);
  const fileKey = `${getKeyPrefix(category, userId)}/${uniqueId}-${safeFileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: fileKey,
    ContentType: contentType,
    ContentLength: fileSize,
    Metadata: {
      userId,
      category,
      originalName: fileName,
    },
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

  // Public URL (assumes R2 public access or custom domain)
  const publicUrl = `${process.env.NEXT_PUBLIC_CDN_URL ?? process.env.CLOUDFLARE_R2_ENDPOINT}/${fileKey}`;

  return { uploadUrl, fileKey, publicUrl };
}

export async function deleteFile(fileKey: string): Promise<void> {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: fileKey }));
}

export async function getPresignedDownloadUrl(fileKey: string): Promise<string> {
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: fileKey });
  return getSignedUrl(s3, command, { expiresIn: 3600 });
}
