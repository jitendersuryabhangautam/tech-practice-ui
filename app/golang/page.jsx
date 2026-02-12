"use client";

import InterviewTopicPage from "@/components/InterviewTopicPage";
import { golangData, golangQuiz } from "@/data/golang";
import { golangExtraData, golangExtraQuiz } from "@/data/golang_extra";

const MIN_INTERVIEW_QUESTIONS = 10;
const MIN_EXERCISES = 10;
const MIN_PROGRAM_EXERCISES = 10;

const GO_ENRICHED_QUIZ = [
  {
    question:
      "Output: `s := []int{1,2,3}; t := s[:2]; t = append(t, 9); fmt.Println(s)`",
    options: ["[1 2 3]", "[1 2 9]", "[9 2 3]", "compile error"],
    correctAnswer: 1,
    explanation:
      "If capacity allows, append reuses backing array and mutates shared data.",
  },
  {
    question: "Which is the idiomatic Go error handling style?",
    options: [
      "Exceptions only",
      "panic everywhere",
      "Explicit `if err != nil` checks",
      "Global error handler",
    ],
    correctAnswer: 2,
    explanation:
      "Go uses explicit error returns and local checks for predictable flow.",
  },
  {
    question: "Output: `var m map[string]int; fmt.Println(m == nil, len(m))`",
    options: ["true 0", "false 0", "true 1", "panic"],
    correctAnswer: 0,
    explanation: "Nil map comparison is true and len(nilMap) is 0.",
  },
  {
    question: "What happens on writing to a nil map?",
    options: ["No-op", "Compile error", "Runtime panic", "Returns false"],
    correctAnswer: 2,
    explanation: "Reads are allowed on nil maps, writes panic.",
  },
  {
    question: "Output: `defer fmt.Println(\"A\"); fmt.Println(\"B\")`",
    options: ["A B", "B A", "A", "B"],
    correctAnswer: 1,
    explanation: "Deferred calls run when surrounding function returns.",
  },
  {
    question:
      "Which pattern best prevents goroutine leaks in long-running services?",
    options: [
      "Sleep before return",
      "Global booleans",
      "Context cancellation + select on Done channel",
      "Recover in every goroutine",
    ],
    correctAnswer: 2,
    explanation:
      "Cancellation-aware goroutines should stop on context Done signal.",
  },
  {
    question: "What does `make([]int, 3, 8)` create?",
    options: [
      "len=8 cap=3",
      "len=3 cap=8",
      "len=3 cap=3",
      "len=8 cap=8",
    ],
    correctAnswer: 1,
    explanation: "First argument after type is length, second is capacity.",
  },
  {
    question:
      "Output: `ch := make(chan int,1); ch <- 7; close(ch); v, ok := <-ch; fmt.Println(v, ok)`",
    options: ["0 false", "7 true", "7 false", "panic"],
    correctAnswer: 1,
    explanation:
      "Buffered value remains readable after close; then subsequent reads return zero,false.",
  },
  {
    question: "Which statement about interfaces in Go is true?",
    options: [
      "Implementation is explicit with `implements` keyword",
      "Only structs can satisfy interfaces",
      "Interfaces are satisfied implicitly by method set",
      "Interfaces cannot be embedded",
    ],
    correctAnswer: 2,
    explanation:
      "Go uses structural typing; matching method set is enough to satisfy interface.",
  },
  {
    question: "What is the purpose of `go test -race`?",
    options: [
      "Speed up tests",
      "Detect race conditions at runtime",
      "Format code",
      "Run benchmarks only",
    ],
    correctAnswer: 1,
    explanation:
      "Race detector identifies unsynchronized concurrent memory accesses.",
  },
  {
    question: "Output: `nums := []int{1,2}; copy(nums, []int{9}); fmt.Println(nums)`",
    options: ["[9 2]", "[1 2]", "[9]", "panic"],
    correctAnswer: 0,
    explanation: "copy overwrites destination up to min(len(dst), len(src)).",
  },
  {
    question:
      "When should you generally choose pointer receiver methods on structs?",
    options: [
      "Never",
      "Only for private methods",
      "When method mutates state or struct is large to copy",
      "Only for interfaces",
    ],
    correctAnswer: 2,
    explanation:
      "Pointer receivers avoid copies and allow state mutation on original value.",
  },
];

function ensureMinimum(items, min, createItem) {
  const result = Array.isArray(items) ? [...items] : [];
  while (result.length < min) {
    result.push(createItem(result.length));
  }
  return result;
}

