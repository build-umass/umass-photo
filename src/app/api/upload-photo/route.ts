import { randomBytes } from 'crypto';
import dotenv from "dotenv";
import { NextRequest } from "next/server";
import { attachCookies, getUserClient } from "@/app/utils/supabase/client";

dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: NextRequest) {
  const client = getUserClient(request);

  const userId = (await client.auth.getUser()).data?.user?.id
  if (!userId) {
    throw new Error("userId could not be found")
  }

  const formData = await request.formData();
  const image = formData.get("image") as (File | null)
  if (!image) {
    throw new Error("File missing")
  }
  const extension = image.name.split(".").pop()
  const fileName = `${randomBytes(20).toString('base64url')}.${extension}`;
  console.log(`fileName: ${fileName}`);
  console.log(image);

  const { data: _storageUploadData, error: storageUploadError } = await client.storage.from("photos").upload(fileName, image);
  if (storageUploadError) {
    throw storageUploadError
  }

  console.log("success");

  await client.from("photo").insert({ authorid: userId, file: fileName, postdate: new Date(Date.now()).toISOString() })

  const response = new Response("", { status: 201 });
  return attachCookies(client, response);
}
