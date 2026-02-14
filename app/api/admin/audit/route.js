import { listAuditFeed } from "@/lib/server/adminRepository";

export async function GET() {
  const audit = await listAuditFeed();
  return Response.json({ audit });
}
