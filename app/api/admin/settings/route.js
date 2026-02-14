import { getSettings, updateSettings } from "@/lib/server/adminRepository";

export async function GET() {
  const settings = await getSettings();
  return Response.json({ settings });
}

export async function POST(request) {
  const body = await request.json();
  const settings = await updateSettings(body || {});
  return Response.json({ settings });
}
