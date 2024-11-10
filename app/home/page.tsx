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

import Image from "next/image";
import quizify_logo from "../assets/q.png";

import HomeCard from "../components/homeCard.tsx";
import { fetchQuestions } from "../lib/fetchQuestions.ts";
import { Button } from "@/components/ui/button.tsx";

const Home = () => {
  const router = useRouter();
  const auth = getAuth(app);
  const db = getDatabase(app);

  const [difficulty, setDifficulty] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<{
    username: string;
    //photoURL?: string;
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
                  //photoURL: data.profile_picture,
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

  const navToQuiz = () => {
    try {
      router.push(`/quizselect`);
    } catch (error: any) {
      console.error("Error navigating:", error.message);
    }
  };

  const test = async () => {
    try {
      const quizes = await fetchQuestions();
      console.log(quizes);
    } catch (error: any) {
      console.error(error.message);
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
              //src={user.photoURL || "default-profile.png"}
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
      <div className="container mx-auto flex px-5 py-10 items-center justify-center flex-col">
        <Image
          className="w-4/6 md:w-3/6 lg:w-2/6 mb-4 object-cover object-center rounded"
          alt="hero"
          src={quizify_logo}
        />
        <div className="text-center lg:w-2/3 w-full">
          <p className="mb-8 leading-relaxed">
            Meggings kinfolk echo park stumptown DIY, kale chips beard jianbing
            tousled. Chambray dreamcatcher trust fund, kitsch vice godard
            disrupt ramps hexagon mustache umami snackwave tilde chillwave ugh.
            Pour-over meditation PBR&amp;B pickled ennui celiac mlkshk freegan
            photo booth af fingerstache pitchfork.
          </p>
          <div className="flex justify-center">
            <Button className="text-lg" onClick={navToQuiz}>
              Play
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
