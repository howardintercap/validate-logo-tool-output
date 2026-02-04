import { NextRequest } from "next/server";
import { dequeueResult } from "@/app/lib/last-result";

export async function GET(req: NextRequest) {
  const traceId = req.nextUrl.searchParams.get("traceId") ?? "";
  return Response.json(dequeueResult(traceId));
}
