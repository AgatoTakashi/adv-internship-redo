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

function getAuthErrorMessage(code: string) {
  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/user-not-found":
      return "No account found with that email.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/email-already-in-use":
      return "That email is already registered. Please log in instead.";
    case "auth/weak-password":
      return "Please choose a stronger password with at least 6 characters.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was canceled.";
    case "auth/popup-blocked":
      return "The popup was blocked. Please allow popups and try again.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection and try again.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    default:
      return "Unable to sign in right now. Please try again.";
  }
}

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
    } catch (err) {
      if (err instanceof FirebaseError) {
        setErrorMessage(getAuthErrorMessage(err.code));
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
        setErrorMessage(getAuthErrorMessage(err.code));
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
        setErrorMessage(getAuthErrorMessage(err.code));
      } else {
        setErrorMessage("Unable to continue as guest right now.");
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
            className="bg-[#2bd97c] hover:bg-[#25c46f] text-white py-3 rounded-lg text-lg font-semibold transition"
            onClick={handleSubmit}
          >
            {mode === "login" ? "Log In" : "Create Account"}
          </button>

          <button
            className="border border-gray-300 text-[#032b41] py-3 rounded-lg text-lg font-semibold transition hover:bg-gray-50"
            onClick={handleGoogleSignIn}
          >
            Continue with Google
          </button>

          <button
            className="border border-gray-300 text-[#032b41] py-3 rounded-lg text-lg font-semibold transition hover:bg-gray-50"
            onClick={handleGuestSignIn}
          >
            Continue as Guest
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
