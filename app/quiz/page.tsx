"use client";

import { useState, useEffect } from "react";
import { fetchQuestions } from "../lib/fetchQuestions";
import { getDatabase, ref, set, get } from "firebase/database";
import { getAuth, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { decode } from "html-entities";

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

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const decodeText = (text: string | null) => {
    return text ? decode(text) : "";
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const difficultyParam = query.get("difficulty");
    setDifficulty(difficultyParam);
  }, []);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const difficultyValue = difficulty || "easy";
        console.log(difficultyValue);
        const questionsData = await fetchQuestions(10, difficultyValue);

        const shuffledQuestions = questionsData.map((question: any) => {
          const allAnswers = [
            ...question.incorrect_answers,
            question.correct_answer,
          ];
          return {
            ...question,
            question: decodeText(question.question),
            answers: shuffleArray(allAnswers.map(decodeText)),
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
      setShowPage(true);
      setTimer(5);
    };

    if (difficulty !== null) {
      countdownTimer();
    }
  }, [countdown, difficulty]);

  useEffect(() => {
    if (showPage && timer > 0 && !isAnswerVisible) {
      const timerId = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timer === 0) {
      setIsAnswerVisible(true);
    }
  }, [timer, showPage, isAnswerVisible]);

  const handleAnswer = (answer: string) => {
    if (isAnswerVisible) return;

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
    setTimer(5);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const navHome = () => {
    try {
      router.push("/home");
    } catch (error: any) {
      console.error("Error navigating:", error.message);
    }
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
                onClick={navHome}
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
