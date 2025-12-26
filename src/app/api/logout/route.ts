import { NextRequest } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: NextRequest) {
  return new Response("", {
    status: 200,
    headers: [
      [
        "Set-Cookie",
        "access-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=strict; HttpOnly; Secure; Path=/api",
      ],
      [
        "Set-Cookie",
        "refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=strict; HttpOnly; Secure; Path=/api/refresh",
      ],
    ],
  });
}
