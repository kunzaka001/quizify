import axios from 'axios';

const API_URL = 'https://opentdb.com/api.php';

export const fetchQuestions = async (amount: number, difficulty: string | null) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        amount,
        difficulty,
        category: 9,
        type: 'multiple',
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};
