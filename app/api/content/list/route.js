import { listReviewItems } from "@/lib/server/adminRepository";

export async function GET(request) {
  const status = request.nextUrl.searchParams.get("status") || "all";
  const items = await listReviewItems(status);
  return Response.json({ items });
}
