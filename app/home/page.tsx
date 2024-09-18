"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAuth,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import Card from "../components/card.tsx";
import app from "../../config.js";

const Home = () => {
  const router = useRouter();
  const auth = getAuth(app);
  const db = getDatabase(app);

  const [difficulty, setDifficulty] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<{
    username: string;
    photoURL?: string;
  } | null>(null);

  useEffect(() => {
    // Set authentication persistence
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        // Monitor authentication state
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            const userId = user.uid;
            const userRef = ref(db, `users/${userId}`);
            onValue(userRef, (snapshot) => {
              const data = snapshot.val();
              if (data) {
                setUser({
                  username: data.username,
                  photoURL: data.profile_picture, // Assuming profile_picture is stored here
                });
              }
            });
          } else {
            router.push("/");
          }
        });

        return () => unsubscribe();
      })
      .catch((error) => {
        console.error("Error setting persistence:", error.message);
      });
  }, [auth, db, router]);

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
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-end p-4 space-x-3">
        {user ? (
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={navUserInfo}
          >
            <img
              src={user.photoURL || "default-profile.png"}
              alt="User"
              className="w-12 h-12 rounded-full border-2 border-blue-500"
              onError={(e) => {
                e.currentTarget.src = "default-profile.png"; // Replace with a default image path
              }}
            />
            <span className="text-lg font-semibold text-gray-800">
              {user.username}
            </span>
          </div>
        ) : (
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={navUserInfo}
          >
            <img
              src="default-profile.png"
              alt="User"
              className="w-12 h-12 rounded-full border-2 border-blue-500"
            />
            <span className="text-lg font-semibold text-gray-800">
              Username
            </span>
          </div>
        )}
      </div>
      <div className="flex justify-center items-center flex-grow">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card
            title="Easy"
            des="An Easy mode general knowledge trivia. Isn't this too easy?"
            buttext="Let Go!"
            onButtonClick={() => navToQuiz("easy")}
            difficulty="easy"
          />
          <Card
            title="Medium"
            des="A little harder than Easy mode. Don't you think?"
            buttext="Let Go!"
            onButtonClick={() => navToQuiz("medium")}
            difficulty="medium"
          />
          <Card
            title="Hard"
            des="Do you think you could pass this?"
            buttext="Let Go!"
            onButtonClick={() => navToQuiz("hard")}
            difficulty="hard"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
