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
import app from "../../config.js";

import CategorySelectCard from "../components/categoryCard"

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
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            const userId = user.uid;
            const userRef = ref(db, `users/${userId}`);
            onValue(userRef, (snapshot) => {
              const data = snapshot.val();
              if (data) {
                setUser({
                  username: data.username,
                  photoURL: data.profile_picture,
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
                e.currentTarget.src = "default-profile.png";
              }}
            />
            <span className="text-lg font-semibold text-white">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CategorySelectCard />
        </div>
      </div>
    </div>
  );
};

export default Home;
