"use client";

import { useState } from "react";

export default function Quiz({ questions }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  if (!questions || questions.length === 0) {
    return null;
  }

  const question = questions[currentQuestion];

  const handleAnswer = (answerIndex) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === question.correctAnswer;

    if (isCorrect) {
      setScore(score + 1);
    }

    setAnsweredQuestions([
      ...answeredQuestions,
      {
        question: question.question,
        selectedAnswer: answerIndex,
        correctAnswer: question.correctAnswer,
        isCorrect,
      },
    ]);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions([]);
  };

  if (showResult) {
    return (
      <div className="mb-8 rounded-lg border-2 border-blue-500 bg-blue-50 p-4 sm:p-6 dark:bg-blue-900/20">
        <h3 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
          Quiz Complete
        </h3>
        <p className="mb-4 text-lg text-gray-800 sm:text-xl dark:text-gray-200">
          Your Score:{" "}
          <span className="font-bold text-blue-600 dark:text-blue-400">
            {score}
          </span>{" "}
          / {questions.length}
        </p>
        <div className="mb-6">
          <div className="h-4 w-full rounded-full bg-gray-300 dark:bg-gray-600">
            <div
              className="h-4 rounded-full bg-blue-600 transition-all"
              style={{ width: `${(score / questions.length) * 100}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {Math.round((score / questions.length) * 100)}% Correct
          </p>
        </div>

        <div className="mb-6 max-h-96 overflow-y-auto">
          <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">
            Review Answers:
          </h4>
          {answeredQuestions.map((item, index) => (
            <div
              key={index}
              className={`mb-2 rounded p-3 ${item.isCorrect ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"}`}
            >
              <p className="mb-1 break-words font-medium text-gray-900 dark:text-white">
                Q{index + 1}: {item.question}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Your answer: {questions[index].options[item.selectedAnswer]}
                {!item.isCorrect && (
                  <span className="mt-1 block text-green-600 dark:text-green-400">
                    Correct: {questions[index].options[item.correctAnswer]}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={resetQuiz}
          className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Retry Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="mb-8 rounded-lg border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 dark:border-blue-400 dark:from-blue-900/20 dark:to-indigo-900/20">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-bold text-gray-900 sm:text-xl dark:text-white">
          Quick Quiz
        </h3>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Question {currentQuestion + 1} / {questions.length}
        </span>
      </div>

      <div className="mb-6">
        <div className="mb-4 h-2 w-full rounded-full bg-gray-300 dark:bg-gray-600">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all dark:bg-blue-400"
            style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
          ></div>
        </div>

        <p className="mb-6 break-words text-base font-medium text-gray-900 sm:text-lg dark:text-white">
          {question.question}
        </p>

        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correctAnswer;
            const showAnswer = selectedAnswer !== null;

            let buttonClass =
              "w-full rounded-lg border-2 p-4 text-left transition-all ";

            if (!showAnswer) {
              buttonClass +=
                "border-gray-300 bg-white hover:border-blue-500 hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-blue-400 dark:hover:bg-blue-900/30";
            } else if (isCorrect) {
              buttonClass +=
                "border-green-500 bg-green-100 dark:bg-green-900/30";
            } else if (isSelected) {
              buttonClass += "border-red-500 bg-red-100 dark:bg-red-900/30";
            } else {
              buttonClass +=
                "border-gray-300 bg-gray-100 opacity-50 dark:border-gray-600 dark:bg-gray-700";
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                className={buttonClass}
              >
                <div className="flex items-start">
                  <span className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="break-words text-gray-900 dark:text-gray-100">
                    {option}
                  </span>
                  {showAnswer && isCorrect && (
                    <span className="ml-auto text-green-600 dark:text-green-400">
                      OK
                    </span>
                  )}
                  {showAnswer && isSelected && !isCorrect && (
                    <span className="ml-auto text-red-600 dark:text-red-400">
                      X
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {selectedAnswer !== null && (
          <div
            className={`mt-4 rounded-lg border p-4 ${selectedAnswer === question.correctAnswer ? "border-green-500 bg-green-100 dark:bg-green-900/30" : "border-red-500 bg-red-100 dark:bg-red-900/30"}`}
          >
            <p className="mb-2 font-semibold text-gray-900 dark:text-white">
              {selectedAnswer === question.correctAnswer
                ? "Correct"
                : "Incorrect"}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {question.explanation}
            </p>
          </div>
        )}
      </div>

      {selectedAnswer !== null && (
        <button
          onClick={nextQuestion}
          className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {currentQuestion < questions.length - 1
            ? "Next Question"
            : "View Results"}
        </button>
      )}
    </div>
  );
}
