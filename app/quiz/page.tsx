"use client";

import { useState, useEffect } from "react";
import { fetchQuestions } from "../lib/fetchQuestions";
import { useRouter } from "next/navigation";

// Define the type for a single question
interface Question {
  question: string;
  correct_answer: string;
  answers: Record<string, string>; // This defines answers as an object with string keys and string values
}

const Quiz = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(5);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [showPage, setShowPage] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // Load questions when the component mounts
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const questionsData = await fetchQuestions();
        // Ensure answers are shuffled here (done in fetchQuestions)
        setQuestions(questionsData); // Set fetched questions directly
      } catch (error) {
        console.error("Error loading questions:", error);
      }
    };
    loadQuestions();
  }, []);

  // Handle the countdown timer before showing the first question
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
      setShowPage(true); // Show the quiz page after countdown
      setTimer(5); // Reset the timer for the first question
    };

    countdownTimer();
  }, [countdown]);

  // Handle the timer countdown for each question
  useEffect(() => {
    if (showPage && timer > 0 && !isAnswerVisible) {
      const timerId = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timer === 0) {
      setIsAnswerVisible(true); // Show correct answer when timer ends
    }
  }, [timer, showPage, isAnswerVisible]);

  // Handle user's answer selection
  const handleAnswer = (answer: string) => {
    if (isAnswerVisible) return;

    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.correct_answer;

    if (answer === correctAnswer) {
      setScore(score + 1); // Increase score if correct
    }

    setUserAnswer(answer); // Store selected answer
    setIsAnswerVisible(true); // Show feedback
  };

  // Proceed to the next question
  const handleNextQuestion = () => {
    setIsAnswerVisible(false);
    setUserAnswer(null);
    setTimer(5);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  // Navigate to the home page when quiz is finished
  const navHome = () => {
    router.push("/home");
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
                  {Object.entries(questions[currentQuestionIndex].answers).map(
                    ([key, answer]) => (
                      <button
                        key={key}
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
              <p className="text-lg font-medium text-stone-950 mt-4">
                Time Left: {timer}
              </p>
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
