import axios from "axios";

const API_URL = "https://quizapi.io/api/v1/questions";

export const fetchQuestions = async () => {
  // Function to shuffle an array
  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };

  try {
    const response = await axios.get(API_URL, {
      params: {
        apiKey: "IcdUTC8z76KTQKO34ntmrLXp53Wfh9PPlxBsRkHl",
        limit: 10,
        category: "react",
        difficulty: "Easy",
      },
    });

    // Map through the questions and shuffle answers
    const questions = response.data.map((question: any) => {
      // Create an array of the answer options (a, b, c, d)
      const answers = [
        { key: "a", answer: question.answers.answer_a },
        { key: "b", answer: question.answers.answer_b },
        { key: "c", answer: question.answers.answer_c },
        { key: "d", answer: question.answers.answer_d },
      ];

      // Shuffle the answers
      const shuffledAnswers = shuffleArray(answers);

      // Determine the correct answer (e.g., 'answer_a', 'answer_b', etc.)
      const findCorrectAnswer = Object.keys(question.correct_answers).find(
        (key) => question.correct_answers[key] === "true"
      );

      let correctAns: string;
      if (findCorrectAnswer === "answer_a_correct") {
        correctAns = question.answers.answer_a;
      } else if (findCorrectAnswer === "answer_b_correct") {
        correctAns = question.answers.answer_b;
      } else if (findCorrectAnswer === "answer_c_correct") {
        correctAns = question.answers.answer_c;
      } else if (findCorrectAnswer === "answer_d_correct") {
        correctAns = question.answers.answer_d;
      } else {
        // If no match found, set a default answer or handle the case
        correctAns = "No valid answer found"; // or leave as empty string, e.g., ''
      }

      // Create a new object with shuffled answers and real answer text as correct_answer
      const shuffledQuestion = {
        question: question.question,
        answers: shuffledAnswers.reduce((acc, { key, answer }) => {
          acc[key] = answer;
          return acc;
        }, {}),
        correct_answer: correctAns,
      };

      return shuffledQuestion;
    });

    return questions;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};