function fallbackInterviewQuestion(topic, index) {
  const n = index + 1;
  const useCase =
    topic.useCase || "Discuss production trade-offs and practical usage.";
  const description =
    topic.description || "Explain core mechanics with one practical example.";

  const templates = [
    {
      question: `Interview Q${n}: Explain ${topic.title} in simple terms and one backend use case.`,
      answer: `${description} ${useCase}`,
    },
    {
      question: `Interview Q${n}: What are common mistakes in ${topic.title}?`,
      answer:
        "Candidates often memorize syntax but miss edge cases, failure handling, and performance trade-offs.",
    },
    {
      question: `Interview Q${n}: How would you test ${topic.title} behavior?`,
      answer:
        "Use focused unit tests for expected paths, edge conditions, and error scenarios with deterministic inputs.",
    },
    {
      question: `Interview Q${n}: What are scalability considerations for ${topic.title}?`,
      answer:
        "Discuss latency, memory growth, contention, and how observability/benchmarking guides optimization.",
    },
  ];

  return templates[index % templates.length];
}

function fallbackExercise(topic, index) {
  const n = index + 1;
  const templates = [
    {
      type: "theory",
      question: `Exercise ${n}: Write a concise theory note for ${topic.title} including definition, benefits, and limitations.`,
    },
    {
      type: "implement",
      question: `Exercise ${n}: Implement a small Go snippet demonstrating ${topic.title} with proper error handling.`,
    },
    {
      type: "debug",
      question: `Exercise ${n}: Debug a failing ${topic.title} snippet and explain root cause in 3 steps.`,
    },
    {
      type: "tricky",
      question: `Exercise ${n}: List one tricky edge case in ${topic.title} and how to avoid it.`,
    },
    {
      type: "output",
      question: `Exercise ${n}: Predict output of a short ${topic.title} code sample and justify each line.`,
    },
  ];

  return templates[index % templates.length];
}

function enrichTopic(topic) {
  const title = topic.title || "Go Topic";

  const fallbackProgram = (index) => {
    const n = index + 1;
    const templates = [
      {
        question: `Program ${n}: Write a minimal runnable snippet for ${title}.`,
        answer:
          "Focus on one core concept, keep function small, and print deterministic output.",
        code: `package main

import "fmt"

func main() {
    fmt.Println("${title} - program ${n}")
}`,
        output: `${title} - program ${n}`,
      },
      {
        question: `Program ${n}: Add input validation around ${title}.`,
        answer:
          "Return early on invalid input and keep success path simple and readable.",
        code: `package main

import "fmt"

func validate(v int) error {
    if v < 0 {
        return fmt.Errorf("invalid input")
    }
    return nil
}

func main() {
    fmt.Println(validate(1) == nil)
}`,
        output: "true",
      },
      {
        question: `Program ${n}: Demonstrate one error path for ${title}.`,
        answer:
          "Model failure explicitly and print whether error was captured.",
        code: `package main

import (
    "errors"
    "fmt"
)

func run(fail bool) error {
    if fail {
        return errors.New("failed")
    }
    return nil
}

func main() {
    fmt.Println(run(true) != nil)
}`,
        output: "true",
      },
      {
        question: `Program ${n}: Add a tiny table-style test harness pattern for ${title}.`,
        answer:
          "Use slice of cases and loop through expected outputs for deterministic checks.",
        code: `package main

import "fmt"

func sq(x int) int { return x * x }

func main() {
    tests := []struct{ in, out int }{{2, 4}, {3, 9}}
    ok := true
    for _, tc := range tests {
        if sq(tc.in) != tc.out {
            ok = false
        }
    }
    fmt.Println(ok)
}`,
        output: "true",
      },
    ];

    return templates[index % templates.length];
  };

  return {
    ...topic,
    interviewQuestions: ensureMinimum(
      topic.interviewQuestions,
      MIN_INTERVIEW_QUESTIONS,
      (index) => fallbackInterviewQuestion(topic, index)
    ),
    exercises: ensureMinimum(topic.exercises, MIN_EXERCISES, (index) =>
      fallbackExercise(topic, index)
    ),
    programExercises: ensureMinimum(
      topic.programExercises,
      MIN_PROGRAM_EXERCISES,
      (index) => fallbackProgram(index)
    ),
  };
}

export default function GolangPage() {
  const mergedTopics = [...golangData, ...golangExtraData].map((section) => ({
    ...section,
    topics: (section.topics || []).map(enrichTopic),
  }));
  const mergedQuiz = [...golangQuiz];
  const seen = new Set(mergedQuiz.map((q) => q.question));
  for (const q of [...golangExtraQuiz, ...GO_ENRICHED_QUIZ]) {
    if (!seen.has(q.question)) {
      mergedQuiz.push(q);
      seen.add(q.question);
    }
  }

  return (
    <InterviewTopicPage
      title="Golang Interview Preparation"
      description="Prepare for backend interviews with Go fundamentals, concurrency models, data structures, and production practices."
      topics={mergedTopics}
      quiz={mergedQuiz}
    />
  );
}
