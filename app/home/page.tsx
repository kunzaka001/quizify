"use client";

import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  const navUserInfo = () => {
    try {
      router.push("/userInfo");
    } catch (error: any) {
      console.error("Error navigating:", error.message);
    }
  };

  return (
    <div>
      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
        onClick={navUserInfo}
      >
        Go to User Info
      </button>
    </div>
  );
};

export default Home;
