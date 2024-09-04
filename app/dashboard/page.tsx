"use client";
import React, { useEffect, useState } from "react";
import { getAuth, signOut, onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import app from "../../config.js";

function Dashboard() {
  const auth = getAuth(app);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error: any) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <div className="">
      <div className="">
        <h1 className="">
          This is Dashboard, {user ? user.displayName : "Guest"}!
        </h1>
        <button onClick={handleLogout} className="">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
