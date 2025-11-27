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

  const body = await request.json();
  const { title, description, startTime, endTime, imageDataURL } = body;

  if (!imageDataURL) {
    throw new Error("Image data missing")
  }

  // Convert data URL to File
  const base64Data = imageDataURL.split(',')[1];
  const binaryString = Buffer.from(base64Data, 'base64').toString('binary');
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  const extension = imageDataURL.split(';')[0].split('/')[1] || 'png';
  const fileName = `${randomBytes(20).toString('base64url')}.${extension}`;
  const imageFile = new File([bytes], fileName, { type: `image/${extension}` });

  const { error: storageUploadError } = await client.storage.from("photos").upload(fileName, imageFile);
  if (storageUploadError) {
    throw storageUploadError
  }

  const tag = title;
  
  const { error: tagUploadError } = await client.from("tag").insert({
    name: tag
  })
  if (tagUploadError) {
    throw tagUploadError
  }
  

  const { error: databaseUploadError } = await client.from("event").insert({
    name: title,
    herofile: fileName,
    startdate: new Date(startTime).toISOString(),
    enddate: new Date(endTime).toISOString(),
    description,
    tag
  }).select()
  if (databaseUploadError) {
    throw databaseUploadError
  }

  const response = new Response("", { status: 201 });
  return attachCookies(client, response);
}
