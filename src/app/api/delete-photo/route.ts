import { getUserClient } from "@/app/utils/supabase/client";
import { NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
  const client = getUserClient(request);

  const userId = (await client.auth.getUser()).data?.user?.id;
  if (!userId) {
    return Response.json("", { status: 401 });
  }

  const requestBody = await request.json();
  const { photoId } = requestBody;
  if (!photoId) {
    return Response.json({ error: "Photo ID is required" }, { status: 400 });
  }

  const { error: deleteError, data: deleteData } = await client
    .from("photo")
    .delete()
    .eq("id", photoId)
    .limit(1)
    .select();
  if (deleteError) {
    console.error("Error deleting photo:", deleteError);
    if (deleteError.code === "403") {
      return Response.json(
        { message: "Operation not allowed", error: deleteError },
        { status: 403 },
      );
    }
    return Response.json({ error: deleteError.message }, { status: 500 });
  }
  if (deleteData.length === 0) {
    return Response.json({ error: "Could not delete photo" }, { status: 404 });
  }

  return Response.json(
    { message: "Photo deleted successfully" },
    { status: 200 },
  );
}
