import { listTechnologiesSummary } from "@/lib/server/contentRepository";

export async function GET() {
  const technologies = await listTechnologiesSummary();
  return Response.json({ technologies });
}
