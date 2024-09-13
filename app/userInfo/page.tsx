"use client";
import React, { useEffect, useState } from "react";
import { getAuth, signOut, onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import app from "../../config.js";

function UserInfo() {
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

  const handleBack = () => {
    try {
      router.push("/home");
    } catch (error: any) {
      console.error("Error navigating back:", error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="mb-4">
          <img
            src={user?.photoURL || "default-profile.png"}
            alt="User"
            className="w-24 h-24 rounded-full border-4 border-blue-500 mx-auto"
            onError={(e) => {
              e.currentTarget.src = "default-profile.png"; // Replace with a default image path
            }}
          />
        </div>
        <h1 className="text-2xl font-bold mb-4">
          This is Dashboard, {user ? user.displayName : "Guest"}!
        </h1>
        <p className="text-lg mb-4">
          Email: {user ? user.email : "Not available"}
        </p>
        <button
          onClick={handleLogout}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded mb-2"
        >
          Logout
        </button>
        <br />
        <button
          onClick={handleBack}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default UserInfo;
