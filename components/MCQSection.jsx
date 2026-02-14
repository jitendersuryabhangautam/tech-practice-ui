"use client";

import { useMemo, useState } from "react";

const MODE_QUIZ = "quiz";
const MODE_STUDY = "study";

export default function MCQSection({ quiz, isVisible, onToggle }) {
  const [mode, setMode] = useState(MODE_QUIZ);
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

  // Shuffle questions and options, limit quiz mode to 15 questions
  const quizQuestions = useMemo(() => {
    if (!quiz || quiz.length === 0) return [];

    // Shuffle and take first 15 questions
    const shuffledQuestions = shuffleArray(quiz).slice(0, 15);
    if (shuffleKey % 2 === 1) {
      shuffledQuestions.reverse();
    }

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

  // Study mode shows all questions with shuffled options
  const studyQuestions = useMemo(() => {
    if (!quiz || quiz.length === 0) return [];

    const shuffledQuestions = shuffleArray(quiz);
    if (shuffleKey % 2 === 1) {
      shuffledQuestions.reverse();
    }

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

  const question = quizQuestions[currentQuestion];

  const resetQuiz = (nextMode = MODE_QUIZ) => {
    setMode(nextMode);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setShuffleKey((prev) => prev + 1); // Trigger new shuffle
  };

  const closeAndReset = () => {
    resetQuiz(MODE_QUIZ);
    onToggle();
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

  const handleModeChange = (nextMode) => {
    if (nextMode === mode) {
      return;
    }
    resetQuiz(nextMode);
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((value) => value + 1);
      setSelectedAnswer(null);
      return;
    }

    if (mode === MODE_STUDY) {
      closeAndReset();
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
      <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-slate-900/60 p-2 sm:items-center sm:p-4">
        <div className="content-card min-w-0 max-h-[calc(100dvh-0.75rem)] w-full max-w-xl overflow-y-auto p-4 sm:max-h-[92vh] sm:p-6">
          <div className="mb-4 flex items-start justify-between">
            <h3 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-slate-100">
              Quiz Complete
            </h3>
            <button
              type="button"
              onClick={closeAndReset}
              className="text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Close
            </button>
          </div>

          <p className="mb-4 text-slate-700 dark:text-slate-300">
            Score:{" "}
            <span className="font-bold">
              {score} / {quizQuestions.length}
            </span>
          </p>
          <div className="mb-6 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-3 rounded-full bg-emerald-500"
              style={{ width: `${(score / quizQuestions.length) * 100}%` }}
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <button
              type="button"
              onClick={() => resetQuiz(MODE_QUIZ)}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
            >
              Retry Quiz
            </button>
            <button
              type="button"
              onClick={closeAndReset}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
            >
              Back To Topic
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-slate-900/60 p-2 sm:items-center sm:p-4">
      <div className="content-card min-w-0 max-h-[calc(100dvh-0.75rem)] w-full max-w-2xl overflow-y-auto p-4 sm:max-h-[92vh] sm:p-6">
        <div className="sticky top-0 z-10 -mx-4 mb-4 flex items-center justify-between gap-2 border-b border-slate-200 bg-white px-4 py-2 dark:border-slate-700 dark:bg-slate-900 sm:-mx-6 sm:px-6">
          <h3 className="text-lg font-bold text-slate-900 sm:text-xl dark:text-slate-100">
            Interview Practice MCQ
          </h3>
          <button
            type="button"
            onClick={closeAndReset}
            className="text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            Close
          </button>
        </div>

        <div className="mb-4 flex w-full rounded-lg border border-slate-200 p-1 dark:border-slate-700">
          <button
            type="button"
            onClick={() => handleModeChange(MODE_QUIZ)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition ${
              mode === MODE_QUIZ
                ? "bg-amber-500 text-slate-900"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            Quiz Mode
          </button>
          <button
            type="button"
            onClick={() => handleModeChange(MODE_STUDY)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition ${
              mode === MODE_STUDY
                ? "bg-amber-500 text-slate-900"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            Study Mode
          </button>
        </div>

        {mode === MODE_QUIZ ? (
          <>
            <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-amber-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </p>

            <p className="mb-5 break-words text-base font-semibold text-slate-900 sm:text-lg dark:text-slate-100">
              {question.question}
            </p>
          </>
        ) : (
          <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
            Showing {studyQuestions.length} questions
          </p>
        )}

        {mode === MODE_QUIZ ? (
          <>
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
                    key={`${question.question}-${index}`}
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
                  {currentQuestion === quizQuestions.length - 1
                    ? "See Result"
                    : "Next Question"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-6">
            {studyQuestions.map((studyQuestion, questionIndex) => {
              const studyAnswerText =
                studyQuestion.options[studyQuestion.correctAnswer];

              return (
                <div
                  key={`${studyQuestion.question}-study-question-${questionIndex}`}
                  className="rounded-lg border border-slate-200 p-4 dark:border-slate-700"
                >
                  <p className="mb-4 break-words text-base font-semibold text-slate-900 sm:text-lg dark:text-slate-100">
                    {questionIndex + 1}. {studyQuestion.question}
                  </p>

                  <div className="min-w-0 space-y-2">
                    {studyQuestion.options.map((option, index) => {
                      const isCorrect = index === studyQuestion.correctAnswer;
                      const optionClass = isCorrect
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-slate-300 dark:border-slate-700";

                      return (
                        <div
                          key={`${studyQuestion.question}-study-${index}`}
                          className={`w-full break-words rounded-lg border px-4 py-3 text-left text-sm text-slate-900 dark:text-slate-100 ${optionClass}`}
                        >
                          {option}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-700/40 dark:bg-emerald-900/20">
                    <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                      Answer: {studyAnswerText}
                    </p>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                      {studyQuestion.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
