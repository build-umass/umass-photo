import { getRandomImageUrls } from "@/app/lib/image";

export async function GET(request: Request) {
  const queryLimit = Number.parseInt(request.headers.get("limit") ?? "10");
  return new Response(JSON.stringify(await getRandomImageUrls(queryLimit)));
}
