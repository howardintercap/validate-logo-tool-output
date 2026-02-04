import { NextRequest } from "next/server";
import { enqueueResult } from "@/app/lib/last-result";

export async function POST(req: NextRequest) {
  const body = await req.json();
  enqueueResult(body);
  return new Response("Webhook received");
}
