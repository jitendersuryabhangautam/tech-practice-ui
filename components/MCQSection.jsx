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
          className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-amber-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/30 sm:px-5 sm:py-3 sm:text-sm dark:from-amber-500 dark:to-orange-600 dark:shadow-amber-600/20"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" fill="currentColor">
            <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 14.596a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 5.404a.75.75 0 001.06-1.06L5.404 3.284a.75.75 0 00-1.06 1.06l1.06 1.06z" />
          </svg>
          Start Quiz
        </button>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const isGreat = percentage >= 80;
    const isOkay = percentage >= 50;
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/50 backdrop-blur-sm p-2 sm:items-center sm:p-4">
        <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl sm:max-h-[92vh] dark:border-slate-700/80 dark:bg-slate-900">
          {/* Result header */}
          <div className={`relative px-6 pb-8 pt-6 text-center ${isGreat ? "bg-gradient-to-br from-emerald-500 to-teal-500" : isOkay ? "bg-gradient-to-br from-amber-500 to-orange-500" : "bg-gradient-to-br from-rose-500 to-pink-500"}`}>
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
              <div className="absolute -bottom-4 left-6 h-20 w-20 rounded-full bg-white/5" />
            </div>
            <div className="relative">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <span className="text-3xl">{isGreat ? "🏆" : isOkay ? "💪" : "📚"}</span>
              </div>
              <h3 className="text-xl font-bold text-white sm:text-2xl">
                {isGreat ? "Excellent!" : isOkay ? "Good Job!" : "Keep Practicing!"}
              </h3>
              <p className="mt-1 text-sm text-white/80">Quiz Complete</p>
            </div>
          </div>

          {/* Score details */}
          <div className="px-6 py-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Your Score</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{score}<span className="text-base font-normal text-slate-400">/{quizQuestions.length}</span></span>
            </div>
            <div className="mb-2 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-700 ${isGreat ? "bg-emerald-500" : isOkay ? "bg-amber-500" : "bg-rose-500"}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-right text-xs font-medium text-slate-400 dark:text-slate-500">{percentage}%</p>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => resetQuiz(MODE_QUIZ)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:shadow-md dark:from-amber-500 dark:to-orange-600"
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
                  <path fillRule="evenodd" d="M8 3a5 5 0 11-4.546 2.914.5.5 0 00-.908-.418A6 6 0 108 2v1z" clipRule="evenodd" />
                  <path d="M8 4.466V.534a.25.25 0 00-.41-.192L5.23 2.308a.25.25 0 000 .384l2.36 1.966A.25.25 0 008 4.466z" />
                </svg>
                Retry Quiz
              </button>
              <button
                type="button"
                onClick={closeAndReset}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Back to Topic
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/50 backdrop-blur-sm p-2 sm:items-center sm:p-4">
      <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl sm:max-h-[92vh] dark:border-slate-700/80 dark:bg-slate-900">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="relative flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3.5 dark:border-slate-800 dark:from-amber-600 dark:to-orange-600">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10" />
          </div>
          <div className="relative flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="white">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-white sm:text-base">
              Interview Quiz
            </h3>
          </div>
          <button
            type="button"
            onClick={closeAndReset}
            className="relative rounded-xl p-2 text-white/70 transition hover:bg-white/15 hover:text-white"
            aria-label="Close quiz"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        {/* ── Mode toggle ────────────────────────────────────────────────── */}
        <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-2.5 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex rounded-xl bg-slate-200/70 p-1 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => handleModeChange(MODE_QUIZ)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition sm:text-sm ${
                mode === MODE_QUIZ
                  ? "bg-white text-amber-600 shadow-sm dark:bg-slate-700 dark:text-amber-400"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              }`}
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor">
                <path d="M8 15A7 7 0 108 1a7 7 0 000 14zm.75-10.25a.75.75 0 00-1.5 0v3.69L5.03 9.28a.75.75 0 001.06 1.06L8.31 8.56a.75.75 0 00.44-.69V4.75z" />
              </svg>
              Quiz
            </button>
            <button
              type="button"
              onClick={() => handleModeChange(MODE_STUDY)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition sm:text-sm ${
                mode === MODE_STUDY
                  ? "bg-white text-amber-600 shadow-sm dark:bg-slate-700 dark:text-amber-400"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              }`}
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor">
                <path d="M2 3.5A1.5 1.5 0 013.5 2h2.764c.958 0 1.76.56 2.311 1.184C9.015 3.583 9.5 4 10 4h2.5A1.5 1.5 0 0114 5.5v7a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 012 12.5v-9z" />
              </svg>
              Study
            </button>
          </div>
        </div>

        {/* ── Scrollable body ────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {mode === MODE_QUIZ ? (
          <>
            {/* Progress bar + counter */}
            <div className="mb-5">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Question {currentQuestion + 1} / {quizQuestions.length}
                </span>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question text */}
            <div className="mb-5 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4 dark:border-slate-800 dark:bg-slate-800/40">
              <p className="break-words text-base font-semibold leading-relaxed text-slate-900 sm:text-lg dark:text-slate-100">
                {question.question}
              </p>
            </div>

            {/* Options */}
            <div className="min-w-0 space-y-2.5">
              {question.options.map((option, index) => {
                const showAnswer = selectedAnswer !== null;
                const isCorrect = index === question.correctAnswer;
                const isSelected = index === selectedAnswer;
                const letter = String.fromCharCode(65 + index);

                let optionStyle = "border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/50 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-amber-600/50 dark:hover:bg-amber-500/5";
                let letterStyle = "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400";

                if (showAnswer) {
                  if (isCorrect) {
                    optionStyle = "border-emerald-400 bg-emerald-50 dark:border-emerald-500/60 dark:bg-emerald-500/10";
                    letterStyle = "bg-emerald-500 text-white";
                  } else if (isSelected) {
                    optionStyle = "border-rose-400 bg-rose-50 dark:border-rose-500/60 dark:bg-rose-500/10";
                    letterStyle = "bg-rose-500 text-white";
                  } else {
                    optionStyle = "border-slate-100 bg-white opacity-50 dark:border-slate-800 dark:bg-slate-800/40";
                    letterStyle = "bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500";
                  }
                }

                return (
                  <button
                    key={`${question.question}-${index}`}
                    type="button"
                    disabled={showAnswer}
                    onClick={() => handleAnswer(index)}
                    className={`group flex w-full items-start gap-3 break-words rounded-xl border px-3.5 py-3 text-left text-sm transition-all duration-200 ${optionStyle}`}
                  >
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition ${letterStyle}`}>
                      {showAnswer && isCorrect ? (
                        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor"><path fillRule="evenodd" d="M12.416 3.376a.75.75 0 01.208 1.04l-5 7.5a.75.75 0 01-1.154.114l-3-3a.75.75 0 011.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 011.04-.207z" clipRule="evenodd" /></svg>
                      ) : showAnswer && isSelected && !isCorrect ? (
                        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor"><path d="M5.28 4.22a.75.75 0 00-1.06 1.06L6.94 8 4.22 10.72a.75.75 0 101.06 1.06L8 9.06l2.72 2.72a.75.75 0 101.06-1.06L9.06 8l2.72-2.72a.75.75 0 00-1.06-1.06L8 6.94 5.28 4.22z" /></svg>
                      ) : letter}
                    </span>
                    <span className="pt-0.5 text-slate-800 dark:text-slate-200">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation + Next */}
            {selectedAnswer !== null && (
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Explanation</p>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {question.explanation}
                  </p>
                </div>
                <div className="border-t border-slate-200 bg-white px-4 py-2.5 dark:border-slate-700 dark:bg-slate-900">
                  <button
                    type="button"
                    onClick={nextQuestion}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:shadow-md dark:from-amber-500 dark:to-orange-600"
                  >
                    {currentQuestion === quizQuestions.length - 1 ? "See Result" : "Next Question"}
                    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
                      <path fillRule="evenodd" d="M4.22 11.78a.75.75 0 010-1.06L7.94 7 4.22 3.28a.75.75 0 011.06-1.06l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {studyQuestions.length} Questions · All Answers Shown
            </p>
            <div className="space-y-5">
              {studyQuestions.map((studyQuestion, questionIndex) => {
                const studyAnswerText =
                  studyQuestion.options[studyQuestion.correctAnswer];

                return (
                  <div
                    key={`${studyQuestion.question}-study-question-${questionIndex}`}
                    className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700"
                  >
                    {/* Question header */}
                    <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-slate-700/50 dark:bg-slate-800/50">
                      <p className="break-words text-sm font-semibold leading-relaxed text-slate-900 sm:text-base dark:text-slate-100">
                        <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-lg bg-amber-100 text-xs font-bold text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
                          {questionIndex + 1}
                        </span>
                        {studyQuestion.question}
                      </p>
                    </div>

                    {/* Options */}
                    <div className="space-y-1.5 px-4 py-3">
                      {studyQuestion.options.map((option, index) => {
                        const isCorrect = index === studyQuestion.correctAnswer;
                        const letter = String.fromCharCode(65 + index);

                        return (
                          <div
                            key={`${studyQuestion.question}-study-${index}`}
                            className={`flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-sm ${
                              isCorrect
                                ? "border-emerald-300 bg-emerald-50 dark:border-emerald-600/40 dark:bg-emerald-500/10"
                                : "border-slate-100 bg-white dark:border-slate-700/50 dark:bg-slate-800/30"
                            }`}
                          >
                            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold ${
                              isCorrect
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500"
                            }`}>
                              {isCorrect ? (
                                <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor"><path fillRule="evenodd" d="M12.416 3.376a.75.75 0 01.208 1.04l-5 7.5a.75.75 0 01-1.154.114l-3-3a.75.75 0 011.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 011.04-.207z" clipRule="evenodd" /></svg>
                              ) : letter}
                            </span>
                            <span className={`break-words pt-0.5 ${isCorrect ? "font-medium text-emerald-800 dark:text-emerald-300" : "text-slate-700 dark:text-slate-300"}`}>
                              {option}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3 dark:border-slate-700/50 dark:bg-slate-800/30">
                      <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Explanation</p>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        {studyQuestion.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
}
