import { env } from "@/lib/env";

export function buildImageUrl(imageUrl?: string | null) {
  if (!imageUrl) {
    return null;
  }

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  return `${env.uploadsBaseUrl}${imageUrl}`;
}
