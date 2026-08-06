"use client";

import { useEffect, useState } from "react";
import { Book } from "@/types/Book";
import BookCard from "./BookCard";
import { BookCardSkeleton } from "./Skeleton";

export default function BookList({
  title,
  status,
  books: providedBooks,
}: {
  title: string;
  status: "recommended" | "suggested";
  books?: Book[];
}) {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (providedBooks) {
      setBooks(providedBooks);
      setIsLoading(false);
      return;
    }

    let isActive = true;

    const loadBooks = async () => {
      setIsLoading(true);

      try {
        const res = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBooks?status=${status}`,
          { cache: "no-store" }
        );

        const data = (await res.json()) as Book[];

        if (isActive) {
          setBooks(Array.isArray(data) ? data : []);
        }
      } catch {
        if (isActive) {
          setBooks([]);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadBooks();

    return () => {
      isActive = false;
    };
  }, [providedBooks, status]);

  if (isLoading) {
    return (
      <section>
        <div className="mx-auto max-w-[1070px] px-6">
          <h2 className="text-[22px] font-semibold text-[#032b41]">{title}</h2>
          <BookCardSkeleton count={4} />
        </div>
      </section>
    );
  }

  if (!books.length) {
    return (
      <section>
        <div className="mx-auto max-w-[1070px] px-6">
          <div className="mb-2 flex items-center gap-2">
            <h2 className="text-[22px] font-semibold text-[#032b41]">{title}</h2>
          </div>
          <p className="mb-6 font-light text-slate-500">
            No books yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="max-w-[1070px] mx-auto px-6">
        <div className="mb-2 flex items-center gap-2">
          <h2 className="text-[22px] font-semibold text-[#032b41]">{title}</h2>
        </div>
        <p className="font-light mb-6">
          {books.length} {books.length === 1 ? "book" : "books"}
        </p>

        <div className="flex flex-wrap gap-4 whitespace-nowrap pb-2">
          {books.slice(0, 5).map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
}
