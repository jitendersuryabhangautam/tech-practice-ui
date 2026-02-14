async function readJson(response) {
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error || "Request failed");
  }
  return payload;
}

export async function fetchReviewItems(status = "all") {
  const res = await fetch(`/api/content/list?status=${status}`, {
    cache: "no-store",
  });
  const json = await readJson(res);
  return json.items || [];
}

export async function fetchReviewItem(id) {
  const res = await fetch(`/api/content/${id}`, { cache: "no-store" });
  const json = await readJson(res);
  return json.item;
}

export async function approveReviewItem(id) {
  const res = await fetch("/api/content/approve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  const json = await readJson(res);
  return json.item;
}

export async function rejectReviewItem(id) {
  const res = await fetch("/api/content/reject", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  const json = await readJson(res);
  return json.item;
}

export async function fetchPublishData() {
  const res = await fetch("/api/content/publish", { cache: "no-store" });
  return readJson(res);
}

export async function publishItem(id) {
  const res = await fetch("/api/content/publish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  const json = await readJson(res);
  return json.event;
}

export async function rollbackPublishEvent(eventId) {
  const res = await fetch("/api/content/rollback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventId }),
  });
  const json = await readJson(res);
  return json.event;
}

export async function fetchJobs() {
  const res = await fetch("/api/admin/jobs", { cache: "no-store" });
  const json = await readJson(res);
  return json.jobs || [];
}

export async function fetchAuditFeed() {
  const res = await fetch("/api/admin/audit", { cache: "no-store" });
  const json = await readJson(res);
  return json.audit || [];
}

export async function fetchAdminSettings() {
  const res = await fetch("/api/admin/settings", { cache: "no-store" });
  const json = await readJson(res);
  return json.settings;
}

export async function saveAdminSettings(settings) {
  const res = await fetch("/api/admin/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
  const json = await readJson(res);
  return json.settings;
}
