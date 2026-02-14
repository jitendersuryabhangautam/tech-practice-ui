import {
  listPublishData,
  publishContent,
} from "@/lib/server/adminRepository";

export async function GET() {
  const { queue, history } = await listPublishData();
  return Response.json({ queue, history });
}

export async function POST(request) {
  const body = await request.json();
  if (!body?.id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  const event = await publishContent(body.id);
  if (!event) {
    return Response.json({ error: "Publish target not found" }, { status: 404 });
  }
  return Response.json({ event });
}
