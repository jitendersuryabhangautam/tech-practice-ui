import { rollbackPublish } from "@/lib/server/adminRepository";

export async function POST(request) {
  const body = await request.json();
  if (!body?.eventId) {
    return Response.json({ error: "Missing eventId" }, { status: 400 });
  }
  const event = await rollbackPublish(body.eventId);
  if (!event) {
    return Response.json({ error: "Publish event not found" }, { status: 404 });
  }
  return Response.json({ event });
}
