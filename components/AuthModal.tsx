"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { closeModal } from "@/store/modalSlice";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, googleProvider } from "@/app/firebase/client";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import Image from "next/image";
import google from "@/assets/google.png"
import { FaUser } from "react-icons/fa";

export default function AuthModal() {
  const { open, mode } = useSelector((s: RootState) => s.modal);
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (!open) return null;

  const handleSubmit = async () => {
    setErrorMessage("");

    if (!auth) {
      setErrorMessage("Firebase authentication is not configured.");
      return;
    }

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
    } catch (error) {
      if (error instanceof FirebaseError) {
        const message = error.message || "Firebase authentication failed.";
        setErrorMessage(message);
      } else {
        setErrorMessage("Unable to sign in right now. Please try again.");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage("");

    if (!auth) {
      setErrorMessage("Firebase authentication is not configured.");
      return;
    }

    try {
      await signInWithPopup(auth, googleProvider);
      dispatch(closeModal());

      if (window.location.pathname === "/") {
        router.push("/for-you");
      }
    } catch (err) {
      if (err instanceof FirebaseError) {
        const message = err.message || "Firebase authentication failed.";
        setErrorMessage(message);
        console.error("Firebase auth error:", message);
      } else {
        setErrorMessage("Unable to sign in with Google right now.");
      }
    }
  };

  const handleGuestSignIn = async () => {
    setErrorMessage("");

    if (!auth) {
      setErrorMessage("Firebase authentication is not configured.");
      return;
    }

    try {
      await signInAnonymously(auth);
      dispatch(closeModal());

      if (window.location.pathname === "/") {
        router.push("/for-you");
      }
    } catch (err) {
      if (err instanceof FirebaseError) {
        const message = err.message || "Firebase authentication failed.";
        setErrorMessage(message);
        console.error("Firebase auth error:", message);
      } else {
        setErrorMessage("Unable to continue as guest right now.");
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-xl p-8 w-full max-w-md shadow-lg relative"
        onKeyDown={handleKeyDown}
      >
        <button
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 text-xl"
          onClick={() => dispatch(closeModal())}
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold text-[#032b41] mb-6 text-center">
          {mode === "login" ? "Log in to Summarist" : "Sign up to Summarist"}
        </h2>

        {mode === "login" ? (<>
        <button
          className="relative border border-gray-300 text-white w-full py-2 rounded-lg text-lg font-semibold transition hover:bg-gray-50 bg-[#3a579d]"
          onClick={handleGuestSignIn}
        >
        <FaUser className="absolute left-1 top-2 text-[32px]" /> Login as a Guest
        </button>

        <div className="auth__separator">
          <span className="auth__seperator--text">or</span>
        </div></>) : null}

        <button
          className="relative border border-gray-300 text-white w-full py-2 rounded-lg text-lg font-semibold transition hover:bg-gray-50 bg-[#4285f4]"
          onClick={handleGoogleSignIn}
        >
        <Image src={google} alt="google logo" width={24} className="absolute left-1 top-1 bg-white w-[36px] p-1 rounded" />  {mode === "login" ? ("Login with Google") : ("Sign up with Google")}
        </button>

        <div className="auth__separator">
          <span className="auth__seperator--text">or</span>
        </div>

        <div className="flex flex-col gap-4">
          {errorMessage ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}
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
            className="bg-[#2bd97c] hover:bg-[#25c46f] text-black py-3 rounded-lg text-lg transition"
            onClick={handleSubmit}
          >
            {mode === "login" ? "Login" : "Create Account"}
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
