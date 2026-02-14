import { pgQuery } from "@/lib/server/postgres";

let seeded = false;

async function ensureAdminSeed() {
  if (seeded) return;
  const existing = await pgQuery("SELECT COUNT(*)::int AS count FROM admin_content_reviews");
  if (existing.rows[0]?.count > 0) {
    seeded = true;
    return;
  }

  await pgQuery(
    `INSERT INTO admin_content_reviews (content_ref, technology_slug, title, status, summary, generated_at, updated_at)
     VALUES
     ('cnt_async_patterns_01','javascript','Async Patterns','pending_review','Interview-first coverage of callback queues, promises, async/await pitfalls, and cancellation strategies.', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
     ('cnt_sd_consistent_hashing_01','system-design','Consistent Hashing','approved','Ring architecture, virtual nodes, rebalancing behavior, and production trade-offs for distributed systems.', NOW() - INTERVAL '2 day', NOW() - INTERVAL '2 day'),
     ('cnt_go_channels_02','golang','Go Channels','rejected','Covers buffered/unbuffered channels, select patterns, and deadlock scenarios with practical debugging notes.', NOW() - INTERVAL '3 day', NOW() - INTERVAL '3 day')
     ON CONFLICT (content_ref) DO NOTHING`
  );

  await pgQuery(
    `INSERT INTO admin_publish_events (event_ref, content_ref, status, summary, created_at)
     VALUES
     ('pub_2026_02_13_01','cnt_sd_consistent_hashing_01','published','Published: Consistent Hashing', NOW() - INTERVAL '1 day'),
     ('pub_2026_02_12_03','cnt_async_patterns_01','rolled_back','Rollback: Async Patterns', NOW() - INTERVAL '2 day')
     ON CONFLICT (event_ref) DO NOTHING`
  );

  await pgQuery(
    `INSERT INTO admin_audit_logs (actor, action, entity_ref, metadata, created_at)
     VALUES
     ('admin@platform.dev','CONTENT_APPROVED','cnt_sd_consistent_hashing_01','{}'::jsonb, NOW() - INTERVAL '1 day'),
     ('admin@platform.dev','PUBLISH_TRIGGERED','pub_2026_02_13_01','{}'::jsonb, NOW() - INTERVAL '1 day')
     ON CONFLICT DO NOTHING`
  );

  await pgQuery(
    `INSERT INTO admin_jobs (job_ref, job_type, status, provider, progress, created_at)
     VALUES
     ('job_8801','GENERATE_TOPIC','running','gemini',62,NOW() - INTERVAL '2 hour'),
     ('job_8799','GENERATE_QUIZ','completed','gemini',100,NOW() - INTERVAL '3 hour'),
     ('job_8793','PUBLISH_CONTENT','failed','system',100,NOW() - INTERVAL '4 hour')
     ON CONFLICT (job_ref) DO NOTHING`
  );

  await pgQuery(
    `INSERT INTO admin_settings (id, ai_mode, primary_provider, fallback_provider, openai_enabled, chat_daily_limit, quiz_daily_limit, topic_daily_limit, updated_at)
     VALUES (1, 'free', 'gemini', 'groq', false, 200, 20, 5, NOW())
     ON CONFLICT (id) DO NOTHING`
  );

  seeded = true;
}

function mapReviewRow(row) {
  return {
    id: row.content_ref,
    technology: row.technology_slug,
    title: row.title,
    status: row.status,
    summary: row.summary,
    generatedAt: row.generated_at,
    category: "General",
    topicId: row.content_ref,
    interviewQuestions: 0,
    exercises: 0,
    programExercises: 0,
  };
}

export async function listReviewItems(status = "all") {
  await ensureAdminSeed();
  const params = [];
  let where = "";
  if (status !== "all") {
    where = "WHERE status = $1";
    params.push(status);
  }
  const { rows } = await pgQuery(
    `SELECT content_ref, technology_slug, title, status, summary, generated_at
     FROM admin_content_reviews
     ${where}
     ORDER BY generated_at DESC`,
    params
  );
  return rows.map(mapReviewRow);
}

export async function getReviewItem(id) {
  await ensureAdminSeed();
  const { rows } = await pgQuery(
    `SELECT content_ref, technology_slug, title, status, summary, generated_at
     FROM admin_content_reviews
     WHERE content_ref = $1
     LIMIT 1`,
    [id]
  );
  if (!rows[0]) return null;
  return mapReviewRow(rows[0]);
}

export async function updateReviewStatus(id, status) {
  await ensureAdminSeed();
  const { rows } = await pgQuery(
    `UPDATE admin_content_reviews
     SET status = $2, updated_at = NOW()
     WHERE content_ref = $1
     RETURNING content_ref, technology_slug, title, status, summary, generated_at`,
    [id, status]
  );
  if (!rows[0]) return null;

  await pgQuery(
    `INSERT INTO admin_audit_logs (actor, action, entity_ref, metadata)
     VALUES ($1, $2, $3, '{}'::jsonb)`,
    ["admin@platform.dev", `CONTENT_${status.toUpperCase()}`, id]
  );
  return mapReviewRow(rows[0]);
}

