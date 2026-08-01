"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { closeModal } from "@/store/modalSlice";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase/client";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

export default function AuthModal() {
  const { open, mode } = useSelector((s: RootState) => s.modal);
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!open) return null;

  const handleSubmit = async () => {
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }

      dispatch(closeModal());

      if (window.location.pathname === "/") {
        router.push("/for-you");
      }
    } catch (err) {
        if (err instanceof FirebaseError) {
          console.error("Firebase Auth Error:", err.code, err.message);
        }
      }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-lg relative">
        <button
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 text-xl"
          onClick={() => dispatch(closeModal())}
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold text-[#032b41] mb-6 text-center">
          {mode === "login" ? "Log in to Summarist" : "Sign up to Summarist"}
        </h2>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#2bd97c]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#2bd97c]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="bg-[#2bd97c] hover:bg-[#25c46f] text-white py-3 rounded-lg text-lg font-semibold transition"
            onClick={handleSubmit}
          >
            {mode === "login" ? "Log In" : "Create Account"}
          </button>
        </div>

        <p className="text-center text-gray-600 mt-6">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <span
                className="text-[#2bd97c] font-semibold cursor-pointer"
                onClick={() =>
                  dispatch({ type: "modal/openModal", payload: "signup" })
                }
              >
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                className="text-[#2bd97c] font-semibold cursor-pointer"
                onClick={() =>
                  dispatch({ type: "modal/openModal", payload: "login" })
                }
              >
                Log in
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
