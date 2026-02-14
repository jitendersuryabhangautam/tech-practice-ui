import { getReviewItem } from "@/lib/server/adminRepository";

export async function GET(_request, { params }) {
  const item = await getReviewItem(params.id);
  if (!item) {
    return Response.json({ error: "Content item not found" }, { status: 404 });
  }
  return Response.json({ item });
}
