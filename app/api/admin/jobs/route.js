import { listJobs } from "@/lib/server/adminRepository";

export async function GET() {
  const jobs = await listJobs();
  return Response.json({ jobs });
}
