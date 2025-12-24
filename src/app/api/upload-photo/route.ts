import { randomBytes } from 'crypto';
import dotenv from "dotenv";
import { NextRequest } from "next/server";
import { attachCookies, getUserClient } from "@/app/utils/supabase/client";

dotenv.config();

 
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

  const { error: storageUploadError } = await client.storage.from("photos").upload(fileName, image);
  if (storageUploadError) {
    throw storageUploadError
  }

  const title = formData.get("title")
  const description = formData.get("description")
  const tags: string[] = JSON.parse(formData.get("tags")!.toString())
  const { data: photoData, error: databaseUploadError } = await client.from("photo").insert({
    authorid: userId,
    file: fileName,
    postdate: new Date(Date.now()).toISOString(),
    title,
    description
  }).select()
  if (databaseUploadError) {
    throw databaseUploadError
  }

  for(const tag of tags){
    const { error: databaseUploadError } = await client.from("phototag").insert({
      photoid: photoData[0].id,
      tag,
    });
    if (databaseUploadError) {
      throw databaseUploadError
    }
  }

  const response = new Response("", { status: 201 });
  return attachCookies(client, response);
}
