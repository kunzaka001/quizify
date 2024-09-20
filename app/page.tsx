"use client";
import { useState, useEffect } from "react";
import app from "../config.js";
import { getAuth, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";

const Login = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const writeUserData = (
    userId: string,
    name: string,
    email: string,
    imageUrl: string,
    highScore: number
  ) => {
    const db = getDatabase(app);
    set(ref(db, "users/" + userId), {
      username: name,
      email: email,
      profile_picture: imageUrl,
      highScore: highScore,
    });
  };

  const signInWithGoogle = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userId = user.uid;
      const name = user.displayName || "";
      const email = user.email || "";
      const imageUrl = user.photoURL || "";
      const highScore = 0;

      const db = getDatabase(app);
      const userRef = ref(db, "users/" + userId);

      const snapshot = await get(userRef);
      if (!snapshot.exists()) {
        writeUserData(userId, name, email, imageUrl, highScore);
        console.log("First time login, user data written to the database.");
      } else {
        console.log("User already exists, navigating to the dashboard.");
      }

      localStorage.setItem("userId", userId);

      router.push("/home");
    } catch (error: any) {
      console.error("Error signing in with Google:", error.message);
    }
  };

  return (
    <div className="flex flex-col w-full md:w-1/2 xl:w-2/5 2xl:w-2/5 3xl:w-1/3 mx-auto p-8 md:p-10 2xl:p-12 3xl:p-14 bg-[#ffffff] rounded-2xl shadow-xl">
      <div className="flex flex-col justify-center mx-auto items-center gap-3 pb-4">
        <div>
          <img src="/q.png" width="400" alt="Quizify" />
        </div>
        <h1 className="text-3xl font-bold text-[#4B5563] text-[#4B5563] my-auto">
          Login
        </h1>
      </div>
      <div className="text-base font-light text-[#6B7280] pb-8 mx-auto">
        Login to your account Using google Auth.
      </div>

      <div className="relative flex py-8 items-center">
        <div className="flex-grow border-t border-[1px] border-gray-200"></div>{" "}
        <div className="flex-grow border-t border-[1px] border-gray-200"></div>
      </div>
      <form>
        <div className="flex flex-row gap-2 justify-center">
          <button
            type="button"
            onClick={signInWithGoogle}
            className="flex flex-row w-32 gap-2 bg-gray-600 p-2 rounded-md text-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-log-in"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" x2="3" y1="12" y2="12" />
            </svg>
            <span className="font-medium mx-auto">Google</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
