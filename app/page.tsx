"use client";
import { useState, useEffect } from "react";
import app from "../config.js";
import { getAuth, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Dashboard from "./dashboard/page";

const Home = () => {
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

  const signInWithGoogle = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error signing in with Google:", error.message);
    }
  };

  return (
    <div className="flex">
      {user ? (
        <Dashboard />
      ) : (
        <button onClick={signInWithGoogle} className="">
          Sign in with Google
        </button>
      )}
    </div>
  );
};

export default Home;
