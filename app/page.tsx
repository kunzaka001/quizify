"use client";
import { useState, useEffect } from "react";
import app from "../config.js";
import { getAuth, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";

import { ArrowDownRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import quizifyLogo from "./assets/q.png";

import {
  BarChartHorizontal,
  BatteryCharging,
  CircleHelp,
  Layers,
  WandSparkles,
  ZoomIn,
} from "lucide-react";

const Landing = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        router.push("/home");
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

  const reasons = [
    {
      title: "Topic-Based Quizzes",
      description:
        "Choose from a range of development topics like web development, data science, and cybersecurity, tailored for developers at all skill levels to sharpen their expertise.",
      icon: <ZoomIn className="size-6" />,
    },
    {
      title: "Global Leaderboards",
      description:
        "Compete with developers worldwide and see where you stand. Track your progress, compare scores, and strive for the top in your favorite topics.",
      icon: <BarChartHorizontal className="size-6" />,
    },
    {
      title: "Difficulty Adjustment",
      description:
        "Increase or decrease in difficulty based on your knowledge, And improved more..",
      icon: <CircleHelp className="size-6" />,
    },
    {
      title: "Timed Quiz",
      description:
        "Challenge yourself with fast-paced, tech-focused questions that push your knowledge and speed. Perfect for testing your expertise in a high-stakes environment!?",
      icon: <WandSparkles className="size-6" />,
    },
    {
      title: "NULL",
      description: "NULL",
      icon: <Layers className="size-6" />,
    },
    {
      title: "NULL",
      description: "NULL",
      icon: <BatteryCharging className="size-6" />,
    },
  ];

  return (
    <>
      <section className="flex justify-center items-center py-32">
        <div className="container flex justify-center items-center">
          <div className="grid items-center gap-8 lg:grid-cols-2 justify-center">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <Badge variant="outline">
                New Release
                <ArrowDownRight className="ml-2 size-4" />
              </Badge>
              <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl">
                Quizify for Developers: Test and Elevate Your Tech Skills
              </h1>
              <p className="mb-8 max-w-xl text-muted-foreground lg:text-xl">
                Boost your tech skills with Quizify for Devs—an interactive quiz
                platform designed for developers. Tackle questions on coding,
                tech trivia, and best practices to learn, practice, and stay
                sharp.
              </p>
              <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
                <Button
                  className="w-full jello-vertical sm:w-auto"
                  onClick={signInWithGoogle}
                >
                  Dive In!
                </Button>
                <Button
                  variant="outline"
                  className="w-full jello-vertical sm:w-auto"
                >
                  Github
                  <ArrowDownRight className="ml-2 size-4" />
                </Button>
              </div>
            </div>
            <div className="rotate-in-center">
              <Image
                src={quizifyLogo}
                alt="Quizify Logo"
                className="max-h-96 w-full rounded-md object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="flex justify-center items-center py-32">
        <div className="container">
          <div className="mb-10 md:mb-20">
            <h2 className="mb-2 text-center text-3xl font-semibold lg:text-5xl">
              Features
            </h2>
          </div>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {reasons.map((reason, i) => (
              <div key={i} className="flex flex-col">
                <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-accent">
                  {reason.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{reason.title}</h3>
                <p className="text-muted-foreground">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Landing;
