import { randomBytes } from "crypto";
import { NextRequest } from "next/server";
import {
  attachCookies,
  getAdminClient,
  getUserClient,
} from "@/app/utils/supabase/client";

export async function POST(request: NextRequest) {
  const client = getUserClient(request);
  const adminClient = getAdminClient();

  const userId = (await client.auth.getUser()).data?.user?.id;
  if (!userId) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const formData = await request.formData();
  const image = formData.get("image") as File | null;
  if (!image) {
    return Response.json({ error: "Image is required" }, { status: 400 });
  }
  const extension = image.name.split(".").pop();
  const fileName = `${randomBytes(20).toString("base64url")}.${extension}`;
  console.log(`fileName: ${fileName}`);
  console.log(image);

  const { error: storageUploadError } = await adminClient.storage
    .from("photos")
    .upload(fileName, image);
  if (storageUploadError) {
    return Response.json(
      { message: "Failed to upload image file", error: storageUploadError },
      { status: 500 },
    );
  }

  const title = formData.get("title");
  if (title === null) {
    return Response.json(
      { error: "Title is required" },
      {
        status: 400,
      },
    );
  }
  const description = formData.get("description");
  if (description === null) {
    return Response.json(
      { error: "Description is required" },
      {
        status: 400,
      },
    );
  }
  const tags: string[] = JSON.parse(formData.get("tags")!.toString());
  const { data: photoData, error: databaseUploadError } = await client
    .from("photo")
    .insert([
      {
        authorid: userId,
        file: fileName,
        postdate: new Date(Date.now()).toISOString(),
        title: title.toString(),
        description: description.toString(),
      },
    ])
    .select();
  if (databaseUploadError) {
    return Response.json(
      { message: "Failed to upload photo", error: databaseUploadError },
      { status: 500 },
    );
  }

  for (const tag of tags) {
    const { error: databaseUploadError } = await client
      .from("phototag")
      .insert({
        photoid: photoData[0].id,
        tag,
      });
    if (databaseUploadError) {
      return Response.json(
        { message: "Failed to upload phototags", error: databaseUploadError },
        { status: 500 },
      );
    }
  }

  const response = new Response("", { status: 201 });
  return attachCookies(client, response);
}
