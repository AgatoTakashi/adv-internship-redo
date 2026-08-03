"use client";

import { useEffect, useState } from "react";
import { Book } from "@/types/Book";
import BookCard from "./BookCard";
import { BookCardSkeleton } from "./Skeleton";

export default function BookList({
  title,
  subtitle,
  status,
  variant = "grid",
}: {
  title: string;
  subtitle: string;
  status: "recommended" | "suggested";
  variant?: "grid" | "horizontal";
}) {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
  }, [status]);

  if (isLoading) {
    return (
      <section className="">
        <div className="mx-auto max-w-[1070px] px-6">
          <h2 className="text-[22px] font-semibold text-[#032b41]">{title}</h2>
          <p className="mb-6 font-light">{subtitle}</p>
          <BookCardSkeleton count={4} />
        </div>
      </section>
    );
  }

  if (!books.length) return null;

  return (
    <section className="">
      <div className="max-w-[1070px] mx-auto px-6">
        <h2 className="text-[22px] font-semibold text-[#032b41]">
          {title}
        </h2>
        <p className="font-light mb-6">{subtitle}</p>

        {variant === "horizontal" ? (
          <div className="flex overflow-hidden">
            {books.slice(0, 5).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="flex overflow-hidden">
            {books.slice(0, 5).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
