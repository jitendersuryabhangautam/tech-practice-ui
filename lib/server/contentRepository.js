import { pgQuery } from "@/lib/server/postgres";

function groupTopicsByCategory(topics) {
  const grouped = {};
  for (const topic of topics) {
    const category = topic.category || "General";
    if (!grouped[category]) {
      grouped[category] = { category, topics: [] };
    }
    grouped[category].topics.push(topic);
  }
  return Object.values(grouped);
}

export async function listTechnologiesSummary() {
  const { rows } = await pgQuery(
    `SELECT t.slug, t.title, t.description,
            COUNT(DISTINCT tp.id) AS topic_count,
            COUNT(DISTINCT q.id) AS quiz_count
     FROM technologies t
     LEFT JOIN topics tp ON tp.technology_id = t.id
     LEFT JOIN quiz_questions q ON q.technology_id = t.id
     GROUP BY t.id
     ORDER BY t.slug ASC`
  );

  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    description: row.description,
    topicCount: Number(row.topic_count || 0),
    quizCount: Number(row.quiz_count || 0),
  }));
}

export async function getTechnologyContent(techSlug) {
  const techRes = await pgQuery(
    `SELECT id, slug, title, description
     FROM technologies
     WHERE slug = $1
     LIMIT 1`,
    [techSlug]
  );
  const tech = techRes.rows[0];
  if (!tech) return null;

  const topicsRes = await pgQuery(
    `SELECT id, topic_key, title, category, description, explanation, code, example, use_case, raw_json
     FROM topics
     WHERE technology_id = $1
     ORDER BY category, title`,
    [tech.id]
  );

  const topicIds = topicsRes.rows.map((row) => row.id);
  const [iqRes, exRes, pxRes, quizRes] = await Promise.all([
    topicIds.length
      ? pgQuery(
          `SELECT topic_id, sort_order, question, answer
           FROM interview_questions
           WHERE topic_id = ANY($1::int[])
           ORDER BY topic_id, sort_order`,
          [topicIds]
        )
      : Promise.resolve({ rows: [] }),
    topicIds.length
      ? pgQuery(
          `SELECT topic_id, sort_order, exercise_type, question, answer
           FROM exercises
           WHERE topic_id = ANY($1::int[])
           ORDER BY topic_id, sort_order`,
          [topicIds]
        )
      : Promise.resolve({ rows: [] }),
    topicIds.length
      ? pgQuery(
          `SELECT topic_id, sort_order, question, code, output
           FROM program_exercises
           WHERE topic_id = ANY($1::int[])
           ORDER BY topic_id, sort_order`,
          [topicIds]
        )
      : Promise.resolve({ rows: [] }),
    pgQuery(
      `SELECT question, options, correct_answer, explanation
       FROM quiz_questions
       WHERE technology_id = $1
       ORDER BY sort_order`,
      [tech.id]
    ),
  ]);

  const iqMap = new Map();
  for (const row of iqRes.rows) {
    const list = iqMap.get(row.topic_id) || [];
    list.push({ question: row.question, answer: row.answer });
    iqMap.set(row.topic_id, list);
  }

  const exMap = new Map();
  for (const row of exRes.rows) {
    const list = exMap.get(row.topic_id) || [];
    list.push({
      type: row.exercise_type,
      question: row.question,
      answer: row.answer,
    });
    exMap.set(row.topic_id, list);
  }

  const pxMap = new Map();
  for (const row of pxRes.rows) {
    const list = pxMap.get(row.topic_id) || [];
    list.push({
      question: row.question,
      code: row.code,
      output: row.output,
    });
    pxMap.set(row.topic_id, list);
  }

  const topics = topicsRes.rows.map((row) => ({
    id: row.topic_key,
    title: row.title,
    category: row.category,
    description: row.description,
    explanation: row.explanation,
    code: row.code,
    example: row.example,
    useCase: row.use_case,
    interviewQuestions: iqMap.get(row.id) || [],
    exercises: exMap.get(row.id) || [],
    programExercises: pxMap.get(row.id) || [],
    ...(row.raw_json && typeof row.raw_json === "object" ? row.raw_json : {}),
  }));

  const quiz = quizRes.rows.map((row) => ({
    question: row.question,
    options: Array.isArray(row.options) ? row.options : [],
    correctAnswer: row.correct_answer,
    explanation: row.explanation,
  }));

  return {
    meta: {
      title: tech.title,
      description: tech.description,
    },
    topicsByCategory: groupTopicsByCategory(topics),
    quiz,
  };
}

export async function getTechnologyIndex(techSlug) {
  const techRes = await pgQuery(
    `SELECT id, slug, title, description
     FROM technologies
     WHERE slug = $1
     LIMIT 1`,
    [techSlug]
  );
  const tech = techRes.rows[0];
  if (!tech) return null;

  const topicsRes = await pgQuery(
    `SELECT topic_key, title, category, description
     FROM topics
     WHERE technology_id = $1
     ORDER BY category, title`,
    [tech.id]
  );

  const quizRes = await pgQuery(
    `SELECT question, options, correct_answer, explanation
     FROM quiz_questions
     WHERE technology_id = $1
     ORDER BY sort_order`,
    [tech.id]
  );

  const topics = topicsRes.rows.map((row) => ({
    id: row.topic_key,
    title: row.title,
    category: row.category,
    description: row.description || "",
  }));

  const quiz = quizRes.rows.map((row) => ({
    question: row.question,
    options: Array.isArray(row.options) ? row.options : [],
    correctAnswer: row.correct_answer,
    explanation: row.explanation,
  }));

  return {
    meta: {
      title: tech.title,
      description: tech.description,
    },
    topicsByCategory: groupTopicsByCategory(topics),
    quiz,
  };
}

export async function getTopicById(techSlug, topicId) {
  const payload = await getTechnologyContent(techSlug);
  if (!payload) return null;
  const flat = payload.topicsByCategory.flatMap((section) => section.topics);
  return flat.find((topic) => topic.id === topicId) || null;
}
