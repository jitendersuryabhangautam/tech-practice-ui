CREATE TABLE IF NOT EXISTS admin_settings (
  id INTEGER PRIMARY KEY,
  ai_mode TEXT NOT NULL DEFAULT 'free',
  primary_provider TEXT NOT NULL DEFAULT 'gemini',
  fallback_provider TEXT NOT NULL DEFAULT 'groq',
  openai_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  chat_daily_limit INTEGER NOT NULL DEFAULT 200,
  quiz_daily_limit INTEGER NOT NULL DEFAULT 20,
  topic_daily_limit INTEGER NOT NULL DEFAULT 5,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_jobs (
  id SERIAL PRIMARY KEY,
  job_ref TEXT NOT NULL UNIQUE,
  job_type TEXT NOT NULL,
  status TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'system',
  progress INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO admin_settings (id, ai_mode, primary_provider, fallback_provider, openai_enabled, chat_daily_limit, quiz_daily_limit, topic_daily_limit, updated_at)
VALUES (1, 'free', 'gemini', 'groq', FALSE, 200, 20, 5, NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO admin_content_reviews (content_ref, technology_slug, title, status, summary, generated_at, updated_at)
VALUES
('cnt_async_patterns_01','javascript','Async Patterns','pending_review','Interview-first coverage of callback queues, promises, async/await pitfalls, and cancellation strategies.', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('cnt_sd_consistent_hashing_01','system-design','Consistent Hashing','approved','Ring architecture, virtual nodes, rebalancing behavior, and production trade-offs for distributed systems.', NOW() - INTERVAL '2 day', NOW() - INTERVAL '2 day'),
('cnt_go_channels_02','golang','Go Channels','rejected','Covers buffered/unbuffered channels, select patterns, and deadlock scenarios with practical debugging notes.', NOW() - INTERVAL '3 day', NOW() - INTERVAL '3 day')
ON CONFLICT (content_ref) DO NOTHING;

INSERT INTO admin_publish_events (event_ref, content_ref, status, summary, created_at)
VALUES
('pub_2026_02_13_01','cnt_sd_consistent_hashing_01','published','Published: Consistent Hashing', NOW() - INTERVAL '1 day'),
('pub_2026_02_12_03','cnt_async_patterns_01','rolled_back','Rollback: Async Patterns', NOW() - INTERVAL '2 day')
ON CONFLICT (event_ref) DO NOTHING;

INSERT INTO admin_audit_logs (actor, action, entity_ref, metadata, created_at)
VALUES
('admin@platform.dev','CONTENT_APPROVED','cnt_sd_consistent_hashing_01','{}'::jsonb, NOW() - INTERVAL '1 day'),
('admin@platform.dev','PUBLISH_TRIGGERED','pub_2026_02_13_01','{}'::jsonb, NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

INSERT INTO admin_jobs (job_ref, job_type, status, provider, progress, created_at)
VALUES
('job_8801','GENERATE_TOPIC','running','gemini',62,NOW() - INTERVAL '2 hour'),
('job_8799','GENERATE_QUIZ','completed','gemini',100,NOW() - INTERVAL '3 hour'),
('job_8793','PUBLISH_CONTENT','failed','system',100,NOW() - INTERVAL '4 hour')
ON CONFLICT (job_ref) DO NOTHING;
