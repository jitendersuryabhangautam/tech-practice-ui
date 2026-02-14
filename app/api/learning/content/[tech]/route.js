import { getTechnologyContent } from "@/lib/server/contentRepository";

export async function GET(_request, { params }) {
  const payload = await getTechnologyContent(params.tech);
  if (!payload) {
    return Response.json({ error: "Technology not found" }, { status: 404 });
  }
  return Response.json(payload);
}
