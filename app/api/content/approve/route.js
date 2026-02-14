import { updateReviewStatus } from "@/lib/server/adminRepository";

export async function POST(request) {
  const body = await request.json();
  if (!body?.id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }
  const item = await updateReviewStatus(body.id, "approved");
  if (!item) {
    return Response.json({ error: "Content item not found" }, { status: 404 });
  }
  return Response.json({ item });
}
