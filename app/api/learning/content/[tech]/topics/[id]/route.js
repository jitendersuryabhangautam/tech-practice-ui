import { getTopicById } from "@/lib/server/contentRepository";

export async function GET(_request, { params }) {
  const topic = await getTopicById(params.tech, params.id);
  if (!topic) {
    return Response.json({ error: "Topic not found" }, { status: 404 });
  }
  return Response.json({ topic });
}
