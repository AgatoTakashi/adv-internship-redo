"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Player from "@/components/Player";
import { RootState } from "@/store";
import { openModal } from "@/store/modalSlice";
import loginImage from "@/assets/login.png";

interface BookPageProps {
  params: Promise<{ id: string }>;
}

export default function PlayerPage({ params }: BookPageProps) {
  const currentUser = useSelector((state: RootState) => state.auth.user) as
    | { uid?: string; email?: string | null }
    | null;
  const dispatch = useDispatch();
  const [book, setBook] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadBook = async () => {
      try {
        const { id } = await params;
        if (!isMounted) return;

        const res = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`,
          { cache: "no-store" }
        );

        const raw = await res.text();
        if (!isMounted) return;

        if (!raw) {
          setBook(null);
          setError("The book data could not be loaded. Please try again later.");
          return;
        }

        setBook(JSON.parse(raw));
        setError(null);
      } catch {
        if (isMounted) {
          setBook(null);
          setError("The book data could not be loaded. Please try again later.");
        }
      }
    };

    loadBook();

    return () => {
      isMounted = false;
    };
  }, [params]);

  if (!currentUser) {
    return (
        <>
            <h1 className="text-[32px] font-semibold text-[#032b41] border-b border-gray-300 pb-[20px]">
                {book.title}
            </h1>
            <div className="max-w-[760px] mx-auto px-8 py-16 flex flex-col items-center text-center space-y-6">
                <Image src={loginImage} alt="Login illustration" width={460} height={317} priority />
                <div className="space-y-2">
                <h1 className="text-[28px] font-semibold text-[#032b41]">
                    Log in to your account to see your details.
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

  if (error || !book) {
    return (
      <div className="p-10 text-[#032b41]">
        <h1 className="text-[28px] font-semibold mb-4">Book not found</h1>
        <p className="text-[16px]">
          {error || "The book data could not be loaded. Please try again later."}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1070px] mx-auto px-8 py-10 space-y-12 mb-[80px]">
      <h1 className="text-[32px] font-semibold text-[#032b41] border-b border-gray-300 pb-[20px]">
        {book.title}
      </h1>
      <p className="whitespace-pre-line">{book.summary}</p>
      <Player id={book.id} />
    </div>
  );
}