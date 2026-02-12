"use client";

import { useState, useMemo } from "react";

export default function MCQSection({ quiz, isVisible, onToggle }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [shuffleKey, setShuffleKey] = useState(0);

  // Shuffle array using Fisher-Yates algorithm
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Shuffle questions and options, limit to 15 questions
  const shuffledQuiz = useMemo(() => {
    if (!quiz || quiz.length === 0) return [];

    // Shuffle and take first 15 questions
    const shuffledQuestions = shuffleArray(quiz).slice(0, 15);
    if (shuffleKey % 2 === 1) {
      shuffledQuestions.reverse();
    }

    // Shuffle options for each question and update correctAnswer index
    return shuffledQuestions.map((question) => {
      const correctOption = question.options[question.correctAnswer];
      const shuffledOptions = shuffleArray(question.options);
      const newCorrectIndex = shuffledOptions.indexOf(correctOption);

      return {
        ...question,
        options: shuffledOptions,
        correctAnswer: newCorrectIndex,
      };
    });
  }, [quiz, shuffleKey]);

  if (!quiz || quiz.length === 0) {
    return null;
  }

  const question = shuffledQuiz[currentQuestion];

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setShuffleKey((prev) => prev + 1); // Trigger new shuffle
  };

  const handleAnswer = (answerIndex) => {
    if (selectedAnswer !== null) {
      return;
    }
    setSelectedAnswer(answerIndex);
    if (answerIndex === question.correctAnswer) {
      setScore((value) => value + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < shuffledQuiz.length - 1) {
      setCurrentQuestion((value) => value + 1);
      setSelectedAnswer(null);
      return;
    }
    setShowResult(true);
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 left-4 z-40 sm:bottom-8 sm:left-auto sm:right-8">
        <button
          type="button"
          onClick={onToggle}
          className="rounded-full bg-amber-500 px-4 py-2.5 text-xs font-semibold text-slate-900 shadow-lg transition hover:bg-amber-400 sm:px-5 sm:py-3 sm:text-sm"
        >
          Start Interview Quiz
        </button>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
        <div className="content-card min-w-0 max-h-[92vh] w-full max-w-xl overflow-y-auto p-4 sm:p-6">
          <div className="mb-4 flex items-start justify-between">
            <h3 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-slate-100">
              Quiz Complete
            </h3>
            <button
              type="button"
              onClick={onToggle}
              className="text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Close
            </button>
          </div>

          <p className="mb-4 text-slate-700 dark:text-slate-300">
            Score:{" "}
            <span className="font-bold">
              {score} / {shuffledQuiz.length}
            </span>
          </p>
          <div className="mb-6 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-3 rounded-full bg-emerald-500"
              style={{ width: `${(score / shuffledQuiz.length) * 100}%` }}
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <button
              type="button"
              onClick={resetQuiz}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={onToggle}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
            >
              Back To Topic
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / shuffledQuiz.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="content-card min-w-0 max-h-[92vh] w-full max-w-2xl overflow-y-auto p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 sm:text-xl dark:text-slate-100">
            Interview Practice MCQ
          </h3>
          <button
            type="button"
            onClick={onToggle}
            className="text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            Close
          </button>
        </div>

        <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-amber-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
          Question {currentQuestion + 1} of {shuffledQuiz.length}
        </p>

        <p className="mb-5 break-words text-base font-semibold text-slate-900 sm:text-lg dark:text-slate-100">
          {question.question}
        </p>

        <div className="min-w-0 space-y-2">
          {question.options.map((option, index) => {
            const showAnswer = selectedAnswer !== null;
            const isCorrect = index === question.correctAnswer;
            const isSelected = index === selectedAnswer;
            const optionClass = !showAnswer
              ? "border-slate-300 hover:border-amber-500 dark:border-slate-600"
              : isCorrect
                ? "border-emerald-500 bg-emerald-500/10"
                : isSelected
                  ? "border-rose-500 bg-rose-500/10"
                  : "border-slate-300 opacity-60 dark:border-slate-700";

            return (
              <button
                key={option}
                type="button"
                disabled={showAnswer}
                onClick={() => handleAnswer(index)}
                className={`w-full break-words rounded-lg border px-4 py-3 text-left text-sm text-slate-900 transition dark:text-slate-100 ${optionClass}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {selectedAnswer !== null && (
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/70">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {question.explanation}
            </p>
            <button
              type="button"
              onClick={nextQuestion}
              className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-400"
            >
              {currentQuestion === shuffledQuiz.length - 1
                ? "See Result"
                : "Next Question"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
