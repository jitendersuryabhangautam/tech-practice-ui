CREATE TABLE IF NOT EXISTS technologies (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS topics (
  id SERIAL PRIMARY KEY,
  technology_id INTEGER NOT NULL REFERENCES technologies(id) ON DELETE CASCADE,
  topic_key TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  description TEXT NOT NULL DEFAULT '',
  explanation TEXT NOT NULL DEFAULT '',
  code TEXT NOT NULL DEFAULT '',
  example TEXT NOT NULL DEFAULT '',
  use_case TEXT NOT NULL DEFAULT '',
  raw_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (technology_id, topic_key)
);

CREATE TABLE IF NOT EXISTS interview_questions (
  id SERIAL PRIMARY KEY,
  topic_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  question TEXT NOT NULL,
  answer TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (topic_id, sort_order)
);

CREATE TABLE IF NOT EXISTS exercises (
  id SERIAL PRIMARY KEY,
  topic_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  exercise_type TEXT NOT NULL DEFAULT 'general',
  question TEXT NOT NULL,
  answer TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (topic_id, sort_order)
);

CREATE TABLE IF NOT EXISTS program_exercises (
  id SERIAL PRIMARY KEY,
  topic_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  question TEXT NOT NULL,
  code TEXT NOT NULL DEFAULT '',
  output TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (topic_id, sort_order)
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id SERIAL PRIMARY KEY,
  technology_id INTEGER NOT NULL REFERENCES technologies(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  question TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct_answer INTEGER NOT NULL DEFAULT 0,
  explanation TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (technology_id, sort_order)
);

CREATE TABLE IF NOT EXISTS admin_content_reviews (
  id SERIAL PRIMARY KEY,
  content_ref TEXT NOT NULL UNIQUE,
  technology_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_review',
  summary TEXT NOT NULL DEFAULT '',
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_publish_events (
  id SERIAL PRIMARY KEY,
  event_ref TEXT NOT NULL UNIQUE,
  content_ref TEXT,
  status TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id SERIAL PRIMARY KEY,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_ref TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_topics_tech ON topics (technology_id);
CREATE INDEX IF NOT EXISTS idx_topics_category ON topics (category);
CREATE INDEX IF NOT EXISTS idx_quiz_tech ON quiz_questions (technology_id);
CREATE INDEX IF NOT EXISTS idx_iq_topic ON interview_questions (topic_id);
CREATE INDEX IF NOT EXISTS idx_ex_topic ON exercises (topic_id);
CREATE INDEX IF NOT EXISTS idx_px_topic ON program_exercises (topic_id);
