"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const Home = () => {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<string | undefined>(undefined);

  const navUserInfo = () => {
    try {
      router.push("/userInfo");
    } catch (error: any) {
      console.error("Error navigating:", error.message);
    }
  };

  const navToQuiz = (selectedDifficulty: string) => {
    try {
      router.push(`/quiz?difficulty=${selectedDifficulty}`);
    } catch (error: any) {
      console.error("Error navigating:", error.message);
    }
  };

  return (
    <>
      <div>
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
          onClick={navUserInfo}
        >
          Go to User Info
        </button>
      </div>

      <div className="space-x-5">
        <button
          type="button"
          className="bg-red-500 hover:bg-orange-700 text-white font-bold py-2 px-4 border border-yellow-700 rounded"
          onClick={() => navToQuiz("easy")}
        >
          Easy
        </button>
        <button
          type="button"
          className="bg-red-500 hover:bg-orange-700 text-white font-bold py-2 px-4 border border-yellow-700 rounded"
          onClick={() => navToQuiz("medium")}
        >
          Medium
        </button>
        <button
          type="button"
          className="bg-red-500 hover:bg-orange-700 text-white font-bold py-2 px-4 border border-yellow-700 rounded"
          onClick={() => navToQuiz("hard")}
        >
          Hard
        </button>
      </div>
    </>
  );
};

export default Home;