export async function listPublishData() {
  await ensureAdminSeed();
  const queueRows = await pgQuery(
    `SELECT content_ref, technology_slug, title, status, summary, generated_at
     FROM admin_content_reviews
     WHERE status = 'approved'
     ORDER BY generated_at DESC`
  );
  const historyRows = await pgQuery(
    `SELECT event_ref, content_ref, status, summary, created_at
     FROM admin_publish_events
     ORDER BY created_at DESC`
  );

  return {
    queue: queueRows.rows.map(mapReviewRow),
    history: historyRows.rows.map((row) => ({
      id: row.event_ref,
      type: "topic",
      title: row.summary?.replace(/^Published:\s*/, "") || row.content_ref,
      status: row.status,
      timestamp: row.created_at,
      rollbackRef: row.event_ref,
    })),
  };
}

export async function publishContent(id) {
  await ensureAdminSeed();
  const review = await updateReviewStatus(id, "published");
  if (!review) return null;
  const eventRef = `pub_${Date.now()}`;
  const summary = `Published: ${review.title}`;

  await pgQuery(
    `INSERT INTO admin_publish_events (event_ref, content_ref, status, summary, created_at)
     VALUES ($1, $2, 'published', $3, NOW())`,
    [eventRef, id, summary]
  );

  await pgQuery(
    `INSERT INTO admin_audit_logs (actor, action, entity_ref, metadata)
     VALUES ($1, 'PUBLISH_TRIGGERED', $2, '{}'::jsonb)`,
    ["admin@platform.dev", eventRef]
  );

  return {
    id: eventRef,
    type: "topic",
    title: review.title,
    status: "published",
    timestamp: new Date().toISOString(),
    rollbackRef: eventRef,
  };
}

export async function rollbackPublish(eventId) {
  await ensureAdminSeed();
  const { rows } = await pgQuery(
    `UPDATE admin_publish_events
     SET status = 'rolled_back'
     WHERE event_ref = $1
     RETURNING event_ref, summary, created_at, status`,
    [eventId]
  );
  if (!rows[0]) return null;

  await pgQuery(
    `INSERT INTO admin_audit_logs (actor, action, entity_ref, metadata)
     VALUES ($1, 'PUBLISH_ROLLBACK', $2, '{}'::jsonb)`,
    ["admin@platform.dev", eventId]
  );

  return {
    id: rows[0].event_ref,
    status: rows[0].status,
    title: rows[0].summary,
    timestamp: rows[0].created_at,
    rollbackRef: rows[0].event_ref,
  };
}

export async function listJobs() {
  await ensureAdminSeed();
  const { rows } = await pgQuery(
    `SELECT job_ref, job_type, status, provider, progress, created_at
     FROM admin_jobs
     ORDER BY created_at DESC`
  );
  return rows.map((row) => ({
    id: row.job_ref,
    type: row.job_type,
    status: row.status,
    provider: row.provider,
    progress: row.progress,
    createdAt: row.created_at,
  }));
}

export async function listAuditFeed() {
  await ensureAdminSeed();
  const { rows } = await pgQuery(
    `SELECT id, actor, action, entity_ref, created_at
     FROM admin_audit_logs
     ORDER BY created_at DESC
     LIMIT 200`
  );
  return rows.map((row) => ({
    id: `audit_${row.id}`,
    actor: row.actor,
    action: row.action,
    entity: row.entity_ref,
    createdAt: row.created_at,
  }));
}

export async function getSettings() {
  await ensureAdminSeed();
  const { rows } = await pgQuery(
    `SELECT ai_mode, primary_provider, fallback_provider, openai_enabled, chat_daily_limit, quiz_daily_limit, topic_daily_limit
     FROM admin_settings
     WHERE id = 1
     LIMIT 1`
  );
  const row = rows[0];
  if (!row) return null;
  return {
    aiMode: row.ai_mode,
    primary: row.primary_provider,
    fallback: row.fallback_provider,
    openAiEnabled: row.openai_enabled,
    chatDailyLimit: row.chat_daily_limit,
    quizDailyLimit: row.quiz_daily_limit,
    topicDailyLimit: row.topic_daily_limit,
  };
}

export async function updateSettings(input) {
  await ensureAdminSeed();
  const { rows } = await pgQuery(
    `UPDATE admin_settings
     SET ai_mode = $1,
         primary_provider = $2,
         fallback_provider = $3,
         openai_enabled = $4,
         chat_daily_limit = $5,
         quiz_daily_limit = $6,
         topic_daily_limit = $7,
         updated_at = NOW()
     WHERE id = 1
     RETURNING ai_mode, primary_provider, fallback_provider, openai_enabled, chat_daily_limit, quiz_daily_limit, topic_daily_limit`,
    [
      input.aiMode || "free",
      input.primary || "gemini",
      input.fallback || "groq",
      Boolean(input.openAiEnabled),
      Number(input.chatDailyLimit || 200),
      Number(input.quizDailyLimit || 20),
      Number(input.topicDailyLimit || 5),
    ]
  );
  if (!rows[0]) return null;

  await pgQuery(
    `INSERT INTO admin_audit_logs (actor, action, entity_ref, metadata)
     VALUES ($1, 'SETTINGS_UPDATED', 'feature_config', '{}'::jsonb)`,
    ["admin@platform.dev"]
  );
  return {
    aiMode: rows[0].ai_mode,
    primary: rows[0].primary_provider,
    fallback: rows[0].fallback_provider,
    openAiEnabled: rows[0].openai_enabled,
    chatDailyLimit: rows[0].chat_daily_limit,
    quizDailyLimit: rows[0].quiz_daily_limit,
    topicDailyLimit: rows[0].topic_daily_limit,
  };
}
