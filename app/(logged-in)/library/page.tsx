"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { openModal } from "@/store/modalSlice";
import loginImage from "@/assets/login.png";
import { db } from "@/app/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import BookList from "@/components/BookList";
import { BookCardSkeleton } from "@/components/Skeleton";
import { Book } from "@/types/Book";

interface LibraryEntry {
  id: string;
  title?: string;
  author?: string;
  imageLink?: string;
  audioLink?: string;
  totalRating?: number;
  averageRating?: number;
  saved?: boolean;
  finished?: boolean;
}

export default function LibraryPage() {
  const currentUser = useSelector((state: RootState) => state.auth.user) as
    | { uid?: string; email?: string | null }
    | null;
  const dispatch = useDispatch();
  const [savedBooks, setSavedBooks] = useState<LibraryEntry[]>([]);
  const [finishedBooks, setFinishedBooks] = useState<LibraryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const hydrateLibraryEntry = async (entry: LibraryEntry): Promise<LibraryEntry> => {
    if (entry.averageRating !== undefined || entry.totalRating !== undefined) {
      return entry;
    }

    try {
      const response = await fetch(
        `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${entry.id}`,
        { cache: "no-store" }
      );
      const raw = await response.text();
      if (!raw) return entry;

      const parsedBook = JSON.parse(raw);
      return {
        ...entry,
        title: entry.title || parsedBook.title,
        author: entry.author || parsedBook.author,
        imageLink: entry.imageLink || parsedBook.imageLink,
        audioLink: entry.audioLink || parsedBook.audioLink,
        totalRating: parsedBook.totalRating ?? entry.totalRating ?? 0,
        averageRating: parsedBook.averageRating ?? entry.averageRating ?? 0,
      };
    } catch {
      return entry;
    }
  };

  useEffect(() => {
    const uid = currentUser?.uid;

    if (!uid || !db) {
      setSavedBooks([]);
      setFinishedBooks([]);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const loadLibrary = async () => {
      setIsLoading(true);

      if (!db) {
        if (isMounted) {
          setSavedBooks([]);
          setFinishedBooks([]);
          setIsLoading(false);
        }
        return;
      }

      try {
        const localKey = `summarist-library-${uid}`;
        const localLibrary = (() => {
          if (typeof window === "undefined") return {};
          try {
            const stored = window.localStorage.getItem(localKey);
            return stored ? JSON.parse(stored) : {};
          } catch {
            return {};
          }
        })();

        if (Object.keys(localLibrary).length) {
          const entries = Object.values(localLibrary) as LibraryEntry[];
          const hydratedEntries = await Promise.all(entries.map(hydrateLibraryEntry));
          if (!isMounted) return;

          setSavedBooks(hydratedEntries.filter((entry) => entry.saved !== false));
          setFinishedBooks(hydratedEntries.filter((entry) => entry.finished));
          return;
        }

        const userDocRef = doc(db, "users", uid);
        const userSnap = await getDoc(userDocRef);
        if (!isMounted) return;

        const library = (userSnap.data()?.library as Record<string, LibraryEntry> | undefined) || {};
        const entries = Object.values(library);
        const hydratedEntries = await Promise.all(entries.map(hydrateLibraryEntry));

        setSavedBooks(hydratedEntries.filter((entry) => entry.saved !== false));
        setFinishedBooks(hydratedEntries.filter((entry) => entry.finished));
      } catch {
        if (isMounted) {
          setSavedBooks([]);
          setFinishedBooks([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadLibrary();

    return () => {
      isMounted = false;
    };
  }, [currentUser?.uid]);

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

  const toBookCardModel = (book: LibraryEntry): Book => ({
    id: book.id,
    author: book.author || "Unknown author",
    title: book.title || "Untitled book",
    subTitle: "",
    imageLink: book.imageLink || "",
    audioLink: book.audioLink || "",
    totalRating: book.totalRating || 0,
    averageRating: book.averageRating || 0,
    keyIdeas: 0,
    type: "audio",
    status: "suggested",
    subscriptionRequired: false,
    summary: "",
    tags: [],
    bookDescription: "",
    authorDescription: "",
  });

  const savedCardBooks = savedBooks.slice(0, 5).map(toBookCardModel);
  const finishedCardBooks = finishedBooks.slice(0, 5).map(toBookCardModel);

  return (
    <div className="space-y-10">
      
      {isLoading ? (
        <div className="space-y-10">
          <section>
            <div className="max-w-[1070px] mx-auto px-6">
              <div className="mb-2 h-7 w-40 animate-pulse rounded bg-slate-200" />
              <div className="mb-6 h-5 w-56 animate-pulse rounded bg-slate-200" />
              <BookCardSkeleton count={5} />
            </div>
          </section>
          <section>
            <div className="max-w-[1070px] mx-auto px-6">
              <div className="mb-2 h-7 w-40 animate-pulse rounded bg-slate-200" />
              <div className="mb-6 h-5 w-56 animate-pulse rounded bg-slate-200" />
              <BookCardSkeleton count={5} />
            </div>
          </section>
        </div>
      ) : (
        <div className="space-y-10">
          <BookList title="Saved books" status="suggested" books={savedCardBooks} />
          <BookList title="Finished books" status="suggested" books={finishedCardBooks} />
        </div>
      )}
    </div>
  );
}
