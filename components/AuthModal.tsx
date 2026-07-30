"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { closeModal } from "@/store/modalSlice";

export default function AuthModal() {
  const { open, mode } = useSelector((s: RootState) => s.modal);
  const dispatch = useDispatch();

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        
        {/* Close button */}
        <button
          className="absolute right-4 top-4 text-xl"
          onClick={() => dispatch(closeModal())}
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-4">
          {mode === "login" ? "Log in to Summarist" : "Sign up to Summarist"}
        </h2>

        {/* Step 3.2 UI will go here */}
      </div>
    </div>
  );
}
