"use client";

import { useState, useEffect } from "react";
import { fetchQuestions } from "../lib/fetchQuestions"; // Adjust path if necessary
import { getDatabase, ref, set, get } from "firebase/database";
import { getAuth, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import app from "../../config.js";

const Quiz = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(5);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [showPage, setShowPage] = useState(false);

  // Shuffle function
  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };

  // Load difficulty from URL query parameters
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const difficultyParam = query.get("difficulty");
    setDifficulty(difficultyParam);
  }, []);

  // Load questions when difficulty is set
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const difficultyValue = difficulty || "easy";
        const questionsData = await fetchQuestions(10, difficultyValue); // Fetch 10 questions

        // Shuffle answers for each question
        const shuffledQuestions = questionsData.map((question: any) => {
          const allAnswers = [
            ...question.incorrect_answers,
            question.correct_answer,
          ];
          return {
            ...question,
            answers: shuffleArray(allAnswers),
          };
        });

        setQuestions(shuffledQuestions);
      } catch (error) {
        console.error("Error loading questions:", error);
      }
    };

    if (difficulty !== null) {
      loadQuestions();
    }
  }, [difficulty]);

  // Countdown timer before starting the quiz
  useEffect(() => {
    const countdownTimer = async () => {
      while (countdown > 0) {
        await new Promise<void>((resolve) => {
          const timerId = setTimeout(() => {
            setCountdown((prev) => {
              if (prev === 1) resolve();
              return prev - 1;
            });
          }, 1000);
        });
      }
      setShowPage(true); // Show the quiz page after countdown ends
      setTimer(5); // Start the timer for the first question
    };

    if (difficulty !== null) {
      countdownTimer();
    }
  }, [countdown, difficulty]);

  // Timer for each question
  useEffect(() => {
    if (showPage && timer > 0 && !isAnswerVisible) {
      const timerId = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timer === 0) {
      setIsAnswerVisible(true);
    }
  }, [timer, showPage, isAnswerVisible]);

  const handleAnswer = (answer: string) => {
    if (isAnswerVisible) return; // Prevent answering if the timer has run out

    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.correct_answer;
    if (answer === correctAnswer) {
      setScore(score + 1);
    }

    setUserAnswer(answer);
    setIsAnswerVisible(true);
  };

  const handleNextQuestion = () => {
    setIsAnswerVisible(false);
    setUserAnswer(null);
    setTimer(5); // Reset timer for the next question
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 p-4">
      {!showPage ? (
        <div className="text-6xl font-extrabold animate-pulse text-blue-600">
          {countdown}
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
          {questions.length > 0 && currentQuestionIndex < questions.length ? (
            <div className="space-y-6">
              <div className="question">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {questions[currentQuestionIndex].question}
                </h2>
                <div className="space-y-2 mt-4">
                  {questions[currentQuestionIndex].answers.map(
                    (answer: string) => (
                      <button
                        key={answer}
                        onClick={() => handleAnswer(answer)}
                        className={`w-full p-3 rounded-lg transition-colors duration-300 ${
                          userAnswer === answer
                            ? questions[currentQuestionIndex].correct_answer ===
                              answer
                              ? "bg-green-500"
                              : "bg-red-500"
                            : "bg-blue-400 hover:bg-blue-500"
                        } text-white font-medium`}
                      >
                        {answer}
                      </button>
                    )
                  )}
                </div>
              </div>

              {isAnswerVisible && (
                <div className="mt-4">
                  <p
                    className={`text-lg font-semibold ${
                      userAnswer ===
                      questions[currentQuestionIndex].correct_answer
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {userAnswer ===
                    questions[currentQuestionIndex].correct_answer
                      ? "Correct!"
                      : `Incorrect! The correct answer is ${questions[currentQuestionIndex].correct_answer}`}
                  </p>
                  <button
                    onClick={handleNextQuestion}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                  >
                    Next Question
                  </button>
                </div>
              )}
              <p className="text-lg font-medium mt-4">Time Left: {timer}</p>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800">
                Quiz Finished
              </h2>
              <p className="text-xl font-medium mt-2">Your score: {score}</p>
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                //onClick={}
              >
                Finish
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
