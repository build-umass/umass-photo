"use server";

import { getAdminClient } from "@/app/utils/supabase/server";
import { randomUUID } from "crypto";

/**
 * Upload an image from the given source URL to Supabase Storage and return the public URL.
 */
export async function transformImage(src: string): Promise<string> {
  "use server";
  const adminClient = await getAdminClient();

  // Upload the image to Supabase Storage
  const response = await fetch(src);
  const blob = await response.blob();

  if (!blob.type.startsWith("image/"))
    throw new Error("Pasted file is not an image");

  const fileExtension = blob.type.split("/")[1];

  const fileName = `${randomUUID()}.${fileExtension}`;

  const { data, error: uploadError } = await adminClient.storage
    .from("photos")
    .upload(fileName, blob);
  if (uploadError) {
    throw uploadError;
  }

  return adminClient.storage.from("photos").getPublicUrl(data.path).data
    .publicUrl;
}
