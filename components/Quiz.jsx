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
    if (selectedAnswer !== null) return; // Already answered

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
      <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 rounded-lg p-6 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Quiz Complete! 🎉
        </h3>
        <p className="text-xl text-gray-800 dark:text-gray-200 mb-4">
          Your Score:{" "}
          <span className="font-bold text-blue-600 dark:text-blue-400">
            {score}
          </span>{" "}
          / {questions.length}
        </p>
        <div className="mb-6">
          <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all"
              style={{ width: `${(score / questions.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {Math.round((score / questions.length) * 100)}% Correct
          </p>
        </div>

        <div className="mb-6 max-h-96 overflow-y-auto">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Review Answers:
          </h4>
          {answeredQuestions.map((item, index) => (
            <div
              key={index}
              className={`p-3 rounded mb-2 ${item.isCorrect ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"}`}
            >
              <p className="font-medium text-gray-900 dark:text-white mb-1">
                Q{index + 1}: {item.question}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Your answer: {questions[index].options[item.selectedAnswer]}
                {!item.isCorrect && (
                  <span className="block text-green-600 dark:text-green-400 mt-1">
                    Correct: {questions[index].options[item.correctAnswer]}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={resetQuiz}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Retry Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-500 dark:border-blue-400 rounded-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          📝 Quick Quiz
        </h3>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Question {currentQuestion + 1} / {questions.length}
        </span>
      </div>

      <div className="mb-6">
        <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2 mb-4">
          <div
            className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all"
            style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
          ></div>
        </div>

        <p className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          {question.question}
        </p>

        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correctAnswer;
            const showAnswer = selectedAnswer !== null;

            let buttonClass =
              "w-full text-left p-4 rounded-lg border-2 transition-all ";

            if (!showAnswer) {
              buttonClass +=
                "border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30";
            } else if (isCorrect) {
              buttonClass +=
                "border-green-500 bg-green-100 dark:bg-green-900/30";
            } else if (isSelected) {
              buttonClass += "border-red-500 bg-red-100 dark:bg-red-900/30";
            } else {
              buttonClass +=
                "border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 opacity-50";
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                className={buttonClass}
              >
                <div className="flex items-center">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold mr-3">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {option}
                  </span>
                  {showAnswer && isCorrect && (
                    <span className="ml-auto text-green-600 dark:text-green-400">
                      ✓
                    </span>
                  )}
                  {showAnswer && isSelected && !isCorrect && (
                    <span className="ml-auto text-red-600 dark:text-red-400">
                      ✗
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {selectedAnswer !== null && (
          <div
            className={`mt-4 p-4 rounded-lg ${selectedAnswer === question.correctAnswer ? "bg-green-100 dark:bg-green-900/30 border border-green-500" : "bg-red-100 dark:bg-red-900/30 border border-red-500"}`}
          >
            <p className="font-semibold text-gray-900 dark:text-white mb-2">
              {selectedAnswer === question.correctAnswer
                ? "✓ Correct!"
                : "✗ Incorrect"}
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
          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {currentQuestion < questions.length - 1
            ? "Next Question →"
            : "View Results"}
        </button>
      )}
    </div>
  );
}
