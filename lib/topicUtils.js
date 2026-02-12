function createInterviewQuestions(topic) {
  const summary = topic.description || "Describe the core concept clearly.";
  const useCase = topic.useCase || "Discuss where this pattern is useful.";
  return [
    {
      question: `What problem does ${topic.title} solve?`,
      answer: summary,
    },
    {
      question: `How would you explain ${topic.title} to an interviewer in 60 seconds?`,
      answer: `${summary} Focus on trade-offs, not only definition.`,
    },
    {
      question: `Where is ${topic.title} used in production systems?`,
      answer: useCase,
    },
    {
      question: `What is one common mistake with ${topic.title}?`,
      answer:
        "Most candidates explain syntax but skip constraints, edge cases, and performance implications.",
    },
  ];
}

function normalizeTopic(topic) {
  const implementation = topic.implementation || topic.code || topic.command;
  const example = topic.example || topic.sample;

  return {
    ...topic,
    description: topic.description || "Detailed explanation coming soon.",
    explanation: topic.explanation || topic.description || "",
    implementation,
    example,
    interviewQuestions:
      topic.interviewQuestions && topic.interviewQuestions.length > 0
        ? topic.interviewQuestions
        : createInterviewQuestions(topic),
  };
}

export function normalizeTopics(topicsOrCategories) {
  if (!Array.isArray(topicsOrCategories)) {
    return [];
  }

  if (topicsOrCategories.length === 0) {
    return [];
  }

  const hasCategories = Array.isArray(topicsOrCategories[0]?.topics);
  if (!hasCategories) {
    return topicsOrCategories.map((topic, index) =>
      normalizeTopic({
        ...topic,
        category: topic.category || "Core Concepts",
        id: topic.id || `topic-${index + 1}`,
      })
    );
  }

  return topicsOrCategories.flatMap((section) =>
    (section.topics || []).map((topic, index) =>
      normalizeTopic({
        ...topic,
        category: section.category || "Core Concepts",
        id: topic.id || `${section.category || "topic"}-${index + 1}`,
      })
    )
  );
}
