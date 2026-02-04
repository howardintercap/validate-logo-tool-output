import { dequeueResult } from "@/app/lib/last-result";

export async function GET() {
  return Response.json(dequeueResult());
}
