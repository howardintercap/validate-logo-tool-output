import { NextRequest } from "next/server";
import { enqueueResult } from "@/app/lib/last-result";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const traceId = typeof body?.trace_id === "string" ? body.trace_id : "";
  enqueueResult(traceId, body);
  return new Response("Webhook received");
}
