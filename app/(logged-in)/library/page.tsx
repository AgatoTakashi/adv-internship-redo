"use client";

import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { openModal } from "@/store/modalSlice";
import loginImage from "@/assets/login.png";

export default function LibraryPage() {
  const currentUser = useSelector((state: RootState) => state.auth.user) as
    | { uid?: string; email?: string | null }
    | null;
  const dispatch = useDispatch();

  if (!currentUser) {
    return (
      <>
        <h1 className="text-[32px] font-semibold text-[#032b41] border-b border-gray-300 pb-[20px]">
          My Library
        </h1>
        <div className="max-w-[760px] mx-auto px-8 py-16 flex flex-col items-center text-center space-y-6">
          <Image src={loginImage} alt="Login illustration" width={460} height={317} priority />
          <div className="space-y-2">
            <h1 className="text-[28px] font-semibold text-[#032b41]">
              Log in to your account to see your library.
            </h1>
          </div>
          <button
            onClick={() => dispatch(openModal("login"))}
            className="bg-[#2bd97c] text-black px-6 py-3 rounded-md text-[16px] font-medium"
          >
            Login
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-[32px] font-semibold text-[#032b41] border-b border-gray-300 pb-[20px]">
        My Library
      </h1>
      <p className="text-gray-600">
        Your saved books will appear here once you start adding them to your library.
      </p>
    </div>
  );
}
